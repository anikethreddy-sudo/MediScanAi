
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
        "The confidence scoring and explainable AI make this platform useful for reviewing model predictions."
    },
    {
      name: "Dr. Emily Carter",
      role: "Pulmonologist",
      hospital: "CARE Hospitals",
      avatar: "👩🏼‍⚕️",
      review:
        "A combination of clear visual explanations and practical medical reporting."
    }
  ];

  return (
    <>
      <style>{`
        .trust-section {
          margin-top: 90px;
          color: #17251e;
        }

        .trust-top {
          text-align: center;
          margin-bottom: 45px;
        }

        .trust-tag {
          color: #34734d;
          letter-spacing: 3px;
          font-size: 13px;
          font-weight: 600;
        }

        .trust-title {
          font-size: 42px;
          font-weight: 500;
          color: #17251e;
          margin: 12px 0;
        }

        .trust-sub {
          max-width: 680px;
          margin: auto;
          color: #627268;
          font-size: 16px;
          line-height: 1.8;
        }

        .trust-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 22px;
        }

        .trust-card {
          background: #ffffff;
          border: 1px solid #e3ebe5;
          border-radius: 18px;
          padding: 28px;
          transition: .3s ease;
          box-shadow: 0 8px 25px rgba(25, 61, 42, .04);
        }

        .trust-card:hover {
          transform: translateY(-7px);
          box-shadow: 0 16px 35px rgba(25, 61, 42, .10);
          border-color: #b8d2bf;
        }

        .trust-avatar {
          width: 72px;
          height: 72px;
          border-radius: 50%;
          background: #edf5ef;
          border: 1px solid #dce9df;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 36px;
          margin-bottom: 18px;
        }

        .trust-name {
          font-size: 20px;
          font-weight: 500;
          color: #193d2a;
        }

        .trust-role {
          color: #34734d;
          font-size: 13px;
          margin: 7px 0 16px;
        }

        .trust-review {
          color: #627268;
          font-size: 14px;
          line-height: 1.8;
        }

        .trust-logos {
          margin-top: 40px;
          display: flex;
          justify-content: space-around;
          align-items: center;
          flex-wrap: wrap;
          gap: 20px;
          background: #edf5ef;
          border: 1px solid #e0eae2;
          border-radius: 18px;
          padding: 25px;
        }

        .trust-logo {
          color: #193d2a;
          font-size: 20px;
          font-weight: 600;
          letter-spacing: .5px;
        }

        @media(max-width: 900px) {
          .trust-grid {
            grid-template-columns: 1fr;
          }

          .trust-title {
            font-size: 34px;
          }
        }
      `}</style>

      <section className="trust-section">
        <div className="trust-top">
          <div className="trust-tag">TRUSTED BY DOCTORS</div>

          <h2 className="trust-title">
            Built for modern healthcare
          </h2>

          <p className="trust-sub">
            Designed to support healthcare professionals with
            explainable artificial intelligence, prediction confidence
            and clear medical reporting.
          </p>
        </div>

        <div className="trust-grid">
          {doctors.map((doc) => (
            <div className="trust-card" key={doc.name}>
              <div className="trust-avatar">{doc.avatar}</div>
              <div className="trust-name">{doc.name}</div>
              <div className="trust-role">
                {doc.role} • {doc.hospital}
              </div>
              <div className="trust-review">
                “{doc.review}”
              </div>
            </div>
          ))}
        </div>

        <div className="trust-logos">
          <div className="trust-logo">Apollo</div>
          <div className="trust-logo">AIIMS</div>
          <div className="trust-logo">CARE</div>
          <div className="trust-logo">KIMS</div>
          <div className="trust-logo">Yashoda</div>
        </div>
      </section>
    </>
  );
}
