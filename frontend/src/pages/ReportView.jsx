import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { applicationService } from '../services/api';
import {
  Printer,
  ArrowLeft,
  Landmark,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  Cpu,
  AlertCircle
} from 'lucide-react';

export const ReportView = () => {
  const { id } = useParams();
  const [app, setApp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchApp = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await applicationService.getById(id);
        setApp(data);
      } catch (err) {
        setError('Failed to load application report.');
      } finally {
        setLoading(false);
      }
    };
    fetchApp();
  }, [id]);

  if (loading) {
    return (
      <div className="page-wrapper" style={{ textAlign: 'center', padding: '4rem' }}>
        <div>Generating Loan Underwriting Report #{id}...</div>
      </div>
    );
  }

  if (error || !app) {
    return (
      <div className="page-wrapper">
        <div className="alert alert-danger">{error || 'Application not found.'}</div>
        <Link to="/history" className="btn btn-outline">
          <ArrowLeft size={16} /> Back
        </Link>
      </div>
    );
  }

  const isApproved = app.prediction?.prediction === 'APPROVED';
  const approvalPct = app.prediction ? (app.prediction.approval_probability * 100).toFixed(1) : '0.0';
  const rejectionPct = app.prediction ? (app.prediction.rejection_probability * 100).toFixed(1) : '0.0';

  return (
    <div className="page-wrapper" style={{ maxWidth: '850px', background: '#FFFFFF', padding: '2.5rem', borderRadius: '16px', boxShadow: 'var(--shadow-md)', margin: '2rem auto' }}>
      {/* Top action toolbar (Hidden when printing) */}
      <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border)' }}>
        <Link to={`/applications/${app.id}`} className="btn btn-outline">
          <ArrowLeft size={16} />
          <span>Back to Application</span>
        </Link>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => window.print()}
        >
          <Printer size={16} />
          <span>Print / Save as PDF</span>
        </button>
      </div>

      {/* Official Report Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', paddingBottom: '1.5rem', borderBottom: '2px solid var(--primary)', marginBottom: '1.8rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          <div style={{
            background: 'var(--primary)',
            color: '#FFFFFF',
            width: '44px',
            height: '44px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Landmark size={26} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.6rem', color: 'var(--primary)', margin: 0, lineHeight: 1.1 }}>
              LoanSetu AI
            </h1>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Intelligent Underwriting &amp; Credit Risk Assessment Engine
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--primary)' }}>
            OFFICIAL REPORT #{app.id}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Date: {new Date(app.created_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>
      </div>

      {/* Executive Decision Banner */}
      <div style={{
        background: isApproved ? '#F0FDF4' : '#FEF2F2',
        border: `1.5px solid ${isApproved ? '#BBF7D0' : '#FECACA'}`,
        borderRadius: '12px',
        padding: '1.4rem',
        marginBottom: '2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          {isApproved ? <CheckCircle2 size={32} color="#15803D" /> : <XCircle size={32} color="#DC2626" />}
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: isApproved ? '#166534' : '#991B1B', textTransform: 'uppercase' }}>
              MODEL PREDICTION VERDICT
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: isApproved ? '#15803D' : '#DC2626' }}>
              {isApproved ? 'Likely Approved' : 'Likely Rejected'}
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Approval Confidence</div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: isApproved ? '#15803D' : '#DC2626' }}>
            {approvalPct}%
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Rejection Probability: {rejectionPct}%
          </div>
        </div>
      </div>

      {/* Structured Details Tables */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
        {/* Applicant Info */}
        <div style={{ border: '1px solid var(--border)', borderRadius: '10px', padding: '1rem' }}>
          <h3 style={{ fontSize: '0.95rem', color: 'var(--primary)', borderBottom: '1px solid var(--border)', paddingBottom: '0.4rem', marginBottom: '0.8rem' }}>
            1. Applicant Information
          </h3>
          <table style={{ width: '100%', fontSize: '0.85rem' }}>
            <tbody>
              <tr>
                <td style={{ color: 'var(--text-muted)', padding: '0.3rem 0' }}>Age / Gender:</td>
                <td style={{ fontWeight: 600, textAlign: 'right' }}>{app.age} yrs / {app.gender}</td>
              </tr>
              <tr>
                <td style={{ color: 'var(--text-muted)', padding: '0.3rem 0' }}>Marital Status:</td>
                <td style={{ fontWeight: 600, textAlign: 'right' }}>{app.marital_status}</td>
              </tr>
              <tr>
                <td style={{ color: 'var(--text-muted)', padding: '0.3rem 0' }}>Dependents:</td>
                <td style={{ fontWeight: 600, textAlign: 'right' }}>{app.dependents}</td>
              </tr>
              <tr>
                <td style={{ color: 'var(--text-muted)', padding: '0.3rem 0' }}>Education:</td>
                <td style={{ fontWeight: 600, textAlign: 'right' }}>{app.education_level}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Employment Info */}
        <div style={{ border: '1px solid var(--border)', borderRadius: '10px', padding: '1rem' }}>
          <h3 style={{ fontSize: '0.95rem', color: 'var(--primary)', borderBottom: '1px solid var(--border)', paddingBottom: '0.4rem', marginBottom: '0.8rem' }}>
            2. Employment &amp; Income
          </h3>
          <table style={{ width: '100%', fontSize: '0.85rem' }}>
            <tbody>
              <tr>
                <td style={{ color: 'var(--text-muted)', padding: '0.3rem 0' }}>Status:</td>
                <td style={{ fontWeight: 600, textAlign: 'right' }}>{app.employment_status}</td>
              </tr>
              <tr>
                <td style={{ color: 'var(--text-muted)', padding: '0.3rem 0' }}>Employer Tier:</td>
                <td style={{ fontWeight: 600, textAlign: 'right' }}>{app.employer_category}</td>
              </tr>
              <tr>
                <td style={{ color: 'var(--text-muted)', padding: '0.3rem 0' }}>Applicant Income:</td>
                <td style={{ fontWeight: 600, textAlign: 'right' }}>₹{parseFloat(app.applicant_income).toLocaleString('en-IN')}/mo</td>
              </tr>
              <tr>
                <td style={{ color: 'var(--text-muted)', padding: '0.3rem 0' }}>Co-applicant Income:</td>
                <td style={{ fontWeight: 600, textAlign: 'right' }}>₹{parseFloat(app.coapplicant_income).toLocaleString('en-IN')}/mo</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Financial Info */}
        <div style={{ border: '1px solid var(--border)', borderRadius: '10px', padding: '1rem' }}>
          <h3 style={{ fontSize: '0.95rem', color: 'var(--primary)', borderBottom: '1px solid var(--border)', paddingBottom: '0.4rem', marginBottom: '0.8rem' }}>
            3. Financial Metrics
          </h3>
          <table style={{ width: '100%', fontSize: '0.85rem' }}>
            <tbody>
              <tr>
                <td style={{ color: 'var(--text-muted)', padding: '0.3rem 0' }}>Credit Score (CIBIL):</td>
                <td style={{ fontWeight: 700, textAlign: 'right', color: app.credit_score >= 750 ? '#15803D' : '#D97706' }}>
                  {app.credit_score} / 900
                </td>
              </tr>
              <tr>
                <td style={{ color: 'var(--text-muted)', padding: '0.3rem 0' }}>DTI Ratio:</td>
                <td style={{ fontWeight: 600, textAlign: 'right' }}>{app.dti_ratio}</td>
              </tr>
              <tr>
                <td style={{ color: 'var(--text-muted)', padding: '0.3rem 0' }}>Existing Loans:</td>
                <td style={{ fontWeight: 600, textAlign: 'right' }}>{app.existing_loans}</td>
              </tr>
              <tr>
                <td style={{ color: 'var(--text-muted)', padding: '0.3rem 0' }}>Savings Balance:</td>
                <td style={{ fontWeight: 600, textAlign: 'right' }}>₹{parseFloat(app.savings).toLocaleString('en-IN')}</td>
              </tr>
              <tr>
                <td style={{ color: 'var(--text-muted)', padding: '0.3rem 0' }}>Collateral Value:</td>
                <td style={{ fontWeight: 600, textAlign: 'right' }}>₹{parseFloat(app.collateral_value).toLocaleString('en-IN')}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Loan Info */}
        <div style={{ border: '1px solid var(--border)', borderRadius: '10px', padding: '1rem' }}>
          <h3 style={{ fontSize: '0.95rem', color: 'var(--primary)', borderBottom: '1px solid var(--border)', paddingBottom: '0.4rem', marginBottom: '0.8rem' }}>
            4. Loan Requirements
          </h3>
          <table style={{ width: '100%', fontSize: '0.85rem' }}>
            <tbody>
              <tr>
                <td style={{ color: 'var(--text-muted)', padding: '0.3rem 0' }}>Loan Amount:</td>
                <td style={{ fontWeight: 800, textAlign: 'right', color: 'var(--primary)' }}>
                  ₹{parseFloat(app.loan_amount).toLocaleString('en-IN')}
                </td>
              </tr>
              <tr>
                <td style={{ color: 'var(--text-muted)', padding: '0.3rem 0' }}>Loan Term:</td>
                <td style={{ fontWeight: 600, textAlign: 'right' }}>{app.loan_term} Months ({(app.loan_term / 12).toFixed(1)} Yrs)</td>
              </tr>
              <tr>
                <td style={{ color: 'var(--text-muted)', padding: '0.3rem 0' }}>Loan Purpose:</td>
                <td style={{ fontWeight: 600, textAlign: 'right' }}>{app.loan_purpose}</td>
              </tr>
              <tr>
                <td style={{ color: 'var(--text-muted)', padding: '0.3rem 0' }}>Property Area:</td>
                <td style={{ fontWeight: 600, textAlign: 'right' }}>{app.property_area}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Model Spec & Compliance Footer */}
      <div style={{ background: '#F8FAFC', border: '1px solid var(--border)', borderRadius: '10px', padding: '1.2rem', fontSize: '0.82rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
          <span><strong>Machine Learning Model:</strong> {app.prediction?.model_name || 'XGBoost Classifier'} (v{app.prediction?.model_version || '1.0.0'})</span>
          <span><strong>Inference Timestamp:</strong> {new Date(app.prediction?.predicted_at || app.created_at).toLocaleString('en-IN')}</span>
        </div>
        <div style={{ color: 'var(--text-muted)', lineHeight: 1.4 }}>
          Evaluated against 27 encoded demographic, leverage, credit, and asset features.
        </div>
      </div>

      {/* Statutory Disclaimer */}
      <div style={{
        borderTop: '1px solid var(--border)',
        paddingTop: '1rem',
        fontSize: '0.75rem',
        color: 'var(--text-muted)',
        textAlign: 'center',
        lineHeight: 1.5
      }}>
        <strong>AI Prediction Disclaimer:</strong> This result is generated by the LoanSetu AI machine-learning model and should not be treated as a guaranteed lending decision. All loan approvals remain subject to statutory identity verification, title deed inspection, and final sanction approval from the lending partner.
      </div>
    </div>
  );
};
