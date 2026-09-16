from reportlab.platypus import SimpleDocTemplate, Paragraph, Image
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib.units import inch
import os

styles = getSampleStyleSheet()

def create_pdf(data, pdf_path):
    base = os.path.dirname(os.path.abspath(__file__))

    # Read images directly from local folders
    original_file = os.path.basename(data["original_image"])
    heatmap_file = os.path.basename(data["heatmap_image"])

    original_path = os.path.join(base, "uploads", original_file)
    heatmap_path = os.path.join(base, "heatmaps", heatmap_file)

    doc = SimpleDocTemplate(pdf_path)
    story = []

    story.append(Paragraph("<font size=22 color='blue'><b>MediScan AI</b></font>", styles["Title"]))
    story.append(Paragraph("AI Medical Diagnosis Report", styles["Normal"]))
    story.append(Paragraph("<br/>", styles["Normal"]))

    story.append(Paragraph(f"<b>Patient:</b> {data['patient_name']}", styles["Normal"]))
    story.append(Paragraph(f"<b>Age:</b> {data['age']}", styles["Normal"]))
    story.append(Paragraph(f"<b>Gender:</b> {data['gender']}", styles["Normal"]))
    story.append(Paragraph("<br/>", styles["Normal"]))

    story.append(Paragraph(f"<b>Prediction:</b> {data['disease']}", styles["Heading2"]))
    story.append(Paragraph(f"<b>Confidence:</b> {data['confidence']}%", styles["Normal"]))
    story.append(Paragraph("<br/>", styles["Normal"]))

    story.append(Paragraph("<b>Original X-Ray</b>", styles["Heading3"]))
    story.append(Image(original_path, width=3*inch, height=3*inch))

    story.append(Paragraph("<br/>", styles["Normal"]))

    story.append(Paragraph("<b>AI Heatmap</b>", styles["Heading3"]))
    story.append(Image(heatmap_path, width=3*inch, height=3*inch))

    story.append(Paragraph("<br/>", styles["Normal"]))

    if data["disease"] == "NORMAL":
        rec = "No significant pneumonia detected. Continue a healthy lifestyle."
    else:
        rec = "Possible pneumonia detected. Please consult a physician immediately."

    story.append(Paragraph("<b>Doctor Recommendation</b>", styles["Heading2"]))
    story.append(Paragraph(rec, styles["Normal"]))

    doc.build(story)