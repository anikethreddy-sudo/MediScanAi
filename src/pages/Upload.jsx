import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function Upload() {
  const navigate = useNavigate();

  const [patientName, setPatientName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("Male");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      alert("Please select an X-Ray image");
      return;
    }

    const doctorName = localStorage.getItem("doctorName") || "Doctor";

    const formData = new FormData();
    formData.append("username", doctorName);
    formData.append("patient_name", patientName);
    formData.append("age", age);
    formData.append("gender", gender);
    formData.append("file", file);

    // ✅ Render Backend URL
    const response = await fetch(
      "https://mediscanai-bb2m.onrender.com/predict",
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json();

    // Current Result
    localStorage.setItem("result", JSON.stringify(data));

    // Save History
    const history = JSON.parse(localStorage.getItem("scanHistory")) || [];
    history.push({
      ...data,
      username: doctorName,
      date: new Date().toLocaleString(),
    });
    localStorage.setItem("scanHistory", JSON.stringify(history));

    navigate("/processing");
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

        body{
          background:#04184D;
        }

        .page{
          min-height:100vh;
          background:linear-gradient(135deg,#04184D,#0A2E73);
        }

        .container{
          max-width:1200px;
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
          color:white;
          font-size:48px;
          line-height:1.2;
          font-weight:300;
        }

        .left p{
          color:#D6E5FF;
          margin-top:18px;
          line-height:1.8;
          font-size:17px;
          font-weight:300;
        }

        .doctor{
          display:inline-block;
          margin-top:22px;
          background:rgba(255,255,255,.15);
          color:white;
          padding:10px 18px;
          border-radius:30px;
          backdrop-filter:blur(8px);
          font-weight:300;
        }

        .previewBox{
          width:340px;
          height:340px;
          margin-top:35px;
          border-radius:24px;
          overflow:hidden;
          position:relative;
          background:rgba(255,255,255,.08);
          border:3px solid rgba(255,255,255,.18);
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
          color:white;
          text-align:center;
        }

        .placeholder .icon{
          font-size:90px;
          animation:float 3s ease-in-out infinite;
        }

        .scanLine{
          position:absolute;
          left:0;
          width:100%;
          height:4px;
          background:#00E5FF;
          box-shadow:0 0 15px #00E5FF;
          animation:scan 2s linear infinite;
        }

        @keyframes scan{
          0%{top:0;}
          100%{top:100%;}
        }

        @keyframes float{
          0%,100%{transform:translateY(0);}
          50%{transform:translateY(-12px);}
        }

        .right{
          background:#EAF2FF;
          border-radius:26px;
          padding:28px;
          box-shadow:0 20px 45px rgba(0,0,0,.18);
        }

        .title{
          font-size:28px;
          color:#111827;
          font-weight:300;
        }

        .sub{
          color:#64748B;
          margin:8px 0 22px;
          font-weight:300;
        }

        input,select{
          width:100%;
          padding:14px 16px;
          border:1px solid #D6E4FF;
          border-radius:12px;
          background:white;
          margin-bottom:16px;
          font-size:15px;
          outline:none;
        }

        input:focus,select:focus{
          border-color:#2563EB;
        }

        .uploadBox{
          border:2px dashed #93C5FD;
          border-radius:16px;
          background:white;
          padding:28px;
          text-align:center;
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
          font-size:16px;
          cursor:pointer;
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
            font-size:38px;
          }
        }
      `}</style>

      <div className="page">
        <Navbar />

        <div className="container">
          <div className="hero">

            {/* LEFT */}
            <div className="left">

              <h1>
                AI Powered
                <br/>
                Chest X-Ray
                <br/>
                Analysis
              </h1>

              <p>
                Upload a patient's chest X-ray and let MediScan AI generate
                an explainable heatmap, confidence score and downloadable
                medical report within seconds.
              </p>

              <div className="doctor">
                👨‍⚕️ Logged in : Dr. {localStorage.getItem("doctorName")}
              </div>

              <div className="previewBox">
                {preview ? (
                  <>
                    <img src={preview} className="previewImg" alt="Preview" />
                    <div className="scanLine"></div>
                  </>
                ) : (
                  <div className="placeholder">
                    <div className="icon">🩻</div>
                    <p>Select an X-Ray to preview</p>
                  </div>
                )}
              </div>

            </div>

            {/* RIGHT */}
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
                  onChange={(e)=>setPatientName(e.target.value)}
                  required
                />

                <input
                  type="number"
                  placeholder="Age"
                  value={age}
                  onChange={(e)=>setAge(e.target.value)}
                  required
                />

                <select
                  value={gender}
                  onChange={(e)=>setGender(e.target.value)}
                >
                  <option>Male</option>
                  <option>Female</option>
                </select>

                <div className="uploadBox">
                  <div style={{fontSize:"48px"}}>📤</div>
                  <p>Choose Chest X-Ray Image</p>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e)=>{
                      const selected = e.target.files[0];
                      setFile(selected);

                      if(selected){
                        setPreview(URL.createObjectURL(selected));
                      }
                    }}
                    required
                  />
                </div>

                <button className="btn" type="submit">
                  Analyze X-Ray
                </button>

              </form>

            </div>

          </div>
        </div>
      </div>
    </>
  );
}