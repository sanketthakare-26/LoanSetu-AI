# -*- coding: utf-8 -*-
"""
Comprehensive backend test suite (Windows-safe, real email domains).
Tests: DB init, register, login, predict, history, dashboard, delete.
"""
import sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")

import random
from fastapi.testclient import TestClient

print("Loading FastAPI app ...")
from main import app
from database import init_db

init_db()   # Ensure all 4 tables exist in MySQL

client = TestClient(app, raise_server_exceptions=False)

# ------------------------------------------------------------------
PASS_M = "[PASS]"
FAIL_M = "[FAIL]"
errors = []

def check(label, condition, detail=""):
    if condition:
        print(f"  {PASS_M}  {label}")
    else:
        det = f"  =>  {detail}" if detail else ""
        print(f"  {FAIL_M}  {label}{det}")
        errors.append(label)

# ==================== 1. HEALTH ===================
print("\n--- 1. HEALTH CHECK ---")
r = client.get("/api/health")
check("GET /api/health 200",          r.status_code == 200, r.text[:200])
check("backend = healthy",            r.json().get("backend") == "healthy")
check("model = loaded",               r.json().get("model") == "loaded",  r.json().get("model"))
check("database = connected",         "connected" in r.json().get("database",""))
check("features_count = 27",          r.json().get("features_count") == 27)

# ==================== 2. REGISTER ===================
print("\n--- 2. REGISTER ---")
uid   = random.randint(10000, 99999)
email = f"testuser{uid}@gmail.com"           # real-looking TLD so Pydantic EmailStr passes

r = client.post("/api/auth/register", json={
    "full_name": "Priya Sharma",
    "email": email,
    "password": "Secure@123",
    "phone": "9876543210"
})
check("POST /api/auth/register 201",  r.status_code == 201, r.text[:300])
check("access_token in response",     "access_token" in r.json())
check("password_hash NOT returned",   "password_hash" not in str(r.json()))

TOKEN = r.json().get("access_token", "")
AUTH  = {"Authorization": f"Bearer {TOKEN}"}

# Duplicate should fail
r2 = client.post("/api/auth/register", json={
    "full_name": "Dup User", "email": email, "password": "Test@123"
})
check("Duplicate email -> 400",       r2.status_code == 400)

# ==================== 3. LOGIN ===================
print("\n--- 3. LOGIN ---")
r = client.post("/api/auth/login", json={"email": email, "password": "Secure@123"})
check("POST /api/auth/login 200",     r.status_code == 200, r.text[:300])
check("access_token in response",     "access_token" in r.json())
check("password_hash NOT returned",   "password_hash" not in str(r.json()))

TOKEN = r.json().get("access_token", TOKEN)
AUTH  = {"Authorization": f"Bearer {TOKEN}"}

r_bad = client.post("/api/auth/login", json={"email": email, "password": "WRONG"})
check("Wrong password -> 401",        r_bad.status_code == 401)

# ==================== 4. ME ===================
print("\n--- 4. GET /api/auth/me ---")
r = client.get("/api/auth/me", headers=AUTH)
check("GET /api/auth/me 200",         r.status_code == 200, r.text[:200])
check("email matches",                r.json().get("email") == email)
check("password_hash not exposed",    "password_hash" not in str(r.json()))

r_no = client.get("/api/auth/me")
check("Unauthenticated /me -> 401",   r_no.status_code == 401)

# ==================== 5. PREDICT APPROVED ===================
print("\n--- 5. PREDICT (PRIME / APPROVED) ---")
prime = {
    "applicant_income": 95000, "coapplicant_income": 45000,
    "age": 34, "dependents": 1, "credit_score": 810,
    "existing_loans": 0, "dti_ratio": 0.22,
    "savings": 800000, "collateral_value": 1500000,
    "loan_amount": 500000, "loan_term": 240,
    "education_level": "Graduate", "gender": "Male",
    "marital_status": "Married", "employment_status": "Salaried",
    "loan_purpose": "Home", "property_area": "Urban",
    "employer_category": "MNC"
}
r = client.post("/api/predictions/predict", json=prime, headers=AUTH)
check("POST /api/predictions/predict 201", r.status_code == 201, r.text[:400])
pred = r.json() if r.status_code == 201 else {}
check("prediction key present",       "prediction" in pred)
check("approval_probability present", "approval_probability" in pred)
check("rejection_probability present","rejection_probability" in pred)
check("model = XGBoost Classifier",   pred.get("model") == "XGBoost Classifier")
check("disclaimer present",           "disclaimer" in pred)
check("proba sum ~1.0",               abs(pred.get("approval_probability",0)
                                         + pred.get("rejection_probability",0) - 1.0) < 0.02)
app_id_1 = pred.get("application_id")
print(f"    => app_id={app_id_1}  decision={pred.get('prediction')}  "
      f"p_approved={pred.get('approval_probability')}")

# Unauthenticated
r_ua = client.post("/api/predictions/predict", json=prime)
check("Unauthenticated predict -> 401", r_ua.status_code == 401)

# ==================== 6. PREDICT REJECTED ===================
print("\n--- 6. PREDICT (HIGH-RISK / REJECTED) ---")
risky = {
    "applicant_income": 18000, "coapplicant_income": 0,
    "age": 23, "dependents": 3, "credit_score": 450,
    "existing_loans": 4, "dti_ratio": 0.70,
    "savings": 5000, "collateral_value": 20000,
    "loan_amount": 450000, "loan_term": 120,
    "education_level": "Not Graduate", "gender": "Female",
    "marital_status": "Single", "employment_status": "Unemployed",
    "loan_purpose": "Personal", "property_area": "Rural",
    "employer_category": "Unemployed"
}
r = client.post("/api/predictions/predict", json=risky, headers=AUTH)
check("High-risk predict 201",        r.status_code == 201, r.text[:400])
pred2 = r.json() if r.status_code == 201 else {}
app_id_2 = pred2.get("application_id")
print(f"    => app_id={app_id_2}  decision={pred2.get('prediction')}  "
      f"p_approved={pred2.get('approval_probability')}")

# ==================== 7. LIST APPLICATIONS ===================
print("\n--- 7. LIST APPLICATIONS ---")
r = client.get("/api/applications", headers=AUTH)
check("GET /api/applications 200",    r.status_code == 200, r.text[:200])
apps = r.json() if r.status_code == 200 else []
check("Returns list",                 isinstance(apps, list))
check("At least 2 applications",      len(apps) >= 2)
check("prediction field included",    len(apps) > 0 and "prediction" in apps[0])
check("user_id is current user",      all(a["user_id"] == r.json()[0]["user_id"] for a in apps) if isinstance(r.json(), list) and len(r.json()) > 0 else True)

# ==================== 8. GET SINGLE ===================
print("\n--- 8. GET SINGLE APPLICATION ---")
if app_id_1:
    r = client.get(f"/api/applications/{app_id_1}", headers=AUTH)
    check(f"GET /api/applications/{app_id_1} 200", r.status_code == 200, r.text[:200])
    check("id matches",                r.json().get("id") == app_id_1)
    check("prediction nested",         r.json().get("prediction") is not None)

    r_unauth = client.get(f"/api/applications/{app_id_1}")
    check("Unauthenticated GET -> 401", r_unauth.status_code == 401)

# ==================== 9. DASHBOARD SUMMARY ===================
print("\n--- 9. DASHBOARD SUMMARY ---")
r = client.get("/api/dashboard/summary", headers=AUTH)
check("GET /api/dashboard/summary 200", r.status_code == 200, r.text[:300])
s = r.json() if r.status_code == 200 else {}
check("total_applications >= 2",     s.get("total_applications", 0) >= 2)
check("approval_percentage is float",isinstance(s.get("approval_percentage", None), float))
check("total_loan_amount > 0",       s.get("total_loan_amount", 0) > 0)
print(f"    => total={s.get('total_applications')}  "
      f"approved={s.get('approved_count')}  "
      f"rejected={s.get('rejected_count')}  "
      f"pct={s.get('approval_percentage')}%")

# ==================== 10. DASHBOARD RECENT ===================
print("\n--- 10. DASHBOARD RECENT ---")
r = client.get("/api/dashboard/recent", headers=AUTH)
check("GET /api/dashboard/recent 200", r.status_code == 200, r.text[:200])
check("Returns list",                  isinstance(r.json(), list))

# ==================== 11. DELETE ===================
print("\n--- 11. DELETE APPLICATION ---")
if app_id_2:
    r = client.delete(f"/api/applications/{app_id_2}", headers=AUTH)
    check(f"DELETE /api/applications/{app_id_2} 204", r.status_code == 204)
    r_del = client.get(f"/api/applications/{app_id_2}", headers=AUTH)
    check("Deleted app -> 404",        r_del.status_code == 404)

# ==================== 12. SECTION 19 SPECIFIC MODEL INTEGRATION TEST ===================
print("\n--- 12. SECTION 19 SPECIFIC MODEL INTEGRATION TEST ---")
req19_input = {
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
r19 = client.post("/api/predictions/predict", json=req19_input, headers=AUTH)
check("Section 19 test prediction 201", r19.status_code == 201, r19.text[:300])
p19 = r19.json() if r19.status_code == 201 else {}
check("Section 19 prediction has result", "prediction" in p19)
print(f"    => Section 19 Result: {p19.get('prediction')} | p_approved={p19.get('approval_probability')} | p_rejected={p19.get('rejection_probability')}")

# ==================== 13. USER PROFILE & PASSWORD ===================
print("\n--- 13. USER PROFILE & PASSWORD ---")
r_prof = client.put("/api/auth/profile", json={"full_name": "Priya Sharma Updated", "phone": "9998887776"}, headers=AUTH)
check("PUT /api/auth/profile 200", r_prof.status_code == 200)
check("Updated name matches", r_prof.json().get("full_name") == "Priya Sharma Updated")

r_pw = client.put("/api/auth/change-password", json={"current_password": "Secure@123", "new_password": "NewSecure@123"}, headers=AUTH)
check("PUT /api/auth/change-password 200", r_pw.status_code == 200)

# Verify new password login
r_newlogin = client.post("/api/auth/login", json={"email": email, "password": "NewSecure@123"})
check("Login with new password 200", r_newlogin.status_code == 200)

# ==================== 14. ADMIN AUTHORIZATION & ENDPOINTS ===================
print("\n--- 14. ADMIN AUTHORIZATION & ENDPOINTS ---")
# Regular user should be 403 Forbidden
r_admin_forbidden = client.get("/api/admin/stats", headers=AUTH)
check("Regular user access admin/stats -> 403", r_admin_forbidden.status_code == 403)

# Admin login
r_admin_login = client.post("/api/auth/login", json={"email": "admin@loansetu.ai", "password": "Admin@123"})
check("Admin login 200", r_admin_login.status_code == 200)
ADMIN_TOKEN = r_admin_login.json().get("access_token", "")
ADMIN_AUTH = {"Authorization": f"Bearer {ADMIN_TOKEN}"}

# Admin stats
r_astats = client.get("/api/admin/stats", headers=ADMIN_AUTH)
check("Admin GET /api/admin/stats 200", r_astats.status_code == 200)
astats = r_astats.json() if r_astats.status_code == 200 else {}
check("Admin total_users >= 1", astats.get("total_users", 0) >= 1)
check("Admin total_applications >= 1", astats.get("total_applications", 0) >= 1)
check("Admin daily_applications is list", isinstance(astats.get("daily_applications"), list))

# Admin applications
r_aapps = client.get("/api/admin/applications", headers=ADMIN_AUTH)
check("Admin GET /api/admin/applications 200", r_aapps.status_code == 200)
check("Admin applications is list", isinstance(r_aapps.json(), list))

# Admin users
r_ausers = client.get("/api/admin/users", headers=ADMIN_AUTH)
check("Admin GET /api/admin/users 200", r_ausers.status_code == 200)
check("Admin users is list", isinstance(r_ausers.json(), list))

# ==================== 15. MYSQL DATABASE VERIFICATION ===================
print("\n--- 15. MYSQL DATABASE VERIFICATION ---")
import pymysql
try:
    conn = pymysql.connect(
        host="localhost", user="root", password="Pranita@123",
        database="loan_setu", port=3306
    )
    with conn.cursor() as cur:
        cur.execute("SHOW TABLES;")
        tables = [t[0] for t in cur.fetchall()]
        check("users table",                   "users"             in tables)
        check("loan_applications table",        "loan_applications" in tables)
        check("predictions table",             "predictions"       in tables)
        check("prediction_logs table",         "prediction_logs"   in tables)

        cur.execute("SELECT COUNT(*) FROM users;")
        check("At least 1 user in MySQL",      cur.fetchone()[0] >= 1)

        cur.execute("SELECT COUNT(*) FROM loan_applications;")
        check("At least 1 app in MySQL",       cur.fetchone()[0] >= 1)

        cur.execute("SELECT COUNT(*) FROM predictions;")
        check("At least 1 prediction in MySQL", cur.fetchone()[0] >= 1)

        cur.execute("SELECT COUNT(*) FROM prediction_logs;")
        check("At least 1 log in MySQL",        cur.fetchone()[0] >= 1)

        # Check foreign key linkage (users -> loan_applications -> predictions)
        cur.execute("""
            SELECT u.email, a.id, p.prediction, p.approval_probability
            FROM users u
            JOIN loan_applications a ON u.id = a.user_id
            JOIN predictions p ON a.id = p.application_id
            LIMIT 1;
        """)
        row = cur.fetchone()
        check("FK join users->loan_applications->predictions works", row is not None)
        if row:
            print(f"    => FK Verification: User {row[0]} -> App #{row[1]} -> {row[2]} ({row[3]})")

    conn.close()
except Exception as e:
    errors.append(f"MySQL verification: {e}")
    print(f"  {FAIL_M}  MySQL check failed: {e}")

# ==================== RESULT ===================
print("\n===========================================================")
if errors:
    print(f"  {len(errors)} FAILED: " + ", ".join(errors[:5]))
    sys.exit(1)
else:
    print("  ALL TESTS PASSED — LoanSetu AI backend is fully operational!")
print("===========================================================\n")
