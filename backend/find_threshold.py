import os
import numpy as np
import tensorflow as tf

from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.applications.mobilenet_v2 import preprocess_input
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score


# ==============================
# PATHS
# ==============================

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

VAL_PATH = os.path.join(
    BASE_DIR,
    "dataset",
    "val"
)

MODEL_PATH = os.path.join(
    BASE_DIR,
    "pneumonia_model.keras"
)


# ==============================
# LOAD MODEL
# ==============================

model = tf.keras.models.load_model(MODEL_PATH)

print("Model loaded successfully!")


# ==============================
# LOAD VALIDATION DATA
# ==============================

val_gen = ImageDataGenerator(
    preprocessing_function=preprocess_input
)

val_data = val_gen.flow_from_directory(
    VAL_PATH,
    target_size=(224, 224),
    batch_size=32,
    class_mode="binary",
    shuffle=False
)


# ==============================
# GET PREDICTIONS
# ==============================

print("\nGenerating validation predictions...")

val_data.reset()

probabilities = model.predict(
    val_data,
    verbose=1
).ravel()

actual = val_data.classes


# ==============================
# TEST DIFFERENT THRESHOLDS
# ==============================

best_threshold = 0.5
best_f1 = 0

print("\n========================================")
print("THRESHOLD TESTING")
print("========================================")

for threshold in np.arange(0.30, 0.81, 0.01):

    predicted = (
        probabilities >= threshold
    ).astype(int)

    accuracy = accuracy_score(
        actual,
        predicted
    )

    precision = precision_score(
        actual,
        predicted,
        zero_division=0
    )

    recall = recall_score(
        actual,
        predicted,
        zero_division=0
    )

    f1 = f1_score(
        actual,
        predicted,
        zero_division=0
    )

    if f1 > best_f1:

        best_f1 = f1
        best_threshold = threshold

    print(
        f"Threshold: {threshold:.2f} | "
        f"Accuracy: {accuracy * 100:.2f}% | "
        f"Precision: {precision * 100:.2f}% | "
        f"Recall: {recall * 100:.2f}% | "
        f"F1: {f1 * 100:.2f}%"
    )


# ==============================
# BEST THRESHOLD
# ==============================

print("\n========================================")
print("BEST THRESHOLD")
print("========================================")

print(
    f"Best threshold: {best_threshold:.2f}"
)

print(
    f"Best validation F1: {best_f1 * 100:.2f}%"
)