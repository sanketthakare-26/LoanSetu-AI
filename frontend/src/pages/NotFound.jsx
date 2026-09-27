import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Home } from 'lucide-react';

export const NotFound = () => {
  return (
    <div className="page-wrapper" style={{ textAlign: 'center', padding: '5rem 1rem' }}>
      <div style={{ fontSize: '4rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '0.5rem' }}>
        404
      </div>
      <h1 style={{ fontSize: '1.8rem', color: 'var(--text-main)', marginBottom: '0.8rem' }}>
        Page Not Found
      </h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', maxWidth: '450px', margin: '0 auto 2rem' }}>
        The page you are looking for does not exist or has been moved.
      </p>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
        <Link to="/" className="btn btn-primary">
          <Home size={16} />
          <span>Go to Home</span>
        </Link>
        <Link to="/dashboard" className="btn btn-outline">
          <span>Go to Dashboard</span>
        </Link>
      </div>
    </div>
  );
};
