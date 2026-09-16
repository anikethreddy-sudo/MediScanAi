import { useEffect } from "react";

export default function SplashScreen({ onFinish }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <style>{`
        .splash{
          height:100vh;
          display:flex;
          justify-content:center;
          align-items:center;
          flex-direction:column;
          background:linear-gradient(135deg,#FFF8F6,#FFE9E2);
          overflow:hidden;
        }

        .logo{
          width:120px;
          height:120px;
          border-radius:50%;
          background:white;
          display:flex;
          justify-content:center;
          align-items:center;
          font-size:55px;
          animation:pop 1s ease;
          box-shadow:0 15px 40px rgba(231,111,81,.25);
        }

        @keyframes pop{
          0%{transform:scale(.2) rotate(-180deg);opacity:0}
          100%{transform:scale(1);opacity:1}
        }

        .title{
          margin-top:25px;
          font-size:42px;
          font-weight:bold;
          color:#E76F51;
          animation:fade 1.2s ease;
        }

        .sub{
          color:#6B7280;
          margin-top:8px;
          animation:fade 1.6s ease;
        }

        @keyframes fade{
          from{opacity:0;transform:translateY(20px)}
          to{opacity:1;transform:translateY(0)}
        }

        .loader{
          width:220px;
          height:8px;
          background:#FAD9CF;
          border-radius:20px;
          margin-top:35px;
          overflow:hidden;
        }

        .fill{
          height:100%;
          width:100%;
          background:linear-gradient(90deg,#FF8A7A,#E76F51);
          transform-origin:left;
          animation:load 2.2s linear forwards;
        }

        @keyframes load{
          from{transform:scaleX(0)}
          to{transform:scaleX(1)}
        }

        .pulse{
          position:absolute;
          width:300px;
          height:300px;
          border-radius:50%;
          background:rgba(255,138,122,.15);
          animation:ring 3s infinite;
        }

        @keyframes ring{
          0%{transform:scale(.5);opacity:.8}
          100%{transform:scale(1.6);opacity:0}
        }
      `}</style>

      <div className="splash">
        <div className="pulse"></div>

        <div className="logo">🩺</div>

        <div className="title">MediScan AI</div>

        <div className="sub">
          Intelligent Medical Platform
        </div>

        <div className="loader">
          <div className="fill"></div>
        </div>
      </div>
    </>
  );
}