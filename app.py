import streamlit as st
import pandas as pd
import numpy as np
import joblib
import os
 
# ----------------------------------------------------------------------
# PAGE CONFIG
# ----------------------------------------------------------------------
st.set_page_config(
    page_title="LoanSetu AI | Loan Approval Predictor",
    page_icon="🏦",
    layout="wide",
    initial_sidebar_state="expanded",
)
 
# ----------------------------------------------------------------------
# THEME: Milky White + Navy Blue
# ----------------------------------------------------------------------
MILK_WHITE = "#FAF9F6"
CARD_WHITE = "#FFFFFF"
NAVY_DEEP = "#0B1F3A"
NAVY = "#16305C"
NAVY_LIGHT = "#2C4A78"
GOLD_ACCENT = "#C9A24B"
TEXT_MUTED = "#5A6472"
SUCCESS = "#1E7A46"
DANGER = "#B3382C"
 
st.markdown(f"""
<style>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Inter:wght@400;500;600;700&display=swap');
 
html, body, [class*="css"] {{
    font-family: 'Inter', sans-serif;
}}
 
.stApp {{
    background: {MILK_WHITE};
}}
 
/* Force readable text color everywhere in main content,
   regardless of the browser/OS dark-mode setting (sidebar
   overrides this below with higher specificity) */
[data-testid="stAppViewContainer"] {{
    color: {NAVY_DEEP};
}}
[data-testid="stAppViewContainer"] label,
[data-testid="stAppViewContainer"] p,
[data-testid="stAppViewContainer"] span,
[data-testid="stAppViewContainer"] h1,
[data-testid="stAppViewContainer"] h2,
[data-testid="stAppViewContainer"] h3,
[data-testid="stAppViewContainer"] .stMarkdown,
[data-testid="stAppViewContainer"] .stCaption,
[data-testid="stNumberInput"] label,
[data-testid="stSelectbox"] label,
[data-testid="stSlider"] label {{
    color: {NAVY_DEEP} !important;
}}
[data-testid="stAppViewContainer"] input,
[data-testid="stAppViewContainer"] textarea {{
    color: {NAVY_DEEP} !important;
    background-color: {CARD_WHITE} !important;
}}
[data-testid="stHeader"] {{
    background: transparent;
}}
 
/* Sidebar */
section[data-testid="stSidebar"] {{
    background: linear-gradient(180deg, {NAVY_DEEP} 0%, {NAVY} 100%);
}}
section[data-testid="stSidebar"] * {{
    color: {MILK_WHITE} !important;
}}
section[data-testid="stSidebar"] label {{
    color: #D7DEE9 !important;
    font-weight: 500;
}}
 
/* Header banner */
.ls-header {{
    background: linear-gradient(120deg, {NAVY_DEEP} 0%, {NAVY} 55%, {NAVY_LIGHT} 100%);
    padding: 2.4rem 2.6rem;
    border-radius: 18px;
    margin-bottom: 1.8rem;
    box-shadow: 0 12px 30px rgba(11, 31, 58, 0.25);
    position: relative;
    overflow: hidden;
}}
.ls-header::after {{
    content: "";
    position: absolute;
    top: -60px; right: -60px;
    width: 220px; height: 220px;
    border-radius: 50%;
    background: rgba(201, 162, 75, 0.12);
}}
.ls-eyebrow {{
    color: {GOLD_ACCENT};
    letter-spacing: 3px;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    margin-bottom: 0.4rem;
}}
.ls-title {{
    font-family: 'Playfair Display', serif;
    color: {MILK_WHITE};
    font-size: 2.4rem;
    font-weight: 700;
    margin: 0;
    line-height: 1.15;
}}
.ls-subtitle {{
    color: #C4CEDD;
    font-size: 1rem;
    margin-top: 0.6rem;
    max-width: 640px;
}}
 
/* Section card */
.ls-card {{
    background: {CARD_WHITE};
    border: 1px solid #E7E9EE;
    border-radius: 16px;
    padding: 1.6rem 1.8rem;
    margin-bottom: 1.4rem;
    box-shadow: 0 4px 18px rgba(15, 30, 60, 0.05);
}}
.ls-section-title {{
    font-family: 'Playfair Display', serif;
    color: {NAVY_DEEP};
    font-size: 1.15rem;
    font-weight: 700;
    margin-bottom: 0.2rem;
    border-left: 4px solid {GOLD_ACCENT};
    padding-left: 0.7rem;
}}
.ls-section-caption {{
    color: {TEXT_MUTED};
    font-size: 0.85rem;
    margin-bottom: 1rem;
    padding-left: 0.9rem;
}}
 
/* Inputs */
.stNumberInput input, .stSelectbox div[data-baseweb="select"], .stSlider {{
    border-radius: 10px !important;
}}
.stNumberInput input:focus {{
    border-color: {NAVY} !important;
}}
 
/* Buttons */
div.stButton > button {{
    background: linear-gradient(120deg, {NAVY_DEEP}, {NAVY_LIGHT});
    color: {MILK_WHITE};
    border: none;
    border-radius: 12px;
    padding: 0.75rem 1.6rem;
    font-weight: 600;
    letter-spacing: 0.3px;
    transition: all 0.2s ease;
    box-shadow: 0 6px 16px rgba(11,31,58,0.25);
}}
div.stButton > button:hover {{
    transform: translateY(-1px);
    box-shadow: 0 10px 22px rgba(11,31,58,0.32);
    color: {MILK_WHITE};
    border: none;
}}
 
/* Premium Download Button */
div.stDownloadButton > button {{
    width: 100%;
    background: linear-gradient(135deg, {NAVY_DEEP}, {NAVY}) !important;
    color: {MILK_WHITE} !important;
    border: none !important;
    border-radius: 14px !important;
    padding: 0.85rem 1.2rem !important;
    font-size: 16px !important;
    font-weight: 700 !important;
    letter-spacing: 0.4px;
    box-shadow: 0 8px 20px rgba(11,31,58,0.30);
    transition: all 0.3s ease;
}}
div.stDownloadButton > button:hover {{
    background: linear-gradient(135deg, {NAVY}, {NAVY_LIGHT}) !important;
    color: {MILK_WHITE} !important;
    transform: translateY(-2px);
    box-shadow: 0 12px 25px rgba(11,31,58,0.40);
}}
div.stDownloadButton > button:focus {{
    color: {MILK_WHITE} !important;
    border: none !important;
}}
 
/* Result banners */
.ls-result-approved {{
    background: linear-gradient(120deg, #E9F7EE, #F4FBF6);
    border: 1px solid #B7E3C3;
    border-left: 6px solid {SUCCESS};
    border-radius: 14px;
    padding: 1.6rem 1.8rem;
    margin-top: 1rem;
}}
.ls-result-rejected {{
    background: linear-gradient(120deg, #FBEBE9, #FDF4F3);
    border: 1px solid #F0C2BC;
    border-left: 6px solid {DANGER};
    border-radius: 14px;
    padding: 1.6rem 1.8rem;
    margin-top: 1rem;
}}
.ls-result-title {{
    font-family: 'Playfair Display', serif;
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 0.3rem;
}}
.ls-result-approved .ls-result-title {{ color: {SUCCESS}; }}
.ls-result-rejected .ls-result-title {{ color: {DANGER}; }}
 
/* Metric chips */
.ls-chip-row {{ display: flex; gap: 0.8rem; flex-wrap: wrap; margin-top: 0.8rem; }}
.ls-chip {{
    background: {NAVY_DEEP};
    color: {MILK_WHITE};
    border-radius: 999px;
    padding: 0.4rem 1rem;
    font-size: 0.82rem;
    font-weight: 500;
}}
 
/* Footer */
.ls-footer {{
    text-align: center;
    color: {TEXT_MUTED};
    font-size: 0.8rem;
    margin-top: 2.5rem;
    padding-top: 1rem;
    border-top: 1px solid #E7E9EE;
}}
 
#MainMenu, footer {{visibility: hidden;}}
 
</style>
""", unsafe_allow_html=True)
 
# ----------------------------------------------------------------------
# LOAD MODEL
# ----------------------------------------------------------------------
# Drop your own trained files here (same folder as this script):
#   scaler.pkl      -> fitted StandardScaler (or any sklearn-compatible scaler)
#   xgb_model.pkl   -> your trained XGBoost / sklearn classifier
SCALER_PATH = os.path.join("scaler.pkl")
MODEL_PATH = os.path.join("xgb_model.pkl")
 
FEATURE_COLUMNS = [
    "Applicant_Income", "Coapplicant_Income", "Age", "Dependents",
    "Credit_Score", "Existing_Loans", "DTI_Ratio", "Savings",
    "Collateral_Value", "Loan_Amount", "Loan_Term", "Education_Level",
    "Employment_Status_Salaried", "Employment_Status_Self-employed",
    "Employment_Status_Unemployed", "Marital_Status_Single",
    "Loan_Purpose_Car", "Loan_Purpose_Education", "Loan_Purpose_Home",
    "Loan_Purpose_Personal", "Property_Area_Semiurban", "Property_Area_Urban",
    "Gender_Male", "Employer_Category_Government", "Employer_Category_MNC",
    "Employer_Category_Private", "Employer_Category_Unemployed",
]
 
 
@st.cache_resource
def load_model():
    if not (os.path.exists(SCALER_PATH) and os.path.exists(MODEL_PATH)):
        return None
    scaler = joblib.load(SCALER_PATH)
    model = joblib.load(MODEL_PATH)
    return {"model": model, "scaler": scaler, "features": FEATURE_COLUMNS}
 
 
bundle = load_model()
 
# ----------------------------------------------------------------------
# HEADER
# ----------------------------------------------------------------------
st.markdown(f"""
<div class="ls-header">
    <div class="ls-eyebrow">LoanSetu AI · Underwriting Intelligence</div>
    <div class="ls-title">Loan Approval Prediction System</div>
    <div class="ls-subtitle">
        An ML-powered decisioning assistant that scores loan applications
        instantly using income, credit, collateral and employment signals —
        built for fast, consistent, and explainable underwriting.
    </div>
</div>
""", unsafe_allow_html=True)
 
if bundle is None:
    st.warning(
        "⚠️ Model files not found. Place your trained files at "
        "`scaler.pkl` and `xgb_model.pkl` in the app folder, then refresh this page."
    )
    st.stop()
 
model = bundle["model"]
scaler = bundle["scaler"]
feature_cols = bundle["features"]
 
# ----------------------------------------------------------------------
# SIDEBAR
# ----------------------------------------------------------------------
with st.sidebar:
    st.markdown("### 🏦 LoanSetu AI")
    st.markdown("---")
    st.markdown("**About**")
    st.write(
        "LoanSetu AI predicts loan approval likelihood using a "
        "XGBoost Classifier model trained on applicant financial, credit, "
        "and demographic features."
    )
    st.markdown("---")
    st.markdown("**Model**")
    st.write("Algorithm: XGBoost Classifier")
    st.write(f"Features used: {len(feature_cols)}")
    st.markdown("---")
    st.caption("© 2026 LoanSetu AI — Internal Decisioning Tool")
 
# ----------------------------------------------------------------------
# INPUT FORM
# ----------------------------------------------------------------------
st.markdown('<div class="ls-card">', unsafe_allow_html=True)
st.markdown('<div class="ls-section-title">Applicant & Financial Details</div>', unsafe_allow_html=True)
st.markdown('<div class="ls-section-caption">Enter the applicant\'s income, credit and demographic information</div>', unsafe_allow_html=True)
 
col1, col2, col3 = st.columns(3)
 
with col1:
    applicant_income = st.number_input("Applicant Income (₹/yr)", min_value=0, value=50000, step=1000)
    coapplicant_income = st.number_input("Co-applicant Income (₹/yr)", min_value=0, value=20000, step=1000)
    age = st.number_input("Age", min_value=18, max_value=75, value=30)
    dependents = st.selectbox("Dependents", [0, 1, 2, 3, 4], index=2)
    credit_score = st.slider("Credit Score", 300, 900, 750)
 
with col2:
    existing_loans = st.selectbox("Existing Loans", [0, 1, 2, 3], index=1)
    dti_ratio = st.slider("DTI Ratio (Debt-to-Income)", 0.0, 1.0, 0.30, step=0.01)
    savings = st.number_input("Savings (₹)", min_value=0, value=300000, step=5000)
    collateral_value = st.number_input("Collateral Value (₹)", min_value=0, value=500000, step=5000)
    loan_amount = st.number_input("Loan Amount Requested (₹)", min_value=0, value=200000, step=5000)
 
with col3:
    loan_term = st.selectbox("Loan Term (months)", [120, 180, 240, 300, 360], index=4)
    education_level = st.selectbox("Education Level", ["Not Graduate", "Graduate"], index=1)
    gender = st.selectbox("Gender", ["Female", "Male"], index=1)
    marital_status = st.selectbox("Marital Status", ["Married", "Single"], index=0)
    employment_status = st.selectbox("Employment Status", ["Salaried", "Self-employed", "Unemployed"], index=0)
 
col4, col5, col6 = st.columns(3)
with col4:
    loan_purpose = st.selectbox("Loan Purpose", ["Home", "Car", "Education", "Personal"], index=0)
with col5:
    property_area = st.selectbox("Property Area", ["Rural", "Semiurban", "Urban"], index=2)
with col6:
    employer_category = st.selectbox("Employer Category", ["MNC", "Government", "Private", "Unemployed"], index=0)
 
st.markdown('</div>', unsafe_allow_html=True)
 
 
# ----------------------------------------------------------------------
# BUILD FEATURE ROW
# ----------------------------------------------------------------------
def build_input_row():
    row = {
        "Applicant_Income": applicant_income,
        "Coapplicant_Income": coapplicant_income,
        "Age": age,
        "Dependents": dependents,
        "Credit_Score": credit_score,
        "Existing_Loans": existing_loans,
        "DTI_Ratio": dti_ratio,
        "Savings": savings,
        "Collateral_Value": collateral_value,
        "Loan_Amount": loan_amount,
        "Loan_Term": loan_term,
        "Education_Level": 1 if education_level == "Graduate" else 0,
        "Employment_Status_Salaried": int(employment_status == "Salaried"),
        "Employment_Status_Self-employed": int(employment_status == "Self-employed"),
        "Employment_Status_Unemployed": int(employment_status == "Unemployed"),
        "Marital_Status_Single": int(marital_status == "Single"),
        "Loan_Purpose_Car": int(loan_purpose == "Car"),
        "Loan_Purpose_Education": int(loan_purpose == "Education"),
        "Loan_Purpose_Home": int(loan_purpose == "Home"),
        "Loan_Purpose_Personal": int(loan_purpose == "Personal"),
        "Property_Area_Semiurban": int(property_area == "Semiurban"),
        "Property_Area_Urban": int(property_area == "Urban"),
        "Gender_Male": int(gender == "Male"),
        "Employer_Category_Government": int(employer_category == "Government"),
        "Employer_Category_MNC": int(employer_category == "MNC"),
        "Employer_Category_Private": int(employer_category == "Private"),
        "Employer_Category_Unemployed": int(employer_category == "Unemployed"),
    }
    return pd.DataFrame([row])[feature_cols]
 
 
# ----------------------------------------------------------------------
# PREDICT
# ----------------------------------------------------------------------
predict_col, _ = st.columns([1, 3])
with predict_col:
    predict_clicked = st.button("🔍 Predict Loan Approval", use_container_width=True)
 
# Run prediction and stash results in session_state so they survive the
# rerun that Streamlit triggers when the download button is clicked.
if predict_clicked:
    input_df = build_input_row()
    input_scaled = scaler.transform(input_df)
    prediction = model.predict(input_scaled)[0]
    probability = model.predict_proba(input_scaled)[0][1]
 
    st.session_state["ls_input_df"] = input_df
    st.session_state["ls_prediction"] = prediction
    st.session_state["ls_probability"] = probability
    st.session_state["ls_credit_score"] = credit_score
    st.session_state["ls_dti_ratio"] = dti_ratio
    st.session_state["ls_loan_amount"] = loan_amount
 
# Render results if we have any (either from this run or a previous run,
# e.g. right after the download button caused a rerun).
if "ls_prediction" in st.session_state:
    input_df = st.session_state["ls_input_df"]
    prediction = st.session_state["ls_prediction"]
    probability = st.session_state["ls_probability"]
    r_credit_score = st.session_state["ls_credit_score"]
    r_dti_ratio = st.session_state["ls_dti_ratio"]
    r_loan_amount = st.session_state["ls_loan_amount"]
 
    if prediction == 1:
        st.markdown(f"""
        <div class="ls-result-approved">
            <div class="ls-result-title">✅ Loan Likely to be Approved</div>
            <div style="color:{TEXT_MUTED};">Model confidence: <b>{probability*100:.1f}%</b></div>
            <div class="ls-chip-row">
                <div class="ls-chip">Credit Score: {r_credit_score}</div>
                <div class="ls-chip">DTI Ratio: {r_dti_ratio:.2f}</div>
                <div class="ls-chip">Loan Amount: ₹{r_loan_amount:,.0f}</div>
            </div>
        </div>
        """, unsafe_allow_html=True)
    else:
        st.markdown(f"""
        <div class="ls-result-rejected">
            <div class="ls-result-title">❌ Loan Likely to be Rejected</div>
            <div style="color:{TEXT_MUTED};">Model confidence: <b>{(1-probability)*100:.1f}%</b></div>
            <div class="ls-chip-row">
                <div class="ls-chip">Credit Score: {r_credit_score}</div>
                <div class="ls-chip">DTI Ratio: {r_dti_ratio:.2f}</div>
                <div class="ls-chip">Loan Amount: ₹{r_loan_amount:,.0f}</div>
            </div>
        </div>
        """, unsafe_allow_html=True)
 
    st.markdown('<div class="ls-card">', unsafe_allow_html=True)
    st.markdown('<div class="ls-section-title">Feature Snapshot</div>', unsafe_allow_html=True)
    st.dataframe(input_df.T.rename(columns={0: "Value"}), use_container_width=True)
    st.markdown('</div>', unsafe_allow_html=True)
 
    csv = input_df.to_csv(index=False).encode("utf-8")
    st.download_button(
        label="📥 Download Loan Report",
        data=csv,
        file_name="LoanSetu_Loan_Report.csv",
        mime="text/csv",
        use_container_width=True,
    )
 
# ----------------------------------------------------------------------
# FOOTER
# ----------------------------------------------------------------------
st.markdown("""
<div class="ls-footer">
    LoanSetu AI &middot; Built with Streamlit &middot; For internal / demo use only —
    not a substitute for formal credit underwriting.
</div>
""", unsafe_allow_html=True)
