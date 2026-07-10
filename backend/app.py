import os
import random
import uuid
import logging
import joblib
import pandas as pd
import json
from flask import Flask, request, jsonify
from flask_cors import CORS
from optimization.resource_estimator import estimate_resources
from optimization.optimizer import optimize_resources

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

# Load ML Model
base_dir = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.join(base_dir, 'ml', 'trained_model.pkl')
metrics_path = os.path.join(base_dir, 'ml', 'model_metrics.json')
try:
    model = joblib.load(model_path)
    logger.info("Model loaded successfully.")
except Exception as e:
    logger.error("Failed to load model: %s", e)
    model = None

model_metrics = {}
try:
    with open(metrics_path, 'r') as f:
        model_metrics = json.load(f)
except Exception as e:
    logger.warning("Failed to load model metrics: %s", e)

VALID_INCIDENT_TYPES = {'Fire', 'Building Collapse', 'Flood', 'Road Accident', 'Chemical Leak'}
VALID_WEATHER = {'Clear', 'Rain', 'Storm', 'Snow', 'Fog', 'Heatwave'}

@app.route('/health', methods=['GET'])
def health():
    return jsonify({
        'status': 'ok',
        'model_loaded': model is not None
    })

@app.route('/model-info', methods=['GET'])
def model_info():
    return jsonify(model_metrics)

@app.route('/predict', methods=['POST'])
def predict():
    """Predicts impact score and estimates resources for a single incident."""
    data = request.json
    if not data:
        return jsonify({'error': 'Request body must be valid JSON'}), 400

    incident_type = data.get('incident_type')
    if not incident_type or incident_type not in VALID_INCIDENT_TYPES:
        return jsonify({'error': f'Invalid incident_type. Must be one of: {", ".join(sorted(VALID_INCIDENT_TYPES))}'}), 400

    if model is None:
        return jsonify({'error': 'ML model is not loaded. Please train the model first.'}), 503

    try:
        input_data = {
            'incident_type': [incident_type],
            'occupancy': [int(data.get('occupancy', 50))],
            'weather': [data.get('weather', 'Clear')],
            'response_eta': [int(data.get('response_eta', 15))],
            'severity_indicator': [int(data.get('severity_indicator', 5))]
        }
        df = pd.DataFrame(input_data)

        impact_score = float(model.predict(df)[0])

        injured_base = (impact_score / 100.0) * (int(data.get('occupancy', 50)) * 0.2)
        estimated_injured = max(0, int(injured_base))

        resources = estimate_resources(incident_type, impact_score, estimated_injured)

        return jsonify({
            'impact_score': round(impact_score, 2),
            'estimated_injured': estimated_injured,
            'required_resources': resources
        })
    except (ValueError, KeyError) as e:
        logger.warning("Bad request to /predict: %s", e)
        return jsonify({'error': f'Invalid input: {str(e)}'}), 400
    except Exception as e:
        logger.exception("Unexpected error in /predict")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/optimize', methods=['POST'])
def optimize():
    """Optimizes resource allocation across multiple incidents."""
    data = request.json
    if not data:
        return jsonify({'error': 'Request body must be valid JSON'}), 400

    try:
        incidents = data.get('incidents', [])
        if not incidents:
            return jsonify({'error': 'No incidents provided'}), 400

        total_resources = data.get('total_resources', {
            'ambulances': 10,
            'fire_engines': 5,
            'rescue_teams': 5
        })

        allocations = optimize_resources(incidents, total_resources)
        return jsonify({'allocations': allocations})
    except Exception as e:
        logger.exception("Error in /optimize")
        return jsonify({'error': str(e)}), 400

@app.route('/multi-predict', methods=['POST'])
def multi_predict():
    """Predicts impact score for a batch of incidents and optimizes resources."""
    data = request.json
    if not data:
        return jsonify({'error': 'Request body must be valid JSON'}), 400

    incidents_input = data.get('incidents', [])
    total_resources = data.get('total_resources', {
        'ambulances': 30,
        'fire_engines': 15,
        'rescue_teams': 15,
        'hospital_beds': 100
    })

    if not incidents_input:
        return jsonify({'error': 'No incidents provided'}), 400

    if model is None:
        return jsonify({'error': 'ML model is not loaded. Please train the model first.'}), 503

    try:
        df = pd.DataFrame(incidents_input)
        df['occupancy'] = df['occupancy'].astype(int)
        df['response_eta'] = df['response_eta'].astype(int)
        df['severity_indicator'] = df['severity_indicator'].astype(int)

        impact_scores = model.predict(df)

        processed_incidents = []
        for i, inc in enumerate(incidents_input):
            impact = float(impact_scores[i])
            injured_base = (impact / 100.0) * (int(inc.get('occupancy', 50)) * 0.2)
            estimated_injured = max(0, int(injured_base))
            reqs = estimate_resources(inc['incident_type'], impact, estimated_injured)

            processed_incidents.append({
                'id': inc.get('id', f"INC-{uuid.uuid4().hex[:6].upper()}"),
                'incident_type': inc['incident_type'],
                'occupancy': inc.get('occupancy', 50),
                'weather': inc.get('weather', 'Clear'),
                'response_eta': inc.get('response_eta', 15),
                'severity_indicator': inc.get('severity_indicator', 5),
                'impact': impact,
                'estimated_injured': estimated_injured,
                'req_ambulances': reqs['ambulances'],
                'req_fire_engines': reqs['fire_engines'],
                'req_rescue_teams': reqs['rescue_teams'],
                'req_hospital_beds': reqs['hospital_beds']
            })

        # Sort incidents by impact descending (Priority Ranking)
        processed_incidents.sort(key=lambda x: x['impact'], reverse=True)

        opt_result = optimize_resources(processed_incidents, total_resources)

        return jsonify({
            'incidents': processed_incidents,
            'optimization': opt_result
        })
    except (ValueError, KeyError) as e:
        logger.warning("Bad request to /multi-predict: %s", e)
        return jsonify({'error': f'Invalid input: {str(e)}'}), 400
    except Exception as e:
        logger.exception("Unexpected error in /multi-predict")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/simulate', methods=['POST'])
def simulate():
    """Generates a random batch of active incidents and runs them through the pipeline."""
    data = request.json
    if not data:
        return jsonify({'error': 'Request body must be valid JSON'}), 400

    num_incidents = min(data.get('count', 4), 20)  # Cap at 20 to prevent abuse
    total_resources = data.get('total_resources', {
        'ambulances': 15,
        'fire_engines': 8,
        'rescue_teams': 10,
        'hospital_beds': 40
    })

    if model is None:
        return jsonify({'error': 'ML model is not loaded. Please train the model first.'}), 503

    incident_types = list(VALID_INCIDENT_TYPES)
    weather_conditions = ['Clear', 'Rain', 'Storm', 'Snow', 'Fog']

    incidents_input = []
    for _ in range(num_incidents):
        incidents_input.append({
            'id': f"INC-{uuid.uuid4().hex[:6].upper()}",
            'incident_type': random.choice(incident_types),
            'occupancy': random.randint(10, 500),
            'weather': random.choice(weather_conditions),
            'response_eta': random.randint(5, 30),
            'severity_indicator': random.randint(3, 10)
        })

    try:
        df = pd.DataFrame(incidents_input)
        impact_scores = model.predict(df)

        processed_incidents = []
        for i, inc in enumerate(incidents_input):
            impact = float(impact_scores[i])
            injured_base = (impact / 100.0) * (inc['occupancy'] * 0.2)
            estimated_injured = max(0, int(injured_base))
            reqs = estimate_resources(inc['incident_type'], impact, estimated_injured)

            processed_incidents.append({
                'id': inc['id'],
                'incident_type': inc['incident_type'],
                'occupancy': inc['occupancy'],
                'weather': inc['weather'],
                'response_eta': inc['response_eta'],
                'severity_indicator': inc['severity_indicator'],
                'impact': impact,
                'estimated_injured': estimated_injured,
                'req_ambulances': reqs['ambulances'],
                'req_fire_engines': reqs['fire_engines'],
                'req_rescue_teams': reqs['rescue_teams'],
                'req_hospital_beds': reqs['hospital_beds']
            })

        # Sort incidents by impact descending (Priority Ranking)
        processed_incidents.sort(key=lambda x: x['impact'], reverse=True)

        opt_result = optimize_resources(processed_incidents, total_resources)

        return jsonify({
            'incidents': processed_incidents,
            'optimization': opt_result
        })
    except Exception as e:
        logger.exception("Error in /simulate")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
