import { Activity, MapPin, Users, HeartPulse } from 'lucide-react';
import RiskBadge from './RiskBadge';
import { riskFromScore } from '../data/mockEngine';
import type { MultiIncidentEntry } from '../types';

export function IncidentComparisonGrid({ incidents }: { incidents: MultiIncidentEntry[] }) {
  if (!incidents || incidents.length === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      {incidents.map((inc) => {
        const score = inc.impactScore ?? inc.impact ?? 0;
        const risk = inc.riskLevel ?? riskFromScore(score);
        const displayId = inc.incidentId ?? inc.id;
        const displayType = inc.incidentType ?? inc.incident_type;

        return (
          <div key={displayId} className="card p-5 relative overflow-hidden group transition-colors hover:border-white/10 hover:bg-ink-900/80">
            <div className={`absolute top-0 left-0 w-1 h-full transition-colors ${
              risk === 'Critical' ? 'bg-red-500' :
              risk === 'Severe' ? 'bg-amber-500' : 'bg-accent'
            }`} />
            
            <div className="flex justify-between items-start mb-6">
              <div className="flex-1 pr-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-medium text-slate-400 flex items-center gap-1 bg-ink-900 px-2 py-0.5 rounded-full border border-white/5">
                    <Activity className="w-3.5 h-3.5 text-accent" />
                    {displayId}
                  </span>
                  <RiskBadge level={risk} size="sm" />
                </div>
                <h3 className="text-lg font-semibold text-white">{displayType}</h3>
                <p className="text-sm text-slate-400 flex items-center gap-1 mt-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {inc.location || 'Sector Unknown'}
                </p>
              </div>
              
              <div className="w-14 h-14 flex items-center justify-center rounded-full bg-ink-900 border border-white/5 shrink-0">
                 <span className={`text-xl font-semibold ${
                   score >= 82 ? 'text-red-500' :
                   score >= 65 ? 'text-amber-500' : 'text-accent'
                 }`}>
                   {Math.round(score)}
                 </span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3 mt-4 border-t border-white/5 pt-4">
              <div className="flex flex-col">
                <span className="text-xs text-slate-500 mb-1 flex items-center gap-1">
                  <Users className="w-3 h-3" /> Occupancy
                </span>
                <span className="font-semibold text-sm text-slate-200">{inc.occupancy || '-'}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-slate-500 mb-1 flex items-center gap-1">
                  <HeartPulse className="w-3 h-3 text-red-500" /> Est. Injured
                </span>
                <span className="font-semibold text-sm text-slate-200">{(inc.estimatedInjured ?? inc.estimated_injured) || '-'}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
