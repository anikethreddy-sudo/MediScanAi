import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function DoctorLogin() {
  const navigate = useNavigate();

  const [doctorId, setDoctorId] = useState("");
  const [doctorName, setDoctorName] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    if (!doctorId || !doctorName || !password) {
      alert("Please fill all fields");
      return;
    }

    // Save doctor session
    localStorage.setItem("doctorId", doctorId);
    localStorage.setItem("doctorName", doctorName);
    localStorage.setItem("isLoggedIn", "true");

    navigate("/dashboard");
  };

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
        background:#0A2E73;
      }

      .page{
        min-height:100vh;
        display:flex;
        justify-content:center;
        align-items:center;
        background:linear-gradient(135deg,#04184D,#0A2E73);
        padding:20px;
      }

      .card{
        width:430px;
        background:#EEF4FF;
        border-radius:24px;
        padding:35px;
        box-shadow:0 25px 60px rgba(0,0,0,.25);
      }

      .logo{
        width:90px;
        height:90px;
        margin:auto;
        border-radius:50%;
        background:linear-gradient(135deg,#2563EB,#38BDF8);
        display:flex;
        justify-content:center;
        align-items:center;
        color:white;
        font-size:42px;
      }

      h1{
        text-align:center;
        color:#111827;
        margin-top:18px;
        font-weight:600;
      }

      p{
        text-align:center;
        color:#64748B;
        margin:8px 0 28px;
      }

      input{
        width:100%;
        padding:14px 16px;
        margin-bottom:16px;
        border-radius:12px;
        border:1px solid #CBD5E1;
        outline:none;
        font-size:15px;
        background:white;
      }

      input:focus{
        border-color:#2563EB;
      }

      button{
        width:100%;
        padding:15px;
        border:none;
        border-radius:12px;
        background:linear-gradient(90deg,#2563EB,#38BDF8);
        color:white;
        font-size:16px;
        font-weight:600;
        cursor:pointer;
        margin-top:6px;
      }

      .footer{
        text-align:center;
        margin-top:20px;
        color:#64748B;
        font-size:13px;
      }
      `}</style>

      <div className="page">
        <div className="card">

          <div className="logo">🩺</div>

          <h1>MediScan AI</h1>

          <p>Doctor Secure Login Portal</p>

          <form onSubmit={handleLogin}>

            <input
              type="text"
              placeholder="Doctor ID"
              value={doctorId}
              onChange={(e)=>setDoctorId(e.target.value)}
              required
            />

            <input
              type="text"
              placeholder="Doctor Name"
              value={doctorName}
              onChange={(e)=>setDoctorName(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
              required
            />

            <button type="submit">
              Login to Dashboard
            </button>

          </form>

          <div className="footer">
            AI Powered Chest X-Ray Analysis System
          </div>

        </div>
      </div>
    </>
  );
}