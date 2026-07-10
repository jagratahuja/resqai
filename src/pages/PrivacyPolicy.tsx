import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-ink-950 text-slate-200 font-sans selection:bg-accent/30 selection:text-accent p-8 md:p-16">
      <div className="max-w-3xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-accent hover:text-white transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
        <h1 className="text-4xl font-bold text-white mb-8">Privacy Policy</h1>
        <div className="space-y-6 text-slate-400 leading-relaxed">
          <p>Last updated: July 2026</p>
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">1. Information We Collect</h2>
            <p>We collect information you provide directly to us when using the RESQAI platform, including telemetry data, simulated incident reports, and resource allocation preferences.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">2. How We Use Your Information</h2>
            <p>We use the information to provide, maintain, and improve our emergency response prediction models and optimization algorithms. Your data helps train the AI to make better recommendations.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">3. Data Security</h2>
            <p>We implement appropriate technical and organizational measures to protect the security of your personal information and mission-critical data.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
