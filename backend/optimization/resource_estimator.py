import math

def estimate_resources(incident_type, impact_score, estimated_injured):
    """
    Convert impact score and estimated injured into actionable resource requirements.
    
    Args:
        incident_type (str): Type of emergency.
        impact_score (float): ML predicted impact score (0-100).
        estimated_injured (int): Estimated number of injured people.
        
    Returns:
        dict: Required resources (ambulances, fire_engines, rescue_teams)
    """
    
    # Ambulances (Capacity ~ 3 injured per ambulance on average, min 1)
    ambulances_needed = max(1, math.ceil(estimated_injured / 3.0))
    if estimated_injured == 0 and impact_score > 30:
        ambulances_needed = 1 # Precautionary
        
    # Fire Engines
    if incident_type == 'Fire':
        fire_engines_needed = max(2, math.ceil(impact_score / 15.0))
    elif incident_type == 'Chemical Leak':
        fire_engines_needed = max(1, math.ceil(impact_score / 25.0))
    elif incident_type == 'Building Collapse':
        fire_engines_needed = max(1, math.ceil(impact_score / 30.0))
    else:
        fire_engines_needed = max(0, math.ceil(impact_score / 50.0))
        
    # Rescue Teams
    if incident_type == 'Building Collapse':
        rescue_teams_needed = max(3, math.ceil(impact_score / 10.0))
    elif incident_type == 'Flood':
        rescue_teams_needed = max(2, math.ceil(impact_score / 15.0))
    elif incident_type == 'Road Accident':
        rescue_teams_needed = max(1, math.ceil(impact_score / 20.0))
    else:
        rescue_teams_needed = max(1, math.ceil(impact_score / 30.0))
    # Hospital Beds
    hospital_beds_needed = max(0, math.ceil(estimated_injured * 0.8))
        
    return {
        'ambulances': int(ambulances_needed),
        'fire_engines': int(fire_engines_needed),
        'rescue_teams': int(rescue_teams_needed),
        'hospital_beds': int(hospital_beds_needed)
    }

if __name__ == '__main__':
    # Test cases
    print("Testing Resource Estimator:")
    print("Test 1 (Building Collapse, Impact 92, Injured 46):")
    print(estimate_resources('Building Collapse', 92, 46))
    
    print("\nTest 2 (Fire, Impact 60, Injured 10):")
    print(estimate_resources('Fire', 60, 10))
    
    print("\nTest 3 (Road Accident, Impact 40, Injured 5):")
    print(estimate_resources('Road Accident', 40, 5))
