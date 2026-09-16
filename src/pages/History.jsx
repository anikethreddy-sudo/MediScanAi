import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

export default function History() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const doctor = localStorage.getItem("doctorName");

    const allHistory =
      JSON.parse(localStorage.getItem("scanHistory")) || [];

    // SHOW ONLY LOGGED-IN DOCTOR HISTORY
    const myHistory = allHistory.filter(
      (item) => item.username === doctor
    );

    setHistory(myHistory.reverse());
  }, []);

  return (
    <>
      <Navbar />

      <div style={{ padding: "35px", background: "#F4F8FF", minHeight: "100vh" }}>
        <h1>Scan History</h1>
        <p>Doctor: {localStorage.getItem("doctorName")}</p>

        {history.length === 0 ? (
          <h3 style={{ marginTop: "30px" }}>No scans found.</h3>
        ) : (
          <table
            width="100%"
            cellPadding="12"
            style={{
              marginTop: "25px",
              background: "white",
              borderRadius: "12px",
            }}
          >
            <thead style={{ background: "#1D4ED8", color: "white" }}>
              <tr>
                <th>Patient</th>
                <th>Age</th>
                <th>Gender</th>
                <th>Prediction</th>
                <th>Confidence</th>
                <th>Date</th>
              </tr>
            </thead>

            <tbody>
              {history.map((item, index) => (
                <tr key={index} style={{ textAlign: "center" }}>
                  <td>{item.patient_name}</td>
                  <td>{item.age}</td>
                  <td>{item.gender}</td>
                  <td>{item.prediction}</td>
                  <td>{item.confidence}%</td>
                  <td>{item.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}