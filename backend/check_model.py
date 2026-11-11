from tensorflow.keras.models import load_model
import numpy as np

model = load_model("pneumonia_model.keras", compile=False)

print("Output shape:", model.output_shape)
print("Last activation:", model.layers[-1].activation.__name__)

x = np.zeros((1, 224, 224, 3), dtype=np.float32)
pred = model.predict(x, verbose=0)

print("Raw prediction:", pred)