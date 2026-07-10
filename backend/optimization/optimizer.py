import logging
from pulp import LpProblem, LpMaximize, LpVariable, LpStatus, lpSum, value, PULP_CBC_CMD

logger = logging.getLogger(__name__)

def optimize_resources(incidents, total_resources):
    """
    Optimally allocate available resources to multiple concurrent incidents.
    
    Args:
        incidents (list of dict): List of incidents with their required resources and impact score.
            Format: [{'id': 'INC-1', 'impact': 80, 'req_ambulances': 5, 'req_fire_engines': 2, 'req_rescue_teams': 3, 'req_hospital_beds': 15}]
        total_resources (dict): Available total resources.
            Format: {'ambulances': 20, 'fire_engines': 10, 'rescue_teams': 10, 'hospital_beds': 50}
            
    Returns:
        dict: Optimization result containing status, objective_value, and allocations
    """
    
    if not incidents:
        return {
            'status': 'Optimal',
            'objective_value': 0.0,
            'total_requested_resources': 0,
            'total_allocated_resources': 0,
            'fulfillment_percentage': 100.0,
            'allocations': {}
        }
    
    # Initialize the problem
    prob = LpProblem("Resource_Allocation", LpMaximize)
    
    # Decision Variables
    alloc_vars = {}
    for inc in incidents:
        inc_id = inc['id']
        alloc_vars[inc_id] = {
            'ambulances': LpVariable(f"amb_{inc_id}", 0, inc.get('req_ambulances', 0), cat='Integer'),
            'fire_engines': LpVariable(f"fire_{inc_id}", 0, inc.get('req_fire_engines', 0), cat='Integer'),
            'rescue_teams': LpVariable(f"res_{inc_id}", 0, inc.get('req_rescue_teams', 0), cat='Integer'),
            'hospital_beds': LpVariable(f"beds_{inc_id}", 0, inc.get('req_hospital_beds', 0), cat='Integer')
        }
        
    # Objective Function: Maximize weighted allocation based on impact score
    # We want to fulfill high impact incidents first.
    objective = lpSum([
        inc['impact'] * (alloc_vars[inc['id']]['ambulances'] + 
                         alloc_vars[inc['id']]['fire_engines'] * 2 + # Fire engines and rescue teams are weighted heavier
                         alloc_vars[inc['id']]['rescue_teams'] * 2 +
                         alloc_vars[inc['id']]['hospital_beds'] * 0.5) 
        for inc in incidents
    ])
    prob += objective
    
    # Constraints: Total allocated cannot exceed total available
    prob += lpSum([alloc_vars[inc['id']]['ambulances'] for inc in incidents]) <= total_resources.get('ambulances', 999), "Total_Ambulances"
    prob += lpSum([alloc_vars[inc['id']]['fire_engines'] for inc in incidents]) <= total_resources.get('fire_engines', 999), "Total_Fire_Engines"
    prob += lpSum([alloc_vars[inc['id']]['rescue_teams'] for inc in incidents]) <= total_resources.get('rescue_teams', 999), "Total_Rescue_Teams"
    prob += lpSum([alloc_vars[inc['id']]['hospital_beds'] for inc in incidents]) <= total_resources.get('hospital_beds', 9999), "Total_Hospital_Beds"
    
    # Solve the problem
    prob.solve(PULP_CBC_CMD(msg=False))
    
    # Parse results and calculate fulfillment
    allocation_plan = {}
    total_requested_resources = 0
    total_allocated_resources = 0
    
    for inc in incidents:
        inc_id = inc['id']
        req_total = (inc.get('req_ambulances', 0) + inc.get('req_fire_engines', 0) + 
                     inc.get('req_rescue_teams', 0) + inc.get('req_hospital_beds', 0))
        
        alloc_amb = int(value(alloc_vars[inc_id]['ambulances']) or 0)
        alloc_fire = int(value(alloc_vars[inc_id]['fire_engines']) or 0)
        alloc_res = int(value(alloc_vars[inc_id]['rescue_teams']) or 0)
        alloc_beds = int(value(alloc_vars[inc_id]['hospital_beds']) or 0)
        
        alloc_total = alloc_amb + alloc_fire + alloc_res + alloc_beds
        
        total_requested_resources += req_total
        total_allocated_resources += alloc_total
        
        allocation_plan[inc_id] = {
            'ambulances': alloc_amb,
            'fire_engines': alloc_fire,
            'rescue_teams': alloc_res,
            'hospital_beds': alloc_beds
        }
        
    fulfillment_percentage = (total_allocated_resources / total_requested_resources * 100) if total_requested_resources > 0 else 100.0
    
    obj_value = value(prob.objective)
        
    return {
        'status': LpStatus[prob.status],
        'objective_value': float(obj_value) if obj_value is not None else 0.0,
        'total_requested_resources': total_requested_resources,
        'total_allocated_resources': total_allocated_resources,
        'fulfillment_percentage': round(fulfillment_percentage, 1),
        'allocations': allocation_plan
    }

if __name__ == '__main__':
    # Test cases
    incidents = [
        {'id': 'INC-1', 'impact': 92, 'req_ambulances': 6, 'req_fire_engines': 3, 'req_rescue_teams': 5, 'req_hospital_beds': 15},
        {'id': 'INC-2', 'impact': 60, 'req_ambulances': 4, 'req_fire_engines': 2, 'req_rescue_teams': 2, 'req_hospital_beds': 8},
        {'id': 'INC-3', 'impact': 40, 'req_ambulances': 2, 'req_fire_engines': 1, 'req_rescue_teams': 1, 'req_hospital_beds': 3}
    ]
    
    total_resources = {
        'ambulances': 8,
        'fire_engines': 4,
        'rescue_teams': 5,
        'hospital_beds': 20
    }
    
    print("Testing Optimizer...")
    print("Available:", total_resources)
    result = optimize_resources(incidents, total_resources)
    
    print(f"Status: {result['status']}, Objective: {result['objective_value']}")
    for inc_id, alloc in result['allocations'].items():
        print(f"Allocation for {inc_id}: {alloc}")
