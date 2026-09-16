import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function DoctorLogin() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    // Save the real doctor name
    localStorage.setItem("doctorName", username.trim());

    // Go to dashboard/home
    navigate("/");
  };

  return (
    <>
      <style>{`
        *{
          margin:0;
          padding:0;
          box-sizing:border-box;
          font-family:'Poppins',sans-serif;
        }

        .loginPage{
          min-height:100vh;
          display:flex;
          justify-content:center;
          align-items:center;
          background:linear-gradient(135deg,#E8F1FF,#D7E9FF,#C7E0FF);
        }

        .card{
          width:420px;
          background:#FFFFFF;
          border-radius:24px;
          padding:38px;
          box-shadow:0 20px 50px rgba(37,99,235,.15);
        }

        .logo{
          width:72px;
          height:72px;
          margin:auto;
          border-radius:18px;
          background:linear-gradient(135deg,#2563EB,#38BDF8);
          display:flex;
          align-items:center;
          justify-content:center;
          color:white;
          font-size:34px;
        }

        h1{
          text-align:center;
          color:#0F172A;
          font-size:30px;
          font-weight:300;
          margin-top:18px;
        }

        p{
          text-align:center;
          color:#64748B;
          margin:8px 0 26px;
          font-weight:300;
        }

        input{
          width:100%;
          padding:14px;
          margin-bottom:16px;
          border:1px solid #D6E4FF;
          border-radius:12px;
          background:#F8FBFF;
          font-size:15px;
          outline:none;
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
          cursor:pointer;
        }

        .footer{
          text-align:center;
          margin-top:18px;
          color:#94A3B8;
          font-size:13px;
          font-weight:300;
        }
      `}</style>

      <div className="loginPage">
        <form className="card" onSubmit={handleLogin}>
          <div className="logo">🩺</div>

          <h1>Doctor Login</h1>
          <p>Welcome to MediScan AI</p>

          <input
            type="text"
            placeholder="Enter Doctor Name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">Login</button>

          <div className="footer">
            AI Powered Chest X-Ray Diagnosis
          </div>
        </form>
      </div>
    </>
  );
}