import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import type { ResourceAllocation } from "../../types";

interface Props {
  data: ResourceAllocation[];
}

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  const item = payload[0].payload as ResourceAllocation;
  return (
    <div className="rounded-lg border border-ink-600 bg-ink-900 px-3 py-2 text-xs shadow-card">
      <p className="mb-1 font-semibold text-slate-200">{label}</p>
      <p className="text-slate-400">
        Required: <span className="font-mono text-slate-100">{item.required}</span>
      </p>
      <p className="text-slate-400">
        Available: <span className="font-mono text-slate-100">{item.available}</span>
      </p>
    </div>
  );
}

export default function ResourceAllocationChart({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }} barGap={4}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1c2433" vertical={false} />
        <XAxis
          dataKey="name"
          tick={{ fill: "#64748b", fontSize: 11 }}
          tickLine={false}
          axisLine={{ stroke: "#1c2433" }}
          interval={0}
          angle={-12}
          textAnchor="end"
          height={50}
        />
        <YAxis tick={{ fill: "#64748b", fontSize: 11 }} tickLine={false} axisLine={false} />
        <Tooltip content={<ChartTooltip />} cursor={{ fill: "#ffffff08" }} />
        <Bar dataKey="required" radius={[4, 4, 0, 0]} maxBarSize={42}>
          {data.map((d) => (
            <Cell key={d.name} fill={d.color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
