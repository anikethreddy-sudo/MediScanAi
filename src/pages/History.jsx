import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

export default function History() {
  const [history, setHistory] = useState([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const doctor = localStorage.getItem("doctorName");

    const allHistory =
      JSON.parse(localStorage.getItem("scanHistory")) || [];

    const myHistory = allHistory.filter(
      (item) => item.username === doctor
    );

    setHistory(myHistory.reverse());
  }, []);

  const filtered = history.filter((item) =>
    item.patient_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Navbar />

      <div
        style={{
          padding: "35px",
          background: "#EEF4FF",
          minHeight: "100vh",
        }}
      >
        <h1 style={{ fontSize: "56px", fontWeight: "300" }}>
          Scan History
        </h1>

        <p
          style={{
            marginBottom: "25px",
            color: "#374151",
            fontSize: "24px",
          }}
        >
          Doctor: {localStorage.getItem("doctorName")}
        </p>

        <input
          type="text"
          placeholder="🔍 Search patient name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: "320px",
            padding: "14px",
            borderRadius: "12px",
            border: "1px solid #CBD5E1",
            marginBottom: "20px",
            fontSize: "16px",
          }}
        />

        {filtered.length === 0 ? (
          <h3>No scans found.</h3>
        ) : (
          <table
            width="100%"
            cellPadding="12"
            style={{
              background: "white",
              borderRadius: "14px",
              overflow: "hidden",
              borderCollapse: "collapse",
            }}
          >
            <thead style={{ background: "#2563EB", color: "white" }}>
              <tr>
                <th>Patient</th>
                <th>Age</th>
                <th>Gender</th>
                <th>Prediction</th>
                <th>Confidence</th>
                <th>Date</th>
                <th>View</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((item, index) => (
                <tr
                  key={index}
                  style={{
                    textAlign: "center",
                    borderBottom: "1px solid #E5E7EB",
                  }}
                >
                  <td style={{ color: "#111827" }}>{item.patient_name}</td>
                  <td style={{ color: "#111827" }}>{item.age}</td>
                  <td style={{ color: "#111827" }}>{item.gender}</td>

                  <td
                    style={{
                      color:
                        item.prediction === "Normal"
                          ? "#16A34A"
                          : "#DC2626",
                      fontWeight: "600",
                    }}
                  >
                    {item.prediction}
                  </td>

                  <td style={{ color: "#111827" }}>
                    {item.confidence}%
                  </td>

                  <td style={{ color: "#111827" }}>{item.date}</td>

                  <td>
                    <button
                      onClick={() => setSelected(item)}
                      style={{
                        background: "#1D4ED8",
                        color: "white",
                        border: "none",
                        padding: "8px 18px",
                        borderRadius: "8px",
                        cursor: "pointer",
                      }}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {selected && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,.45)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div
              style={{
                width: "560px",
                background: "white",
                borderRadius: "22px",
                padding: "25px",
              }}
            >
              <h2
                style={{
                  color: "#2563EB",
                  marginBottom: "15px",
                }}
              >
                Patient Details
              </h2>

              <p><b>Name:</b> {selected.patient_name}</p>
              <p><b>Age:</b> {selected.age}</p>
              <p><b>Gender:</b> {selected.gender}</p>
              <p><b>Doctor:</b> {selected.username}</p>
              <p><b>Prediction:</b> {selected.prediction}</p>
              <p><b>Confidence:</b> {selected.confidence}%</p>
              <p><b>Date:</b> {selected.date}</p>

              <div style={{ marginTop: "18px", textAlign: "center" }}>
                <img
                  src={selected.original_image}
                  alt="X-Ray"
                  style={{
                    width: "100%",
                    maxWidth: "320px",
                    borderRadius: "12px",
                    border: "1px solid #D1D5DB",
                  }}
                  onError={(e) => {
                    e.target.src =
                      "https://placehold.co/320x320?text=No+X-Ray";
                  }}
                />
              </div>

              <button
                onClick={() => setSelected(null)}
                style={{
                  width: "100%",
                  marginTop: "20px",
                  background: "#2563EB",
                  color: "white",
                  border: "none",
                  padding: "14px",
                  borderRadius: "12px",
                  fontSize: "16px",
                  cursor: "pointer",
                }}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}