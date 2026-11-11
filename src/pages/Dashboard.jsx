
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function normalizePrediction(prediction) {
  const value = String(prediction || "").trim().toLowerCase();

  if (
    value === "normal" ||
    value === "no strong pneumonia-like pattern detected"
  ) {
    return "Normal";
  }

  if (
    value === "pneumonia" ||
    value === "pneumonia suspected"
  ) {
    return "Pneumonia";
  }

  return "Inconclusive";
}

function getConfidence(value) {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const number = Number(value);

  if (!Number.isFinite(number) || number < 0) {
    return null;
  }

  return number <= 1 ? number * 100 : number;
}

export default function Dashboard() {
  const navigate = useNavigate();

  const [doctorName, setDoctorName] = useState("Doctor");
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const loadDashboardData = () => {
      const doctor = localStorage.getItem("doctorName") || "Doctor";
      const doctorId = localStorage.getItem("doctorId") || "unknown";

      setDoctorName(doctor);

      try {
        const savedHistory = JSON.parse(
          localStorage.getItem(`scanHistory_${doctorId}`) || "[]"
        );

        setHistory(Array.isArray(savedHistory) ? savedHistory : []);
      } catch (error) {
        console.error("Dashboard history loading error:", error);
        setHistory([]);
      }
    };

    loadDashboardData();

    window.addEventListener("focus", loadDashboardData);
    window.addEventListener("storage", loadDashboardData);

    return () => {
      window.removeEventListener("focus", loadDashboardData);
      window.removeEventListener("storage", loadDashboardData);
    };
  }, []);

  const totalScans = history.length;

  const normalCases = history.filter(
    (item) => normalizePrediction(item.prediction) === "Normal"
  ).length;

  const pneumoniaCases = history.filter(
    (item) => normalizePrediction(item.prediction) === "Pneumonia"
  ).length;

  const averageConfidence = useMemo(() => {
    const values = history
      .map((item) => getConfidence(item.confidence))
      .filter((value) => value !== null);

    if (values.length === 0) return "0.0";

    const average =
      values.reduce((total, value) => total + value, 0) / values.length;

    return average.toFixed(1);
  }, [history]);

  const weekData = useMemo(() => {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const counts = [0, 0, 0, 0, 0, 0, 0];

    history.forEach((item) => {
      if (!item.scan_date) return;

      const date = new Date(item.scan_date);

      if (Number.isNaN(date.getTime())) return;

      const day = date.getDay();
      const index = day === 0 ? 6 : day - 1;

      counts[index]++;
    });

    return counts.map((count, index) => ({
      day: days[index],
      count,
    }));
  }, [history]);

  const maxCount = Math.max(...weekData.map((item) => item.count), 1);

  const recent = history.slice(0, 5);

  const firstName = doctorName.trim().split(" ")[0] || "Doctor";

  return (
    <>
      <style>{`
        .med-dashboard {
          --green: #08785B;
          --green-dark: #075C46;
          --green-deep: #064B3A;
          --green-soft: #EAF5EF;
          --text: #183A2E;
          --muted: #82948A;
          --border: #E3EDE6;
          --red: #C94C4C;

          min-height: 100vh;
          background: #F5FAF6;
          color: var(--text);
          font-family: "Poppins", sans-serif;
          font-weight: 300;
        }

        .med-dashboard,
        .med-dashboard * {
          box-sizing: border-box;
          font-family: "Poppins", sans-serif;
        }

        /* Bold headings, thin normal content */

        .med-dashboard h1,
        .med-dashboard h2,
        .med-dashboard h3,
        .med-dashboard h4,
        .med-dashboard h5,
        .med-dashboard h6 {
          font-weight: 600 !important;
        }

        .med-dashboard p,
        .med-dashboard span,
        .med-dashboard label,
        .med-dashboard li {
          font-weight: 300;
        }

        .med-dashboard button {
          font-family: inherit;
          font-weight: 400;
        }

        .med-container {
          max-width: 1320px;
          margin: 0 auto;
          padding: 42px 42px 70px;
        }

        .med-topline {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          margin-bottom: 34px;
        }

        .med-overline {
          display: flex;
          align-items: center;
          gap: 9px;
          color: var(--green);
          font-size: 10px;
          font-weight: 400;
          letter-spacing: 1.7px;
          text-transform: uppercase;
          margin-bottom: 13px;
        }

        .med-overline::before {
          content: "";
          width: 22px;
          height: 1px;
          background: #83B99E;
        }

        .med-heading {
          margin: 0;
          color: #173B2D;
          font-size: 30px;
          line-height: 1.35;
          font-weight: 600 !important;
          letter-spacing: -1px;
        }

        .med-subheading {
          margin: 9px 0 0;
          color: #82948A;
          font-size: 12px;
          line-height: 1.8;
          font-weight: 300;
        }

        .med-primary-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 13px 21px;
          border: 1px solid var(--green);
          border-radius: 7px;
          background: var(--green);
          color: #FFFFFF;
          font-size: 12px;
          font-weight: 400;
          cursor: pointer;
          white-space: nowrap;
          box-shadow: 0 5px 14px rgba(8, 120, 91, 0.14);
          transition: all .2s ease;
        }

        .med-primary-button:hover {
          background: var(--green-dark);
          border-color: var(--green-dark);
          box-shadow: 0 7px 18px rgba(8, 120, 91, 0.2);
          transform: translateY(-2px);
        }

        /* Statistics cards */

        .med-stats {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 16px;
          margin-bottom: 25px;
        }

        .med-stat {
          min-width: 0;
          padding: 25px 23px;
          background: #FFFFFF;
          border: 1px solid var(--border);
          border-radius: 11px;
          box-shadow: 0 4px 18px rgba(26, 77, 51, 0.035);
          transition: transform .2s ease, box-shadow .2s ease;
        }

        .med-stat:hover {
          transform: translateY(-3px);
          box-shadow: 0 9px 24px rgba(26, 77, 51, 0.08);
        }

        .med-stat-label {
          color: #71877B;
          font-size: 11px;
          font-weight: 300;
          margin-bottom: 25px;
        }

        .med-stat-number {
          color: #174B37;
          font-size: 31px;
          line-height: 1.2;
          font-weight: 300;
          letter-spacing: -1px;
        }

        .med-stat-foot {
          color: #99A79E;
          font-size: 10px;
          margin-top: 12px;
          line-height: 1.6;
          font-weight: 300;
        }

        /* Main panels */

        .med-section-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.12fr) minmax(340px, .88fr);
          gap: 20px;
        }

        .med-panel {
          min-width: 0;
          padding: 25px 26px;
          background: #FFFFFF;
          border: 1px solid var(--border);
          border-radius: 11px;
          box-shadow: 0 4px 18px rgba(26, 77, 51, 0.035);
        }

        .med-panel-heading {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 7px;
        }

        .med-panel-title {
          margin: 0;
          color: #214A36;
          font-size: 15px;
          font-weight: 600 !important;
          letter-spacing: -.2px;
        }

        .med-panel-subtitle {
          margin: 7px 0 0;
          color: #94A198;
          font-size: 10px;
          line-height: 1.7;
          font-weight: 300;
        }

        .med-chart-total {
          padding: 6px 10px;
          border-radius: 20px;
          background: #EDF6F0;
          color: var(--green);
          font-size: 10px;
          white-space: nowrap;
        }

        /* Scan activity chart */

        .med-chart {
          height: 230px;
          display: flex;
          align-items: stretch;
          gap: 13px;
          padding: 22px 5px 0;
          margin-top: 13px;
          border-bottom: 1px solid #EAF0EB;
        }

        .med-chart-column {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-end;
        }

        .med-chart-count {
          color: #71877B;
          font-size: 10px;
          margin-bottom: 8px;
        }

        .med-chart-track {
          height: 155px;
          width: 100%;
          display: flex;
          align-items: flex-end;
          justify-content: center;
        }

        .med-chart-bar {
          width: 29px;
          max-width: 80%;
          min-height: 3px;
          background: linear-gradient(180deg, #83C5A0, #08785B);
          border-radius: 5px 5px 0 0;
          transition: height .25s ease;
        }

        .med-chart-day {
          color: #87968D;
          font-size: 10px;
          padding: 12px 0;
        }

        .med-chart-note {
          color: #A0ACA4;
          font-size: 10px;
          line-height: 1.7;
          margin-top: 15px;
        }

        /* Recent assessments */

        .med-recent-list {
          margin-top: 14px;
        }

        .med-recent-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 15px 0;
          border-bottom: 1px solid #EDF2EE;
        }

        .med-recent-item:last-child {
          border-bottom: none;
        }

        .med-patient-info {
          display: flex;
          align-items: center;
          gap: 12px;
          min-width: 0;
        }

        .med-avatar {
          width: 38px;
          height: 38px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid #DDEDE2;
          border-radius: 11px;
          background: #EAF5EF;
          color: #167653;
          font-size: 13px;
          font-weight: 400;
        }

        .med-patient-name {
          color: #345344;
          font-size: 11px;
          font-weight: 400;
          overflow-wrap: anywhere;
        }

        .med-patient-meta {
          color: #94A198;
          font-size: 10px;
          line-height: 1.8;
          margin-top: 4px;
          font-weight: 300;
        }

        .med-result {
          flex-shrink: 0;
          padding: 6px 10px;
          border-radius: 5px;
          font-size: 9px;
          font-weight: 400;
          white-space: nowrap;
        }

        .med-result-normal {
          background: #EAF5EF;
          color: #16744E;
        }

        .med-result-pneumonia {
          background: #FCECEC;
          color: #C94C4C;
        }

        .med-result-other {
          background: #F0F5F1;
          color: #637B6D;
        }

        .med-empty {
          padding: 39px 12px;
          text-align: center;
          color: #94A198;
          font-size: 11px;
          line-height: 1.9;
        }

        .med-empty strong {
          display: block;
          color: #345344;
          font-size: 12px;
          font-weight: 500;
          margin-bottom: 5px;
        }

        .med-history-button {
          width: 100%;
          margin-top: 13px;
          padding: 11px;
          border: 1px solid #DCEBE0;
          border-radius: 6px;
          background: #F5FAF6;
          color: #167653;
          font-size: 10px;
          font-weight: 400;
          cursor: pointer;
          transition: all .2s ease;
        }

        .med-history-button:hover {
          background: #EAF5EF;
          border-color: #BBDCC8;
        }

        /* Medical disclaimer */

        .med-disclaimer {
          padding: 15px 17px;
          margin-top: 22px;
          border: 1px solid #E1EDE4;
          border-radius: 8px;
          background: #FFFFFF;
          color: #71877B;
          font-size: 10px;
          line-height: 1.8;
          font-weight: 300;
        }

        @media (max-width: 950px) {
          .med-container {
            padding: 32px 24px 55px;
          }

          .med-section-grid {
            grid-template-columns: 1fr;
          }

          .med-stats {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 650px) {
          .med-container {
            padding: 27px 15px 45px;
          }

          .med-topline {
            align-items: flex-start;
            flex-direction: column;
            margin-bottom: 25px;
          }

          .med-heading {
            font-size: 25px;
          }

          .med-stats {
            gap: 11px;
          }

          .med-stat {
            padding: 18px;
          }

          .med-stat-number {
            font-size: 27px;
          }

          .med-stat-label {
            font-size: 10px;
          }

          .med-panel {
            padding: 19px 16px;
          }

          .med-chart {
            gap: 6px;
          }

          .med-chart-bar {
            width: 22px;
          }

          .med-disclaimer {
            padding: 12px;
          }
        }
      `}</style>

      <div className="med-dashboard">
        <Navbar />

        <main className="med-container">
          <header className="med-topline">
            <div>
              <div className="med-overline">Dashboard / Overview</div>

              <h1 className="med-heading">
                Good to see you, Dr. {firstName}
              </h1>

              <p className="med-subheading">
                Here's a summary of your recorded chest X-ray assessments.
              </p>
            </div>

            <button
              className="med-primary-button"
              onClick={() => navigate("/upload")}
            >
              Start a new scan
            </button>
          </header>

          <section className="med-stats">
            <div className="med-stat">
              <div className="med-stat-label">Total scans</div>
              <div className="med-stat-number">{totalScans}</div>
              <div className="med-stat-foot">
                All recorded assessments
              </div>
            </div>

            <div className="med-stat">
              <div className="med-stat-label">Normal predictions</div>
              <div className="med-stat-number">{normalCases}</div>
              <div className="med-stat-foot">
                Model classification
              </div>
            </div>

            <div className="med-stat">
              <div className="med-stat-label">Pneumonia predictions</div>
              <div className="med-stat-number">{pneumoniaCases}</div>
              <div className="med-stat-foot">
                Requires clinical review
              </div>
            </div>

            <div className="med-stat">
              <div className="med-stat-label">Average model confidence</div>
              <div className="med-stat-number">{averageConfidence}%</div>
              <div className="med-stat-foot">
                Across recorded predictions
              </div>
            </div>
          </section>

          <section className="med-section-grid">
            <div className="med-panel">
              <div className="med-panel-heading">
                <div>
                  <h2 className="med-panel-title">Scan activity</h2>
                  <p className="med-panel-subtitle">
                    Distribution of recorded scans by weekday.
                  </p>
                </div>

                <span className="med-chart-total">
                  {totalScans} total
                </span>
              </div>

              <div className="med-chart">
                {weekData.map((item) => (
                  <div className="med-chart-column" key={item.day}>
                    <span className="med-chart-count">{item.count}</span>

                    <div className="med-chart-track">
                      <div
                        className="med-chart-bar"
                        style={{
                          height: item.count
                            ? `${(item.count / maxCount) * 135}px`
                            : "3px",
                        }}
                        title={`${item.count} scans`}
                      />
                    </div>

                    <span className="med-chart-day">{item.day}</span>
                  </div>
                ))}
              </div>

              <p className="med-chart-note">
                Based on all available scan records, not just the current week.
              </p>
            </div>

            <div className="med-panel">
              <div className="med-panel-heading">
                <div>
                  <h2 className="med-panel-title">Recent assessments</h2>
                  <p className="med-panel-subtitle">
                    Your five latest recorded patient scans.
                  </p>
                </div>
              </div>

              {recent.length === 0 ? (
                <div className="med-empty">
                  <strong>No scans recorded yet</strong>
                  Your recent patient assessments will appear here.
                </div>
              ) : (
                <div className="med-recent-list">
                  {recent.map((item, index) => {
                    const prediction = normalizePrediction(item.prediction);

                    const statusClass =
                      prediction === "Normal"
                        ? "med-result-normal"
                        : prediction === "Pneumonia"
                          ? "med-result-pneumonia"
                          : "med-result-other";

                    return (
                      <div
                        className="med-recent-item"
                        key={
                          item.scan_id ||
                          `${item.scan_date || "scan"}-${index}`
                        }
                      >
                        <div className="med-patient-info">
                          <div className="med-avatar">
                            {(item.patient_name || "P")
                              .charAt(0)
                              .toUpperCase()}
                          </div>

                          <div>
                            <div className="med-patient-name">
                              {item.patient_name || "Unknown patient"}
                            </div>

                            <div className="med-patient-meta">
                              {item.age ?? "—"} yrs · {item.gender || "—"}

                              {item.scan_date && (
                                <>
                                  <br />
                                  {item.scan_date}
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        <span className={`med-result ${statusClass}`}>
                          {prediction}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}

              <button
                className="med-history-button"
                onClick={() => navigate("/history")}
              >
                View all scan records →
              </button>
            </div>
          </section>

          <div className="med-disclaimer">
            MediScan AI provides model-generated classifications for
            decision support only. Results are not a medical diagnosis
            and should be reviewed by a qualified healthcare professional.
          </div>
        </main>
      </div>
    </>
  );
}
