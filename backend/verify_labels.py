import numpy as np

path = "multiclass_dataset/raw/Dataset5_raw_train.npz"

with np.load(path, allow_pickle=False) as data:
    labels = data["image_label"].reshape(-1)
    names = data["image_name"].reshape(-1)

    class_names = {
        0: "COVID-19",
        1: "Lung Opacity",
        2: "Normal",
        3: "Viral Pneumonia",
        4: "Tuberculosis"
    }

    print("CLASS MAPPING")
    for label, name in class_names.items():
        print(f"{label} = {name}")

    print("\nTotal labels:", len(labels))
    print("Total filenames:", len(names))
    print("All labels valid:", set(labels).issubset(class_names.keys()))
