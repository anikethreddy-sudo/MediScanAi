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
      <style>{`
        *{
          font-family:Poppins,sans-serif;
        }

        .overlay{
          position:fixed;
          inset:0;
          background:rgba(0,0,0,.55);
          display:flex;
          justify-content:center;
          align-items:center;
          z-index:999;
          padding:20px;
        }

        .modal{
          background:#fff;
          width:950px;
          max-width:95%;
          max-height:90vh;
          overflow-y:auto;
          border-radius:22px;
          padding:28px;
          color:#111827;
          box-shadow:0 20px 60px rgba(0,0,0,.25);
        }

        .modal::-webkit-scrollbar{
          width:8px;
        }

        .modal::-webkit-scrollbar-thumb{
          background:#2563EB;
          border-radius:10px;
        }

        .closeBtn{
          width:100%;
          padding:14px;
          border:none;
          border-radius:12px;
          background:#2563EB;
          color:white;
          font-size:16px;
          font-weight:600;
          cursor:pointer;
          margin-top:20px;
        }

        .closeBtn:hover{
          background:#1D4ED8;
        }

        .table{
          width:100%;
          border-collapse:collapse;
          background:white;
          border-radius:14px;
          overflow:hidden;
        }

        .table th{
          background:#2563EB;
          color:white;
          padding:14px;
        }

        .table td{
          padding:12px;
          text-align:center;
          color:#111827;
          border-bottom:1px solid #E5E7EB;
        }

        .viewBtn{
          background:#1D4ED8;
          color:white;
          border:none;
          padding:8px 18px;
          border-radius:8px;
          cursor:pointer;
        }

        .search{
          width:330px;
          padding:14px;
          border-radius:12px;
          border:1px solid #CBD5E1;
          margin-bottom:22px;
          font-size:16px;
        }

        @media(max-width:768px){
          .modal{
            width:100%;
            padding:18px;
          }

          .search{
            width:100%;
          }

          .images{
            grid-template-columns:1fr !important;
          }
        }
      `}</style>

      <Navbar />

      <div
        style={{
          padding: "35px",
          background: "#EEF4FF",
          minHeight: "100vh",
        }}
      >
        <h1
          style={{
            fontSize: "56px",
            fontWeight: "300",
            color: "#111827",
          }}
        >
          Scan History
        </h1>

        <p
          style={{
            color: "#374151",
            fontSize: "24px",
            marginBottom: "25px",
          }}
        >
          Doctor: {localStorage.getItem("doctorName")}
        </p>

        <input
          className="search"
          type="text"
          placeholder="🔍 Search patient name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {filtered.length === 0 ? (
          <h3 style={{ color: "#111827" }}>No scans found.</h3>
        ) : (
          <table className="table">
            <thead>
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
                <tr key={index}>
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
                      className="viewBtn"
                      onClick={() => setSelected(item)}
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
          <div className="overlay" onClick={() => setSelected(null)}>
            <div
              className="modal"
              onClick={(e) => e.stopPropagation()}
            >
              <h2
                style={{
                  color: "#111827",
                  marginBottom: "18px",
                }}
              >
                Patient Details
              </h2>

              <div
                style={{
                  color: "#111827",
                  lineHeight: "32px",
                  fontSize: "17px",
                }}
              >
                <b>Name:</b> {selected.patient_name}
                <br />
                <b>Age:</b> {selected.age}
                <br />
                <b>Gender:</b> {selected.gender}
                <br />
                <b>Doctor:</b> {selected.username}
                <br />
                <b>Prediction:</b> {selected.prediction}
                <br />
                <b>Confidence:</b> {selected.confidence}%
                <br />
                <b>Date:</b> {selected.date}
              </div>

              <div
                className="images"
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "20px",
                  marginTop: "28px",
                }}
              >
                <div>
                  <h3
                    style={{
                      textAlign: "center",
                      color: "#111827",
                      marginBottom: "10px",
                    }}
                  >
                    Original X-Ray
                  </h3>

                  <img
                    src={selected.original_image}
                    alt="Original"
                    style={{
                      width: "100%",
                      height: "300px",
                      objectFit: "contain",
                      background: "#EEF4FF",
                      borderRadius: "14px",
                    }}
                  />
                </div>

                <div>
                  <h3
                    style={{
                      textAlign: "center",
                      color: "#111827",
                      marginBottom: "10px",
                    }}
                  >
                    AI Heatmap
                  </h3>

                  <img
                    src={selected.heatmap}
                    alt="Heatmap"
                    style={{
                      width: "100%",
                      height: "300px",
                      objectFit: "contain",
                      background: "#EEF4FF",
                      borderRadius: "14px",
                    }}
                    onError={(e) => {
                      e.target.src = selected.original_image;
                    }}
                  />
                </div>
              </div>

              <button
                className="closeBtn"
                onClick={() => setSelected(null)}
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