import { Link } from "react-router-dom";
import {
  ShieldCheck,
  Activity,
  Brain,
  Truck,
  Building2,
  Gauge,
  Radio,
  MapPin,
  ArrowRight,
  Zap,
  Target,
  Network,
  Clock,
  TrendingUp,
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI Impact Prediction",
    desc: "Real-time casualty and damage modeling using incident parameters, occupancy, and environmental signals.",
    accent: "text-accent",
  },
  {
    icon: Truck,
    title: "Resource Optimization",
    desc: "Optimal dispatch of ambulances, fire engines, and rescue teams across available response units.",
    accent: "text-signal-red",
  },
  {
    icon: Gauge,
    title: "Dynamic Risk Scoring",
    desc: "Continuous 0–100 impact scoring with severity-weighted risk classification across five tiers.",
    accent: "text-signal-amber",
  },
  {
    icon: Radio,
    title: "Unified Command Mesh",
    desc: "Connects dispatch, field units, and hospitals through a single operational telemetry layer.",
    accent: "text-signal-blue",
  },
  {
    icon: Network,
    title: "Hospital Triage Routing",
    desc: "Capacity-aware assignment distributes casualties to trauma centers to prevent overload.",
    accent: "text-signal-violet",
  },
  {
    icon: TrendingUp,
    title: "Response Improvement",
    desc: "Benchmark traditional vs. optimized response times across dispatch, routing, and recovery.",
    accent: "text-accent",
  },
];

const workflow = [
  {
    icon: Activity,
    step: "01",
    title: "Incident Ingestion",
    desc: "Emergency signals from 911 dispatch, IoT sensors, and citizen reports are normalized and geo-tagged.",
  },
  {
    icon: Brain,
    step: "02",
    title: "AI Analysis",
    desc: "The ResQAI engine classifies severity, predicts impact radius, and models casualty spread in seconds.",
  },
  {
    icon: Truck,
    step: "03",
    title: "Resource Allocation",
    desc: "An optimal dispatch plan is generated across nearby response units, weighted by ETA and capability.",
  },
  {
    icon: Building2,
    step: "04",
    title: "Hospital Assignment",
    desc: "Triage routing assigns casualties to trauma centers with live capacity verification.",
  },
  {
    icon: ShieldCheck,
    step: "05",
    title: "Response Distribution",
    desc: "The full response plan is distributed to field commanders and EMS coordinators for execution.",
  },
];

const stats = [
  { value: "12s", label: "Avg. analysis time" },
  { value: "63%", label: "Faster dispatch" },
  { value: "5-tier", label: "Risk classification" },
  { value: "24/7", label: "Operational readiness" },
];

export default function LandingPage() {
  return (
    <div className="bg-grid">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="bg-radial-fade absolute inset-0" />
        <div className="relative mx-auto max-w-7xl px-4 pb-20 pt-20 sm:px-6 sm:pt-28 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <span className="chip mx-auto mb-6 border-accent/20 bg-accent/5 text-accent ring-1 ring-accent/20">
              <span className="h-1.5 w-1.5 rounded-full bg-accent animate-blink" />
              AI-Powered Emergency Response System
            </span>
            <h1 className="text-balance text-4xl font-extrabold leading-[1.1] tracking-tight text-slate-50 sm:text-5xl lg:text-6xl">
              When seconds decide lives,
              <br />
              <span className="text-accent">ResQAI</span> decides faster.
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-balance text-base leading-relaxed text-slate-400 sm:text-lg">
              A national-grade emergency response and resource optimization platform. ResQAI predicts
              incident impact using Machine Learning, optimizes dispatch across simultaneous emergencies with Linear Programming, and routes casualties to
              hospitals with capacity-aware triage — all in real time.
            </p>
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link to="/simulator" className="btn-primary w-full sm:w-auto">
                <Zap className="h-4 w-4" />
                Launch Simulation
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a href="#features" className="btn-ghost w-full sm:w-auto">
                <Target className="h-4 w-4" />
                Explore Capabilities
              </a>
            </div>
          </div>

          {/* Stats strip */}
          <div className="mx-auto mt-16 grid max-w-4xl grid-cols-2 gap-px overflow-hidden rounded-xl border border-ink-700 bg-ink-700 sm:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="bg-ink-850 px-4 py-5 text-center">
                <p className="font-mono text-2xl font-bold text-accent sm:text-3xl">{s.value}</p>
                <p className="mt-1 text-xs text-slate-500">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="text-2xl font-bold tracking-tight text-slate-100 sm:text-3xl">
            Built for the worst-case scenario
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-slate-400">
            Every module is engineered to reduce decision latency and maximize resource efficiency
            during high-pressure emergencies.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className="card card-hover group p-5">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-ink-700/60 ring-1 ring-ink-600 transition-colors group-hover:ring-accent/30">
                <f.icon className={`h-5 w-5 ${f.accent}`} />
              </div>
              <h3 className="mb-1.5 text-base font-semibold text-slate-100">{f.title}</h3>
              <p className="text-sm leading-relaxed text-slate-400">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Workflow */}
      <section className="border-t border-ink-800 bg-ink-900/40">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <span className="chip border-accent/20 bg-accent/5 text-accent ring-1 ring-accent/20">
              <Clock className="h-3.5 w-3.5" />
              System Workflow
            </span>
            <h2 className="mt-4 text-2xl font-bold tracking-tight text-slate-100 sm:text-3xl">
              From signal to response in five stages
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-slate-400">
              The ResQAI pipeline transforms raw emergency signals into a fully distributed response plan.
            </p>
          </div>

          <div className="relative grid gap-4 lg:grid-cols-5">
            {workflow.map((w, idx) => (
              <div key={w.step} className="relative">
                <div className="card card-hover h-full p-5">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 ring-1 ring-accent/20">
                      <w.icon className="h-5 w-5 text-accent" />
                    </div>
                    <span className="font-mono text-xs font-semibold text-slate-600">{w.step}</span>
                  </div>
                  <h3 className="mb-1.5 text-sm font-semibold text-slate-100">{w.title}</h3>
                  <p className="text-xs leading-relaxed text-slate-400">{w.desc}</p>
                </div>
                {idx < workflow.length - 1 && (
                  <div className="absolute -right-2 top-1/2 z-10 hidden -translate-y-1/2 lg:block">
                    <ArrowRight className="h-4 w-4 text-slate-700" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl border border-ink-700 bg-ink-850 p-8 text-center sm:p-12">
          <div className="bg-radial-fade absolute inset-0 opacity-60" />
          <div className="relative">
            <MapPin className="mx-auto mb-4 h-8 w-8 text-accent" />
            <h2 className="text-2xl font-bold tracking-tight text-slate-100 sm:text-3xl">
              Ready to run a simulation?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-slate-400">
              Configure an incident scenario and watch ResQAI generate an optimized response plan in real time.
            </p>
            <Link to="/simulator" className="btn-primary mt-7">
              <Zap className="h-4 w-4" />
              Launch Simulation
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
