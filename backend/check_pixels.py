import zipfile
import numpy as np

path = "multiclass_dataset/raw/Dataset5_raw_train.npz"

with zipfile.ZipFile(path) as archive:
    with archive.open("image.npy") as file:
        version = np.lib.format.read_magic(file)

        if version == (1, 0):
            shape, order, dtype = np.lib.format.read_array_header_1_0(
                file, max_header_size=1024 * 1024 * 1024
            )
        elif version == (2, 0):
            shape, order, dtype = np.lib.format.read_array_header_2_0(
                file, max_header_size=1024 * 1024 * 1024
            )
        else:
            raise ValueError(f"Unsupported format: {version}")

        sample_bytes = 224 * 224 * 3 * np.dtype(dtype).itemsize
        sample = np.frombuffer(file.read(sample_bytes), dtype=dtype)
        sample = sample.reshape(224, 224, 3)

        print("Dataset shape:", shape)
        print("Data type:", dtype)
        print("Sample shape:", sample.shape)
        print("Minimum pixel:", sample.min())
        print("Maximum pixel:", sample.max())
        print("Mean pixel:", sample.mean())
