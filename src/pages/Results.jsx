
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function Results() {
  const navigate = useNavigate();

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("result"));

    if (!data) {
      navigate("/upload");
      return;
    }

    setResult(data);

    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, [navigate]);

  if (!result) return null;

  return (
    <>
      <style>{`
        *{
          margin:0;
          padding:0;
          box-sizing:border-box;
          font-family:'Poppins',sans-serif;
        }

        body{
          background:#04184D;
        }

        .page{
          min-height:100vh;
          background:#04184D;
        }

        .container{
          padding:30px;
        }

        .top{
          display:grid;
          grid-template-columns:repeat(4,1fr);
          gap:18px;
          margin-bottom:24px;
        }

        .stat{
          background:#EAF2FF;
          border-radius:18px;
          padding:20px;
          text-align:center;
        }

        .number{
          font-size:30px;
          color:#2563EB;
          font-weight:300;
        }

        .label{
          color:#64748B;
          margin-top:8px;
          font-weight:300;
        }

        .grid{
          display:grid;
          grid-template-columns:1fr 1fr;
          gap:22px;
        }

        .card{
          background:#EAF2FF;
          border-radius:22px;
          padding:18px;
        }

        .title{
          font-size:22px;
          color:#111827;
          font-weight:300;
          margin-bottom:12px;
        }

        .imgBox{
          position:relative;
          overflow:hidden;
          border-radius:18px;
        }

        .img{
          width:100%;
          display:block;
          border-radius:18px;
        }

        .scanner{
          position:absolute;
          left:0;
          width:100%;
          height:4px;
          background:#00E5FF;
          box-shadow:0 0 15px #00E5FF;
          animation:scan 2s linear infinite;
        }

        @keyframes scan{
          0%{top:0;}
          100%{top:100%;}
        }

        .overlay{
          position:absolute;
          inset:0;
          background:rgba(0,0,0,.25);
          display:flex;
          align-items:center;
          justify-content:center;
          color:white;
          font-size:18px;
          font-weight:300;
        }

        .report{
          margin-top:24px;
          background:#EAF2FF;
          border-radius:22px;
          padding:25px;
        }

        .badge{
          display:inline-block;
          background:#DCFCE7;
          color:#166534;
          padding:10px 18px;
          border-radius:30px;
          margin:14px 0;
          font-weight:400;
        }

        .details{
          display:grid;
          grid-template-columns:1fr 1fr;
          gap:14px;
          margin-top:18px;
          color:#374151;
          font-weight:300;
        }

        .buttons{
          display:flex;
          justify-content:center;
          gap:18px;
          margin-top:28px;
          flex-wrap:wrap;
        }

        .btn1{
          background:white;
          color:#2563EB;
          border:none;
          padding:14px 24px;
          border-radius:12px;
          cursor:pointer;
          font-size:15px;
        }

        .btn2{
          background:linear-gradient(90deg,#2563EB,#38BDF8);
          color:white;
          border:none;
          padding:14px 24px;
          border-radius:12px;
          cursor:pointer;
          font-size:15px;
        }

        @media(max-width:900px){
          .top,.grid,.details{
            grid-template-columns:1fr;
          }
        }
      `}</style>

      <div className="page">

        <Navbar/>

        <div className="container">

          {/* TOP CARDS */}

          <div className="top">

            <div className="stat">
              <div className="number">{result.patient_name}</div>
              <div className="label">Patient</div>
            </div>

            <div className="stat">
              <div className="number">{result.age}</div>
              <div className="label">Age</div>
            </div>

            <div className="stat">
              <div className="number">{result.gender}</div>
              <div className="label">Gender</div>
            </div>

            <div className="stat">
              <div className="number">{result.confidence}%</div>
              <div className="label">Confidence</div>
            </div>

          </div>

          {/* IMAGES */}

          <div className="grid">

            <div className="card">

              <div className="title">Original X-Ray</div>

              <div className="imgBox">
                <img
                  src={result.original_image}
                  className="img"
                  alt="Original"
                />
              </div>

            </div>

            <div className="card">

              <div className="title">AI Heatmap</div>

              <div className="imgBox">

                <img
                  src={result.heatmap}
                  className="img"
                  alt="Heatmap"
                  onLoad={() => setLoading(false)}
                />

                {loading && (
                  <>
                    <div className="scanner"></div>

                    <div className="overlay">
                      AI Scanning...
                    </div>
                  </>
                )}

              </div>

            </div>

          </div>

          {/* REPORT */}

          <div className="report">

            <h2 style={{
              color:"#111827",
              fontWeight:300,
              marginBottom:"10px"
            }}>
              Doctor Recommendation
            </h2>

            <div className="badge">
              {result.prediction}
            </div>

            <p style={{
              color:"#374151",
              lineHeight:1.8,
              fontWeight:300,
              marginTop:"8px"
            }}>
              The chest X-ray appears normal according to the AI analysis.
              No significant signs of pneumonia were detected. If symptoms
              such as fever, cough or breathing difficulty continue, consult
              a qualified physician for further clinical evaluation.
            </p>

            <div className="details">

              <div>
              <strong>Doctor:</strong> Dr. {localStorage.getItem("doctorName") || result.username}           
              </div>

              <div>
                <strong>Patient:</strong> {result.patient_name}
              </div>

              <div>
                <strong>Age:</strong> {result.age}
              </div>

              <div>
                <strong>Gender:</strong> {result.gender}
              </div>

              <div>
                <strong>Prediction:</strong> {result.prediction}
              </div>

              <div>
                <strong>Confidence:</strong> {result.confidence}%
              </div>

            </div>

            <div className="buttons">

              <button
                className="btn1"
                onClick={() => navigate("/upload")}
              >
                New Scan
              </button>

              <button
                className="btn1"
                onClick={() => navigate("/history")}
              >
                History
              </button>

              <a
                href={result.pdf}
                target="_blank"
                rel="noreferrer"
              >
                <button className="btn2">
                  Download PDF
                </button>
              </a>

            </div>

          </div>

        </div>

      </div>
    </>
  );
}