
export default function HowItWorks() {
  const steps = [
    {
      no: "01",
      icon: "🩻",
      title: "Upload X-Ray",
      desc: "Upload the patient's chest X-ray securely into MediScan AI."
    },
    {
      no: "02",
      icon: "🤖",
      title: "AI Analysis",
      desc: "Our deep learning model detects pneumonia and creates an explainable heatmap."
    },
    {
      no: "03",
      icon: "📄",
      title: "Medical Report",
      desc: "Download a hospital-style PDF with the prediction and confidence score."
    }
  ];

  return (
    <>
      <style>{`
        .how-section {
          margin-top: 90px;
          color: #17251e;
        }

        .how-top {
          text-align: center;
          margin-bottom: 45px;
        }

        .how-tag {
          color: #34734d;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 3px;
        }

        .how-title {
          font-size: 42px;
          font-weight: 500;
          color: #17251e;
          margin: 12px 0;
          letter-spacing: -1px;
        }

        .how-sub {
          max-width: 650px;
          margin: auto;
          color: #627268;
          font-size: 16px;
          line-height: 1.8;
        }

        .how-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 22px;
        }

        .how-card {
          background: #ffffff;
          border: 1px solid #e3ebe5;
          border-radius: 18px;
          padding: 30px;
          text-align: center;
          transition: .3s ease;
          box-shadow: 0 8px 25px rgba(25, 61, 42, .04);
        }

        .how-card:hover {
          transform: translateY(-7px);
          box-shadow: 0 16px 35px rgba(25, 61, 42, .10);
          border-color: #b8d2bf;
        }

        .how-number {
          color: #34734d;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 2px;
          margin-bottom: 18px;
        }

        .how-circle {
          width: 78px;
          height: 78px;
          border-radius: 50%;
          margin: auto;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 36px;
          background: #edf5ef;
          border: 1px solid #dce9df;
          animation: howFloat 3.5s ease-in-out infinite;
        }

        .how-card:nth-child(2) .how-circle {
          animation-delay: .7s;
        }

        .how-card:nth-child(3) .how-circle {
          animation-delay: 1.4s;
        }

        @keyframes howFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-7px); }
        }

        .how-card h3 {
          color: #193d2a;
          font-size: 20px;
          font-weight: 500;
          margin: 20px 0 10px;
        }

        .how-card p {
          color: #627268;
          font-size: 14px;
          line-height: 1.8;
          margin: 0;
        }

        @media(max-width: 900px) {
          .how-grid {
            grid-template-columns: 1fr;
          }

          .how-title {
            font-size: 34px;
          }
        }
      `}</style>

      <section className="how-section">
        <div className="how-top">
          <div className="how-tag">HOW IT WORKS</div>

          <h2 className="how-title">Three simple steps</h2>

          <p className="how-sub">
            MediScan AI converts a chest X-ray into an AI-assisted
            pneumonia screening result with explainable visual analysis.
          </p>
        </div>

        <div className="how-grid">
          {steps.map((step) => (
            <div className="how-card" key={step.no}>
              <div className="how-number">{step.no}</div>
              <div className="how-circle">{step.icon}</div>
              <h3>{step.title}</h3>
              <p>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
