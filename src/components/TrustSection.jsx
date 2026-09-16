export default function TrustSection() {
  const doctors = [
    {
      name: "Dr. Sarah Wilson",
      role: "Senior Radiologist",
      hospital: "Apollo Hospitals",
      avatar: "👩🏻‍⚕️",
      review:
        "MediScan AI provides remarkably clear heatmap visualization for faster preliminary screening."
    },
    {
      name: "Dr. Arjun Mehta",
      role: "Chest Specialist",
      hospital: "AIIMS Delhi",
      avatar: "👨🏻‍⚕️",
      review:
        "The confidence scoring and explainable AI make this platform extremely useful in clinical workflows."
    },
    {
      name: "Dr. Emily Carter",
      role: "Pulmonologist",
      hospital: "CARE Hospitals",
      avatar: "👩🏼‍⚕️",
      review:
        "A beautiful combination of premium UI and practical medical reporting for hospitals."
    }
  ];

  return (
    <>
      <style>{`
      .trust{margin-top:90px;}
      .trustTop{text-align:center;margin-bottom:45px;}
      .tag{color:#7DD3FC;letter-spacing:3px;font-size:14px;font-weight:300;}
      .title{font-size:46px;font-weight:300;color:white;margin:12px 0;}
      .sub{max-width:680px;margin:auto;color:#C7D7F8;font-size:17px;font-weight:300;line-height:1.8;}

      .grid{display:grid;grid-template-columns:repeat(3,1fr);gap:22px;}

      .card{
        background:#EAF2FF;
        border-radius:24px;
        padding:28px;
        transition:.35s;
      }

      .card:hover{
        transform:translateY(-8px);
        box-shadow:0 18px 35px rgba(37,99,235,.25);
      }

      .avatar{
        width:78px;
        height:78px;
        border-radius:50%;
        background:linear-gradient(135deg,#2563EB,#38BDF8);
        display:flex;
        align-items:center;
        justify-content:center;
        font-size:40px;
        margin-bottom:18px;
      }

      .name{font-size:22px;font-weight:300;color:#0F172A;}
      .role{color:#2563EB;font-size:14px;font-weight:300;margin:6px 0 16px;}
      .review{color:#64748B;font-size:15px;font-weight:300;line-height:1.8;}

      .logos{
        margin-top:40px;
        display:flex;
        justify-content:space-around;
        flex-wrap:wrap;
        gap:18px;
        background:rgba(255,255,255,.08);
        border-radius:22px;
        padding:22px;
      }

      .logo{color:white;font-size:22px;font-weight:300;letter-spacing:1px;opacity:.95;}

      @media(max-width:900px){
        .grid{grid-template-columns:1fr;}
        .title{font-size:36px;}
      }
      `}</style>

      <section className="trust">

        <div className="trustTop">
          <div className="tag">TRUSTED BY DOCTORS</div>
          <h2 className="title">Built for modern healthcare</h2>
          <p className="sub">
            Designed to assist radiologists with explainable artificial intelligence,
            confidence scoring and elegant medical reporting.
          </p>
        </div>

        <div className="grid">
          {doctors.map((doc)=>(
            <div className="card" key={doc.name}>

              <div className="avatar">{doc.avatar}</div>

              <div className="name">{doc.name}</div>

              <div className="role">{doc.role} • {doc.hospital}</div>

              <div className="review">“{doc.review}”</div>

            </div>
          ))}
        </div>

        <div className="logos">
          <div className="logo">Apollo</div>
          <div className="logo">AIIMS</div>
          <div className="logo">CARE</div>
          <div className="logo">KIMS</div>
          <div className="logo">Yashoda</div>
        </div>

      </section>
    </>
  );
}