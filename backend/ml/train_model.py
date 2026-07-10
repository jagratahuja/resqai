import os
import pandas as pd
import numpy as np
import joblib
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.metrics import mean_absolute_error, root_mean_squared_error, r2_score

def train():
    # Paths
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    data_path = os.path.join(base_dir, 'data', 'emergency_incidents.csv')
    model_path = os.path.join(base_dir, 'ml', 'trained_model.pkl')

    if not os.path.exists(data_path):
        print(f"Error: Data file not found at {data_path}")
        return

    # Load data
    df = pd.read_csv(data_path)
    print(f"Loaded {len(df)} records for training.")

    # Define features and target
    features = ['incident_type', 'occupancy', 'weather', 'response_eta', 'severity_indicator']
    target = 'impact_score'

    X = df[features]
    y = df[target]

    # Preprocessing
    categorical_features = ['incident_type', 'weather']
    numeric_features = ['occupancy', 'response_eta', 'severity_indicator']

    preprocessor = ColumnTransformer(
        transformers=[
            ('num', 'passthrough', numeric_features),
            ('cat', OneHotEncoder(handle_unknown='ignore'), categorical_features)
        ])

    # Model pipeline
    pipeline = Pipeline(steps=[
        ('preprocessor', preprocessor),
        ('model', RandomForestRegressor(n_estimators=100, max_depth=20, min_samples_split=100, n_jobs=-1, random_state=42))
    ])

    # Train/Test Split
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    print("Training Random Forest Regressor...")
    pipeline.fit(X_train, y_train)

    # Evaluation
    predictions = pipeline.predict(X_test)
    mae = mean_absolute_error(y_test, predictions)
    rmse = root_mean_squared_error(y_test, predictions)
    r2 = r2_score(y_test, predictions)

    print("\nModel Evaluation Metrics:")
    print(f"MAE:  {mae:.4f}")
    print(f"RMSE: {rmse:.4f}")
    print(f"R²:   {r2:.4f}")

    # Feature Importance Analysis
    model = pipeline.named_steps['model']
    # Get feature names after one-hot encoding
    cat_features = pipeline.named_steps['preprocessor'].named_transformers_['cat'].get_feature_names_out(categorical_features)
    all_features = numeric_features + list(cat_features)
    
    importances = model.feature_importances_
    feature_importance = pd.DataFrame({'Feature': all_features, 'Importance': importances})
    feature_importance = feature_importance.sort_values(by='Importance', ascending=False)
    
    print("\nFeature Importances:")
    print(feature_importance.to_string(index=False))

    # Save model
    os.makedirs(os.path.dirname(model_path), exist_ok=True)
    joblib.dump(pipeline, model_path)
    print(f"\nModel saved successfully to {model_path}")

    # Save metrics
    import json
    metrics_path = os.path.join(base_dir, 'ml', 'model_metrics.json')
    metrics = {
        'mae': round(mae, 4),
        'rmse': round(rmse, 4),
        'r2': round(r2, 4),
        'dataset_size': len(df),
        'feature_importance': feature_importance.to_dict('records')
    }
    with open(metrics_path, 'w') as f:
        json.dump(metrics, f, indent=4)
    print(f"Metrics saved to {metrics_path}")

if __name__ == '__main__':
    train()
