
import { useNavigate } from "react-router-dom";

export default function Footer() {
  const navigate = useNavigate();

  return (
    <>
      <style>{`
        .footer-section {
          margin-top: 90px;
          background: #edf5ef;
          border-top: 1px solid #dce9df;
          border-radius: 18px 18px 0 0;
          color: #17251e;
        }

        .footer-container {
          max-width: 1450px;
          margin: auto;
          padding: 55px 24px 30px;
        }

        .footer-top {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr;
          gap: 45px;
        }

        .footer-brand {
          color: #193d2a;
          font-size: 32px;
          font-weight: 600;
          letter-spacing: -1px;
        }

        .footer-desc {
          color: #627268;
          line-height: 1.9;
          font-size: 14px;
          margin-top: 16px;
          max-width: 430px;
        }

        .footer-heading {
          color: #193d2a;
          font-size: 17px;
          font-weight: 600;
          margin-bottom: 18px;
        }

        .footer-link {
          color: #53665a;
          margin-bottom: 13px;
          font-size: 14px;
          cursor: pointer;
          transition: .25s;
          width: fit-content;
        }

        .footer-link:hover {
          color: #34734d;
          transform: translateX(4px);
        }

        .footer-bottom {
          margin-top: 35px;
          padding-top: 22px;
          border-top: 1px solid #dce9df;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 18px;
        }

        .footer-copy {
          color: #627268;
          font-size: 13px;
        }

        .footer-social {
          display: flex;
          gap: 12px;
        }

        .footer-icon {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          background: #ffffff;
          border: 1px solid #dce9df;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          cursor: pointer;
          transition: .3s;
        }

        .footer-icon:hover {
          background: #34734d;
          transform: translateY(-4px);
        }

        @media(max-width: 900px) {
          .footer-top {
            grid-template-columns: 1fr;
            gap: 30px;
          }

          .footer-bottom {
            justify-content: center;
            text-align: center;
          }
        }
      `}</style>

      <footer className="footer-section">
        <div className="footer-container">
          <div className="footer-top">

            <div>
              <div className="footer-brand">MediScan AI</div>

              <p className="footer-desc">
                AI-assisted chest X-ray screening with visual
                explanations, prediction confidence and clear
                medical reporting. Designed to support clinical
                review, not replace professional diagnosis.
              </p>
            </div>

            <div>
              <div className="footer-heading">Navigation</div>

              <div className="footer-link" onClick={() => navigate("/")}>
                Home
              </div>

              <div className="footer-link" onClick={() => navigate("/upload")}>
                Upload
              </div>

              <div className="footer-link" onClick={() => navigate("/dashboard")}>
                Dashboard
              </div>

              <div className="footer-link" onClick={() => navigate("/history")}>
                History
              </div>
            </div>

            <div>
              <div className="footer-heading">Features</div>

              <div className="footer-link">AI Diagnosis</div>
              <div className="footer-link">Heatmap</div>
              <div className="footer-link">PDF Report</div>
              <div className="footer-link">Analytics</div>
            </div>

          </div>

          <div className="footer-bottom">
            <div className="footer-copy">
              © 2026 MediScan AI • Artificial Intelligence Healthcare Platform
            </div>

            <div className="footer-social">
              <div className="footer-icon">🩺</div>
              <div className="footer-icon">🤖</div>
              <div className="footer-icon">📄</div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
