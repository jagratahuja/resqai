
import { OptimizationResult } from '../types';
import { CheckCircle, AlertTriangle, XCircle, Activity } from 'lucide-react';

export function OptimizationPanel({ result }: { result?: OptimizationResult }) {
  if (!result) return null;

  const isOptimal = result.status === 'Optimal';
  const isInfeasible = result.status === 'Infeasible';

  return (
    <div className="card p-5 flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold text-slate-100 flex items-center gap-2">
          <Activity className="w-5 h-5 text-accent" />
          Optimization Solver
        </h3>
        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
          isOptimal ? 'border-accent/20 bg-accent/10 text-accent' :
          isInfeasible ? 'border-signal-red/20 bg-signal-red/10 text-signal-red' :
          'border-signal-amber/20 bg-signal-amber/10 text-signal-amber'
        }`}>
          {isOptimal ? <CheckCircle className="w-3.5 h-3.5" /> : 
           isInfeasible ? <XCircle className="w-3.5 h-3.5" /> : 
           <AlertTriangle className="w-3.5 h-3.5" />}
          {result.status}
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mt-auto">
        <div className="p-4 bg-ink-900/60 rounded-lg border border-ink-700/50">
          <div className="text-xs text-slate-400 mb-1.5 uppercase tracking-wider font-medium">Solver Status</div>
          <div className="text-xl font-mono font-semibold text-accent uppercase">{result.status}</div>
        </div>
        <div className="p-4 bg-ink-900/60 rounded-lg border border-ink-700/50">
          <div className="text-xs text-slate-400 mb-1.5 uppercase tracking-wider font-medium">Resource Fulfillment</div>
          <div className="text-xl font-mono font-semibold text-signal-blue">{result.fulfillment_percentage || 0}%</div>
        </div>
        <div className="p-4 bg-ink-900/60 rounded-lg border border-ink-700/50">
          <div className="text-xs text-slate-400 mb-1.5 uppercase tracking-wider font-medium">Incidents Processed</div>
          <div className="text-xl font-mono font-semibold text-slate-100">{Object.keys(result.allocations).length}</div>
        </div>
        <div className="p-4 bg-ink-900/60 rounded-lg border border-ink-700/50">
          <div className="text-xs text-slate-400 mb-1.5 uppercase tracking-wider font-medium">Resources Allocated</div>
          <div className="text-xl font-mono font-semibold text-slate-100">{result.total_allocated_resources || 0}</div>
        </div>
      </div>
    </div>
  );
}
