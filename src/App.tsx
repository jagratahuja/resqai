import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import LandingPage from "./pages/LandingPage";
import SimulatorPage from "./pages/SimulatorPage";
import DashboardPage from "./pages/DashboardPage";

export default function App() {
  return (
    <div className="flex min-h-screen flex-col bg-ink-950">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/simulator" element={<SimulatorPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
        </Routes>
      </main>
      <footer className="border-t border-ink-800 bg-ink-950">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-slate-600 sm:flex-row sm:px-6 lg:px-8">
          <span>
            ResQAI · Emergency Response Command Center · Mock AI Engine
          </span>
          <span className="font-mono">v1.0.0 · System Status: Operational</span>
        </div>
      </footer>
    </div>
  );
}
