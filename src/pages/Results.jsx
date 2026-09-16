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
        <div style={{ padding: "40px" }}>
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
          background: "#F3F7FF",
          padding: "35px",
          fontFamily: "Poppins, sans-serif",
        }}
      >
        <h1 style={{ color: "#1D4ED8", marginBottom: "6px" }}>
          AI Analysis Result
        </h1>

        <p style={{ color: "#64748B", marginBottom: "25px" }}>
          Patient: <b>{result.patient_name}</b> • {result.age} yrs •{" "}
          {result.gender}
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "25px",
          }}
        >
          <div
            style={{
              background: "white",
              borderRadius: "18px",
              padding: "20px",
              boxShadow: "0 10px 25px rgba(0,0,0,.08)",
            }}
          >
            <h3 style={{ marginBottom: "15px" }}>Original X-Ray</h3>

            <img
              src={result.original_image}
              alt="Original X-Ray"
              style={{
                width: "100%",
                borderRadius: "12px",
              }}
            />
          </div>

          <div
            style={{
              background: "white",
              borderRadius: "18px",
              padding: "20px",
              boxShadow: "0 10px 25px rgba(0,0,0,.08)",
            }}
          >
            <h3 style={{ marginBottom: "15px" }}>AI Heatmap</h3>

            <img
              src={result.heatmap}
              alt="Heatmap"
              style={{
                width: "100%",
                borderRadius: "12px",
              }}
            />
          </div>
        </div>

        <div
          style={{
            marginTop: "28px",
            background: "white",
            borderRadius: "18px",
            padding: "22px",
            boxShadow: "0 10px 25px rgba(0,0,0,.08)",
          }}
        >
          <h2 style={{ marginBottom: "15px" }}>Diagnosis Summary</h2>

          <table
            style={{
              width: "100%",
              fontSize: "16px",
            }}
          >
            <tbody>
              <tr>
                <td><b>Doctor</b></td>
                <td>Dr. {result.username}</td>
              </tr>

              <tr>
                <td><b>Prediction</b></td>
                <td>{result.prediction}</td>
              </tr>

              <tr>
                <td><b>Confidence</b></td>
                <td>{result.confidence}%</td>
              </tr>
            </tbody>
          </table>

          <a
            href={result.pdf}
            target="_blank"
            rel="noreferrer"
            style={{
              display: "inline-block",
              marginTop: "20px",
              background: "#2563EB",
              color: "white",
              padding: "12px 22px",
              borderRadius: "10px",
              textDecoration: "none",
              fontWeight: "600",
            }}
          >
            Download PDF Report
          </a>
        </div>
      </div>
    </>
  );
}