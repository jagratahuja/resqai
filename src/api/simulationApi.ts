import { buildTimeline, buildRecommendations, riskFromScore } from "../data/mockEngine";
import type { SimulationInput, SimulationResult, MultiIncidentResult, ModelMetrics } from "../types";

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
    const inc = data.incidents[0];
    const opt = data.optimization;
    
    const impactScore = inc.impact;
    const risk = riskFromScore(impactScore);
    const req = {
        ambulances: inc.req_ambulances,
        fire_engines: inc.req_fire_engines,
        rescue_teams: inc.req_rescue_teams,
        hospital_beds: inc.req_hospital_beds
    };
    const alloc = opt.allocations[inc.id] || req;

    const resourceAllocation = [
      { name: "Ambulances", required: req.ambulances, available: alloc.ambulances, color: "#4aa8ff" },
      { name: "Fire Engines", required: req.fire_engines, available: alloc.fire_engines, color: "#ff5a5f" },
      { name: "Rescue Teams", required: req.rescue_teams, available: alloc.rescue_teams, color: "#3ee9b5" },
      { name: "Hospital Beds", required: req.hospital_beds, available: alloc.hospital_beds, color: "#9b8cff" },
    ];

    // Incident-specific breakdown logic based on input
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
      impactScore,
      riskLevel: risk,
      estimatedInjured: inc.estimated_injured,
      estimatedFatalities: Math.max(0, Math.round(inc.estimated_injured * 0.06 * (input.severity / 10))),
      ambulancesRequired: req.ambulances,
      fireEnginesRequired: req.fire_engines,
      rescueTeamsRequired: req.rescue_teams,
      hospitalCapacityUsed: Math.min(100, Math.round((req.hospital_beds / 100) * 100)),
      estimatedContainmentTime: `${hours}h ${mins}m`,
      resourceAllocation,
      impactBreakdown,
      timeline: buildTimeline(input.responseEta),
      recommendations: buildRecommendations(input.incidentType, input.weather, risk),
      incidentId: inc.id,
      generatedAt: new Date().toISOString(),
      optimizationResult: opt
    };
  } catch (error) {
    console.error("Failed to call ML backend", error);
    throw error;
  }
}

export async function runMultiIncidentSimulation(count: number = 4): Promise<MultiIncidentResult> {
  const response = await fetch(`${API_BASE}/simulate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ count })
  });
  if (!response.ok) throw new Error('API Request Failed');
  return await response.json();
}

export async function getModelMetrics(): Promise<ModelMetrics> {
  const response = await fetch(`${API_BASE}/model-info`);
  if (!response.ok) throw new Error('API Request Failed');
  return await response.json();
}

export async function checkHealth(): Promise<boolean> {
    try {
        const response = await fetch(`${API_BASE}/health`);
        return response.ok;
    } catch {
        return false;
    }
}
