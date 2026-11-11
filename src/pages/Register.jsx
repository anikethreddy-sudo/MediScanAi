import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  const [doctorId, setDoctorId] = useState("");
  const [doctorName, setDoctorName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = (e) => {
    e.preventDefault();

    if (
      !doctorId ||
      !doctorName ||
      !email ||
      !password ||
      !confirmPassword
    ) {
      alert("Please fill all fields");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const doctors = JSON.parse(localStorage.getItem("registeredDoctors")) || {};

    if (doctors[doctorId]) {
      alert("Doctor ID already registered. Please login.");
      return;
    }

    doctors[doctorId] = {
      doctorId,
      doctorName,
      email,
      password,
    };

    localStorage.setItem("registeredDoctors", JSON.stringify(doctors));

    alert("Registration successful! Please login.");

    navigate("/login");
  };

  return (
    <>
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-family: Poppins, sans-serif;
        }

        body {
          background: #0A2E73;
        }

        .page {
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          background: linear-gradient(135deg, #04184D, #0A2E73);
          padding: 20px;
        }

        .card {
          width: 430px;
          background: #EEF4FF;
          border-radius: 24px;
          padding: 35px;
          box-shadow: 0 25px 60px rgba(0,0,0,.25);
        }

        .logo {
          width: 80px;
          height: 80px;
          margin: auto;
          border-radius: 50%;
          background: linear-gradient(135deg,#2563EB,#38BDF8);
          display: flex;
          justify-content: center;
          align-items: center;
          color: white;
          font-size: 36px;
        }

        h1 {
          text-align: center;
          color: #111827;
          margin-top: 16px;
          font-weight: 600;
        }

        p {
          text-align: center;
          color: #64748B;
          margin: 8px 0 25px;
        }

        input {
          width: 100%;
          padding: 14px 16px;
          margin-bottom: 14px;
          border-radius: 12px;
          border: 1px solid #CBD5E1;
          outline: none;
          font-size: 15px;
          background: white;
        }

        input:focus {
          border-color: #2563EB;
        }

        button {
          width: 100%;
          padding: 15px;
          border: none;
          border-radius: 12px;
          background: linear-gradient(90deg,#2563EB,#38BDF8);
          color: white;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          margin-top: 5px;
        }

        .login-link {
          text-align: center;
          margin-top: 20px;
          color: #64748B;
          font-size: 14px;
        }

        .login-link a {
          color: #2563EB;
          font-weight: 600;
          text-decoration: none;
        }

        .footer {
          text-align: center;
          margin-top: 18px;
          color: #64748B;
          font-size: 12px;
        }
      `}</style>

      <div className="page">
        <div className="card">

          <div className="logo">🩺</div>

          <h1>MediScan AI</h1>

          <p>Doctor Registration</p>

          <form onSubmit={handleRegister}>

            <input
              type="text"
              placeholder="Doctor ID"
              value={doctorId}
              onChange={(e) => setDoctorId(e.target.value)}
            />

            <input
              type="text"
              placeholder="Doctor Name"
              value={doctorName}
              onChange={(e) => setDoctorName(e.target.value)}
            />

            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <button type="submit">
              Create Doctor Account
            </button>

          </form>

          <div className="login-link">
            Already have an account?{" "}
            <Link to="/login">Login here</Link>
          </div>

          <div className="footer">
            AI Powered Chest X-Ray Analysis System
          </div>

        </div>
      </div>
    </>
  );
}