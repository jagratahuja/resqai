# ResQAI v2.0 — Competition Hardening Sprint

## Objective

Transform ResQAI from a polished prototype into a technically defensible competition project that can withstand scrutiny from judges while maintaining its strong visual presentation.

Current Goal:

- Remove fake or misleading metrics
- Strengthen ML credibility
- Make the LP optimizer the centerpiece
- Build a compelling multi-incident optimization workflow
- Improve technical depth without overcomplicating the system

---

# Sprint 1 — Remove Artificial / Mocked Metrics

## A1 — Remove Fake Confidence Score

Current Issue:
- Confidence score is generated randomly.
- Does not represent model confidence.

Action:
- Remove the confidence score entirely OR
- Replace with a real uncertainty metric in the future.

Success Criteria:
- No random confidence values displayed anywhere.

Priority:
🔴 Critical

---

## A2 — Replace Fake Impact Breakdown

Current Issue:
- Impact Breakdown chart uses hardcoded percentages.

Action:
- Use Random Forest feature importance values.
- Save feature importances inside model_metrics.json.
- Expose them via GET /model-info.
- Render them dynamically.

Expected Output:

Occupancy
Severity Indicator
Weather
Response ETA
Incident Type

Success Criteria:
- Impact Breakdown chart reflects actual ML model behavior.

Priority:
🔴 Critical

---

## A3 — Replace Fake Response Improvement Chart

Current Issue:
- Chart uses static values unrelated to optimization results.

Action:
Replace with:

- Resource Fulfillment %
- Ambulance Coverage %
- Fire Engine Coverage %
- Rescue Team Coverage %
- Hospital Bed Coverage %

Source:
- LP optimizer outputs

Success Criteria:
- Every chart value is generated from backend optimization results.

Priority:
🔴 Critical

---

# Sprint 2 — Improve Machine Learning Credibility

## B1 — Audit Dataset Generation

Inspect:

backend/data/generate_dataset.py

Determine:

- How impact_score is generated
- Whether the model is learning a formula
- Whether relationships are realistic

Success Criteria:
- Full understanding of target generation logic.

Priority:
🟠 High

---

## B2 — Add Non-Linear Relationships

Current Issue:
- Dataset may be too deterministic.

Examples:

if occupancy > 500:
    impact += 15

if weather == "Storm":
    impact += 10

if incident_type == "Chemical Leak":
    impact += 20

if occupancy > 300 and weather == "Storm":
    impact += 15

Goal:
- Force the model to learn interactions.

Success Criteria:
- Dataset contains realistic feature interactions.

Priority:
🟠 High

---

## B3 — Increase Controlled Randomness

Current Issue:
- Predictions may be too easy.

Action:
Increase noise slightly:

np.random.normal(0, 10)

instead of

np.random.normal(0, 2)

Goal:
- Create a more realistic prediction problem.

Success Criteria:
- Model performance remains strong while avoiding overfitting.

Priority:
🟡 Medium

---

# Sprint 3 — Make Linear Programming the Star

## C1 — Expose Solver Metadata

Current Issue:
- LP solver acts as a black box.

Action:
Return:

{
  "status": "Optimal",
  "objective": 1250.7,
  "fulfillment": 92.4
}

Display in UI.

Success Criteria:
- Judges can clearly see optimization results.

Priority:
🔴 Critical

---

## C2 — Demand vs Allocation View

For each resource:

- Required
- Allocated
- Shortfall

Example:

Ambulances

Required: 8
Allocated: 5
Shortfall: 3

Success Criteria:
- Optimization outcomes are immediately visible.

Priority:
🔴 Critical

---

## C3 — Incident Priority Ranking

Display:

Incident A
Impact Score: 91

Incident B
Impact Score: 74

Incident C
Impact Score: 58

Show resource allocation decisions alongside rankings.

Success Criteria:
- LP prioritization becomes visually obvious.

Priority:
🟠 High

---

# Sprint 4 — Multi-Incident Optimization

## D1 — Multi-Incident Workflow

Flow:

Multiple Incidents
↓
ML Prediction
↓
Combined Resource Demand
↓
LP Optimization
↓
Allocation Dashboard

Goal:
- Demonstrate both AI and Mathematical Optimization simultaneously.

Success Criteria:
- Multi-incident mode becomes the flagship demo feature.

Priority:
🔴 Critical

---

## D2 — Shared Resource Pool Visualization

Display:

Available Resources

↓

Requested Resources

↓

Optimized Allocation

Goal:
- Clearly communicate resource scarcity.

Success Criteria:
- Judges understand why optimization is necessary.

Priority:
🟠 High

---

# Sprint 5 — Competition Demo Preparation

## Demo Structure

### Slide 1

Problem Statement

Cities face multiple emergencies simultaneously.

---

### Slide 2

Current Challenge

Emergency resources are limited.

Manual decisions are slow.

---

### Slide 3

Solution

ResQAI combines:

- Machine Learning
- Linear Programming

to improve emergency response.

---

### Slide 4

Live Multi-Incident Demo

Generate:

- Fire
- Road Accident
- Flood
- Chemical Leak
- Building Collapse

---

### Slide 5

Optimization Dashboard

Show:

- Impact Scores
- Resource Requests
- Resource Allocation
- Priority Rankings

---

### Slide 6

Results

Display:

- Resource Fulfillment %
- Allocation Efficiency
- Solver Status
- Optimization Outcomes

Only display metrics that are genuinely derived from backend results.

---

# Technical Debt Tracker

## Critical

- Remove fake confidence score
- Replace fake impact breakdown
- Replace fake response chart
- Add LP solver metadata
- Build multi-incident optimization dashboard

## Competition Blockers

- Improve synthetic dataset realism
- Improve LP visibility
- Expose ML model metrics

## Nice To Have

- UI animations
- Additional visual polish
- Advanced transitions
- Landing page enhancements

---

# Target Outcome

Current:
7.0–7.5 / 10

Target:
8.5–9.0 / 10

Primary Focus:

Make every major chart, metric, and dashboard component originate from:

- Machine Learning outputs
- Optimization outputs

instead of mock or hardcoded values.