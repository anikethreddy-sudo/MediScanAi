import sqlite3
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB = os.path.join(BASE_DIR, "mediscan.db")


def init_db():
    conn = sqlite3.connect(DB)
    cur = conn.cursor()

    cur.execute("""
    CREATE TABLE IF NOT EXISTS scans(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        patient_name TEXT,
        age TEXT,
        gender TEXT,
        disease TEXT,
        confidence REAL,
        original_image TEXT,
        heatmap_image TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)

    conn.commit()
    conn.close()


def save_scan(name, age, gender, disease, confidence, original, heatmap):
    conn = sqlite3.connect(DB)
    cur = conn.cursor()

    cur.execute("""
    INSERT INTO scans
    (patient_name, age, gender, disease, confidence, original_image, heatmap_image)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    """, (name, age, gender, disease, confidence, original, heatmap))

    conn.commit()
    conn.close()


def get_scans():
    conn = sqlite3.connect(DB)
    conn.row_factory = sqlite3.Row
    cur = conn.cursor()

    cur.execute("SELECT * FROM scans ORDER BY id DESC")

    rows = [dict(r) for r in cur.fetchall()]
    conn.close()
    return rows


def get_dashboard():
    conn = sqlite3.connect(DB)
    cur = conn.cursor()

    cur.execute("SELECT COUNT(*) FROM scans")
    total = cur.fetchone()[0]

    cur.execute("SELECT COUNT(*) FROM scans WHERE disease='NORMAL'")
    normal = cur.fetchone()[0]

    cur.execute("SELECT COUNT(*) FROM scans WHERE disease='PNEUMONIA'")
    pneumonia = cur.fetchone()[0]

    cur.execute("SELECT AVG(confidence) FROM scans")
    avg = cur.fetchone()[0]

    conn.close()

    return {
        "total": total,
        "normal": normal,
        "pneumonia": pneumonia,
        "average_confidence": round(avg or 0, 2)
    }