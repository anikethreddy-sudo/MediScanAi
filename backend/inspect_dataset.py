import zipfile
import numpy as np

path = "multiclass_dataset/raw/Dataset5_raw_train.npz"

with zipfile.ZipFile(path) as archive:
    for name in archive.namelist():
        with archive.open(name) as file:
            version = np.lib.format.read_magic(file)

            if version == (1, 0):
                shape, order, dtype = np.lib.format.read_array_header_1_0(file)
            else:
                shape, order, dtype = np.lib.format.read_array_header_2_0(file)

            print("\nFile:", name)
            print("Shape:", shape)
            print("Data type:", dtype)
            print("Fortran order:", order)
