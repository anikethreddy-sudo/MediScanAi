
from multiclass_routes import router as multiclass_router

from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from PIL import Image, UnidentifiedImageError
from tensorflow.keras.models import load_model, Model
from tensorflow.keras.applications.mobilenet_v2 import preprocess_input

from patient_routes import router as patient_router

import tensorflow as tf
import numpy as np
import cv2
import uuid
import os
import sqlite3

from datetime import date, datetime


# --------------------------------------------------
# APP INITIALIZATION
# --------------------------------------------------

app = FastAPI(title="MediScan AI")


# --------------------------------------------------
# CORS CONFIGURATION
# --------------------------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://mediscan-ai-aniketh.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --------------------------------------------------
# API ROUTERS
# --------------------------------------------------

app.include_router(multiclass_router)
app.include_router(patient_router)


# --------------------------------------------------
# PATH CONFIGURATION
# --------------------------------------------------

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

UPLOAD_DIR = os.path.join(BASE_DIR, "uploads")
REPORT_DIR = os.path.join(BASE_DIR, "reports")

MODEL_PATH = os.path.join(BASE_DIR, "pneumonia_model.keras")
DATABASE_PATH = os.path.join(BASE_DIR, "mediscan.db")

os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(REPORT_DIR, exist_ok=True)


# --------------------------------------------------
# STATIC FILES
# --------------------------------------------------

app.mount(
    "/uploads",
    StaticFiles(directory=UPLOAD_DIR),
    name="uploads"
)

app.mount(
    "/reports",
    StaticFiles(directory=REPORT_DIR),
    name="reports"
)


# --------------------------------------------------
# DATABASE CONNECTION
# --------------------------------------------------

def get_connection():
    conn = sqlite3.connect(DATABASE_PATH)
    conn.row_factory = sqlite3.Row
    return conn


# --------------------------------------------------
# AGE CALCULATION
# --------------------------------------------------

def calculate_age(date_of_birth):
    today = date.today()

    return (
        today.year
        - date_of_birth.year
        - (
            (today.month, today.day)
            < (date_of_birth.month, date_of_birth.day)
        )
    )


# --------------------------------------------------
# LOAD AI MODEL
# --------------------------------------------------

print("Loading MediScan AI model...")

model = load_model(MODEL_PATH, compile=False)

print("MediScan AI model loaded.")
print("Model input:", model.input_shape)
print("Model output:", model.output_shape)

LAST_CONV_LAYER = "Conv_1"

grad_model = Model(
    inputs=model.inputs,
    outputs=[
        model.get_layer(LAST_CONV_LAYER).output,
        model.output,
    ],
)

print("Grad-CAM ready.")


# --------------------------------------------------
# GRAD-CAM GENERATION
# --------------------------------------------------

def generate_gradcam(
    image_array,
    original_path,
    save_path,
    pneumonia_probability
):

    with tf.GradientTape() as tape:

        conv_outputs, predictions = grad_model(
            image_array,
            training=False
        )

        pneumonia_score = predictions[:, 0]
        normal_score = 1.0 - pneumonia_score

        target_score = (
            pneumonia_score
            if pneumonia_probability >= 0.5
            else normal_score
        )

    gradients = tape.gradient(target_score, conv_outputs)

    if gradients is None:
        raise RuntimeError(
            "Unable to calculate Grad-CAM gradients."
        )

    pooled_gradients = tf.reduce_mean(
        gradients,
        axis=(0, 1, 2)
    )

    conv_outputs = conv_outputs[0]

    heatmap = tf.reduce_sum(
        conv_outputs * pooled_gradients,
        axis=-1
    )

    heatmap = tf.maximum(heatmap, 0).numpy()

    max_value = np.max(heatmap)

    if max_value > 0:
        heatmap = heatmap / max_value
    else:
        heatmap = np.zeros_like(heatmap)

    original = cv2.imread(
        original_path,
        cv2.IMREAD_COLOR
    )

    if original is None:
        raise ValueError(
            "Unable to read original X-ray image."
        )

    height, width = original.shape[:2]

    heatmap = cv2.resize(
        heatmap,
        (width, height),
        interpolation=cv2.INTER_CUBIC
    )

    heatmap = cv2.GaussianBlur(
        heatmap,
        (0, 0),
        sigmaX=10
    )

    min_value = np.min(heatmap)
    max_value = np.max(heatmap)

    if max_value > min_value:
        heatmap = (
            (heatmap - min_value)
            / (max_value - min_value)
        )
    else:
        heatmap = np.zeros_like(heatmap)

    heatmap = np.clip(
        np.power(heatmap, 0.75),
        0,
        1
    )

    heatmap_uint8 = (
        heatmap * 255
    ).astype(np.uint8)

    colored_heatmap = cv2.applyColorMap(
        heatmap_uint8,
        cv2.COLORMAP_JET
    )

    alpha = np.expand_dims(
        np.clip(
            0.20 + heatmap * 0.55,
            0.20,
            0.75
        ),
        axis=2
    )

    original_float = original.astype(np.float32)
    heatmap_float = colored_heatmap.astype(np.float32)

    overlay = (
        original_float * (1.0 - alpha)
        + heatmap_float * alpha
    )

    overlay = np.clip(
        overlay,
        0,
        255
    ).astype(np.uint8)

    if not cv2.imwrite(save_path, overlay):
        raise RuntimeError(
            "Unable to save Grad-CAM heatmap."
        )


# --------------------------------------------------
# HOME API
# --------------------------------------------------

@app.get("/")
def home():

    return {
        "message": "Welcome to MediScan AI",
        "status": "online",
        "model": "MobileNetV2 Pneumonia Classifier",
        "gradcam_layer": LAST_CONV_LAYER,
        "supported_classes": [
            "NORMAL",
            "PNEUMONIA"
        ],
        "other_disease_detection": False
    }


# --------------------------------------------------
# PREDICTION API
# --------------------------------------------------

@app.post("/predict")
async def predict(
    username: str = Form(...),
    patient_id: str = Form(...),
    file: UploadFile = File(...)
):

    # 1. Validate patient ID

    patient_id = patient_id.strip().upper()

    if not patient_id:
        raise HTTPException(
            status_code=400,
            detail="Patient ID is required."
        )

    conn = get_connection()

    try:

        patient = conn.execute(
            """
            SELECT patient_id, patient_name, date_of_birth, gender
            FROM patients
            WHERE patient_id = ?
            """,
            (patient_id,)
        ).fetchone()

    finally:
        conn.close()

    if patient is None:
        raise HTTPException(
            status_code=404,
            detail="Patient ID not found. Register the patient first."
        )

    try:

        date_of_birth = date.fromisoformat(
            patient["date_of_birth"]
        )

    except (ValueError, TypeError):

        raise HTTPException(
            status_code=500,
            detail="Invalid date of birth in patient record."
        )

    if date_of_birth > date.today():
        raise HTTPException(
            status_code=400,
            detail="Patient date of birth cannot be in the future."
        )

    patient_name = patient["patient_name"]
    gender = patient["gender"]

    age = calculate_age(date_of_birth)

    # 2. Validate uploaded image

    if (
        not file.content_type
        or not file.content_type.startswith("image/")
    ):

        raise HTTPException(
            status_code=400,
            detail="Please upload a valid image file."
        )

    original_extension = os.path.splitext(
        file.filename or ""
    )[1].lower()

    if original_extension not in [
        ".jpg",
        ".jpeg",
        ".png",
        ".webp",
        ".bmp"
    ]:
        original_extension = ".jpg"

    unique_id = str(uuid.uuid4())

    image_filename = (
        f"{unique_id}{original_extension}"
    )

    heatmap_filename = (
        f"{unique_id}_heatmap.png"
    )

    image_path = os.path.join(
        UPLOAD_DIR,
        image_filename
    )

    heatmap_path = os.path.join(
        UPLOAD_DIR,
        heatmap_filename
    )

    file_data = await file.read()

    if not file_data:
        raise HTTPException(
            status_code=400,
            detail="The uploaded file is empty."
        )

    with open(image_path, "wb") as image_file:
        image_file.write(file_data)

    try:

        image = Image.open(
            image_path
        ).convert("RGB")

    except (UnidentifiedImageError, OSError):

        if os.path.exists(image_path):
            os.remove(image_path)

        raise HTTPException(
            status_code=400,
            detail="The uploaded file is not a valid image."
        )

    image = image.resize((224, 224))

    image_array = np.array(
        image,
        dtype=np.float32
    )

    image_array = preprocess_input(image_array)

    image_array = np.expand_dims(
        image_array,
        axis=0
    )

    # 3. Run AI prediction

    prediction_output = model.predict(
        image_array,
        verbose=0
    )

    if prediction_output.size != 1:

        raise HTTPException(
            status_code=500,
            detail=(
                "This code expects a binary model with "
                "one output. Check the model output shape."
            )
        )

    pneumonia_probability = float(
        prediction_output.reshape(-1)[0]
    )

    if (
        not np.isfinite(pneumonia_probability)
        or not (
            0.0 <= pneumonia_probability <= 1.0
        )
    ):

        raise HTTPException(
            status_code=500,
            detail=(
                "The model returned an invalid score. "
                "Please check the model output."
            )
        )

    normal_probability = (
        1.0 - pneumonia_probability
    )

    # 4. Interpret experimental model score

    if pneumonia_probability >= 0.70:

        prediction = "Pneumonia Suspected"

        confidence = round(
            pneumonia_probability * 100,
            1
        )

        confidence_level = "Higher model score"
        risk_level = "Needs medical review"

        ai_finding = (
            "The AI detected an X-ray pattern that may be "
            "consistent with pneumonia. This is not a "
            "confirmed diagnosis."
        )

        recommended_action = (
            "Arrange medical review of the chest X-ray "
            "and symptoms. Do not start antibiotics based "
            "only on this AI result."
        )

    elif pneumonia_probability <= 0.30:

        prediction = (
            "No Strong Pneumonia-like Pattern Detected"
        )

        confidence = round(
            normal_probability * 100,
            1
        )

        confidence_level = "Higher normal-class score"
        risk_level = "Not a clinical risk assessment"

        ai_finding = (
            "The AI did not detect a strong pneumonia-like "
            "pattern. This does not rule out pneumonia "
            "or another disease."
        )

        recommended_action = (
            "If symptoms persist or worsen, consult a "
            "healthcare professional even when the AI "
            "score is low."
        )

    else:

        prediction = "Inconclusive"

        confidence = round(
            max(
                pneumonia_probability,
                normal_probability
            ) * 100,
            1
        )

        confidence_level = "Uncertain model result"
        risk_level = "Needs further assessment"

        ai_finding = (
            "The model result is uncertain. The AI cannot "
            "reliably decide whether this X-ray is normal "
            "or shows pneumonia."
        )

        recommended_action = (
            "Do not treat this result as a diagnosis. "
            "A healthcare professional should assess "
            "the X-ray and symptoms."
        )

    # 5. Explain model result

    if prediction == "Pneumonia Suspected":

        why = (
            "The model score is in the higher pneumonia-like "
            "range used by this experimental application."
        )

        counterpoint = (
            "Other lung conditions can sometimes look similar. "
            "This model cannot distinguish or name those conditions."
        )

    elif prediction == "No Strong Pneumonia-like Pattern Detected":

        why = (
            "The model score is in the lower pneumonia-like "
            "range used by this experimental application."
        )

        counterpoint = (
            "A low score cannot exclude pneumonia or another "
            "disease, especially when symptoms are present."
        )

    else:

        why = (
            "The model score falls between the experimental "
            "decision ranges, so the result is treated as "
            "inconclusive."
        )

        counterpoint = (
            "An uncertain AI score cannot determine which "
            "disease, if any, the person has."
        )

    # 6. Generate Grad-CAM

    try:

        generate_gradcam(
            image_array=image_array,
            original_path=image_path,
            save_path=heatmap_path,
            pneumonia_probability=pneumonia_probability
        )

        heatmap_url = (
            f"/uploads/{heatmap_filename}"
        )

    except Exception as error:

        print(
            "Grad-CAM error:",
            str(error)
        )

        heatmap_url = ""

    # 7. Save scan record

    scan_date = datetime.now().strftime(
        "%d %b %Y %I:%M %p"
    )

    conn = get_connection()

    try:

        cursor = conn.execute(
            """
            INSERT INTO scans (
                patient_id,
                patient_name,
                age,
                gender,
                disease,
                confidence,
                original_image,
                heatmap_image,
                created_at
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                patient_id,
                patient_name,
                str(age),
                gender,
                prediction,
                confidence,
                image_filename,
                heatmap_filename if heatmap_url else "",
                scan_date
            )
        )

        scan_id = cursor.lastrowid

        conn.commit()

    except sqlite3.Error as error:

        conn.rollback()

        print(
            "Scan database error:",
            str(error)
        )

        raise HTTPException(
            status_code=500,
            detail=(
                "Prediction completed, but the scan "
                "could not be saved."
            )
        )

    finally:
        conn.close()

    # 8. Response

    screening_notice = (
        "This experimental AI tool only compares NORMAL "
        "and PNEUMONIA patterns. It cannot diagnose or name "
        "other diseases. Similar symptoms do not prove that "
        "a person has pneumonia or another specific disease. "
        "Clinical assessment is needed."
    )

    precautions = [
        "Seek medical advice if symptoms persist or worsen.",
        "Rest and drink fluids if your healthcare professional has not restricted them.",
        "Avoid smoking and second-hand smoke.",
        "Use medicines, including antibiotics, only as advised by a healthcare professional.",
        "Seek emergency help for severe breathing difficulty, blue or grey lips, or sudden confusion."
    ]

    return {
        "scan_id": scan_id,
        "patient_id": patient_id,
        "username": username,
        "patient_name": patient_name,
        "date_of_birth": date_of_birth.isoformat(),
        "age": age,
        "gender": gender,
        "scan_date": scan_date,
        "prediction": prediction,
        "confidence": confidence,
        "confidence_level": confidence_level,
        "risk_level": risk_level,
        "ai_finding": ai_finding,
        "why": why,
        "counterpoint": counterpoint,
        "recommended_action": recommended_action,
        "ai_takeaway": (
            "This is an experimental screening aid, "
            "not a medical diagnosis."
        ),
        "screening_notice": screening_notice,
        "precautions": precautions,
        "pneumonia_probability": round(
            pneumonia_probability * 100,
            2
        ),
        "normal_probability": round(
            normal_probability * 100,
            2
        ),
        "original_image": (
            f"/uploads/{image_filename}"
        ),
        "heatmap": heatmap_url,
        "pdf": "",
        "disclaimer": (
            "For research and demonstration only. The model "
            "score is not the probability that a patient truly "
            "has or does not have a disease. This model supports "
            "only NORMAL versus PNEUMONIA classification and may "
            "make false-positive or false-negative predictions. "
            "It cannot identify other diseases."
        )
    }
