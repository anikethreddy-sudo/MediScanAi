import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const doctor = localStorage.getItem("doctorName") || "Doctor";

  const logout = () => {
    localStorage.removeItem("doctorName");
    localStorage.removeItem("doctorId");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("result");
    navigate("/login");
  };

  const active = (path) =>
    location.pathname === path ? "active link" : "link";

  return (
    <>
      <style>{`
      .nav{
        height:78px;
        background:rgba(4,24,77,.95);
        backdrop-filter:blur(12px);
        display:flex;
        justify-content:space-between;
        align-items:center;
        padding:0 40px;
        position:sticky;
        top:0;
        z-index:1000;
        border-bottom:1px solid rgba(255,255,255,.08);
      }

      .brand{
        display:flex;
        align-items:center;
        gap:12px;
        text-decoration:none;
      }

      .logo{
        width:46px;
        height:46px;
        border-radius:50%;
        background:linear-gradient(135deg,#38BDF8,#2563EB);
        display:flex;
        justify-content:center;
        align-items:center;
        color:white;
        font-size:24px;
      }

      .title{
        color:white;
        font-size:22px;
        font-weight:600;
      }

      .menu{
        display:flex;
        align-items:center;
        gap:12px;
      }

      .link{
        color:#D6E5FF;
        text-decoration:none;
        padding:10px 16px;
        border-radius:10px;
        font-size:15px;
        transition:.25s;
      }

      .link:hover{
        background:rgba(255,255,255,.08);
        color:white;
      }

      .active{
        background:#2563EB;
        color:white;
      }

      .right{
        display:flex;
        align-items:center;
        gap:14px;
      }

      .doctor{
        color:white;
        font-size:14px;
        background:rgba(255,255,255,.08);
        padding:8px 14px;
        border-radius:25px;
      }

      .logout{
        border:none;
        background:#EF4444;
        color:white;
        padding:10px 18px;
        border-radius:10px;
        cursor:pointer;
        font-weight:600;
      }

      .logout:hover{
        background:#DC2626;
      }

      @media(max-width:900px){
        .nav{
          flex-direction:column;
          height:auto;
          padding:18px;
          gap:16px;
        }

        .menu{
          flex-wrap:wrap;
          justify-content:center;
        }

        .right{
          flex-direction:column;
          width:100%;
        }

        .doctor{
          width:100%;
          text-align:center;
        }

        .logout{
          width:100%;
        }
      }
      `}</style>

      <nav className="nav">
        <Link to="/dashboard" className="brand">
          <div className="logo">🩺</div>
          <div className="title">MediScan AI</div>
        </Link>

        <div className="menu">
          <Link className={active("/dashboard")} to="/dashboard">
            Dashboard
          </Link>

          <Link className={active("/upload")} to="/upload">
            Upload
          </Link>

          <Link className={active("/history")} to="/history">
            History
          </Link>

          <Link className={active("/results")} to="/results">
            Results
          </Link>
        </div>

        <div className="right">
          <div className="doctor">👨‍⚕️ Dr. {doctor}</div>

          <button className="logout" onClick={logout}>
            Logout
          </button>
        </div>
      </nav>
    </>
  );
}