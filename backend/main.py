from fastapi import FastAPI, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import tensorflow as tf
from PIL import Image
import numpy as np
import uuid
import os
import shutil

from heatmap import generate_heatmap
from pdf_report import create_pdf

app = FastAPI(title="MediScan AI")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

UPLOAD_FOLDER = os.path.join(BASE_DIR, "uploads")
REPORT_FOLDER = os.path.join(BASE_DIR, "reports")

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(REPORT_FOLDER, exist_ok=True)

MODEL_PATH = os.path.join(BASE_DIR, "pneumonia_model.h5")
model = tf.keras.models.load_model(
    MODEL_PATH,
    compile=False
)

app.mount("/uploads", StaticFiles(directory=UPLOAD_FOLDER), name="uploads")
app.mount("/reports", StaticFiles(directory=REPORT_FOLDER), name="reports")


def predict_image(path):
    img = Image.open(path).convert("RGB")
    img = img.resize((224, 224))
    img = np.array(img) / 255.0
    img = np.expand_dims(img, axis=0)

    pred = model.predict(img, verbose=0)[0][0]

    if pred > 0.5:
        label = "Pneumonia"
        confidence = round(pred * 100, 2)
    else:
        label = "Normal"
        confidence = round((1 - pred) * 100, 2)

    return label, confidence


@app.get("/")
def home():
    return {"message": "MediScan AI Backend Running"}


@app.post("/predict")
async def predict(
    username: str = Form(...),
    patient_name: str = Form(...),
    age: int = Form(...),
    gender: str = Form(...),
    file: UploadFile = File(...)
):
    uid = str(uuid.uuid4())

    image_path = os.path.join(
        UPLOAD_FOLDER,
        f"{uid}_{file.filename}"
    )

    with open(image_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    prediction, confidence = predict_image(image_path)

    heatmap_path = generate_heatmap(image_path, model)

    pdf_path = create_pdf(
        username=username,
        patient_name=patient_name,
        age=age,
        gender=gender,
        prediction=prediction,
        confidence=confidence,
        image_path=image_path,
        heatmap_path=heatmap_path,
        output_folder=REPORT_FOLDER,
        report_id=uid
    )

    return {
        "username": username,
        "patient_name": patient_name,
        "age": age,
        "gender": gender,
        "prediction": prediction,
        "confidence": confidence,
        "original_image": f"/uploads/{os.path.basename(image_path)}",
        "heatmap": f"/uploads/{os.path.basename(heatmap_path)}",
        "pdf": f"/reports/{os.path.basename(pdf_path)}"
    }