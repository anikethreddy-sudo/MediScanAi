import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Processing() {
  const navigate = useNavigate();
  const [step, setStep] = useState("Uploading X-Ray...");

  useEffect(() => {
    const t1 = setTimeout(() => setStep("Generating AI Heatmap..."), 1200);
    const t2 = setTimeout(() => setStep("Preparing Medical Report..."), 2600);
    const t3 = setTimeout(() => navigate("/results"), 4200);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [navigate]);

  return (
    <>
      <style>{`
        *{
          margin:0;
          padding:0;
          box-sizing:border-box;
          font-family:'Poppins',sans-serif;
        }

        .page{
          min-height:100vh;
          background:linear-gradient(135deg,#04184D,#0A2E73);
          display:flex;
          justify-content:center;
          align-items:center;
        }

        .card{
          width:500px;
          background:#EAF2FF;
          border-radius:28px;
          padding:40px;
          text-align:center;
        }

        .scanBox{
          width:240px;
          height:240px;
          margin:0 auto 28px;
          border-radius:24px;
          overflow:hidden;
          position:relative;
          border:4px solid #BFDBFE;
          background:#fff;
        }

        .scanBox img{
          width:100%;
          height:100%;
          object-fit:cover;
        }

        .line{
          position:absolute;
          left:0;
          width:100%;
          height:4px;
          background:#00E5FF;
          box-shadow:0 0 18px #00E5FF;
          animation:scan 2s linear infinite;
        }

        @keyframes scan{
          0%{top:0;}
          100%{top:100%;}
        }

        h1{
          color:#0F172A;
          font-size:30px;
          font-weight:300;
        }

        p{
          margin-top:12px;
          color:#2563EB;
          font-size:18px;
          font-weight:300;
        }

        .loader{
          margin:24px auto 0;
          width:48px;
          height:48px;
          border:4px solid #BFDBFE;
          border-top:4px solid #2563EB;
          border-radius:50%;
          animation:spin 1s linear infinite;
        }

        @keyframes spin{
          to{transform:rotate(360deg);}
        }
      `}</style>

      <div className="page">
        <div className="card">

          <div className="scanBox">
            <img
              src={JSON.parse(localStorage.getItem("result"))?.original_image}
              alt=""
            />
            <div className="line"></div>
          </div>

          <h1>AI Processing</h1>

          <p>{step}</p>

          <div className="loader"></div>

        </div>
      </div>
    </>
  );
}