import os
import numpy as np
import tensorflow as tf

from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.applications.mobilenet_v2 import preprocess_input


BASE_DIR = os.path.dirname(os.path.abspath(__file__))

MODEL_PATH = os.path.join(
    BASE_DIR,
    "best_pneumonia_model.keras"
)

TEST_PATH = os.path.join(
    BASE_DIR,
    "dataset",
    "test"
)


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


test_data.reset()

probabilities = model.predict(test_data).flatten()

actual = test_data.classes

filenames = test_data.filenames


print("\n========================================")
print("FALSE POSITIVE ANALYSIS")
print("========================================")


false_positive_count = 0


for i in range(len(actual)):

    # Actual NORMAL = 0
    # Model predicts PNEUMONIA if probability >= 0.5

    if actual[i] == 0 and probabilities[i] >= 0.5:

        false_positive_count += 1

        print(
            f"{false_positive_count}. "
            f"{filenames[i]} "
            f"-> Pneumonia probability: "
            f"{probabilities[i] * 100:.2f}%"
        )


print("\n========================================")
print(
    "TOTAL FALSE POSITIVES:",
    false_positive_count
)
print("========================================")