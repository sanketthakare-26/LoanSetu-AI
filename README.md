# LoanSetu AI – Intelligent Loan Approval Prediction System

LoanSetu AI is a production-grade full-stack web application for automated loan underwriting and approval prediction, powered by an **XGBoost Classifier** machine learning model, a **FastAPI** backend, and a modern **React + Vite** frontend.

---

## 🏛️ System Architecture

```
React Frontend (Vite, React Router, Recharts, Axios)
       │
       │ REST API (JSON / JWT Bearer)
       ▼
FastAPI Backend (Uvicorn, Pydantic, SQLAlchemy)
       │
       ├── Authentication (JWT & Bcrypt)
       ├── Loan Application API (CRUD & CSV Export)
       ├── Prediction API (XGBoost Classifier Inference)
       ├── History API (Audit Trail & Filter)
       └── Dashboard API (Aggregations & Analytics)
       │
       ├── MySQL Database (Persistent Loan Records)
       │
       └── XGBoost ML Model Pipeline
              ├── scaler.pkl (StandardScaler fitted)
              └── xgb_model.pkl (XGBClassifier)
```

---

## 📁 Project Structure

```
loan-setu-ai/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── StatusBadge.jsx
│   │   │   └── PredictionResultModal.jsx
│   │   ├── pages/
│   │   │   ├── PredictPage.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── ApplicationsHistory.jsx
│   │   │   ├── ApplicationDetail.jsx
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── hooks/
│   │   │   └── useAuth.jsx
│   │   ├── utils/
│   │   │   └── formatters.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── main.py
│   ├── database.py
│   ├── models.py
│   ├── schemas.py
│   ├── ml_service.py
│   ├── auth.py
│   ├── routes/
│   │   ├── auth.py
│   │   ├── prediction.py
│   │   ├── applications.py
│   │   └── dashboard.py
│   ├── requirements.txt
│   ├── .env.example
│   └── .env
│
├── ml/
│   ├── xgb_model.pkl
│   └── scaler.pkl
│
├── database/
│   └── schema.sql
│
└── README.md
```

---

## 🧠 ML Model Pipeline & Feature Compatibility

The application preserves the exact preprocessing pipeline and feature columns expected by `xgb_model.pkl` and `scaler.pkl`:

1. `Applicant_Income` (Numeric)
2. `Coapplicant_Income` (Numeric)
3. `Age` (Numeric)
4. `Dependents` (Numeric: 0, 1, 2, 3, 4)
5. `Credit_Score` (Numeric: 300 - 900)
6. `Existing_Loans` (Numeric: 0, 1, 2, 3)
7. `DTI_Ratio` (Numeric: 0.00 - 1.00)
8. `Savings` (Numeric: ₹)
9. `Collateral_Value` (Numeric: ₹)
10. `Loan_Amount` (Numeric: ₹)
11. `Loan_Term` (Numeric: Months)
12. `Education_Level` (1: Graduate, 0: Not Graduate)
13. `Employment_Status_Salaried` (Binary)
14. `Employment_Status_Self-employed` (Binary)
15. `Employment_Status_Unemployed` (Binary)
16. `Marital_Status_Single` (Binary: 1 if Single, 0 if Married)
17. `Loan_Purpose_Car` (Binary)
18. `Loan_Purpose_Education` (Binary)
19. `Loan_Purpose_Home` (Binary)
20. `Loan_Purpose_Personal` (Binary)
21. `Property_Area_Semiurban` (Binary)
22. `Property_Area_Urban` (Binary)
23. `Gender_Male` (Binary: 1 if Male, 0 if Female)
24. `Employer_Category_Government` (Binary)
25. `Employer_Category_MNC` (Binary)
26. `Employer_Category_Private` (Binary)
27. `Employer_Category_Unemployed` (Binary)

---

## 🚀 Getting Started & How to Run

### 1. Database Setup (MySQL)

Create the database using the provided schema:
```bash
mysql -u root -p < database/schema.sql
```

Ensure your credentials match `backend/.env`:
```env
DATABASE_URL=mysql+pymysql://root:YOUR_PASSWORD@localhost:3306/loan_setu
SECRET_KEY=loansetu_ai_super_secret_jwt_key_2026_production_grade
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
MODEL_PATH=../ml/xgb_model.pkl
SCALER_PATH=../ml/scaler.pkl
```

### 2. Run Backend (FastAPI)

```bash
# Navigate to backend directory
cd backend

# Install dependencies
pip install -r requirements.txt

# Start the FastAPI server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```
- API is accessible at: `http://localhost:8000`
- Interactive Swagger documentation: `http://localhost:8000/docs`
- Health check: `http://localhost:8000/api/health`

### 3. Run Frontend (React + Vite)

Open a second terminal:
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start Vite development server
npm run dev
```
- Web Application is accessible at: `http://localhost:5173`

---

## 🧪 System Health Verification

Check backend and model status anytime at:
```
GET /api/health
```
Response:
```json
{
  "backend": "healthy",
  "database": "connected (MySQL)",
  "model": "loaded (XGBClassifier)",
  "features_count": 27,
  "timestamp": "2026-09-27T08:00:00.000000"
}
```

---

## 🔒 Features Included

- **User Authentication**: Secure JWT-based registration, login, and protected routes.
- **Predict Loan Approval**: Instant ML scoring with probability gauge, confidence percentage, and risk tiers.
- **Explainable AI Signals**: Instant evaluation of credit score, debt-to-income ratio, collateral coverage, and employment security.
- **Official CSV Loan Dossier Export**: Generate and download loan underwriting reports.
- **Portfolio Analytics Dashboard**: Recharts-powered graphs for monthly volume, risk tier distribution, and approval rates.
- **Full Application History**: Complete search, filter, and audit trail of applications saved in MySQL.
