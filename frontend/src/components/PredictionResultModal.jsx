import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileText,
  RotateCcw,
  Eye,
  Percent,
  CreditCard,
  Building,
  ShieldCheck
} from 'lucide-react';

export const PredictionResultModal = ({ result, onClose, onReset, inputData }) => {
  const navigate = useNavigate();

  if (!result) return null;

  const isApproved = result.prediction === 'APPROVED';
  const approvalPct = (result.approval_probability * 100).toFixed(1);
  const rejectionPct = (result.rejection_probability * 100).toFixed(1);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '580px', padding: '2rem' }}>
        {/* Header verdict badge */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: isApproved ? 'var(--success-bg)' : 'var(--danger-bg)',
            color: isApproved ? 'var(--success)' : 'var(--danger)',
            border: `2px solid ${isApproved ? 'var(--success-border)' : 'var(--danger-border)'}`,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1rem',
            boxShadow: 'var(--shadow-md)'
          }}>
            {isApproved ? <CheckCircle2 size={36} /> : <XCircle size={36} />}
          </div>

          <div style={{
            display: 'inline-block',
            padding: '0.35rem 1rem',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.82rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            background: isApproved ? 'var(--success-bg)' : 'var(--danger-bg)',
            color: isApproved ? 'var(--success)' : 'var(--danger)',
            border: `1px solid ${isApproved ? 'var(--success-border)' : 'var(--danger-border)'}`,
            marginBottom: '0.6rem'
          }}>
            Underwriting Verdict
          </div>

          <h2 style={{
            fontSize: '1.9rem',
            fontWeight: 800,
            color: isApproved ? 'var(--success)' : 'var(--danger)',
            marginBottom: '0.3rem'
          }}>
            {isApproved ? 'Likely Approved' : 'Likely Rejected'}
          </h2>

          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
            Application #{result.application_id} &middot; Model: {result.model || 'XGBoost Classifier'}
          </p>
        </div>

        {/* Probability Progress Bars */}
        <div style={{
          background: 'var(--bg-main)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.25rem',
          marginBottom: '1.5rem'
        }}>
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
              <span style={{ color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <CheckCircle2 size={14} /> Approval Probability
              </span>
              <span style={{ fontWeight: 800, color: 'var(--success)' }}>{approvalPct}%</span>
            </div>
            <div style={{ width: '100%', height: '10px', background: '#E2E8F0', borderRadius: '5px', overflow: 'hidden' }}>
              <div style={{
                width: `${approvalPct}%`,
                height: '100%',
                background: '#15803D',
                borderRadius: '5px',
                transition: 'width 0.6s ease'
              }}></div>
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
              <span style={{ color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <XCircle size={14} /> Rejection Probability
              </span>
              <span style={{ fontWeight: 800, color: 'var(--danger)' }}>{rejectionPct}%</span>
            </div>
            <div style={{ width: '100%', height: '10px', background: '#E2E8F0', borderRadius: '5px', overflow: 'hidden' }}>
              <div style={{
                width: `${rejectionPct}%`,
                height: '100%',
                background: '#DC2626',
                borderRadius: '5px',
                transition: 'width 0.6s ease'
              }}></div>
            </div>
          </div>
        </div>

        {/* Application Key Highlights */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '0.85rem',
          marginBottom: '1.5rem'
        }}>
          <div style={{ background: '#FFFFFF', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '0.85rem' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Loan Amount</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--primary)' }}>
              ₹{parseFloat(inputData?.loan_amount || 0).toLocaleString('en-IN')}
            </div>
          </div>

          <div style={{ background: '#FFFFFF', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '0.85rem' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Credit Score</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: inputData?.credit_score >= 750 ? '#15803D' : inputData?.credit_score >= 600 ? '#D97706' : '#DC2626' }}>
              {inputData?.credit_score || 'N/A'}
            </div>
          </div>

          <div style={{ background: '#FFFFFF', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '0.85rem' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>DTI Ratio</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)' }}>
              {inputData?.dti_ratio || 'N/A'}
            </div>
          </div>

          <div style={{ background: '#FFFFFF', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '0.85rem' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Loan Purpose</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)' }}>
              {inputData?.loan_purpose || 'N/A'}
            </div>
          </div>
        </div>

        {/* AI Disclaimer */}
        <div style={{
          background: '#FFFBEB',
          border: '1px solid #FDE68A',
          borderRadius: 'var(--radius-md)',
          padding: '0.85rem 1rem',
          fontSize: '0.8rem',
          color: '#92400E',
          marginBottom: '1.5rem',
          lineHeight: 1.45
        }}>
          <strong>AI Prediction Disclaimer:</strong> This result is generated by the LoanSetu AI machine-learning model and should not be treated as a guaranteed lending decision.
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => {
              onClose();
              navigate(`/applications/${result.application_id}`);
            }}
          >
            <Eye size={16} />
            <span>View Application</span>
          </button>

          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              onClose();
              navigate(`/report/${result.application_id}`);
            }}
          >
            <FileText size={16} />
            <span>Download Report</span>
          </button>
        </div>

        <button
          type="button"
          className="btn btn-outline"
          style={{ width: '100%', marginTop: '0.75rem', padding: '0.65rem' }}
          onClick={() => {
            onClose();
            if (onReset) onReset();
          }}
        >
          <RotateCcw size={16} />
          <span>New Prediction</span>
        </button>
      </div>
    </div>
  );
};
