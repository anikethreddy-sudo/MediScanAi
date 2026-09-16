import cv2
import numpy as np

def generate_heatmap(image_path, output_path):
    # Read X-ray
    img = cv2.imread(image_path)

    if img is None:
        raise Exception("Image not found")

    img = cv2.resize(img, (512, 512))

    # Convert to grayscale
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    # Improve lung contrast
    clahe = cv2.createCLAHE(clipLimit=2.5, tileGridSize=(8,8))
    gray = clahe.apply(gray)

    # Blur -> attention map
    attention = cv2.GaussianBlur(gray, (61,61), 0)

    # Normalize
    attention = cv2.normalize(attention, None, 0, 255, cv2.NORM_MINMAX)

    # Jet heatmap
    heatmap = cv2.applyColorMap(attention, cv2.COLORMAP_JET)

    # Strong overlay
    result = cv2.addWeighted(img, 0.55, heatmap, 0.75, 0)

    cv2.imwrite(output_path, result)