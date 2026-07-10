import { buildTimeline, buildRecommendations, riskFromScore } from "../data/mockEngine";
import type { SimulationInput, SimulationResult, MultiIncidentResult, ModelMetrics, OptimizationResult } from "../types";

interface ApiIncidentResponse {
  id: string;
  impact?: number;
  impactScore?: number;
  estimated_injured?: number;
  estimatedInjured?: number;
  req_ambulances: number;
  req_fire_engines: number;
  req_rescue_teams: number;
  req_hospital_beds: number;
}
const API_BASE = 'http://127.0.0.1:5000';

export async function runSimulation(input: SimulationInput): Promise<SimulationResult> {
  try {
    const response = await fetch(`${API_BASE}/multi-predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        incidents: [{
          id: `RQ-${Date.now().toString(36).toUpperCase().slice(-6)}`,
          incident_type: input.incidentType,
          occupancy: input.occupancy,
          weather: input.weather,
          response_eta: input.responseEta,
          severity_indicator: input.severity
        }]
      })
    });
    
    if (!response.ok) throw new Error('API Request Failed');
    
    const data = await response.json();
    return formatSimulationResult(data.incidents[0], data.optimization, input);
  } catch (error) {
    console.warn("Backend unavailable, using simulated ML fallback.");
    return getMockSimulationResult(input);
  }
}

function formatSimulationResult(inc: ApiIncidentResponse, opt: OptimizationResult, input: SimulationInput): SimulationResult {
    const impactScore = inc.impact ?? inc.impactScore ?? 0;
    const risk = riskFromScore(impactScore);
    const req = {
        ambulances: inc.req_ambulances,
        fire_engines: inc.req_fire_engines,
        rescue_teams: inc.req_rescue_teams,
        hospital_beds: inc.req_hospital_beds
    };
    const alloc = opt?.allocations?.[inc.id] || req;

    const resourceAllocation = [
      { name: "Ambulances", required: req.ambulances, available: alloc.ambulances, color: "#4aa8ff" },
      { name: "Fire Engines", required: req.fire_engines, available: alloc.fire_engines, color: "#ff5a5f" },
      { name: "Rescue Teams", required: req.rescue_teams, available: alloc.rescue_teams, color: "#3ee9b5" },
      { name: "Hospital Beds", required: req.hospital_beds, available: alloc.hospital_beds, color: "#9b8cff" },
    ];

    const occFactor = (input.occupancy / 2000) * 0.4;
    const sevFactor = (input.severity / 10) * 0.3;
    const etaFactor = (input.responseEta / 30) * 0.2;
    const weatherFactor = input.weather === 'Clear' ? 0.05 : 0.1;
    const sum = occFactor + sevFactor + etaFactor + weatherFactor;
    
    const impactBreakdown = [
      { category: "Occupancy Factor", value: Math.round((occFactor / sum) * 100), color: "#ff5a5f" },
      { category: "Severity Factor", value: Math.round((sevFactor / sum) * 100), color: "#ffb547" },
      { category: "ETA Factor", value: Math.round((etaFactor / sum) * 100), color: "#3ee9b5" },
      { category: "Weather Factor", value: Math.round((weatherFactor / sum) * 100), color: "#4aa8ff" },
    ];

    const containmentMins = Math.round(45 + impactScore * 1.8);
    const hours = Math.floor(containmentMins / 60);
    const mins = containmentMins % 60;
    
    return {
      impactScore: impactScore,
      riskLevel: risk,
      estimatedInjured: inc.estimated_injured ?? inc.estimatedInjured ?? 0,
      estimatedFatalities: Math.max(0, Math.round((inc.estimated_injured ?? inc.estimatedInjured ?? 0) * 0.06 * (input.severity / 10))),
      ambulancesRequired: req.ambulances,
      fireEnginesRequired: req.fire_engines,
      rescueTeamsRequired: req.rescue_teams,
      hospitalCapacityUsed: Math.min(100, Math.round((req.hospital_beds / 100) * 100)),
      estimatedContainmentTime: `${hours}h ${mins}m`,
      resourceAllocation,
      impactBreakdown,
      timeline: buildTimeline(input.responseEta),
      recommendations: buildRecommendations(input.incidentType, input.weather, risk),
      incidentId: inc.id || `RQ-${Date.now().toString(36).toUpperCase().slice(-6)}`,
      generatedAt: new Date().toISOString(),
      optimizationResult: opt || getMockOptimization()
    };
}

function getMockSimulationResult(input: SimulationInput): SimulationResult {
  const baseImpact = (input.severity * 8) + (input.occupancy / 100) + (input.responseEta * 1.5);
  const impact = Math.min(99, Math.round(baseImpact));
  
  const mockInc = {
    id: `RQ-${Date.now().toString(36).toUpperCase().slice(-6)}`,
    impact: impact,
    estimated_injured: Math.round(input.occupancy * (input.severity / 20)),
    req_ambulances: Math.ceil(input.severity / 2) + 1,
    req_fire_engines: input.incidentType === 'Fire' ? Math.ceil(input.severity) : 2,
    req_rescue_teams: 3,
    req_hospital_beds: Math.round(input.occupancy * 0.1)
  };
  
  return formatSimulationResult(mockInc, getMockOptimization(), input);
}

function getMockOptimization(): OptimizationResult {
  return {
    status: "Optimal",
    objective_value: 0.85,
    total_requested_resources: 12,
    total_allocated_resources: 12,
    fulfillment_percentage: 100,
    allocations: {}
  };
}

export async function runMultiIncidentSimulation(count: number = 4): Promise<MultiIncidentResult> {
  try {
    const response = await fetch(`${API_BASE}/simulate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ count })
    });
    if (!response.ok) throw new Error('API Request Failed');
    return await response.json();
  } catch (error) {
    console.warn("Backend unavailable, using simulated ML fallback for multi-incident.");
    
    const incidents = Array.from({ length: count }).map((_, i) => ({
      id: `RQ-M${i+1}${Date.now().toString(36).slice(-3)}`,
      incident_type: ["Fire", "Flood", "Building Collapse", "Chemical Leak"][i % 4],
      location: ["Downtown Sector 7", "Riverside Industrial Park", "Highway M-14 Junction", "Old Town Residential Block"][i % 4],
      impact: Math.floor(Math.random() * 40) + 50,
      estimated_injured: Math.floor(Math.random() * 100) + 10,
      occupancy: Math.floor(Math.random() * 500) + 100
    }));

    return {
      incidents,
      optimization: {
        status: "Optimal",
        objective_value: 0.75,
        total_requested_resources: count * 10,
        total_allocated_resources: count * 9,
        fulfillment_percentage: 90,
        allocations: {}
      }
    };
  }
}

export async function getModelMetrics(): Promise<ModelMetrics> {
  try {
    const response = await fetch(`${API_BASE}/model-info`);
    if (!response.ok) throw new Error('API Request Failed');
    return await response.json();
  } catch {
    return {
      mae: 9.8,
      rmse: 14.2,
      r2: 0.89,
      dataset_size: 12500,
      feature_importance: [
        { Feature: "Severity", Importance: 0.35 },
        { Feature: "Occupancy", Importance: 0.25 },
        { Feature: "Response ETA", Importance: 0.20 },
        { Feature: "Weather", Importance: 0.10 },
        { Feature: "Time of Day", Importance: 0.10 }
      ]
    };
  }
}

export async function checkHealth(): Promise<boolean> {
    try {
        const response = await fetch(`${API_BASE}/health`);
        return response.ok;
    } catch {
        return false;
    }
}
