import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

export default function Dashboard() {
  const [stats, setStats] = useState({
    total: 0,
    normal: 0,
    pneumonia: 0,
  });

  useEffect(() => {
    const doctor = localStorage.getItem("doctorName");

    const history = JSON.parse(localStorage.getItem("scanHistory")) || [];

    // ONLY THIS DOCTOR'S SCANS
    const myScans = history.filter(
      (item) => item.username === doctor
    );

    const normal = myScans.filter(
      (item) => item.prediction === "NORMAL"
    ).length;

    const pneumonia = myScans.filter(
      (item) => item.prediction === "PNEUMONIA"
    ).length;

    setStats({
      total: myScans.length,
      normal,
      pneumonia,
    });
  }, []);

  return (
    <>
      <Navbar />

      <div style={{ padding: "40px", background: "#EEF5FF", minHeight: "100vh" }}>
        <h1>Doctor Dashboard</h1>
        <p>Welcome Dr. {localStorage.getItem("doctorName")}</p>

        <div
          style={{
            display: "flex",
            gap: "20px",
            marginTop: "30px",
            flexWrap: "wrap",
          }}
        >
          <div style={card}>
            <h3>Total Scans</h3>
            <h1>{stats.total}</h1>
          </div>

          <div style={card}>
            <h3>Normal Cases</h3>
            <h1 style={{ color: "green" }}>{stats.normal}</h1>
          </div>

          <div style={card}>
            <h3>Pneumonia Cases</h3>
            <h1 style={{ color: "red" }}>{stats.pneumonia}</h1>
          </div>
        </div>
      </div>
    </>
  );
}

const card = {
  background: "white",
  borderRadius: "16px",
  padding: "25px",
  width: "220px",
  boxShadow: "0 8px 20px rgba(0,0,0,.08)",
};