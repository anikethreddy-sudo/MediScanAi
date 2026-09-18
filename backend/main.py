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

# ---------------- APP ---------------- #
app = FastAPI(title="MediScan AI")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------- PATHS ---------------- #
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

UPLOAD_DIR = os.path.join(BASE_DIR, "uploads")
REPORT_DIR = os.path.join(BASE_DIR, "reports")
MODEL_PATH = os.path.join(BASE_DIR, "pneumonia_model.keras")

os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(REPORT_DIR, exist_ok=True)

app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")
app.mount("/reports", StaticFiles(directory=REPORT_DIR), name="reports")

# ---------------- LOAD MODEL ---------------- #
model = load_model(MODEL_PATH, compile=False)

# Last convolution layer of MobileNetV2
LAST_CONV_LAYER = "Conv_1"

# ---------------- GRAD-CAM ---------------- #
def generate_gradcam(img_array, original_path, save_path):

    grad_model = Model(
        inputs=model.inputs,
        outputs=[
            model.get_layer(LAST_CONV_LAYER).output,
            model.output
        ]
    )

    with tf.GradientTape() as tape:
        conv_outputs, predictions = grad_model(img_array)
        loss = predictions[:, 0]

    grads = tape.gradient(loss, conv_outputs)
    pooled_grads = tf.reduce_mean(grads, axis=(0, 1, 2))

    conv_outputs = conv_outputs[0]
    heatmap = conv_outputs @ pooled_grads[..., tf.newaxis]
    heatmap = tf.squeeze(heatmap)

    heatmap = tf.maximum(heatmap, 0)

    max_val = tf.reduce_max(heatmap)
    if max_val > 0:
        heatmap = heatmap / max_val

    heatmap = heatmap.numpy()

    original = cv2.imread(original_path)
    original = cv2.resize(original, (224, 224))

    heatmap = cv2.resize(heatmap, (224, 224))
    heatmap = np.uint8(255 * heatmap)

    colored = cv2.applyColorMap(heatmap, cv2.COLORMAP_JET)

    result = cv2.addWeighted(original, 0.55, colored, 0.45, 0)

    cv2.imwrite(save_path, result)


# ---------------- HOME ---------------- #
@app.get("/")
def home():
    return {"message": "Welcome to MediScan AI 🚀"}


# ---------------- PREDICT ---------------- #
@app.post("/predict")
async def predict(
    username: str = Form(...),
    patient_name: str = Form(...),
    age: int = Form(...),
    gender: str = Form(...),
    file: UploadFile = File(...)
):

    ext = file.filename.split(".")[-1]
    uid = str(uuid.uuid4())

    filename = f"{uid}.{ext}"
    heatmap_name = f"{uid}_heatmap.png"

    image_path = os.path.join(UPLOAD_DIR, filename)
    heatmap_path = os.path.join(UPLOAD_DIR, heatmap_name)

    # Save uploaded image
    with open(image_path, "wb") as f:
        f.write(await file.read())

    # Preprocess
    img = Image.open(image_path).convert("RGB")
    img = img.resize((224, 224))

    x = np.array(img, dtype=np.float32)
    x = preprocess_input(x)
    x = np.expand_dims(x, axis=0)

    # AI Prediction
    prob = float(model.predict(x, verbose=0)[0][0])

    if prob >= 0.5:
        prediction = "Pneumonia"
        confidence = round(prob * 100, 1)
    else:
        prediction = "Normal"
        confidence = round((1 - prob) * 100, 1)

    # Generate AI Heatmap
    generate_gradcam(x, image_path, heatmap_path)

    # Response
    return {
        "username": username,
        "patient_name": patient_name,
        "age": age,
        "gender": gender,
        "prediction": prediction,
        "confidence": confidence,
        "original_image": f"/uploads/{filename}",
        "heatmap": f"/uploads/{heatmap_name}",
        "pdf": ""
    }