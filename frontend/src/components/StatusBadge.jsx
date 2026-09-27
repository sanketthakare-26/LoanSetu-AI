import React from 'react';
import { CheckCircle2, XCircle, AlertTriangle, ShieldCheck, ShieldAlert } from 'lucide-react';

export const PredictionBadge = ({ status }) => {
  const isApproved = status === 'APPROVED';
  return (
    <span className={`badge ${isApproved ? 'badge-approved' : 'badge-rejected'}`}>
      {isApproved ? (
        <>
          <CheckCircle2 size={14} /> Approved
        </>
      ) : (
        <>
          <XCircle size={14} /> Rejected
        </>
      )}
    </span>
  );
};

export const RiskBadge = ({ level }) => {
  const normalized = (level || 'Low').toLowerCase();
  if (normalized === 'low') {
    return (
      <span className="badge badge-risk-low">
        <ShieldCheck size={14} /> Low Risk
      </span>
    );
  }
  if (normalized === 'moderate') {
    return (
      <span className="badge badge-risk-moderate">
        <AlertTriangle size={14} /> Moderate Risk
      </span>
    );
  }
  return (
    <span className="badge badge-risk-high">
      <ShieldAlert size={14} /> High Risk
    </span>
  );
};
