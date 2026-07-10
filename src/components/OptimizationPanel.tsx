
import type { OptimizationResult } from '../types';
import { CheckCircle, AlertTriangle, XCircle, Activity } from 'lucide-react';

export function OptimizationPanel({ result }: { result?: OptimizationResult }) {
  if (!result) return null;

  const isOptimal = result.status === 'Optimal';
  const isInfeasible = result.status === 'Infeasible';

  return (
    <div className="card p-5 flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold text-white flex items-center gap-2">
          <Activity className="w-4 h-4 text-accent" />
          Linear Programming Solver
        </h3>
        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
          isOptimal ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400' :
          isInfeasible ? 'border-red-500/20 bg-red-500/10 text-red-400' :
          'border-amber-500/20 bg-amber-500/10 text-amber-400'
        }`}>
          {isOptimal ? <CheckCircle className="w-3.5 h-3.5" /> : 
           isInfeasible ? <XCircle className="w-3.5 h-3.5" /> : 
           <AlertTriangle className="w-3.5 h-3.5" />}
          {result.status}
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mt-auto">
        <div className="p-4 bg-ink-900/40 rounded-lg border border-white/5">
          <div className="text-xs text-slate-400 mb-1.5 font-medium">Solver Status</div>
          <div className="text-xl font-semibold text-slate-200">{result.status}</div>
        </div>
        <div className="p-4 bg-ink-900/40 rounded-lg border border-white/5">
          <div className="text-xs text-slate-400 mb-1.5 font-medium">Resource Fulfillment</div>
          <div className="text-xl font-semibold text-slate-200">{result.fulfillment_percentage || 0}%</div>
        </div>
        <div className="p-4 bg-ink-900/40 rounded-lg border border-white/5">
          <div className="text-xs text-slate-400 mb-1.5 font-medium">Incidents Processed</div>
          <div className="text-xl font-semibold text-slate-200">{Object.keys(result.allocations).length}</div>
        </div>
        <div className="p-4 bg-ink-900/40 rounded-lg border border-white/5">
          <div className="text-xs text-slate-400 mb-1.5 font-medium">Resources Allocated</div>
          <div className="text-xl font-semibold text-slate-200">{result.total_allocated_resources || 0}</div>
        </div>
      </div>
    </div>
  );
}
