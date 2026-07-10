import type { RiskLevel } from "../types";

const RISK_STYLES: Record<RiskLevel, { bg: string; text: string; border: string; dot: string }> = {
  Low: { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/20", dot: "bg-emerald-400" },
  Moderate: { bg: "bg-amber-500/10", text: "text-amber-400", border: "border-amber-500/20", dot: "bg-amber-400" },
  High: { bg: "bg-orange-500/10", text: "text-orange-400", border: "border-orange-500/20", dot: "bg-orange-400" },
  Severe: { bg: "bg-red-500/10", text: "text-red-400", border: "border-red-500/20", dot: "bg-red-400" },
  Critical: { bg: "bg-red-600/20", text: "text-red-500", border: "border-red-600/30", dot: "bg-red-500" },
};

interface RiskBadgeProps {
  level: RiskLevel;
  size?: "sm" | "md";
}

export default function RiskBadge({ level, size = "md" }: RiskBadgeProps) {
  const s = RISK_STYLES[level];
  const padding = size === "sm" ? "px-2 py-0.5 text-[11px]" : "px-2.5 py-1 text-xs";
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border ${s.border} ${s.bg} ${s.text} font-medium ${padding}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
      {level}
    </span>
  );
}
