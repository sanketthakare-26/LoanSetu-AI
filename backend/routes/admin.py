"""
Admin routes: system-wide statistics, applications view, user management.
Protected by require_admin dependency.
"""

from typing import List, Optional
from collections import defaultdict
from datetime import datetime, timedelta

from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import desc, func

from database import get_db
import models
import schemas
from auth import require_admin

router = APIRouter(prefix="/api/admin", tags=["Admin Operations"])


@router.get("/stats", response_model=schemas.AdminStatsOut)
def get_admin_stats(
    admin_user: models.User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    """Return platform-wide operational statistics and charts data."""
    users_count = db.query(models.User).count()
    apps = (
        db.query(models.LoanApplication)
        .options(joinedload(models.LoanApplication.prediction))
        .all()
    )

    total_apps = len(apps)
    approved_count = sum(1 for a in apps if a.prediction and a.prediction.prediction == "APPROVED")
    rejected_count = sum(1 for a in apps if a.prediction and a.prediction.prediction == "REJECTED")
    approval_rate = round((approved_count / total_apps * 100), 2) if total_apps > 0 else 0.0
    total_loan_amount = float(sum(a.loan_amount for a in apps))

    # Daily applications aggregation (last 7 days or all recent dates)
    date_counts = defaultdict(int)
    date_approved = defaultdict(int)
    date_rejected = defaultdict(int)
    purpose_counts = defaultdict(int)
    emp_counts = defaultdict(int)

    for a in apps:
        d_str = a.created_at.strftime("%Y-%m-%d") if a.created_at else "Unknown"
        date_counts[d_str] += 1
        if a.prediction and a.prediction.prediction == "APPROVED":
            date_approved[d_str] += 1
        elif a.prediction and a.prediction.prediction == "REJECTED":
            date_rejected[d_str] += 1
        
        purpose_counts[a.loan_purpose or "Other"] += 1
        emp_counts[a.employment_status or "Other"] += 1

    # Format daily applications
    sorted_dates = sorted(date_counts.keys())
    daily_applications = [
        {"date": d, "count": date_counts[d]}
        for d in sorted_dates
    ]
    approval_trend = [
        {
            "date": d,
            "approved": date_approved[d],
            "rejected": date_rejected[d],
            "total": date_counts[d]
        }
        for d in sorted_dates
    ]
    purpose_distribution = [
        {"purpose": k, "count": v}
        for k, v in purpose_counts.items()
    ]
    employment_distribution = [
        {"status": k, "count": v}
        for k, v in emp_counts.items()
    ]

    return schemas.AdminStatsOut(
        total_users=users_count,
        total_applications=total_apps,
        total_approved=approved_count,
        total_rejected=rejected_count,
        approval_rate=approval_rate,
        total_loan_amount=total_loan_amount,
        daily_applications=daily_applications,
        approval_trend=approval_trend,
        purpose_distribution=purpose_distribution,
        employment_distribution=employment_distribution,
    )


@router.get("/applications", response_model=List[schemas.AdminApplicationOut])
def get_all_applications(
    limit: int = Query(50, ge=1, le=200),
    offset: int = Query(0, ge=0),
    prediction_filter: Optional[str] = Query(None, alias="prediction"),
    search: Optional[str] = Query(None),
    admin_user: models.User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    """List all applications in the system with user metadata (Admin only)."""
    q = (
        db.query(models.LoanApplication)
        .options(
            joinedload(models.LoanApplication.prediction),
            joinedload(models.LoanApplication.owner)
        )
    )

    if prediction_filter and prediction_filter.upper() in ("APPROVED", "REJECTED"):
        q = q.join(models.Prediction).filter(
            models.Prediction.prediction == prediction_filter.upper()
        )

    if search:
        s = f"%{search.strip()}%"
        q = q.join(models.User).filter(
            (models.User.full_name.ilike(s)) |
            (models.User.email.ilike(s)) |
            (models.LoanApplication.loan_purpose.ilike(s))
        )

    apps = q.order_by(desc(models.LoanApplication.created_at)).offset(offset).limit(limit).all()

    result = []
    for a in apps:
        item = {
            "id": a.id,
            "user_id": a.user_id,
            "user_name": a.owner.full_name if a.owner else "N/A",
            "user_email": a.owner.email if a.owner else "N/A",
            "applicant_income": float(a.applicant_income),
            "coapplicant_income": float(a.coapplicant_income),
            "age": a.age,
            "dependents": a.dependents,
            "credit_score": a.credit_score,
            "existing_loans": a.existing_loans,
            "dti_ratio": float(a.dti_ratio),
            "savings": float(a.savings),
            "collateral_value": float(a.collateral_value),
            "loan_amount": float(a.loan_amount),
            "loan_term": a.loan_term,
            "education_level": a.education_level,
            "gender": a.gender,
            "marital_status": a.marital_status,
            "employment_status": a.employment_status,
            "loan_purpose": a.loan_purpose,
            "property_area": a.property_area,
            "employer_category": a.employer_category,
            "created_at": a.created_at,
            "prediction": a.prediction,
        }
        result.append(schemas.AdminApplicationOut.model_validate(item))

    return result


@router.get("/users", response_model=List[schemas.AdminUserOut])
def get_all_users(
    limit: int = Query(50, ge=1, le=200),
    offset: int = Query(0, ge=0),
    admin_user: models.User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    """List all registered users with their application counts (Admin only)."""
    users = (
        db.query(models.User)
        .options(joinedload(models.User.applications))
        .order_by(desc(models.User.created_at))
        .offset(offset)
        .limit(limit)
        .all()
    )

    result = []
    for u in users:
        result.append(
            schemas.AdminUserOut(
                id=u.id,
                full_name=u.full_name,
                email=u.email,
                phone=u.phone,
                role=u.role or "user",
                created_at=u.created_at,
                applications_count=len(u.applications) if u.applications else 0,
            )
        )
    return result
