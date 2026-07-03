import { useLocation, useNavigate, Link } from "react-router-dom";
import {
  Activity,
  Ambulance,
  Flame,
  HardHat,
  HeartPulse,
  Hospital,
  Clock,
  Target,
  TrendingUp,
  Gauge,
  Lightbulb,
  ArrowLeft,
  RotateCcw,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react";
import type { SimulationResult, SimulationInput } from "../types";
import StatCard from "../components/StatCard";
import SectionCard from "../components/SectionCard";
import RiskBadge from "../components/RiskBadge";
import Timeline from "../components/Timeline";
import ResourceAllocationChart from "../components/charts/ResourceAllocationChart";
import ImpactBreakdownChart from "../components/charts/ImpactBreakdownChart";
import ResponseImprovementChart from "../components/charts/ResponseImprovementChart";

interface LocationState {
  result: SimulationResult;
  input: SimulationInput;
}

function EmptyState() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6">
      <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-ink-800 ring-1 ring-ink-600">
        <AlertTriangle className="h-7 w-7 text-signal-amber" />
      </div>
      <h2 className="text-xl font-semibold text-slate-100">No simulation results yet</h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-slate-400">
        Run a simulation to view the emergency response dashboard with impact predictions and resource allocation.
      </p>
      <Link to="/simulator" className="btn-primary mt-6">
        Go to Simulator
      </Link>
    </div>
  );
}

export default function DashboardPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LocationState | null;

  if (!state?.result) return <EmptyState />;

  const { result, input } = state;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate(-1)}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-ink-600 bg-ink-800 text-slate-400 transition-colors hover:text-slate-200"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <span className="chip border-ink-600 bg-ink-800 text-slate-400">
              <Activity className="h-3.5 w-3.5 text-accent" />
              Incident {result.incidentId}
            </span>
            <RiskBadge level={result.riskLevel} size="sm" />
          </div>
          <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-100 sm:text-3xl">
            Response Dashboard
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            {input.incidentType} · {input.location} · Generated{" "}
            {new Date(result.generatedAt).toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/simulator" className="btn-ghost">
            <RotateCcw className="h-4 w-4" />
            New Simulation
          </Link>
        </div>
      </div>

      {/* Top stat row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Emergency Impact Score"
          value={result.impactScore}
          unit="/ 100"
          icon={Gauge}
          accent={result.impactScore >= 65 ? "red" : result.impactScore >= 45 ? "amber" : "accent"}
          sublabel={`Confidence ${result.confidenceScore}%`}
        />
        <StatCard
          label="Estimated Injured"
          value={result.estimatedInjured}
          icon={HeartPulse}
          accent="red"
          sublabel={`${result.estimatedFatalities} projected fatalities`}
        />
        <StatCard
          label="Hospital Capacity Used"
          value={result.hospitalCapacityUsed}
          unit="%"
          icon={Hospital}
          accent="blue"
          sublabel="Across 3 trauma centers"
        />
        <StatCard
          label="Containment Time"
          value={result.estimatedContainmentTime}
          icon={Clock}
          accent="violet"
          sublabel="Estimated to full containment"
        />
      </div>

      {/* Resource requirements */}
      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Ambulances Required"
          value={result.ambulancesRequired}
          icon={Ambulance}
          accent="blue"
          sublabel="EMS dispatch units"
        />
        <StatCard
          label="Fire Engines Required"
          value={result.fireEnginesRequired}
          icon={Flame}
          accent="red"
          sublabel="Suppression & rescue"
        />
        <StatCard
          label="Rescue Teams Required"
          value={result.rescueTeamsRequired}
          icon={HardHat}
          accent="accent"
          sublabel="Specialized response"
        />
      </div>

      {/* Charts row */}
      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <SectionCard
          title="Resource Allocation"
          subtitle="Required vs. available dispatch units"
          icon={Target}
          className="lg:col-span-2"
        >
          <ResourceAllocationChart data={result.resourceAllocation} />
        </SectionCard>
        <SectionCard
          title="Impact Breakdown"
          subtitle="Distribution by impact category"
          icon={Gauge}
        >
          <ImpactBreakdownChart data={result.impactBreakdown} />
        </SectionCard>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <SectionCard
          title="Response Improvement"
          subtitle="Traditional vs. ResQAI optimized response time"
          icon={TrendingUp}
          className="lg:col-span-2"
        >
          <ResponseImprovementChart data={result.responseImprovement} />
        </SectionCard>

        <SectionCard title="AI Recommendations" subtitle="Actionable response directives" icon={Lightbulb}>
          <ul className="space-y-2.5">
            {result.recommendations.map((rec, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-slate-300">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/10 text-[10px] font-bold text-accent ring-1 ring-accent/20">
                  {i + 1}
                </span>
                <span className="leading-relaxed">{rec}</span>
              </li>
            ))}
          </ul>
        </SectionCard>
      </div>

      {/* Timeline */}
      <div className="mt-4">
        <SectionCard
          title="Simulation Timeline"
          subtitle="Real-time response pipeline execution"
          icon={ShieldCheck}
        >
          <div className="grid gap-6 lg:grid-cols-2">
            <Timeline events={result.timeline} />
            <div className="rounded-lg border border-ink-700 bg-ink-900/40 p-4">
              <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                Pipeline Status
              </h4>
              <div className="space-y-3">
                {result.timeline.map((evt) => {
                  const pct =
                    evt.status === "completed" ? 100 : evt.status === "active" ? 60 : 0;
                  return (
                    <div key={evt.id}>
                      <div className="mb-1 flex items-center justify-between text-xs">
                        <span className="text-slate-300">{evt.title}</span>
                        <span
                          className={
                            evt.status === "completed"
                              ? "text-accent"
                              : evt.status === "active"
                              ? "text-signal-amber"
                              : "text-slate-600"
                          }
                        >
                          {evt.status}
                        </span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-ink-700">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ${
                            evt.status === "completed"
                              ? "bg-accent"
                              : evt.status === "active"
                              ? "bg-signal-amber animate-pulse"
                              : "bg-ink-600"
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
