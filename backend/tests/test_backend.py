"""
Unit tests for the RESQAI backend.
Covers: resource_estimator, optimizer, and Flask API routes.
"""
import os
import sys
import json
import pytest

# Ensure backend module is importable
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from optimization.resource_estimator import estimate_resources
from optimization.optimizer import optimize_resources


# =====================================================
# Resource Estimator Tests
# =====================================================
class TestResourceEstimator:
    """Tests for the resource estimation engine."""

    def test_fire_incident_high_impact(self):
        result = estimate_resources('Fire', 90, 30)
        assert result['ambulances'] >= 1
        assert result['fire_engines'] >= 2  # Fire always requires min 2
        assert result['rescue_teams'] >= 1
        assert result['hospital_beds'] >= 0

    def test_building_collapse_high_severity(self):
        result = estimate_resources('Building Collapse', 92, 46)
        assert result['rescue_teams'] >= 3  # Building collapse requires min 3
        assert result['ambulances'] >= 1
        assert result['hospital_beds'] >= 1

    def test_road_accident_low_impact(self):
        result = estimate_resources('Road Accident', 20, 2)
        assert result['ambulances'] >= 1
        assert result['fire_engines'] >= 0

    def test_zero_injured_with_high_impact(self):
        """Should still deploy precautionary ambulance when impact > 30."""
        result = estimate_resources('Flood', 50, 0)
        assert result['ambulances'] >= 1

    def test_zero_injured_low_impact(self):
        """No precautionary ambulance needed when impact <= 30."""
        result = estimate_resources('Road Accident', 10, 0)
        assert result['ambulances'] >= 0

    def test_chemical_leak_resources(self):
        result = estimate_resources('Chemical Leak', 80, 20)
        assert result['fire_engines'] >= 1
        assert result['ambulances'] >= 1

    def test_all_values_are_integers(self):
        result = estimate_resources('Fire', 75.5, 15)
        for key, val in result.items():
            assert isinstance(val, int), f"{key} should be int, got {type(val)}"

    def test_all_resource_keys_present(self):
        result = estimate_resources('Flood', 50, 10)
        expected_keys = {'ambulances', 'fire_engines', 'rescue_teams', 'hospital_beds'}
        assert set(result.keys()) == expected_keys


# =====================================================
# Optimizer Tests
# =====================================================
class TestOptimizer:
    """Tests for the LP optimization engine."""

    def test_basic_optimization(self):
        incidents = [
            {'id': 'INC-1', 'impact': 92, 'req_ambulances': 6, 'req_fire_engines': 3, 'req_rescue_teams': 5, 'req_hospital_beds': 15},
            {'id': 'INC-2', 'impact': 60, 'req_ambulances': 4, 'req_fire_engines': 2, 'req_rescue_teams': 2, 'req_hospital_beds': 8},
        ]
        total_resources = {'ambulances': 8, 'fire_engines': 4, 'rescue_teams': 5, 'hospital_beds': 20}

        result = optimize_resources(incidents, total_resources)
        assert result['status'] == 'Optimal'
        assert 'INC-1' in result['allocations']
        assert 'INC-2' in result['allocations']
        assert result['fulfillment_percentage'] > 0

    def test_empty_incidents(self):
        result = optimize_resources([], {'ambulances': 10})
        assert result['status'] == 'Optimal'
        assert result['total_requested_resources'] == 0
        assert result['fulfillment_percentage'] == 100.0
        assert result['allocations'] == {}

    def test_abundant_resources(self):
        """When resources exceed demand, fulfillment should be 100%."""
        incidents = [
            {'id': 'INC-1', 'impact': 50, 'req_ambulances': 2, 'req_fire_engines': 1, 'req_rescue_teams': 1, 'req_hospital_beds': 5},
        ]
        total_resources = {'ambulances': 100, 'fire_engines': 100, 'rescue_teams': 100, 'hospital_beds': 100}

        result = optimize_resources(incidents, total_resources)
        assert result['status'] == 'Optimal'
        assert result['fulfillment_percentage'] == 100.0

    def test_scarce_resources_prioritizes_high_impact(self):
        """High-impact incidents should get priority when resources are scarce."""
        incidents = [
            {'id': 'HIGH', 'impact': 95, 'req_ambulances': 5, 'req_fire_engines': 0, 'req_rescue_teams': 0, 'req_hospital_beds': 0},
            {'id': 'LOW', 'impact': 10, 'req_ambulances': 5, 'req_fire_engines': 0, 'req_rescue_teams': 0, 'req_hospital_beds': 0},
        ]
        total_resources = {'ambulances': 5, 'fire_engines': 0, 'rescue_teams': 0, 'hospital_beds': 0}

        result = optimize_resources(incidents, total_resources)
        assert result['status'] == 'Optimal'
        assert result['allocations']['HIGH']['ambulances'] >= result['allocations']['LOW']['ambulances']

    def test_result_keys(self):
        incidents = [{'id': 'T1', 'impact': 50, 'req_ambulances': 1, 'req_fire_engines': 1, 'req_rescue_teams': 1, 'req_hospital_beds': 1}]
        total_resources = {'ambulances': 10, 'fire_engines': 10, 'rescue_teams': 10, 'hospital_beds': 10}

        result = optimize_resources(incidents, total_resources)
        expected_keys = {'status', 'objective_value', 'total_requested_resources', 'total_allocated_resources', 'fulfillment_percentage', 'allocations'}
        assert set(result.keys()) == expected_keys


# =====================================================
# Flask API Tests
# =====================================================
class TestFlaskAPI:
    """Tests for Flask API endpoints."""

    @pytest.fixture
    def client(self):
        from app import app
        app.config['TESTING'] = True
        with app.test_client() as client:
            yield client

    def test_health_endpoint(self, client):
        response = client.get('/health')
        assert response.status_code == 200
        data = response.get_json()
        assert data['status'] == 'ok'
        assert 'model_loaded' in data

    def test_model_info_endpoint(self, client):
        response = client.get('/model-info')
        assert response.status_code == 200

    def test_predict_missing_body(self, client):
        response = client.post('/predict', content_type='application/json')
        assert response.status_code in (400, 415)

    def test_predict_invalid_incident_type(self, client):
        response = client.post('/predict',
            json={'incident_type': 'Earthquake'},
            content_type='application/json'
        )
        assert response.status_code == 400

    def test_multi_predict_empty_incidents(self, client):
        response = client.post('/multi-predict',
            json={'incidents': []},
            content_type='application/json'
        )
        assert response.status_code == 400


if __name__ == '__main__':
    pytest.main([__file__, '-v'])
