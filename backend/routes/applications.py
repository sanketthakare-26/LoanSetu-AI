"""
GET  /api/applications          → list current user's applications
GET  /api/applications/{id}     → single application + prediction
DELETE /api/applications/{id}   → delete own application
"""

from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import desc

from database import get_db
import models
import schemas
from auth import get_current_user

router = APIRouter(prefix="/api/applications", tags=["Loan Applications"])


@router.get("", response_model=List[schemas.ApplicationOut])
def list_applications(
    limit:  int = Query(50, ge=1, le=200),
    offset: int = Query(0, ge=0),
    prediction_filter: Optional[str] = Query(None, alias="prediction"),
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Return the authenticated user's loan applications (newest first)."""
    q = (
        db.query(models.LoanApplication)
        .options(joinedload(models.LoanApplication.prediction))
        .filter(models.LoanApplication.user_id == current_user.id)
    )
    if prediction_filter and prediction_filter.upper() in ("APPROVED", "REJECTED"):
        q = q.join(models.Prediction).filter(
            models.Prediction.prediction == prediction_filter.upper()
        )
    apps = q.order_by(desc(models.LoanApplication.created_at)).offset(offset).limit(limit).all()
    return [schemas.ApplicationOut.model_validate(a) for a in apps]


@router.get("/{app_id}", response_model=schemas.ApplicationOut)
def get_application(
    app_id: int,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Return a single application with its prediction. Users can only see their own."""
    app = (
        db.query(models.LoanApplication)
        .options(joinedload(models.LoanApplication.prediction))
        .filter(
            models.LoanApplication.id == app_id,
            models.LoanApplication.user_id == current_user.id,
        )
        .first()
    )
    if not app:
        raise HTTPException(status_code=404, detail="Application not found.")
    return schemas.ApplicationOut.model_validate(app)


@router.delete("/{app_id}", status_code=204)
def delete_application(
    app_id: int,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Delete own application. Cascades to predictions and logs."""
    app = db.query(models.LoanApplication).filter(
        models.LoanApplication.id == app_id,
        models.LoanApplication.user_id == current_user.id,
    ).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found.")
    db.delete(app)
    db.commit()
    return None
