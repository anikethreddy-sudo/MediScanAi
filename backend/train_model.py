import os
import numpy as np
import tensorflow as tf

from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.applications import DenseNet121
from tensorflow.keras.applications.densenet import preprocess_input
from tensorflow.keras.layers import Dense, GlobalAveragePooling2D, Dropout
from tensorflow.keras.models import Model
from tensorflow.keras.callbacks import EarlyStopping, ModelCheckpoint
from sklearn.metrics import (
    confusion_matrix,
    classification_report,
    f1_score,
    roc_auc_score
)


# ==========================================
# PATHS
# ==========================================

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

train_path = os.path.join(BASE_DIR, "dataset", "train")
val_path = os.path.join(BASE_DIR, "dataset", "val")
test_path = os.path.join(BASE_DIR, "dataset", "test")


# ==========================================
# DATA
# ==========================================

train_gen = ImageDataGenerator(
    preprocessing_function=preprocess_input,
    rotation_range=8,
    width_shift_range=0.05,
    height_shift_range=0.05,
    zoom_range=0.08,
    horizontal_flip=True,
    fill_mode="nearest"
)

val_gen = ImageDataGenerator(
    preprocessing_function=preprocess_input
)

test_gen = ImageDataGenerator(
    preprocessing_function=preprocess_input
)


train_data = train_gen.flow_from_directory(
    train_path,
    target_size=(224, 224),
    batch_size=32,
    class_mode="binary",
    shuffle=True
)

val_data = val_gen.flow_from_directory(
    val_path,
    target_size=(224, 224),
    batch_size=32,
    class_mode="binary",
    shuffle=False
)

test_data = test_gen.flow_from_directory(
    test_path,
    target_size=(224, 224),
    batch_size=32,
    class_mode="binary",
    shuffle=False
)


print("\n========================================")
print("DATASET")
print("========================================")

print("Classes:", train_data.class_indices)
print("Train:", train_data.samples)
print("Validation:", val_data.samples)
print("Test:", test_data.samples)


# ==========================================
# DENSENET121
# ==========================================

base_model = DenseNet121(
    weights="imagenet",
    include_top=False,
    input_shape=(224, 224, 3)
)

base_model.trainable = False


# ==========================================
# CLASSIFICATION HEAD
# ==========================================

x = base_model.output

x = GlobalAveragePooling2D()(x)

x = Dropout(0.30)(x)

x = Dense(
    128,
    activation="relu"
)(x)

x = Dropout(0.30)(x)

output = Dense(
    1,
    activation="sigmoid"
)(x)


model = Model(
    inputs=base_model.input,
    outputs=output
)


# ==========================================
# COMPILE
# ==========================================

model.compile(
    optimizer=tf.keras.optimizers.Adam(
        learning_rate=0.0001
    ),
    loss="binary_crossentropy",
    metrics=[
        "accuracy",
        tf.keras.metrics.Precision(name="precision"),
        tf.keras.metrics.Recall(name="recall"),
        tf.keras.metrics.AUC(name="auc")
    ]
)


# ==========================================
# CALLBACKS
# ==========================================

checkpoint = ModelCheckpoint(
    "best_densenet_model.keras",
    monitor="val_auc",
    mode="max",
    save_best_only=True,
    verbose=1
)

early_stop = EarlyStopping(
    monitor="val_auc",
    mode="max",
    patience=1,
    restore_best_weights=True,
    verbose=1
)


# ==========================================
# TRAIN
# ==========================================

print("\n========================================")
print("DENSENET121 - QUICK TEST")
print("3 EPOCHS MAXIMUM")
print("========================================\n")


model.fit(
    train_data,
    validation_data=val_data,
    epochs=3,
    callbacks=[
        checkpoint,
        early_stop
    ]
)


# ==========================================
# LOAD BEST
# ==========================================

print("\nLoading best DenseNet model...")

model = tf.keras.models.load_model(
    "best_densenet_model.keras"
)


# ==========================================
# TEST
# ==========================================

print("\n========================================")
print("DENSENET121 TEST RESULTS")
print("========================================\n")

test_data.reset()

probabilities = model.predict(
    test_data
).flatten()

actual = test_data.classes

threshold = 0.50

predicted = (
    probabilities >= threshold
).astype(int)


accuracy = np.mean(
    predicted == actual
)

f1 = f1_score(
    actual,
    predicted
)

auc = roc_auc_score(
    actual,
    probabilities
)

matrix = confusion_matrix(
    actual,
    predicted
)


print("Accuracy:", round(accuracy * 100, 2), "%")
print("F1 Score:", round(f1 * 100, 2), "%")
print("AUC:", round(auc * 100, 2), "%")

print("\nConfusion Matrix:")
print(matrix)

print("\nClassification Report:")

print(
    classification_report(
        actual,
        predicted,
        target_names=[
            "NORMAL",
            "PNEUMONIA"
        ]
    )
)


print("\n========================================")
print("DENSENET121 TEST COMPLETE")
print("========================================")
