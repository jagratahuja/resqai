import { Link } from "react-router-dom";
import { ShieldCheck, Activity, Network, Zap, ArrowRight, BrainCircuit, LineChart } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-ink-950 text-slate-200 font-sans selection:bg-accent/30 selection:text-accent flex flex-col">
      {/* Navigation */}
      <nav className="border-b border-white/5 bg-ink-950/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-accent" />
            <span className="font-semibold tracking-tight text-white">RESQAI</span>
          </div>
          <div className="flex items-center gap-6 text-sm font-medium text-slate-400">
            <a href="#features" className="hover:text-white transition-colors">Platform</a>
            <a href="#technology" className="hover:text-white transition-colors">Technology</a>
            <Link to="/simulator" className="text-white hover:text-accent transition-colors">Simulator</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 px-6">
        <div className="relative max-w-5xl mx-auto text-center z-10">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-white mb-6 text-balance">
            Intelligent Emergency Response Coordination
          </h1>
          <p className="text-lg text-slate-400 max-w-3xl mx-auto mb-10 text-balance leading-relaxed">
            RESQAI helps dispatchers allocate emergency resources efficiently, minimizing response times and reducing casualties during critical incidents.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link to="/simulator" className="btn-primary py-3 px-8 text-base">
              Launch Mission Control <ArrowRight className="w-5 h-5" />
            </Link>
            <a href="#technology" className="btn-secondary py-3 px-8 text-base">
              View Architecture
            </a>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section id="features" className="py-20 px-6 border-t border-white/5 bg-ink-900/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">A unified operational platform.</h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg">
              Combining live telemetry, predictive modeling, and resource optimization into a single command center.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={Activity} 
              title="Predictive Modeling" 
              description="Forecast impact severity and casualty rates based on incident type, weather, time, and location." 
            />
            <FeatureCard 
              icon={Network} 
              title="Dynamic Optimization" 
              description="Solve complex resource routing constraints to ensure optimal dispatch of critical units." 
            />
            <FeatureCard 
              icon={Zap} 
              title="Real-time Dispatch" 
              description="A highly optimized front-end visualizes data instantly, ensuring dispatchers have the clarity needed for rapid decisions." 
            />
          </div>
        </div>
      </section>

      {/* Technology Deep Dive */}
      <section id="technology" className="py-20 px-6 border-t border-white/5 flex-1">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div>
              <div className="inline-flex items-center gap-2 text-accent font-semibold mb-4">
                <BrainCircuit className="w-5 h-5" /> Engine Architecture
              </div>
              <h2 className="text-4xl font-bold text-white mb-6">Built for speed and precision.</h2>
              <p className="text-slate-400 text-lg mb-8 leading-relaxed">
                The platform is powered by a robust Python/Flask microservice. It leverages a dataset of 12,500+ simulated historical incidents to train its predictive models.
              </p>
              
              <div className="space-y-6">
                <TechStat label="Model Architecture" value="RandomForestRegressor" />
                <TechStat label="Solver Engine" value="PuLP (CBC MILP Solver)" />
                <TechStat label="Frontend Stack" value="React, TailwindCSS, Framer Motion" />
                <TechStat label="Avg. Inference Latency" value="< 250ms" />
              </div>
            </div>
            
            <div className="relative">
              <div className="card p-8 bg-ink-900 border-white/10 shadow-xl">
                <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
                   <LineChart className="w-5 h-5 text-accent" />
                   <h3 className="text-white font-semibold">Model Performance Metrics</h3>
                </div>
                <div className="space-y-6 font-mono text-sm">
                   <div className="flex justify-between items-center">
                     <span className="text-slate-400">R² Score (Accuracy)</span>
                     <span className="text-accent font-bold">0.892</span>
                   </div>
                   <div className="flex justify-between items-center">
                     <span className="text-slate-400">Root Mean Square Error (RMSE)</span>
                     <span className="text-slate-200">14.2</span>
                   </div>
                   <div className="flex justify-between items-center">
                     <span className="text-slate-400">Mean Absolute Error (MAE)</span>
                     <span className="text-slate-200">9.8</span>
                   </div>
                   <div className="w-full bg-ink-950 h-2 rounded-full overflow-hidden mt-2">
                     <div className="bg-accent h-full w-[89%]" />
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="border-t border-white/5 py-8 px-6 text-center text-slate-500 text-sm bg-ink-950 mt-auto">
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-4">
          <Link to="/terms" className="hover:text-accent transition-colors">Terms of Service</Link>
          <span className="hidden md:inline text-white/20">•</span>
          <Link to="/privacy" className="hover:text-accent transition-colors">Privacy Policy</Link>
        </div>
        <p>RESQAI V1 · Made with ❤️ by Jagrat Ahuja</p>
      </footer>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description }: { icon: React.ComponentType<{ className?: string }>, title: string, description: string }) {
  return (
    <div className="card p-8 bg-ink-950/50">
      <div className="w-12 h-12 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center mb-6">
        <Icon className="w-6 h-6 text-accent" />
      </div>
      <h3 className="text-lg font-semibold text-white mb-3">{title}</h3>
      <p className="text-slate-400 leading-relaxed text-sm">
        {description}
      </p>
    </div>
  );
}

function TechStat({ label, value }: { label: string, value: string }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
      <span className="text-slate-400">{label}</span>
      <span className="text-white font-medium">{value}</span>
    </div>
  );
}
