import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

const API = "https://https://mediscanai-backend-pzfz.onrender.com";

export default function History() {
  const [history, setHistory] = useState([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);

  const doctor = localStorage.getItem("doctorName") || "Doctor";

  useEffect(() => {
    fetch(`${API}/history/${doctor}`)
      .then((res) => res.json())
      .then((data) => setHistory(data))
      .catch((err) => console.log(err));
  }, [doctor]);

  const filtered = history.filter((item) =>
    item.patient_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <style>{`
      *{
        margin:0;
        padding:0;
        box-sizing:border-box;
        font-family:Poppins,sans-serif;
      }

      body{
        background:#EEF4FF;
      }

      .page{
        min-height:100vh;
        background:#EEF4FF;
      }

      .container{
        max-width:1400px;
        margin:auto;
        padding:35px;
      }

      h1{
        font-size:56px;
        font-weight:300;
        color:#111827;
      }

      .doctor{
        font-size:24px;
        color:#111827 !important;
        margin:12px 0 28px;
        font-weight:500;
      }

      .doctor b{
        color:#111827 !important;
      }

      .search{
        width:340px;
        padding:14px 18px;
        border-radius:12px;
        border:1px solid #CBD5E1;
        font-size:16px;
        margin-bottom:20px;
        outline:none;
        color:#111827;
      }

      table{
        width:100%;
        border-collapse:collapse;
        background:white;
        border-radius:16px;
        overflow:hidden;
      }

      thead{
        background:#2563EB;
        color:white;
      }

      thead th{
        color:white;
      }

      th,td{
        padding:15px;
        text-align:center;
      }

      tbody tr{
        border-bottom:1px solid #E5E7EB;
      }

      tbody tr:hover{
        background:#F8FAFC;
      }

      td{
        color:#111827;
      }

      .normal{
        color:#16A34A;
        font-weight:600;
      }

      .alert{
        color:#DC2626;
        font-weight:600;
      }

      .viewBtn{
        background:#1D4ED8;
        color:white;
        border:none;
        padding:9px 18px;
        border-radius:8px;
        cursor:pointer;
      }

      .overlay{
        position:fixed;
        inset:0;
        background:rgba(0,0,0,.45);
        display:flex;
        justify-content:center;
        align-items:center;
        z-index:999;
        padding:20px;
      }

      .modal{
        width:900px;
        max-width:100%;
        max-height:90vh;
        overflow-y:auto;
        background:white;
        border-radius:22px;
        padding:28px;
      }

      .modal h2{
        color:#111827;
        margin-bottom:18px;
      }

      .details{
        color:#111827;
        line-height:34px;
        font-size:17px;
      }

      .details b{
        color:#111827;
      }

      .grid{
        display:grid;
        grid-template-columns:1fr 1fr;
        gap:20px;
        margin-top:25px;
      }

      .card{
        background:#F8FBFF;
        border-radius:14px;
        padding:14px;
      }

      .card h3{
        text-align:center;
        color:#111827;
        margin-bottom:10px;
      }

      .img{
        width:100%;
        height:320px;
        object-fit:contain;
        background:#E5E7EB;
        border-radius:12px;
      }

      .pdfBtn{
        display:block;
        width:100%;
        text-align:center;
        text-decoration:none;
        margin-top:20px;
        background:#16A34A;
        color:white;
        padding:14px;
        border-radius:12px;
        font-weight:600;
      }

      .closeBtn{
        width:100%;
        margin-top:15px;
        padding:14px;
        border:none;
        border-radius:12px;
        background:#2563EB;
        color:white;
        font-size:16px;
        cursor:pointer;
      }

      .empty{
        margin-top:30px;
        color:#64748B;
        font-size:22px;
      }

      @media(max-width:768px){
        .grid{
          grid-template-columns:1fr;
        }

        h1{
          font-size:42px;
        }

        .search{
          width:100%;
        }
      }
      `}</style>

      <Navbar />

      <div className="page">
        <div className="container">
          <h1>Scan History</h1>

          <div className="doctor">
            Doctor: <b>Dr. {doctor}</b>
          </div>

          <input
            className="search"
            placeholder="🔍 Search patient name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {filtered.length === 0 ? (
            <div className="empty">No scans found.</div>
          ) : (
            <table>
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
                      className={
                        item.prediction === "Normal" ? "normal" : "alert"
                      }
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
        </div>
      </div>

      {selected && (
        <div className="overlay" onClick={() => setSelected(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>🩺 Patient Details</h2>

            <div className="details">
              <b>Name:</b> {selected.patient_name}
              <br />
              <b>Age:</b> {selected.age}
              <br />
              <b>Gender:</b> {selected.gender}
              <br />
              <b>Doctor:</b> Dr. {selected.username}
              <br />
              <b>Prediction:</b> {selected.prediction}
              <br />
              <b>Confidence:</b> {selected.confidence}%
              <br />
              <b>Date:</b> {selected.date}
            </div>

            <div className="grid">
              <div className="card">
                <h3>Original X-Ray</h3>

                <img
                  src={selected.original_image}
                  alt="Original X-Ray"
                  className="img"
                />
              </div>

              <div className="card">
                <h3>AI Heatmap</h3>

                <img
                  src={selected.heatmap}
                  alt="AI Heatmap"
                  className="img"
                  onError={(e) => {
                    e.target.src = selected.original_image;
                  }}
                />
              </div>
            </div>

            <a
              href={selected.pdf}
              target="_blank"
              rel="noreferrer"
              className="pdfBtn"
            >
              📄 Download Medical Report (PDF)
            </a>

            <button
              className="closeBtn"
              onClick={() => setSelected(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}