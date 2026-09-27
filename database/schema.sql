-- ==========================================================
-- LoanSetu AI - Database Schema for MySQL
-- Database Name: loan_setu
-- ==========================================================

CREATE DATABASE IF NOT EXISTS loan_setu CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE loan_setu;

-- Drop existing tables in reverse dependency order if migrating
-- DROP TABLE IF EXISTS prediction_logs;
-- DROP TABLE IF EXISTS predictions;
-- DROP TABLE IF EXISTS loan_applications;
-- DROP TABLE IF EXISTS users;

-- Table: users
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(120) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(25) NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: loan_applications
CREATE TABLE IF NOT EXISTS loan_applications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    applicant_income DECIMAL(14, 2) NOT NULL,
    coapplicant_income DECIMAL(14, 2) NOT NULL,
    age INT NOT NULL,
    dependents INT NOT NULL,
    credit_score INT NOT NULL,
    existing_loans INT NOT NULL,
    dti_ratio DECIMAL(6, 4) NOT NULL,
    savings DECIMAL(14, 2) NOT NULL,
    collateral_value DECIMAL(14, 2) NOT NULL,
    loan_amount DECIMAL(14, 2) NOT NULL,
    loan_term INT NOT NULL,
    education_level VARCHAR(50) NOT NULL,
    gender VARCHAR(20) NOT NULL,
    marital_status VARCHAR(20) NOT NULL,
    employment_status VARCHAR(50) NOT NULL,
    loan_purpose VARCHAR(50) NOT NULL,
    property_area VARCHAR(50) NOT NULL,
    employer_category VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_app_user_id (user_id),
    INDEX idx_app_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: predictions
CREATE TABLE IF NOT EXISTS predictions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    application_id INT NOT NULL,
    prediction VARCHAR(20) NOT NULL, -- 'APPROVED' or 'REJECTED'
    approval_probability DECIMAL(6, 4) NOT NULL,
    rejection_probability DECIMAL(6, 4) NOT NULL,
    model_name VARCHAR(100) DEFAULT 'XGBoost Classifier',
    model_version VARCHAR(50) DEFAULT '1.0.0',
    predicted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (application_id) REFERENCES loan_applications(id) ON DELETE CASCADE,
    INDEX idx_pred_application_id (application_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: prediction_logs (Optional audit logging)
CREATE TABLE IF NOT EXISTS prediction_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NULL,
    application_id INT NULL,
    request_time TIMESTAMP NOT NULL,
    response_time TIMESTAMP NOT NULL,
    status VARCHAR(50) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (application_id) REFERENCES loan_applications(id) ON DELETE CASCADE,
    INDEX idx_log_user (user_id),
    INDEX idx_log_app (application_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
