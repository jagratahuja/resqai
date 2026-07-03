import { Link, useLocation } from "react-router-dom";
import { ShieldCheck, Activity, LayoutDashboard, Home } from "lucide-react";

const navItems = [
  { to: "/", label: "Home", icon: Home },
  { to: "/simulator", label: "Simulator", icon: Activity },
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
];

export default function Navbar() {
  const { pathname } = useLocation();

  return (
    <header className="sticky top-0 z-50 border-b border-ink-700 bg-ink-950/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10 ring-1 ring-accent/30">
            <ShieldCheck className="h-5 w-5 text-accent" />
            <span className="absolute inset-0 rounded-lg ring-1 ring-accent/20 animate-pulse-ring" />
          </div>
          <div className="leading-none">
            <span className="block text-base font-bold tracking-tight text-slate-100">
              ResQ<span className="text-accent">AI</span>
            </span>
            <span className="block text-[10px] font-medium uppercase tracking-[0.18em] text-slate-500">
              Emergency Command
            </span>
          </div>
        </Link>

        <nav className="flex items-center gap-1">
          {navItems.map(({ to, label, icon: Icon }) => {
            const active = pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  active
                    ? "bg-accent/10 text-accent ring-1 ring-accent/30"
                    : "text-slate-400 hover:bg-ink-800 hover:text-slate-200"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
