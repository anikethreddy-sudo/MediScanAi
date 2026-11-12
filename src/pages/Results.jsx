
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

function ResultImage({ title, src, description }) {
  const [failed, setFailed] = useState(false);

  return (
    <div className="resultImagePanel">
      <h3>{title}</h3>
      {src && !failed ? (
        <img src={src} alt={title} onError={() => setFailed(true)} />
      ) : (
        <div className="resultImagePlaceholder">
          {failed ? "This image could not be loaded." : description}
        </div>
      )}
    </div>
  );
}

export default function Results() {
  const navigate = useNavigate();
  const [printing, setPrinting] = useState(false);

  let result = {};

  try {
    result = JSON.parse(localStorage.getItem("result") || "{}");
  } catch {
    result = {};
  }

  const patientId =
    result.patient_id || result.patientId || "Not available";

  const patientName =
    result.patient_name ||
    result.patientName ||
    result.name ||
    "Not provided";

  const patientAge =
    result.patient_age ??
    result.patientAge ??
    result.age ??
    "Not provided";

  const patientGender =
    result.patient_gender ||
    result.patientGender ||
    result.gender ||
    "Not provided";

  const doctorName =
    result.doctor_name ||
    result.doctorName ||
    localStorage.getItem("doctorName") ||
    "Not provided";

  const reportDate = result.created_at
    ? new Date(result.created_at).toLocaleString()
    : result.scan_date
      ? new Date(result.scan_date).toLocaleString()
      : new Date().toLocaleString();

  // ORIGINAL PNEUMONIA MODEL RESULT

  const prediction = result.prediction || "Unknown";

  const isPneumonia =
    prediction === "Pneumonia" ||
    prediction === "Pneumonia Suspected";

  const isNormal =
    prediction === "Normal" ||
    prediction === "No Strong Pneumonia-like Pattern Detected";

  const isInconclusive = prediction === "Inconclusive";

  const displayPrediction = isPneumonia
    ? "Pneumonia"
    : isNormal
      ? "Normal"
      : isInconclusive
        ? "Inconclusive"
        : prediction;

  // MODEL SCORE

  const selectedModelScore =
    result.pneumonia_probability ??
    result.normal_probability ??
    result.confidence ??
    null;

  const numericModelScore =
    selectedModelScore !== null &&
    selectedModelScore !== undefined &&
    selectedModelScore !== "" &&
    Number.isFinite(Number(selectedModelScore))
      ? Number(selectedModelScore)
      : null;

  const modelScorePercentage =
    numericModelScore !== null
      ? `${
          numericModelScore <= 1
            ? (numericModelScore * 100).toFixed(1)
            : numericModelScore.toFixed(1)
        }%`
      : null;

  // MODEL INTERPRETATION

  const aiFinding =
    result.ai_finding ||
    result.aiFinding ||
    (
      isInconclusive
        ? "The model could not reliably distinguish between its supported categories."
        : isPneumonia
          ? "The model detected a pattern that may be associated with pneumonia."
          : isNormal
            ? "The model did not detect a strong pneumonia-like pattern."
            : "The model result is unavailable."
    );

  const why =
    result.why ||
    result.reasoning ||
    "The model analyzes patterns in the uploaded chest X-ray. Its output is a screening aid, not a confirmed diagnosis.";

  const counterpoint =
    result.counterpoint ||
    "An AI model can make mistakes. Its output should be considered alongside symptoms and professional medical assessment.";

  const screeningNotice =
    result.screening_notice ||
    result.screeningNotice ||
    (
      isInconclusive
        ? "The model could not reach a clear result. This assessment requires review by a qualified healthcare professional."
        : "This result is intended for screening support only. It cannot confirm or rule out a disease."
    );

  const riskLevel =
    result.risk_level ||
    result.riskLevel ||
    (
      isInconclusive
        ? "Needs further assessment"
        : isPneumonia
          ? "Medical review recommended"
          : "Lower model concern"
    );

  const recommendedAction =
    result.recommended_action ||
    result.recommendedAction ||
    (
      isInconclusive
        ? "Do not treat this result as a diagnosis. A healthcare professional should assess the X-ray and symptoms."
        : isPneumonia
          ? "Arrange a medical evaluation. Seek urgent care for severe breathing difficulty or rapidly worsening symptoms."
          : "If symptoms continue or worsen, consult a healthcare professional even if the model indicates a lower concern."
    );

  const precautions = Array.isArray(result.precautions)
    ? result.precautions
    : [
        "Seek medical advice if symptoms persist or worsen.",
        "Discuss the X-ray and symptoms with a qualified healthcare professional.",
        "Avoid smoking and second-hand smoke.",
        "Use medicines, including antibiotics, only as advised by a healthcare professional.",
        "Seek emergency help for severe breathing difficulty, blue or grey lips, or sudden confusion."
      ];

  // IMAGE URLS

  const getImageUrl = (value) => {
    if (!value || typeof value !== "string") return "";

    if (
      value.startsWith("data:image/") ||
      value.startsWith("blob:")
    ) {
      return value;
    }

    if (/^https?:\/\//i.test(value)) {
      return value;
    }

    if (value.startsWith("/")) {
      return `${API_URL}${value}`;
    }

    return value;
  };

  const originalImage = getImageUrl(
    result.image_url ||
    result.original_image_url ||
    result.image ||
    result.original_image
  );

  const heatmapImage = getImageUrl(
    result.heatmap_url ||
    result.gradcam_url ||
    result.heatmap ||
    result.gradcam_image
  );

  // RESULT COLOUR CLASS

  const statusClass = isInconclusive
    ? "inconclusiveResult"
    : isPneumonia
      ? "pneumoniaResult"
      : isNormal
        ? "normalResult"
        : "inconclusiveResult";

  const resultDescription = isInconclusive
    ? "The model could not reliably distinguish between its supported categories."
    : isPneumonia
      ? "A pneumonia-like pattern was detected by the model."
      : isNormal
        ? "No strong pneumonia-like pattern was detected by the model."
        : "The model result is unavailable.";

  const resultIndicator = isInconclusive
    ? "?"
    : isPneumonia
      ? "P"
      : isNormal
        ? "N"
        : "—";

  const handlePrint = () => {
    setPrinting(true);
    window.print();
    setTimeout(() => setPrinting(false), 500);
  };

  return (
    <>
      <Navbar />

      <main className="resultsPage">
        <div className="resultsContainer">

          <header className="resultsHeader noPrint">
            <div>
              <p className="resultsEyebrow">
                PATIENT RECORD / ANALYSIS
              </p>

              <h1>Screening report</h1>

              <p className="resultsSubtitle">
                Chest X-ray assessment and model findings
              </p>
            </div>

            <div className="resultsButtons">
              <button
                className="secondaryButton"
                onClick={() => navigate(-1)}
              >
                Back
              </button>

              <button
                className="primaryButton"
                onClick={handlePrint}
                disabled={printing}
              >
                {printing ? "Preparing..." : "Print report"}
              </button>
            </div>
          </header>

          <section className="patientCard">
            <div className="sectionHeading">
              <div>
                <h2>Patient Information</h2>
                <p>Details recorded for this assessment</p>
              </div>

              <span className="recordLabel">
                PATIENT RECORD
              </span>
            </div>

            <div className="patientGrid">
              <div className="patientField patientIdField">
                <span>Permanent Patient ID</span>
                <strong>{patientId}</strong>
              </div>

              <div className="patientField">
                <span>Patient Name</span>
                <strong>{patientName}</strong>
              </div>

              <div className="patientField">
                <span>Age</span>
                <strong>{patientAge}</strong>
              </div>

              <div className="patientField">
                <span>Gender</span>
                <strong>{patientGender}</strong>
              </div>

              <div className="patientField">
                <span>Doctor</span>
                <strong>{doctorName}</strong>
              </div>
            </div>

            <div className="reportDate">
              <span>Report generated</span>
              <strong>{reportDate}</strong>
            </div>
          </section>

          <section className={`resultCard ${statusClass}`}>
            <div className="resultCardContent">
              <div>
                <span className="resultLabel">
                  SCREENING RESULT
                </span>

                <h2>{displayPrediction}</h2>

                {modelScorePercentage && (
                  <div className="modelScore">
                    <span>Model score</span>
                    <strong>{modelScorePercentage}</strong>
                  </div>
                )}

                <p>{resultDescription}</p>
              </div>

              <div className="resultIndicator">
                {resultIndicator}
              </div>
            </div>
          </section>

          <section className="informationCard">
            <div className="sectionHeading">
              <div>
                <h2>Important Medical Notice</h2>
                <p>Please read before interpreting this result</p>
              </div>
            </div>

            <p>{screeningNotice}</p>
          </section>

          <section className="detailCard">
            <div className="sectionHeading">
              <div>
                <h2>Model Interpretation</h2>
                <p>What the system returned from this scan</p>
              </div>
            </div>

            <div className="detailItem">
              <h3>Model finding</h3>
              <p>{aiFinding}</p>
            </div>

            <div className="detailItem">
              <h3>How to understand this result</h3>
              <p>{why}</p>
            </div>

            <div className="detailItem">
              <h3>Limitations</h3>
              <p>{counterpoint}</p>
            </div>
          </section>

          <section className="detailCard">
            <div className="sectionHeading">
              <div>
                <h2>Follow-up Information</h2>
                <p>Suggested next steps for this screening result</p>
              </div>
            </div>

            <div className="screeningStatus">
              <span>Screening status</span>
              <strong>{riskLevel}</strong>
            </div>

            <div className="detailItem">
              <h3>Recommended action</h3>
              <p>{recommendedAction}</p>
            </div>

            <div className="detailItem">
              <h3>Precautions</h3>

              <ul>
                {precautions.map((item, index) => (
                  <li key={`${index}-${item}`}>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section className="imagesCard">
            <div className="sectionHeading">
              <div>
                <h2>Scan Images</h2>
                <p>Original image and model attention view</p>
              </div>
            </div>

            <p className="imagesDescription">
              The Grad-CAM heatmap shows image regions that
              influenced the model's output. It is not a
              verified map of disease.
            </p>

            <div className="imageGrid">
              <ResultImage
                title="Original chest X-ray"
                src={originalImage}
                description="The original X-ray is not available."
              />

              <ResultImage
                title="Model attention heatmap"
                src={heatmapImage}
                description="The attention heatmap is not available."
              />
            </div>
          </section>

          <section className="disclaimerCard">
            <h2>A note about this report</h2>

            <p>
              MediScan AI is an experimental screening-support
              tool that classifies chest X-ray images into its
              supported model categories. It is not a substitute
              for a radiologist or another qualified healthcare
              professional. A result marked normal does not
              guarantee that a person is healthy, and a suspected
              result does not confirm pneumonia. Do not make
              treatment decisions using this report alone.
            </p>
          </section>

          <div className="bottomButtons noPrint">
            <button
              className="secondaryButton"
              onClick={() => navigate("/")}
            >
              Back to Home
            </button>

            <button
              className="primaryButton"
              onClick={() => navigate("/upload")}
            >
              Analyze another X-ray
            </button>
          </div>

        </div>
      </main>

      <style>{`
        .resultsPage {
          --green: #08785B;
          --green-dark: #075C46;
          --green-soft: #EAF5EF;
          --text: #183A2E;
          --muted: #82948A;
          --border: #E3EDE6;

          min-height: 100vh;
          padding: 42px 32px 70px;
          background: #F5FAF6;
          color: var(--text);
          font-family: "Poppins", sans-serif;
          font-weight: 300;
        }

        .resultsPage * {
          box-sizing: border-box;
          font-family: "Poppins", sans-serif;
          font-weight: 300;
        }

        .resultsPage button {
          font-family: inherit;
          font-weight: 300;
        }

        .resultsContainer {
          width: 100%;
          max-width: 1320px;
          margin: auto;
          display: flex;
          flex-direction: column;
          gap: 22px;
        }

        .resultsHeader {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 20px;
          margin-bottom: 10px;
        }

        .resultsEyebrow,
        .resultLabel {
          margin: 0 0 12px;
          color: var(--green);
          font-size: 10px;
          font-weight: 400;
          letter-spacing: 1.7px;
        }

        .resultsHeader h1 {
          margin: 0;
          color: #173B2D;
          font-size: 30px;
          font-weight: 300;
          letter-spacing: -1px;
        }

        .resultsSubtitle {
          margin: 9px 0 0;
          color: var(--muted);
          font-size: 12px;
          line-height: 1.8;
        }

        .resultsButtons,
        .bottomButtons {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .primaryButton,
        .secondaryButton {
          padding: 12px 19px;
          border-radius: 7px;
          font-size: 12px;
          cursor: pointer;
          transition: all .2s ease;
        }

        .primaryButton {
          background: var(--green);
          border: 1px solid var(--green);
          color: #FFFFFF;
        }

        .primaryButton:hover {
          background: var(--green-dark);
          border-color: var(--green-dark);
          transform: translateY(-2px);
        }

        .secondaryButton {
          background: #FFFFFF;
          border: 1px solid #DCEBE0;
          color: var(--green-dark);
        }

        .secondaryButton:hover {
          background: var(--green-soft);
          border-color: #BBDCC8;
        }

        .primaryButton:disabled {
          opacity: .6;
          cursor: not-allowed;
        }

        .patientCard,
        .resultCard,
        .informationCard,
        .detailCard,
        .imagesCard,
        .disclaimerCard {
          background: #FFFFFF;
          border: 1px solid var(--border);
          border-radius: 11px;
          box-shadow: 0 4px 18px rgba(26, 77, 51, .035);
        }

        .patientCard {
          padding: 27px;
        }

        .sectionHeading {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 15px;
          margin-bottom: 22px;
        }

        .sectionHeading h2 {
          margin: 0;
          color: #214A36;
          font-size: 16px;
          font-weight: 400;
        }

        .sectionHeading p {
          margin: 7px 0 0;
          color: #94A198;
          font-size: 10px;
          line-height: 1.7;
        }

        .recordLabel {
          padding: 7px 10px;
          background: var(--green-soft);
          border-radius: 5px;
          color: var(--green);
          font-size: 9px;
          letter-spacing: .8px;
          white-space: nowrap;
        }

        .patientGrid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 13px;
        }

        .patientField {
          min-width: 0;
          padding: 18px;
          background: #F5FAF6;
          border: 1px solid var(--border);
          border-radius: 8px;
          display: flex;
          flex-direction: column;
          gap: 9px;
        }

        .patientIdField {
          background: #EAF5EF;
          border-color: #CFE5D6;
        }

        .patientIdField strong {
          color: #08785B;
          font-size: 14px;
          letter-spacing: .3px;
        }

        .patientField span {
          color: #82948A;
          font-size: 10px;
        }

        .patientField strong {
          color: #214A36;
          font-size: 13px;
          font-weight: 400;
          overflow-wrap: anywhere;
        }

        .reportDate {
          display: flex;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 19px;
          padding-top: 16px;
          border-top: 1px solid #EAF0EB;
          color: #82948A;
          font-size: 10px;
        }

        .reportDate strong {
          color: #345344;
          font-weight: 400;
        }

        .resultCard {
          padding: 30px 32px;
          border-radius: 11px;
          border: 1px solid transparent;
        }

        .resultCardContent {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 25px;
        }

        .resultCard h2 {
          margin: 0 0 8px;
          font-size: 32px;
          font-weight: 300;
          line-height: 1.35;
        }

        .resultCard p {
          margin: 0;
          font-size: 12px;
          line-height: 1.8;
        }

        .modelScore {
          display: flex;
          align-items: center;
          gap: 9px;
          margin: 4px 0 12px;
        }

        .modelScore span {
          font-size: 11px;
        }

        .modelScore strong {
          font-size: 19px;
          font-weight: 400;
        }

        .resultIndicator {
          width: 58px;
          height: 58px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 12px;
          font-size: 23px;
          font-weight: 300;
          flex-shrink: 0;
        }

        .resultCard.normalResult {
          background: #EAF5EF;
          border: 1px solid #CFE5D6;
        }

        .resultCard.normalResult .resultLabel,
        .resultCard.normalResult h2,
        .resultCard.normalResult p,
        .resultCard.normalResult .modelScore span,
        .resultCard.normalResult .modelScore strong {
          color: #176B4B;
        }

        .resultCard.normalResult .resultIndicator {
          background: #D3EBDD;
          color: #176B4B;
        }

        .resultCard.pneumoniaResult {
          background: #FCEDEE;
          border: 1px solid #F0CED1;
        }

        .resultCard.pneumoniaResult .resultLabel,
        .resultCard.pneumoniaResult h2,
        .resultCard.pneumoniaResult p,
        .resultCard.pneumoniaResult .modelScore span,
        .resultCard.pneumoniaResult .modelScore strong {
          color: #A83D45;
        }

        .resultCard.pneumoniaResult .resultIndicator {
          background: #F6DADD;
          color: #A83D45;
        }

        .resultCard.inconclusiveResult {
          background: #FBF7ED;
          border: 1px solid #E8D8B4;
        }

        .resultCard.inconclusiveResult .resultLabel,
        .resultCard.inconclusiveResult h2,
        .resultCard.inconclusiveResult p,
        .resultCard.inconclusiveResult .modelScore span,
        .resultCard.inconclusiveResult .modelScore strong {
          color: #80601F;
        }

        .resultCard.inconclusiveResult .resultIndicator {
          background: #F2E8CE;
          color: #80601F;
        }

        .informationCard,
        .detailCard,
        .imagesCard,
        .disclaimerCard {
          padding: 27px;
        }

        .informationCard {
          background: #F0F7F1;
          border-color: #DFECE2;
        }

        .informationCard > p {
          color: #60796B;
          font-size: 11px;
          line-height: 1.9;
        }

        .detailItem {
          padding: 16px 0;
          border-bottom: 1px solid #EDF2EE;
        }

        .detailItem:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }

        .detailItem h3 {
          margin: 0 0 8px;
          color: #345344;
          font-size: 12px;
          font-weight: 400;
        }

        .detailItem p,
        .detailItem li {
          color: #82948A;
          font-size: 11px;
          line-height: 1.9;
        }

        .detailItem p {
          margin: 0;
        }

        .detailItem ul {
          margin: 0;
          padding-left: 20px;
        }

        .screeningStatus {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 12px;
          padding: 15px 17px;
          background: #F2F8F4;
          border: 1px solid #E3EDE6;
          border-radius: 7px;
        }

        .screeningStatus span {
          color: #82948A;
          font-size: 11px;
        }

        .screeningStatus strong {
          color: var(--green);
          font-size: 11px;
          font-weight: 400;
        }

        .imagesDescription {
          margin: -7px 0 20px;
          color: #82948A;
          font-size: 11px;
          line-height: 1.8;
        }

        .imageGrid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 16px;
        }

        .resultImagePanel {
          min-width: 0;
          padding: 17px;
          background: #F5FAF6;
          border: 1px solid var(--border);
          border-radius: 8px;
        }

        .resultImagePanel h3 {
          margin: 0 0 13px;
          color: #345344;
          font-size: 12px;
          font-weight: 400;
        }

        .resultImagePanel img {
          display: block;
          width: 100%;
          max-height: 420px;
          object-fit: contain;
          background: #EAF1EC;
          border-radius: 6px;
        }

        .resultImagePlaceholder {
          min-height: 210px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          background: #F0F7F1;
          border: 1px dashed #C8DCCF;
          border-radius: 6px;
          color: #82948A;
          font-size: 11px;
          text-align: center;
        }

        .disclaimerCard {
          background: #F0F7F1;
          border-color: #DFECE2;
        }

        .disclaimerCard h2 {
          margin: 0 0 10px;
          color: #214A36;
          font-size: 15px;
          font-weight: 400;
        }

        .disclaimerCard p {
          margin: 0;
          color: #71877B;
          font-size: 11px;
          line-height: 1.9;
        }

        .bottomButtons {
          justify-content: space-between;
          padding-top: 2px;
        }

        @media(max-width: 900px) {
          .patientGrid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .resultCard h2 {
            font-size: 28px;
          }
        }

        @media(max-width: 650px) {
          .resultsPage {
            padding: 27px 15px 45px;
          }

          .resultsContainer {
            gap: 17px;
          }

          .patientCard,
          .resultCard,
          .informationCard,
          .detailCard,
          .imagesCard,
          .disclaimerCard {
            padding: 20px 17px;
          }

          .patientGrid,
          .imageGrid {
            grid-template-columns: 1fr;
          }

          .resultCardContent {
            align-items: flex-start;
          }

          .resultCard h2 {
            font-size: 26px;
          }

          .resultIndicator {
            width: 45px;
            height: 45px;
            font-size: 19px;
          }

          .resultsHeader h1 {
            font-size: 26px;
          }

          .resultsButtons,
          .resultsButtons button,
          .bottomButtons,
          .bottomButtons button {
            width: 100%;
          }

          .sectionHeading h2 {
            font-size: 15px;
          }
        }

        @media print {
          @page {
            margin: 14mm;
          }

          body {
            background: white !important;
          }

          .resultsPage {
            background: white !important;
            padding: 0;
          }

          .resultsContainer {
            max-width: 100%;
            gap: 13px;
          }

          .noPrint,
          nav {
            display: none !important;
          }

          .patientCard,
          .resultCard,
          .informationCard,
          .detailCard,
          .imagesCard,
          .disclaimerCard {
            box-shadow: none;
            break-inside: avoid;
            page-break-inside: avoid;
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }

          .resultImagePanel img {
            max-height: 260px;
          }
        }
      `}</style>
    </>
  );
}
