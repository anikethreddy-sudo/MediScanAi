import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import HowItWorks from "../components/HowItWorks";
import TrustSection from "../components/TrustSection";
import Footer from "../components/Footer";

export default function Home() {
  const navigate = useNavigate();

  const [scans, setScans] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const [hospitals, setHospitals] = useState(0);
  const [reports, setReports] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setScans((v) => (v < 4828 ? v + 52 : 4828));
      setAccuracy((v) => (v < 96.8 ? +(v + 1.2).toFixed(1) : 96.8));
      setHospitals((v) => (v < 120 ? v + 2 : 120));
      setReports((v) => (v < 5000 ? v + 60 : 5000));
    }, 25);

    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@200;300;400;500&display=swap');

      *{
        margin:0;
        padding:0;
        box-sizing:border-box;
        font-family:'Poppins',sans-serif;
      }

      body{
        background:#020F36;
      }

      .page{
        min-height:100vh;
        background:
        radial-gradient(circle at top right,#2563EB33 0%,transparent 35%),
        linear-gradient(135deg,#020F36,#071A52,#123A8A);
        color:white;
      }

      .container{
        max-width:1450px;
        margin:auto;
        padding:30px 24px 80px;
      }

      /* ---------- HERO ---------- */

      .hero{
        display:grid;
        grid-template-columns:1.1fr .9fr;
        gap:40px;
        align-items:center;
        margin-top:25px;
      }

      .badge{
        display:inline-block;
        padding:10px 18px;
        border-radius:30px;
        background:rgba(56,189,248,.12);
        border:1px solid rgba(125,211,252,.35);
        color:#7DD3FC;
        font-size:14px;
        font-weight:300;
        letter-spacing:1px;
      }

      .title{
        font-size:68px;
        font-weight:300;
        line-height:1.05;
        letter-spacing:-2px;
        margin:22px 0 18px;
      }

      .blue{
        color:#38BDF8;
      }

      .sub{
        color:#D7E8FF;
        font-size:19px;
        font-weight:300;
        line-height:1.9;
        max-width:600px;
        margin-bottom:34px;
      }

      .buttons{
        display:flex;
        gap:18px;
        flex-wrap:wrap;
      }

      .primary{
        background:linear-gradient(90deg,#2563EB,#38BDF8);
        color:white;
        border:none;
        padding:16px 28px;
        border-radius:16px;
        font-size:16px;
        font-weight:300;
        cursor:pointer;
        transition:.3s;
        box-shadow:0 15px 30px rgba(37,99,235,.35);
      }

      .primary:hover{
        transform:translateY(-4px);
      }

      .secondary{
        background:rgba(255,255,255,.08);
        border:1px solid rgba(255,255,255,.18);
        color:white;
        padding:16px 28px;
        border-radius:16px;
        font-size:16px;
        font-weight:300;
        cursor:pointer;
      }

      /* ---------- AI VISUAL ---------- */

      .visual{
        position:relative;
        height:500px;
        border-radius:32px;
        overflow:hidden;
        background:linear-gradient(180deg,#EAF4FF,#D9EDFF);
        display:flex;
        align-items:center;
        justify-content:center;
      }

      .ring{
        position:absolute;
        border-radius:50%;
        border:2px solid rgba(37,99,235,.25);
      }

      .r1{
        width:330px;
        height:330px;
        animation:spin 18s linear infinite;
      }

      .r2{
        width:250px;
        height:250px;
        border-style:dashed;
        animation:spinReverse 12s linear infinite;
      }

      .r3{
        width:170px;
        height:170px;
        border-color:#38BDF8;
        animation:pulse 3s ease-in-out infinite;
      }

      .core{
        width:135px;
        height:135px;
        border-radius:50%;
        background:linear-gradient(135deg,#2563EB,#38BDF8);
        display:flex;
        align-items:center;
        justify-content:center;
        flex-direction:column;
        color:white;
        position:relative;
        z-index:5;
        box-shadow:0 0 55px rgba(56,189,248,.45);
      }

      .brain{
        font-size:44px;
      }

      .core p{
        font-size:11px;
        letter-spacing:2px;
        margin-top:6px;
      }

      .glow{
        position:absolute;
        width:180px;
        height:180px;
        border-radius:50%;
        background:rgba(56,189,248,.15);
        animation:glow 2.5s ease-in-out infinite;
      }

      .glass{
        position:absolute;
        background:rgba(255,255,255,.82);
        backdrop-filter:blur(12px);
        border-radius:16px;
        padding:12px 16px;
        display:flex;
        gap:10px;
        align-items:center;
        box-shadow:0 10px 25px rgba(0,0,0,.08);
        animation:float 4s ease-in-out infinite;
      }

      .glass span{
        font-size:24px;
      }

      .glass b{
        color:#2563EB;
        font-weight:300;
      }

      .glass small{
        color:#64748B;
        font-weight:300;
      }

      .g1{top:35px;left:22px;}
      .g2{top:120px;right:22px;animation-delay:.8s;}
      .g3{bottom:35px;left:30px;animation-delay:1.6s;}

      .dot{
        position:absolute;
        width:10px;
        height:10px;
        border-radius:50%;
        background:#38BDF8;
      }

      .d1{top:70px;left:180px;animation:orbit1 8s linear infinite;}
      .d2{bottom:90px;right:140px;animation:orbit2 10s linear infinite;}
      .d3{top:180px;left:70px;animation:orbit3 9s linear infinite;}
      .d4{top:90px;right:70px;animation:orbit4 11s linear infinite;}

      @keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}
      @keyframes spinReverse{from{transform:rotate(360deg)}to{transform:rotate(0)}}
      @keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.08)}}
      @keyframes glow{0%,100%{transform:scale(1);opacity:.5}50%{transform:scale(1.18);opacity:1}}
      @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
      @keyframes orbit1{0%{transform:translate(0,0)}50%{transform:translate(40px,-30px)}100%{transform:translate(0,0)}}
      @keyframes orbit2{0%{transform:translate(0,0)}50%{transform:translate(-45px,20px)}100%{transform:translate(0,0)}}
      @keyframes orbit3{0%{transform:translate(0,0)}50%{transform:translate(25px,-35px)}100%{transform:translate(0,0)}}
      @keyframes orbit4{0%{transform:translate(0,0)}50%{transform:translate(-25px,28px)}100%{transform:translate(0,0)}}

      /* ---------- STATS ---------- */

      .stats{
        display:grid;
        grid-template-columns:repeat(4,1fr);
        gap:20px;
        margin-top:45px;
      }

      .stat{
        background:#EAF2FF;
        border-radius:22px;
        padding:26px;
        text-align:center;
        color:#0F172A;
        transition:.3s;
      }

      .stat:hover{
        transform:translateY(-8px);
      }

      .icon{
        font-size:34px;
      }

      .num{
        color:#2563EB;
        font-size:42px;
        font-weight:300;
        margin:10px 0;
      }

      .label{
        color:#64748B;
        font-weight:300;
      }

      /* ---------- FEATURES ---------- */

      .section{
        margin-top:70px;
      }

      .tag{
        color:#7DD3FC;
        letter-spacing:3px;
        font-size:14px;
        text-align:center;
        font-weight:300;
      }

      .heading{
        font-size:46px;
        text-align:center;
        font-weight:300;
        margin:12px 0;
      }

      .desc{
        max-width:650px;
        margin:auto;
        text-align:center;
        color:#C7D7F8;
        line-height:1.8;
        font-weight:300;
      }

      .cards{
        display:grid;
        grid-template-columns:repeat(4,1fr);
        gap:20px;
        margin-top:35px;
      }

      .card{
        background:#EAF2FF;
        border-radius:22px;
        padding:24px;
        color:#0F172A;
        transition:.3s;
      }

      .card:hover{
        transform:translateY(-8px);
        box-shadow:0 20px 40px rgba(37,99,235,.2);
      }

      .circle{
        width:62px;
        height:62px;
        border-radius:18px;
        background:#DBEAFE;
        display:flex;
        align-items:center;
        justify-content:center;
        font-size:28px;
      }

      .card h3{
        margin:18px 0 10px;
        font-size:22px;
        font-weight:300;
      }

      .card p{
        color:#64748B;
        line-height:1.7;
        font-weight:300;
      }

      @media(max-width:1000px){
        .hero{grid-template-columns:1fr;}
        .stats,.cards{grid-template-columns:repeat(2,1fr);}
        .title{font-size:48px;}
      }

      @media(max-width:650px){
        .stats,.cards{grid-template-columns:1fr;}
        .visual{height:380px;}
        .title{font-size:40px;}
      }
      `}</style>

      <div className="page">
        <Navbar />

        <div className="container">

          {/* HERO */}
          <section className="hero">

            <div>
              <div className="badge">
                AI Powered Healthcare
              </div>

              <h1 className="title">
                Detect Pneumonia
                <br />
                with <span className="blue">Explainable AI</span>
              </h1>

              <p className="sub">
                Premium artificial intelligence platform for intelligent chest
                X-ray diagnosis with explainable heatmaps, confidence scoring
                and hospital-grade medical reporting.
              </p>

              <div className="buttons">
                <button
                  className="primary"
                  onClick={() => navigate("/upload")}
                >
                  Start New Scan
                </button>

                <button
                  className="secondary"
                  onClick={() => navigate("/dashboard")}
                >
                  Dashboard
                </button>
              </div>
            </div>

            {/* AI ANIMATION */}
            <div className="visual">

              <div className="ring r1"></div>
              <div className="ring r2"></div>
              <div className="ring r3"></div>

              <div className="dot d1"></div>
              <div className="dot d2"></div>
              <div className="dot d3"></div>
              <div className="dot d4"></div>

              <div className="core">
                <div className="glow"></div>
                <div className="brain">🧠</div>
                <p>MEDISCAN AI</p>
              </div>

              <div className="glass g1">
                <span>🔥</span>
                <div>
                  <b>AI Heatmap</b><br />
                  <small>Live Analysis</small>
                </div>
              </div>

              <div className="glass g2">
                <span>🎯</span>
                <div>
                  <b>96.8%</b><br />
                  <small>Confidence</small>
                </div>
              </div>

              <div className="glass g3">
                <span>📄</span>
                <div>
                  <b>PDF Report</b><br />
                  <small>Instant Export</small>
                </div>
              </div>

            </div>

          </section>

          {/* LIVE STATS */}
          <section className="stats">

            <div className="stat">
              <div className="icon">🩻</div>
              <div className="num">{scans}</div>
              <div className="label">Total Scans</div>
            </div>

            <div className="stat">
              <div className="icon">🎯</div>
              <div className="num">{accuracy}%</div>
              <div className="label">AI Accuracy</div>
            </div>

            <div className="stat">
              <div className="icon">🏥</div>
              <div className="num">{hospitals}+</div>
              <div className="label">Hospitals</div>
            </div>

            <div className="stat">
              <div className="icon">📄</div>
              <div className="num">{reports}</div>
              <div className="label">Reports</div>
            </div>

          </section>

          {/* FEATURES */}
          <section className="section">

            <div className="tag">WHY CHOOSE MEDISCAN AI</div>

            <h2 className="heading">
              Intelligent. Elegant. Reliable.
            </h2>

            <p className="desc">
              Built for radiologists and hospitals using explainable
              artificial intelligence with beautiful healthcare design.
            </p>

            <div className="cards">

              <div className="card">
                <div className="circle">🤖</div>
                <h3>AI Diagnosis</h3>
                <p>Deep learning identifies pneumonia within seconds.</p>
              </div>

              <div className="card">
                <div className="circle">🔥</div>
                <h3>Heatmap</h3>
                <p>Grad-CAM visualizes the exact lung regions analyzed.</p>
              </div>

              <div className="card">
                <div className="circle">🛡️</div>
                <h3>Confidence</h3>
                <p>Transparent AI confidence for better clinical support.</p>
              </div>

              <div className="card">
                <div className="circle">📑</div>
                <h3>PDF Report</h3>
                <p>Download elegant hospital-style medical reports instantly.</p>
              </div>

            </div>

          </section>

          <HowItWorks />
          <TrustSection />
          <Footer />

        </div>
      </div>
    </>
  );
}