
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getPrediction, getConfidence } from "../utils/prediction";

const API = "http://localhost:8000";

function ImagePanel({ title, path }) {
  const [imageFailed, setImageFailed] = useState(false);

  const imageUrl = useMemo(() => {
    if (!path || typeof path !== "string") return "";

    const cleanPath = path.trim();

    if (/^https?:\/\//i.test(cleanPath)) return cleanPath;
    if (cleanPath.startsWith("/")) return `${API}${cleanPath}`;

    return `${API}/${cleanPath}`;
  }, [path]);

  useEffect(() => {
    setImageFailed(false);
  }, [imageUrl]);

  return (
    <div className="history-image-block">
      <h4>{title}</h4>

      <div className="history-image-frame">
        {imageUrl && !imageFailed ? (
          <img
            src={imageUrl}
            alt={title}
            onError={() => setImageFailed(true)}
          />
        ) : (
          <p>
            {!path
              ? "Image path was not saved for this scan."
              : "Image could not be loaded. Check the backend image path."}
          </p>
        )}
      </div>
    </div>
  );
}

export default function History() {
  const navigate = useNavigate();

  const [history, setHistory] = useState([]);
  const [search, setSearch] = useState("");
  const [showRecoveryTracking, setShowRecoveryTracking] = useState(false);

  const doctorName = localStorage.getItem("doctorName") || "Doctor";

  useEffect(() => {
    const loadHistory = () => {
      const doctorId = localStorage.getItem("doctorId") || "unknown";

      try {
        const savedHistory = JSON.parse(
          localStorage.getItem(`scanHistory_${doctorId}`) || "[]"
        );

        setHistory(Array.isArray(savedHistory) ? savedHistory : []);
      } catch (error) {
        console.error("History loading error:", error);
        setHistory([]);
      }
    };

    loadHistory();
    window.addEventListener("focus", loadHistory);

    return () => window.removeEventListener("focus", loadHistory);
  }, []);

  const openResult = (item) => {
    localStorage.setItem("result", JSON.stringify(item));
    navigate("/results");
  };

  const clearHistory = () => {
    if (!window.confirm("Are you sure you want to clear all scan history?")) {
      return;
    }

    const doctorId = localStorage.getItem("doctorId") || "unknown";
    localStorage.removeItem(`scanHistory_${doctorId}`);

    setHistory([]);
    setShowRecoveryTracking(false);
  };

  const normalCount = history.filter(
    (item) => getPrediction(item) === "Normal"
  ).length;

  const pneumoniaCount = history.filter(
    (item) => getPrediction(item) === "Pneumonia"
  ).length;

  const filteredHistory = history.filter((item) =>
    String(item.patient_name || "")
      .toLowerCase()
      .includes(search.trim().toLowerCase())
  );

  const comparisons = useMemo(() => {
    const groups = {};

    history.forEach((item) => {
      const patientKey = item.patient_id
        ? `id:${item.patient_id}`
        : `name:${String(item.patient_name || "Patient")
            .trim()
            .toLowerCase()}`;

      if (!groups[patientKey]) {
        groups[patientKey] = [];
      }

      groups[patientKey].push(item);
    });

    return Object.entries(groups)
      .filter(([key, scans]) => {
        const name = String(
          scans[0]?.patient_name || ""
        ).toLowerCase();

        return (
          name.includes(search.trim().toLowerCase()) &&
          scans.length >= 2
        );
      })
      .map(([key, scans]) => {
        const sorted = [...scans].sort((a, b) => {
          const dateA = Date.parse(
            a.scan_date || a.created_at || ""
          );

          const dateB = Date.parse(
            b.scan_date || b.created_at || ""
          );

          if (Number.isNaN(dateA)) return -1;
          if (Number.isNaN(dateB)) return 1;

          return dateA - dateB;
        });

        return {
          key,
          name: sorted[0]?.patient_name || "Patient",
          previous: sorted[sorted.length - 2],
          latest: sorted[sorted.length - 1],
        };
      });
  }, [history, search]);

  const resultClass = (item) => {
    const category = getPrediction(item);

    if (category === "Normal") return "history-normal";
    if (category === "Pneumonia") return "history-pneumonia";

    return "history-unknown";
  };

  const displayPrediction = (item) => {
    const category = getPrediction(item);

    return category === "Other"
      ? item.prediction || item.disease || "Unknown"
      : category;
  };

  return (
    <>
      <style>{`
        .history-page {
          --green: #08785B;
          --green-dark: #075C46;
          --green-soft: #EAF5EF;
          --text: #183A2E;
          --muted: #82948A;
          --border: #E3EDE6;

          min-height: 100vh;
          background: #F5FAF6;
          color: var(--text);
          font-family: "Poppins", sans-serif;
          font-weight: 300;
        }

        .history-page * {
          box-sizing: border-box;
        }

        .history-page button,
        .history-page input {
          font-family: inherit;
          font-weight: 300;
        }

        /* All headings bold */
        .history-page h1,
        .history-page h2,
        .history-page h3,
        .history-page h4,
        .history-page h5,
        .history-page h6 {
          font-weight: 600 !important;
        }

        /* Normal content remains thin */
        .history-page p,
        .history-page span,
        .history-page label,
        .history-page input,
        .history-page small,
        .history-page td,
        .history-page li {
          font-weight: 300;
        }

        .history-container {
          max-width: 1320px;
          margin: 0 auto;
          padding: 42px 42px 70px;
        }

        .history-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          margin-bottom: 30px;
        }

        .history-eyebrow {
          display: flex;
          align-items: center;
          gap: 9px;
          color: var(--green);
          font-size: 10px;
          font-weight: 300;
          letter-spacing: 1.7px;
          text-transform: uppercase;
          margin-bottom: 13px;
        }

        .history-eyebrow::before {
          content: "";
          width: 22px;
          height: 1px;
          background: #83B99E;
        }

        .history-title {
          margin: 0;
          color: #173B2D;
          font-size: 30px;
          line-height: 1.35;
          font-weight: 600 !important;
          letter-spacing: -1px;
        }

        .history-subtitle {
          margin: 9px 0 0;
          color: #82948A;
          font-size: 12px;
          line-height: 1.8;
          font-weight: 300;
        }

        .history-clear {
          padding: 11px 17px;
          border: 1px solid #DCEBE0;
          border-radius: 7px;
          background: #FFFFFF;
          color: var(--green);
          font-size: 11px;
          cursor: pointer;
          white-space: nowrap;
          transition: all .2s ease;
        }

        .history-clear:hover {
          background: var(--green-soft);
          border-color: #BBDCC8;
        }

        .history-overview {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 16px;
          margin-bottom: 24px;
        }

        /* Completely white cards: no green top strip */
        .history-overview-card {
          position: relative;
          overflow: hidden;
          padding: 21px 23px;
          background: #FFFFFF;
          border: 1px solid var(--border);
          border-radius: 11px;
          box-shadow: 0 4px 18px rgba(26, 77, 51, 0.035);
          transition: transform .2s ease, box-shadow .2s ease;
        }

        .history-overview-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 9px 24px rgba(26, 77, 51, 0.07);
        }

        .history-overview-label {
          color: #71877B;
          font-size: 11px;
          margin-bottom: 13px;
          font-weight: 300;
        }

        .history-overview-value {
          color: #174B37;
          font-size: 29px;
          line-height: 1.2;
          font-weight: 300;
          letter-spacing: -1px;
        }

        .history-search-panel {
          display: flex;
          align-items: center;
          gap: 13px;
          padding: 15px 18px;
          margin-bottom: 25px;
          background: #FFFFFF;
          border: 1px solid var(--border);
          border-radius: 9px;
          box-shadow: 0 4px 18px rgba(26, 77, 51, 0.025);
        }

        .history-search-icon {
          color: var(--green);
          font-size: 19px;
        }

        .history-search {
          flex: 1;
          min-width: 0;
          border: none;
          outline: none;
          background: transparent;
          color: var(--text);
          font-size: 12px;
        }

        .history-search::placeholder {
          color: #A0ADA4;
        }

        .history-section {
          margin-bottom: 25px;
          padding: 25px 26px;
          background: #FFFFFF;
          border: 1px solid var(--border);
          border-radius: 11px;
          box-shadow: 0 4px 18px rgba(26, 77, 51, 0.035);
        }

        .history-section-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 15px;
          margin-bottom: 9px;
        }

        .history-section-title {
          margin: 0;
          color: #214A36;
          font-size: 15px;
          font-weight: 600 !important;
          letter-spacing: -.2px;
        }

        .history-section-description {
          margin: 7px 0 0;
          color: #94A198;
          font-size: 10px;
          line-height: 1.8;
          font-weight: 300;
        }

        .history-toggle {
          padding: 10px 15px;
          border: 1px solid #DCEBE0;
          border-radius: 6px;
          background: #FFFFFF;
          color: var(--green);
          font-size: 10px;
          cursor: pointer;
          transition: all .2s ease;
          white-space: nowrap;
        }

        .history-toggle:hover {
          background: var(--green-soft);
          border-color: #BBDCC8;
        }

        .history-comparison {
          margin-top: 23px;
          padding: 20px;
          background: #FFFFFF;
          border: 1px solid var(--border);
          border-radius: 8px;
        }

        .history-comparison-name {
          margin: 0 0 17px;
          color: #214A36;
          font-size: 14px;
          font-weight: 600 !important;
        }

        .history-comparison-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 15px;
        }

        .history-scan-card {
          min-width: 0;
          padding: 18px;
          background: #FFFFFF;
          border: 1px solid var(--border);
          border-radius: 7px;
        }

        .history-scan-card h4 {
          margin: 0 0 15px;
          color: var(--green);
          font-size: 11px;
          font-weight: 600 !important;
        }

        .history-scan-detail {
          color: #74877C;
          font-size: 11px;
          line-height: 2;
          overflow-wrap: anywhere;
          font-weight: 300;
        }

        .history-scan-detail strong {
          color: #345344;
          font-weight: 500;
        }

        .history-small-button {
          margin-top: 13px;
          padding: 9px 12px;
          border: 1px solid #DCEBE0;
          border-radius: 6px;
          background: #FFFFFF;
          color: var(--green);
          font-size: 10px;
          cursor: pointer;
          transition: all .2s ease;
        }

        .history-small-button:hover {
          background: var(--green-soft);
        }

        .history-image-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 15px;
          margin-top: 18px;
        }

        .history-image-card {
          min-width: 0;
          padding: 15px;
          background: #FFFFFF;
          border: 1px solid var(--border);
          border-radius: 7px;
        }

        .history-image-card h3 {
          margin: 0;
          color: #345344;
          font-size: 12px;
          font-weight: 600 !important;
        }

        .history-image-block {
          margin-top: 16px;
        }

        .history-image-block h4 {
          margin: 0 0 9px;
          color: #637B6D;
          font-size: 10px;
          font-weight: 600 !important;
        }

        .history-image-frame {
          width: 100%;
          height: 225px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          background: #F2F8F4;
          border: 1px solid var(--border);
          border-radius: 6px;
        }

        .history-image-frame img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        .history-image-frame p {
          max-width: 230px;
          padding: 12px;
          color: #82948A;
          text-align: center;
          font-size: 10px;
          line-height: 1.8;
        }

        .history-confidence {
          margin-top: 18px;
          padding: 19px;
          background: #FFFFFF;
          border: 1px solid var(--border);
          border-radius: 7px;
        }

        .history-confidence h4 {
          margin: 0 0 19px;
          color: #345344;
          font-size: 12px;
          font-weight: 600 !important;
        }

        .history-confidence-row {
          margin-bottom: 17px;
        }

        .history-confidence-label {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 8px;
          color: #7B8D82;
          font-size: 10px;
        }

        .history-confidence-label strong {
          color: #345344;
          font-weight: 500;
        }

        .history-confidence-track {
          height: 7px;
          overflow: hidden;
          background: #EAF2EC;
          border-radius: 10px;
        }

        .history-confidence-fill {
          height: 100%;
          background: linear-gradient(90deg, #A9D4BA, #238B68);
          border-radius: 10px;
        }

        .history-confidence-change {
          padding: 12px;
          background: #F0F7F1;
          border: 1px solid #E1EDE4;
          border-radius: 6px;
          color: #647B6C;
          font-size: 10px;
          line-height: 1.8;
        }

        .history-change-note {
          margin-top: 12px;
          padding: 12px;
          background: #F5FAF6;
          border: 1px solid #E3EDE6;
          border-radius: 6px;
          color: #647B6C;
          font-size: 10px;
          line-height: 1.8;
        }

        .history-disclaimer {
          margin-top: 18px;
          color: #82948A;
          font-size: 10px;
          line-height: 1.9;
        }

        .history-all-heading {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin: 35px 0 15px;
        }

        .history-all-heading h2 {
          margin: 0;
          color: #214A36;
          font-size: 16px;
          font-weight: 600 !important;
        }

        .history-count {
          color: #82948A;
          font-size: 10px;
        }

        .history-record {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 12px;
          padding: 19px 21px;
          background: #FFFFFF;
          border: 1px solid var(--border);
          border-radius: 9px;
          box-shadow: 0 3px 12px rgba(26, 77, 51, 0.025);
          transition: border-color .2s ease, transform .2s ease;
        }

        .history-record:hover {
          border-color: #BBDCC8;
          transform: translateY(-2px);
        }

        .history-record-left {
          display: flex;
          align-items: center;
          gap: 14px;
          min-width: 0;
        }

        .history-avatar {
          width: 39px;
          height: 39px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid #DDEDE2;
          border-radius: 11px;
          background: #EAF5EF;
          color: #167653;
          font-size: 12px;
          font-weight: 300;
        }

        .history-record-name {
          color: #345344;
          font-size: 11px;
          font-weight: 300;
          overflow-wrap: anywhere;
        }

        .history-record-meta {
          margin-top: 5px;
          color: #94A198;
          font-size: 10px;
          line-height: 1.8;
          font-weight: 300;
        }

        .history-record-right {
          display: flex;
          align-items: center;
          gap: 15px;
          flex-shrink: 0;
        }

        .history-status {
          padding: 6px 10px;
          border-radius: 5px;
          font-size: 9px;
          font-weight: 300;
          white-space: nowrap;
        }

        .history-normal,
        .history-pneumonia {
          background: #EAF5EF;
          color: #16744E;
        }

        .history-unknown {
          background: #F0F5F1;
          color: #637B6D;
        }

        .history-view-button {
          padding: 9px 13px;
          border: 1px solid #DCEBE0;
          border-radius: 6px;
          background: #FFFFFF;
          color: var(--green);
          font-size: 10px;
          cursor: pointer;
          transition: all .2s ease;
        }

        .history-view-button:hover {
          background: var(--green-soft);
          border-color: #BBDCC8;
        }

        .history-empty {
          padding: 38px 15px;
          background: #FFFFFF;
          border: 1px solid var(--border);
          border-radius: 8px;
          text-align: center;
          color: #82948A;
          font-size: 11px;
          line-height: 1.9;
        }

        .history-empty strong {
          display: block;
          color: #345344;
          font-size: 12px;
          font-weight: 600 !important;
          margin-bottom: 5px;
        }

        @media(max-width: 850px) {
          .history-container {
            padding: 32px 24px 55px;
          }

          .history-comparison-grid,
          .history-image-grid {
            grid-template-columns: 1fr;
          }
        }

        @media(max-width: 600px) {
          .history-container {
            padding: 27px 15px 45px;
          }

          .history-header {
            align-items: flex-start;
            flex-direction: column;
          }

          .history-title {
            font-size: 26px;
          }

          .history-overview {
            gap: 9px;
          }

          .history-overview-card {
            padding: 15px;
          }

          .history-overview-label {
            font-size: 10px;
          }

          .history-overview-value {
            font-size: 23px;
          }

          .history-section {
            padding: 18px 15px;
          }

          .history-section-header {
            flex-direction: column;
          }

          .history-record {
            align-items: flex-start;
            flex-direction: column;
            gap: 13px;
          }

          .history-record-right {
            width: 100%;
            justify-content: space-between;
          }

          .history-comparison {
            padding: 14px;
          }

          .history-image-frame {
            height: 190px;
          }
        }
      `}</style>

      <div className="history-page">
        <Navbar />

        <main className="history-container">
          <header className="history-header">
            <div>
              <div className="history-eyebrow">
                Records / Patient activity
              </div>

              <h1 className="history-title">Scan History</h1>

              <p className="history-subtitle">
                Patient assessment records managed by Dr. {doctorName}.
              </p>
            </div>

            {history.length > 0 && (
              <button className="history-clear" onClick={clearHistory}>
                Clear all history
              </button>
            )}
          </header>

          <section className="history-overview">
            <div className="history-overview-card">
              <div className="history-overview-label">
                Total saved scans
              </div>
              <div className="history-overview-value">
                {history.length}
              </div>
            </div>

            <div className="history-overview-card">
              <div className="history-overview-label">
                Normal predictions
              </div>
              <div className="history-overview-value">
                {normalCount}
              </div>
            </div>

            <div className="history-overview-card">
              <div className="history-overview-label">
                Pneumonia predictions
              </div>
              <div className="history-overview-value">
                {pneumoniaCount}
              </div>
            </div>
          </section>

          <div className="history-search-panel">
            <span className="history-search-icon">⌕</span>

            <input
              className="history-search"
              type="text"
              placeholder="Search records by patient name..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>

          <section className="history-section">
            <div className="history-section-header">
              <div>
                <h2 className="history-section-title">
                  Recovery tracking
                </h2>

                <p className="history-section-description">
                  Compare a patient's two most recent saved scans and view
                  their original X-rays and AI heatmaps.
                </p>
              </div>

              <button
                className="history-toggle"
                type="button"
                onClick={() =>
                  setShowRecoveryTracking((previous) => !previous)
                }
                aria-expanded={showRecoveryTracking}
              >
                {showRecoveryTracking
                  ? "Hide comparison"
                  : "View comparison"}
              </button>
            </div>

            {showRecoveryTracking && (
              <div>
                {comparisons.length === 0 ? (
                  <div className="history-empty">
                    <strong>No comparisons available</strong>
                    A patient needs at least two saved scans under the same
                    patient ID before a comparison can be displayed.
                  </div>
                ) : (
                  comparisons.map(({ key, name, previous, latest }) => {
                    const previousConfidence = getConfidence(
                      previous.confidence
                    );

                    const latestConfidence = getConfidence(
                      latest.confidence
                    );

                    const change =
                      previousConfidence !== null &&
                      latestConfidence !== null
                        ? latestConfidence - previousConfidence
                        : null;

                    const predictionChanged =
                      getPrediction(previous) !== getPrediction(latest);

                    const scanEntries = [
                      {
                        label: "Previous scan",
                        scan: previous,
                        confidence: previousConfidence,
                      },
                      {
                        label: "Latest scan",
                        scan: latest,
                        confidence: latestConfidence,
                      },
                    ];

                    return (
                      <article className="history-comparison" key={key}>
                        <h3 className="history-comparison-name">
                          {name}
                        </h3>

                        <div className="history-comparison-grid">
                          {scanEntries.map((entry) => (
                            <div
                              className="history-scan-card"
                              key={entry.label}
                            >
                              <h4>{entry.label}</h4>

                              <div className="history-scan-detail">
                                <div>
                                  <strong>Date:</strong>{" "}
                                  {entry.scan.scan_date ||
                                    entry.scan.created_at ||
                                    "Unavailable"}
                                </div>

                                <div>
                                  <strong>Patient ID:</strong>{" "}
                                  {entry.scan.patient_id || "Not available"}
                                </div>

                                <div>
                                  <strong>AI result:</strong>{" "}
                                  {displayPrediction(entry.scan)}
                                </div>

                                <div>
                                  <strong>Model score:</strong>{" "}
                                  {entry.confidence !== null
                                    ? `${entry.confidence.toFixed(1)}%`
                                    : "N/A"}
                                </div>
                              </div>

                              <button
                                className="history-small-button"
                                onClick={() => openResult(entry.scan)}
                              >
                                View scan result
                              </button>
                            </div>
                          ))}
                        </div>

                        <div className="history-image-grid">
                          <div className="history-image-card">
                            <h3>Previous scan images</h3>

                            <ImagePanel
                              title="Original chest X-ray"
                              path={
                                previous.original_image ||
                                previous.image_url
                              }
                            />

                            <ImagePanel
                              title="Grad-CAM heatmap"
                              path={
                                previous.heatmap ||
                                previous.heatmap_url
                              }
                            />
                          </div>

                          <div className="history-image-card">
                            <h3>Latest scan images</h3>

                            <ImagePanel
                              title="Original chest X-ray"
                              path={
                                latest.original_image ||
                                latest.image_url
                              }
                            />

                            <ImagePanel
                              title="Grad-CAM heatmap"
                              path={
                                latest.heatmap ||
                                latest.heatmap_url
                              }
                            />
                          </div>
                        </div>

                        <div className="history-confidence">
                          <h4>Model score comparison</h4>

                          {scanEntries.map((entry) => (
                            <div
                              className="history-confidence-row"
                              key={entry.label}
                            >
                              <div className="history-confidence-label">
                                <span>{entry.label}</span>

                                <strong>
                                  {entry.confidence !== null
                                    ? `${entry.confidence.toFixed(1)}%`
                                    : "N/A"}
                                </strong>
                              </div>

                              <div className="history-confidence-track">
                                <div
                                  className="history-confidence-fill"
                                  style={{
                                    width:
                                      entry.confidence !== null
                                        ? `${Math.min(
                                            entry.confidence,
                                            100
                                          )}%`
                                        : "0%",
                                  }}
                                />
                              </div>
                            </div>
                          ))}

                          <div className="history-confidence-change">
                            <strong>Score change: </strong>

                            {change === null
                              ? "Cannot calculate from the saved values."
                              : `${change > 0 ? "+" : ""}${change.toFixed(
                                  1
                                )} percentage points`}
                          </div>

                          <div className="history-change-note">
                            {predictionChanged
                              ? "The model's classification differs between these two scans."
                              : "The model's classification is the same in both scans."}
                          </div>
                        </div>
                      </article>
                    );
                  })
                )}

                <p className="history-disclaimer">
                  These comparisons show changes in model outputs only.
                  They do not establish patient recovery or disease
                  progression. A qualified healthcare professional must
                  review the images and clinical condition.
                </p>
              </div>
            )}
          </section>

          <div className="history-all-heading">
            <h2>All saved scans</h2>

            <span className="history-count">
              {filteredHistory.length} record(s)
            </span>
          </div>

          {filteredHistory.length === 0 ? (
            <div className="history-empty">
              <strong>
                {history.length === 0
                  ? "No scan records yet"
                  : "No matching patients"}
              </strong>

              {history.length === 0
                ? "Your saved patient assessments will appear here."
                : "Try searching with a different patient name."}
            </div>
          ) : (
            filteredHistory.map((item, index) => {
              const confidence = getConfidence(item.confidence);

              return (
                <article
                  className="history-record"
                  key={
                    item.scan_id ||
                    `${item.patient_id || item.patient_name || "scan"}-${item.scan_date || index}`
                  }
                >
                  <div className="history-record-left">
                    <div className="history-avatar">
                      {(item.patient_name || "P")
                        .charAt(0)
                        .toUpperCase()}
                    </div>

                    <div>
                      <div className="history-record-name">
                        {item.patient_name || "Unknown patient"}
                      </div>

                      <div className="history-record-meta">
                        Patient ID: {item.patient_id || "Not available"}
                        <br />
                        {item.age ?? "N/A"} yrs · {item.gender || "N/A"}
                        <br />
                        {item.scan_date ||
                          item.created_at ||
                          "Date unavailable"}
                        {" · "}
                        Model score:{" "}
                        {confidence !== null
                          ? `${confidence.toFixed(1)}%`
                          : "N/A"}
                      </div>
                    </div>
                  </div>

                  <div className="history-record-right">
                    <span
                      className={`history-status ${resultClass(item)}`}
                    >
                      {displayPrediction(item)}
                    </span>

                    <button
                      className="history-view-button"
                      onClick={() => openResult(item)}
                    >
                      View result
                    </button>
                  </div>
                </article>
              );
            })
          )}
        </main>
      </div>
    </>
  );
}
