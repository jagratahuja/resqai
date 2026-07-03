import { generateMockResult } from "../data/mockEngine";
import type { SimulationInput, SimulationResult } from "../types";

const LATENCY_MS = 1600;

export function runSimulation(input: SimulationInput): Promise<SimulationResult> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() < 0.02) {
        reject(new Error("Simulation engine timeout. Retry requested."));
        return;
      }
      resolve(generateMockResult(input));
    }, LATENCY_MS);
  });
}
