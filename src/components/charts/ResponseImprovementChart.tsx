import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import type { ResponseImprovementPoint } from "../../types";

interface Props {
  data: ResponseImprovementPoint[];
}

function ChartTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; color: string }>; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-ink-600 bg-ink-900 px-3 py-2 text-xs shadow-card">
      <p className="mb-1 font-semibold text-slate-200">{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color }} className="font-mono">
          {p.name}: {p.value}%
        </p>
      ))}
    </div>
  );
}

export default function ResponseImprovementChart({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={data} margin={{ top: 8, right: 12, left: -16, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1c2433" vertical={false} />
        <XAxis dataKey="stage" tick={{ fill: "#64748b", fontSize: 11 }} tickLine={false} axisLine={{ stroke: "#1c2433" }} />
        <YAxis tick={{ fill: "#64748b", fontSize: 11 }} tickLine={false} axisLine={false} unit="%" />
        <Tooltip content={<ChartTooltip />} cursor={{ stroke: "#ffffff14" }} />
        <Legend
          wrapperStyle={{ fontSize: 11, paddingTop: 8 }}
          iconType="plainline"
          formatter={(v) => <span className="text-slate-400">{v}</span>}
        />
        <Line
          type="monotone"
          dataKey="traditional"
          name="Traditional"
          stroke="#ff5a5f"
          strokeWidth={2}
          dot={{ r: 3, fill: "#ff5a5f" }}
          strokeDasharray="5 4"
        />
        <Line
          type="monotone"
          dataKey="optimized"
          name="ResQAI Optimized"
          stroke="#3ee9b5"
          strokeWidth={2.5}
          dot={{ r: 3, fill: "#3ee9b5" }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
