import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import type { ImpactBreakdownItem } from "../../types";

interface Props {
  data: ImpactBreakdownItem[];
}

function ChartTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const item = payload[0].payload as ImpactBreakdownItem;
  return (
    <div className="rounded-lg border border-ink-600 bg-ink-900 px-3 py-2 text-xs shadow-card">
      <p className="font-semibold text-slate-200">{item.category}</p>
      <p className="font-mono text-slate-100">{item.value}%</p>
    </div>
  );
}

export default function ImpactBreakdownChart({ data }: Props) {
  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row">
      <div className="relative h-[200px] w-full flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="category"
              innerRadius={56}
              outerRadius={88}
              paddingAngle={3}
              stroke="none"
            >
              {data.map((d) => (
                <Cell key={d.category} fill={d.color} />
              ))}
            </Pie>
            <Tooltip content={<ChartTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-mono text-2xl font-bold text-slate-100">
            {data.reduce((s, d) => s + d.value, 0)}%
          </span>
          <span className="text-[10px] uppercase tracking-wider text-slate-500">Total Impact</span>
        </div>
      </div>
      <div className="flex w-full flex-col gap-2 sm:w-44">
        {data.map((d) => (
          <div key={d.category} className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-2 text-slate-400">
              <span className="h-2.5 w-2.5 rounded-sm" style={{ background: d.color }} />
              {d.category}
            </span>
            <span className="font-mono font-medium text-slate-200">{d.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
