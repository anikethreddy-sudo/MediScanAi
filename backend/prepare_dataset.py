import zipfile
import numpy as np
from pathlib import Path
from PIL import Image
import shutil

RAW = Path("multiclass_dataset/raw")
OUTPUT = Path("multiclass_dataset/prepared")

SPLITS = {
    "train": "Dataset5_raw_train.npz",
    "val": "Dataset5_raw_val.npz",
    "test": "Dataset5_raw_test.npz"
}

CLASSES = {
    0: "0_COVID-19",
    1: "1_Lung-Opacity",
    2: "2_Normal",
    3: "3_Viral-Pneumonia",
    4: "4_Tuberculosis"
}

# Never overwrite previously prepared images.
existing = [p for p in OUTPUT.rglob("*") if p.is_file()]

if existing:
    raise SystemExit("ERROR: Prepared folder is not empty. Stopping safely.")

for split in SPLITS:
    for folder in CLASSES.values():
        (OUTPUT / split / folder).mkdir(parents=True, exist_ok=True)

for split, filename in SPLITS.items():

    print("\n" + "=" * 45)
    print("Processing:", split)
    print("=" * 45)

    npz_path = RAW / filename
    total_counts = {label: 0 for label in CLASSES}

    with np.load(npz_path, allow_pickle=False) as data:
        labels = data["image_label"].reshape(-1).astype(np.int64)
        names = data["image_name"].reshape(-1)

    with zipfile.ZipFile(npz_path) as archive:
        with archive.open("image.npy") as file:

            version = np.lib.format.read_magic(file)

            if version == (1, 0):
                shape, fortran, dtype = (
                    np.lib.format.read_array_header_1_0(
                        file,
                        max_header_size=1024 * 1024 * 1024
                    )
                )
            elif version in ((2, 0), (3, 0)):
                shape, fortran, dtype = (
                    np.lib.format.read_array_header_2_0(
                        file,
                        max_header_size=1024 * 1024 * 1024
                    )
                )
            else:
                raise ValueError("Unsupported NumPy format")

            if fortran:
                raise ValueError("Unexpected Fortran-order images")

            if shape[0] != len(labels) or len(labels) != len(names):
                raise ValueError("Image, label and filename counts differ")

            if shape[1:] != (224, 224, 3):
                raise ValueError(f"Unexpected image dimensions: {shape}")

            image_bytes = int(np.prod(shape[1:])) * dtype.itemsize

            print("Total images:", shape[0])

            for i in range(shape[0]):

                raw_image = file.read(image_bytes)

                if len(raw_image) != image_bytes:
                    raise ValueError(f"Incomplete image at index {i}")

                image = np.frombuffer(
                    raw_image, dtype=dtype
                ).reshape(224, 224, 3)

                if not np.isfinite(image).all():
                    raise ValueError(f"Invalid pixel values at image {i}")

                if image.min() < 0 or image.max() > 255:
                    raise ValueError(
                        f"Pixel range outside 0-255 at image {i}"
                    )

                if not np.allclose(image, np.rint(image), atol=1e-6):
                    raise ValueError(
                        f"Non-integer pixel values at image {i}. "
                        "Stopping to avoid losing image information."
                    )

                label = int(labels[i])

                if label not in CLASSES:
                    raise ValueError(f"Unknown label: {label}")

                image_uint8 = np.rint(image).astype(np.uint8)

                original_name = Path(str(names[i])).stem
                output_name = f"{i:05d}_{original_name}.png"

                output_path = (
                    OUTPUT / split / CLASSES[label] / output_name
                )

                Image.fromarray(image_uint8).save(
                    output_path,
                    format="PNG",
                    compress_level=1
                )

                total_counts[label] += 1

                if (i + 1) % 500 == 0:
                    free_gb = shutil.disk_usage(OUTPUT).free / (1024**3)

                    if free_gb < 10:
                        raise RuntimeError(
                            "Less than 10 GB disk space remains. Stopping."
                        )

                    print(
                        f"Processed {i + 1}/{shape[0]} images | "
                        f"Free disk: {free_gb:.2f} GB"
                    )

    print("\nCompleted:", split)

    for label, count in total_counts.items():
        print(f"{CLASSES[label]}: {count}")

print("\nALL DATASET SPLITS PREPARED SUCCESSFULLY!")
