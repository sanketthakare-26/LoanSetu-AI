import os
import logging
from urllib.parse import urlparse, unquote

from dotenv import load_dotenv
from sqlalchemy import create_engine, text
from sqlalchemy.orm import declarative_base, sessionmaker

# ---------------------------------------------------------------------------
# Environment
# ---------------------------------------------------------------------------
load_dotenv(os.path.join(os.path.dirname(__file__), ".env"))

logger = logging.getLogger("loansetu.database")

DATABASE_URL: str = os.getenv(
    "DATABASE_URL",
    "mysql+pymysql://root:root@localhost:3306/loan_setu"
)

# ---------------------------------------------------------------------------
# Auto-create MySQL database if it doesn't exist
# ---------------------------------------------------------------------------
def _ensure_mysql_db(db_url: str) -> None:
    if not db_url.startswith("mysql"):
        return
    try:
        parsed = urlparse(db_url)
        db_name = parsed.path.lstrip("/")
        if not db_name:
            return
        import pymysql
        conn = pymysql.connect(
            host=parsed.hostname or "localhost",
            user=unquote(parsed.username or "root"),
            password=unquote(parsed.password or ""),
            port=parsed.port or 3306,
            connect_timeout=5,
        )
        with conn.cursor() as cur:
            cur.execute(
                f"CREATE DATABASE IF NOT EXISTS `{db_name}` "
                f"CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
            )
        conn.close()
        logger.info("MySQL database '%s' verified/created.", db_name)
    except Exception as exc:
        logger.warning("Could not auto-create MySQL database: %s", exc)


# ---------------------------------------------------------------------------
# Build engine (MySQL first, fall back to SQLite for dev)
# ---------------------------------------------------------------------------
_db_status: str = "uninitialized"

try:
    _ensure_mysql_db(DATABASE_URL)
    engine = create_engine(
        DATABASE_URL,
        pool_pre_ping=True,
        pool_recycle=3600,
        pool_size=10,
        max_overflow=20,
    )
    with engine.connect() as _c:
        _c.execute(text("SELECT 1"))
    _db_status = f"connected ({engine.dialect.name})"
    logger.info("Database engine ready: %s", _db_status)
except Exception as _mysql_err:
    logger.warning("MySQL unavailable (%s). Using SQLite fallback.", _mysql_err)
    _fallback = "sqlite:///./loan_setu.db"
    engine = create_engine(_fallback, connect_args={"check_same_thread": False})
    _db_status = f"fallback SQLite (MySQL error: {_mysql_err})"

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


# ---------------------------------------------------------------------------
# FastAPI dependency
# ---------------------------------------------------------------------------
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ---------------------------------------------------------------------------
# Health helpers
# ---------------------------------------------------------------------------
def check_db_connection() -> tuple[bool, str]:
    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        return True, _db_status
    except Exception as exc:
        return False, str(exc)


def init_db() -> None:
    try:
        Base.metadata.create_all(bind=engine)
        # Ensure migration columns exist for existing tables
        with engine.begin() as conn:
            if engine.dialect.name == "mysql":
                try:
                    conn.execute(text("ALTER TABLE users ADD COLUMN role VARCHAR(20) NOT NULL DEFAULT 'user';"))
                    logger.info("Added role column to users table.")
                except Exception:
                    pass
        logger.info("All tables created/verified on %s.", engine.dialect.name)
    except Exception as exc:
        logger.error("Failed to create tables: %s", exc)
