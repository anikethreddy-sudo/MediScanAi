import { useNavigate } from "react-router-dom";

export default function PatientDetails() {
  const navigate = useNavigate();

  const scan = JSON.parse(localStorage.getItem("selectedScan"));

  if (!scan) {
    return (
      <div
        style={{
          background: "#020817",
          color: "white",
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontFamily: "Arial",
        }}
      >
        <h2>No Patient Selected</h2>
      </div>
    );
  }

  const isNormal = scan.disease === "NORMAL";

  return (
    <div
      style={{
        background: "#020817",
        color: "white",
        minHeight: "100vh",
        fontFamily: "Arial",
        padding: "40px",
      }}
    >
      <div style={{ maxWidth: "1100px", margin: "auto" }}>
        {/* Back Button */}
        <button
          onClick={() => navigate("/history")}
          style={{
            background: "#2563EB",
            color: "white",
            border: "none",
            padding: "10px 18px",
            borderRadius: "8px",
            cursor: "pointer",
            marginBottom: "20px",
          }}
        >
          ← Back to History
        </button>

        <h1>🩺 Patient Medical Report</h1>
        <p style={{ color: "#94A3B8" }}>
          Complete AI Diagnosis Report
        </p>

        {/* Patient Information */}
        <div
          style={{
            background: "#111827",
            borderRadius: "16px",
            padding: "24px",
            marginTop: "25px",
          }}
        >
          <h2>👤 Patient Information</h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "15px",
              marginTop: "15px",
            }}
          >
            <Info title="Patient Name" value={scan.patient_name} />
            <Info title="Age" value={scan.age} />
            <Info title="Gender" value={scan.gender} />
            <Info title="Date" value={scan.created_at} />
          </div>
        </div>

        {/* AI Result */}
        <div
          style={{
            background: "#111827",
            borderRadius: "16px",
            padding: "24px",
            marginTop: "20px",
          }}
        >
          <h2>🤖 AI Diagnosis</h2>

          <div
            style={{
              display: "inline-block",
              marginTop: "15px",
              padding: "10px 22px",
              borderRadius: "25px",
              background: isNormal ? "#14532D" : "#7F1D1D",
              color: isNormal ? "#4ADE80" : "#F87171",
              fontWeight: "bold",
              fontSize: "18px",
            }}
          >
            {scan.disease}
          </div>

          <h3 style={{ marginTop: "18px" }}>
            Confidence : {scan.confidence}%
          </h3>
        </div>

        {/* Images */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "20px",
            marginTop: "20px",
          }}
        >
          <div
            style={{
              background: "#111827",
              borderRadius: "16px",
              padding: "18px",
            }}
          >
            <h3>🩻 Original X-Ray</h3>

            <img
              src={scan.original_image}
              alt="Original"
              style={{
                width: "100%",
                borderRadius: "12px",
                marginTop: "10px",
              }}
            />
          </div>

          <div
            style={{
              background: "#111827",
              borderRadius: "16px",
              padding: "18px",
            }}
          >
            <h3>🔥 AI Heatmap</h3>

            <img
              src={scan.heatmap_image}
              alt="Heatmap"
              style={{
                width: "100%",
                borderRadius: "12px",
                marginTop: "10px",
              }}
            />
          </div>
        </div>

        {/* Recommendation */}
        <div
          style={{
            background: "#111827",
            borderRadius: "16px",
            padding: "24px",
            marginTop: "20px",
          }}
        >
          <h2>👨‍⚕ Doctor Recommendation</h2>

          {isNormal ? (
            <p
              style={{
                color: "#4ADE80",
                fontSize: "17px",
                lineHeight: "1.8",
              }}
            >
              No significant pneumonia detected. Continue a healthy lifestyle,
              stay hydrated, and consult a physician if symptoms persist.
            </p>
          ) : (
            <p
              style={{
                color: "#F87171",
                fontSize: "17px",
                lineHeight: "1.8",
              }}
            >
              Possible pneumonia detected. Immediate medical consultation and
              further clinical evaluation are strongly recommended.
            </p>
          )}
        </div>

        {/* PDF Button */}
        <div style={{ textAlign: "center", marginTop: "30px" }}>
          <button
            onClick={() => navigate("/results")}
            style={{
              background: "#2563EB",
              color: "white",
              border: "none",
              padding: "15px 30px",
              borderRadius: "10px",
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: "16px",
            }}
          >
            📄 Open Downloadable Report
          </button>
        </div>
      </div>
    </div>
  );
}

function Info({ title, value }) {
  return (
    <div
      style={{
        background: "#1F2937",
        borderRadius: "12px",
        padding: "16px",
      }}
    >
      <p
        style={{
          margin: 0,
          color: "#94A3B8",
          fontSize: "13px",
        }}
      >
        {title}
      </p>

      <h3 style={{ margin: "8px 0 0" }}>{value}</h3>
    </div>
  );
}