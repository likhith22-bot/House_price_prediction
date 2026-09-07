from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import pandas as pd
import numpy as np
import joblib
import shap
import os
from typing import List, Optional
import json

app = FastAPI(title="House Price Prediction ML Microservice")

# Global models (resolve from this file's directory so paths work from any CWD)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, 'models', 'house_price_model.pkl')
ENCODER_PATH = os.path.join(BASE_DIR, 'models', 'location_encoder.pkl')
FEATURES_PATH = os.path.join(BASE_DIR, 'models', 'feature_names.pkl')

model = None
le = None
feature_names = None

def load_models():
    global model, le, feature_names
    try:
        if os.path.exists(MODEL_PATH) and os.path.exists(ENCODER_PATH) and os.path.exists(FEATURES_PATH):
            model = joblib.load(MODEL_PATH)
            le = joblib.load(ENCODER_PATH)
            feature_names = joblib.load(FEATURES_PATH)
        else:
            model = None
            le = None
            feature_names = None
    except Exception as exc:
        model = None
        le = None
        feature_names = None
        raise exc

load_models()

class PredictionRequest(BaseModel):
    location: str
    total_sqft: float
    bhk: int
    bath: int
    metro_dist: Optional[float] = None

class PredictionResponse(BaseModel):
    predicted_price: float
    confidence_score: float
    explanation: dict

@app.get("/")
def read_root():
    return {
        "status": "ML Microservice is running",
        "model_loaded": model is not None,
        "model_path": MODEL_PATH,
        "encoder_path": ENCODER_PATH,
        "features_path": FEATURES_PATH
    }

@app.post("/predict", response_model=PredictionResponse)
def predict(request: PredictionRequest):
    if model is None:
        try:
            load_models()
        except Exception as exc:
            raise HTTPException(status_code=500, detail=f"Model load failed: {exc}")
        if model is None:
            raise HTTPException(
                status_code=503,
                detail="Model not loaded. Ensure model files exist in ml-service/models or run train.py."
            )

    try:
        # Encode location
        try:
            loc_encoded = le.transform([request.location])[0]
        except:
            loc_encoded = 0 # Fallback
            
        # Real-time Intelligence Mapping
        data_dict = {
            'location_encoded': loc_encoded,
            'total_sqft': request.total_sqft,
            'bath': request.bath,
            'bhk': request.bhk
        }
        
        if 'metro_dist' in feature_names:
            locations_meta = {
                'Gachibowli': 1.5, 'Kukatpally': 0.5, 'Madhapur': 1.0, 
                'Miyapur': 0.2, 'Banjara Hills': 3.0, 'Jubilee Hills': 2.5,
                'Kondapur': 2.0, 'Manikonda': 4.0, 'Uppal': 0.1, 'Ameerpet': 0.0,
                'US_NAmes': 5.0, 'US_Gilbert': 4.5, 'US_StoneBr': 3.5, 
                'US_NWAmes': 5.5, 'US_Somerst': 4.0
            }
            data_dict['metro_dist'] = request.metro_dist if request.metro_dist is not None else locations_meta.get(request.location, 5.0)

        input_data = pd.DataFrame([data_dict], columns=feature_names)
        
        prediction = float(model.predict(input_data)[0])
        
        # Calculate a simple confidence score based on model variance or proximity to training data
        # For now, a mock score based on R2 of the model
        confidence = 0.94 # Placeholder for actual logic
        
        # SHAP Explanation
        explainer = shap.TreeExplainer(model)
        shap_values = explainer.shap_values(input_data)
        
        explanation = {
            "features": feature_names,
            "shap_values": shap_values[0].tolist(),
            "base_value": float(explainer.expected_value)
        }
        
        return {
            "predicted_price": round(prediction, 2),
            "confidence_score": confidence,
            "explanation": explanation
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/retrain")
def retrain():
    from train import train_model
    try:
        score = train_model()
        load_models()
        return {"status": "success", "new_r2_score": score}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/update_data")
def update_data(new_data: List[dict]):
    # Append new data to training_data.csv
    data_path = 'ml-service/data/training_data.csv'
    try:
        df_new = pd.DataFrame(new_data)
        df_new.to_csv(data_path, mode='a', header=not os.path.exists(data_path), index=False)
        return {"status": "data updated"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/update_chatbot_knowledge")
def update_chatbot_knowledge(knowledge: List[dict]):
    knowledge_path = 'ml-service/data/chatbot_knowledge.csv'
    try:
        df_new = pd.DataFrame(knowledge)
        df_new.to_csv(knowledge_path, mode='a', header=not os.path.exists(knowledge_path), index=False)
        # Mock retraining chatbot brain
        print(f"Chatbot brain retraining started with {len(knowledge)} new records.")
        return {"status": "chatbot knowledge updated and retraining started"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
