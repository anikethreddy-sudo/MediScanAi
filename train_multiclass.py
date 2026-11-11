import os
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "2"

import json
import numpy as np
import tensorflow as tf
from pathlib import Path
from sklearn.metrics import classification_report, confusion_matrix

tf.config.threading.set_intra_op_parallelism_threads(2)
tf.config.threading.set_inter_op_parallelism_threads(2)

ROOT = Path(__file__).resolve().parent
DATA = ROOT / "backend" / "multiclass_dataset" / "prepared"
SAVE = ROOT / "backend" / "multiclass_models"

SAVE.mkdir(parents=True, exist_ok=True)

BATCH_SIZE = 4
EPOCHS = 2
IMAGE_SIZE = (224, 224)

class_names = [
    "COVID-19",
    "Lung-Opacity",
    "Normal",
    "Viral-Pneumonia",
    "Tuberculosis"
]

counts = np.array([2512, 3607, 6115, 4438, 2938])
weights = counts.sum() / (5 * counts)
class_weights = dict(enumerate(weights.tolist()))

def load_data(split, shuffle=False):
    ds = tf.keras.utils.image_dataset_from_directory(
        DATA / split,
        image_size=IMAGE_SIZE,
        batch_size=BATCH_SIZE,
        label_mode="int",
        shuffle=shuffle,
        seed=42
    )

    ds = ds.map(
        lambda x, y: (
            tf.keras.applications.densenet.preprocess_input(x),
            y
        ),
        num_parallel_calls=1
    )

    return ds.prefetch(1)

print("Loading datasets...")

train = load_data("train", True)
val = load_data("val")
test = load_data("test")

print("Building DenseNet121...")

base = tf.keras.applications.DenseNet121(
    include_top=False,
    weights="imagenet",
    input_shape=(224, 224, 3)
)

base.trainable = False

inputs = tf.keras.Input(shape=(224, 224, 3))
x = base(inputs, training=False)
x = tf.keras.layers.GlobalAveragePooling2D()(x)
x = tf.keras.layers.Dropout(0.3)(x)
outputs = tf.keras.layers.Dense(5, activation="softmax")(x)

model = tf.keras.Model(inputs, outputs)

model.compile(
    optimizer=tf.keras.optimizers.Adam(learning_rate=0.0001),
    loss="sparse_categorical_crossentropy",
    metrics=["accuracy"]
)

checkpoint = SAVE / "mediscan_5class_best.keras"

callbacks = [
    tf.keras.callbacks.ModelCheckpoint(
        str(checkpoint),
        monitor="val_loss",
        save_best_only=True
    ),
    tf.keras.callbacks.EarlyStopping(
        monitor="val_loss",
        patience=1,
        restore_best_weights=True
    )
]

print("\nStarting training...")
model.fit(
    train,
    validation_data=val,
    epochs=EPOCHS,
    class_weight=class_weights,
    callbacks=callbacks
)

print("\nLoading best model...")
model = tf.keras.models.load_model(checkpoint)

print("\nEvaluating on unseen test data...")

y_true = np.concatenate([y.numpy() for _, y in test])
probabilities = model.predict(test, verbose=1)
y_pred = np.argmax(probabilities, axis=1)

report = classification_report(
    y_true,
    y_pred,
    target_names=class_names,
    digits=4
)

print("\nCLASSIFICATION REPORT")
print(report)

print("\nCONFUSION MATRIX")
print(confusion_matrix(y_true, y_pred))

with open(SAVE / "class_names.json", "w") as f:
    json.dump(class_names, f, indent=4)

with open(SAVE / "evaluation_report.txt", "w") as f:
    f.write(report)

print("\nTRAINING AND EVALUATION COMPLETED!")
print("Model:", checkpoint)
print("Results:", SAVE / "evaluation_report.txt")
