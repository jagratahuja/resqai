export type IncidentType =
  | "Fire Outbreak"
  | "Earthquake"
  | "Flood"
  | "Road Accident"
  | "Industrial Explosion"
  | "Building Collapse";

export type OccupancyLevel = "Low" | "Medium" | "High" | "Critical";

export type WeatherCondition =
  | "Clear"
  | "Rain"
  | "Storm"
  | "Fog"
  | "Snow"
  | "Heatwave";

export type TimeOfDay = "Dawn" | "Day" | "Dusk" | "Night";

export type RiskLevel = "Low" | "Moderate" | "High" | "Severe" | "Critical";

export interface SimulationInput {
  incidentType: IncidentType;
  occupancy: OccupancyLevel;
  weather: WeatherCondition;
  timeOfDay: TimeOfDay;
  responseEta: number; // minutes
  severity: number; // 1-10
  location: string;
}

export interface ResourceAllocation {
  name: string;
  required: number;
  available: number;
  color: string;
}

export interface ImpactBreakdownItem {
  category: string;
  value: number;
  color: string;
}

export interface ResponseImprovementPoint {
  stage: string;
  traditional: number;
  optimized: number;
}

export interface TimelineEvent {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  status: "completed" | "active" | "pending";
  icon: string;
  duration: string;
}

export interface SimulationResult {
  impactScore: number; // 0-100
  riskLevel: RiskLevel;
  estimatedInjured: number;
  estimatedFatalities: number;
  ambulancesRequired: number;
  fireEnginesRequired: number;
  rescueTeamsRequired: number;
  hospitalCapacityUsed: number; // percent
  estimatedContainmentTime: string;
  confidenceScore: number; // 0-100
  resourceAllocation: ResourceAllocation[];
  impactBreakdown: ImpactBreakdownItem[];
  responseImprovement: ResponseImprovementPoint[];
  timeline: TimelineEvent[];
  recommendations: string[];
  incidentId: string;
  generatedAt: string;
}
