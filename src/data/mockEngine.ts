import type {
  IncidentType,
  WeatherCondition,
  TimeOfDay,
  RiskLevel,
  TimelineEvent,
} from "../types";

export const INCIDENT_TYPES: IncidentType[] = [
  "Fire",
  "Building Collapse",
  "Flood",
  "Road Accident",
  "Chemical Leak",
];

export const WEATHER_CONDITIONS: WeatherCondition[] = [
  "Clear",
  "Rain",
  "Storm",
  "Fog",
  "Snow",
  "Heatwave",
];

export const TIMES_OF_DAY: TimeOfDay[] = ["Dawn", "Day", "Dusk", "Night"];

export const SAMPLE_LOCATIONS = [
  "Downtown Sector 7",
  "Riverside Industrial Park",
  "Highway M-14 Junction",
  "Old Town Residential Block",
  "Metro Central Station",
  "Northgate Tower Complex",
];

export function riskFromScore(score: number): RiskLevel {
  if (score < 25) return "Low";
  if (score < 45) return "Moderate";
  if (score < 65) return "High";
  if (score < 82) return "Severe";
  return "Critical";
}

export function buildTimeline(eta: number): TimelineEvent[] {
  const now = new Date();
  const step = (mins: number) =>
    new Date(now.getTime() - mins * 60000).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });

  return [
    {
      id: "evt-1",
      title: "Incident Reported",
      description: "Emergency signal received via 911 dispatch and IoT sensor mesh.",
      timestamp: step(eta + 4),
      status: "completed",
      icon: "alert",
      duration: "00:04",
    },
    {
      id: "evt-2",
      title: "AI Analysis",
      description: "ResQAI engine classified severity, predicted impact radius, and modeled casualty spread.",
      timestamp: step(eta + 2),
      status: "completed",
      icon: "brain",
      duration: "00:02",
    },
    {
      id: "evt-3",
      title: "Resource Allocation",
      description: "Optimal dispatch plan generated across 12 nearby response units.",
      timestamp: step(eta),
      status: "active",
      icon: "truck",
      duration: "00:01",
    },
    {
      id: "evt-4",
      title: "Hospital Assignment",
      description: "Triage routing to 3 trauma centers with capacity verification.",
      timestamp: "—",
      status: "pending",
      icon: "building",
      duration: "Pending",
    },
    {
      id: "evt-5",
      title: "Response Generated",
      description: "Full response plan distributed to field commanders and EMS coordinators.",
      timestamp: "—",
      status: "pending",
      icon: "check",
      duration: "Pending",
    },
  ];
}

export function buildRecommendations(
  incidentType: string,
  weather: WeatherCondition,
  risk: RiskLevel
): string[] {
  const recs: string[] = [];
  recs.push(
    `Deploy ${incidentType === "Flood" ? "water rescue" : "heavy"} units to the perimeter; establish a 500m exclusion zone.`
  );
  if (weather === "Storm" || weather === "Rain") {
    recs.push("Activate flood-control drones; ground aerial units until wind speeds drop below 25 km/h.");
  }
  if (weather === "Fog") {
    recs.push("Issue low-visibility advisory; reroute ground transport via Corridor B.");
  }
  if (risk === "Severe" || risk === "Critical") {
    recs.push("Request mutual-aid from neighboring districts; declare Level 2 emergency.");
    recs.push("Pre-position mobile triage units at Sector 7 and Northgate staging areas.");
  }
  recs.push("Sync real-time telemetry to the regional command dashboard and notify hospital EDs.");
  return recs;
}
