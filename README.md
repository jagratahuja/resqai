# RESQAI - AI-Powered Emergency Response & Resource Optimization System

RESQAI is an intelligent emergency response command-center designed to predict the impact of emergency incidents and optimally allocate limited rescue resources in real-time. It acts as an advanced dispatch assistant, merging Machine Learning (ML) predictions with Operations Research (OR) mathematical optimization.

## Key Features
1. **Predictive Impact Analytics (Machine Learning)**: Predicts an "Impact Score" and estimates casualties for incidents based on type, weather, occupancy, time of day, and severity using a Random Forest model.
2. **Global Resource Optimization (Operations Research)**: Uses Linear Programming (PuLP) to optimally allocate ambulances, fire engines, rescue teams, and hospital beds across *multiple simultaneous incidents*, prioritizing based on predicted severity and minimizing response shortfall.
3. **Command Center Dashboard**: A real-time, highly interactive frontend built with React, Vite, and Tailwind CSS. Supports toggling between Single-Incident simulation and Multi-Incident AI Dispatch modes.
4. **Flask REST API**: The robust backend powering the application, linking the heavy-lifting optimization and ML models directly to the sleek frontend.

## Team
**The Optimizers 2026** (2 Members)

## Architecture Overview
- **Frontend**: React 18 + Vite + TypeScript + Tailwind CSS + Recharts
- **Backend API**: Python + Flask
- **Data & ML**: Scikit-Learn (Random Forest Regressor), Pandas, NumPy
- **Optimization Engine**: PuLP (Linear Programming Solver)

For a detailed technical deep-dive into the architecture, ML model, and mathematical optimization constraints, please see our [Executive Summary](documentation/app_summary.md).

## Getting Started

### 1. Backend Setup (Flask & ML)
1. Ensure you have Python 3.10+ installed.
2. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. **(Optional)** Retrain the ML model (generates synthetic data and trains the Random Forest model):
   ```bash
   python ml/train_model.py
   ```
5. Start the Flask server:
   ```bash
   python app.py
   ```
   *The backend will run on `http://127.0.0.1:5000`.*

### 2. Frontend Setup (React & Vite)
1. Ensure you have Node.js 18+ installed.
2. Navigate to the root directory (or frontend root).
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *The frontend will run on `http://localhost:5173`.*

## Documentation
- [Executive Summary & Technical Architecture](documentation/app_summary.md)
- [Project Brief](documentation/project_brief.md)
- [Development Roadmap](documentation/roadmap.md)
- [Presentation Script](documentation/presentation_script.md)

## License
MIT License

