from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.sql import func
from database import Base

class Customer(Base):
    __tablename__ = "customers"

    id               = Column(Integer, primary_key=True, index=True)
    gender           = Column(String)
    senior_citizen   = Column(Integer)
    partner          = Column(String)
    dependents       = Column(String)
    tenure           = Column(Integer)
    phone_service    = Column(String)
    multiple_lines   = Column(String)
    internet_service = Column(String)
    online_security  = Column(String)
    online_backup    = Column(String)
    device_protection= Column(String)
    tech_support     = Column(String)
    streaming_tv     = Column(String)
    streaming_movies = Column(String)
    contract         = Column(String)
    paperless_billing= Column(String)
    payment_method   = Column(String)
    monthly_charges  = Column(Float)
    total_charges    = Column(Float)
    churn            = Column(String)

class Prediction(Base):
    __tablename__ = "predictions"

    id                 = Column(Integer, primary_key=True, index=True)
    customer_id        = Column(Integer, ForeignKey("customers.id"))
    churn_probability  = Column(Float)
    churn_prediction   = Column(Integer)
    predicted_at       = Column(DateTime, server_default=func.now())