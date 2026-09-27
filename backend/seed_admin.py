"""
Seed default admin account into database if not present.
Admin credentials:
Email: admin@loansetu.ai
Password: Admin@123
Role: admin
"""

import os
import sys
from sqlalchemy.orm import Session
from database import SessionLocal, init_db
import models
from auth import hash_password

def seed_default_admin():
    init_db()
    db: Session = SessionLocal()
    try:
        admin = db.query(models.User).filter(models.User.email == "admin@loansetu.ai").first()
        if not admin:
            admin = models.User(
                full_name="LoanSetu Administrator",
                email="admin@loansetu.ai",
                password_hash=hash_password("Admin@123"),
                phone="9998887770",
                role="admin"
            )
            db.add(admin)
            db.commit()
            print("Default admin user created successfully: admin@loansetu.ai / Admin@123")
        else:
            admin.role = "admin"
            db.commit()
            print("Admin user already exists with email: admin@loansetu.ai")
    except Exception as e:
        print("Error seeding admin:", e)
    finally:
        db.close()

if __name__ == "__main__":
    seed_default_admin()
