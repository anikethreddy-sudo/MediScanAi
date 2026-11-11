
import os
import json
import uuid
import sqlite3
from io import BytesIO
from datetime import date, datetime

import numpy as np
import cv2
import tensorflow as tf
from PIL import Image
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from tensorflow.keras.models import load_model
from tensorflow.keras.applications.densenet import preprocess_input

router = APIRouter()

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_DIR = os.path.join(BASE_DIR, "multiclass_models")
MODEL_PATH = os.path.join(MODEL_DIR, "mediscan_5class_best.keras")
CLASS_PATH = os.path.join(MODEL_DIR, "class_names.json")
DATABASE_PATH = os.path.join(BASE_DIR, "mediscan.db")
UPLOAD_DIR = os.path.join(BASE_DIR, "uploads")

os.makedirs(UPLOAD_DIR, exist_ok=True)

if not os.path.exists(MODEL_PATH):
    raise RuntimeError(f"Five-class model not found: {MODEL_PATH}")

if not os.path.exists(CLASS_PATH):
    raise RuntimeError(f"Class names file not found: {CLASS_PATH}")

with open(CLASS_PATH, "r", encoding="utf-8") as f:
    CLASS_NAMES = json.load(f)

model = None
feature_model = None


def get_multiclass_model():

    global model, feature_model

    if model is None:

        print("Loading MediScan five-class DenseNet model...")

        model = load_model(
            MODEL_PATH,
            compile=False
        )

        print("Five-class model loaded.")

    if feature_model is None:

        base = model.get_layer("densenet121")

        feature_model = tf.keras.Model(
            inputs=base.input,
            outputs=base.get_layer("relu").output
        )

        print("Multiclass Grad-CAM feature model ready.")

    return model, feature_model


def get_age(dob):

    birth_date = date.fromisoformat(dob)
    today = date.today()

    return today.year - birth_date.year - (
        (today.month, today.day) < (birth_date.month, birth_date.day)
    )


def generate_multiclass_gradcam(image_array, class_index):

    binary_model, cached_feature_model = get_multiclass_model()

    with tf.GradientTape() as tape:

        feature_maps = cached_feature_model(
            image_array,
            training=False
        )

        tape.watch(feature_maps)

        pooled = binary_model.get_layer(
            "global_average_pooling2d"
        )(feature_maps)

        dropped = binary_model.get_layer(
            "dropout"
        )(pooled, training=False)

        predictions = binary_model.get_layer(
            "dense"
        )(dropped)

        class_score = predictions[:, class_index]

    gradients = tape.gradient(
        class_score,
        feature_maps
    )

    if gradients is None:
        raise RuntimeError(
            "Could not calculate Grad-CAM gradients."
        )

    weights = tf.reduce_mean(
        gradients,
        axis=(1, 2)
    )

    heatmap = tf.reduce_sum(
        feature_maps * weights[:, tf.newaxis, tf.newaxis, :],
        axis=-1
    )[0]

    heatmap = tf.nn.relu(heatmap)

    heatmap = heatmap / (
        tf.reduce_max(heatmap) + 1e-8
    )

    heatmap = cv2.resize(
        heatmap.numpy(),
        (224, 224)
    )

    heatmap = np.uint8(
        255 * heatmap
    )

    heatmap = cv2.applyColorMap(
        heatmap,
        cv2.COLORMAP_JET
    )

    heatmap = cv2.cvtColor(
        heatmap,
        cv2.COLOR_BGR2RGB
    )

    return heatmap


@router.post("/predict-multiclass")
async def predict_multiclass(
    username: str = Form(...),
    patient_id: str = Form(...),
    file: UploadFile = File(...)
):

    patient_id = patient_id.strip().upper()

    if not patient_id:
        raise HTTPException(
            status_code=400,
            detail="Patient ID is required."
        )

    conn = sqlite3.connect(DATABASE_PATH)
    conn.row_factory = sqlite3.Row

    try:

        patient = conn.execute(
            "SELECT * FROM patients WHERE patient_id = ?",
            (patient_id,)
        ).fetchone()

        if not patient:
            raise HTTPException(
                status_code=404,
                detail="Patient not found."
            )

        if (
            not file.content_type
            or not file.content_type.startswith("image/")
        ):

            raise HTTPException(
                status_code=400,
                detail="Please upload an image."
            )

        content = await file.read()

        if not content:
            raise HTTPException(
                status_code=400,
                detail="Uploaded image is empty."
            )

        try:

            image = Image.open(
                BytesIO(content)
            ).convert("RGB")

        except Exception:

            raise HTTPException(
                status_code=400,
                detail="Invalid image file."
            )

        image = image.resize((224, 224))

        original_array = np.asarray(
            image,
            dtype=np.uint8
        )

        image_array = original_array.astype(
            np.float32
        )

        image_array = preprocess_input(
            image_array
        )

        image_array = np.expand_dims(
            image_array,
            axis=0
        )

        # Load the model only when prediction is requested.

        multiclass_model, _ = get_multiclass_model()

        scores = multiclass_model.predict(
            image_array,
            verbose=0
        )[0]

        predicted_index = int(
            np.argmax(scores)
        )

        prediction = CLASS_NAMES[predicted_index]

        confidence = float(
            scores[predicted_index]
        ) * 100

        score_details = {
            CLASS_NAMES[i]: round(
                float(scores[i]) * 100,
                2
            )
            for i in range(len(CLASS_NAMES))
        }

        extension = os.path.splitext(
            file.filename or ""
        )[1].lower()

        if extension not in [
            ".jpg",
            ".jpeg",
            ".png",
            ".webp"
        ]:
            extension = ".jpg"

        filename = (
            f"{uuid.uuid4().hex}{extension}"
        )

        image_path = os.path.join(
            UPLOAD_DIR,
            filename
        )

        with open(image_path, "wb") as image_file:
            image_file.write(content)

        heatmap_filename = (
            f"{uuid.uuid4().hex}_gradcam.jpg"
        )

        heatmap_path = os.path.join(
            UPLOAD_DIR,
            heatmap_filename
        )

        heatmap = generate_multiclass_gradcam(
            image_array,
            predicted_index
        )

        overlay = cv2.addWeighted(
            original_array,
            0.55,
            heatmap,
            0.45,
            0
        )

        Image.fromarray(overlay).save(
            heatmap_path,
            quality=95
        )

        age = get_age(
            patient["date_of_birth"]
        )

        created_at = datetime.now().isoformat(
            timespec="seconds"
        )

        image_url = f"/uploads/{filename}"

        conn.execute(
            """
            INSERT INTO scans (
                patient_id, patient_name, age, gender, disease,
                confidence, original_image, heatmap_image, created_at
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                patient_id,
                patient["patient_name"],
                str(age),
                patient["gender"],
                prediction,
                confidence,
                image_url,
                "",
                created_at
            )
        )

        conn.commit()

        return {
            "model_type": "multiclass",
            "prediction": prediction,
            "disease": prediction,
            "confidence": round(confidence, 2),
            "class_scores": score_details,
            "patient_id": patient_id,
            "patient_name": patient["patient_name"],
            "age": age,
            "gender": patient["gender"],
            "original_image": image_url,
            "original_image_url": image_url,
            "heatmap_image": f"/uploads/{heatmap_filename}",
            "heatmap_url": f"/uploads/{heatmap_filename}",
            "ai_finding": (
                f"The research model detected an X-ray image pattern "
                f"most associated with {prediction}."
            ),
            "screening_notice": (
                "Research demonstration only. Model scores are not "
                "diagnostic probabilities. This result cannot confirm "
                "or rule out disease. Clinical assessment is required."
            ),
            "created_at": created_at,
            "scan_date": created_at
        }

    finally:
        conn.close()
