import { ArrowRight } from "lucide-react";

function Hero() {
  return (
    <section className="max-w-7xl mx-auto px-8 py-20 flex items-center justify-between">

      <div className="max-w-xl">
        <p className="text-blue-600 font-semibold mb-3">
          AI Powered Medical Diagnosis
        </p>

        <h1 className="text-6xl font-bold leading-tight text-slate-900">
          Detect Diseases with Explainable AI
        </h1>

        <p className="text-slate-600 mt-6 text-lg">
          Upload an X-ray or skin image and receive an AI-assisted
          diagnosis, confidence score, and visual heatmap.
        </p>

        <button className="mt-8 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl flex items-center gap-2">
          Start Diagnosis
          <ArrowRight size={18} />
        </button>
      </div>

      <img
        src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600"
        alt="Doctor"
        className="w-[430px] rounded-3xl shadow-2xl"
      />

    </section>
  );
}

export default Hero;