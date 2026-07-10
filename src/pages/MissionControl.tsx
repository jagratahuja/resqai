import { useState, useEffect } from "react";
import {
  Terminal, ShieldCheck, Target, HeartPulse, Clock, Hospital,
  Activity, ArrowRight, BrainCircuit, Database
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import type { IncidentType, WeatherCondition, TimeOfDay, SimulationInput, SimulationResult, ModelMetrics } from "../types";
import { INCIDENT_TYPES, WEATHER_CONDITIONS, TIMES_OF_DAY, SAMPLE_LOCATIONS } from "../data/mockEngine";
import { runSimulation, getModelMetrics } from "../api/simulationApi";

import StatCard from "../components/StatCard";
import SectionCard from "../components/SectionCard";
import RiskBadge from "../components/RiskBadge";
import Timeline from "../components/Timeline";
import ResourceAllocationChart from "../components/charts/ResourceAllocationChart";
import ImpactBreakdownChart from "../components/charts/ImpactBreakdownChart";
import { OptimizationPanel } from "../components/OptimizationPanel";
import { ModelMetricsCard } from "../components/ModelMetricsCard";

type AppState = "IDLE" | "PROCESSING" | "RESULT_SINGLE";

export default function MissionControl() {
  const [appState, setAppState] = useState<AppState>("IDLE");
  const [metrics, setMetrics] = useState<ModelMetrics | undefined>();
  const [currentTime, setCurrentTime] = useState(() => new Date());

  // Single Incident State
  const [incidentType, setIncidentType] = useState<IncidentType>("Fire");
  const [occupancy, setOccupancy] = useState<number>(200);
  const [weather, setWeather] = useState<WeatherCondition>("Clear");
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>("Day");
  const [responseEta, setResponseEta] = useState(8);
  const [severity, setSeverity] = useState(7);
  const [location, setLocation] = useState(SAMPLE_LOCATIONS[0]);
  const [singleResult, setSingleResult] = useState<{ result: SimulationResult, input: SimulationInput } | null>(null);

  useEffect(() => {
    getModelMetrics().then(setMetrics).catch(console.error);
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSimulate = async () => {
    setAppState("PROCESSING");
    try {
      const input: SimulationInput = { incidentType, occupancy, weather, timeOfDay, responseEta, severity, location };
      const result = await runSimulation(input);
      setSingleResult({ result, input });
      setTimeout(() => setAppState("RESULT_SINGLE"), 600); // Fast, purposeful transition
    } catch (e) {
      console.error(e);
      setAppState("IDLE");
    }
  };

  const handleReset = () => {
    setAppState("IDLE");
    setSingleResult(null);
  };

  return (
    <div className="min-h-screen bg-ink-950 text-slate-200 font-sans flex flex-col">
      {/* Top Navigation */}
      <header className="border-b border-white/5 bg-ink-950/80 backdrop-blur-md px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-white">
            <div className="p-1.5 bg-accent/10 rounded-lg border border-accent/20">
              <ShieldCheck className="w-5 h-5 text-accent" />
            </div>
            <span className="font-semibold tracking-tight text-lg">RESQAI</span>
          </div>
          <div className="h-4 w-px bg-white/10" />
          <span className="text-xs font-medium text-slate-500 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500" /> System Operational
          </span>
        </div>
        <div className="flex items-center gap-6 text-sm">
          <div className="text-slate-500 font-medium hidden md:block">
            {currentTime.toLocaleTimeString('en-US', { hour12: false })} UTC
          </div>
        </div>
      </header>

      <main className="flex-1 p-6 max-w-[1600px] w-full mx-auto pb-20">
        <AnimatePresence mode="wait">
          {appState === "IDLE" && (
            <motion.div 
              key="idle"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="w-full max-w-4xl mx-auto pt-10"
            >
              <div className="mb-8">
                <h1 className="text-2xl font-semibold text-white mb-2">Configure Simulation</h1>
                <p className="text-slate-400 text-sm">Set parameters to initialize the ML predictive models and LP optimization engine.</p>
              </div>

              <div className="card p-8 grid md:grid-cols-2 gap-10">
                <div className="space-y-6">
                  <div>
                    <label className="label-text">Incident Type</label>
                    <select value={incidentType} onChange={e => setIncidentType(e.target.value as IncidentType)} className="input-field">
                      {INCIDENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="label-text">Location Designation</label>
                    <select value={location} onChange={e => setLocation(e.target.value)} className="input-field">
                      {SAMPLE_LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="label-text">Weather</label>
                      <select value={weather} onChange={e => setWeather(e.target.value as WeatherCondition)} className="input-field">
                        {WEATHER_CONDITIONS.map(w => <option key={w} value={w}>{w}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="label-text">Time</label>
                      <select value={timeOfDay} onChange={e => setTimeOfDay(e.target.value as TimeOfDay)} className="input-field">
                        {TIMES_OF_DAY.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <label className="label-text flex justify-between">
                      <span>Severity Index</span>
                      <span className="text-white font-semibold">{severity}/10</span>
                    </label>
                    <input type="range" min="1" max="10" value={severity} onChange={e => setSeverity(Number(e.target.value))} className="w-full accent-accent" />
                  </div>
                  <div>
                    <label className="label-text flex justify-between">
                      <span>Est. Occupancy</span>
                      <span className="text-white font-semibold">{occupancy}</span>
                    </label>
                    <input type="range" min="10" max="2000" step="10" value={occupancy} onChange={e => setOccupancy(Number(e.target.value))} className="w-full accent-accent" />
                  </div>
                  <div>
                    <label className="label-text flex justify-between">
                      <span>Response ETA (Min)</span>
                      <span className="text-white font-semibold">{responseEta}</span>
                    </label>
                    <input type="range" min="1" max="30" value={responseEta} onChange={e => setResponseEta(Number(e.target.value))} className="w-full accent-accent" />
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <button onClick={handleSimulate} className="btn-primary w-full md:w-auto">
                  Run Inference Engine <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {appState === "PROCESSING" && (
            <motion.div 
              key="processing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center pt-32"
            >
              <div className="relative w-16 h-16 mb-8">
                <div className="absolute inset-0 border-4 border-ink-800 rounded-full" />
                <div className="absolute inset-0 border-4 border-accent rounded-full border-t-transparent animate-spin" />
              </div>
              <h2 className="text-xl font-semibold text-white mb-2">Processing Telemetry</h2>
              <div className="text-sm text-slate-400 flex flex-col items-center gap-1 font-mono">
                <span className="flex items-center gap-2"><Database className="w-3 h-3 text-accent" /> Fetching real-time inputs</span>
                <span className="flex items-center gap-2"><BrainCircuit className="w-3 h-3 text-accent" /> Running ML Inference...</span>
                <span className="flex items-center gap-2"><Activity className="w-3 h-3 text-accent" /> Solving Optimization Matrix...</span>
              </div>
            </motion.div>
          )}

          {appState === "RESULT_SINGLE" && singleResult && (
            <motion.div 
              key="result_single"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full flex flex-col gap-6"
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-white/5 pb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <RiskBadge level={singleResult.result.riskLevel} size="md" />
                    <span className="text-2xl font-bold tracking-tight text-white">{singleResult.input.incidentType} / {singleResult.input.location}</span>
                  </div>
                  <span className="text-xs font-medium text-slate-500 font-mono">ID: {singleResult.result.incidentId} • ENGINE: ACTIVE</span>
                </div>
                <button onClick={handleReset} className="btn-secondary py-2 mt-4 md:mt-0 text-xs">
                  New Operation
                </button>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard label="Impact Score" value={Math.ceil(singleResult.result.impactScore)} unit="/100" icon={Activity} accent="accent" sublabel="ML Prediction" />
                <StatCard label="Est. Casualties" value={singleResult.result.estimatedInjured} icon={HeartPulse} accent="red" sublabel={`${singleResult.result.estimatedFatalities} Critical`} />
                <StatCard label="Hosp. Load" value={singleResult.result.hospitalCapacityUsed} unit="%" icon={Hospital} accent="blue" sublabel="Regional Avg" />
                <StatCard label="Containment" value={singleResult.result.estimatedContainmentTime} icon={Clock} accent="amber" sublabel="Projected Hours" />
              </div>

              <div className="grid lg:grid-cols-4 gap-6">
                <div className="lg:col-span-3 flex flex-col gap-6">
                  <SectionCard title="Resource Allocation Matrix" subtitle="Live dispatch vs required assets" icon={Target} className="flex-1 min-h-[300px]">
                     <ResourceAllocationChart data={singleResult.result.resourceAllocation} />
                  </SectionCard>
                  <div className="grid md:grid-cols-2 gap-6 h-64">
                    <SectionCard title="Operational Timeline" subtitle="Projected sequence of events" icon={Terminal} className="overflow-y-auto custom-scrollbar">
                       <Timeline events={singleResult.result.timeline} />
                    </SectionCard>
                    <SectionCard title="Impact Drivers" subtitle="AI feature importance weight" icon={BrainCircuit}>
                       <ImpactBreakdownChart data={singleResult.result.impactBreakdown} />
                    </SectionCard>
                  </div>
                </div>
                
                {/* Engineering Telemetry Sidebar */}
                <div className="flex flex-col gap-6">
                  <OptimizationPanel result={singleResult.result.optimizationResult} />
                  <ModelMetricsCard metrics={metrics} />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
