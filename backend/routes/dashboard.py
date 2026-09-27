"""
GET /api/dashboard/summary   → portfolio KPIs
GET /api/dashboard/recent    → latest 10 applications with predictions
"""

from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import desc, func

from database import get_db
import models
import schemas
from auth import get_current_user

router = APIRouter(prefix="/api/dashboard", tags=["Dashboard"])


@router.get("/summary", response_model=schemas.DashboardSummary)
def dashboard_summary(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Return portfolio KPIs for the authenticated user."""
    apps = (
        db.query(models.LoanApplication)
        .options(joinedload(models.LoanApplication.prediction))
        .filter(models.LoanApplication.user_id == current_user.id)
        .all()
    )

    total   = len(apps)
    approved = sum(1 for a in apps if a.prediction and a.prediction.prediction == "APPROVED")
    rejected = sum(1 for a in apps if a.prediction and a.prediction.prediction == "REJECTED")
    pct      = round((approved / total * 100), 2) if total else 0.0
    avg_cs   = round(sum(a.credit_score for a in apps) / total, 2) if total else 0.0
    total_loan = float(sum(a.loan_amount for a in apps))

    return schemas.DashboardSummary(
        total_applications  = total,
        approved_count      = approved,
        rejected_count      = rejected,
        approval_percentage = pct,
        avg_credit_score    = avg_cs,
        total_loan_amount   = total_loan,
    )


@router.get("/recent", response_model=List[schemas.ApplicationOut])
def dashboard_recent(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Return the 10 most recent applications with predictions."""
    apps = (
        db.query(models.LoanApplication)
        .options(joinedload(models.LoanApplication.prediction))
        .filter(models.LoanApplication.user_id == current_user.id)
        .order_by(desc(models.LoanApplication.created_at))
        .limit(10)
        .all()
    )
    return [schemas.ApplicationOut.model_validate(a) for a in apps]
