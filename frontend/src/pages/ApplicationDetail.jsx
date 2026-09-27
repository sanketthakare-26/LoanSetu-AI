import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { applicationService } from '../services/api';
import {
  ArrowLeft,
  FileText,
  CheckCircle2,
  XCircle,
  User,
  Briefcase,
  Wallet,
  Landmark,
  ShieldCheck,
  Cpu,
  Calendar,
  AlertCircle,
  Printer
} from 'lucide-react';

export const ApplicationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [app, setApp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await applicationService.getById(id);
        setApp(data);
      } catch (err) {
        setError('Failed to load application details. Application may not exist or you do not have permission.');
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="page-wrapper" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div style={{ color: 'var(--primary)', fontWeight: 600 }}>Loading Application #{id}...</div>
      </div>
    );
  }

  if (error || !app) {
    return (
      <div className="page-wrapper">
        <div className="alert alert-danger" style={{ marginBottom: '1.5rem' }}>
          <AlertCircle size={18} />
          <div>{error || 'Application not found.'}</div>
        </div>
        <Link to="/history" className="btn btn-outline">
          <ArrowLeft size={16} />
          <span>Back to History</span>
        </Link>
      </div>
    );
  }

  const isApproved = app.prediction?.prediction === 'APPROVED';
  const approvalPct = app.prediction ? (app.prediction.approval_probability * 100).toFixed(1) : 'N/A';
  const rejectionPct = app.prediction ? (app.prediction.rejection_probability * 100).toFixed(1) : 'N/A';

  return (
    <div className="page-wrapper">
      {/* Header */}
      <div className="page-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
            <Link to="/history" className="btn btn-outline" style={{ padding: '0.35rem 0.65rem' }}>
              <ArrowLeft size={16} />
            </Link>
            <h1 className="page-title" style={{ margin: 0 }}>
              Application #{app.id}
            </h1>
            {app.prediction && (
              <span className={`badge ${isApproved ? 'badge-approved' : 'badge-rejected'}`}>
                {isApproved ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                {isApproved ? 'Likely Approved' : 'Likely Rejected'}
              </span>
            )}
          </div>
          <p className="page-subtitle" style={{ marginLeft: '2.5rem' }}>
            Submitted on {new Date(app.created_at).toLocaleString('en-IN', { dateStyle: 'long', timeStyle: 'short' })}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.6rem' }}>
          <Link to={`/report/${app.id}`} className="btn btn-primary">
            <FileText size={16} />
            <span>Download PDF Report</span>
          </Link>
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => window.print()}
          >
            <Printer size={16} />
            <span>Print</span>
          </button>
        </div>
      </div>

      {/* Prediction Verdict Card */}
      {app.prediction && (
        <div className="card" style={{
          background: isApproved ? '#F0FDF4' : '#FEF2F2',
          border: `1.5px solid ${isApproved ? '#BBF7D0' : '#FECACA'}`,
          padding: '1.8rem',
          marginBottom: '2rem'
        }}>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '1.5rem',
            marginBottom: '1.5rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                width: '52px',
                height: '52px',
                borderRadius: '50%',
                background: isApproved ? '#15803D' : '#DC2626',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {isApproved ? <CheckCircle2 size={30} /> : <XCircle size={30} />}
              </div>
              <div>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: isApproved ? '#166534' : '#991B1B', textTransform: 'uppercase' }}>
                  XGBOOST ML DECISION SCORE
                </div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: isApproved ? '#15803D' : '#DC2626' }}>
                  {isApproved ? 'Likely Approved' : 'Likely Rejected'}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1.5rem', textAlign: 'right' }}>
              <div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Approval Confidence</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#15803D' }}>{approvalPct}%</div>
              </div>
              <div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Rejection Confidence</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#DC2626' }}>{rejectionPct}%</div>
              </div>
            </div>
          </div>

          {/* Probability Bar */}
          <div style={{ width: '100%', height: '12px', background: '#E2E8F0', borderRadius: '6px', overflow: 'hidden', display: 'flex' }}>
            <div style={{ width: `${approvalPct}%`, height: '100%', background: '#15803D' }}></div>
            <div style={{ width: `${rejectionPct}%`, height: '100%', background: '#DC2626' }}></div>
          </div>

          <div style={{
            marginTop: '1.2rem',
            paddingTop: '1rem',
            borderTop: `1px solid ${isApproved ? '#DCFCE7' : '#FEE2E2'}`,
            fontSize: '0.82rem',
            color: 'var(--text-muted)',
            display: 'flex',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.5rem'
          }}>
            <span>Model: <strong>{app.prediction.model_name} (v{app.prediction.model_version})</strong></span>
            <span>Evaluated At: <strong>{new Date(app.prediction.predicted_at).toLocaleString('en-IN')}</strong></span>
          </div>
        </div>
      )}

      {/* 4 Details Grids */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        {/* Section A: Personal */}
        <div className="card">
          <h2 className="card-title" style={{ borderBottom: '1px solid var(--border)', paddingBottom: '0.8rem', marginBottom: '1rem' }}>
            <User size={18} color="var(--primary)" />
            Applicant Information
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Age:</span>
              <strong>{app.age} years</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Gender:</span>
              <strong>{app.gender}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Marital Status:</span>
              <strong>{app.marital_status}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Dependents:</span>
              <strong>{app.dependents}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Education Level:</span>
              <strong>{app.education_level}</strong>
            </div>
          </div>
        </div>

        {/* Section B: Employment */}
        <div className="card">
          <h2 className="card-title" style={{ borderBottom: '1px solid var(--border)', paddingBottom: '0.8rem', marginBottom: '1rem' }}>
            <Briefcase size={18} color="var(--primary)" />
            Employment &amp; Income
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Employment Status:</span>
              <strong>{app.employment_status}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Employer Category:</span>
              <strong>{app.employer_category}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Applicant Monthly Income:</span>
              <strong>₹{parseFloat(app.applicant_income).toLocaleString('en-IN')}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Co-applicant Income:</span>
              <strong>₹{parseFloat(app.coapplicant_income).toLocaleString('en-IN')}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border)', paddingTop: '0.5rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Combined Household Income:</span>
              <strong style={{ color: 'var(--primary)' }}>
                ₹{(parseFloat(app.applicant_income) + parseFloat(app.coapplicant_income)).toLocaleString('en-IN')}
              </strong>
            </div>
          </div>
        </div>

        {/* Section C: Financial */}
        <div className="card">
          <h2 className="card-title" style={{ borderBottom: '1px solid var(--border)', paddingBottom: '0.8rem', marginBottom: '1rem' }}>
            <Wallet size={18} color="var(--primary)" />
            Financial &amp; Risk Metrics
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Credit Score (CIBIL):</span>
              <strong style={{
                color: app.credit_score >= 750 ? '#15803D' : app.credit_score >= 600 ? '#D97706' : '#DC2626'
              }}>
                {app.credit_score} / 900
              </strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Debt-to-Income (DTI):</span>
              <strong>{app.dti_ratio} ({(app.dti_ratio * 100).toFixed(0)}%)</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Existing Active Loans:</span>
              <strong>{app.existing_loans}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Liquid Savings:</span>
              <strong>₹{parseFloat(app.savings).toLocaleString('en-IN')}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Collateral Valuation:</span>
              <strong>₹{parseFloat(app.collateral_value).toLocaleString('en-IN')}</strong>
            </div>
          </div>
        </div>

        {/* Section D: Loan */}
        <div className="card">
          <h2 className="card-title" style={{ borderBottom: '1px solid var(--border)', paddingBottom: '0.8rem', marginBottom: '1rem' }}>
            <Landmark size={18} color="var(--primary)" />
            Requested Loan Terms
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Loan Amount:</span>
              <strong style={{ fontSize: '1.05rem', color: 'var(--primary)' }}>
                ₹{parseFloat(app.loan_amount).toLocaleString('en-IN')}
              </strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Loan Term:</span>
              <strong>{app.loan_term} Months ({(app.loan_term / 12).toFixed(1)} Yrs)</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Purpose:</span>
              <strong>{app.loan_purpose} Loan</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Property Area:</span>
              <strong>{app.property_area}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border)', paddingTop: '0.5rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Est. Monthly Installment (approx):</span>
              <strong>₹{((parseFloat(app.loan_amount) / app.loan_term) * 1.1).toFixed(0).toLocaleString('en-IN')}/mo</strong>
            </div>
          </div>
        </div>
      </div>

      {/* AI Underwriting Analysis Summary */}
      <div className="card">
        <h2 className="card-title" style={{ marginBottom: '0.6rem' }}>
          <ShieldCheck size={18} color="var(--primary)" />
          AI Underwriting Risk Assessment
        </h2>
        <p style={{ color: 'var(--text-main)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1rem' }}>
          This evaluation is processed via the <strong>XGBoost Gradient Boosted Decision Tree Engine</strong> trained across 27 distinct credit underwriting variables.
          {app.credit_score >= 700 ? (
            <span> The applicant exhibits a strong credit history ({app.credit_score}), healthy leverage profile (DTI: {app.dti_ratio}), and sufficient collateral cover to support the ₹{parseFloat(app.loan_amount).toLocaleString('en-IN')} request.</span>
          ) : (
            <span> The application carries elevated risk metrics including a lower credit benchmark ({app.credit_score}) or debt leverage that reduces debt servicing reliability.</span>
          )}
        </p>

        <div style={{
          background: '#FFFBEB',
          border: '1px solid #FDE68A',
          borderRadius: 'var(--radius-md)',
          padding: '0.85rem 1rem',
          fontSize: '0.8rem',
          color: '#92400E'
        }}>
          <strong>Statutory Compliance Disclaimer:</strong> This prediction is machine-learning generated and is not a guaranteed lending decision. Subject to documentary KYC verification.
        </div>
      </div>
    </div>
  );
};
