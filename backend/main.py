"""
FastAPI application entry point.
"""

import logging
from contextlib import asynccontextmanager
from datetime import datetime

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import init_db, check_db_connection
from ml_service import ml_service, FEATURE_COLUMNS
from routes import auth, prediction, applications, dashboard, admin

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger("loansetu")


# ---------------------------------------------------------------------------
# Startup / Shutdown
# ---------------------------------------------------------------------------
@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("=== LoanSetu AI Backend Starting ===")
    init_db()
    ok, msg = ml_service.status()
    logger.info("ML Model: %s", msg)
    yield
    logger.info("=== LoanSetu AI Backend Stopped ===")


# ---------------------------------------------------------------------------
# App
# ---------------------------------------------------------------------------
app = FastAPI(
    title="LoanSetu AI – Loan Approval Prediction API",
    description=(
        "Intelligent underwriting powered by XGBoost. "
        "All predictions come with a disclaimer: results are model-generated "
        "and are NOT guaranteed lending decisions."
    ),
    version="2.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(auth.router)
app.include_router(prediction.router)
app.include_router(applications.router)
app.include_router(dashboard.router)
app.include_router(admin.router)


# ---------------------------------------------------------------------------
# System endpoints
# ---------------------------------------------------------------------------
@app.get("/", tags=["System"])
def root():
    return {
        "service": "LoanSetu AI – Intelligent Loan Approval Prediction System",
        "version": "2.0.0",
        "docs":    "/docs",
        "health":  "/api/health",
    }


@app.get("/api/health", tags=["System"])
def health():
    db_ok, db_msg   = check_db_connection()
    ml_ok, ml_msg   = ml_service.status()
    return {
        "backend":        "healthy",
        "database":       "connected" if db_ok else f"error: {db_msg}",
        "model":          "loaded"    if ml_ok else f"error: {ml_msg}",
        "features_count": len(FEATURE_COLUMNS),
        "timestamp":      datetime.utcnow().isoformat(),
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
