import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

interface SectionCardProps {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}

export default function SectionCard({
  title,
  subtitle,
  icon: Icon,
  action,
  children,
  className = "",
}: SectionCardProps) {
  return (
    <section className={`card p-5 animate-fade-in ${className}`}>
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          {Icon && (
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-ink-700/60 ring-1 ring-ink-600">
              <Icon className="h-4 w-4 text-accent" />
            </div>
          )}
          <div>
            <h3 className="text-sm font-semibold text-slate-100">{title}</h3>
            {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
          </div>
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}
