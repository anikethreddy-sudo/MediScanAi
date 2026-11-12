
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  const [doctorId, setDoctorId] = useState("");
  const [doctorName, setDoctorName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = (e) => {
    e.preventDefault();
    setError("");

    if (
      !doctorId.trim() ||
      !doctorName.trim() ||
      !email.trim() ||
      !password ||
      !confirmPassword
    ) {
      setError("Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    let doctors = {};

    try {
      doctors = JSON.parse(
        localStorage.getItem("registeredDoctors") || "{}"
      );
    } catch {
      setError("Unable to access registered accounts. Please try again.");
      return;
    }

    const cleanDoctorId = doctorId.trim();

    if (doctors[cleanDoctorId]) {
      setError("Doctor ID already registered. Please login.");
      return;
    }

    doctors[cleanDoctorId] = {
      doctorId: cleanDoctorId,
      doctorName: doctorName.trim(),
      email: email.trim(),
      password,
    };

    localStorage.setItem(
      "registeredDoctors",
      JSON.stringify(doctors)
    );

    alert("Registration successful! Please login.");
    navigate("/login");
  };

  return (
    <>
      <main className="registerPage">
        <div className="registerLayout">

          <section className="registerIntro">
            <div className="registerBrandMark">M</div>

            <p className="registerEyebrow">
              MEDICAL IMAGING PLATFORM
            </p>

            <h1>
              MediScan
              <br />
              AI
            </h1>

            <p className="registerDescription">
              Create your professional workspace for chest X-ray
              screening support and patient scan records.
            </p>

            <div className="registerIntroFooter">
              <span>DOCTOR ACCESS</span>
              <span>•</span>
              <span>NEW ACCOUNT</span>
            </div>
          </section>

          <section className="registerFormSection">
            <div className="registerCard">

              <div className="registerHeading">
                <p className="registerFormEyebrow">
                  GET STARTED
                </p>

                <h2>Create your doctor account</h2>

                <p>
                  Enter your professional details to set up
                  your MediScan AI workspace.
                </p>
              </div>

              <form onSubmit={handleRegister}>

                <div className="registerFormGroup">
                  <label htmlFor="doctorId">Doctor ID</label>
                  <input
                    id="doctorId"
                    type="text"
                    placeholder="Enter your Doctor ID"
                    value={doctorId}
                    onChange={(e) => {
                      setDoctorId(e.target.value);
                      setError("");
                    }}
                    autoComplete="username"
                  />
                </div>

                <div className="registerFormGroup">
                  <label htmlFor="doctorName">Doctor Name</label>
                  <input
                    id="doctorName"
                    type="text"
                    placeholder="Enter your full name"
                    value={doctorName}
                    onChange={(e) => {
                      setDoctorName(e.target.value);
                      setError("");
                    }}
                    autoComplete="name"
                  />
                </div>

                <div className="registerFormGroup">
                  <label htmlFor="email">Email Address</label>
                  <input
                    id="email"
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError("");
                    }}
                    autoComplete="email"
                  />
                </div>

                <div className="registerFormGroup">
                  <label htmlFor="password">Password</label>

                  <div className="registerPasswordWrapper">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setError("");
                      }}
                      autoComplete="new-password"
                    />

                    <button
                      type="button"
                      className="registerShowPassword"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>

                <div className="registerFormGroup">
                  <label htmlFor="confirmPassword">
                    Confirm Password
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      setError("");
                    }}
                    autoComplete="new-password"
                  />
                </div>

                {error && (
                  <div className="registerError" role="alert">
                    {error}
                  </div>
                )}

                <button type="submit" className="registerButton">
                  Create account
                  <span>→</span>
                </button>

              </form>

              <div className="registerLoginSection">
                <span>Already have an account?</span>
                <Link to="/login">Sign in here</Link>
              </div>

              <div className="registerDivider" />

              <p className="registerDisclaimer">
                This workspace is intended for authorised medical
                users. Keep your account credentials private.
              </p>

            </div>

            <p className="registerPageFooter">
              MEDISCAN AI &nbsp;·&nbsp; CHEST X-RAY SCREENING SUPPORT
            </p>
          </section>

        </div>
      </main>

      <style>{`
        .registerPage {
          min-height: 100vh;
          background: #f4f8f5;
          color: #17251e;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 35px;
          font-family: 'Poppins', sans-serif;
          font-weight: 300;
        }

        .registerPage * {
          box-sizing: border-box;
          font-family: 'Poppins', sans-serif;
          font-weight: 300;
        }

        .registerLayout {
          width: 100%;
          max-width: 1100px;
          min-height: 650px;
          display: grid;
          grid-template-columns: 0.9fr 1.1fr;
          background: #ffffff;
          border: 1px solid #e3ebe5;
          border-radius: 10px;
          overflow: hidden;
        }

        .registerIntro {
          padding: 65px 55px;
          background: #edf5ef;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }

        .registerBrandMark {
          width: 45px;
          height: 45px;
          border: 1px solid #397b58;
          color: #397b58;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 21px;
          border-radius: 8px;
          margin-bottom: 65px;
        }

        .registerEyebrow,
        .registerFormEyebrow {
          color: #64816e;
          font-size: 10px;
          font-weight: 400;
          letter-spacing: 1.7px;
          margin: 0 0 17px;
        }

        .registerIntro h1 {
          font-size: 54px;
          line-height: 1.12;
          letter-spacing: -2px;
          font-weight: 300;
          margin: 0;
          color: #193d2a;
        }

        .registerDescription {
          max-width: 300px;
          margin-top: 24px;
          color: #718078;
          font-size: 13px;
          line-height: 1.9;
        }

        .registerIntroFooter {
          display: flex;
          gap: 10px;
          align-items: center;
          margin-top: auto;
          padding-top: 45px;
          color: #718078;
          font-size: 9px;
          letter-spacing: 1px;
        }

        .registerFormSection {
          padding: 42px 65px 25px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .registerCard {
          width: 100%;
          max-width: 390px;
          margin: auto;
        }

        .registerHeading {
          margin-bottom: 25px;
        }

        .registerHeading h2 {
          margin: 0;
          font-size: 25px;
          line-height: 1.4;
          letter-spacing: -0.7px;
          font-weight: 300;
          color: #20372a;
        }

        .registerHeading > p:last-child {
          margin: 9px 0 0;
          color: #78847d;
          font-size: 12px;
          line-height: 1.8;
        }

        .registerFormGroup {
          margin-bottom: 15px;
        }

        .registerFormGroup label {
          display: block;
          margin-bottom: 7px;
          color: #354b3d;
          font-size: 12px;
          font-weight: 400;
        }

        .registerFormGroup input {
          width: 100%;
          height: 43px;
          padding: 0 14px;
          border: 1px solid #dce6df;
          border-radius: 6px;
          background: #ffffff;
          color: #26382d;
          font-size: 12px;
          outline: none;
          transition: border-color .2s ease, box-shadow .2s ease;
        }

        .registerFormGroup input::placeholder {
          color: #a0aaa3;
        }

        .registerFormGroup input:focus {
          border-color: #57936c;
          box-shadow: 0 0 0 3px rgba(87, 147, 108, 0.08);
        }

        .registerPasswordWrapper {
          position: relative;
        }

        .registerPasswordWrapper input {
          padding-right: 65px;
        }

        .registerShowPassword {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          border: none;
          background: transparent;
          color: #64816e;
          font-size: 11px;
          cursor: pointer;
        }

        .registerError {
          padding: 12px 14px;
          margin: 0 0 15px;
          border: 1px solid #efd8d5;
          border-radius: 6px;
          background: #fff8f7;
          color: #a34d45;
          font-size: 11px;
          line-height: 1.6;
        }

        .registerButton {
          width: 100%;
          height: 49px;
          margin-top: 5px;
          padding: 0 17px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border: 1px solid #34734d;
          border-radius: 6px;
          background: #34734d;
          color: #ffffff;
          font-size: 12px;
          font-weight: 400;
          cursor: pointer;
          transition: background .2s ease, border-color .2s ease;
        }

        .registerButton:hover {
          background: #285e3e;
          border-color: #285e3e;
        }

        .registerButton span {
          color: #ffffff;
          font-size: 19px;
        }

        .registerLoginSection {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 5px;
          margin-top: 20px;
          font-size: 11px;
          color: #78847d;
        }

        .registerLoginSection a {
          color: #34734d;
          font-weight: 400;
          text-decoration: none;
          border-bottom: 1px solid #9bbba4;
        }

        .registerLoginSection a:hover {
          color: #285e3e;
        }

        .registerDivider {
          height: 1px;
          background: #e9efea;
          margin: 22px 0 14px;
        }

        .registerDisclaimer {
          margin: 0;
          text-align: center;
          color: #929e95;
          font-size: 10px;
          line-height: 1.8;
        }

        .registerPageFooter {
          margin: 25px 0 0;
          text-align: center;
          color: #98a49b;
          font-size: 9px;
          letter-spacing: 1px;
        }

        @media(max-width: 800px) {
          .registerPage {
            padding: 20px;
          }

          .registerLayout {
            max-width: 520px;
            grid-template-columns: 1fr;
          }

          .registerIntro {
            padding: 30px;
          }

          .registerBrandMark {
            margin-bottom: 30px;
          }

          .registerIntro h1 {
            font-size: 39px;
          }

          .registerDescription {
            margin-top: 13px;
          }

          .registerIntroFooter {
            margin-top: 25px;
            padding-top: 0;
          }

          .registerFormSection {
            padding: 38px 30px 25px;
          }
        }

        @media(max-width: 480px) {
          .registerPage {
            padding: 12px;
          }

          .registerLayout {
            border-radius: 8px;
          }

          .registerIntro {
            padding: 25px;
          }

          .registerFormSection {
            padding: 32px 23px 22px;
          }

          .registerHeading h2 {
            font-size: 23px;
          }

          .registerIntro h1 {
            font-size: 35px;
          }
        }
      `}</style>
    </>
  );
}
