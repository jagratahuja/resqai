import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: ReactNode;
  unit?: string;
  icon: LucideIcon;
  accent?: "accent" | "red" | "amber" | "blue" | "violet";
  sublabel?: string;
}

const ACCENT_MAP = {
  accent: { text: "text-accent", bg: "bg-accent/10", ring: "ring-accent/20" },
  red: { text: "text-signal-red", bg: "bg-signal-red/10", ring: "ring-signal-red/20" },
  amber: { text: "text-signal-amber", bg: "bg-signal-amber/10", ring: "ring-signal-amber/20" },
  blue: { text: "text-signal-blue", bg: "bg-signal-blue/10", ring: "ring-signal-blue/20" },
  violet: { text: "text-signal-violet", bg: "bg-signal-violet/10", ring: "ring-signal-violet/20" },
};

export default function StatCard({
  label,
  value,
  unit,
  icon: Icon,
  accent = "accent",
  sublabel,
}: StatCardProps) {
  const a = ACCENT_MAP[accent];
  return (
    <div className="card card-hover p-4 animate-fade-in">
      <div className="flex items-start justify-between">
        <div className="min-w-0">
          <p className="label-text">{label}</p>
          <div className="flex items-baseline gap-1">
            <span className="stat-value">{value}</span>
            {unit && <span className="text-xs font-medium text-slate-500">{unit}</span>}
          </div>
          {sublabel && <p className="mt-1 text-xs text-slate-500">{sublabel}</p>}
        </div>
        <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${a.bg} ring-1 ${a.ring}`}>
          <Icon className={`h-4.5 w-4.5 ${a.text}`} />
        </div>
      </div>
    </div>
  );
}
