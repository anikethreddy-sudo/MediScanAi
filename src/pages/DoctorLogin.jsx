
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function DoctorLogin() {
  const navigate = useNavigate();

  const [doctorId, setDoctorId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");

    if (!doctorId.trim() || !password) {
      setError("Please enter your Doctor ID and password.");
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

    const doctor = doctors[doctorId.trim()];

    if (!doctor) {
      setError("Doctor ID not found. Please register first.");
      return;
    }

    if (doctor.password !== password) {
      setError("Incorrect password. Please try again.");
      return;
    }

    localStorage.setItem("doctorId", doctor.doctorId);
    localStorage.setItem("doctorName", doctor.doctorName);
    localStorage.setItem("currentDoctorKey", doctor.doctorId);
    localStorage.setItem("isLoggedIn", "true");

    navigate("/dashboard");
  };

  return (
    <>
      <main className="loginPage">
        <div className="loginLayout">

          <section className="loginIntro">
            <div className="brandMark">M</div>

            <p className="introEyebrow">MEDICAL IMAGING PLATFORM</p>

            <h1>
              MediScan
              <br />
              AI
            </h1>

            <p className="introDescription">
              A focused workspace for chest X-ray screening
              support and patient scan records.
            </p>

            <div className="introFooter">
              <span>DOCTOR ACCESS</span>
              <span>•</span>
              <span>SECURE LOGIN</span>
            </div>
          </section>

          <section className="loginFormSection">
            <div className="loginCard">

              <div className="formHeading">
                <p className="formEyebrow">WELCOME BACK</p>
                <h2>Sign in to your account</h2>
                <p>
                  Enter your registered details to continue
                  to your workspace.
                </p>
              </div>

              <form onSubmit={handleLogin}>

                <div className="formGroup">
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

                <div className="formGroup">
                  <label htmlFor="password">Password</label>

                  <div className="passwordWrapper">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setError("");
                      }}
                      autoComplete="current-password"
                    />

                    <button
                      type="button"
                      className="showPasswordButton"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="loginError" role="alert">
                    {error}
                  </div>
                )}

                <button type="submit" className="loginButton">
                  Sign in
                  <span>→</span>
                </button>

              </form>

              <div className="registerSection">
                <span>Don't have an account?</span>
                <Link to="/register">Create an account</Link>
              </div>

              <div className="loginDivider" />

              <p className="loginDisclaimer">
                This workspace is intended for authorised medical
                users. Keep your login credentials private.
              </p>

            </div>

            <p className="pageFooter">
              MEDISCAN AI &nbsp;·&nbsp; CHEST X-RAY SCREENING SUPPORT
            </p>
          </section>

        </div>
      </main>

      <style>{`
        .loginPage {
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

        .loginPage * {
          box-sizing: border-box;
          font-family: 'Poppins', sans-serif;
          font-weight: 300;
        }

        .loginLayout {
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

        /* LEFT INTRODUCTION */

        .loginIntro {
          padding: 65px 55px;
          background: #edf5ef;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }

        .brandMark {
          width: 45px;
          height: 45px;
          border: 1px solid #397b58;
          color: #397b58;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 21px;
          font-weight: 300;
          border-radius: 8px;
          margin-bottom: 65px;
        }

        .introEyebrow,
        .formEyebrow {
          color: #64816e;
          font-size: 10px;
          font-weight: 400;
          letter-spacing: 1.7px;
          margin: 0 0 17px;
        }

        .loginIntro h1 {
          font-size: 54px;
          line-height: 1.12;
          letter-spacing: -2px;
          font-weight: 300;
          margin: 0;
          color: #193d2a;
        }

        .introDescription {
          max-width: 300px;
          margin-top: 24px;
          color: #718078;
          font-size: 13px;
          line-height: 1.9;
        }

        .introFooter {
          display: flex;
          gap: 10px;
          align-items: center;
          margin-top: auto;
          padding-top: 45px;
          color: #718078;
          font-size: 9px;
          letter-spacing: 1px;
          font-weight: 300;
        }

        /* LOGIN FORM */

        .loginFormSection {
          padding: 65px 65px 30px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .loginCard {
          width: 100%;
          max-width: 390px;
          margin: auto;
        }

        .formHeading {
          margin-bottom: 38px;
        }

        .formHeading h2 {
          margin: 0;
          font-size: 26px;
          line-height: 1.4;
          letter-spacing: -0.7px;
          font-weight: 300;
          color: #20372a;
        }

        .formHeading > p:last-child {
          margin: 10px 0 0;
          color: #78847d;
          font-size: 12px;
          line-height: 1.8;
        }

        .formGroup {
          margin-bottom: 23px;
        }

        .formGroup label {
          display: block;
          margin-bottom: 10px;
          color: #354b3d;
          font-size: 12px;
          font-weight: 400;
        }

        .formGroup input {
          width: 100%;
          height: 49px;
          padding: 0 14px;
          border: 1px solid #dce6df;
          border-radius: 6px;
          background: #ffffff;
          color: #26382d;
          font-family: inherit;
          font-size: 12px;
          font-weight: 300;
          outline: none;
          transition: border-color .2s ease, box-shadow .2s ease;
        }

        .formGroup input::placeholder {
          color: #a0aaa3;
          font-weight: 300;
        }

        .formGroup input:focus {
          border-color: #57936c;
          box-shadow: 0 0 0 3px rgba(87, 147, 108, 0.08);
        }

        .passwordWrapper {
          position: relative;
        }

        .passwordWrapper input {
          padding-right: 65px;
        }

        .showPasswordButton {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          width: auto;
          border: none;
          background: transparent;
          color: #64816e;
          font-family: inherit;
          font-size: 11px;
          font-weight: 300;
          cursor: pointer;
        }

        .showPasswordButton:hover {
          color: #28633e;
        }

        .loginError {
          padding: 12px 14px;
          margin: 0 0 18px;
          border: 1px solid #efd8d5;
          border-radius: 6px;
          background: #fff8f7;
          color: #a34d45;
          font-size: 11px;
          line-height: 1.6;
        }

        .loginButton {
          width: 100%;
          height: 49px;
          margin-top: 7px;
          padding: 0 17px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border: 1px solid #34734d;
          border-radius: 6px;
          background: #34734d;
          color: #ffffff;
          font-family: inherit;
          font-size: 12px;
          font-weight: 400;
          cursor: pointer;
          transition: background .2s ease, border-color .2s ease;
        }

        .loginButton:hover {
          background: #285e3e;
          border-color: #285e3e;
        }

        .loginButton span {
          color: #ffffff;
          font-size: 19px;
          font-weight: 300;
        }

        .registerSection {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 5px;
          margin-top: 27px;
          font-size: 11px;
          color: #78847d;
        }

        .registerSection a {
          color: #34734d;
          font-weight: 400;
          text-decoration: none;
          border-bottom: 1px solid #9bbba4;
        }

        .registerSection a:hover {
          color: #285e3e;
        }

        .loginDivider {
          height: 1px;
          background: #e9efea;
          margin: 32px 0 19px;
        }

        .loginDisclaimer {
          margin: 0;
          text-align: center;
          color: #929e95;
          font-size: 10px;
          line-height: 1.8;
        }

        .pageFooter {
          margin: 35px 0 0;
          text-align: center;
          color: #98a49b;
          font-size: 9px;
          letter-spacing: 1px;
          font-weight: 300;
        }

        /* RESPONSIVE */

        @media(max-width: 800px) {
          .loginPage {
            padding: 20px;
          }

          .loginLayout {
            max-width: 520px;
            grid-template-columns: 1fr;
          }

          .loginIntro {
            padding: 30px;
          }

          .brandMark {
            margin-bottom: 30px;
          }

          .loginIntro h1 {
            font-size: 39px;
          }

          .introDescription {
            margin-top: 13px;
          }

          .introFooter {
            margin-top: 25px;
            padding-top: 0;
          }

          .loginFormSection {
            padding: 45px 30px 25px;
          }
        }

        @media(max-width: 480px) {
          .loginPage {
            padding: 12px;
          }

          .loginLayout {
            border-radius: 8px;
          }

          .loginIntro {
            padding: 25px;
          }

          .loginFormSection {
            padding: 38px 23px 22px;
          }

          .formHeading h2 {
            font-size: 23px;
          }

          .loginIntro h1 {
            font-size: 35px;
          }
        }
      `}</style>
    </>
  );
}
