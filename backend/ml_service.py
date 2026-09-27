"""
ML Service — loads xgb_model.pkl + scaler.pkl and runs inference.

IMPORTANT: Preserves EXACT preprocessing from original Streamlit app.py.
Do NOT change feature order or encoding logic.
"""

import os
import logging
import joblib
import pandas as pd
import numpy as np
from typing import Tuple

logger = logging.getLogger("loansetu.ml")

# ---------------------------------------------------------------------------
# 27 feature columns in the EXACT order the model was trained on
# ---------------------------------------------------------------------------
FEATURE_COLUMNS = [
    "Applicant_Income",
    "Coapplicant_Income",
    "Age",
    "Dependents",
    "Credit_Score",
    "Existing_Loans",
    "DTI_Ratio",
    "Savings",
    "Collateral_Value",
    "Loan_Amount",
    "Loan_Term",
    "Education_Level",
    "Employment_Status_Salaried",
    "Employment_Status_Self-employed",
    "Employment_Status_Unemployed",
    "Marital_Status_Single",
    "Loan_Purpose_Car",
    "Loan_Purpose_Education",
    "Loan_Purpose_Home",
    "Loan_Purpose_Personal",
    "Property_Area_Semiurban",
    "Property_Area_Urban",
    "Gender_Male",
    "Employer_Category_Government",
    "Employer_Category_MNC",
    "Employer_Category_Private",
    "Employer_Category_Unemployed",
]

MODEL_VERSION: str = os.getenv("MODEL_VERSION", "1.0.0")


class MLService:
    """Singleton-style ML service; loaded once at startup."""

    def __init__(self):
        self._model  = None
        self._scaler = None
        self._loaded = False
        self._load()

    # ------------------------------------------------------------------
    # Path resolution
    # ------------------------------------------------------------------
    @staticmethod
    def _resolve(env_var: str, relatives: list[str]) -> str:
        val = os.getenv(env_var, "")
        if val and os.path.isfile(val):
            return val
        base = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        for rel in relatives:
            cand = os.path.normpath(os.path.join(base, rel))
            if os.path.isfile(cand):
                return cand
        return ""

    # ------------------------------------------------------------------
    # Artifact loading — raises clear errors
    # ------------------------------------------------------------------
    def _load(self):
        model_path  = self._resolve("MODEL_PATH",  ["ml/xgb_model.pkl",  "xgb_model.pkl"])
        scaler_path = self._resolve("SCALER_PATH", ["ml/scaler.pkl",     "scaler.pkl"])

        if not model_path:
            logger.error("xgb_model.pkl not found. Set MODEL_PATH in .env or place it in the ml/ folder.")
            return
        if not scaler_path:
            logger.error("scaler.pkl not found. Set SCALER_PATH in .env or place it in the ml/ folder.")
            return

        try:
            import warnings
            with warnings.catch_warnings():
                warnings.simplefilter("ignore")
                self._scaler = joblib.load(scaler_path)
                self._model  = joblib.load(model_path)
            self._loaded = True
            logger.info("ML artifacts loaded: model=%s  scaler=%s", model_path, scaler_path)
        except Exception as exc:
            logger.error("Failed to load ML artifacts: %s", exc)

    # ------------------------------------------------------------------
    # Status
    # ------------------------------------------------------------------
    def status(self) -> Tuple[bool, str]:
        if self._loaded:
            return True, f"loaded ({type(self._model).__name__} v{MODEL_VERSION})"
        return False, "Model or Scaler file not found / could not be loaded."

    # ------------------------------------------------------------------
    # Feature engineering — identical to original app.py build_input_row()
    # ------------------------------------------------------------------
    def _build_dataframe(self, d) -> pd.DataFrame:
        row = {
            "Applicant_Income":                float(d.applicant_income),
            "Coapplicant_Income":              float(d.coapplicant_income),
            "Age":                             int(d.age),
            "Dependents":                      int(d.dependents),
            "Credit_Score":                    int(d.credit_score),
            "Existing_Loans":                  int(d.existing_loans),
            "DTI_Ratio":                       float(d.dti_ratio),
            "Savings":                         float(d.savings),
            "Collateral_Value":                float(d.collateral_value),
            "Loan_Amount":                     float(d.loan_amount),
            "Loan_Term":                       int(d.loan_term),
            "Education_Level":                 1 if d.education_level == "Graduate" else 0,
            "Employment_Status_Salaried":      int(d.employment_status == "Salaried"),
            "Employment_Status_Self-employed": int(d.employment_status == "Self-employed"),
            "Employment_Status_Unemployed":    int(d.employment_status == "Unemployed"),
            "Marital_Status_Single":           int(d.marital_status == "Single"),
            "Loan_Purpose_Car":                int(d.loan_purpose == "Car"),
            "Loan_Purpose_Education":          int(d.loan_purpose == "Education"),
            "Loan_Purpose_Home":               int(d.loan_purpose == "Home"),
            "Loan_Purpose_Personal":           int(d.loan_purpose == "Personal"),
            "Property_Area_Semiurban":         int(d.property_area == "Semiurban"),
            "Property_Area_Urban":             int(d.property_area == "Urban"),
            "Gender_Male":                     int(d.gender == "Male"),
            "Employer_Category_Government":    int(d.employer_category == "Government"),
            "Employer_Category_MNC":           int(d.employer_category == "MNC"),
            "Employer_Category_Private":       int(d.employer_category == "Private"),
            "Employer_Category_Unemployed":    int(d.employer_category == "Unemployed"),
        }
        return pd.DataFrame([row])[FEATURE_COLUMNS]

    # ------------------------------------------------------------------
    # Predict
    # ------------------------------------------------------------------
    def predict(self, data) -> dict:
        if not self._loaded:
            self._load()                            # retry once
        if not self._loaded:
            raise RuntimeError(
                "ML model or scaler is not loaded. "
                "Please verify xgb_model.pkl and scaler.pkl exist in the ml/ folder."
            )

        try:
            df     = self._build_dataframe(data)
            scaled = self._scaler.transform(df)
            pred   = int(self._model.predict(scaled)[0])
            proba  = self._model.predict_proba(scaled)[0]   # [p_rejected, p_approved]
            p_approved  = float(proba[1])
            p_rejected  = float(proba[0])
        except Exception as exc:
            logger.error("Prediction runtime error: %s", exc)
            raise RuntimeError(f"Prediction failed: {exc}") from exc

        label = "APPROVED" if pred == 1 else "REJECTED"
        if label == "APPROVED":
            msg = "The model predicts that this application is likely to be approved."
        else:
            msg = "The model predicts that this application is likely to be rejected."

        return {
            "label":               label,
            "approval_probability":  round(p_approved, 4),
            "rejection_probability": round(p_rejected, 4),
            "model_name":          "XGBoost Classifier",
            "model_version":       MODEL_VERSION,
            "message":             msg,
        }


# Global singleton
ml_service = MLService()
