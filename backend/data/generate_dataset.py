import pandas as pd
import numpy as np
import random
import os

def generate_emergency_data(num_samples=1000):
    np.random.seed(42)
    random.seed(42)

    incident_types = ['Fire', 'Building Collapse', 'Flood', 'Road Accident', 'Chemical Leak']
    weather_conditions = ['Clear', 'Rain', 'Storm', 'Snow', 'Fog']
    time_of_day = ['Morning', 'Afternoon', 'Evening', 'Night']

    data = []

    for i in range(num_samples):
        incident_id = f"INC-{1000 + i}"
        incident_type = random.choice(incident_types)
        
        # Base characteristics depending on incident
        if incident_type == 'Building Collapse':
            occupancy = np.random.randint(50, 1000)
            severity = np.random.randint(7, 11)
        elif incident_type == 'Chemical Leak':
            occupancy = np.random.randint(10, 500)
            severity = np.random.randint(6, 10)
        elif incident_type == 'Fire':
            occupancy = np.random.randint(5, 300)
            severity = np.random.randint(4, 10)
        elif incident_type == 'Road Accident':
            occupancy = np.random.randint(1, 50)
            severity = np.random.randint(3, 9)
        else: # Flood
            occupancy = np.random.randint(100, 5000)
            severity = np.random.randint(5, 10)

        weather = random.choice(weather_conditions)
        tod = random.choice(time_of_day)
        
        # Weather impact on ETA and severity
        eta_base = np.random.randint(5, 30)
        weather_penalty = {'Clear': 0, 'Rain': 10, 'Fog': 15, 'Snow': 20, 'Storm': 25}[weather]
        response_eta = eta_base + weather_penalty + np.random.randint(-5, 5)
        response_eta = max(5, response_eta)

        temperature = np.random.randint(-10, 40)
        
        # Calculate impact score based on weighted factors
        # Normalize variables for calculation
        occ_norm = min(occupancy / 1000.0, 1.0) # Cap at 1.0 for impact calc
        sev_norm = severity / 10.0
        eta_norm = min(response_eta / 60.0, 1.0)
        weather_norm = weather_penalty / 25.0
        
        # Add non-linear interactions
        interaction_penalty = 0
        if occupancy > 500:
            interaction_penalty += 0.15
        if weather == "Storm":
            interaction_penalty += 0.10
        if incident_type == "Chemical Leak":
            interaction_penalty += 0.20
        if occupancy > 300 and weather in ["Storm", "Rain"]:
            interaction_penalty += 0.15

        # Weighted sum (max theoretical ~ 1.0)
        raw_impact = (0.4 * sev_norm) + (0.3 * occ_norm) + (0.2 * eta_norm) + (0.1 * weather_norm) + interaction_penalty
        
        # Add some non-linear scaling and noise
        impact_score = raw_impact * 100 + np.random.normal(0, 10)
        impact_score = np.clip(impact_score, 10, 100) # Keep between 10 and 100
        
        # Estimated injured correlates heavily with impact score and occupancy
        injured_base = (impact_score / 100) * (occupancy * 0.2)
        estimated_injured = int(injured_base * np.random.uniform(0.5, 1.5))
        estimated_injured = max(0, estimated_injured)

        data.append({
            'incident_id': incident_id,
            'incident_type': incident_type,
            'occupancy': occupancy,
            'weather': weather,
            'time_of_day': tod,
            'response_eta': response_eta,
            'severity_indicator': severity,
            'temperature': temperature,
            'impact_score': round(impact_score, 2),
            'estimated_injured': estimated_injured
        })

    df = pd.DataFrame(data)
    return df

if __name__ == '__main__':
    df = generate_emergency_data(1000)
    output_dir = os.path.dirname(os.path.abspath(__file__))
    output_path = os.path.join(output_dir, 'emergency_incidents.csv')
    df.to_csv(output_path, index=False)
    print(f"Generated {len(df)} records. Saved to {output_path}")
    print("\nSample Data:")
    print(df.head())
