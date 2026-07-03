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
    ring: "ring-accent/40 bg-accent/10",
    icon: "text-accent",
    line: "bg-accent/40",
    label: "text-accent",
  },
  active: {
    ring: "ring-signal-amber/50 bg-signal-amber/10",
    icon: "text-signal-amber",
    line: "bg-ink-700",
    label: "text-signal-amber",
  },
  pending: {
    ring: "ring-ink-600 bg-ink-800",
    icon: "text-slate-500",
    line: "bg-ink-700",
    label: "text-slate-500",
  },
};

interface Props {
  events: TimelineEvent[];
}

export default function Timeline({ events }: Props) {
  return (
    <ol className="relative space-y-1">
      {events.map((evt, idx) => {
        const Icon = ICONS[evt.icon] ?? AlertTriangle;
        const s = STATUS_STYLES[evt.status];
        const isLast = idx === events.length - 1;
        return (
          <li key={evt.id} className="relative flex gap-4 pb-6 last:pb-0">
            {!isLast && (
              <span
                className={`absolute left-[18px] top-10 h-[calc(100%-2.5rem)] w-0.5 ${s.line}`}
                aria-hidden
              />
            )}
            <div
              className={`relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ring-1 ${s.ring} ${
                evt.status === "active" ? "animate-pulse" : ""
              }`}
            >
              <Icon className={`h-4.5 w-4.5 ${s.icon}`} />
            </div>
            <div className="flex-1 pt-1">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h4 className="text-sm font-semibold text-slate-100">{evt.title}</h4>
                <span className={`flex items-center gap-1 font-mono text-[11px] ${s.label}`}>
                  <Clock className="h-3 w-3" />
                  {evt.timestamp}
                </span>
              </div>
              <p className="mt-1 text-xs leading-relaxed text-slate-400">{evt.description}</p>
              <span
                className={`mt-2 inline-block rounded px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider ${
                  evt.status === "completed"
                    ? "bg-accent/10 text-accent"
                    : evt.status === "active"
                    ? "bg-signal-amber/10 text-signal-amber"
                    : "bg-ink-700 text-slate-500"
                }`}
              >
                {evt.status} · {evt.duration}
              </span>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
