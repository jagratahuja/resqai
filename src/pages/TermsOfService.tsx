import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-ink-950 text-slate-200 font-sans selection:bg-accent/30 selection:text-accent p-8 md:p-16">
      <div className="max-w-3xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-accent hover:text-white transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
        <h1 className="text-4xl font-bold text-white mb-8">Terms of Service</h1>
        <div className="space-y-6 text-slate-400 leading-relaxed">
          <p>Last updated: July 2026</p>
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">1. Acceptance of Terms</h2>
            <p>By accessing and using RESQAI, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access the service.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">2. Description of Service</h2>
            <p>RESQAI provides an AI-powered emergency response coordination platform. The predictions and optimizations provided are for informational and coordination purposes only and should not replace human judgment in life-or-death situations.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">3. Usage Restrictions</h2>
            <p>You agree not to use the service for any unlawful purpose or in any way that could interrupt, damage, or impair the service.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
