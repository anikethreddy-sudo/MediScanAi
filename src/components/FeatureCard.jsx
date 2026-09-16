import { Brain, Eye, FileText } from "lucide-react";

function FeatureCard() {
  const features = [
    {
      icon: <Brain size={32} className="text-blue-600" />,
      title: "AI Diagnosis",
      desc: "Predict diseases using deep learning models.",
    },
    {
      icon: <Eye size={32} className="text-green-600" />,
      title: "Heatmap Explainability",
      desc: "Visualize the infected region using Grad-CAM.",
    },
    {
      icon: <FileText size={32} className="text-purple-600" />,
      title: "PDF Reports",
      desc: "Generate downloadable medical reports instantly.",
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-8 pb-20">
      <h2 className="text-3xl font-bold text-center mb-10">
        Why MediScan AI?
      </h2>

      <div className="grid md:grid-cols-3 gap-6">
        {features.map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition"
          >
            {item.icon}
            <h3 className="text-xl font-semibold mt-4">{item.title}</h3>
            <p className="text-gray-600 mt-2">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default FeatureCard;