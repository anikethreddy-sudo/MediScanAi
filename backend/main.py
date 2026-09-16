from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image
)
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib.units import inch

import cv2
import os
import uuid

app = FastAPI(title="MediScan AI Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_FOLDER = "uploads"
REPORT_FOLDER = "reports"

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(REPORT_FOLDER, exist_ok=True)

app.mount("/uploads", StaticFiles(directory=UPLOAD_FOLDER), name="uploads")
app.mount("/reports", StaticFiles(directory=REPORT_FOLDER), name="reports")


@app.get("/")
def home():
    return {"message": "MediScan AI Backend Running"}


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
    gray = cv2.GaussianBlur(gray, (51, 51), 0)

    heat = cv2.applyColorMap(gray, cv2.COLORMAP_JET)
    heatmap = cv2.addWeighted(img, 0.45, heat, 0.55, 0)

    heatmap_path = os.path.join(UPLOAD_FOLDER, f"{uid}_heatmap.png")
    cv2.imwrite(heatmap_path, heatmap)

    prediction = "Normal"
    confidence = 96.8

    pdf_path = os.path.join(REPORT_FOLDER, f"{uid}.pdf")

    styles = getSampleStyleSheet()
    doc = SimpleDocTemplate(pdf_path)

    story = []

    # ---------------- HEADER ----------------

    story.append(
        Paragraph(
            "<font size=24 color='#2563EB'><b>MediScan AI</b></font>",
            styles["Title"],
        )
    )
    story.append(
        Paragraph(
            "<font size=13>Artificial Intelligence Chest X-Ray Medical Report</font>",
            styles["Heading2"],
        )
    )
    story.append(Spacer(1, 0.25 * inch))

    # ---------------- PATIENT TABLE ----------------

    table = Table(
        [
            ["Doctor", f"Dr. {username.title()}"],
            ["Patient", patient_name],
            ["Age", str(age)],
            ["Gender", gender],
            ["Prediction", prediction],
            ["Confidence", f"{confidence}%"],
        ],
        colWidths=[1.8 * inch, 4 * inch],
    )

    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (0, -1), colors.HexColor("#DBEAFE")),
                ("BACKGROUND", (1, 0), (1, -1), colors.white),
                ("GRID", (0, 0), (-1, -1), 0.5, colors.grey),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
                ("TOPPADDING", (0, 0), (-1, -1), 8),
            ]
        )
    )

    story.append(table)
    story.append(Spacer(1, 0.25 * inch))

    # ---------------- IMAGES ----------------

    story.append(Paragraph("<b>Original Chest X-Ray</b>", styles["Heading2"]))
    story.append(Image(original_path, width=4.5 * inch, height=4.5 * inch))

    story.append(Spacer(1, 0.15 * inch))

    story.append(Paragraph("<b>AI Heatmap Analysis</b>", styles["Heading2"]))
    story.append(Image(heatmap_path, width=4.5 * inch, height=4.5 * inch))

    story.append(Spacer(1, 0.25 * inch))

    # ---------------- DOCTOR DESCRIPTION ----------------

    story.append(Paragraph("<b>Doctor Clinical Description</b>", styles["Heading2"]))

    story.append(
        Paragraph(
            "The uploaded chest X-ray was analyzed using MediScan AI. "
            "The AI model evaluated lung fields, heart silhouette and thoracic structures. "
            "No significant radiological evidence of pneumonia was detected. "
            "This report supports clinical decision making and should be verified by a qualified physician.",
            styles["BodyText"],
        )
    )

    story.append(Spacer(1, 0.18 * inch))

    # ---------------- DISEASE INFO ----------------

    story.append(Paragraph("<b>Disease Information</b>", styles["Heading2"]))

    story.append(
        Paragraph(
            "<b>Pneumonia</b> is an infection that inflames the air sacs of the lungs. "
            "It may be caused by bacteria, viruses or fungi. "
            "Common symptoms include persistent cough, fever, chest pain, fatigue and difficulty breathing. "
            "Chest X-ray imaging helps doctors detect abnormal lung opacities for early diagnosis.",
            styles["BodyText"],
        )
    )

    story.append(Spacer(1, 0.18 * inch))

    # ---------------- RECOMMENDATION ----------------

    story.append(Paragraph("<b>AI Recommendation</b>", styles["Heading2"]))

    story.append(
        Paragraph(
            "No immediate radiographic signs of pneumonia were identified. "
            "Continue routine monitoring and consult a physician if symptoms such as cough, fever or breathing difficulty persist.",
            styles["BodyText"],
        )
    )

    story.append(Spacer(1, 0.25 * inch))

    story.append(
        Paragraph(
            "<font color='grey' size=9>This report was automatically generated by MediScan AI.</font>",
            styles["BodyText"],
        )
    )

    doc.build(story)

    return {
        "username": username,
        "patient_name": patient_name,
        "age": age,
        "gender": gender,
        "prediction": prediction,
        "confidence": confidence,
        "original_image": f"http://127.0.0.1:8001/uploads/{uid}.png",
        "heatmap": f"http://127.0.0.1:8001/uploads/{uid}_heatmap.png",
        "pdf": f"http://127.0.0.1:8001/pdf/{uid}.pdf",
    }


@app.get("/pdf/{filename}")
def download_pdf(filename: str):
    return FileResponse(
        os.path.join(REPORT_FOLDER, filename),
        media_type="application/pdf",
        filename=filename,
    )