"""
POST /api/predictions/predict

Full pipeline:
1. Authenticate user
2. Validate input (Pydantic)
3. Save LoanApplication → MySQL
4. Encode categoricals exactly like app.py
5. Build 27-column DataFrame
6. scaler.transform()
7. model.predict() + model.predict_proba()
8. Determine APPROVED / REJECTED
9. Save Prediction → MySQL
10. Log timing → prediction_logs
11. Return result with disclaimer
"""

import logging
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from database import get_db
import models
import schemas
from auth import get_current_user
from ml_service import ml_service

logger = logging.getLogger("loansetu.predictions")

router = APIRouter(prefix="/api/predictions", tags=["ML Prediction"])


@router.post("/predict", response_model=schemas.PredictionOut, status_code=201)
def predict(
    body: schemas.LoanApplicationInput,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    request_time = datetime.utcnow()

    # ------------------------------------------------------------------
    # 1. Check model health first — give a clear error if missing
    # ------------------------------------------------------------------
    model_ok, model_msg = ml_service.status()
    if not model_ok:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=(
                f"ML model is not available: {model_msg}. "
                "Please contact the administrator to verify xgb_model.pkl and scaler.pkl."
            ),
        )

    # ------------------------------------------------------------------
    # 2. Save loan application to MySQL
    # ------------------------------------------------------------------
    app_record = models.LoanApplication(
        user_id            = current_user.id,
        applicant_income   = body.applicant_income,
        coapplicant_income = body.coapplicant_income,
        age                = body.age,
        dependents         = body.dependents,
        credit_score       = body.credit_score,
        existing_loans     = body.existing_loans,
        dti_ratio          = body.dti_ratio,
        savings            = body.savings,
        collateral_value   = body.collateral_value,
        loan_amount        = body.loan_amount,
        loan_term          = body.loan_term,
        education_level    = body.education_level,
        gender             = body.gender,
        marital_status     = body.marital_status,
        employment_status  = body.employment_status,
        loan_purpose       = body.loan_purpose,
        property_area      = body.property_area,
        employer_category  = body.employer_category,
    )
    db.add(app_record)
    db.commit()
    db.refresh(app_record)

    # ------------------------------------------------------------------
    # 3. Run ML pipeline
    # ------------------------------------------------------------------
    try:
        result = ml_service.predict(body)
    except RuntimeError as exc:
        # Log failure and return 500 with a useful message
        response_time = datetime.utcnow()
        log = models.PredictionLog(
            user_id        = current_user.id,
            application_id = app_record.id,
            request_time   = request_time,
            response_time  = response_time,
            status         = "PREDICTION_ERROR",
        )
        db.add(log)
        db.commit()
        logger.error("Prediction error for application %d: %s", app_record.id, exc)
        raise HTTPException(status_code=500, detail=str(exc))

    # ------------------------------------------------------------------
    # 4. Save prediction to MySQL
    # ------------------------------------------------------------------
    pred_record = models.Prediction(
        application_id        = app_record.id,
        prediction            = result["label"],
        approval_probability  = result["approval_probability"],
        rejection_probability = result["rejection_probability"],
        model_name            = result["model_name"],
        model_version         = result["model_version"],
    )
    db.add(pred_record)

    # 5. Log timing
    response_time = datetime.utcnow()
    log = models.PredictionLog(
        user_id        = current_user.id,
        application_id = app_record.id,
        request_time   = request_time,
        response_time  = response_time,
        status         = "SUCCESS",
    )
    db.add(log)
    db.commit()
    db.refresh(pred_record)

    # ------------------------------------------------------------------
    # 6. Return response
    # ------------------------------------------------------------------
    return schemas.PredictionOut(
        application_id        = app_record.id,
        prediction            = result["label"],
        approval_probability  = result["approval_probability"],
        rejection_probability = result["rejection_probability"],
        model                 = result["model_name"],
        model_version         = result["model_version"],
        message               = result["message"],
        predicted_at          = pred_record.predicted_at,
    )
