import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import MissionControl from "./pages/MissionControl";
import TermsOfService from "./pages/TermsOfService";
import PrivacyPolicy from "./pages/PrivacyPolicy";

export default function App() {
  return (
    <div className="flex min-h-screen flex-col bg-ink-950">
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/simulator" element={<MissionControl />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
        </Routes>
      </main>
    </div>
  );
}
