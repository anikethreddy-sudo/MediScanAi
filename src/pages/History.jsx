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
          background: "#F4F8FF",
          minHeight: "100vh",
          color: "#111827",
        }}
      >
        <h1 style={{ fontSize: "48px", marginBottom: "8px" }}>
          Scan History
        </h1>

        <p style={{ color: "#475569", marginBottom: "25px" }}>
          Doctor: {localStorage.getItem("doctorName")}
        </p>

        {/* SEARCH BAR */}
        <input
          type="text"
          placeholder="🔍 Search patient name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: "320px",
            padding: "12px 16px",
            borderRadius: "10px",
            border: "1px solid #CBD5E1",
            marginBottom: "22px",
            fontSize: "15px",
            outline: "none",
          }}
        />

        {filtered.length === 0 ? (
          <h3>No patient found.</h3>
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
            <thead
              style={{
                background: "#2563EB",
                color: "white",
              }}
            >
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
                  <td>{item.patient_name}</td>
                  <td>{item.age}</td>
                  <td>{item.gender}</td>

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

                  <td>{item.confidence}%</td>
                  <td>{item.date}</td>

                  <td>
                    <button
                      onClick={() => setSelected(item)}
                      style={{
                        background: "#2563EB",
                        color: "white",
                        border: "none",
                        padding: "8px 16px",
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

        {/* VIEW POPUP */}
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
                background: "white",
                width: "420px",
                borderRadius: "18px",
                padding: "25px",
              }}
            >
              <h2
                style={{
                  marginBottom: "18px",
                  color: "#1D4ED8",
                }}
              >
                Patient Details
              </h2>

              <p>
                <b>Name:</b> {selected.patient_name}
              </p>
              <p>
                <b>Age:</b> {selected.age}
              </p>
              <p>
                <b>Gender:</b> {selected.gender}
              </p>
              <p>
                <b>Doctor:</b> {selected.username}
              </p>
              <p>
                <b>Prediction:</b> {selected.prediction}
              </p>
              <p>
                <b>Confidence:</b> {selected.confidence}%
              </p>
              <p>
                <b>Date:</b> {selected.date}
              </p>

              <div style={{ marginTop: "22px" }}>
                <img
                  src={selected.original_image}
                  alt="X-Ray"
                  style={{
                    width: "100%",
                    borderRadius: "12px",
                    border: "1px solid #E5E7EB",
                  }}
                />
              </div>

              <button
                onClick={() => setSelected(null)}
                style={{
                  width: "100%",
                  marginTop: "20px",
                  padding: "12px",
                  border: "none",
                  borderRadius: "10px",
                  background: "#2563EB",
                  color: "white",
                  fontSize: "15px",
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