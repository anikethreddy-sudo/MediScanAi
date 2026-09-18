import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const API = "https://mediscanai-backend-pzfz.onrender.com";

export default function Upload() {
  const navigate = useNavigate();

  const [patientName, setPatientName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("Male");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const doctorName = localStorage.getItem("doctorName") || "Doctor";

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      alert("Please select a Chest X-Ray image");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("username", doctorName);
    formData.append("patient_name", patientName);
    formData.append("age", age);
    formData.append("gender", gender);
    formData.append("file", file);

    try {
      const res = await fetch(`${API}/predict`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Server Error");

      const data = await res.json();

      localStorage.setItem("result", JSON.stringify(data));
      navigate("/results");
    } catch (err) {
      alert("Backend connection failed!");
      console.log(err);
    }

    setLoading(false);
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
          background:#04184D;
        }

        .page{
          min-height:100vh;
          background:linear-gradient(135deg,#04184D,#0A2E73);
        }

        .container{
          max-width:1250px;
          margin:auto;
          padding:35px 25px;
        }

        .hero{
          display:grid;
          grid-template-columns:1fr 1fr;
          gap:35px;
          align-items:center;
        }

        .left h1{
          color:#fff;
          font-size:52px;
          font-weight:300;
          line-height:1.2;
        }

        .left p{
          color:#D6E5FF;
          margin-top:18px;
          line-height:1.8;
          font-size:17px;
        }

        .doctor{
          display:inline-block;
          margin-top:22px;
          padding:10px 18px;
          border-radius:30px;
          color:#fff;
          background:rgba(255,255,255,.15);
        }

        .previewBox{
          width:360px;
          height:360px;
          margin-top:35px;
          border-radius:22px;
          overflow:hidden;
          position:relative;
          background:rgba(255,255,255,.08);
          border:2px solid rgba(255,255,255,.15);
          display:flex;
          justify-content:center;
          align-items:center;
        }

        .previewImg{
          width:100%;
          height:100%;
          object-fit:cover;
        }

        .placeholder{
          text-align:center;
          color:white;
        }

        .placeholder div{
          font-size:90px;
        }

        .scanLine{
          position:absolute;
          width:100%;
          height:4px;
          background:#00E5FF;
          box-shadow:0 0 15px #00E5FF;
          animation:scan 2s linear infinite;
        }

        @keyframes scan{
          0%{top:0}
          100%{top:100%}
        }

        .right{
          background:#EEF4FF;
          padding:28px;
          border-radius:24px;
          box-shadow:0 20px 45px rgba(0,0,0,.18);
        }

        .title{
          font-size:30px;
          color:#111827;
          font-weight:600;
          margin-bottom:8px;
        }

        .sub{
          color:#64748B;
          margin-bottom:22px;
        }

        input,select{
          width:100%;
          padding:14px 16px;
          margin-bottom:16px;
          border-radius:12px;
          border:1px solid #D6E4FF;
          font-size:15px;
          outline:none;
          color:#111827;
          background:white;
        }

        .uploadBox{
          border:2px dashed #93C5FD;
          border-radius:16px;
          padding:28px;
          text-align:center;
          background:white;
          margin-bottom:18px;
        }

        .uploadBox p{
          color:#64748B;
          margin:10px 0;
        }

        .btn{
          width:100%;
          padding:15px;
          border:none;
          border-radius:14px;
          background:linear-gradient(90deg,#2563EB,#38BDF8);
          color:white;
          font-size:17px;
          cursor:pointer;
          font-weight:600;
        }

        .btn:disabled{
          opacity:.7;
          cursor:not-allowed;
        }

        @media(max-width:900px){
          .hero{
            grid-template-columns:1fr;
          }

          .previewBox{
            width:100%;
            height:320px;
          }

          .left h1{
            font-size:40px;
          }
        }
      `}</style>

      <div className="page">
        <Navbar />

        <div className="container">
          <div className="hero">

            <div className="left">
              <h1>
                AI Powered
                <br />
                Chest X-Ray
                <br />
                Analysis
              </h1>

              <p>
                Upload a patient's chest X-ray and let MediScan AI generate
                an explainable heatmap, confidence score and medical report
                within seconds.
              </p>

              <div className="doctor">
                👨‍⚕️ Logged in : Dr. {doctorName}
              </div>

              <div className="previewBox">
                {preview ? (
                  <>
                    <img
                      src={preview}
                      alt="preview"
                      className="previewImg"
                    />
                    <div className="scanLine"></div>
                  </>
                ) : (
                  <div className="placeholder">
                    <div>🩻</div>
                    <p>Select an X-Ray</p>
                  </div>
                )}
              </div>
            </div>

            <div className="right">
              <div className="title">Upload New Scan</div>

              <div className="sub">
                Fill the patient details below
              </div>

              <form onSubmit={handleSubmit}>

                <input
                  type="text"
                  placeholder="Patient Name"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  required
                />

                <input
                  type="number"
                  placeholder="Age"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  required
                />

                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                >
                  <option>Male</option>
                  <option>Female</option>
                </select>

                <div className="uploadBox">
                  <div style={{ fontSize: "50px" }}>📤</div>

                  <p>Choose Chest X-Ray Image</p>

                  <input
                    type="file"
                    accept="image/*"
                    required
                    onChange={(e) => {
                      const img = e.target.files[0];
                      setFile(img);

                      if (img) {
                        setPreview(URL.createObjectURL(img));
                      }
                    }}
                  />
                </div>

                <button className="btn" disabled={loading}>
                  {loading ? "Analyzing..." : "Analyze X-Ray"}
                </button>

              </form>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}