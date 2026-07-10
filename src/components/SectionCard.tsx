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
    <section className={`card flex flex-col ${className}`}>
      <div className="flex items-start justify-between p-6 border-b border-white/5">
        <div className="flex items-center gap-3">
          {Icon && (
            <div className="p-2 rounded-lg bg-ink-800 border border-ink-700">
              <Icon className="w-4 h-4 text-slate-300" />
            </div>
          )}
          <div>
            <h3 className="text-base font-semibold text-white">{title}</h3>
            {subtitle && <p className="text-sm text-slate-400 mt-0.5">{subtitle}</p>}
          </div>
        </div>
        {action}
      </div>
      <div className="flex-1 p-6 overflow-hidden flex flex-col">
        {children}
      </div>
    </section>
  );
}
