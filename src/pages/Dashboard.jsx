import { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";


export default function Dashboard() {

  // ============================================================
  // DOCTOR NAME
  // ============================================================

  const [doctorName, setDoctorName] = useState("Doctor");


  // ============================================================
  // SCAN HISTORY
  // ============================================================

  const [history, setHistory] = useState([]);


  // ============================================================
  // LOAD DASHBOARD DATA
  // ============================================================

  useEffect(() => {

    const loadDashboardData = () => {

      // --------------------------------------------------------
      // DOCTOR NAME
      // --------------------------------------------------------

      const doctor =
        localStorage.getItem("doctorName") ||
        "Doctor";

      setDoctorName(doctor);


      // --------------------------------------------------------
      // DOCTOR ID
      // --------------------------------------------------------

      const doctorId =
        localStorage.getItem("doctorId") ||
        "unknown";


      // --------------------------------------------------------
      // DOCTOR-SPECIFIC HISTORY KEY
      // --------------------------------------------------------

      const historyKey =
        `scanHistory_${doctorId}`;


      // --------------------------------------------------------
      // LOAD ONLY THIS DOCTOR'S SCAN HISTORY
      // --------------------------------------------------------

      const savedHistory =
        JSON.parse(
          localStorage.getItem(historyKey) || "[]"
        );


      setHistory(
        Array.isArray(savedHistory)
          ? savedHistory
          : []
      );

    };


    // Load immediately
    loadDashboardData();


    // Refresh when the user comes back to the dashboard
    window.addEventListener(
      "focus",
      loadDashboardData
    );


    return () => {

      window.removeEventListener(
        "focus",
        loadDashboardData
      );

    };

  }, []);


  // ============================================================
  // TOTAL SCANS
  // ============================================================

  const totalScans =
    history.length;


  // ============================================================
  // NORMAL CASES
  // ============================================================

  const normalCases =
    history.filter(
      (item) =>
        item.prediction === "Normal"
    ).length;


  // ============================================================
  // PNEUMONIA CASES
  // ============================================================

  const pneumoniaCases =
    history.filter(
      (item) =>
        item.prediction === "Pneumonia"
    ).length;


  // ============================================================
  // AVERAGE CONFIDENCE
  // ============================================================

  const averageConfidence =

    totalScans > 0

      ? (
          history.reduce(
            (total, item) =>
              total +
              Number(
                item.confidence || 0
              ),
            0
          ) / totalScans
        ).toFixed(1)

      : "0.0";


  // ============================================================
  // WEEKLY SCAN DATA
  // ============================================================

  const weekData = useMemo(() => {

    const days = [
      "Mon",
      "Tue",
      "Wed",
      "Thu",
      "Fri",
      "Sat",
      "Sun"
    ];


    const counts = [
      0,
      0,
      0,
      0,
      0,
      0,
      0
    ];


    history.forEach((item) => {

      // ------------------------------------------------------
      // GET SCAN DATE
      // ------------------------------------------------------

      if (!item.scan_date) {
        return;
      }


      const scanDate =
        new Date(
          item.scan_date
        );


      // ------------------------------------------------------
      // IGNORE INVALID DATES
      // ------------------------------------------------------

      if (
        Number.isNaN(
          scanDate.getTime()
        )
      ) {
        return;
      }


      // ------------------------------------------------------
      // JAVASCRIPT:
      // Sunday = 0
      // Monday = 1
      // ...
      // Saturday = 6
      // ------------------------------------------------------

      let day =
        scanDate.getDay();


      // Convert:
      // Monday = 0
      // Tuesday = 1
      // ...
      // Sunday = 6

      day =
        day === 0
          ? 6
          : day - 1;


      counts[day]++;

    });


    return counts.map(
      (count, index) => ({
        day: days[index],
        count: count
      })
    );

  }, [history]);


  // ============================================================
  // MAXIMUM BAR VALUE
  // ============================================================

  const max =
    Math.max(
      ...weekData.map(
        (item) => item.count
      ),
      1
    );


  // ============================================================
  // RECENT SCANS
  // ============================================================

  const recent =
    history.slice(
      0,
      5
    );


  // ============================================================
  // RETURN
  // ============================================================

  return (
    <>
      <style>{`

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-family: 'Poppins', sans-serif;
        }


        body {
          background: #04184D;
        }


        .page {
          min-height: 100vh;
          background:
            linear-gradient(
              135deg,
              #04184D,
              #0B2A72
            );
        }


        .container {
          padding: 28px;
          max-width: 1400px;
          margin: auto;
        }


        /* =====================================================
           HERO
        ===================================================== */

        .hero {
          background: #EAF2FF;
          border-radius: 22px;
          padding: 26px 30px;
          margin-bottom: 28px;
        }


        .hero h1 {
          font-size: 42px;
          font-weight: 300;
          color: #111827;
        }


        .hero p {
          color: #64748B;
          margin-top: 8px;
          font-size: 17px;
        }


        /* =====================================================
           STAT CARDS
        ===================================================== */

        .stats {
          display: grid;
          grid-template-columns:
            repeat(4, 1fr);
          gap: 18px;
          margin-bottom: 26px;
        }


        .card {
          background: #EAF2FF;
          border-radius: 20px;
          padding: 22px;
          transition: 0.25s;
        }


        .card:hover {
          transform:
            translateY(-4px);
        }


        .icon {
          font-size: 30px;
        }


        .value {
          font-size: 34px;
          color: #2563EB;
          margin-top: 12px;
          font-weight: 300;
        }


        .label {
          color: #64748B;
          margin-top: 6px;
        }


        /* =====================================================
           MAIN GRID
        ===================================================== */

        .grid {
          display: grid;
          grid-template-columns:
            1.6fr 1fr;
          gap: 20px;
        }


        .panel {
          background: #EAF2FF;
          border-radius: 22px;
          padding: 22px;
        }


        .title {
          font-size: 22px;
          color: #111827 !important;
          font-weight: 300 !important;
          margin-bottom: 18px;
        }


        /* =====================================================
           WEEKLY CHART
        ===================================================== */

        .bars {
          height: 230px;
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          padding: 10px 10px 0;
          border-bottom:
            2px solid #CBD5E1;
        }


        .barWrap {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
        }


        .bar {
          width: 34px;
          border-radius:
            12px 12px 4px 4px;

          background:
            linear-gradient(
              180deg,
              #38BDF8,
              #2563EB
            );

          min-height: 4px;

          transition:
            height 0.4s ease;
        }


        .count {
          font-size: 12px;
          color: #64748B;
          margin-bottom: 6px;
        }


        .day {
          margin-top: 10px;
          font-size: 13px;
          color: #64748B;
        }


        /* =====================================================
           RECENT ACTIVITY
        ===================================================== */

        .activity {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 0;
          border-bottom:
            1px solid #D9E6FF;
        }


        .activity:last-child {
          border-bottom: none;
        }


        .left {
          display: flex;
          align-items: center;
          gap: 12px;
        }


        .avatar {
          width: 46px;
          height: 46px;
          border-radius: 50%;

          background: #2563EB;

          color: white;

          display: flex;
          justify-content: center;
          align-items: center;

          font-weight: 500;
        }


        .name {
          color: #111827;
          font-weight: 500;
        }


        .time {
          color: #64748B;
          font-size: 13px;
          margin-top: 3px;
        }


        .status {
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 13px;
          color: white;
        }


        .normal {
          background: #16A34A;
        }


        .alert {
          background: #DC2626;
        }


        .empty {
          text-align: center;
          color: #64748B;
          padding: 40px 0;
        }


        /* =====================================================
           RESPONSIVE
        ===================================================== */

        @media(max-width: 900px) {

          .stats {
            grid-template-columns:
              repeat(2, 1fr);
          }


          .grid {
            grid-template-columns:
              1fr;
          }

        }


        @media(max-width: 600px) {

          .stats {
            grid-template-columns:
              1fr;
          }


          .hero h1 {
            font-size: 30px;
          }


          .container {
            padding: 16px;
          }

        }

      `}</style>


      <div className="page">

        <Navbar />


        <div className="container">


          {/* ==================================================
              HERO
          ================================================== */}

          <div className="hero">

            <h1>
              Welcome back, Dr. {doctorName}
            </h1>

            <p>
              Real-Time AI Medical Analytics Dashboard
            </p>

          </div>


          {/* ==================================================
              STATISTICS
          ================================================== */}

          <div className="stats">


            {/* TOTAL SCANS */}

            <div className="card">

              <div className="icon">
                🩺
              </div>

              <div className="value">
                {totalScans}
              </div>

              <div className="label">
                Total Scans
              </div>

            </div>


            {/* NORMAL */}

            <div className="card">

              <div className="icon">
                ✅
              </div>

              <div className="value">
                {normalCases}
              </div>

              <div className="label">
                Normal Cases
              </div>

            </div>


            {/* PNEUMONIA */}

            <div className="card">

              <div className="icon">
                ⚠️
              </div>

              <div className="value">
                {pneumoniaCases}
              </div>

              <div className="label">
                Pneumonia Alerts
              </div>

            </div>


            {/* AVERAGE CONFIDENCE */}

            <div className="card">

              <div className="icon">
                🎯
              </div>

              <div className="value">
                {averageConfidence}%
              </div>

              <div className="label">
                Avg. AI Confidence
              </div>

            </div>


          </div>


          {/* ==================================================
              LOWER GRID
          ================================================== */}

          <div className="grid">


            {/* =================================================
                WEEKLY ANALYTICS
            ================================================= */}

            <div className="panel">

              <div className="title">
                Weekly Scan Analytics
              </div>


              <div className="bars">

                {weekData.map(
                  (item, index) => (

                    <div
                      className="barWrap"
                      key={index}
                    >

                      <div className="count">
                        {item.count}
                      </div>


                      <div
                        className="bar"
                        style={{
                          height:
                            item.count === 0
                              ? "4px"
                              : `${
                                  (item.count / max) *
                                  170 +
                                  12
                                }px`
                        }}
                      >
                      </div>


                      <div className="day">
                        {item.day}
                      </div>

                    </div>

                  )
                )}

              </div>

            </div>


            {/* =================================================
                RECENT PATIENTS
            ================================================= */}

            <div className="panel">

              <div className="title">
                Recent Patients
              </div>


              {recent.length === 0 ? (

                <div className="empty">
                  No patient scans yet
                </div>

              ) : (

                recent.map(
                  (item, index) => (

                    <div
                      className="activity"
                      key={
                        item.scan_date ||
                        index
                      }
                    >


                      <div className="left">


                        <div className="avatar">

                          {(
                            item.patient_name ||
                            "P"
                          )
                            .charAt(0)
                            .toUpperCase()}

                        </div>


                        <div>

                          <div className="name">

                            {item.patient_name ||
                              "Unknown Patient"}

                          </div>


                          <div className="time">

                            {item.age} yrs
                            {" • "}
                            {item.gender}

                          </div>


                          {item.scan_date && (

                            <div className="time">

                              {item.scan_date}

                            </div>

                          )}

                        </div>

                      </div>


                      <span
                        className={
                          `status ${
                            item.prediction ===
                            "Normal"
                              ? "normal"
                              : "alert"
                          }`
                        }
                      >

                        {item.prediction}

                      </span>


                    </div>
                  )
                )

              )}

            </div>


          </div>


        </div>

      </div>
    </>
  );
}