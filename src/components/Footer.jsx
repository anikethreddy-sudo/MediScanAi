import { useNavigate } from "react-router-dom";

export default function Footer() {
  const navigate = useNavigate();

  return (
    <>
      <style>{`
        .footer{
          margin-top:90px;
          background:rgba(255,255,255,.05);
          backdrop-filter:blur(12px);
          border-top:1px solid rgba(255,255,255,.08);
        }

        .footerContainer{
          max-width:1450px;
          margin:auto;
          padding:55px 24px 30px;
        }

        .top{
          display:grid;
          grid-template-columns:2fr 1fr 1fr;
          gap:45px;
        }

        .brand{
          color:white;
          font-size:34px;
          font-weight:300;
          letter-spacing:-1px;
        }

        .desc{
          color:#C7D7F8;
          line-height:1.9;
          font-size:16px;
          font-weight:300;
          margin-top:16px;
          max-width:430px;
        }

        .heading{
          color:white;
          font-size:18px;
          font-weight:300;
          margin-bottom:16px;
        }

        .link{
          color:#C7D7F8;
          margin-bottom:12px;
          font-size:15px;
          font-weight:300;
          cursor:pointer;
          transition:.25s;
        }

        .link:hover{
          color:#38BDF8;
          transform:translateX(4px);
        }

        .bottom{
          margin-top:35px;
          padding-top:20px;
          border-top:1px solid rgba(255,255,255,.08);
          display:flex;
          justify-content:space-between;
          align-items:center;
          flex-wrap:wrap;
        }

        .copy{
          color:#9FB7E8;
          font-size:14px;
          font-weight:300;
        }

        .social{
          display:flex;
          gap:12px;
        }

        .icon{
          width:44px;
          height:44px;
          border-radius:50%;
          background:rgba(255,255,255,.08);
          display:flex;
          align-items:center;
          justify-content:center;
          font-size:18px;
          cursor:pointer;
          transition:.3s;
        }

        .icon:hover{
          background:#2563EB;
          transform:translateY(-5px);
        }

        @media(max-width:900px){
          .top{
            grid-template-columns:1fr;
          }

          .bottom{
            justify-content:center;
            text-align:center;
            gap:18px;
          }
        }
      `}</style>

      <footer className="footer">
        <div className="footerContainer">

          <div className="top">

            <div>
              <div className="brand">MediScan AI</div>

              <p className="desc">
                Premium AI healthcare platform for intelligent chest X-ray
                diagnosis, explainable heatmaps, confidence scoring and
                hospital-grade medical reporting.
              </p>
            </div>

            <div>
              <div className="heading">Navigation</div>

              <div className="link" onClick={()=>navigate("/")}>Home</div>
              <div className="link" onClick={()=>navigate("/upload")}>Upload</div>
              <div className="link" onClick={()=>navigate("/dashboard")}>Dashboard</div>
              <div className="link" onClick={()=>navigate("/history")}>History</div>
            </div>

            <div>
              <div className="heading">Features</div>

              <div className="link">AI Diagnosis</div>
              <div className="link">Heatmap</div>
              <div className="link">PDF Report</div>
              <div className="link">Analytics</div>
            </div>

          </div>

          <div className="bottom">

            <div className="copy">
              © 2026 MediScan AI • Artificial Intelligence Healthcare Platform
            </div>

            <div className="social">
              <div className="icon">🩺</div>
              <div className="icon">🤖</div>
              <div className="icon">📄</div>
            </div>

          </div>

        </div>
      </footer>
    </>
  );
}