from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from PIL import Image

from tensorflow.keras.models import load_model, Model
from tensorflow.keras.applications.mobilenet_v2 import preprocess_input

import tensorflow as tf
import numpy as np
import cv2
import uuid
import os


# ============================================================
# APP
# ============================================================

app = FastAPI(
    title="MediScan AI"
)


# ============================================================
# CORS
# ============================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# DIRECTORIES
# ============================================================

BASE_DIR = os.path.dirname(
    os.path.abspath(__file__)
)

UPLOAD_DIR = os.path.join(
    BASE_DIR,
    "uploads"
)

REPORT_DIR = os.path.join(
    BASE_DIR,
    "reports"
)

MODEL_PATH = os.path.join(
    BASE_DIR,
    "pneumonia_model.keras"
)


os.makedirs(
    UPLOAD_DIR,
    exist_ok=True
)

os.makedirs(
    REPORT_DIR,
    exist_ok=True
)


# ============================================================
# STATIC FILES
# ============================================================

app.mount(
    "/uploads",
    StaticFiles(
        directory=UPLOAD_DIR
    ),
    name="uploads"
)

app.mount(
    "/reports",
    StaticFiles(
        directory=REPORT_DIR
    ),
    name="reports"
)


# ============================================================
# LOAD MODEL
# ============================================================

print("Loading MediScan AI model...")

model = load_model(
    MODEL_PATH,
    compile=False
)

print("MediScan AI model loaded.")

print(
    "Model input:",
    model.input_shape
)

print(
    "Model output:",
    model.output_shape
)


# ============================================================
# GRAD-CAM MODEL
# ============================================================

LAST_CONV_LAYER = "Conv_1"

print(
    "Preparing Grad-CAM..."
)

grad_model = Model(
    inputs=model.inputs,
    outputs=[
        model.get_layer(
            LAST_CONV_LAYER
        ).output,
        model.output
    ]
)

print(
    "Grad-CAM ready."
)


# ============================================================
# GRAD-CAM
# ============================================================

def generate_gradcam(
    image_array,
    original_path,
    save_path,
    pneumonia_probability
):

    # --------------------------------------------------------
    # MODEL FORWARD PASS
    # --------------------------------------------------------

    with tf.GradientTape() as tape:

        conv_outputs, predictions = grad_model(
            image_array,
            training=False
        )

        pneumonia_score = predictions[:, 0]

        normal_score = (
            1.0 -
            pneumonia_score
        )

        if pneumonia_probability >= 0.5:

            target_score = pneumonia_score

        else:

            target_score = normal_score


    # --------------------------------------------------------
    # GRADIENTS
    # --------------------------------------------------------

    gradients = tape.gradient(
        target_score,
        conv_outputs
    )

    if gradients is None:

        raise RuntimeError(
            "Unable to calculate Grad-CAM gradients."
        )


    # --------------------------------------------------------
    # GLOBAL AVERAGE POOLING
    # --------------------------------------------------------

    pooled_gradients = tf.reduce_mean(
        gradients,
        axis=(0, 1, 2)
    )


    # --------------------------------------------------------
    # REMOVE BATCH DIMENSION
    # --------------------------------------------------------

    conv_outputs = conv_outputs[0]


    # --------------------------------------------------------
    # WEIGHT FEATURE MAPS
    # --------------------------------------------------------

    heatmap = tf.reduce_sum(
        conv_outputs *
        pooled_gradients,
        axis=-1
    )


    # --------------------------------------------------------
    # KEEP POSITIVE ACTIVATIONS
    # --------------------------------------------------------

    heatmap = tf.maximum(
        heatmap,
        0
    )


    heatmap = heatmap.numpy()


    # --------------------------------------------------------
    # NORMALIZE
    # --------------------------------------------------------

    max_value = np.max(
        heatmap
    )

    if max_value > 0:

        heatmap = (
            heatmap /
            max_value
        )

    else:

        heatmap = np.zeros_like(
            heatmap
        )


    # ========================================================
    # READ ORIGINAL X-RAY
    # ========================================================

    original = cv2.imread(
        original_path,
        cv2.IMREAD_COLOR
    )

    if original is None:

        raise ValueError(
            "Unable to read original X-ray image."
        )


    # --------------------------------------------------------
    # ORIGINAL IMAGE SIZE
    # --------------------------------------------------------

    original_height = original.shape[0]

    original_width = original.shape[1]


    # ========================================================
    # UPSCALE GRAD-CAM
    # ========================================================

    heatmap = cv2.resize(
        heatmap,
        (
            original_width,
            original_height
        ),
        interpolation=cv2.INTER_CUBIC
    )


    # ========================================================
    # HEAVY SMOOTHING
    # ========================================================

    heatmap = cv2.GaussianBlur(
        heatmap,
        (0, 0),
        sigmaX=10
    )


    # ========================================================
    # NORMALIZE AGAIN
    # ========================================================

    min_value = np.min(
        heatmap
    )

    max_value = np.max(
        heatmap
    )

    if max_value > min_value:

        heatmap = (
            heatmap -
            min_value
        ) / (
            max_value -
            min_value
        )

    else:

        heatmap = np.zeros_like(
            heatmap
        )


    # ========================================================
    # IMPROVE COLOR DISTRIBUTION
    # ========================================================

    heatmap = np.power(
        heatmap,
        0.75
    )


    heatmap = np.clip(
        heatmap,
        0,
        1
    )


    # ========================================================
    # CREATE JET HEATMAP
    # ========================================================

    heatmap_uint8 = (
        heatmap *
        255
    ).astype(
        np.uint8
    )


    colored_heatmap = cv2.applyColorMap(
        heatmap_uint8,
        cv2.COLORMAP_JET
    )


    # ========================================================
    # CREATE STRONGER CHEXNET-LIKE OVERLAY
    # ========================================================

    alpha = (
        0.20 +
        heatmap *
        0.55
    )


    alpha = np.clip(
        alpha,
        0.20,
        0.75
    )


    # --------------------------------------------------------
    # CREATE 3-CHANNEL ALPHA
    # --------------------------------------------------------

    alpha = np.expand_dims(
        alpha,
        axis=2
    )


    # ========================================================
    # FLOAT CONVERSION
    # ========================================================

    original_float = (
        original.astype(
            np.float32
        )
    )

    heatmap_float = (
        colored_heatmap.astype(
            np.float32
        )
    )


    # ========================================================
    # BLEND
    # ========================================================

    overlay = (
        original_float *
        (
            1.0 -
            alpha
        )
        +
        heatmap_float *
        alpha
    )


    # ========================================================
    # FINAL PIXEL RANGE
    # ========================================================

    overlay = np.clip(
        overlay,
        0,
        255
    )


    # ========================================================
    # UINT8
    # ========================================================

    overlay = overlay.astype(
        np.uint8
    )


    # ========================================================
    # SAVE
    # ========================================================

    success = cv2.imwrite(
        save_path,
        overlay
    )

    if not success:

        raise RuntimeError(
            "Unable to save Grad-CAM heatmap."
        )


# ============================================================
# HOME
# ============================================================

@app.get("/")
def home():

    return {

        "message":
            "Welcome to MediScan AI 🚀",

        "status":
            "online",

        "model":
            "MobileNetV2 Pneumonia Classifier",

        "gradcam_layer":
            LAST_CONV_LAYER

    }


# ============================================================
# PREDICTION
# ============================================================

@app.post("/predict")
async def predict(

    username: str = Form(...),

    patient_name: str = Form(...),

    age: int = Form(...),

    gender: str = Form(...),

    file: UploadFile = File(...)

):

    # --------------------------------------------------------
    # FILE EXTENSION
    # --------------------------------------------------------

    original_extension = os.path.splitext(
        file.filename
    )[1].lower()


    if original_extension == "":

        original_extension = ".jpg"


    # --------------------------------------------------------
    # UNIQUE ID
    # --------------------------------------------------------

    unique_id = str(
        uuid.uuid4()
    )


    # --------------------------------------------------------
    # FILE NAMES
    # --------------------------------------------------------

    image_filename = (
        f"{unique_id}"
        f"{original_extension}"
    )

    heatmap_filename = (
        f"{unique_id}"
        f"_heatmap.png"
    )


    # --------------------------------------------------------
    # PATHS
    # --------------------------------------------------------

    image_path = os.path.join(
        UPLOAD_DIR,
        image_filename
    )

    heatmap_path = os.path.join(
        UPLOAD_DIR,
        heatmap_filename
    )


    # --------------------------------------------------------
    # SAVE IMAGE
    # --------------------------------------------------------

    file_data = await file.read()


    with open(
        image_path,
        "wb"
    ) as image_file:

        image_file.write(
            file_data
        )


    # --------------------------------------------------------
    # OPEN IMAGE
    # --------------------------------------------------------

    try:

        image = Image.open(
            image_path
        ).convert(
            "RGB"
        )

    except Exception:

        if os.path.exists(
            image_path
        ):

            os.remove(
                image_path
            )


        return {

            "error":
                "The uploaded file is not a valid image."

        }


    # --------------------------------------------------------
    # RESIZE
    # --------------------------------------------------------

    image = image.resize(
        (224, 224)
    )


    # --------------------------------------------------------
    # NUMPY
    # --------------------------------------------------------

    image_array = np.array(
        image,
        dtype=np.float32
    )


    # --------------------------------------------------------
    # MOBILENETV2 PREPROCESSING
    # --------------------------------------------------------

    image_array = preprocess_input(
        image_array
    )


    # --------------------------------------------------------
    # BATCH DIMENSION
    # --------------------------------------------------------

    image_array = np.expand_dims(
        image_array,
        axis=0
    )


    # ========================================================
    # PREDICTION
    # ========================================================

    prediction_output = model.predict(
        image_array,
        verbose=0
    )


    pneumonia_probability = float(
        prediction_output[0][0]
    )


    # ========================================================
    # CLASSIFICATION
    # ========================================================

    if pneumonia_probability >= 0.5:

        prediction = "Pneumonia"

        confidence = round(
            pneumonia_probability *
            100,
            1
        )

    else:

        prediction = "Normal"

        confidence = round(
            (
                1.0 -
                pneumonia_probability
            )
            *
            100,
            1
        )


    # ========================================================
    # GRAD-CAM
    # ========================================================

    try:

        generate_gradcam(

            image_array=image_array,

            original_path=image_path,

            save_path=heatmap_path,

            pneumonia_probability=
                pneumonia_probability

        )

        heatmap_url = (
            f"/uploads/"
            f"{heatmap_filename}"
        )

    except Exception as error:

        print(
            "Grad-CAM error:",
            str(error)
        )

        heatmap_url = ""


    # ========================================================
    # RESPONSE
    # ========================================================

    return {

        "username":
            username,

        "patient_name":
            patient_name,

        "age":
            age,

        "gender":
            gender,

        "prediction":
            prediction,

        "confidence":
            confidence,

        "pneumonia_probability":
            round(
                pneumonia_probability *
                100,
                2
            ),

        "normal_probability":
            round(
                (
                    1.0 -
                    pneumonia_probability
                )
                *
                100,
                2
            ),

        "original_image":
            f"/uploads/"
            f"{image_filename}",

        "heatmap":
            heatmap_url,

        "pdf":
            "",

        "disclaimer":
            (
                "For demonstration and research "
                "purposes only. This AI system "
                "is not a medical diagnosis."
            )

    }