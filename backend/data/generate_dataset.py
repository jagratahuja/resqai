import pandas as pd
import numpy as np
import os

def generate_emergency_data(num_samples=20000000):
    np.random.seed(42)
    
    incident_types = ['Fire', 'Building Collapse', 'Flood', 'Road Accident', 'Chemical Leak']
    weather_conditions = ['Clear', 'Rain', 'Storm', 'Snow', 'Fog']
    time_of_day = ['Morning', 'Afternoon', 'Evening', 'Night']
    
    print(f"Generating {num_samples} base records...")
    inc_types = np.random.choice(incident_types, num_samples)
    weather = np.random.choice(weather_conditions, num_samples)
    tod = np.random.choice(time_of_day, num_samples)
    
    occupancy = np.zeros(num_samples, dtype=int)
    severity = np.zeros(num_samples, dtype=int)
    
    print("Applying conditionals...")
    m_collapse = inc_types == 'Building Collapse'
    occupancy[m_collapse] = np.random.randint(50, 1000, np.sum(m_collapse))
    severity[m_collapse] = np.random.randint(7, 11, np.sum(m_collapse))
    
    m_chem = inc_types == 'Chemical Leak'
    occupancy[m_chem] = np.random.randint(10, 500, np.sum(m_chem))
    severity[m_chem] = np.random.randint(6, 10, np.sum(m_chem))
    
    m_fire = inc_types == 'Fire'
    occupancy[m_fire] = np.random.randint(5, 300, np.sum(m_fire))
    severity[m_fire] = np.random.randint(4, 10, np.sum(m_fire))
    
    m_road = inc_types == 'Road Accident'
    occupancy[m_road] = np.random.randint(1, 50, np.sum(m_road))
    severity[m_road] = np.random.randint(3, 9, np.sum(m_road))
    
    m_flood = inc_types == 'Flood'
    occupancy[m_flood] = np.random.randint(100, 5000, np.sum(m_flood))
    severity[m_flood] = np.random.randint(5, 10, np.sum(m_flood))
    
    print("Calculating penalties and scores...")
    eta_base = np.random.randint(5, 30, num_samples)
    weather_penalty = np.zeros(num_samples, dtype=int)
    weather_penalty[weather == 'Rain'] = 10
    weather_penalty[weather == 'Fog'] = 15
    weather_penalty[weather == 'Snow'] = 20
    weather_penalty[weather == 'Storm'] = 25
    
    response_eta = eta_base + weather_penalty + np.random.randint(-5, 5, num_samples)
    response_eta = np.maximum(5, response_eta)
    
    temperature = np.random.randint(-10, 40, num_samples)
    
    occ_norm = np.minimum(occupancy / 1000.0, 1.0)
    sev_norm = severity / 10.0
    eta_norm = np.minimum(response_eta / 60.0, 1.0)
    weather_norm = weather_penalty / 25.0
    
    interaction_penalty = np.zeros(num_samples)
    interaction_penalty[occupancy > 500] += 0.15
    interaction_penalty[weather == 'Storm'] += 0.10
    interaction_penalty[inc_types == 'Chemical Leak'] += 0.20
    interaction_penalty[(occupancy > 300) & np.isin(weather, ['Storm', 'Rain'])] += 0.15
    
    raw_impact = (0.4 * sev_norm) + (0.3 * occ_norm) + (0.2 * eta_norm) + (0.1 * weather_norm) + interaction_penalty
    impact_score = raw_impact * 100 + np.random.normal(0, 10, num_samples)
    impact_score = np.clip(impact_score, 10, 100)
    
    injured_base = (impact_score / 100) * (occupancy * 0.2)
    estimated_injured = (injured_base * np.random.uniform(0.5, 1.5, num_samples)).astype(int)
    estimated_injured = np.maximum(0, estimated_injured)
    
    print("Building DataFrame...")
    df = pd.DataFrame({
        'incident_id': np.arange(1000, 1000 + num_samples),
        'incident_type': inc_types,
        'occupancy': occupancy,
        'weather': weather,
        'time_of_day': tod,
        'response_eta': response_eta,
        'severity_indicator': severity,
        'temperature': temperature,
        'impact_score': np.round(impact_score, 2),
        'estimated_injured': estimated_injured
    })
    
    return df

if __name__ == '__main__':
    df = generate_emergency_data(20000000)
    output_dir = os.path.dirname(os.path.abspath(__file__))
    output_path = os.path.join(output_dir, 'emergency_incidents.csv')
    print(f"Saving {len(df)} records to CSV (this may take a moment)...")
    df.to_csv(output_path, index=False)
    print(f"Successfully saved to {output_path}")
    print("\nSample Data:")
    print(df.head())
