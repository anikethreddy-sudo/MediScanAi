import tensorflow as tf
from pathlib import Path

tf.config.threading.set_intra_op_parallelism_threads(2)
tf.config.threading.set_inter_op_parallelism_threads(2)

DATA_DIR = (
    Path(__file__).resolve().parent
    / "backend"
    / "multiclass_dataset"
    / "prepared"
    / "train"
)

BATCH_SIZE = 4
IMAGE_SIZE = (224, 224)

print("Dataset path:", DATA_DIR)

if not DATA_DIR.exists():
    raise FileNotFoundError(f"Dataset not found: {DATA_DIR}")

print("\nLoading one batch...")

dataset = tf.keras.utils.image_dataset_from_directory(
    DATA_DIR,
    image_size=IMAGE_SIZE,
    batch_size=BATCH_SIZE,
    label_mode="int",
    shuffle=True,
    seed=42
)

print("\nClass names:", dataset.class_names)

images, labels = next(iter(dataset))

print("Image batch shape:", images.shape)
print("Label batch shape:", labels.shape)

print("\nLoading pretrained DenseNet121...")

base_model = tf.keras.applications.DenseNet121(
    include_top=False,
    weights="imagenet",
    input_shape=(224, 224, 3)
)

base_model.trainable = False

inputs = tf.keras.Input(shape=(224, 224, 3))

x = tf.keras.applications.densenet.preprocess_input(inputs)
x = base_model(x, training=False)
x = tf.keras.layers.GlobalAveragePooling2D()(x)
x = tf.keras.layers.Dropout(0.3)(x)
outputs = tf.keras.layers.Dense(5, activation="softmax")(x)

model = tf.keras.Model(inputs, outputs)

predictions = model(images, training=False)

print("\nModel output shape:", predictions.shape)
print("Predicted probabilities:", predictions.numpy()[0])
print("\nMODEL TEST SUCCESSFUL!")
