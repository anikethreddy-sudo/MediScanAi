
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

    if (!doctorId || !doctorName || !email || !password || !confirmPassword) {
      alert("Please fill all fields");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const doctors =
      JSON.parse(localStorage.getItem("registeredDoctors")) || {};

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
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');

        .register-page,
        .register-page * {
          box-sizing: border-box;
          font-family: 'Poppins', sans-serif;
        }

        .register-page {
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 30px 18px;
          background: linear-gradient(135deg, #04184D, #0A2E73);
        }

        .register-card {
          width: 100%;
          max-width: 450px;
          padding: 38px 36px;
          background: #EEF4FF;
          border-radius: 24px;
          box-shadow: 0 25px 60px rgba(0, 0, 0, 0.25);
          animation: registerAppear 0.5s ease;
        }

        @keyframes registerAppear {
          from {
            opacity: 0;
            transform: translateY(15px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .register-logo {
          width: 76px;
          height: 76px;
          margin: 0 auto 12px;
          border-radius: 22px;
          background: linear-gradient(135deg, #2563EB, #38BDF8);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 36px;
          box-shadow: 0 8px 20px rgba(37, 99, 235, 0.25);
        }

        .register-title {
          text-align: center;
          color: #111827;
          font-size: 27px;
          font-weight: 600;
          margin: 12px 0 4px;
        }

        .register-subtitle {
          text-align: center;
          color: #64748B;
          font-size: 14px;
          margin: 0 0 28px;
        }

        .register-field {
          margin-bottom: 17px;
        }

        .register-field label {
          display: block;
          color: #334155;
          font-size: 13px;
          font-weight: 500;
          margin-bottom: 7px;
        }

        .register-field input {
          width: 100%;
          padding: 13px 15px;
          border: 1px solid #CBD5E1;
          border-radius: 12px;
          background: #FFFFFF;
          color: #111827;
          font-size: 14px;
          outline: none;
          transition: 0.2s ease;
        }

        .register-field input:focus {
          border-color: #2563EB;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.10);
        }

        .register-field input::placeholder {
          color: #94A3B8;
        }

        .register-button {
          width: 100%;
          padding: 15px;
          margin-top: 8px;
          border: none;
          border-radius: 12px;
          background: linear-gradient(90deg, #2563EB, #38BDF8);
          color: white;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: 0.25s ease;
        }

        .register-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 9px 20px rgba(37, 99, 235, 0.25);
        }

        .register-login {
          text-align: center;
          margin-top: 23px;
          color: #64748B;
          font-size: 13px;
        }

        .register-login a {
          color: #2563EB;
          font-weight: 600;
          text-decoration: none;
        }

        .register-login a:hover {
          text-decoration: underline;
        }

        .register-footer {
          text-align: center;
          margin-top: 22px;
          padding-top: 17px;
          border-top: 1px solid #DCE6F5;
          color: #64748B;
          font-size: 11px;
        }

        @media (max-width: 480px) {
          .register-card {
            padding: 30px 22px;
          }

          .register-title {
            font-size: 24px;
          }
        }
      `}</style>

      <div className="register-page">
        <div className="register-card">

          <div className="register-logo">🩺</div>

          <h1 className="register-title">MediScan AI</h1>

          <p className="register-subtitle">
            Create Your Doctor Account
          </p>

          <form onSubmit={handleRegister}>

            <div className="register-field">
              <label>Doctor ID</label>
              <input
                type="text"
                placeholder="Enter your Doctor ID"
                value={doctorId}
                onChange={(e) => setDoctorId(e.target.value)}
              />
            </div>

            <div className="register-field">
              <label>Doctor Name</label>
              <input
                type="text"
                placeholder="Enter your full name"
                value={doctorName}
                onChange={(e) => setDoctorName(e.target.value)}
              />
            </div>

            <div className="register-field">
              <label>Email Address</label>
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="register-field">
              <label>Password</label>
              <input
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="register-field">
              <label>Confirm Password</label>
              <input
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <button type="submit" className="register-button">
              Create Doctor Account
            </button>

          </form>

          <div className="register-login">
            Already have an account?{" "}
            <Link to="/login">Login here</Link>
          </div>

          <div className="register-footer">
            AI Powered Chest X-Ray Analysis System
          </div>

        </div>
      </div>
    </>
  );
}
