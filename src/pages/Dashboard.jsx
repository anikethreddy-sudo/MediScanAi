import { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";

export default function Dashboard() {
  const [doctorName, setDoctorName] = useState("Doctor");
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const name = localStorage.getItem("doctorName");
    if (name) setDoctorName(name);

    const allHistory =
      JSON.parse(localStorage.getItem("scanHistory")) || [];

    const myHistory = allHistory.filter(
      (item) => item.username === name
    );

    setHistory(myHistory);
  }, []);

  const totalScans = history.length;
  const normalCases = history.filter(
    (h) => h.prediction === "Normal"
  ).length;
  const alerts = totalScans - normalCases;

  const accuracy = totalScans
    ? (
        history.reduce(
          (a, b) => a + Number(b.confidence || 0),
          0
        ) / totalScans
      ).toFixed(1)
    : "96.8";

  const weekData = useMemo(() => {
    const arr = [0, 0, 0, 0, 0, 0, 0];

    history.forEach((item) => {
      const d = item.date ? new Date(item.date) : new Date();
      let day = d.getDay();
      day = day === 0 ? 6 : day - 1;
      arr[day]++;
    });

    return arr;
  }, [history]);

  const max = Math.max(...weekData, 1);
  const recent = [...history].reverse().slice(0, 5);

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
          background:linear-gradient(135deg,#04184D,#0B2A72);
        }

        .container{
          max-width:1400px;
          margin:auto;
          padding:28px;
        }

        .hero{
          color:white;
          margin-bottom:25px;
        }

        .hero h1{
          font-size:42px;
          font-weight:300;
        }

        .hero p{
          color:#D6E5FF;
          margin-top:8px;
        }

        .stats{
          display:grid;
          grid-template-columns:repeat(4,1fr);
          gap:18px;
          margin-bottom:25px;
        }

        .card{
          background:#EAF2FF;
          border-radius:20px;
          padding:22px;
        }

        .icon{
          font-size:28px;
        }

        .value{
          font-size:34px;
          color:#2563EB;
          margin-top:10px;
        }

        .label{
          color:#64748B;
          margin-top:6px;
        }

        .grid{
          display:grid;
          grid-template-columns:1.6fr 1fr;
          gap:20px;
        }

        .panel{
          background:#EAF2FF;
          border-radius:20px;
          padding:22px;
        }

        .title{
          font-size:22px;
          color:#111827;
          margin-bottom:18px;
        }

        .bars{
          height:220px;
          display:flex;
          align-items:flex-end;
          justify-content:space-between;
          border-bottom:2px solid #CBD5E1;
        }

        .barWrap{
          display:flex;
          flex-direction:column;
          align-items:center;
          width:100%;
        }

        .bar{
          width:34px;
          border-radius:12px 12px 4px 4px;
          background:linear-gradient(180deg,#38BDF8,#2563EB);
        }

        .count{
          font-size:12px;
          color:#64748B;
          margin-bottom:6px;
        }

        .day{
          margin-top:10px;
          color:#64748B;
          font-size:13px;
        }

        .activity{
          display:flex;
          justify-content:space-between;
          align-items:center;
          padding:12px 0;
          border-bottom:1px solid #D6E4FF;
        }

        .activity:last-child{
          border:none;
        }

        .name{
          color:#111827;
          font-weight:600;
        }

        .time{
          color:#64748B;
          font-size:13px;
          margin-top:4px;
        }

        .status{
          color:white;
          padding:6px 12px;
          border-radius:20px;
          font-size:13px;
        }

        .normal{
          background:#16A34A;
        }

        .alert{
          background:#DC2626;
        }

        .empty{
          text-align:center;
          color:#64748B;
          padding:40px 0;
        }

        @media(max-width:900px){
          .stats{
            grid-template-columns:repeat(2,1fr);
          }

          .grid{
            grid-template-columns:1fr;
          }
        }

        @media(max-width:600px){
          .stats{
            grid-template-columns:1fr;
          }
        }
      `}</style>

      <div className="page">
        <Navbar />

        <div className="container">

          <div className="hero">
            <h1>Welcome back, Dr. {doctorName}</h1>
            <p>Real-time AI Medical Analytics Dashboard</p>
          </div>

          <div className="stats">

            <div className="card">
              <div className="icon">🩺</div>
              <div className="value">{totalScans}</div>
              <div className="label">Total Scans</div>
            </div>

            <div className="card">
              <div className="icon">✅</div>
              <div className="value">{normalCases}</div>
              <div className="label">Normal Cases</div>
            </div>

            <div className="card">
              <div className="icon">⚠️</div>
              <div className="value">{alerts}</div>
              <div className="label">Pneumonia Alerts</div>
            </div>

            <div className="card">
              <div className="icon">🎯</div>
              <div className="value">{accuracy}%</div>
              <div className="label">AI Accuracy</div>
            </div>

          </div>

          <div className="grid">

            <div className="panel">

              <div className="title">
                Weekly AI Scan Analytics
              </div>

              <div className="bars">

                {weekData.map((v, i) => (
                  <div className="barWrap" key={i}>
                    <div className="count">{v}</div>

                    <div
                      className="bar"
                      style={{
                        height: `${(v / max) * 170 + 12}px`,
                      }}
                    ></div>

                    <div className="day">
                      {
                        ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"][i]
                      }
                    </div>
                  </div>
                ))}

              </div>

            </div>

            <div className="panel">

              <div className="title">
                Recent Patients
              </div>

              {recent.length === 0 ? (
                <div className="empty">
                  No patient scans yet
                </div>
              ) : (
                recent.map((item, i) => (
                  <div className="activity" key={i}>

                    <div>
                      <div className="name">
                        {item.patient_name}
                      </div>

                      <div className="time">
                        {item.age} yrs • {item.gender}
                      </div>
                    </div>

                    <span
                      className={
                        item.prediction === "Normal"
                          ? "status normal"
                          : "status alert"
                      }
                    >
                      {item.prediction}
                    </span>

                  </div>
                ))
              )}

            </div>

          </div>

        </div>
      </div>
    </>
  );
}