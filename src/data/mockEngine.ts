import type {
  IncidentType,
  OccupancyLevel,
  WeatherCondition,
  TimeOfDay,
  RiskLevel,
  SimulationInput,
  SimulationResult,
  ResourceAllocation,
  ImpactBreakdownItem,
  ResponseImprovementPoint,
  TimelineEvent,
} from "../types";

export const INCIDENT_TYPES: IncidentType[] = [
  "Fire Outbreak",
  "Earthquake",
  "Flood",
  "Road Accident",
  "Industrial Explosion",
  "Building Collapse",
];

export const OCCUPANCY_LEVELS: OccupancyLevel[] = ["Low", "Medium", "High", "Critical"];

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

const OCCUPANCY_WEIGHT: Record<OccupancyLevel, number> = {
  Low: 0.4,
  Medium: 0.7,
  High: 1.0,
  Critical: 1.4,
};

const WEATHER_FACTOR: Record<WeatherCondition, number> = {
  Clear: 0.8,
  Rain: 1.1,
  Storm: 1.35,
  Fog: 1.15,
  Snow: 1.25,
  Heatwave: 1.2,
};

const TIME_FACTOR: Record<TimeOfDay, number> = {
  Dawn: 0.85,
  Day: 1.1,
  Dusk: 1.05,
  Night: 0.95,
};

const INCIDENT_BASE: Record<
  IncidentType,
  { injured: number; fire: number; rescue: number; medical: number }
> = {
  "Fire Outbreak": { injured: 18, fire: 6, rescue: 3, medical: 1.2 },
  Earthquake: { injured: 42, fire: 2, rescue: 9, medical: 1.5 },
  Flood: { injured: 24, fire: 0, rescue: 7, medical: 1.0 },
  "Road Accident": { injured: 6, fire: 1, rescue: 2, medical: 1.8 },
  "Industrial Explosion": { injured: 35, fire: 5, rescue: 6, medical: 1.4 },
  "Building Collapse": { injured: 28, fire: 1, rescue: 8, medical: 1.3 },
};

function riskFromScore(score: number): RiskLevel {
  if (score < 25) return "Low";
  if (score < 45) return "Moderate";
  if (score < 65) return "High";
  if (score < 82) return "Severe";
  return "Critical";
}

function buildTimeline(eta: number): TimelineEvent[] {
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

function buildRecommendations(
  incidentType: IncidentType,
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

export function generateMockResult(input: SimulationInput): SimulationResult {
  const base = INCIDENT_BASE[input.incidentType];
  const occ = OCCUPANCY_WEIGHT[input.occupancy];
  const wx = WEATHER_FACTOR[input.weather];
  const tod = TIME_FACTOR[input.timeOfDay];
  const sev = input.severity / 10;

  const impactScore = Math.min(
    100,
    Math.round((sev * 45 + occ * 20 + (wx - 0.8) * 18 + (tod - 0.85) * 8 + (input.responseEta / 60) * 9) * 10) / 10
  );

  const risk = riskFromScore(impactScore);

  const injured = Math.round(base.injured * occ * wx * (0.6 + sev * 0.8));
  const fatalities = Math.max(0, Math.round(injured * 0.06 * sev));

  const ambulances = Math.max(1, Math.round((injured * base.medical) / 8));
  const fireEngines = Math.round(base.fire * (0.7 + sev * 0.6));
  const rescueTeams = Math.round(base.rescue * (0.8 + sev * 0.5));

  const resourceAllocation: ResourceAllocation[] = [
    { name: "Ambulances", required: ambulances, available: ambulances + 4, color: "#4aa8ff" },
    { name: "Fire Engines", required: fireEngines, available: fireEngines + 2, color: "#ff5a5f" },
    { name: "Rescue Teams", required: rescueTeams, available: rescueTeams + 3, color: "#3ee9b5" },
    { name: "Police Units", required: Math.ceil(rescueTeams * 0.7), available: Math.ceil(rescueTeams * 0.7) + 5, color: "#ffb547" },
    { name: "Medical Coordinators", required: Math.ceil(ambulances / 3), available: Math.ceil(ambulances / 3) + 2, color: "#9b8cff" },
  ];

  const impactBreakdown: ImpactBreakdownItem[] = [
    { category: "Human Impact", value: Math.round(impactScore * 0.4), color: "#ff5a5f" },
    { category: "Structural Damage", value: Math.round(impactScore * 0.25), color: "#ffb547" },
    { category: "Environmental", value: Math.round(impactScore * 0.18), color: "#3ee9b5" },
    { category: "Economic Loss", value: Math.round(impactScore * 0.17), color: "#4aa8ff" },
  ];

  const responseImprovement: ResponseImprovementPoint[] = [
    { stage: "Dispatch", traditional: 100, optimized: 38 },
    { stage: "Routing", traditional: 100, optimized: 52 },
    { stage: "Triage", traditional: 100, optimized: 44 },
    { stage: "Containment", traditional: 100, optimized: 61 },
    { stage: "Recovery", traditional: 100, optimized: 70 },
  ];

  const containmentMins = Math.round(45 + impactScore * 1.8);
  const hours = Math.floor(containmentMins / 60);
  const mins = containmentMins % 60;

  return {
    impactScore,
    riskLevel: risk,
    estimatedInjured: injured,
    estimatedFatalities: fatalities,
    ambulancesRequired: ambulances,
    fireEnginesRequired: fireEngines,
    rescueTeamsRequired: rescueTeams,
    hospitalCapacityUsed: Math.min(98, Math.round(40 + injured * 0.8)),
    estimatedContainmentTime: `${hours}h ${mins}m`,
    confidenceScore: Math.min(97, Math.round(82 + (10 - input.severity) * 1.2 + Math.random() * 4)),
    resourceAllocation,
    impactBreakdown,
    responseImprovement,
    timeline: buildTimeline(input.responseEta),
    recommendations: buildRecommendations(input.incidentType, input.weather, risk),
    incidentId: `RQ-${Date.now().toString(36).toUpperCase().slice(-6)}`,
    generatedAt: new Date().toISOString(),
  };
}
