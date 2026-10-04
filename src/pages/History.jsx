import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function History() {

  const navigate = useNavigate();

  const [history, setHistory] = useState([]);

  useEffect(() => {

    // ============================================================
    // GET CURRENT DOCTOR
    // ============================================================

    const doctorId =
      localStorage.getItem("doctorId") ||
      "unknown";


    // ============================================================
    // CREATE DOCTOR-SPECIFIC HISTORY KEY
    // ============================================================

    const historyKey =
      `scanHistory_${doctorId}`;


    // ============================================================
    // LOAD ONLY CURRENT DOCTOR'S HISTORY
    // ============================================================

    const savedHistory = JSON.parse(
      localStorage.getItem(
        historyKey
      ) || "[]"
    );


    setHistory(
      Array.isArray(savedHistory)
        ? savedHistory
        : []
    );

  }, []);


  // ============================================================
  // OPEN RESULT
  // ============================================================

  const openResult = (item) => {

    localStorage.setItem(
      "result",
      JSON.stringify(item)
    );

    navigate("/results");
  };


  // ============================================================
  // CLEAR CURRENT DOCTOR'S HISTORY
  // ============================================================

  const clearHistory = () => {

    const confirmDelete =
      window.confirm(
        "Are you sure you want to clear all scan history?"
      );


    if (!confirmDelete) {
      return;
    }


    // ----------------------------------------------------------
    // GET CURRENT DOCTOR
    // ----------------------------------------------------------

    const doctorId =
      localStorage.getItem("doctorId") ||
      "unknown";


    // ----------------------------------------------------------
    // CURRENT DOCTOR'S HISTORY KEY
    // ----------------------------------------------------------

    const historyKey =
      `scanHistory_${doctorId}`;


    // ----------------------------------------------------------
    // DELETE ONLY CURRENT DOCTOR'S HISTORY
    // ----------------------------------------------------------

    localStorage.removeItem(
      historyKey
    );


    setHistory([]);

  };


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

        .historyPage {
          min-height: 100vh;
          background: #EEF4FF;
        }

        .historyContainer {
          max-width: 1250px;
          margin: auto;
          padding: 40px 25px;
        }

        .headerRow {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
        }

        .heading {
          color: #102A56;
          font-size: 36px;
          font-weight: 300;
        }

        .subtitle {
          color: #64748B;
          margin-top: 8px;
          font-size: 16px;
        }

        .clearButton {
          border: none;
          background: #EF4444;
          color: white;
          padding: 12px 20px;
          border-radius: 10px;
          font-size: 15px;
          font-weight: 300;
          cursor: pointer;
        }

        .emptyBox {
          background: white;
          border-radius: 20px;
          padding: 70px 30px;
          text-align: center;
          box-shadow:
            0 10px 30px rgba(0,0,0,0.06);
        }

        .emptyIcon {
          font-size: 65px;
          margin-bottom: 15px;
        }

        .emptyTitle {
          color: #102A56;
          font-size: 24px;
          font-weight: 300;
        }

        .emptyText {
          color: #64748B;
          margin-top: 10px;
        }

        .historyGrid {
          display: grid;
          grid-template-columns:
            repeat(2, 1fr);
          gap: 22px;
        }

        .historyCard {
          background: white;
          border-radius: 20px;
          padding: 22px;
          box-shadow:
            0 10px 30px rgba(0,0,0,0.06);
          border: 1px solid #E2E8F0;
        }

        .cardTop {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 18px;
        }

        .patientName {
          color: #102A56;
          font-size: 21px;
          font-weight: 300;
        }

        .resultBadge {
          padding: 7px 13px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 300;
        }

        .normal {
          background: #DCFCE7;
          color: #15803D;
        }

        .pneumonia {
          background: #FEE2E2;
          color: #DC2626;
        }

        .details {
          display: grid;
          grid-template-columns:
            repeat(3, 1fr);
          gap: 12px;
          margin-bottom: 18px;
        }

        .detailBox {
          background: #F8FAFC;
          border-radius: 12px;
          padding: 12px;
        }

        .detailLabel {
          color: #94A3B8;
          font-size: 12px;
          margin-bottom: 4px;
        }

        .detailValue {
          color: #334155;
          font-size: 15px;
          font-weight: 300;
        }

        .confidence {
          color: #475569;
          margin-bottom: 8px;
        }

        .date {
          color: #94A3B8;
          font-size: 13px;
          margin-bottom: 18px;
        }

        .viewButton {
          width: 100%;
          border: none;
          background:
            linear-gradient(
              90deg,
              #2563EB,
              #38BDF8
            );
          color: white;
          padding: 13px;
          border-radius: 12px;
          font-size: 15px;
          font-weight: 300;
          cursor: pointer;
        }

        @media(max-width: 800px) {

          .historyGrid {
            grid-template-columns: 1fr;
          }

          .headerRow {
            align-items: flex-start;
            gap: 20px;
            flex-direction: column;
          }

        }

        @media(max-width: 500px) {

          .details {
            grid-template-columns: 1fr;
          }

        }

      `}</style>

      <div className="historyPage">

        <Navbar />

        <div className="historyContainer">

          <div className="headerRow">

            <div>

              <div className="heading">
                Scan History
              </div>

              <div className="subtitle">
                View previously analyzed patient scans
              </div>

            </div>

            {history.length > 0 && (

              <button
                className="clearButton"
                onClick={clearHistory}
              >
                Clear History
              </button>

            )}

          </div>

          {history.length === 0 ? (

            <div className="emptyBox">

              <div className="emptyIcon">
                🩻
              </div>

              <div className="emptyTitle">
                No Scan History
              </div>

              <div className="emptyText">
                Analyze a chest X-Ray
                to see it here.
              </div>

            </div>

          ) : (

            <div className="historyGrid">

              {history.map(
                (item, index) => (

                  <div
                    className="historyCard"
                    key={index}
                  >

                    <div className="cardTop">

                      <div className="patientName">
                        {item.patient_name}
                      </div>

                      <div
                        className={
                          `resultBadge ${
                            item.prediction ===
                            "Pneumonia"
                              ? "pneumonia"
                              : "normal"
                          }`
                        }
                      >
                        {item.prediction}
                      </div>

                    </div>

                    <div className="details">

                      <div className="detailBox">

                        <div className="detailLabel">
                          Age
                        </div>

                        <div className="detailValue">
                          {item.age}
                        </div>

                      </div>

                      <div className="detailBox">

                        <div className="detailLabel">
                          Gender
                        </div>

                        <div className="detailValue">
                          {item.gender}
                        </div>

                      </div>

                      <div className="detailBox">

                        <div className="detailLabel">
                          Doctor
                        </div>

                        <div className="detailValue">
                          {item.username}
                        </div>

                      </div>

                    </div>

                    <div className="confidence">

                      Model Confidence:{" "}

                      <strong style={{ fontWeight: 300 }}>
                        {item.confidence}%
                      </strong>

                    </div>

                    {item.scan_date && (

                      <div className="date">
                        {item.scan_date}
                      </div>

                    )}

                    <button
                      className="viewButton"
                      onClick={() =>
                        openResult(item)
                      }
                    >
                      View Full Result
                    </button>

                  </div>

                )
              )}

            </div>

          )}

        </div>

      </div>
    </>
  );
}