from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from PIL import Image
from tensorflow.keras.models import load_model
from tensorflow.keras.applications.mobilenet_v2 import preprocess_input
import numpy as np
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
    image_path = os.path.join(UPLOAD_DIR, filename)

    with open(image_path, "wb") as f:
        f.write(await file.read())

    # Image preprocessing
    img = Image.open(image_path).convert("RGB")
    img = img.resize((224, 224))

    x = np.array(img, dtype=np.float32)
    x = preprocess_input(x)
    x = np.expand_dims(x, axis=0)

    # Prediction
    pred = model.predict(x, verbose=0)
    prob = float(pred[0][0])

    # If your model outputs Pneumonia probability
    if prob >= 0.5:
        prediction = "Pneumonia"
        confidence = round(prob * 100, 1)
    else:
        prediction = "Normal"
        confidence = round((1 - prob) * 100, 1)

    return {
        "username": username,
        "patient_name": patient_name,
        "age": age,
        "gender": gender,
        "prediction": prediction,
        "confidence": confidence,
        "original_image": f"/uploads/{filename}",
        "heatmap": f"/uploads/{filename}",
        "pdf": ""
    }