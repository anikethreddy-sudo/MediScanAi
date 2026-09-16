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
      desc: "Download a beautiful hospital-style PDF with diagnosis and confidence score."
    }
  ];

  return (
    <>
      <style>{`
        .how{
          margin-top:90px;
        }

        .howTop{
          text-align:center;
          margin-bottom:45px;
        }

        .tag{
          color:#7DD3FC;
          font-size:14px;
          font-weight:300;
          letter-spacing:3px;
        }

        .title{
          font-size:46px;
          font-weight:300;
          color:white;
          margin:12px 0;
          letter-spacing:-1px;
        }

        .sub{
          max-width:650px;
          margin:auto;
          color:#C7D7F8;
          font-size:17px;
          font-weight:300;
          line-height:1.8;
        }

        .grid{
          display:grid;
          grid-template-columns:repeat(3,1fr);
          gap:22px;
        }

        .card{
          background:#EAF2FF;
          border-radius:24px;
          padding:28px;
          text-align:center;
          transition:.35s;
        }

        .card:hover{
          transform:translateY(-8px);
          box-shadow:0 18px 35px rgba(37,99,235,.25);
        }

        .number{
          color:#2563EB;
          font-size:14px;
          font-weight:300;
          letter-spacing:2px;
          margin-bottom:14px;
        }

        .circle{
          width:84px;
          height:84px;
          border-radius:50%;
          margin:auto;
          display:flex;
          align-items:center;
          justify-content:center;
          font-size:40px;
          background:linear-gradient(135deg,#2563EB,#38BDF8);
          color:white;
          animation:float 3.5s ease-in-out infinite;
        }

        .card:nth-child(2) .circle{
          animation-delay:.7s;
        }

        .card:nth-child(3) .circle{
          animation-delay:1.4s;
        }

        @keyframes float{
          0%,100%{transform:translateY(0)}
          50%{transform:translateY(-8px)}
        }

        .card h3{
          color:#0F172A;
          font-size:23px;
          font-weight:300;
          margin:20px 0 10px;
        }

        .card p{
          color:#64748B;
          font-size:15px;
          font-weight:300;
          line-height:1.8;
        }

        @media(max-width:900px){
          .grid{
            grid-template-columns:1fr;
          }

          .title{
            font-size:38px;
          }
        }
      `}</style>

      <section className="how">

        <div className="howTop">
          <div className="tag">HOW IT WORKS</div>

          <h2 className="title">
            Three simple steps
          </h2>

          <p className="sub">
            MediScan AI converts a chest X-ray into an intelligent medical
            diagnosis within seconds using explainable artificial intelligence.
          </p>
        </div>

        <div className="grid">
          {steps.map((step) => (
            <div className="card" key={step.no}>

              <div className="number">{step.no}</div>

              <div className="circle">{step.icon}</div>

              <h3>{step.title}</h3>

              <p>{step.desc}</p>

            </div>
          ))}
        </div>

      </section>
    </>
  );
}