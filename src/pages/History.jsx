import { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";

export default function History() {
  const [history, setHistory] = useState([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("scanHistory")) || [];
    setHistory(data.reverse());
  }, []);

  const filteredHistory = useMemo(() => {
    return history.filter((item) => {
      const patient = (item.patient_name || "").toLowerCase();
      const doctor = (item.username || "Unknown").toLowerCase();
      return (
        patient.includes(search.toLowerCase()) ||
        doctor.includes(search.toLowerCase())
      );
    });
  }, [history, search]);

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
          background:#04184D;
        }

        .page{
          min-height:100vh;
          background:linear-gradient(135deg,#04184D,#0A2E73);
        }

        .container{
          max-width:1200px;
          margin:auto;
          padding:30px;
        }

        .title{
          color:white;
          font-size:38px;
          font-weight:300;
        }

        .sub{
          color:#D6E5FF;
          margin:8px 0 22px;
        }

        .search{
          width:100%;
          padding:14px 18px;
          border:none;
          border-radius:12px;
          margin-bottom:24px;
          font-size:15px;
          outline:none;
        }

        .card{
          background:#EAF2FF;
          border-radius:18px;
          padding:18px;
          display:grid;
          grid-template-columns:110px 1fr auto;
          gap:18px;
          align-items:center;
          margin-bottom:16px;
        }

        .img{
          width:110px;
          height:110px;
          object-fit:cover;
          border-radius:12px;
        }

        .name{
          font-size:22px;
          font-weight:300;
          color:#111827;
        }

        .info{
          color:#64748B;
          font-size:14px;
          margin-top:5px;
        }

        .badge{
          background:#DCFCE7;
          color:#166534;
          padding:8px 14px;
          border-radius:20px;
          font-size:13px;
          display:inline-block;
          margin-bottom:10px;
        }

        .view{
          background:linear-gradient(90deg,#2563EB,#38BDF8);
          color:white;
          border:none;
          padding:10px 18px;
          border-radius:10px;
          cursor:pointer;
          width:90px;
        }

        .overlay{
          position:fixed;
          inset:0;
          background:rgba(0,0,0,.55);
          display:flex;
          justify-content:center;
          align-items:center;
          z-index:999;
        }

        .modal{
          background:white;
          width:950px;
          max-width:95%;
          border-radius:22px;
          padding:24px;
          max-height:92vh;
          overflow:auto;
        }

        .top{
          display:flex;
          justify-content:space-between;
          align-items:center;
        }

        .close{
          width:38px;
          height:38px;
          border:none;
          border-radius:50%;
          background:#EEF2FF;
          cursor:pointer;
          font-size:18px;
        }

        .grid{
          display:grid;
          grid-template-columns:1fr 1fr;
          gap:18px;
          margin:20px 0;
        }

        .scan{
          width:100%;
          border-radius:14px;
        }

        .section{
          background:#F8FBFF;
          border-radius:14px;
          padding:18px;
          margin-top:18px;
        }

        .section h3{
          color:#111827;
          font-weight:300;
          margin-bottom:8px;
        }

        .section p{
          color:#475569;
          line-height:1.8;
          font-size:15px;
        }

        .details{
          display:grid;
          grid-template-columns:1fr 1fr;
          gap:12px;
          margin-top:14px;
        }

        .box{
          background:white;
          border:1px solid #E5E7EB;
          border-radius:12px;
          padding:12px;
        }

        .label{
          color:#64748B;
          font-size:13px;
        }

        .value{
          color:#111827;
          margin-top:4px;
          font-weight:500;
        }

        .pdf{
          width:100%;
          margin-top:22px;
          padding:15px;
          border:none;
          border-radius:12px;
          background:linear-gradient(90deg,#2563EB,#38BDF8);
          color:white;
          font-size:15px;
          cursor:pointer;
        }

        @media(max-width:800px){
          .card{
            grid-template-columns:1fr;
          }

          .img{
            width:100%;
            height:220px;
          }

          .grid,.details{
            grid-template-columns:1fr;
          }
        }
      `}</style>

      <div className="page">
        <Navbar />

        <div className="container">

          <div className="title">Scan History</div>
          <div className="sub">
            Search and view analyzed patients
          </div>

          <input
            className="search"
            placeholder="🔍 Search patient or doctor..."
            value={search}
            onChange={(e)=>setSearch(e.target.value)}
          />

          {filteredHistory.map((item,index)=>(

            <div className="card" key={index}>

              <img
                src={item.original_image}
                className="img"
                alt=""
              />

              <div>

                <div className="name">
                  {item.patient_name}
                </div>

                <div className="info">
                  👨‍⚕️ Dr. {item.username || "Unknown"}
                </div>

                <div className="info">
                  🎂 {item.age} Years • {item.gender}
                </div>

                <div className="info">
                  📅 {item.date || "Today"}
                </div>

              </div>

              <div style={{textAlign:"center"}}>

                <div className="badge">
                  {item.prediction}
                </div>

                <br/>

                <button
                  className="view"
                  onClick={()=>setSelected(item)}
                >
                  View
                </button>

              </div>

            </div>

          ))}

        </div>

        {selected && (

          <div className="overlay">

            <div className="modal">

              <div className="top">

                <h2 style={{fontWeight:300}}>
                  Complete Medical Report
                </h2>

                <button
                  className="close"
                  onClick={()=>setSelected(null)}
                >
                  ✕
                </button>

              </div>

              <div className="grid">

                <div>
                  <h3 style={{fontWeight:300,marginBottom:"8px"}}>
                    Original X-Ray
                  </h3>

                  <img
                    src={selected.original_image}
                    className="scan"
                    alt=""
                  />
                </div>

                <div>
                  <h3 style={{fontWeight:300,marginBottom:"8px"}}>
                    AI Heatmap
                  </h3>

                  <img
                    src={selected.heatmap}
                    className="scan"
                    alt=""
                  />
                </div>

              </div>

              <div className="section">

                <h3>Patient Information</h3>

                <div className="details">

                  <div className="box">
                    <div className="label">Doctor</div>
                    <div className="value">
                      Dr. {selected.username || "Unknown"}
                    </div>
                  </div>

                  <div className="box">
                    <div className="label">Patient</div>
                    <div className="value">
                      {selected.patient_name}
                    </div>
                  </div>

                  <div className="box">
                    <div className="label">Age</div>
                    <div className="value">
                      {selected.age} Years
                    </div>
                  </div>

                  <div className="box">
                    <div className="label">Gender</div>
                    <div className="value">
                      {selected.gender}
                    </div>
                  </div>

                  <div className="box">
                    <div className="label">Prediction</div>
                    <div className="value">
                      {selected.prediction}
                    </div>
                  </div>

                  <div className="box">
                    <div className="label">Confidence</div>
                    <div className="value">
                      {selected.confidence}%
                    </div>
                  </div>

                </div>

              </div>

              <div className="section">

                <h3>Doctor Clinical Description</h3>

                <p>
                  The uploaded chest X-ray was analyzed using MediScan AI.
                  The AI model evaluated the lung fields, heart silhouette and
                  surrounding thoracic structures. No significant radiological
                  evidence of pneumonia was detected. The lungs appear clear
                  without visible consolidation or pleural effusion. This AI
                  assessment supports clinical decision-making and should always
                  be confirmed by a qualified physician.
                </p>

              </div>

              <div className="section">

                <h3>Disease Information</h3>

                <p>
                  <b>Pneumonia</b> is an infection that inflames the air sacs of
                  one or both lungs. It may be caused by bacteria, viruses or
                  fungi. Typical symptoms include persistent cough, fever, chest
                  pain, fatigue, chills and difficulty breathing. Chest X-ray
                  imaging is one of the primary diagnostic tools used by doctors
                  to detect abnormal lung opacities associated with pneumonia.
                </p>

              </div>

              <div className="section">

                <h3>AI Recommendation</h3>

                <p>
                  {selected.prediction === "Normal"
                    ? "No immediate radiographic signs of pneumonia were identified. Continue routine monitoring and seek medical evaluation if symptoms such as fever, cough or breathing difficulty persist."
                    : "The AI model detected features that may indicate pneumonia. Immediate consultation with a radiologist and further clinical evaluation are strongly recommended."}
                </p>

              </div>

              <a
                href={selected.pdf}
                target="_blank"
                rel="noreferrer"
              >
                <button className="pdf">
                  📄 Download Complete PDF Report
                </button>
              </a>

            </div>

          </div>

        )}

      </div>
    </>
  );
}