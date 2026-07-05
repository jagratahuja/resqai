import { useLocation, useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Activity, HeartPulse, Hospital,
  Clock, Target, Gauge, Lightbulb, ArrowLeft,
  RotateCcw, ShieldCheck, AlertTriangle, Network, 
} from "lucide-react";
import type { SimulationResult, SimulationInput, MultiIncidentResult, ModelMetrics } from "../types";
import { getModelMetrics } from "../api/simulationApi";
import StatCard from "../components/StatCard";
import SectionCard from "../components/SectionCard";
import RiskBadge from "../components/RiskBadge";
import Timeline from "../components/Timeline";
import ResourceAllocationChart from "../components/charts/ResourceAllocationChart";
import ImpactBreakdownChart from "../components/charts/ImpactBreakdownChart";
import { OptimizationPanel } from "../components/OptimizationPanel";
import { ModelMetricsCard } from "../components/ModelMetricsCard";
import { FeatureImportanceChart } from "../components/FeatureImportanceChart";
import { IncidentComparisonGrid } from "../components/IncidentComparisonGrid";

interface LocationState {
  result?: SimulationResult;
  input?: SimulationInput;
  multiResult?: MultiIncidentResult;
  mode: "single" | "multi";
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
  const [metrics, setMetrics] = useState<ModelMetrics | undefined>();

  useEffect(() => {
    if (state) {
      getModelMetrics().then(setMetrics).catch(console.error);
    }
  }, [state]);

  if (!state || (!state.result && !state.multiResult)) return <EmptyState />;

  const { mode, result, input, multiResult } = state;

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
              {mode === "single" ? (
                <><Activity className="h-3.5 w-3.5 text-accent" /> Incident {result?.incidentId}</>
              ) : (
                <><Network className="h-3.5 w-3.5 text-accent" /> Global AI Dispatch</>
              )}
            </span>
            {mode === "single" && <RiskBadge level={result!.riskLevel} size="sm" />}
          </div>
          <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-100 sm:text-3xl">
            {mode === "single" ? "Response Dashboard" : "Multi-Incident Optimization"}
          </h1>
          <p className="mt-1 text-sm text-slate-400 flex items-center gap-2">
            {mode === "single" ? (
              <>{input?.incidentType} · {input?.location} · Generated {new Date(result!.generatedAt).toLocaleTimeString()}</>
            ) : (
              <>{multiResult?.incidents.length} Simultaneous Incidents · System-wide resource routing</>
            )}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/simulator" className="btn-ghost">
            <RotateCcw className="h-4 w-4" />
            New Simulation
          </Link>
        </div>
      </div>

      {mode === "multi" && multiResult ? (
        <div className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-3">
            <OptimizationPanel result={multiResult.optimization} />
            <ModelMetricsCard metrics={metrics} />
            <FeatureImportanceChart metrics={metrics} />
          </div>
          
          <SectionCard title="Active Emergencies" subtitle="Simultaneous incidents prioritized by AI" icon={Activity}>
             <IncidentComparisonGrid incidents={multiResult.incidents.map((inc: any) => ({
                 incidentId: inc.id,
                 incidentType: inc.incident_type,
                 location: inc.location,
                 impactScore: inc.impact,
                 riskLevel: inc.impact >= 82 ? 'Critical' : inc.impact >= 65 ? 'Severe' : 'Moderate',
                 occupancy: inc.occupancy,
                 estimatedInjured: inc.estimated_injured
             }))} />
          </SectionCard>
        </div>
      ) : result && input ? (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              label="Emergency Impact Score"
              value={result.impactScore}
              unit="/ 100"
              icon={Gauge}
              accent={result.impactScore >= 65 ? "red" : result.impactScore >= 45 ? "amber" : "accent"}
              sublabel="Real-time ML prediction"
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

          <div className="mt-4 grid gap-4 lg:grid-cols-3">
             <OptimizationPanel result={result.optimizationResult} />
             <div className="lg:col-span-2">
               <SectionCard
                 title="Resource Allocation"
                 subtitle="AI-Optimized dispatch vs. required resources"
                 icon={Target}
                 className="h-full"
               >
                 <ResourceAllocationChart data={result.resourceAllocation} />
               </SectionCard>
             </div>
          </div>

          <div className="mt-4 grid gap-4 lg:grid-cols-3">
            <div className="lg:col-span-3">
              <SectionCard
                title="Factors Influencing Prediction"
                subtitle="Incident-specific feature contribution"
                icon={Gauge}
              >
                <ImpactBreakdownChart data={result.impactBreakdown} />
              </SectionCard>
            </div>
          </div>

          <div className="mt-4 grid gap-4 lg:grid-cols-3">
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

            <div className="lg:col-span-2">
              <SectionCard
                title="Simulation Timeline"
                subtitle="Real-time response pipeline execution"
                icon={ShieldCheck}
                className="h-full"
              >
                <Timeline events={result.timeline} />
              </SectionCard>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
