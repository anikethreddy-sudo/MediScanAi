import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const API = "http://127.0.0.1:8000";

export default function Results() {

  const navigate = useNavigate();

  const [result] = useState(() => {

    try {

      return JSON.parse(
        localStorage.getItem(
          "result"
        ) || "null"
      );

    } catch {

      return null;

    }

  });


  const getImageUrl = (path) => {

    if (!path) {
      return "";
    }

    if (
      path.startsWith("http://") ||
      path.startsWith("https://")
    ) {

      return path;

    }

    return `${API}${path}`;

  };


  const downloadPDF = () => {

    window.print();

  };


  if (!result) {

    return (
      <>
        <Navbar />

        <div
          style={{
            minHeight: "80vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#EEF4FF",
            flexDirection: "column",
            gap: "20px"
          }}
        >

          <h2>
            No Result Available
          </h2>

          <button
            onClick={() =>
              navigate("/upload")
            }
            style={{
              padding: "12px 25px",
              border: "none",
              borderRadius: "10px",
              background: "#2563EB",
              color: "white",
              cursor: "pointer"
            }}
          >
            Go to Upload
          </button>

        </div>
      </>
    );

  }


  const prediction =
    result.prediction || "Unknown";


  const confidence =
    result.confidence ?? 0;


  const pneumoniaProbability =
    result.pneumonia_probability ??
    (
      prediction === "Pneumonia"
        ? confidence
        : 100 - confidence
    );


  const normalProbability =
    result.normal_probability ??
    (
      prediction === "Normal"
        ? confidence
        : 100 - confidence
    );


  const originalImage =
    getImageUrl(
      result.original_image
    );


  const heatmapImage =
    getImageUrl(
      result.heatmap
    );


  return (
    <>
      <style>{`

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-family: Poppins, sans-serif;
        }

        body {
          background: #EEF4FF;
        }

        .resultsPage {
          min-height: 100vh;
          background: #EEF4FF;
        }

        .resultsContainer {
          max-width: 1250px;
          margin: auto;
          padding: 35px 25px 60px;
        }

        .reportHeader {
          background: white;
          border-radius: 22px;
          padding: 25px 30px;
          margin-bottom: 25px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-shadow:
            0 10px 30px rgba(0,0,0,0.06);
        }

        .reportTitle {
          color: #102A56;
          font-size: 30px;
          font-weight: 300;
        }

        .reportSubtitle {
          color: #64748B;
          margin-top: 6px;
        }

        .actions {
          display: flex;
          gap: 12px;
        }

        .actionButton {
          border: none;
          border-radius: 12px;
          padding: 13px 18px;
          font-size: 15px;
          font-weight: 300;
          cursor: pointer;
        }

        .pdfButton {
          background: #2563EB;
          color: white;
        }

        .backButton {
          background: #E2E8F0;
          color: #334155;
        }

        .patientCard {
          background: white;
          border-radius: 22px;
          padding: 25px 30px;
          margin-bottom: 25px;
          box-shadow:
            0 10px 30px rgba(0,0,0,0.06);
        }

        .patientTitle {
          color: #102A56;
          font-size: 22px;
          font-weight: 300;
          margin-bottom: 18px;
        }

        .patientGrid {
          display: grid;
          grid-template-columns:
            repeat(4, 1fr);
          gap: 15px;
        }

        .patientItem {
          background: #F8FAFC;
          padding: 15px;
          border-radius: 12px;
        }

        .label {
          color: #94A3B8;
          font-size: 12px;
          margin-bottom: 5px;
        }

        .value {
          color: #334155;
          font-size: 16px;
          font-weight: 300;
        }

        .resultCard {
          background: white;
          border-radius: 22px;
          padding: 25px 30px;
          margin-bottom: 25px;
          box-shadow:
            0 10px 30px rgba(0,0,0,0.06);
          border-left: 6px solid #2563EB;
        }

        .resultRow {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .resultName {
          font-size: 30px;
          font-weight: 300;
        }

        .resultName.normalResult {
          color: #16A34A;
        }

        .resultName.pneumoniaResult {
          color: #EA580C;
        }

        .confidenceText {
          color: #64748B;
          margin-top: 8px;
          font-size: 16px;
        }

        .confidenceNumber {
          font-size: 42px;
          font-weight: 300;
          color: #102A56;
        }

        .probabilityGrid {
          display: grid;
          grid-template-columns:
            repeat(2, 1fr);
          gap: 20px;
          margin-bottom: 25px;
        }

        .probabilityCard {
          background: white;
          border-radius: 20px;
          padding: 25px;
          box-shadow:
            0 10px 30px rgba(0,0,0,0.06);
        }

        .probabilityTitle {
          color: #64748B;
          font-size: 15px;
          margin-bottom: 10px;
        }

        .probabilityValue {
          color: #102A56;
          font-size: 32px;
          font-weight: 300;
        }

        .imageGrid {
          display: grid;
          grid-template-columns:
            repeat(2, 1fr);
          gap: 30px;
        }

        .imageCard {
          background: white;
          border-radius: 22px;
          padding: 28px;
          box-shadow:
            0 10px 30px rgba(0,0,0,0.06);
        }

        .sectionHeader {
          display: flex;
          align-items: center;
          gap: 15px;
          margin-bottom: 20px;
        }

        .number {
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 12px;
          background: #E8F0FF;
          color: #2563EB;
          font-weight: 300;
        }

        .sectionTitle {
          color: #102A56;
          font-size: 25px;
          font-weight: 300;
        }

        .imageBox {
          width: 100%;
          height: 540px;
          border-radius: 20px;
          overflow: hidden;
          background: #07111F;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .imageBox img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        .imageDescription {
          color: #64748B;
          margin-top: 15px;
          line-height: 1.6;
        }

        .disclaimer {
          background: #FFF7ED;
          border: 1px solid #FED7AA;
          color: #9A3412;
          border-radius: 18px;
          padding: 20px;
          margin-top: 25px;
          line-height: 1.6;
        }

        @media(max-width: 900px) {

          .patientGrid {
            grid-template-columns:
              repeat(2, 1fr);
          }

          .imageGrid {
            grid-template-columns: 1fr;
          }

          .reportHeader {
            flex-direction: column;
            gap: 20px;
            align-items: flex-start;
          }

        }

        @media(max-width: 600px) {

          .patientGrid,
          .probabilityGrid {
            grid-template-columns: 1fr;
          }

          .resultRow {
            flex-direction: column;
            align-items: flex-start;
            gap: 15px;
          }

          .imageBox {
            height: 400px;
          }

        }


        /* ===================================================
           PRINT / PDF
        =================================================== */

        @media print {

          @page {
            size: A4;
            margin: 12mm;
          }

          body {
            background: white;
          }

          .resultsPage {
            background: white;
          }

          nav,
          .actions,
          button {
            display: none !important;
          }

          .resultsContainer {
            max-width: none;
            padding: 0;
          }

          .reportHeader,
          .patientCard,
          .resultCard,
          .probabilityCard,
          .imageCard,
          .disclaimer {
            box-shadow: none;
            break-inside: avoid;
          }

          .reportHeader {
            border-bottom: 2px solid #102A56;
            border-radius: 0;
          }

          .imageGrid {
            grid-template-columns: 1fr 1fr;
            gap: 10mm;
          }

          .imageCard {
            padding: 10px;
          }

          .imageBox {
            height: 420px;
          }

          .sectionTitle {
            font-size: 20px;
          }

          .patientCard {
            margin-bottom: 15px;
          }

          .resultCard {
            margin-bottom: 15px;
          }

          .probabilityGrid {
            margin-bottom: 15px;
          }

          .disclaimer {
            margin-top: 15px;
          }

        }

      `}</style>

      <div className="resultsPage">

        <Navbar />

        <div className="resultsContainer">

          <div className="reportHeader">

            <div>

              <div className="reportTitle">
                MediScan AI Report
              </div>

              <div className="reportSubtitle">
                AI-Assisted Chest X-Ray Analysis
              </div>

            </div>

            <div className="actions">

              <button
                className="actionButton backButton"
                onClick={() =>
                  navigate("/upload")
                }
              >
                ← New Scan
              </button>

              <button
                className="actionButton pdfButton"
                onClick={downloadPDF}
              >
                📄 Download PDF
              </button>

            </div>

          </div>


          <div className="patientCard">

            <div className="patientTitle">
              Patient Information
            </div>

            <div className="patientGrid">

              <div className="patientItem">

                <div className="label">
                  Patient Name
                </div>

                <div className="value">
                  {result.patient_name}
                </div>

              </div>

              <div className="patientItem">

                <div className="label">
                  Age
                </div>

                <div className="value">
                  {result.age}
                </div>

              </div>

              <div className="patientItem">

                <div className="label">
                  Gender
                </div>

                <div className="value">
                  {result.gender}
                </div>

              </div>

              <div className="patientItem">

                <div className="label">
                  Doctor
                </div>

                <div className="value">
                  {result.username}
                </div>

              </div>

            </div>

          </div>


          <div className="resultCard">

            <div className="resultRow">

              <div>

                <div
                  className={
                    `resultName ${
                      prediction === "Pneumonia"
                        ? "pneumoniaResult"
                        : "normalResult"
                    }`
                  }
                >
                  {prediction} Detected
                </div>

                <div className="confidenceText">
                  Model confidence:{" "}
                  <strong style={{ fontWeight: 300 }}>
                    {confidence}%
                  </strong>
                </div>

              </div>

              <div className="confidenceNumber">
                {confidence}%
              </div>

            </div>

          </div>


          <div className="probabilityGrid">

            <div className="probabilityCard">

              <div className="probabilityTitle">
                Pneumonia Probability
              </div>

              <div className="probabilityValue">
                {pneumoniaProbability}%
              </div>

            </div>

            <div className="probabilityCard">

              <div className="probabilityTitle">
                Normal Probability
              </div>

              <div className="probabilityValue">
                {normalProbability}%
              </div>

            </div>

          </div>


          <div className="imageGrid">

            <div className="imageCard">

              <div className="sectionHeader">

                <div className="number">
                  01
                </div>

                <div className="sectionTitle">
                  Original Chest X-Ray
                </div>

              </div>

              <div className="imageBox">

                {originalImage ? (

                  <img
                    src={originalImage}
                    alt="Original Chest X-Ray"
                  />

                ) : (

                  <div
                    style={{
                      color: "white"
                    }}
                  >
                    Original image unavailable
                  </div>

                )}

              </div>

              <div className="imageDescription">
                Uploaded chest X-Ray used
                for AI analysis.
              </div>

            </div>


            <div className="imageCard">

              <div className="sectionHeader">

                <div className="number">
                  02
                </div>

                <div className="sectionTitle">
                  AI Heatmap Analysis
                </div>

              </div>

              <div className="imageBox">

                {heatmapImage ? (

                  <img
                    src={heatmapImage}
                    alt="AI Grad-CAM Heatmap"
                  />

                ) : (

                  <div
                    style={{
                      color: "white"
                    }}
                  >
                    Heatmap unavailable
                  </div>

                )}

              </div>

              <div className="imageDescription">
                Grad-CAM visualization showing
                image regions that influenced
                the model's prediction.
              </div>

            </div>

          </div>


          <div className="disclaimer">

            <strong style={{ fontWeight: 300 }}>
              ⚠️ Important:
            </strong>{" "}

            {result.disclaimer ||
              "For demonstration and research purposes only. This AI system is not a medical diagnosis."}

          </div>

        </div>

      </div>
    </>
  );
}