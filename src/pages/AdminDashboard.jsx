import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

const API = "https://https://mediscanai-backend-pzfz.onrender.com";

export default function AdminDashboard() {
  const [scans, setScans] = useState([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    fetch(`${API}/admin/scans`)
      .then((res) => res.json())
      .then((data) => setScans(data))
      .catch((err) => console.log(err));
  }, []);

  const filtered = scans.filter(
    (item) =>
      item.patient_name.toLowerCase().includes(search.toLowerCase()) ||
      item.username.toLowerCase().includes(search.toLowerCase())
  );

  const total = scans.length;
  const doctors = [...new Set(scans.map((x) => x.username))].length;
  const normal = scans.filter((x) => x.prediction === "Normal").length;
  const pneumonia = total - normal;

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
        font-size:46px;
        color:#111827;
        margin-bottom:8px;
      }

      .sub{
        color:#64748B;
        margin-bottom:28px;
      }

      .stats{
        display:grid;
        grid-template-columns:repeat(4,1fr);
        gap:18px;
        margin-bottom:28px;
      }

      .card{
        background:white;
        padding:22px;
        border-radius:18px;
        box-shadow:0 8px 20px rgba(0,0,0,.06);
      }

      .icon{
        font-size:30px;
      }

      .value{
        font-size:34px;
        color:#2563EB;
        font-weight:700;
        margin-top:10px;
      }

      .label{
        color:#64748B;
        margin-top:6px;
      }

      .search{
        width:340px;
        padding:14px 18px;
        border:1px solid #CBD5E1;
        border-radius:12px;
        outline:none;
        margin-bottom:18px;
        font-size:15px;
      }

      table{
        width:100%;
        border-collapse:collapse;
        background:white;
        border-radius:14px;
        overflow:hidden;
      }

      thead{
        background:#2563EB;
        color:white;
      }

      th,td{
        padding:14px;
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

      .view{
        background:#2563EB;
        color:white;
        border:none;
        padding:8px 16px;
        border-radius:8px;
        cursor:pointer;
      }

      .overlay{
        position:fixed;
        inset:0;
        background:rgba(0,0,0,.55);
        display:flex;
        justify-content:center;
        align-items:center;
        padding:20px;
        z-index:999;
      }

      .modal{
        width:920px;
        max-width:100%;
        max-height:90vh;
        overflow-y:auto;
        background:white;
        border-radius:22px;
        padding:28px;
      }

      .details{
        color:#111827;
        line-height:30px;
        margin-top:12px;
      }

      .grid{
        display:grid;
        grid-template-columns:1fr 1fr;
        gap:18px;
        margin-top:20px;
      }

      .img{
        width:100%;
        height:300px;
        object-fit:contain;
        background:#EEF4FF;
        border-radius:12px;
      }

      .btn{
        width:100%;
        margin-top:18px;
        padding:14px;
        border:none;
        border-radius:10px;
        background:#2563EB;
        color:white;
        cursor:pointer;
        font-size:16px;
      }

      .pdf{
        display:block;
        text-align:center;
        text-decoration:none;
        background:#16A34A;
        color:white;
        padding:14px;
        border-radius:10px;
        margin-top:20px;
        font-weight:600;
      }

      @media(max-width:900px){
        .stats{
          grid-template-columns:repeat(2,1fr);
        }

        .grid{
          grid-template-columns:1fr;
        }
      }

      @media(max-width:600px){
        .stats{
          grid-template-columns:1fr;
        }

        .search{
          width:100%;
        }
      }
      `}</style>

      <Navbar/>

      <div className="page">
        <div className="container">

          <h1>Hospital Admin Dashboard</h1>
          <div className="sub">
            View all doctors and patient AI scans
          </div>

          <div className="stats">

            <div className="card">
              <div className="icon">🩺</div>
              <div className="value">{total}</div>
              <div className="label">Total Scans</div>
            </div>

            <div className="card">
              <div className="icon">👨‍⚕️</div>
              <div className="value">{doctors}</div>
              <div className="label">Doctors</div>
            </div>

            <div className="card">
              <div className="icon">✅</div>
              <div className="value">{normal}</div>
              <div className="label">Normal</div>
            </div>

            <div className="card">
              <div className="icon">⚠️</div>
              <div className="value">{pneumonia}</div>
              <div className="label">Pneumonia</div>
            </div>

          </div>

          <input
            className="search"
            placeholder="🔍 Search doctor or patient..."
            value={search}
            onChange={(e)=>setSearch(e.target.value)}
          />

          <table>

            <thead>
              <tr>
                <th>Doctor</th>
                <th>Patient</th>
                <th>Age</th>
                <th>Prediction</th>
                <th>Confidence</th>
                <th>View</th>
              </tr>
            </thead>

            <tbody>

              {filtered.map((item,index)=>(
                <tr key={index}>

                  <td>{item.username}</td>

                  <td>{item.patient_name}</td>

                  <td>{item.age}</td>

                  <td className={
                    item.prediction==="Normal" ? "normal":"alert"
                  }>
                    {item.prediction}
                  </td>

                  <td>{item.confidence}%</td>

                  <td>
                    <button
                      className="view"
                      onClick={()=>setSelected(item)}
                    >
                      View
                    </button>
                  </td>

                </tr>
              ))}

            </tbody>

          </table>

        </div>
      </div>

      {selected && (

        <div
          className="overlay"
          onClick={()=>setSelected(null)}
        >

          <div
            className="modal"
            onClick={(e)=>e.stopPropagation()}
          >

            <h2 style={{color:"#111827"}}>
              Patient Details
            </h2>

            <div className="details">
              <b>Doctor:</b> Dr. {selected.username}<br/>
              <b>Patient:</b> {selected.patient_name}<br/>
              <b>Age:</b> {selected.age}<br/>
              <b>Gender:</b> {selected.gender}<br/>
              <b>Prediction:</b> {selected.prediction}<br/>
              <b>Confidence:</b> {selected.confidence}%<br/>
            </div>

            <div className="grid">

              <div>
                <h3
                  style={{
                    textAlign:"center",
                    color:"#111827",
                    marginBottom:"10px"
                  }}
                >
                  Original X-Ray
                </h3>

                <img
                  src={selected.original_image}
                  className="img"
                  alt="Original"
                />
              </div>

              <div>
                <h3
                  style={{
                    textAlign:"center",
                    color:"#111827",
                    marginBottom:"10px"
                  }}
                >
                  AI Heatmap
                </h3>

                <img
                  src={selected.heatmap}
                  className="img"
                  alt="Heatmap"
                />
              </div>

            </div>

            <a
              href={selected.pdf}
              target="_blank"
              rel="noreferrer"
              className="pdf"
            >
              📄 Download PDF Report
            </a>

            <button
              className="btn"
              onClick={()=>setSelected(null)}
            >
              Close
            </button>

          </div>

        </div>

      )}

    </>
  );
}