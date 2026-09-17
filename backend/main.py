from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib.units import inch
import sqlite3
import cv2
import os
import uuid
from datetime import datetime

# ---------------- APP ----------------

app = FastAPI(title="MediScan AI Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------- FOLDERS ----------------

UPLOAD_FOLDER = "uploads"
REPORT_FOLDER = "reports"
DB_NAME = "mediscan.db"

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(REPORT_FOLDER, exist_ok=True)

app.mount("/uploads", StaticFiles(directory=UPLOAD_FOLDER), name="uploads")
app.mount("/reports", StaticFiles(directory=REPORT_FOLDER), name="reports")

# ---------------- DATABASE ----------------

conn = sqlite3.connect(DB_NAME, check_same_thread=False)
cursor = conn.cursor()

cursor.execute("""
CREATE TABLE IF NOT EXISTS scans(
id INTEGER PRIMARY KEY AUTOINCREMENT,
username TEXT,
patient_name TEXT,
age INTEGER,
gender TEXT,
prediction TEXT,
confidence REAL,
original_image TEXT,
heatmap TEXT,
pdf TEXT,
date TEXT
)
""")
conn.commit()

# ---------------- HOME ----------------

@app.get("/")
def home():
    return {"message": "MediScan AI Backend Running"}

# ---------------- PREDICT ----------------

@app.post("/predict")
async def predict(
    username: str = Form(...),
    patient_name: str = Form(...),
    age: int = Form(...),
    gender: str = Form(...),
    file: UploadFile = File(...)
):

    uid = str(uuid.uuid4())

    original_path = os.path.join(UPLOAD_FOLDER, f"{uid}.png")

    with open(original_path, "wb") as f:
        f.write(await file.read())

    img = cv2.imread(original_path)

    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    blur = cv2.GaussianBlur(gray, (51, 51), 0)

    heat = cv2.applyColorMap(blur, cv2.COLORMAP_JET)
    heatmap = cv2.addWeighted(img, 0.45, heat, 0.55, 0)

    heatmap_path = os.path.join(UPLOAD_FOLDER, f"{uid}_heatmap.png")
    cv2.imwrite(heatmap_path, heatmap)

    # Dummy AI Result (replace later with CNN)
    prediction = "Normal"
    confidence = 96.8

    pdf_path = os.path.join(REPORT_FOLDER, f"{uid}.pdf")

    styles = getSampleStyleSheet()
    doc = SimpleDocTemplate(pdf_path)

    story = []

    story.append(
        Paragraph(
            "<font size=24 color='#2563EB'><b>MediScan AI</b></font>",
            styles["Title"],
        )
    )

    story.append(
        Paragraph(
            "AI Chest X-Ray Pneumonia Detection Report",
            styles["Heading2"],
        )
    )

    story.append(Spacer(1, 0.2 * inch))

    table = Table(
        [
            ["Doctor", f"Dr. {username}"],
            ["Patient", patient_name],
            ["Age", str(age)],
            ["Gender", gender],
            ["Prediction", prediction],
            ["Confidence", f"{confidence}%"],
        ],
        colWidths=[2 * inch, 4 * inch],
    )

    table.setStyle(
        TableStyle(
            [
                ("GRID", (0, 0), (-1, -1), 0.5, colors.grey),
                ("BACKGROUND", (0, 0), (0, -1), colors.HexColor("#DBEAFE")),
                ("BACKGROUND", (1, 0), (1, -1), colors.white),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
                ("TOPPADDING", (0, 0), (-1, -1), 8),
            ]
        )
    )

    story.append(table)
    story.append(Spacer(1, 0.2 * inch))

    story.append(Paragraph("<b>Original X-Ray</b>", styles["Heading2"]))
    story.append(Image(original_path, width=4.8 * inch, height=4.8 * inch))

    story.append(Spacer(1, 0.15 * inch))

    story.append(Paragraph("<b>AI Heatmap</b>", styles["Heading2"]))
    story.append(Image(heatmap_path, width=4.8 * inch, height=4.8 * inch))

    story.append(Spacer(1, 0.2 * inch))

    story.append(Paragraph("<b>Doctor Description</b>", styles["Heading2"]))
    story.append(
        Paragraph(
            "The uploaded chest X-ray was analyzed using MediScan AI. "
            "No significant radiographic evidence of pneumonia was detected. "
            "This report supports clinical decision making and should always be verified by a qualified physician.",
            styles["BodyText"],
        )
    )

    story.append(Spacer(1, 0.15 * inch))

    story.append(Paragraph("<b>About Pneumonia</b>", styles["Heading2"]))
    story.append(
        Paragraph(
            "Pneumonia is an infection that inflames the lungs and may cause cough, fever, chest pain and breathing difficulty. "
            "Chest X-rays help identify abnormal lung opacities for early diagnosis.",
            styles["BodyText"],
        )
    )

    story.append(Spacer(1, 0.15 * inch))

    story.append(Paragraph("<b>AI Recommendation</b>", styles["Heading2"]))
    story.append(
        Paragraph(
            "No immediate signs of pneumonia were detected. Continue routine monitoring and consult a physician if symptoms persist.",
            styles["BodyText"],
        )
    )

    story.append(Spacer(1, 0.2 * inch))

    story.append(
        Paragraph(
            "<font color='grey' size=9>This report was automatically generated by MediScan AI.</font>",
            styles["BodyText"],
        )
    )

    doc.build(story)

    base_url = "https://mediscanai-bb2m.onrender.com"

    original_url = f"{base_url}/uploads/{uid}.png"
    heatmap_url = f"{base_url}/uploads/{uid}_heatmap.png"
    pdf_url = f"{base_url}/reports/{uid}.pdf"

    scan_date = datetime.now().strftime("%d/%m/%Y %I:%M %p")

    cursor.execute(
        """
        INSERT INTO scans
        (username,patient_name,age,gender,prediction,confidence,
        original_image,heatmap,pdf,date)
        VALUES(?,?,?,?,?,?,?,?,?,?)
        """,
        (
            username,
            patient_name,
            age,
            gender,
            prediction,
            confidence,
            original_url,
            heatmap_url,
            pdf_url,
            scan_date,
        ),
    )

    conn.commit()

    return {
        "username": username,
        "patient_name": patient_name,
        "age": age,
        "gender": gender,
        "prediction": prediction,
        "confidence": confidence,
        "original_image": original_url,
        "heatmap": heatmap_url,
        "pdf": pdf_url,
        "date": scan_date,
    }

# ---------------- HISTORY ----------------

@app.get("/history/{doctor}")
def get_history(doctor: str):

    cursor.execute(
        "SELECT username,patient_name,age,gender,prediction,confidence,original_image,heatmap,pdf,date FROM scans WHERE username=? ORDER BY id DESC",
        (doctor,),
    )

    rows = cursor.fetchall()

    history = []

    for r in rows:
        history.append({
            "username": r[0],
            "patient_name": r[1],
            "age": r[2],
            "gender": r[3],
            "prediction": r[4],
            "confidence": r[5],
            "original_image": r[6],
            "heatmap": r[7],
            "pdf": r[8],
            "date": r[9],
        })

    return history

# ---------------- PDF ----------------

@app.get("/pdf/{filename}")
def download_pdf(filename: str):
    path = os.path.join(REPORT_FOLDER, filename)
    return FileResponse(
        path,
        media_type="application/pdf",
        filename=filename,
    )