import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Activity,
  LayoutDashboard,
  UploadCloud,
  History,
  FileText,
  LogOut,
  Menu,
  X
} from "lucide-react";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const doctor = localStorage.getItem("doctorName") || "Doctor";

  const links = [
    { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { label: "Upload scan", path: "/upload", icon: UploadCloud },
    { label: "History", path: "/history", icon: History },
    { label: "Results", path: "/results", icon: FileText }
  ];

  const logout = () => {
    localStorage.removeItem("doctorName");
    localStorage.removeItem("doctorId");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("result");
    localStorage.removeItem("currentDoctorKey");
    navigate("/login");
  };

  return (
    <>
      <style>{`
        .ms-navbar {
          position: sticky;
          top: 0;
          z-index: 1000;
          min-height: 76px;
          padding: 0 5%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          background: rgba(255,255,255,.97);
          backdrop-filter: blur(16px);
          border-bottom: 1px solid #DCECE1;
          box-shadow: 0 3px 16px rgba(25,90,57,.05);
        }

        .ms-brand {
          display: flex;
          align-items: center;
          gap: 11px;
          flex-shrink: 0;
          text-decoration: none;
        }

        .ms-logo {
          width: 42px;
          height: 42px;
          display: grid;
          place-items: center;
          border-radius: 14px;
          color: #fff;
          background: linear-gradient(145deg,#159768,#08734D);
          box-shadow: 0 5px 13px rgba(19,134,91,.20);
        }

        .ms-brand-name {
          color: #183C30;
          font-size: 19px;
          font-weight: 800;
          letter-spacing: -.7px;
        }

        .ms-brand-name span {
          color: #13865B;
        }

        .ms-menu {
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .ms-link {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 11px 13px;
          border-radius: 11px;
          color: #536F61;
          font-size: 12px;
          font-weight: 500;
          text-decoration: none;
          transition: .2s ease;
        }

        .ms-link:hover {
          color: #096B47;
          background: #E8F5EC;
        }

        .ms-link-active {
          color: #096B47;
          background: #DDF1E4;
          font-weight: 700;
        }

        .ms-account {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .ms-doctor-avatar {
          width: 36px;
          height: 36px;
          display: grid;
          place-items: center;
          border-radius: 50%;
          background: #DDF1E4;
          color: #096B47;
          font-size: 13px;
          font-weight: 700;
          border: 1px solid #C8E5D2;
        }

        .ms-doctor {
          color: #294C3D;
          font-size: 12px;
          font-weight: 500;
          white-space: nowrap;
        }

        .ms-logout {
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 10px 13px;
          border: 1px solid #BBDCC8;
          border-radius: 10px;
          background: #F2FAF4;
          color: #096B47;
          font-size: 11px;
          font-weight: 700;
          transition: .2s;
          cursor: pointer;
        }

        .ms-logout:hover {
          background: #DDF1E4;
          border-color: #13865B;
        }

        .ms-mobile-toggle {
          display: none;
          width: 40px;
          height: 40px;
          place-items: center;
          border: 1px solid #DCECE1;
          border-radius: 11px;
          background: #F2FAF4;
          color: #096B47;
          cursor: pointer;
        }

        @media(max-width: 900px) {
          .ms-navbar {
            flex-wrap: wrap;
            padding: 13px 20px;
            gap: 12px;
          }

          .ms-mobile-toggle {
            display: grid;
          }

          .ms-menu {
            display: none;
            order: 4;
            width: 100%;
            flex-direction: column;
            align-items: stretch;
            padding: 8px 0;
          }

          .ms-menu.ms-menu-open {
            display: flex;
          }

          .ms-link {
            padding: 13px;
          }

          .ms-account {
            margin-left: auto;
          }
        }

        @media(max-width: 480px) {
          .ms-navbar {
            padding: 12px 14px;
          }

          .ms-brand-name {
            font-size: 16px;
          }

          .ms-doctor {
            display: none;
          }

          .ms-logout {
            padding: 9px;
          }
        }
      `}</style>

      <nav className="ms-navbar">
        <Link
          to="/dashboard"
          className="ms-brand"
          onClick={() => setMobileOpen(false)}
        >
          <div className="ms-logo">
            <Activity size={23} strokeWidth={2.5} />
          </div>
          <span className="ms-brand-name">
            MediScan <span>AI</span>
          </span>
        </Link>

        <div className={`ms-menu ${mobileOpen ? "ms-menu-open" : ""}`}>
          {links.map((link) => {
            const Icon = link.icon;
            const active = location.pathname === link.path;

            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileOpen(false)}
                className={active ? "ms-link ms-link-active" : "ms-link"}
              >
                <Icon size={16} />
                {link.label}
              </Link>
            );
          })}
        </div>

        <div className="ms-account">
          <div className="ms-doctor-avatar">
            {doctor.trim().charAt(0).toUpperCase()}
          </div>
          <span className="ms-doctor">Dr. {doctor}</span>

          <button className="ms-logout" onClick={logout}>
            <LogOut size={15} />
            Logout
          </button>

          <button
            className="ms-mobile-toggle"
            onClick={() => setMobileOpen((open) => !open)}
            aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>
    </>
  );
}
