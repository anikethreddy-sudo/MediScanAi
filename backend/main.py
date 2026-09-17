from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from PIL import Image
import tf_keras as keras
import numpy as np
import uuid
import os

app = FastAPI(title="MediScan AI")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

os.makedirs("uploads", exist_ok=True)
os.makedirs("reports", exist_ok=True)

app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")
app.mount("/reports", StaticFiles(directory="reports"), name="reports")

MODEL_PATH = "pneumonia_model.h5"

# IMPORTANT: use tf_keras instead of keras 3
model = keras.models.load_model(MODEL_PATH, compile=False)

@app.get("/")
def home():
    return {"message": "Welcome to MediScan AI 🚀"}

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

    image_path = f"uploads/{uid}.{ext}"

    with open(image_path, "wb") as f:
        f.write(await file.read())

    img = Image.open(image_path).convert("RGB")
    img = img.resize((224, 224))

    x = np.array(img, dtype=np.float32) / 255.0
    x = np.expand_dims(x, axis=0)

    prob = float(model.predict(x, verbose=0)[0][0])

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
        "original_image": image_path,
        "heatmap": image_path,
        "pdf": ""
    }