
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import HowItWorks from "../components/HowItWorks";
import TrustSection from "../components/TrustSection";
import Footer from "../components/Footer";

export default function Home() {
  const navigate = useNavigate();

  return (
    <>
      <style>{`
        .home-page {
          min-height: 100vh;
          background: #f7f9fc;
          color: #24364b;
          font-family: Arial, sans-serif;
        }

        .home-page * {
          box-sizing: border-box;
        }

        .home-main {
          max-width: 1240px;
          margin: auto;
          padding: 85px 40px 70px;
        }

        .home-intro {
          max-width: 850px;
          margin-bottom: 75px;
        }

        .home-eyebrow {
          color: #2476a8;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 1.4px;
          text-transform: uppercase;
          margin-bottom: 24px;
        }

        .home-title {
          font-size: clamp(42px, 5.5vw, 66px);
          line-height: 1.13;
          letter-spacing: -2.4px;
          font-weight: 600;
          color: #172f49;
          margin: 0 0 24px;
        }

        .home-title span {
          color: #247ba9;
        }

        .home-description {
          max-width: 680px;
          color: #66778a;
          font-size: 17px;
          line-height: 1.85;
          margin-bottom: 30px;
        }

        .home-actions {
          display: flex;
          gap: 13px;
          flex-wrap: wrap;
        }

        .home-button {
          padding: 14px 23px;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: background .2s ease;
        }

        .home-button-primary {
          color: white;
          background: #216f9f;
          border: 1px solid #216f9f;
        }

        .home-button-primary:hover {
          background: #18577e;
        }

        .home-button-secondary {
          color: #28445e;
          background: white;
          border: 1px solid #ccd8e3;
        }

        .home-button-secondary:hover {
          background: #edf3f8;
        }

        .home-divider {
          height: 1px;
          background: #e0e7ee;
          margin-bottom: 55px;
        }

        .home-section-heading {
          font-size: 25px;
          font-weight: 600;
          color: #203951;
          margin-bottom: 12px;
        }

        .home-section-copy {
          color: #718096;
          font-size: 15px;
          line-height: 1.7;
          max-width: 680px;
        }

        .home-features {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 35px;
          margin-top: 35px;
        }

        .home-feature {
          padding: 22px 0;
          border-top: 2px solid #d6e5ef;
        }

        .home-feature-number {
          color: #3985ad;
          font-size: 13px;
          font-weight: 700;
          margin-bottom: 18px;
        }

        .home-feature h3 {
          color: #25415c;
          font-size: 17px;
          font-weight: 600;
          margin-bottom: 11px;
        }

        .home-feature p {
          color: #718096;
          font-size: 14px;
          line-height: 1.8;
        }

        .home-notice {
          margin-top: 55px;
          padding: 18px 21px;
          background: #fffaf0;
          border-left: 3px solid #d4a34c;
          color: #76613b;
          font-size: 13px;
          line-height: 1.8;
        }

        @media(max-width: 750px) {
          .home-main {
            padding: 55px 22px;
          }

          .home-intro {
            margin-bottom: 50px;
          }

          .home-features {
            grid-template-columns: 1fr;
            gap: 10px;
          }

          .home-title {
            font-size: 43px;
          }
        }
      `}</style>

      <div className="home-page">
        <Navbar />

        <main className="home-main">
          <section className="home-intro">
            <div className="home-eyebrow">
              Chest X-ray assessment
            </div>

            <h1 className="home-title">
              A clearer way to review
              <br />
              chest X-rays with
              <br />
              <span>AI assistance.</span>
            </h1>

            <p className="home-description">
              MediScan AI is a chest X-ray analysis application
              that classifies images as NORMAL or PNEUMONIA
              and provides a visual explanation of the model's output.
              It is designed to support review, not replace clinical judgement.
            </p>

            <div className="home-actions">
              <button
                className="home-button home-button-primary"
                onClick={() => navigate("/upload")}
              >
                Upload chest X-ray
              </button>

              <button
                className="home-button home-button-secondary"
                onClick={() => navigate("/dashboard")}
              >
                Open dashboard
              </button>
            </div>
          </section>

          <div className="home-divider" />

          <section>
            <h2 className="home-section-heading">
              What you can do with MediScan
            </h2>

            <p className="home-section-copy">
              The application brings image classification,
              visual explanations and scan records into one workflow.
            </p>

            <div className="home-features">
              <article className="home-feature">
                <div className="home-feature-number">01 / ANALYSIS</div>
                <h3>Chest X-ray classification</h3>
                <p>
                  Upload a chest X-ray and view the model's
                  NORMAL or PNEUMONIA classification.
                </p>
              </article>

              <article className="home-feature">
                <div className="home-feature-number">02 / EXPLANATION</div>
                <h3>Grad-CAM visualization</h3>
                <p>
                  View a heatmap showing image regions
                  that influenced the model's prediction.
                </p>
              </article>

              <article className="home-feature">
                <div className="home-feature-number">03 / RECORDS</div>
                <h3>Scan history and reports</h3>
                <p>
                  Access saved scan records and review
                  the available prediction information.
                </p>
              </article>
            </div>
          </section>

          <div className="home-notice">
            <strong>Medical notice:</strong> This application is a
            project-level AI decision-support tool. Its predictions
            are not medical diagnoses and must be reviewed by a
            qualified healthcare professional.
          </div>

          <HowItWorks />
          <TrustSection />
          <Footer />
        </main>
      </div>
    </>
  );
}
