from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import text
import pandas as pd
import joblib
import json

from database import get_db, engine
from models import Base, Customer, Prediction
from schemas import CustomerInput, PredictionOut

# Create tables
Base.metadata.create_all(bind=engine)

# Load model and feature columns
model = joblib.load("churn_model.pkl")
with open("feature_columns.json") as f:
    feature_columns = json.load(f)

app = FastAPI(title="Churn Predictor API")

# CORS — allows React frontend to call this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Health check ──────────────────────────────────────────
@app.get("/health")
def health():
    return {"status": "ok"}

# ── Predict churn for a single customer ──────────────────
@app.post("/predict", response_model=PredictionOut)
def predict(data: CustomerInput, db: Session = Depends(get_db)):

    # Build dataframe with same encoding as training
    input_dict = data.dict()
    df = pd.DataFrame([input_dict])

    # Apply same encoding as Week 1
    binary_cols = ['gender','Partner','Dependents','PhoneService','PaperlessBilling']
    from sklearn.preprocessing import LabelEncoder
    le = LabelEncoder()
    for col in binary_cols:
        df[col] = le.fit_transform(df[col])

    multi_cols = ['MultipleLines','InternetService','OnlineSecurity','OnlineBackup',
                  'DeviceProtection','TechSupport','StreamingTV','StreamingMovies',
                  'Contract','PaymentMethod']
    df = pd.get_dummies(df, columns=multi_cols, drop_first=True)

    # Align columns exactly to training
    df = df.reindex(columns=feature_columns, fill_value=0)

    prob  = round(float(model.predict_proba(df)[0][1]), 4)
    pred  = int(model.predict(df)[0])
    risk  = "High" if prob >= 0.7 else "Medium" if prob >= 0.4 else "Low"

    # Save prediction to DB
    prediction = Prediction(
        churn_probability=prob,
        churn_prediction=pred
    )
    db.add(prediction)
    db.commit()
    db.refresh(prediction)

    return PredictionOut(
        customer_id=None,
        churn_probability=prob,
        churn_prediction=pred,
        risk_level=risk
    )

# ── Get all customers (paginated) ────────────────────────
@app.get("/customers")
def get_customers(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    customers = db.query(Customer).offset(skip).limit(limit).all()
    return customers

# ── Churn summary stats from SQL view ────────────────────
@app.get("/stats")
def get_stats(db: Session = Depends(get_db)):
    result = db.execute(text("SELECT * FROM churn_stats")).fetchone()
    return {
        "total_customers":    result[0],
        "churned":            result[1],
        "churn_rate_pct":     result[2],
        "avg_monthly_charges":result[3],
        "avg_tenure_months":  result[4]
    }