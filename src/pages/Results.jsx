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
            background: "#F4F8FF",
          }}
        >
          <h2>No Result Found</h2>
        </div>
      </>
    );
  }

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
        background:#F4F8FF;
      }

      .page{
        min-height:100vh;
        background:#F4F8FF;
      }

      .container{
        max-width:1250px;
        margin:auto;
        padding:35px;
      }

      .title{
        font-size:44px;
        color:#111827;
        font-weight:300;
      }

      .sub{
        color:#4B5563;
        margin-top:8px;
        margin-bottom:28px;
        font-size:18px;
      }

      .grid{
        display:grid;
        grid-template-columns:1fr 1fr;
        gap:22px;
      }

      .card{
        background:white;
        border-radius:20px;
        padding:20px;
        border:1px solid #DBEAFE;
        box-shadow:0 8px 20px rgba(0,0,0,.06);
      }

      .card h2{
        color:#111827;
        margin-bottom:14px;
        text-align:center;
      }

      .img{
        width:100%;
        height:430px;
        object-fit:contain;
        border-radius:14px;
        background:#EEF4FF;
      }

      .summary{
        margin-top:28px;
        background:white;
        border-radius:20px;
        border:1px solid #DBEAFE;
        overflow:hidden;
      }

      .summaryHeader{
        padding:18px 22px;
        background:#EFF6FF;
        border-bottom:1px solid #DBEAFE;
      }

      .summaryHeader h2{
        color:#111827;
      }

      .details{
        display:grid;
        grid-template-columns:repeat(auto-fit,minmax(220px,1fr));
        gap:18px;
        padding:24px;
      }

      .item{
        background:#F8FBFF;
        padding:18px;
        border-radius:14px;
      }

      .label{
        color:#64748B;
        font-size:14px;
      }

      .value{
        margin-top:6px;
        color:#111827;
        font-size:20px;
        font-weight:600;
      }

      .normal{
        color:#16A34A;
      }

      .alert{
        color:#DC2626;
      }

      .pdf{
        display:block;
        width:calc(100% - 48px);
        margin:0 auto 24px;
        text-align:center;
        text-decoration:none;
        background:linear-gradient(90deg,#2563EB,#3B82F6);
        color:white;
        padding:16px;
        border-radius:12px;
        font-size:17px;
        font-weight:600;
      }

      @media(max-width:900px){
        .grid{
          grid-template-columns:1fr;
        }

        .title{
          font-size:36px;
        }

        .img{
          height:330px;
        }
      }
      `}</style>

      <Navbar />

      <div className="page">
        <div className="container">

          <div className="title">
            AI Analysis Result
          </div>

          <div className="sub">
            Patient: <b>{result.patient_name}</b> • {result.age} Years • {result.gender}
          </div>

          <div className="grid">

            <div className="card">
              <h2>Original Chest X-Ray</h2>

              <img
                src={result.original_image}
                alt="Original X-Ray"
                className="img"
              />
            </div>

            <div className="card">
              <h2>AI Heatmap Analysis</h2>

              <img
                src={result.heatmap}
                alt="Heatmap"
                className="img"
                onError={(e)=>{
                  e.target.src=result.original_image;
                }}
              />
            </div>

          </div>

          <div className="summary">

            <div className="summaryHeader">
              <h2>Diagnosis Summary</h2>
            </div>

            <div className="details">

              <div className="item">
                <div className="label">Doctor</div>
                <div className="value">
                  Dr. {result.username}
                </div>
              </div>

              <div className="item">
                <div className="label">Patient</div>
                <div className="value">
                  {result.patient_name}
                </div>
              </div>

              <div className="item">
                <div className="label">Age</div>
                <div className="value">
                  {result.age}
                </div>
              </div>

              <div className="item">
                <div className="label">Gender</div>
                <div className="value">
                  {result.gender}
                </div>
              </div>

              <div className="item">
                <div className="label">Prediction</div>
                <div className={`value ${
                  result.prediction==="Normal" ? "normal":"alert"
                }`}>
                  {result.prediction}
                </div>
              </div>

              <div className="item">
                <div className="label">Confidence</div>
                <div className="value">
                  {result.confidence}%
                </div>
              </div>

            </div>

            <a
              href={result.pdf}
              target="_blank"
              rel="noreferrer"
              className="pdf"
            >
              📄 Download AI Medical Report
            </a>

          </div>

        </div>
      </div>
    </>
  );
}