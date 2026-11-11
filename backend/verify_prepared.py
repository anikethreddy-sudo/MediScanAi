from pathlib import Path

root = Path("multiclass_dataset/prepared")

for split in ["train", "val", "test"]:
    print("\n", split.upper())
    total = 0

    for folder in sorted((root / split).iterdir()):
        count = len(list(folder.glob("*.png")))
        total += count
        print(f"{folder.name}: {count}")

    print("TOTAL:", total)
