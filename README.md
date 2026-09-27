# LoanSetu AI – Intelligent Loan Approval Prediction System

![LoanSetu AI](https://img.shields.io/badge/LoanSetu-AI%20Fintech%20Underwriting-1E3A8A?style=for-the-badge&logo=shield)
![Python](https://img.shields.io/badge/Python-3.10%20%7C%203.11%20%7C%203.12%20%7C%203.14-3776AB?style=for-the-badge&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-6.2-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-8.0+-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![XGBoost](https://img.shields.io/badge/Model-XGBoost%20Classifier-FF6600?style=for-the-badge)

LoanSetu AI is a production-ready, full-stack fintech web application that delivers automated credit risk scoring and loan approval prediction using an **XGBoost Classifier** machine learning model. It couples a **FastAPI** backend with a modern **React + Vite** light-themed fintech interface and a relational **MySQL** database.

---

## 📑 Table of Contents

1. [🏛️ System Architecture](#️-system-architecture)
2. [🧠 Machine Learning Model & Pipeline Deep Dive](#-machine-learning-model--pipeline-deep-dive)
   - [Model Specifications](#model-specifications)
   - [Exact 27-Feature Schema & Encoding](#exact-27-feature-schema--encoding)
   - [Why XGBoost for Credit Risk Underwriting?](#why-xgboost-for-credit-risk-underwriting)
   - [Preprocessing & StandardScaler Transformation](#preprocessing--standardscaler-transformation)
   - [Probability Scoring & Calibration](#probability-scoring--calibration)
   - [Section 19 Baseline Integration Test](#section-19-baseline-integration-test)
3. [💻 Application Pages & User Experience](#-application-pages--user-experience)
4. [🗄️ Database Architecture & Relational Schema](#️-database-architecture--relational-schema)
5. [🔌 REST API Endpoint Reference](#-rest-api-endpoint-reference)
6. [🎨 Light Fintech UI Design System](#-light-fintech-ui-design-system)
7. [⚙️ Installation & Setup Guide](#️-installation--setup-guide)
8. [🚀 Running the Application](#-running-the-application)
9. [🔐 Default Administrator & Demo Accounts](#-default-administrator--demo-accounts)
10. [🧪 Automated Testing & Verification](#-automated-testing--verification)

---

## 🏛️ System Architecture

```
                       ┌──────────────────────────────────────┐
                       │       React + Vite Frontend          │
                       │ (Light UI, Recharts, Lucide, Axios)  │
                       └──────────────────┬───────────────────┘
                                          │
                                          │ JSON over HTTP + JWT Bearer
                                          ▼
                       ┌──────────────────────────────────────┐
                       │        FastAPI Python Backend        │
                       │ (Pydantic v2, Bcrypt, SQLAlchemy)    │
                       └──────────┬────────────────┬──────────┘
                                  │                │
             ┌────────────────────┴───┐        ┌───┴──────────────────────┐
             │     MySQL Database     │        │  XGBoost ML Pipeline     │
             │                        │        │                          │
             │ • users                │        │ 1. 27-Feature Encoder    │
             │ • loan_applications    │        │ 2. StandardScaler        │
             │ • predictions          │        │    (scaler.pkl)          │
             │ • prediction_logs      │        │ 3. XGBClassifier         │
             │                        │        │    (xgb_model.pkl)       │
             └────────────────────────┘        └──────────────────────────┘
```

---

## 🧠 Machine Learning Model & Pipeline Deep Dive

### Model Specifications
- **Algorithm**: `XGBClassifier` (Extreme Gradient Boosting Classifier)
- **Model File**: `ml/xgb_model.pkl` (`xgb_model.pkl`)
- **Preprocessor Artifact**: `ml/scaler.pkl` (`scaler.pkl`)
- **Input Vector Size**: Exactly 27 numeric and one-hot encoded features
- **Output Classes**: `APPROVED` (Class 1) / `REJECTED` (Class 0)
- **Probabilities**: Calibrated Softmax probability outputs (`approval_probability` and `rejection_probability`)
- **Inference Latency**: `< 20ms`

---

### Exact 27-Feature Schema & Encoding

The machine learning model operates on a strict 27-feature matrix. The backend receives human-readable payload values and converts them into the exact column sequence expected by `scaler.transform()` and `xgb_model.predict()`:

| # | Feature Name | Data Type | Encoding / Value Range | Description |
| :--- | :--- | :--- | :--- | :--- |
| 1 | `Applicant_Income` | Float | $\ge 0$ (e.g., `50000.0`) | Primary applicant monthly income in ₹ |
| 2 | `Coapplicant_Income` | Float | $\ge 0$ (e.g., `20000.0`) | Co-applicant monthly income in ₹ |
| 3 | `Age` | Integer | $18 \dots 100$ (e.g., `30`) | Applicant age in years |
| 4 | `Dependents` | Integer | $0 \dots 10$ (e.g., `2`) | Number of financial dependents |
| 5 | `Credit_Score` | Integer | $300 \dots 900$ (e.g., `750`) | CIBIL/Credit score bureau rating |
| 6 | `Existing_Loans` | Integer | $0 \dots 20$ (e.g., `1`) | Number of existing active credit facilities |
| 7 | `DTI_Ratio` | Float | $0.0 \dots 1.0$ (e.g., `0.30`) | Debt-to-Income ratio ($\frac{\text{Monthly Debt}}{\text{Monthly Income}}$) |
| 8 | `Savings` | Float | $\ge 0$ (e.g., `300000.0`) | Total liquid savings & deposits in ₹ |
| 9 | `Collateral_Value` | Float | $\ge 0$ (e.g., `500000.0`) | Pledged asset valuation in ₹ |
| 10 | `Loan_Amount` | Float | $> 0$ (e.g., `200000.0`) | Requested loan principal in ₹ |
| 11 | `Loan_Term` | Integer | $12 \dots 480$ (e.g., `360`) | Repayment tenure in months |
| 12 | `Education_Level` | Integer | `1` = Graduate, `0` = Not Graduate | Educational qualification |
| 13 | `Employment_Status_Salaried` | Integer | `1` if Salaried, else `0` | Employment category dummy |
| 14 | `Employment_Status_Self-employed` | Integer | `1` if Self-employed, else `0` | Employment category dummy |
| 15 | `Employment_Status_Unemployed` | Integer | `1` if Unemployed, else `0` | Employment category dummy |
| 16 | `Marital_Status_Single` | Integer | `1` if Single, `0` if Married | Marital status binary flag |
| 17 | `Loan_Purpose_Car` | Integer | `1` if Car, else `0` | Purpose dummy variable |
| 18 | `Loan_Purpose_Education` | Integer | `1` if Education, else `0` | Purpose dummy variable |
| 19 | `Loan_Purpose_Home` | Integer | `1` if Home, else `0` | Purpose dummy variable |
| 20 | `Loan_Purpose_Personal` | Integer | `1` if Personal, else `0` | Purpose dummy variable |
| 21 | `Property_Area_Semiurban` | Integer | `1` if Semiurban, else `0` | Real estate location tier |
| 22 | `Property_Area_Urban` | Integer | `1` if Urban, else `0` | Real estate location tier (Rural = 0, 0) |
| 23 | `Gender_Male` | Integer | `1` if Male, `0` if Female | Gender binary indicator |
| 24 | `Employer_Category_Government` | Integer | `1` if Government/PSU, else `0` | Employer stability tier |
| 25 | `Employer_Category_MNC` | Integer | `1` if Multinational, else `0` | Employer stability tier |
| 26 | `Employer_Category_Private` | Integer | `1` if Private Company, else `0` | Employer stability tier |
| 27 | `Employer_Category_Unemployed` | Integer | `1` if Unemployed, else `0` | Employer stability tier |

---

### Why XGBoost for Credit Risk Underwriting?

1. **Non-Linear Interaction Capture**: Financial creditworthiness cannot be measured using simple linear models. For instance, high debt leverage (DTI > 0.50) may be offset by substantial collateral value and an 800+ credit score, whereas low income combined with high loan amounts creates exponential default risk. XGBoost's ensemble trees split across non-linear boundaries cleanly.
2. **Robust Against Tabular Outliers**: Tree-based partition thresholds are unaffected by extreme values in income, savings, or collateral valuations.
3. **Sequential Residual Error Correction**: Gradient boosting builds shallow decision trees where each subsequent tree corrects the pseudo-residuals of earlier trees, resulting in sharp decision frontiers.
4. **Calibrated Probability Estimation**: Unlike hard classifiers, XGBoost computes softmax margins that translate directly to true confidence percentages (e.g., 71.43% approval confidence vs. 28.57% rejection confidence).

---

### Preprocessing & StandardScaler Transformation

Before reaching the model, the 27-feature matrix $X$ is normalized using the pre-fitted `StandardScaler`:

$$z = \frac{x - \mu}{\sigma}$$

Where:
- $x$ is the raw feature value
- $\mu$ is the empirical feature mean from the training corpus
- $\sigma$ is the empirical standard deviation

```python
# In ml_service.py
df = self._build_dataframe(data)       # Produces 1x27 DataFrame matching FEATURE_COLUMNS
scaled = self._scaler.transform(df)    # Normalizes across all 27 dimensions
pred = int(self._model.predict(scaled)[0])
proba = self._model.predict_proba(scaled)[0]
```

---

### Section 19 Baseline Integration Test

The model is verified against the reference test application:

```json
{
  "applicant_income": 50000,
  "coapplicant_income": 20000,
  "age": 30,
  "dependents": 2,
  "credit_score": 750,
  "existing_loans": 1,
  "dti_ratio": 0.30,
  "savings": 300000,
  "collateral_value": 500000,
  "loan_amount": 200000,
  "loan_term": 360,
  "education_level": "Graduate",
  "gender": "Male",
  "marital_status": "Married",
  "employment_status": "Salaried",
  "loan_purpose": "Home",
  "property_area": "Urban",
  "employer_category": "MNC"
}
```

**Result**:
- **Verdict**: `APPROVED` ("Likely Approved")
- **Approval Probability**: `71.43%` (`0.7143`)
- **Rejection Probability**: `28.57%` (`0.2857`)
- **Model Name**: `XGBoost Classifier (v1.0.0)`

---

## 💻 Application Pages & User Experience

| Page | Route | Description & Features |
| :--- | :--- | :--- |
| **Landing Page** | `/` | Hero section, 4-step workflow, core features, architecture benefits, security protocols, AI disclaimer, and direct CTA. |
| **Login** | `/login` | Secure JWT authentication with error handling and one-click demo credentials for Admin and regular borrowers. |
| **Register** | `/register` | User signup with real-time password strength meter, email validation, and confirm password matching. |
| **User Dashboard** | `/dashboard` | Portfolio statistics (Total, Approved, Rejected, Rate), 3 Recharts graphs (Donut, Area, Bar), and recent applications list. |
| **Loan Prediction Wizard** | `/predict` | 4-step multi-section form with step progress indicators, interactive sliders (Credit Score 300–900, DTI 0–1), tooltips, currency formatting, review card, and quick-fill test profiles. |
| **Prediction Result** | *Modal* | Result card displaying verdict (`Likely Approved` / `Likely Rejected`), animated probability progress bars, statutory disclaimer, and actions to download reports. |
| **Application History** | `/history` | Full user history with search (by ID/purpose/amount), status filter tabs, date sorting, pagination, and delete confirmation modal. |
| **Application Detail** | `/applications/:id` | Detailed review of all 4 parameter sections, XGBoost confidence breakdown, risk summary, and printable export. |
| **Profile & Security** | `/profile` | Account information, role badges, full name & phone editor, and secure bcrypt password change form. |
| **Admin Workspace** | `/admin` | System-wide statistics (Total Users, Platform Approval Rate, Total Loan Value), 4 analytics charts, master application directory, and user account management. |
| **How It Works & About** | `/how-it-works` | 8-stage pipeline visualizer and beginner-friendly XGBoost machine learning explanation. |
| **Printable Report** | `/report/:id` | Clean, printable/PDF-ready formal loan assessment dossier formatted with print stylesheets. |

---

## 🗄️ Database Architecture & Relational Schema

```sql
users (1) ───< loan_applications (N) ─── (1) predictions
  │                      │
  └───< prediction_logs >┘
```

- **`users`**: Manages credentials (`password_hash` with bcrypt), user roles (`admin` / `user`), and contact details.
- **`loan_applications`**: Stores demographic, employment, leverage, and requested loan parameters connected via `user_id` foreign key.
- **`predictions`**: Stores XGBoost outputs (`prediction`, `approval_probability`, `rejection_probability`, `model_name`, `model_version`, `predicted_at`) linked via `application_id` with `CASCADE` delete.
- **`prediction_logs`**: Audit logging table capturing request and response timestamps for latency and uptime tracking.

---

## 🔌 REST API Endpoint Reference

| Method | Endpoint | Access | Purpose |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Public | System status, database connection, and ML model readiness |
| `POST` | `/api/auth/register` | Public | Register new user account with hashed password |
| `POST` | `/api/auth/login` | Public | Authenticate user credentials and return JWT bearer token |
| `GET` | `/api/auth/me` | Authenticated | Fetch current user profile details |
| `PUT` | `/api/auth/profile` | Authenticated | Update full name and phone number |
| `PUT` | `/api/auth/change-password`| Authenticated | Securely change user password |
| `POST` | `/api/predictions/predict` | Authenticated | Execute 27-feature XGBoost inference and persist record |
| `GET` | `/api/dashboard/summary` | Authenticated | Get user portfolio metrics (total, approved, rate) |
| `GET` | `/api/dashboard/recent` | Authenticated | Retrieve latest 10 applications with nested predictions |
| `GET` | `/api/applications` | Authenticated | List all user applications (supports search, sort, filter) |
| `GET` | `/api/applications/{id}` | Authenticated | Get detailed application with prediction breakdown |
| `DELETE`| `/api/applications/{id}`| Authenticated | Delete application and cascade removal in database |
| `GET` | `/api/admin/stats` | **Admin Only** | System-wide aggregates, daily volumes, and charts |
| `GET` | `/api/admin/applications` | **Admin Only** | Master list of all user applications across the platform |
| `GET` | `/api/admin/users` | **Admin Only** | Master list of all registered platform users |

---

## 🎨 Light Fintech UI Design System

The frontend implements a clean **Light UI** inspired by modern banking and fintech platforms:

- **Background**: `#F7F9FC` (Off-white / Soft Grey)
- **Card Surfaces**: `#FFFFFF` (Pure White with subtle borders `#E2E8F0`)
- **Primary Color**: `#1E3A8A` (Deep Navy Blue)
- **Secondary Color**: `#3B82F6` (Electric Blue)
- **Success Tone**: `#15803D` / `#F0FDF4` (Forest Green)
- **Danger Tone**: `#DC2626` / `#FEF2F2` (Crimson Red)
- **Warning Tone**: `#D97706` / `#FFFBEB` (Amber)
- **Typography**: `Outfit` for headings and `Inter` for data tables and body copy
- **Design Principles**: Generous whitespace, rounded cards (`12px` – `16px`), responsive grid layouts, zero dark mode, no visual clutter.

---

## ⚙️ Installation & Setup Guide

### 1. Prerequisites
- **Python**: 3.10+ (tested on Python 3.10, 3.11, 3.12, 3.14)
- **Node.js**: 18+ and npm
- **MySQL**: 8.0+

### 2. Clone Repository
```bash
git clone https://github.com/sanketthakare-26/LoanSetu-AI.git
cd LoanSetu-AI
```

### 3. MySQL Database Setup
Open MySQL and execute:
```bash
mysql -u root -p < database/schema.sql
```

### 4. Backend Setup
```bash
cd backend
python -m venv venv

# Windows
.\venv\Scripts\activate
# Linux / macOS
# source venv/bin/activate

pip install -r requirements.txt
```

### 5. Frontend Setup
```bash
cd ../frontend
npm install
```

---

## 🚀 Running the Application

### 1. Start the Backend API Server
```bash
cd backend
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```
- **API URL**: `http://localhost:8000`
- **Swagger Documentation**: `http://localhost:8000/docs`
- **Health Endpoint**: `http://localhost:8000/api/health`

### 2. Start the Frontend Application
```bash
cd frontend
npm run dev
```
- **Web Interface**: `http://localhost:5173`

---

## 🔐 Default Administrator & Demo Accounts

To create or verify the default administrator account, run:
```bash
cd backend
python seed_admin.py
```

### Pre-configured Credentials:
- **Admin Account**:
  - Email: `admin@loansetu.ai`
  - Password: `Admin@123`
  - Privileges: Full access to `/admin`, platform statistics, and all applications.
- **Sample Borrower Account**:
  - Email: `priya.sharma@example.com`
  - Password: `Secure@123`
  - Privileges: Standard loan prediction and personal dashboard.

---

## 🧪 Automated Testing & Verification

Execute the comprehensive automated test suite verifying all 15 system capabilities:

```bash
cd backend
python test_api_endpoints.py
```

### Test Coverage Checklist:
- [x] **Health Check**: Backend healthy, database connected, 27-feature model loaded.
- [x] **User Registration**: Bcrypt password hashing, validation, duplicate prevention.
- [x] **Authentication**: JWT token generation, unauthorized 401 handling, secure `/me`.
- [x] **Section 19 Test**: XGBoost inference on standard test inputs (`Likely Approved` at 71.43%).
- [x] **High-Risk Prediction**: High DTI & low credit score rejected accurately.
- [x] **User Dashboard**: Summary KPI computation and recent application retrieval.
- [x] **Profile & Security**: Name/phone updates and bcrypt password change verification.
- [x] **Admin Authorization**: Non-admin users restricted (403 Forbidden), admin metrics functional.
- [x] **Database Foreign Keys**: Relational linkage verified (`users` $\rightarrow$ `loan_applications` $\rightarrow$ `predictions`).
- [x] **Vite Production Bundle**: Zero build errors (`npm run build`).

---

## 📄 License & Disclaimer

**AI Prediction Disclaimer**: Predictions provided by LoanSetu AI are generated by a machine-learning model (XGBoost Classifier) and should not be treated as a guaranteed lending decision. Statutory underwriting verification and credit policy checks apply.
