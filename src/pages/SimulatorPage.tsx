import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Flame,
  Building,
  Waves,
  Car,
  Factory,
  Users,
  CloudRain,
  Sun,
  Clock,
  Timer,
  Gauge,
  MapPin,
  Zap,
  Network,
  Activity
} from "lucide-react";
import type {
  IncidentType,
  WeatherCondition,
  TimeOfDay,
  SimulationInput,
} from "../types";
import {
  INCIDENT_TYPES,
  WEATHER_CONDITIONS,
  TIMES_OF_DAY,
  SAMPLE_LOCATIONS,
} from "../data/mockEngine";
import { runSimulation, runMultiIncidentSimulation } from "../api/simulationApi";
import LoadingOverlay from "../components/LoadingOverlay";
import ErrorState from "../components/ErrorState";

const INCIDENT_ICONS: Record<IncidentType, typeof Flame> = {
  "Fire": Flame,
  "Building Collapse": Building,
  "Flood": Waves,
  "Road Accident": Car,
  "Chemical Leak": Factory,
};

const WEATHER_ICONS: Record<WeatherCondition, typeof CloudRain> = {
  Clear: Sun,
  Rain: CloudRain,
  Storm: CloudRain,
  Fog: CloudRain,
  Snow: CloudRain,
  Heatwave: Sun,
};

const TIME_ICONS: Record<TimeOfDay, typeof Sun> = {
  Dawn: Sun,
  Day: Sun,
  Dusk: Sun,
  Night: Clock,
};



export default function SimulatorPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [simulationMode, setSimulationMode] = useState<"single" | "multi">("single");
  const [multiCount, setMultiCount] = useState(4);

  const [incidentType, setIncidentType] = useState<IncidentType>("Fire");
  const [occupancy, setOccupancy] = useState<number>(200);
  const [weather, setWeather] = useState<WeatherCondition>("Clear");
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>("Day");
  const [responseEta, setResponseEta] = useState(8);
  const [severity, setSeverity] = useState(7);
  const [location, setLocation] = useState(SAMPLE_LOCATIONS[0]);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      if (simulationMode === "single") {
        const input: SimulationInput = {
          incidentType,
          occupancy,
          weather,
          timeOfDay,
          responseEta,
          severity,
          location,
        };
        const result = await runSimulation(input);
        navigate("/dashboard", { state: { result, input, mode: "single" } });
      } else {
        const multiResult = await runMultiIncidentSimulation(multiCount);
        navigate("/dashboard", { state: { multiResult, mode: "multi" } });
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "API connection failed. Please ensure the backend is running.");
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <LoadingOverlay message="Running AI simulation engine..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <ErrorState message={error} onRetry={() => setError(null)} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="chip border-accent/20 bg-accent/5 text-accent ring-1 ring-accent/20">
              <Zap className="h-3.5 w-3.5" />
              Scenario Configuration
            </span>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-100">Emergency Simulator</h1>
            <p className="mt-2 max-w-2xl text-slate-400">
              Define an incident scenario. ResQAI will predict impact, classify risk, and generate an
              optimized resource dispatch plan.
            </p>
          </div>
          
          <div className="flex bg-ink-900/50 p-1 rounded-lg border border-ink-700 w-fit">
            <button 
              onClick={() => setSimulationMode("single")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${simulationMode === 'single' ? 'bg-ink-800 text-slate-100 shadow-card' : 'text-slate-400 hover:text-slate-200'}`}
            >
              <Activity className="w-4 h-4" />
              Single Incident
            </button>
            <button 
              onClick={() => setSimulationMode("multi")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${simulationMode === 'multi' ? 'bg-ink-800 text-slate-100 shadow-card border border-accent/20' : 'text-slate-400 hover:text-slate-200'}`}
            >
              <Network className="w-4 h-4 text-accent" />
              Multi-Incident AI Optimization
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {simulationMode === "multi" ? (
           <div className="lg:col-span-2 space-y-5">
             <div className="card p-8 animate-fade-in text-center flex flex-col items-center justify-center border-accent/20 bg-accent/5">
                <Network className="w-16 h-16 text-accent mb-6" />
                <h2 className="text-2xl font-bold text-slate-100 mb-4">Multi-Incident Optimization Engine</h2>
                <p className="text-slate-400 max-w-lg mb-8 leading-relaxed">
                  The true power of ResQAI lies in handling simultaneous emergencies with limited resources. 
                  This mode will generate random concurrent incidents and use Linear Programming to optimally 
                  distribute available dispatch units globally.
                </p>
                
                <div className="flex flex-col items-center gap-4 w-full max-w-xs">
                  <label className="text-sm font-semibold text-slate-200">Number of Concurrent Incidents</label>
                  <div className="flex items-center gap-4 w-full">
                    <span className="font-mono text-sm text-slate-400">2</span>
                    <input 
                      type="range" min="2" max="8" step="1" 
                      value={multiCount} 
                      onChange={(e) => setMultiCount(Number(e.target.value))}
                      className="h-2 flex-1 cursor-pointer appearance-none rounded-full bg-ink-700 accent-accent"
                    />
                    <span className="font-mono text-sm text-slate-400">8</span>
                  </div>
                  <div className="text-3xl font-mono font-bold text-accent mt-2">{multiCount}</div>
                </div>
             </div>
           </div>
        ) : (
        <>
        {/* Left: form */}
        <div className="space-y-5 lg:col-span-2">
          {/* Incident type */}
          <div className="card p-5 animate-fade-in">
            <label className="label-text">Incident Type</label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {INCIDENT_TYPES.map((t) => {
                const Icon = INCIDENT_ICONS[t];
                const active = incidentType === t;
                return (
                  <button
                    key={t}
                    onClick={() => setIncidentType(t)}
                    className={`flex items-center gap-2.5 rounded-lg border px-3 py-2.5 text-left text-sm font-medium transition-all ${
                      active
                        ? "border-accent/40 bg-accent/10 text-accent ring-1 ring-accent/20"
                        : "border-ink-600 bg-ink-900/40 text-slate-300 hover:border-ink-500 hover:bg-ink-800"
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span className="text-xs leading-tight">{t}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Occupancy + Weather + Time */}
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="card p-5 animate-fade-in">
              <label className="label-text flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5" /> Occupancy Level
              </label>
              <div className="mt-4 flex items-center gap-3">
                <input
                  type="range"
                  min={10}
                  max={2000}
                  step={10}
                  value={occupancy}
                  onChange={(e) => setOccupancy(Number(e.target.value))}
                  className="h-1.5 flex-1 cursor-pointer appearance-none rounded-full bg-ink-700 accent-accent"
                />
                <span className="w-16 text-right font-mono text-sm font-semibold text-accent">
                  {occupancy}
                </span>
              </div>
            </div>

            <div className="card p-5 animate-fade-in">
              <label className="label-text flex items-center gap-1.5">
                <CloudRain className="h-3.5 w-3.5" /> Weather Condition
              </label>
              <div className="grid grid-cols-3 gap-2">
                {WEATHER_CONDITIONS.map((w) => {
                  const Icon = WEATHER_ICONS[w];
                  const active = weather === w;
                  return (
                    <button
                      key={w}
                      onClick={() => setWeather(w)}
                      className={`flex flex-col items-center gap-1 rounded-lg border px-2 py-2.5 text-xs font-medium transition-all ${
                        active
                          ? "border-signal-blue/40 bg-signal-blue/10 text-signal-blue ring-1 ring-signal-blue/20"
                          : "border-ink-600 bg-ink-900/40 text-slate-400 hover:border-ink-500"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {w}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="card p-5 animate-fade-in">
              <label className="label-text flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" /> Time of Day
              </label>
              <div className="grid grid-cols-4 gap-2">
                {TIMES_OF_DAY.map((t) => {
                  const Icon = TIME_ICONS[t];
                  const active = timeOfDay === t;
                  return (
                    <button
                      key={t}
                      onClick={() => setTimeOfDay(t)}
                      className={`flex flex-col items-center gap-1 rounded-lg border px-2 py-2.5 text-xs font-medium transition-all ${
                        active
                          ? "border-signal-violet/40 bg-signal-violet/10 text-signal-violet ring-1 ring-signal-violet/20"
                          : "border-ink-600 bg-ink-900/40 text-slate-400 hover:border-ink-500"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {t}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="card p-5 animate-fade-in">
              <label className="label-text flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5" /> Location
              </label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="input-field"
              >
                {SAMPLE_LOCATIONS.map((l) => (
                  <option key={l} value={l} className="bg-ink-900">
                    {l}
                  </option>
                ))}
              </select>
              <div className="mt-4">
                <label className="label-text flex items-center gap-1.5">
                  <Timer className="h-3.5 w-3.5" /> Response ETA
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min={1}
                    max={30}
                    value={responseEta}
                    onChange={(e) => setResponseEta(Number(e.target.value))}
                    className="h-1.5 flex-1 cursor-pointer appearance-none rounded-full bg-ink-700 accent-accent"
                  />
                  <span className="w-16 text-right font-mono text-sm font-semibold text-accent">
                    {responseEta} min
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Severity */}
          <div className="card p-5 animate-fade-in">
            <div className="mb-3 flex items-center justify-between">
              <label className="label-text mb-0 flex items-center gap-1.5">
                <Gauge className="h-3.5 w-3.5" /> Severity Indicator
              </label>
              <span
                className={`font-mono text-sm font-bold ${
                  severity >= 8
                    ? "text-signal-red"
                    : severity >= 5
                    ? "text-signal-amber"
                    : "text-accent"
                }`}
              >
                {severity}/10
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={10}
              value={severity}
              onChange={(e) => setSeverity(Number(e.target.value))}
              className="h-2 w-full cursor-pointer appearance-none rounded-full bg-gradient-to-r from-accent via-signal-amber to-signal-red accent-[#3ee9b5]"
            />
            <div className="mt-2 flex justify-between text-[10px] uppercase tracking-wider text-slate-600">
              <span>Minor</span>
              <span>Moderate</span>
              <span>Catastrophic</span>
            </div>
          </div>
        </div>
        </>
        )}

        {/* Right: summary + submit */}
        <div className="lg:col-span-1">
          <div className="card sticky top-20 p-5 animate-fade-in">
            <h3 className="mb-4 text-sm font-semibold text-slate-100">Scenario Summary</h3>
            <dl className="space-y-2.5 text-sm">
              {simulationMode === "single" ? [
                ["Incident", incidentType],
                ["Occupancy", occupancy],
                ["Weather", weather],
                ["Time", timeOfDay],
                ["ETA", `${responseEta} min`],
                ["Severity", `${severity}/10`],
                ["Location", location],
              ].map(([k, v]) => (
                <div key={k} className="flex items-start justify-between gap-3 border-b border-ink-700/60 pb-2.5 last:border-0">
                  <dt className="text-xs uppercase tracking-wider text-slate-500">{k}</dt>
                  <dd className="text-right text-sm font-medium text-slate-200">{v}</dd>
                </div>
              )) : (
                <div className="flex items-start justify-between gap-3 border-b border-ink-700/60 pb-2.5">
                  <dt className="text-xs uppercase tracking-wider text-slate-500">Total Incidents</dt>
                  <dd className="text-right text-sm font-medium text-slate-200">{multiCount}</dd>
                </div>
              )}
            </dl>

            <div className="mt-5 rounded-lg border border-accent/20 bg-accent/5 p-3">
              <p className="flex items-start gap-2 text-xs text-slate-300">
                <Zap className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" />
                Requests are processed by a real ML model trained on simulated emergency data.
              </p>
            </div>

            <button onClick={handleSubmit} className="btn-primary mt-5 w-full">
              <Zap className="h-4 w-4" />
              {simulationMode === "single" ? "Predict & Optimize" : "Run Global Optimization"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
