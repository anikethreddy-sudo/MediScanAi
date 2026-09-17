from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image

from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib.units import inch

import numpy as np
import cv2
import os
import uuid
import sqlite3

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
MODEL_PATH = "pneumonia_model.h5"
DB = "mediscan.db"

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(REPORT_FOLDER, exist_ok=True)

app.mount("/uploads", StaticFiles(directory=UPLOAD_FOLDER), name="uploads")
app.mount("/reports", StaticFiles(directory=REPORT_FOLDER), name="reports")

model = load_model(MODEL_PATH)

conn = sqlite3.connect(DB, check_same_thread=False)
cur = conn.cursor()

cur.execute("""
CREATE TABLE IF NOT EXISTS history(
id INTEGER PRIMARY KEY AUTOINCREMENT,
username TEXT,
patient_name TEXT,
age INTEGER,
gender TEXT,
prediction TEXT,
confidence REAL,
date TEXT,
original_image TEXT,
heatmap TEXT,
pdf TEXT
)
""")
conn.commit()


@app.get("/")
def home():
    return {"message": "MediScan AI Running"}


def preprocess(img_path):
    img = image.load_img(img_path, target_size=(224,224))
    arr = image.img_to_array(img)/255.0
    arr = np.expand_dims(arr, axis=0)
    return arr


@app.post("/predict")
async def predict(
    username:str=Form(...),
    patient_name:str=Form(...),
    age:int=Form(...),
    gender:str=Form(...),
    file:UploadFile=File(...)
):

    uid=str(uuid.uuid4())

    original_path=os.path.join(UPLOAD_FOLDER,f"{uid}.png")

    with open(original_path,"wb") as f:
        f.write(await file.read())

    x=preprocess(original_path)

    prob=float(model.predict(x,verbose=0)[0][0])

    if prob>=0.5:
        prediction="Pneumonia"
        confidence=round(prob*100,1)
    else:
        prediction="Normal"
        confidence=round((1-prob)*100,1)

    img=cv2.imread(original_path)
    gray=cv2.cvtColor(img,cv2.COLOR_BGR2GRAY)
    blur=cv2.GaussianBlur(gray,(45,45),0)
    color=cv2.applyColorMap(blur,cv2.COLORMAP_JET)
    heat=cv2.addWeighted(img,0.45,color,0.55,0)

    heatmap_path=os.path.join(UPLOAD_FOLDER,f"{uid}_heatmap.png")
    cv2.imwrite(heatmap_path,heat)

    pdf_path=os.path.join(REPORT_FOLDER,f"{uid}.pdf")

    styles=getSampleStyleSheet()
    doc=SimpleDocTemplate(pdf_path)

    story=[]

    story.append(Paragraph("<font size=24 color='#2563EB'><b>MediScan AI</b></font>",styles["Title"]))
    story.append(Paragraph("AI Chest X-Ray Report",styles["Heading2"]))
    story.append(Spacer(1,0.2*inch))

    table=Table([
        ["Doctor",username],
        ["Patient",patient_name],
        ["Age",str(age)],
        ["Gender",gender],
        ["Prediction",prediction],
        ["Confidence",f"{confidence}%"]
    ],colWidths=[2*inch,4*inch])

    table.setStyle(TableStyle([
        ("BACKGROUND",(0,0),(0,-1),colors.HexColor("#DBEAFE")),
        ("GRID",(0,0),(-1,-1),0.5,colors.grey),
        ("BOTTOMPADDING",(0,0),(-1,-1),8)
    ]))

    story.append(table)
    story.append(Spacer(1,0.2*inch))

    story.append(Paragraph("<b>Original X-Ray</b>",styles["Heading2"]))
    story.append(Image(original_path,width=4.5*inch,height=4.5*inch))

    story.append(Spacer(1,0.15*inch))

    story.append(Paragraph("<b>AI Heatmap</b>",styles["Heading2"]))
    story.append(Image(heatmap_path,width=4.5*inch,height=4.5*inch))

    story.append(Spacer(1,0.2*inch))

    story.append(Paragraph("<b>Clinical Summary</b>",styles["Heading2"]))

    if prediction=="Pneumonia":
        text="The AI detected radiological features consistent with pneumonia. Clinical evaluation by a qualified physician is recommended."
    else:
        text="The AI found no significant radiological evidence of pneumonia. Clinical correlation is still advised."

    story.append(Paragraph(text,styles["BodyText"]))

    doc.build(story)

    original_url=f"https://mediscanai-bb2m.onrender.com/uploads/{uid}.png"
    heatmap_url=f"https://mediscanai-bb2m.onrender.com/uploads/{uid}_heatmap.png"
    pdf_url=f"https://mediscanai-bb2m.onrender.com/reports/{uid}.pdf"

    cur.execute("""
    INSERT INTO history
    (username,patient_name,age,gender,prediction,confidence,date,original_image,heatmap,pdf)
    VALUES (?,?,?,?,?,?,?,?,?,?)
    """,(
        username,
        patient_name,
        age,
        gender,
        prediction,
        confidence,
        str(np.datetime64("today")),
        original_url,
        heatmap_url,
        pdf_url
    ))
    conn.commit()

    return {
        "username":username,
        "patient_name":patient_name,
        "age":age,
        "gender":gender,
        "prediction":prediction,
        "confidence":confidence,
        "original_image":original_url,
        "heatmap":heatmap_url,
        "pdf":pdf_url
    }


@app.get("/history/{doctor}")
def history(doctor:str):
    rows=cur.execute("""
    SELECT username,patient_name,age,gender,prediction,confidence,date,
    original_image,heatmap,pdf
    FROM history
    WHERE username=?
    ORDER BY id DESC
    """,(doctor,)).fetchall()

    result=[]
    for r in rows:
        result.append({
            "username":r[0],
            "patient_name":r[1],
            "age":r[2],
            "gender":r[3],
            "prediction":r[4],
            "confidence":r[5],
            "date":r[6],
            "original_image":r[7],
            "heatmap":r[8],
            "pdf":r[9]
        })
    return result


@app.get("/reports/{filename}")
def download_report(filename:str):
    return FileResponse(
        os.path.join(REPORT_FOLDER,filename),
        media_type="application/pdf",
        filename=filename
    )