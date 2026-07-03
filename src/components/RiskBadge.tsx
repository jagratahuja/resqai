import type { RiskLevel } from "../types";

const RISK_STYLES: Record<RiskLevel, { bg: string; text: string; ring: string; dot: string }> = {
  Low: { bg: "bg-emerald-500/10", text: "text-emerald-400", ring: "ring-emerald-500/30", dot: "bg-emerald-400" },
  Moderate: { bg: "bg-amber-500/10", text: "text-amber-400", ring: "ring-amber-500/30", dot: "bg-amber-400" },
  High: { bg: "bg-orange-500/10", text: "text-orange-400", ring: "ring-orange-500/30", dot: "bg-orange-400" },
  Severe: { bg: "bg-red-500/10", text: "text-red-400", ring: "ring-red-500/30", dot: "bg-red-400" },
  Critical: { bg: "bg-red-600/20", text: "text-red-500", ring: "ring-red-600/40", dot: "bg-red-500" },
};

interface RiskBadgeProps {
  level: RiskLevel;
  size?: "sm" | "md";
}

export default function RiskBadge({ level, size = "md" }: RiskBadgeProps) {
  const s = RISK_STYLES[level];
  const padding = size === "sm" ? "px-2 py-0.5 text-[11px]" : "px-3 py-1 text-xs";
  return (
    <span className={`chip ${s.bg} ${s.text} ring-1 ${s.ring} ${padding}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot} animate-blink`} />
      {level} Risk
    </span>
  );
}
