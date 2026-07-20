# Customer Churn Prediction Dashboard

A full-stack machine learning web application that predicts customer churn for a telecom company in real time. Built with XGBoost, FastAPI, PostgreSQL 18, and React.

---

## Project Overview

Customer churn is one of the most critical business problems in the telecom industry. This project builds an end-to-end ML pipeline that:

- Trains an XGBoost classification model on 7,032 telecom customers
- Serves predictions through a REST API built with FastAPI
- Stores customer data and prediction logs in PostgreSQL 18
- Displays live analytics and an interactive churn prediction form in a React dashboard

---

## Dashboard Preview
### High risk prediction — Month-to-month contract, tenure 1 month
![High risk prediction](screenshots/dashboard-high-risk.png)

### Low risk prediction — Two year contract, tenure 60 months
![Low risk prediction](screenshots/dashboard-low-risk.png)

### Key findings from the data
- Month-to-month contracts have a **42% churn rate** vs only **3% for two-year contracts**
- Customers with tenure under 12 months are the **highest risk group**
- Fiber optic internet service correlates with **41% churn rate**
- Overall churn rate: **26.58%** (1,869 out of 7,032 customers)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Machine learning | Python, XGBoost, Scikit-learn, Pandas |
| Backend API | FastAPI, Uvicorn, SQLAlchemy, Pydantic |
| Database | PostgreSQL 18 |
| Frontend | React, Recharts, Tailwind CSS, Vite, Axios |
| Deployment | Render (free tier) |

---

## Project Structure

```
churn-predictor/
│
├── backend/
│   ├── main.py               # FastAPI app — all endpoints
│   ├── database.py           # SQLAlchemy engine and session
│   ├── models.py             # ORM table definitions
│   ├── schemas.py            # Pydantic request/response schemas
│   ├── requirements.txt      # Python dependencies
│   ├── churn_model.pkl       # Trained XGBoost model
│   └── feature_columns.json  # Feature column names for prediction
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx           # Main app layout
│   │   ├── api/
│   │   │   └── client.js     # Axios API client
│   │   └── components/
│   │       ├── KpiCards.jsx        # Summary metric cards
│   │       ├── ChurnByContract.jsx # Bar chart by contract type
│   │       ├── ChurnDonut.jsx      # Churn split donut chart
│   │       └── PredictForm.jsx     # Live churn prediction form
│   ├── package.json
│   └── vite.config.js
│
├── data/
│   └── churn_clean.csv       # Cleaned dataset (7,032 rows)
│
└── README.md
```

---

## Machine Learning Pipeline

### Dataset
- **Source**: [Telco Customer Churn — Kaggle](https://www.kaggle.com/datasets/blastchar/telco-customer-churn)
- **Size**: 7,043 rows, 21 columns (7,032 after cleaning)
- **Target**: `Churn` (Yes/No) — 26.58% positive class

### Data cleaning
- Converted `TotalCharges` from string to float (11 blank rows dropped)
- Removed `customerID` column (not predictive)
- Encoded binary columns with `LabelEncoder`
- One-hot encoded multi-class categorical columns

### Model training
- Algorithm: **XGBoost Classifier**
- Handled class imbalance using `scale_pos_weight`
- Applied regularisation (`max_depth=3`, `reg_lambda=2.0`, `min_child_weight=5`) to prevent overfitting
- Monitored training curve (train AUC vs test AUC) across 300 trees

### Model performance

| Metric | Score |
|---|---|
| ROC-AUC | **0.842** |
| Training curve | Healthy — train/test gap < 0.05 |

### Top churn predictors
1. Contract type
2. Tenure
3. Monthly charges
4. Internet service type
5. Payment method

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/health` | Health check |
| GET | `/stats` | Churn summary statistics from PostgreSQL view |
| GET | `/customers` | Paginated customer list |
| POST | `/predict` | Predict churn probability for a single customer |

### Sample `/predict` request

```json
{
  "gender": "Female",
  "SeniorCitizen": 0,
  "Partner": "Yes",
  "Dependents": "No",
  "tenure": 1,
  "PhoneService": "No",
  "MultipleLines": "No phone service",
  "InternetService": "DSL",
  "OnlineSecurity": "No",
  "OnlineBackup": "Yes",
  "DeviceProtection": "No",
  "TechSupport": "No",
  "StreamingTV": "No",
  "StreamingMovies": "No",
  "Contract": "Month-to-month",
  "PaperlessBilling": "Yes",
  "PaymentMethod": "Electronic check",
  "MonthlyCharges": 29.85,
  "TotalCharges": 29.85
}
```

### Sample `/predict` response

```json
{
  "customer_id": null,
  "churn_probability": 0.7513,
  "churn_prediction": 1,
  "risk_level": "High"
}
```

---

## Database Schema

```sql
-- Stores all customer records
CREATE TABLE customers (
    id               SERIAL PRIMARY KEY,
    customer_ref     VARCHAR(20),
    gender           VARCHAR(10),
    senior_citizen   INTEGER,
    tenure           INTEGER,
    contract         VARCHAR(20),
    monthly_charges  FLOAT,
    total_charges    FLOAT,
    churn            VARCHAR(5),
    ...
);

-- Logs every prediction made
CREATE TABLE predictions (
    id                SERIAL PRIMARY KEY,
    customer_id       INTEGER REFERENCES customers(id),
    churn_probability FLOAT,
    churn_prediction  INTEGER,
    predicted_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Aggregated churn metrics view
CREATE VIEW churn_stats AS
SELECT
    COUNT(*)                                                      AS total_customers,
    SUM(CASE WHEN churn = 'Yes' THEN 1 ELSE 0 END)               AS churned,
    ROUND(AVG(CASE WHEN churn = 'Yes' THEN 1.0 ELSE 0.0 END) * 100, 2) AS churn_rate_pct,
    ROUND(AVG(monthly_charges)::NUMERIC, 2)                       AS avg_monthly_charges,
    ROUND(AVG(tenure)::NUMERIC, 1)                                AS avg_tenure_months
FROM customers;
```

---

## How to Run Locally

### Prerequisites
- Python 3.10+
- Node.js 18+
- PostgreSQL 18

### Backend setup

```bash
cd backend
pip install -r requirements.txt
```

Create a `.env` file in `backend/`:
```
DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/churn_db
```

Run the API:
```bash
uvicorn main:app --reload
```

API available at: `http://127.0.0.1:8000`  
Interactive docs at: `http://127.0.0.1:8000/docs`

### Database setup

```sql
CREATE DATABASE churn_db;
```

Then load the dataset using psql or pgAdmin import tool.

### Frontend setup

```bash
cd frontend
npm install
npm run dev
```

Dashboard available at: `http://localhost:5173`

---

## About

Built by **Himaya Pathirage**  
BSc Applied Science (Statistics, Mathematics, Computer Science)  
Rajarata University of Sri Lanka

- GitHub: [github.com/HimayaPathirage](https://github.com/HimayaPathirage)

---

## Portfolio Projects

| # | Project | Tech |
|---|---|---|
| 1 | Anuradhapura Traffic Index Dashboard | R, Statistics, Power BI, DAX |
| 2 | Retail Sales Dashboard | PostgreSQL, SQL, Power BI, DAX |
| 3 | E-commerce Python EDA | Python, Pandas, Matplotlib, Seaborn |
| 4 | **Customer Churn Prediction Dashboard** | **XGBoost, FastAPI, PostgreSQL, React** |

---

## License

MIT License — free to use for learning and portfolio purposes.

