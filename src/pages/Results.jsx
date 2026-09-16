import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

export default function Results() {
  const [result, setResult] = useState(null);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("result"));
    setResult(data);
  }, []);

  if (!result) {
    return (
      <>
        <Navbar />
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontFamily: "Poppins, sans-serif",
          }}
        >
          <h2>No Result Found</h2>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div
        style={{
          minHeight: "100vh",
          background: "#F4F8FF",
          padding: "35px",
          fontFamily: "Poppins, sans-serif",
          color: "#111827",
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "auto" }}>
          <h1
            style={{
              fontSize: "42px",
              marginBottom: "8px",
              color: "#111827",
            }}
          >
            AI Analysis Result
          </h1>

          <p
            style={{
              color: "#374151",
              fontSize: "18px",
              marginBottom: "28px",
            }}
          >
            Patient: <b>{result.patient_name}</b> • {result.age} yrs •{" "}
            {result.gender}
          </p>

          {/* Images */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(420px,1fr))",
              gap: "22px",
            }}
          >
            {/* Original */}
            <div
              style={{
                background: "white",
                borderRadius: "18px",
                padding: "18px",
                border: "1px solid #DCE8FF",
              }}
            >
              <h2 style={{ color: "#111827", marginBottom: "15px" }}>
                Original X-Ray
              </h2>

              <img
                src={result.original_image}
                alt="Original X-Ray"
                style={{
                  width: "100%",
                  height: "420px",
                  objectFit: "contain",
                  borderRadius: "14px",
                  background: "#EEF4FF",
                }}
              />
            </div>

            {/* Heatmap */}
            <div
              style={{
                background: "white",
                borderRadius: "18px",
                padding: "18px",
                border: "1px solid #DCE8FF",
              }}
            >
              <h2 style={{ color: "#111827", marginBottom: "15px" }}>
                AI Heatmap
              </h2>

              <img
                src={result.heatmap}
                alt="AI Heatmap"
                style={{
                  width: "100%",
                  height: "420px",
                  objectFit: "contain",
                  borderRadius: "14px",
                  background: "#EEF4FF",
                }}
                onError={(e) => {
                  e.target.src = result.original_image;
                }}
              />
            </div>
          </div>

          {/* Summary */}
          <div
            style={{
              marginTop: "28px",
              background: "white",
              borderRadius: "18px",
              border: "1px solid #DCE8FF",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                padding: "18px 22px",
                borderBottom: "1px solid #E5E7EB",
              }}
            >
              <h2 style={{ color: "#111827" }}>Diagnosis Summary</h2>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))",
                gap: "20px",
                padding: "22px",
              }}
            >
              <div>
                <p style={{ color: "#6B7280", fontSize: "14px" }}>Doctor</p>
                <h3 style={{ color: "#111827" }}>Dr. {result.username}</h3>
              </div>

              <div>
                <p style={{ color: "#6B7280", fontSize: "14px" }}>Prediction</p>
                <h3
                  style={{
                    color:
                      result.prediction === "Normal"
                        ? "#16A34A"
                        : "#DC2626",
                  }}
                >
                  {result.prediction}
                </h3>
              </div>

              <div>
                <p style={{ color: "#6B7280", fontSize: "14px" }}>Confidence</p>
                <h3 style={{ color: "#111827" }}>{result.confidence}%</h3>
              </div>

              <div>
                <p style={{ color: "#6B7280", fontSize: "14px" }}>Patient</p>
                <h3 style={{ color: "#111827" }}>{result.patient_name}</h3>
              </div>

              <div>
                <p style={{ color: "#6B7280", fontSize: "14px" }}>Age</p>
                <h3 style={{ color: "#111827" }}>{result.age}</h3>
              </div>

              <div>
                <p style={{ color: "#6B7280", fontSize: "14px" }}>Gender</p>
                <h3 style={{ color: "#111827" }}>{result.gender}</h3>
              </div>
            </div>

            {/* PDF Button */}
            <div style={{ padding: "0 22px 22px" }}>
              <a
                href={result.pdf}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: "block",
                  width: "100%",
                  textAlign: "center",
                  background: "linear-gradient(90deg,#2563EB,#3B82F6)",
                  color: "white",
                  padding: "16px",
                  borderRadius: "12px",
                  textDecoration: "none",
                  fontWeight: "600",
                  fontSize: "17px",
                }}
              >
                ⬇ Download PDF Report
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}