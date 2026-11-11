
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const API = "http://localhost:8000";

export default function Upload() {
  const navigate = useNavigate();

  const [patientMode, setPatientMode] = useState("new");

  const [patientName, setPatientName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState("Male");

  const [patientId, setPatientId] = useState("");
  const [registeredPatient, setRegisteredPatient] = useState(null);
  const [patientLoading, setPatientLoading] = useState(false);

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const doctorName = localStorage.getItem("doctorName") || "Doctor";
  const doctorId = localStorage.getItem("doctorId") || "unknown";

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const handleModeChange = (mode) => {
    setPatientMode(mode);
    setRegisteredPatient(null);
    setPatientId("");
    setPatientName("");
    setDateOfBirth("");
    setGender("Male");
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];

    if (!selectedFile) return;

    if (!selectedFile.type.startsWith("image/")) {
      alert("Please select a valid image file.");
      e.target.value = "";
      return;
    }

    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
  };

  // Retrieve an existing patient using their permanent Patient ID
  const handlePatientLookup = async () => {
    const cleanPatientId = patientId.trim().toUpperCase();

    if (!cleanPatientId) {
      alert("Please enter the Patient ID.");
      return false;
    }

    setPatientLoading(true);
    setRegisteredPatient(null);

    try {
      const response = await fetch(
        `${API}/patients/${encodeURIComponent(cleanPatientId)}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Patient ID not found.");
      }

      setPatientId(data.patient_id);
      setRegisteredPatient(data);

      alert("Patient details retrieved successfully.");

      return true;
    } catch (error) {
      console.error("Patient lookup error:", error);
      alert(error.message);
      return false;
    } finally {
      setPatientLoading(false);
    }
  };

  // Register a new patient only once
  const handlePatientRegistration = async () => {
    if (!patientName.trim()) {
      throw new Error("Please enter the patient's name.");
    }

    if (!dateOfBirth) {
      throw new Error("Please enter the patient's date of birth.");
    }

    if (dateOfBirth > today) {
      throw new Error("Date of birth cannot be in the future.");
    }

    const response = await fetch(`${API}/patients/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        patient_name: patientName.trim(),
        date_of_birth: dateOfBirth,
        gender: gender,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || "Patient registration failed.");
    }

    setPatientId(data.patient_id);
    setRegisteredPatient(data);

    return data;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      alert("Please select a Chest X-ray image.");
      return;
    }

    setLoading(true);

    try {
      let patient;

      if (patientMode === "new") {
        // Register a new patient and receive the permanent ID
        patient = await handlePatientRegistration();
      } else {
        // Never create a new patient for an existing patient visit
        const cleanPatientId = patientId.trim().toUpperCase();

        if (!cleanPatientId) {
          throw new Error("Please enter the existing Patient ID.");
        }

        if (
          !registeredPatient ||
          registeredPatient.patient_id !== cleanPatientId
        ) {
          const response = await fetch(
            `${API}/patients/${encodeURIComponent(cleanPatientId)}`
          );

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.detail || "Patient ID not found.");
          }

          patient = data;
          setRegisteredPatient(data);
          setPatientId(data.patient_id);
        } else {
          patient = registeredPatient;
        }
      }

      // Send Patient ID to the prediction API
      const formData = new FormData();

      formData.append("username", doctorName);
      formData.append("patient_id", patient.patient_id);
      formData.append("file", file);

      const useMulticlass = window.confirm(
        "Use the experimental FIVE-CLASS research model?\n\nOK = Five-class model\nCancel = Original pneumonia model"
      );

      const predictionEndpoint = useMulticlass
        ? "/predict-multiclass"
        : "/predict";

      const response = await fetch(`${API}${predictionEndpoint}`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || `Server returned ${response.status}`);
      }

      if (data.error) {
        throw new Error(data.error);
      }

      // Keep the permanent Patient ID in the result
      const resultData = {
        ...data,
        patient_id: patient.patient_id,
      };

      localStorage.setItem("result", JSON.stringify(resultData));

      // Save this scan in the doctor's browser history
      const historyKey = `scanHistory_${doctorId}`;

      const oldHistory = JSON.parse(
        localStorage.getItem(historyKey) || "[]"
      );

      const historyItem = {
        ...resultData,
        scan_date: data.scan_date || new Date().toLocaleString(),
      };

      localStorage.setItem(
        historyKey,
        JSON.stringify([historyItem, ...oldHistory])
      );

      navigate("/results");
    } catch (error) {
      console.error("Upload or analysis error:", error);
      alert(`Analysis failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        .upload-page {
          --green: #08785B;
          --green-dark: #075C46;
          --green-deep: #064B3A;
          --green-soft: #EAF5EF;
          --mint: #F2F8F4;
          --text: #183A2E;
          --muted: #82948A;
          --border: #E3EDE6;

          min-height: 100vh;
          background: #F5FAF6;
          color: var(--text);
          font-family: "Poppins", sans-serif;
          font-weight: 300;
        }

        .upload-page * {
          box-sizing: border-box;
        }

        .upload-main {
          max-width: 1240px;
          margin: auto;
          padding: 45px 32px 70px;
        }

        .upload-heading {
          margin-bottom: 32px;
        }

        .upload-eyebrow {
          display: flex;
          align-items: center;
          gap: 9px;
          color: var(--green);
          font-size: 10px;
          font-weight: 400;
          letter-spacing: 1.7px;
          text-transform: uppercase;
          margin-bottom: 13px;
        }

        .upload-eyebrow::before {
          content: "";
          width: 22px;
          height: 1px;
          background: #83B99E;
        }

        .upload-heading h1 {
          color: #173B2D;
          font-size: 31px;
          font-weight: 300;
          letter-spacing: -0.8px;
          margin: 0 0 10px;
        }

        .upload-heading > p {
          color: #82948A;
          font-size: 12px;
          font-weight: 300;
          line-height: 1.8;
          max-width: 650px;
          margin: 0;
        }

        .upload-doctor {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          margin-top: 18px;
          padding: 10px 14px;
          border: 1px solid #DCEBE0;
          border-radius: 7px;
          background: #FFFFFF;
          color: #426653;
          font-size: 11px;
          font-weight: 300;
        }

        .upload-doctor-dot {
          width: 8px;
          height: 8px;
          background: #238B68;
          border-radius: 50%;
          box-shadow: 0 0 0 4px #EAF5EF;
        }

        .upload-layout {
          display: grid;
          grid-template-columns: 1.05fr 0.95fr;
          gap: 24px;
          align-items: start;
        }

        .upload-panel {
          min-width: 0;
          background: #FFFFFF;
          border: 1px solid var(--border);
          border-radius: 11px;
          padding: 25px;
          box-shadow: 0 4px 18px rgba(26, 77, 51, 0.035);
        }

        .upload-panel h2 {
          color: #214A36;
          font-size: 16px;
          font-weight: 400;
          margin: 0 0 8px;
        }

        .upload-panel-description {
          color: #94A198;
          font-size: 11px;
          font-weight: 300;
          line-height: 1.7;
          margin-bottom: 22px;
        }

        .upload-preview {
          height: 370px;
          width: 100%;
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #F2F8F4;
          border: 1px solid #E1EDE4;
          border-radius: 9px;
        }

        .upload-preview-image {
          width: 100%;
          height: 100%;
          object-fit: contain;
          display: block;
        }

        .upload-empty {
          text-align: center;
          padding: 25px;
        }

        .upload-empty-icon {
          width: 65px;
          height: 65px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 17px;
          border-radius: 18px;
          background: #E5F3E9;
          color: var(--green);
          font-size: 30px;
        }

        .upload-empty strong {
          display: block;
          color: #345344;
          font-size: 13px;
          font-weight: 400;
          margin-bottom: 8px;
        }

        .upload-empty p {
          color: #94A198;
          font-size: 11px;
          font-weight: 300;
          line-height: 1.7;
        }

        .upload-file-info {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-top: 15px;
          color: #71877B;
          font-size: 11px;
          font-weight: 300;
          overflow-wrap: anywhere;
        }

        .upload-status {
          color: #167653;
          font-weight: 400;
          white-space: nowrap;
        }

        .upload-form {
          display: flex;
          flex-direction: column;
          gap: 17px;
        }

        .upload-field label {
          display: block;
          color: #426653;
          font-size: 11px;
          font-weight: 400;
          margin-bottom: 8px;
        }

        .upload-field input,
        .upload-field select {
          width: 100%;
          height: 45px;
          padding: 0 13px;
          border: 1px solid #DCEBE0;
          border-radius: 7px;
          background: #FFFFFF;
          color: #183A2E;
          font-size: 12px;
          font-weight: 300;
          outline: none;
          font-family: "Poppins", sans-serif;
          margin: 0;
          transition: border-color .2s, box-shadow .2s;
        }

        .upload-field input:focus,
        .upload-field select:focus {
          border-color: #238B68;
          box-shadow: 0 0 0 3px rgba(35, 139, 104, 0.10);
        }

        .upload-field input::placeholder {
          color: #A0ACA4;
          font-weight: 300;
        }

        .upload-file-box {
          padding: 18px;
          background: #F5FAF6;
          border: 1px dashed #A9CDB5;
          border-radius: 8px;
          transition: background .2s, border-color .2s;
        }

        .upload-file-box:hover {
          background: #EDF6F0;
          border-color: #238B68;
        }

        .upload-file-box input {
          width: 100%;
          height: auto;
          padding: 0;
          border: none;
          border-radius: 0;
          background: transparent;
          font-size: 11px;
          color: #657D6D;
        }

        .upload-file-box input:focus {
          box-shadow: none;
        }

        .upload-file-box p {
          color: #94A198;
          font-size: 10px;
          font-weight: 300;
          line-height: 1.7;
          margin-top: 11px;
        }

        .upload-mode-switch {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
          padding: 5px;
          background: #F2F8F4;
          border: 1px solid #E3EDE6;
          border-radius: 8px;
          margin-bottom: 21px;
        }

        .upload-mode-button {
          min-height: 39px;
          padding: 8px;
          border: 1px solid transparent;
          border-radius: 6px;
          background: transparent;
          color: #71877B;
          font-family: "Poppins", sans-serif;
          font-size: 11px;
          font-weight: 300;
          cursor: pointer;
          transition: all .2s;
        }

        .upload-mode-button.active {
          background: #FFFFFF;
          color: #08785B;
          border-color: #DCEBE0;
          box-shadow: 0 2px 7px rgba(26, 77, 51, .05);
        }

        .upload-patient-card {
          padding: 14px;
          border: 1px solid #CFE5D5;
          border-radius: 7px;
          background: #F0F8F2;
          color: #426653;
          font-size: 11px;
          line-height: 1.9;
          margin-bottom: 17px;
        }

        .upload-patient-card strong {
          color: #08785B;
          font-weight: 400;
        }

        .upload-lookup-button {
          width: 100%;
          min-height: 43px;
          border: 1px solid #A9CDB5;
          border-radius: 7px;
          background: #F2F8F4;
          color: #08785B;
          font-family: "Poppins", sans-serif;
          font-size: 11px;
          font-weight: 400;
          cursor: pointer;
          margin-top: 10px;
        }

        .upload-lookup-button:hover:not(:disabled) {
          background: #E5F3E9;
        }

        .upload-lookup-button:disabled {
          opacity: .6;
          cursor: not-allowed;
        }

        .upload-submit {
          width: 100%;
          min-height: 47px;
          border: 1px solid var(--green);
          border-radius: 7px;
          background: var(--green);
          color: #FFFFFF;
          font-family: "Poppins", sans-serif;
          font-size: 12px;
          font-weight: 400;
          cursor: pointer;
          transition: all .2s ease;
          margin-top: 5px;
          box-shadow: 0 5px 14px rgba(8, 120, 91, 0.12);
        }

        .upload-submit:hover:not(:disabled) {
          background: var(--green-dark);
          border-color: var(--green-dark);
          box-shadow: 0 7px 18px rgba(8, 120, 91, 0.18);
          transform: translateY(-2px);
        }

        .upload-submit:disabled {
          opacity: .65;
          cursor: not-allowed;
          transform: none;
        }

        .upload-disclaimer {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          margin-top: 22px;
          padding: 14px 15px;
          border: 1px solid #DCEBE0;
          border-radius: 7px;
          background: #F0F7F1;
          color: #71877B;
          font-size: 10px;
          font-weight: 300;
          line-height: 1.8;
        }

        .upload-disclaimer strong {
          color: #167653;
          font-weight: 400;
        }

        .upload-loader-overlay {
          position: absolute;
          inset: 0;
          background: rgba(6, 75, 58, 0.82);
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          gap: 17px;
        }

        .upload-pulse {
          width: 58px;
          height: 58px;
          border: 3px solid rgba(255, 255, 255, 0.35);
          border-radius: 50%;
          position: relative;
          animation: uploadPulse 1.5s ease-in-out infinite;
        }

        .upload-pulse::after {
          content: "";
          position: absolute;
          inset: 9px;
          border-radius: 50%;
          background: #83C5A0;
          box-shadow: 0 0 20px rgba(131, 197, 160, 0.65);
        }

        .upload-loader-text {
          color: #FFFFFF;
          font-size: 12px;
          font-weight: 300;
          letter-spacing: .4px;
        }

        @keyframes uploadPulse {
          0%, 100% {
            transform: scale(.85);
            opacity: .65;
            box-shadow: 0 0 0 0 rgba(131, 197, 160, .3);
          }

          50% {
            transform: scale(1.12);
            opacity: 1;
            box-shadow: 0 0 0 13px rgba(131, 197, 160, 0);
          }
        }

        @media (max-width: 850px) {
          .upload-layout {
            grid-template-columns: 1fr;
          }

          .upload-preview {
            height: 320px;
          }
        }

        @media (max-width: 550px) {
          .upload-main {
            padding: 32px 17px 50px;
          }

          .upload-heading h1 {
            font-size: 26px;
          }

          .upload-panel {
            padding: 18px;
          }

          .upload-preview {
            height: 270px;
          }

          .upload-file-info {
            align-items: flex-start;
            flex-direction: column;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .upload-pulse {
            animation: none;
          }

          .upload-submit,
          .upload-file-box {
            transition: none;
          }
        }
      `}</style>

      <div className="upload-page">
        <Navbar />

        <main className="upload-main">
          <header className="upload-heading">
            <div className="upload-eyebrow">
              Patient assessment
            </div>

            <h1>Upload a chest X-ray</h1>

            <p>
              Select a patient record and upload a chest X-ray
              image to begin the AI-assisted analysis.
            </p>

            <div className="upload-doctor">
              <span className="upload-doctor-dot" />
              Logged in as Dr. {doctorName}
            </div>
          </header>

          <div className="upload-layout">
            <section className="upload-panel">
              <h2>X-ray preview</h2>

              <p className="upload-panel-description">
                Review the selected image before submitting it for analysis.
              </p>

              <div className="upload-preview">
                {preview ? (
                  <img
                    src={preview}
                    alt="Selected chest X-ray"
                    className="upload-preview-image"
                  />
                ) : (
                  <div className="upload-empty">
                    <div className="upload-empty-icon">🩻</div>

                    <strong>No image selected</strong>

                    <p>
                      Select a chest X-ray image using the upload
                      form to see its preview here.
                    </p>
                  </div>
                )}

                {loading && (
                  <div
                    className="upload-loader-overlay"
                    role="status"
                    aria-live="polite"
                  >
                    <div className="upload-pulse" />

                    <span className="upload-loader-text">
                      Analyzing image...
                    </span>
                  </div>
                )}
              </div>

              {file && (
                <div className="upload-file-info">
                  <span>{file.name}</span>
                  <span className="upload-status">Image selected</span>
                </div>
              )}
            </section>

            <section className="upload-panel">
              <h2>Patient information</h2>

              <p className="upload-panel-description">
                Select whether this is a new or returning patient.
              </p>

              <div className="upload-mode-switch">
                <button
                  type="button"
                  className={`upload-mode-button ${
                    patientMode === "new" ? "active" : ""
                  }`}
                  onClick={() => handleModeChange("new")}
                  disabled={loading}
                >
                  New patient
                </button>

                <button
                  type="button"
                  className={`upload-mode-button ${
                    patientMode === "existing" ? "active" : ""
                  }`}
                  onClick={() => handleModeChange("existing")}
                  disabled={loading}
                >
                  Existing patient
                </button>
              </div>

              <form className="upload-form" onSubmit={handleSubmit}>
                {patientMode === "new" ? (
                  <>
                    <div className="upload-field">
                      <label htmlFor="patientName">Patient name</label>

                      <input
                        id="patientName"
                        type="text"
                        placeholder="Enter patient name"
                        value={patientName}
                        onChange={(e) => setPatientName(e.target.value)}
                        required
                      />
                    </div>

                    <div className="upload-field">
                      <label htmlFor="patientDOB">Date of birth</label>

                      <input
                        id="patientDOB"
                        type="date"
                        value={dateOfBirth}
                        max={today}
                        onChange={(e) => setDateOfBirth(e.target.value)}
                        required
                      />
                    </div>

                    <div className="upload-field">
                      <label htmlFor="patientGender">Gender</label>

                      <select
                        id="patientGender"
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    {registeredPatient && (
                      <div className="upload-patient-card">
                        <strong>Patient registered successfully</strong>
                        <br />
                        Patient ID: <strong>{registeredPatient.patient_id}</strong>
                        <br />
                        Name: {registeredPatient.patient_name}
                        <br />
                        Age: {registeredPatient.age}
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <div className="upload-field">
                      <label htmlFor="patientId">Permanent Patient ID</label>

                      <input
                        id="patientId"
                        type="text"
                        placeholder="Example: MSP-XXXXXXXXXX"
                        value={patientId}
                        onChange={(e) => {
                          setPatientId(e.target.value.toUpperCase());
                          setRegisteredPatient(null);
                        }}
                        required
                      />

                      <button
                        type="button"
                        className="upload-lookup-button"
                        onClick={handlePatientLookup}
                        disabled={patientLoading || loading}
                      >
                        {patientLoading
                          ? "Finding patient..."
                          : "Find patient"}
                      </button>
                    </div>

                    {registeredPatient && (
                      <div className="upload-patient-card">
                        <strong>Patient record found</strong>
                        <br />
                        Patient ID: <strong>{registeredPatient.patient_id}</strong>
                        <br />
                        Name: {registeredPatient.patient_name}
                        <br />
                        Date of birth: {registeredPatient.date_of_birth}
                        <br />
                        Current age: {registeredPatient.age}
                        <br />
                        Gender: {registeredPatient.gender}
                      </div>
                    )}
                  </>
                )}

                <div className="upload-field">
                  <label htmlFor="xrayFile">Chest X-ray image</label>

                  <div className="upload-file-box">
                    <input
                      id="xrayFile"
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/bmp"
                      required
                      onChange={handleFileChange}
                    />

                    <p>
                      Select a chest X-ray image from your device.
                      Please ensure the image is clear and readable.
                    </p>
                  </div>
                </div>

                <button
                  type="submit"
                  className="upload-submit"
                  disabled={loading || patientLoading}
                >
                  {loading ? "Analyzing..." : "Submit for analysis"}
                </button>
              </form>

              <div className="upload-disclaimer">
                <span>ⓘ</span>

                <span>
                  <strong>Important:</strong> Model predictions are
                  not a confirmed medical diagnosis. Results should
                  be reviewed by a qualified healthcare professional.
                </span>
              </div>
            </section>
          </div>
        </main>
      </div>
    </>
  );
}
