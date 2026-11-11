import os
import numpy as np
import tensorflow as tf

from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.applications.mobilenet_v2 import preprocess_input
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    confusion_matrix,
    roc_auc_score
)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

TEST_PATH = os.path.join(BASE_DIR, "dataset", "test")
MODEL_PATH = os.path.join(BASE_DIR, "pneumonia_model.keras")

THRESHOLD = 0.30

model = tf.keras.models.load_model(MODEL_PATH)

test_gen = ImageDataGenerator(
    preprocessing_function=preprocess_input
)

test_data = test_gen.flow_from_directory(
    TEST_PATH,
    target_size=(224, 224),
    batch_size=32,
    class_mode="binary",
    shuffle=False
)

print("\nGenerating test predictions...")

test_data.reset()

probabilities = model.predict(
    test_data,
    verbose=1
).ravel()

actual = test_data.classes

predicted = (
    probabilities >= THRESHOLD
).astype(int)

accuracy = accuracy_score(actual, predicted)
precision = precision_score(actual, predicted, zero_division=0)
recall = recall_score(actual, predicted, zero_division=0)
f1 = f1_score(actual, predicted, zero_division=0)
auc = roc_auc_score(actual, probabilities)

matrix = confusion_matrix(actual, predicted)

print("\n========================================")
print("FINAL TEST RESULTS - THRESHOLD 0.30")
print("========================================")

print(f"Accuracy  : {accuracy * 100:.2f}%")
print(f"Precision : {precision * 100:.2f}%")
print(f"Recall    : {recall * 100:.2f}%")
print(f"F1 Score  : {f1 * 100:.2f}%")
print(f"AUC       : {auc * 100:.2f}%")

print("\nConfusion Matrix:")
print(matrix)

print("\n========================================")
print("DONE")
print("========================================")