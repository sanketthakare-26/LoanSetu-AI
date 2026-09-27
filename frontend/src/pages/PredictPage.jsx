import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { predictionService } from '../services/api';
import { PredictionResultModal } from '../components/PredictionResultModal';
import {
  User,
  Briefcase,
  Wallet,
  Landmark,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sparkles,
  RefreshCw,
  FileCheck2
} from 'lucide-react';

const INITIAL_FORM = {
  // Section A: Personal
  age: 30,
  gender: 'Male',
  marital_status: 'Married',
  dependents: 2,
  education_level: 'Graduate',

  // Section B: Employment
  employment_status: 'Salaried',
  employer_category: 'MNC',
  applicant_income: 50000,
  coapplicant_income: 20000,

  // Section C: Financial
  credit_score: 750,
  existing_loans: 1,
  dti_ratio: 0.30,
  savings: 300000,
  collateral_value: 500000,

  // Section D: Loan
  loan_amount: 200000,
  loan_term: 360,
  loan_purpose: 'Home',
  property_area: 'Urban'
};

export const PredictPage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [predictionResult, setPredictionResult] = useState(null);

  const updateField = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    if (error) setError('');
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleQuickLoad = (profileType) => {
    if (profileType === 'standard') {
      // Exact Section 19 test profile
      setFormData({
        applicant_income: 50000,
        coapplicant_income: 20000,
        age: 30,
        dependents: 2,
        credit_score: 750,
        existing_loans: 1,
        dti_ratio: 0.30,
        savings: 300000,
        collateral_value: 500000,
        loan_amount: 200000,
        loan_term: 360,
        education_level: 'Graduate',
        gender: 'Male',
        marital_status: 'Married',
        employment_status: 'Salaried',
        loan_purpose: 'Home',
        property_area: 'Urban',
        employer_category: 'MNC'
      });
    } else if (profileType === 'prime') {
      setFormData({
        applicant_income: 95000,
        coapplicant_income: 45000,
        age: 35,
        dependents: 1,
        credit_score: 820,
        existing_loans: 0,
        dti_ratio: 0.20,
        savings: 800000,
        collateral_value: 1200000,
        loan_amount: 500000,
        loan_term: 240,
        education_level: 'Graduate',
        gender: 'Male',
        marital_status: 'Married',
        employment_status: 'Salaried',
        loan_purpose: 'Home',
        property_area: 'Urban',
        employer_category: 'MNC'
      });
    } else if (profileType === 'risky') {
      setFormData({
        applicant_income: 18000,
        coapplicant_income: 0,
        age: 22,
        dependents: 3,
        credit_score: 480,
        existing_loans: 4,
        dti_ratio: 0.65,
        savings: 10000,
        collateral_value: 0,
        loan_amount: 300000,
        loan_term: 120,
        education_level: 'Not Graduate',
        gender: 'Female',
        marital_status: 'Single',
        employment_status: 'Unemployed',
        loan_purpose: 'Personal',
        property_area: 'Rural',
        employer_category: 'Unemployed'
      });
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/predict' } } });
      return;
    }

    // Input Validation
    if (formData.age < 18 || formData.age > 75) {
      setError('Age must be between 18 and 75 years.');
      return;
    }
    if (formData.credit_score < 300 || formData.credit_score > 900) {
      setError('Credit score must be between 300 and 900.');
      return;
    }
    if (formData.dti_ratio < 0 || formData.dti_ratio > 1) {
      setError('Debt-to-Income (DTI) ratio must be between 0 and 1.0.');
      return;
    }
    if (formData.loan_amount <= 0) {
      setError('Loan amount must be greater than zero.');
      return;
    }
    if (formData.applicant_income < 0 || formData.savings < 0 || formData.collateral_value < 0) {
      setError('Financial values (income, savings, collateral) cannot be negative.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const result = await predictionService.predict(formData);
      setPredictionResult(result);
    } catch (err) {
      const msg = err.response?.data?.detail || 'Prediction failed. Please ensure the backend server and ML model are operational.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { num: 1, label: 'Personal', icon: <User size={16} /> },
    { num: 2, label: 'Employment', icon: <Briefcase size={16} /> },
    { num: 3, label: 'Financial', icon: <Wallet size={16} /> },
    { num: 4, label: 'Loan Details', icon: <Landmark size={16} /> }
  ];

  return (
    <div className="page-wrapper">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <Sparkles size={24} color="var(--primary)" />
            Loan Eligibility Prediction
          </h1>
          <p className="page-subtitle">
            Fill in the applicant details below to generate an AI risk score using the XGBoost model
          </p>
        </div>

        {/* Quick Profile Loaders */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            className="btn btn-outline"
            style={{ fontSize: '0.78rem', padding: '0.4rem 0.8rem' }}
            onClick={() => handleQuickLoad('standard')}
            title="Load Section 19 Standard Test Application"
          >
            Load Section 19 Test Data
          </button>
          <button
            type="button"
            className="btn btn-outline"
            style={{ fontSize: '0.78rem', padding: '0.4rem 0.8rem' }}
            onClick={() => handleQuickLoad('prime')}
            title="Load Low-Risk Prime Application"
          >
            Load Prime Profile
          </button>
          <button
            type="button"
            className="btn btn-outline"
            style={{ fontSize: '0.78rem', padding: '0.4rem 0.8rem' }}
            onClick={() => handleQuickLoad('risky')}
            title="Load High-Risk Profile"
          >
            Load High-Risk Profile
          </button>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger">
          <AlertCircle size={18} style={{ flexShrink: 0 }} />
          <div>{error}</div>
        </div>
      )}

      {/* Step Wizard Indicator */}
      <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
        <div className="step-wizard">
          <div className="step-wizard-line"></div>
          <div
            className="step-wizard-progress"
            style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
          ></div>

          {steps.map((s) => (
            <div
              key={s.num}
              className={`step-item ${currentStep === s.num ? 'active' : ''} ${currentStep > s.num ? 'completed' : ''}`}
              onClick={() => setCurrentStep(s.num)}
              style={{ cursor: 'pointer' }}
            >
              <div className="step-circle">
                {currentStep > s.num ? <CheckCircle2 size={18} /> : s.num}
              </div>
              <span className="step-label">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit}>
          {/* SECTION 1: Personal Information */}
          {currentStep === 1 && (
            <div>
              <h2 className="card-title" style={{ marginBottom: '1.2rem' }}>
                Section A: Personal Information
              </h2>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.2rem' }}>
                <div className="form-group">
                  <label className="form-label" htmlFor="age">
                    Age (Years)
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>18 – 75</span>
                  </label>
                  <input
                    id="age"
                    type="number"
                    className="form-input"
                    min="18"
                    max="75"
                    value={formData.age}
                    onChange={(e) => updateField('age', parseInt(e.target.value) || 18)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="gender">
                    Gender
                  </label>
                  <select
                    id="gender"
                    className="form-select"
                    value={formData.gender}
                    onChange={(e) => updateField('gender', e.target.value)}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="marital_status">
                    Marital Status
                  </label>
                  <select
                    id="marital_status"
                    className="form-select"
                    value={formData.marital_status}
                    onChange={(e) => updateField('marital_status', e.target.value)}
                  >
                    <option value="Married">Married</option>
                    <option value="Single">Single</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="dependents">
                    Number of Dependents
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>0 – 10</span>
                  </label>
                  <input
                    id="dependents"
                    type="number"
                    className="form-input"
                    min="0"
                    max="10"
                    value={formData.dependents}
                    onChange={(e) => updateField('dependents', parseInt(e.target.value) || 0)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="education_level">
                    Education Level
                  </label>
                  <select
                    id="education_level"
                    className="form-select"
                    value={formData.education_level}
                    onChange={(e) => updateField('education_level', e.target.value)}
                  >
                    <option value="Graduate">Graduate</option>
                    <option value="Not Graduate">Not Graduate</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 2: Employment Information */}
          {currentStep === 2 && (
            <div>
              <h2 className="card-title" style={{ marginBottom: '1.2rem' }}>
                Section B: Employment &amp; Income
              </h2>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.2rem' }}>
                <div className="form-group">
                  <label className="form-label" htmlFor="employment_status">
                    Employment Status
                  </label>
                  <select
                    id="employment_status"
                    className="form-select"
                    value={formData.employment_status}
                    onChange={(e) => updateField('employment_status', e.target.value)}
                  >
                    <option value="Salaried">Salaried</option>
                    <option value="Self-employed">Self-employed</option>
                    <option value="Unemployed">Unemployed</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="employer_category">
                    Employer Category
                    <span className="tooltip-icon" title="Organization tier where the applicant is employed">
                      <HelpCircle size={14} />
                    </span>
                  </label>
                  <select
                    id="employer_category"
                    className="form-select"
                    value={formData.employer_category}
                    onChange={(e) => updateField('employer_category', e.target.value)}
                  >
                    <option value="MNC">MNC (Multinational)</option>
                    <option value="Government">Government / PSU</option>
                    <option value="Private">Private Company</option>
                    <option value="Unemployed">Unemployed</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="applicant_income">
                    Applicant Monthly Income (₹)
                  </label>
                  <input
                    id="applicant_income"
                    type="number"
                    className="form-input"
                    min="0"
                    step="1000"
                    value={formData.applicant_income}
                    onChange={(e) => updateField('applicant_income', parseFloat(e.target.value) || 0)}
                    required
                  />
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    ₹{formData.applicant_income?.toLocaleString('en-IN')} / month
                  </span>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="coapplicant_income">
                    Co-applicant Monthly Income (₹)
                  </label>
                  <input
                    id="coapplicant_income"
                    type="number"
                    className="form-input"
                    min="0"
                    step="1000"
                    value={formData.coapplicant_income}
                    onChange={(e) => updateField('coapplicant_income', parseFloat(e.target.value) || 0)}
                  />
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    ₹{formData.coapplicant_income?.toLocaleString('en-IN')} / month
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 3: Financial Information */}
          {currentStep === 3 && (
            <div>
              <h2 className="card-title" style={{ marginBottom: '1.2rem' }}>
                Section C: Financial &amp; Credit Metrics
              </h2>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.2rem' }}>
                {/* Credit Score Slider + Input */}
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label className="form-label" htmlFor="credit_score" style={{ marginBottom: 0 }}>
                      Credit Score (CIBIL)
                    </label>
                    <span style={{
                      fontWeight: 800,
                      fontSize: '1rem',
                      color: formData.credit_score >= 750 ? '#15803D' : formData.credit_score >= 600 ? '#D97706' : '#DC2626'
                    }}>
                      {formData.credit_score} / 900 ({formData.credit_score >= 750 ? 'Excellent' : formData.credit_score >= 650 ? 'Good' : formData.credit_score >= 550 ? 'Fair' : 'Poor'})
                    </span>
                  </div>
                  <input
                    id="credit_score_range"
                    type="range"
                    min="300"
                    max="900"
                    step="5"
                    className="form-range"
                    value={formData.credit_score}
                    onChange={(e) => updateField('credit_score', parseInt(e.target.value) || 300)}
                    style={{ margin: '0.6rem 0' }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    <span>300 (Poor)</span>
                    <span>600 (Fair)</span>
                    <span>750 (Good)</span>
                    <span>900 (Excellent)</span>
                  </div>
                </div>

                {/* DTI Ratio Slider + Input */}
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label className="form-label" htmlFor="dti_ratio" style={{ marginBottom: 0 }}>
                      Debt-to-Income (DTI) Ratio
                      <span className="tooltip-icon" title="Total monthly debt payments divided by gross monthly income (0.0 to 1.0)">
                        <HelpCircle size={14} />
                      </span>
                    </label>
                    <span style={{ fontWeight: 800, fontSize: '1rem', color: formData.dti_ratio <= 0.35 ? '#15803D' : formData.dti_ratio <= 0.50 ? '#D97706' : '#DC2626' }}>
                      {formData.dti_ratio} ({(formData.dti_ratio * 100).toFixed(0)}%)
                    </span>
                  </div>
                  <input
                    id="dti_range"
                    type="range"
                    min="0.0"
                    max="1.0"
                    step="0.01"
                    className="form-range"
                    value={formData.dti_ratio}
                    onChange={(e) => updateField('dti_ratio', parseFloat(e.target.value) || 0)}
                    style={{ margin: '0.6rem 0' }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    <span>0.0 (Zero Debt)</span>
                    <span>0.30 (Healthy)</span>
                    <span>0.50 (Moderate)</span>
                    <span>1.0 (High Leverage)</span>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="existing_loans">
                    Existing Active Loans
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>0 – 20</span>
                  </label>
                  <input
                    id="existing_loans"
                    type="number"
                    className="form-input"
                    min="0"
                    max="20"
                    value={formData.existing_loans}
                    onChange={(e) => updateField('existing_loans', parseInt(e.target.value) || 0)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="savings">
                    Total Savings / Bank Balance (₹)
                  </label>
                  <input
                    id="savings"
                    type="number"
                    className="form-input"
                    min="0"
                    step="5000"
                    value={formData.savings}
                    onChange={(e) => updateField('savings', parseFloat(e.target.value) || 0)}
                    required
                  />
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    ₹{formData.savings?.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="collateral_value">
                    Collateral Asset Value (₹)
                    <span className="tooltip-icon" title="Estimated market value of assets pledged (property, gold, securities)">
                      <HelpCircle size={14} />
                    </span>
                  </label>
                  <input
                    id="collateral_value"
                    type="number"
                    className="form-input"
                    min="0"
                    step="10000"
                    value={formData.collateral_value}
                    onChange={(e) => updateField('collateral_value', parseFloat(e.target.value) || 0)}
                    required
                  />
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    ₹{formData.collateral_value?.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 4: Loan Details & Review */}
          {currentStep === 4 && (
            <div>
              <h2 className="card-title" style={{ marginBottom: '1.2rem' }}>
                Section D: Loan Requirements &amp; Review
              </h2>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.2rem', marginBottom: '2rem' }}>
                <div className="form-group">
                  <label className="form-label" htmlFor="loan_amount">
                    Requested Loan Amount (₹) *
                  </label>
                  <input
                    id="loan_amount"
                    type="number"
                    className="form-input"
                    min="10000"
                    step="10000"
                    value={formData.loan_amount}
                    onChange={(e) => updateField('loan_amount', parseFloat(e.target.value) || 10000)}
                    required
                  />
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                    ₹{formData.loan_amount?.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="loan_term">
                    Loan Term (Months)
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>12 – 480</span>
                  </label>
                  <input
                    id="loan_term"
                    type="number"
                    className="form-input"
                    min="12"
                    max="480"
                    step="12"
                    value={formData.loan_term}
                    onChange={(e) => updateField('loan_term', parseInt(e.target.value) || 12)}
                    required
                  />
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    {(formData.loan_term / 12).toFixed(1)} years
                  </span>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="loan_purpose">
                    Loan Purpose
                  </label>
                  <select
                    id="loan_purpose"
                    className="form-select"
                    value={formData.loan_purpose}
                    onChange={(e) => updateField('loan_purpose', e.target.value)}
                  >
                    <option value="Home">Home Loan</option>
                    <option value="Car">Car / Auto Loan</option>
                    <option value="Education">Education Loan</option>
                    <option value="Personal">Personal Loan</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="property_area">
                    Property / Location Area
                  </label>
                  <select
                    id="property_area"
                    className="form-select"
                    value={formData.property_area}
                    onChange={(e) => updateField('property_area', e.target.value)}
                  >
                    <option value="Urban">Urban</option>
                    <option value="Semiurban">Semiurban</option>
                    <option value="Rural">Rural</option>
                  </select>
                </div>
              </div>

              {/* Review Summary Card */}
              <div style={{
                background: '#F8FAFC',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.4rem',
                marginBottom: '1.5rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.8rem' }}>
                  <FileCheck2 size={20} color="var(--primary)" />
                  <h3 style={{ fontSize: '1rem', color: 'var(--primary)', margin: 0 }}>
                    Application Summary Review
                  </h3>
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                  gap: '0.8rem',
                  fontSize: '0.85rem'
                }}>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Applicant:</span>{' '}
                    <strong>{formData.age} yrs, {formData.gender}, {formData.marital_status}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Employment:</span>{' '}
                    <strong>{formData.employment_status} ({formData.employer_category})</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Total Income:</span>{' '}
                    <strong>₹{(formData.applicant_income + formData.coapplicant_income).toLocaleString('en-IN')}/mo</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Credit Score:</span>{' '}
                    <strong style={{ color: formData.credit_score >= 750 ? '#15803D' : '#D97706' }}>{formData.credit_score}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>DTI Ratio:</span>{' '}
                    <strong>{formData.dti_ratio}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Loan Request:</span>{' '}
                    <strong style={{ color: 'var(--primary)' }}>₹{formData.loan_amount.toLocaleString('en-IN')} ({formData.loan_purpose})</strong>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '2rem',
            paddingTop: '1.2rem',
            borderTop: '1px solid var(--border)'
          }}>
            {currentStep > 1 ? (
              <button
                type="button"
                className="btn btn-outline"
                onClick={handleBack}
                disabled={loading}
              >
                <ArrowLeft size={16} />
                <span>Previous Step</span>
              </button>
            ) : (
              <div></div>
            )}

            {currentStep < 4 ? (
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleNext}
              >
                <span>Continue to Step {currentStep + 1}</span>
                <ArrowRight size={16} />
              </button>
            ) : (
              <button
                type="submit"
                className="btn btn-primary"
                style={{ padding: '0.8rem 2rem', fontSize: '1rem' }}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <RefreshCw size={18} className="spin" />
                    <span>Analyzing application...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={18} />
                    <span>Predict Loan Approval</span>
                  </>
                )}
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Prediction Result Modal */}
      {predictionResult && (
        <PredictionResultModal
          result={predictionResult}
          inputData={formData}
          onClose={() => setPredictionResult(null)}
          onReset={() => {
            setPredictionResult(null);
            setCurrentStep(1);
          }}
        />
      )}
    </div>
  );
};
