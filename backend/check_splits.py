import numpy as np
import os

files = [
    "multiclass_dataset/raw/Dataset5_raw_val.npz",
    "multiclass_dataset/raw/Dataset5_raw_test.npz"
]

for path in files:
    print("\n" + "=" * 40)
    print("Dataset:", os.path.basename(path))

    with np.load(path, allow_pickle=False) as data:
        labels = data["image_label"].reshape(-1)

        print("Total images:", len(labels))
        values, counts = np.unique(labels, return_counts=True)

        for value, count in zip(values, counts):
            print(f"Label {int(value)}: {count} images")
