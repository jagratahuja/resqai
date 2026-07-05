
import { Activity, MapPin, Users, HeartPulse } from 'lucide-react';
import RiskBadge from './RiskBadge';


export function IncidentComparisonGrid({ incidents }: { incidents: any[] }) {
  if (!incidents || incidents.length === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      {incidents.map((inc) => (
        <div key={inc.incidentId} className="card p-5 relative overflow-hidden group hover:border-ink-600 transition-colors">
          <div className={`absolute top-0 left-0 w-1 h-full transition-colors ${
            inc.riskLevel === 'Critical' ? 'bg-signal-red' :
            inc.riskLevel === 'Severe' ? 'bg-signal-amber' : 'bg-accent'
          }`} />
          
          <div className="flex justify-between items-start mb-6">
            <div className="flex-1 pr-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-mono text-slate-400 flex items-center gap-1 bg-ink-900 px-2 py-0.5 rounded border border-ink-800">
                  <Activity className="w-3.5 h-3.5 text-accent" />
                  {inc.incidentId}
                </span>
                <RiskBadge level={inc.riskLevel} size="sm" />
              </div>
              <h3 className="text-lg font-bold text-slate-100">{inc.incidentType}</h3>
              <p className="text-sm text-slate-400 flex items-center gap-1 mt-1">
                <MapPin className="w-3.5 h-3.5" />
                {inc.location || 'Sector Unknown'}
              </p>
            </div>
            
            <div className="w-16 h-16 flex items-center justify-center rounded-full bg-ink-900/50 border border-ink-800 shrink-0">
               <span className={`text-xl font-bold font-mono ${
                 inc.impactScore >= 82 ? 'text-signal-red' :
                 inc.impactScore >= 65 ? 'text-signal-amber' : 'text-accent'
               }`}>
                 {Math.round(inc.impactScore)}
               </span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3 mt-4 border-t border-ink-800 pt-4">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-wider text-slate-500 mb-1 flex items-center gap-1">
                <Users className="w-3 h-3" /> Occupancy
              </span>
              <span className="font-mono text-sm text-slate-200">{inc.occupancy || '-'}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-wider text-slate-500 mb-1 flex items-center gap-1">
                <HeartPulse className="w-3 h-3 text-signal-red" /> Est. Injured
              </span>
              <span className="font-mono text-sm text-slate-200">{inc.estimatedInjured || '-'}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
