from reportlab.platypus import SimpleDocTemplate, Paragraph, Image
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib.units import inch
import requests
import os

styles = getSampleStyleSheet()

def download(url, path):
    r = requests.get(url)
    with open(path, "wb") as f:
        f.write(r.content)

def create_pdf(data, pdf_path):
    temp_original = "temp_original.png"
    temp_heat = "temp_heat.png"

    download(data["original_image"], temp_original)
    download(data["heatmap_image"], temp_heat)

    doc = SimpleDocTemplate(pdf_path)
    story = []

    story.append(Paragraph("<font size=22 color='blue'><b>MediScan AI</b></font>", styles["Title"]))
    story.append(Paragraph("AI Medical Diagnosis Report", styles["Normal"]))
    story.append(Paragraph("<br/>", styles["Normal"]))

    story.append(Paragraph(f"<b>Patient:</b> {data['patient_name']}", styles["Normal"]))
    story.append(Paragraph(f"<b>Age:</b> {data['age']}", styles["Normal"]))
    story.append(Paragraph(f"<b>Gender:</b> {data['gender']}", styles["Normal"]))
    story.append(Paragraph("<br/>", styles["Normal"]))

    story.append(Paragraph(
        f"<font size=18><b>Prediction: {data['disease']}</b></font>",
        styles["Heading2"]
    ))

    story.append(Paragraph(
        f"<font size=14>Confidence: {data['confidence']}%</font>",
        styles["Normal"]
    ))

    story.append(Paragraph("<br/>", styles["Normal"]))
    story.append(Paragraph("<b>Original X-Ray</b>", styles["Heading3"]))
    story.append(Image(temp_original, width=3*inch, height=3*inch))

    story.append(Paragraph("<br/>", styles["Normal"]))
    story.append(Paragraph("<b>AI Heatmap</b>", styles["Heading3"]))
    story.append(Image(temp_heat, width=3*inch, height=3*inch))

    story.append(Paragraph("<br/>", styles["Normal"]))

    if data["disease"] == "NORMAL":
        rec = "No significant pneumonia detected. Consult a doctor if symptoms persist."
    else:
        rec = "Possible pneumonia detected. Immediate medical consultation is recommended."

    story.append(Paragraph("<b>Doctor Recommendation</b>", styles["Heading2"]))
    story.append(Paragraph(rec, styles["Normal"]))

    doc.build(story)

    os.remove(temp_original)
    os.remove(temp_heat)