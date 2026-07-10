import {
  AlertTriangle,
  Brain,
  Truck,
  Building2,
  CheckCircle2,
  Clock,
} from "lucide-react";
import type { TimelineEvent } from "../types";

const ICONS: Record<string, typeof AlertTriangle> = {
  alert: AlertTriangle,
  brain: Brain,
  truck: Truck,
  building: Building2,
  check: CheckCircle2,
};

const STATUS_STYLES = {
  completed: {
    bg: "bg-emerald-500/10 border-emerald-500/20",
    icon: "text-emerald-400",
    line: "bg-emerald-500/20",
    badge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  },
  active: {
    bg: "bg-accent/10 border-accent/20",
    icon: "text-accent",
    line: "bg-ink-800",
    badge: "bg-accent/10 text-accent border-accent/20",
  },
  pending: {
    bg: "bg-ink-800 border-white/5",
    icon: "text-slate-500",
    line: "bg-ink-800",
    badge: "bg-ink-800 text-slate-500 border-white/5",
  },
};

interface Props {
  events: TimelineEvent[];
}

export default function Timeline({ events }: Props) {
  return (
    <ol className="relative space-y-2">
      {events.map((evt, idx) => {
        const Icon = ICONS[evt.icon] ?? AlertTriangle;
        const s = STATUS_STYLES[evt.status];
        const isLast = idx === events.length - 1;
        return (
          <li key={evt.id} className="relative flex gap-4 pb-6 last:pb-0">
            {!isLast && (
              <span
                className={`absolute left-5 top-10 h-[calc(100%-2.5rem)] w-px ${s.line}`}
                aria-hidden
              />
            )}
            <div
              className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border ${s.bg} ${
                evt.status === "active" ? "ring-4 ring-accent/10" : ""
              }`}
            >
              <Icon className={`h-4 w-4 ${s.icon}`} />
            </div>
            <div className="flex-1 pt-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h4 className="text-sm font-semibold text-slate-200">{evt.title}</h4>
                <span className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                  <Clock className="h-3 w-3" />
                  {evt.timestamp}
                </span>
              </div>
              <p className="mt-1 text-sm text-slate-400 leading-relaxed">{evt.description}</p>
              <span
                className={`mt-3 inline-block px-2.5 py-1 text-[11px] font-medium rounded-full border ${s.badge}`}
              >
                <span className="capitalize">{evt.status}</span> · {evt.duration}
              </span>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
