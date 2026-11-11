import numpy as np

path = "multiclass_dataset/raw/Dataset5_raw_train.npz"

with np.load(path, allow_pickle=False) as data:
    labels = data["image_label"].reshape(-1)
    names = data["image_name"].reshape(-1)

    print("Total images:", len(labels))
    print("\nClass distribution:")
    values, counts = np.unique(labels, return_counts=True)

    for value, count in zip(values, counts):
        print(f"Label {int(value)}: {count} images")

    print("\nFirst 5 image names:")
    for name in names[:5]:
        print(name)
