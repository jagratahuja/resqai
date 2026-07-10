export type IncidentType =
  | "Fire"
  | "Building Collapse"
  | "Flood"
  | "Road Accident"
  | "Chemical Leak";

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
  occupancy: number;
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
  resourceAllocation: ResourceAllocation[];
  impactBreakdown: ImpactBreakdownItem[];
  timeline: TimelineEvent[];
  recommendations: string[];
  incidentId: string;
  generatedAt: string;
  optimizationResult?: OptimizationResult;
}

export interface ModelMetrics {
  mae: number;
  rmse: number;
  r2: number;
  dataset_size: number;
  feature_importance: Array<{
    Feature: string;
    Importance: number;
  }>;
}

export interface OptimizationAllocation {
  ambulances: number;
  fire_engines: number;
  rescue_teams: number;
  hospital_beds: number;
}

export interface OptimizationResult {
  status: string;
  objective_value: number;
  total_requested_resources: number;
  total_allocated_resources: number;
  fulfillment_percentage: number;
  allocations: Record<string, OptimizationAllocation>;
}

export interface MultiIncidentEntry {
  id: string;
  incident_type: string;
  location?: string;
  impact: number;
  estimated_injured: number;
  occupancy: number;
  weather?: string;
  response_eta?: number;
  severity_indicator?: number;
  // Mapped properties used by IncidentComparisonGrid
  incidentId?: string;
  incidentType?: string;
  impactScore?: number;
  riskLevel?: RiskLevel;
  estimatedInjured?: number;
  req_ambulances?: number;
  req_fire_engines?: number;
  req_rescue_teams?: number;
  req_hospital_beds?: number;
}

export interface MultiIncidentResult {
  incidents: MultiIncidentEntry[];
  optimization: OptimizationResult;
}
