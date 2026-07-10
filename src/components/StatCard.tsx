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
  accent: { text: "text-accent", bg: "bg-accent/10" },
  red: { text: "text-signal-red", bg: "bg-signal-red/10" },
  amber: { text: "text-signal-amber", bg: "bg-signal-amber/10" },
  blue: { text: "text-signal-blue", bg: "bg-signal-blue/10" },
  violet: { text: "text-signal-violet", bg: "bg-signal-violet/10" },
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
    <div className="card p-5 card-hover">
      <div className="flex items-start justify-between">
        <div>
          <h4 className="text-sm font-medium text-slate-400 mb-2">{label}</h4>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-semibold tracking-tight text-white">{value}</span>
            {unit && <span className="text-sm font-medium text-slate-500">{unit}</span>}
          </div>
          {sublabel && <p className="mt-2 text-xs text-slate-500 font-medium">{sublabel}</p>}
        </div>
        <div className={`p-2.5 rounded-lg ${a.bg}`}>
          <Icon className={`w-5 h-5 ${a.text}`} />
        </div>
      </div>
    </div>
  );
}
