"""
SQLAlchemy ORM models matching the database schema exactly.
Tables: users, loan_applications, predictions, prediction_logs
"""

from datetime import datetime
from sqlalchemy import (
    Column, Integer, String, Float, DateTime,
    ForeignKey, Text, DECIMAL, VARCHAR
)
from sqlalchemy.orm import relationship
from database import Base


class User(Base):
    __tablename__ = "users"

    id            = Column(Integer, primary_key=True, index=True, autoincrement=True)
    full_name     = Column(String(120), nullable=False)
    email         = Column(String(150), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    phone         = Column(String(25), nullable=True)
    role          = Column(String(20), default="user", nullable=False)
    created_at    = Column(DateTime, default=datetime.utcnow)
    updated_at    = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    applications  = relationship(
        "LoanApplication", back_populates="owner", cascade="all, delete-orphan"
    )
    prediction_logs = relationship(
        "PredictionLog", back_populates="user", cascade="all, delete-orphan"
    )


class LoanApplication(Base):
    __tablename__ = "loan_applications"

    id                 = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id            = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)

    # Numeric financial features
    applicant_income   = Column(DECIMAL(14, 2), nullable=False)
    coapplicant_income = Column(DECIMAL(14, 2), nullable=False)
    age                = Column(Integer, nullable=False)
    dependents         = Column(Integer, nullable=False)
    credit_score       = Column(Integer, nullable=False)
    existing_loans     = Column(Integer, nullable=False)
    dti_ratio          = Column(DECIMAL(6, 4), nullable=False)
    savings            = Column(DECIMAL(14, 2), nullable=False)
    collateral_value   = Column(DECIMAL(14, 2), nullable=False)
    loan_amount        = Column(DECIMAL(14, 2), nullable=False)
    loan_term          = Column(Integer, nullable=False)

    # Categorical features
    education_level    = Column(String(50), nullable=False)
    gender             = Column(String(20), nullable=False)
    marital_status     = Column(String(20), nullable=False)
    employment_status  = Column(String(50), nullable=False)
    loan_purpose       = Column(String(50), nullable=False)
    property_area      = Column(String(50), nullable=False)
    employer_category  = Column(String(50), nullable=False)

    created_at         = Column(DateTime, default=datetime.utcnow, index=True)

    owner              = relationship("User", back_populates="applications")
    prediction         = relationship(
        "Prediction", back_populates="application",
        uselist=False, cascade="all, delete-orphan"
    )
    log                = relationship(
        "PredictionLog", back_populates="application", cascade="all, delete-orphan"
    )


class Prediction(Base):
    __tablename__ = "predictions"

    id                   = Column(Integer, primary_key=True, index=True, autoincrement=True)
    application_id       = Column(
        Integer, ForeignKey("loan_applications.id", ondelete="CASCADE"),
        nullable=False, unique=True, index=True
    )
    prediction           = Column(String(20), nullable=False)   # 'APPROVED' | 'REJECTED'
    approval_probability = Column(DECIMAL(6, 4), nullable=False)
    rejection_probability= Column(DECIMAL(6, 4), nullable=False)
    model_name           = Column(String(100), default="XGBoost Classifier")
    model_version        = Column(String(50),  default="1.0.0")
    predicted_at         = Column(DateTime, default=datetime.utcnow)

    application          = relationship("LoanApplication", back_populates="prediction")


class PredictionLog(Base):
    __tablename__ = "prediction_logs"

    id             = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id        = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True)
    application_id = Column(Integer, ForeignKey("loan_applications.id", ondelete="CASCADE"), nullable=True, index=True)
    request_time   = Column(DateTime, nullable=False, default=datetime.utcnow)
    response_time  = Column(DateTime, nullable=True)
    status         = Column(String(50), nullable=False, default="pending")

    user           = relationship("User", back_populates="prediction_logs")
    application    = relationship("LoanApplication", back_populates="log")
