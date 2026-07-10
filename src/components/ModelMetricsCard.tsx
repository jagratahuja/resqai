
import type { ModelMetrics } from '../types';
import { BrainCircuit } from 'lucide-react';

export function ModelMetricsCard({ metrics }: { metrics?: ModelMetrics }) {
  if (!metrics) return null;

  return (
    <div className="card p-5 flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold text-white flex items-center gap-2">
          <BrainCircuit className="w-4 h-4 text-accent" />
          ML Model Performance
        </h3>
        <div className="px-2.5 py-1 rounded-full text-[11px] font-medium border border-white/10 bg-ink-900 text-slate-300">
          n={metrics.dataset_size}
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mt-auto">
        <div className="p-4 bg-ink-900/40 rounded-lg border border-accent/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-12 h-12 bg-accent/5 rounded-bl-full" />
          <div className="text-xs text-slate-400 mb-1.5 font-medium relative z-10">R² Score</div>
          <div className="text-2xl font-semibold text-accent relative z-10">{metrics.r2.toFixed(3)}</div>
        </div>
        <div className="p-4 bg-ink-900/40 rounded-lg border border-white/5">
          <div className="text-xs text-slate-400 mb-1.5 font-medium">Mean Abs Error</div>
          <div className="text-2xl font-semibold text-slate-200">{metrics.mae.toFixed(2)}</div>
        </div>
      </div>
    </div>
  );
}
