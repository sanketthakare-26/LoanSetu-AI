import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Cpu,
  TrendingUp,
  Zap,
  BarChart3,
  CheckCircle2,
  Lock,
  ArrowRight,
  Database,
  Award,
  Clock,
  Layers
} from 'lucide-react';

export const Landing = () => {
  return (
    <div>
      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(180deg, #EFF6FF 0%, #F7F9FC 100%)',
        padding: '5rem 2rem 4rem',
        borderBottom: '1px solid var(--border)'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '3rem',
          alignItems: 'center'
        }}>
          <div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: '#DBEAFE',
              color: '#1E40AF',
              padding: '0.35rem 0.85rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.82rem',
              fontWeight: 700,
              marginBottom: '1.2rem',
              letterSpacing: '0.3px'
            }}>
              <Cpu size={15} /> POWERED BY XGBOOST CLASSIFIER
            </div>

            <h1 style={{
              fontSize: '2.75rem',
              fontWeight: 800,
              color: '#1E3A8A',
              lineHeight: 1.15,
              marginBottom: '1.2rem'
            }}>
              Smart Loan Approval Prediction
            </h1>

            <p style={{
              fontSize: '1.1rem',
              color: '#475569',
              lineHeight: 1.6,
              marginBottom: '2rem',
              maxWidth: '540px'
            }}>
              Evaluate loan applications using machine learning based on financial, credit, and applicant information. Instant risk scoring for modern financial decision-making.
            </p>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Link to="/predict" className="btn btn-primary" style={{ padding: '0.85rem 1.8rem', fontSize: '1rem' }}>
                <span>Check Loan Eligibility</span>
                <ArrowRight size={18} />
              </Link>
              <Link to="/how-it-works" className="btn btn-outline" style={{ padding: '0.85rem 1.6rem', fontSize: '1rem' }}>
                <span>How It Works</span>
              </Link>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '2rem',
              marginTop: '2.5rem',
              paddingTop: '1.5rem',
              borderTop: '1px solid #E2E8F0'
            }}>
              <div>
                <div style={{ fontWeight: 800, fontSize: '1.3rem', color: '#1E3A8A' }}>27+</div>
                <div style={{ fontSize: '0.78rem', color: '#64748B' }}>Engineered Features</div>
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '1.3rem', color: '#15803D' }}>&lt; 50ms</div>
                <div style={{ fontSize: '0.78rem', color: '#64748B' }}>Inference Latency</div>
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '1.3rem', color: '#3B82F6' }}>100%</div>
                <div style={{ fontSize: '0.78rem', color: '#64748B' }}>Automated Pipeline</div>
              </div>
            </div>
          </div>

          {/* Clean Banking / AI Illustration Card */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{
              background: '#FFFFFF',
              border: '1px solid #CBD5E1',
              borderRadius: '24px',
              padding: '2.2rem',
              boxShadow: '0 20px 40px rgba(30, 58, 138, 0.08)',
              width: '100%',
              maxWidth: '460px'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingBottom: '1.2rem',
                borderBottom: '1px solid #F1F5F9',
                marginBottom: '1.4rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '12px',
                    background: '#1E3A8A',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Layers size={20} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#172033' }}>AI Underwriting Engine</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748B' }}>Live Assessment Model</div>
                  </div>
                </div>
                <span className="badge badge-approved">Online</span>
              </div>

              {/* Sample Metrics Mock */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ background: '#F8FAFC', padding: '1rem', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '0.35rem' }}>
                    <span style={{ color: '#64748B' }}>Credit Health (CIBIL)</span>
                    <span style={{ fontWeight: 700, color: '#15803D' }}>750 / 900 (Excellent)</span>
                  </div>
                  <div style={{ width: '100%', height: '8px', background: '#E2E8F0', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: '83%', height: '100%', background: '#15803D' }}></div>
                  </div>
                </div>

                <div style={{ background: '#F8FAFC', padding: '1rem', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '0.35rem' }}>
                    <span style={{ color: '#64748B' }}>Debt-To-Income (DTI)</span>
                    <span style={{ fontWeight: 700, color: '#1E3A8A' }}>0.30 (Healthy)</span>
                  </div>
                  <div style={{ width: '100%', height: '8px', background: '#E2E8F0', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: '30%', height: '100%', background: '#3B82F6' }}></div>
                  </div>
                </div>

                <div style={{
                  background: '#F0FDF4',
                  border: '1px solid #BBF7D0',
                  padding: '1.2rem',
                  borderRadius: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem'
                }}>
                  <div style={{
                    background: '#15803D',
                    color: '#FFFFFF',
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <CheckCircle2 size={20} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.78rem', color: '#166534', fontWeight: 600 }}>ML PREDICTION VERDICT</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#15803D' }}>Likely Approved (71.4%)</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section style={{ padding: '5rem 2rem', background: '#FFFFFF' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ color: '#3B82F6', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem' }}>
            Seamless 4-Step Process
          </div>
          <h2 style={{ fontSize: '2.2rem', color: '#1E3A8A', marginBottom: '3rem' }}>
            How LoanSetu AI Evaluates Loans
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1.8rem',
            textAlign: 'left'
          }}>
            <div className="card" style={{ padding: '1.8rem', position: 'relative' }}>
              <div style={{
                background: '#EFF6FF',
                color: '#1E3A8A',
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '1.1rem',
                marginBottom: '1rem'
              }}>
                1
              </div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: '#1E3A8A' }}>Enter Details</h3>
              <p style={{ fontSize: '0.88rem', color: '#64748B', lineHeight: 1.5 }}>
                Provide applicant information, income, employment type, loan amount, and existing liabilities.
              </p>
            </div>

            <div className="card" style={{ padding: '1.8rem' }}>
              <div style={{
                background: '#EFF6FF',
                color: '#1E3A8A',
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '1.1rem',
                marginBottom: '1rem'
              }}>
                2
              </div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: '#1E3A8A' }}>Preprocessing</h3>
              <p style={{ fontSize: '0.88rem', color: '#64748B', lineHeight: 1.5 }}>
                Backend encodes categorical factors into 27 features and normalizes metrics via fitted StandardScaler.
              </p>
            </div>

            <div className="card" style={{ padding: '1.8rem' }}>
              <div style={{
                background: '#EFF6FF',
                color: '#1E3A8A',
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '1.1rem',
                marginBottom: '1rem'
              }}>
                3
              </div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: '#1E3A8A' }}>XGBoost Scoring</h3>
              <p style={{ fontSize: '0.88rem', color: '#64748B', lineHeight: 1.5 }}>
                Gradient-boosted decision trees analyze risk non-linearities and compute calibrated approval probability.
              </p>
            </div>

            <div className="card" style={{ padding: '1.8rem' }}>
              <div style={{
                background: '#EFF6FF',
                color: '#1E3A8A',
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '1.1rem',
                marginBottom: '1rem'
              }}>
                4
              </div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: '#1E3A8A' }}>Instant Report</h3>
              <p style={{ fontSize: '0.88rem', color: '#64748B', lineHeight: 1.5 }}>
                View approval verdict, probability breakdown, and generate printable audit reports instantly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ padding: '5rem 2rem', background: '#F7F9FC', borderTop: '1px solid #E2E8F0' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div style={{ color: '#3B82F6', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem' }}>
              Key Capabilities
            </div>
            <h2 style={{ fontSize: '2.2rem', color: '#1E3A8A' }}>
              Why Choose LoanSetu AI
            </h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem'
          }}>
            <div className="card">
              <div style={{ color: '#3B82F6', marginBottom: '0.8rem' }}><Zap size={28} /></div>
              <h3 style={{ fontSize: '1.2rem', color: '#1E3A8A', marginBottom: '0.5rem' }}>Instant ML Scoring</h3>
              <p style={{ color: '#64748B', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Replaces slow manual review steps with sub-second ML decisioning, giving instantaneous feedback to lenders and borrowers.
              </p>
            </div>

            <div className="card">
              <div style={{ color: '#15803D', marginBottom: '0.8rem' }}><BarChart3 size={28} /></div>
              <h3 style={{ fontSize: '1.2rem', color: '#1E3A8A', marginBottom: '0.5rem' }}>Transparent Probabilities</h3>
              <p style={{ color: '#64748B', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Shows exact approval vs. rejection confidence scores instead of a binary black box, facilitating responsible underwriting.
              </p>
            </div>

            <div className="card">
              <div style={{ color: '#1E3A8A', marginBottom: '0.8rem' }}><Database size={28} /></div>
              <h3 style={{ fontSize: '1.2rem', color: '#1E3A8A', marginBottom: '0.5rem' }}>Relational Audit Storage</h3>
              <p style={{ color: '#64748B', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Every evaluation is safely persisted into MySQL with structured foreign keys, full history tracking, and delete controls.
              </p>
            </div>

            <div className="card">
              <div style={{ color: '#D97706', marginBottom: '0.8rem' }}><Award size={28} /></div>
              <h3 style={{ fontSize: '1.2rem', color: '#1E3A8A', marginBottom: '0.5rem' }}>Bank-Grade Features</h3>
              <p style={{ color: '#64748B', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Takes into account DTI ratio, CIBIL credit score, collateral value, employer tier (MNC/Gov/Pvt), and co-applicant income.
              </p>
            </div>

            <div className="card">
              <div style={{ color: '#0284C7', marginBottom: '0.8rem' }}><Clock size={28} /></div>
              <h3 style={{ fontSize: '1.2rem', color: '#1E3A8A', marginBottom: '0.5rem' }}>Portfolio Analytics</h3>
              <p style={{ color: '#64748B', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Rich interactive charts powered by Recharts to inspect approval rates, loan amount distributions, and historical trends.
              </p>
            </div>

            <div className="card">
              <div style={{ color: '#7E22CE', marginBottom: '0.8rem' }}><Lock size={28} /></div>
              <h3 style={{ fontSize: '1.2rem', color: '#1E3A8A', marginBottom: '0.5rem' }}>Role-Based Access</h3>
              <p style={{ color: '#64748B', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Dedicated Admin dashboard with system-wide analytics, user metrics, and application auditing protected by JWT security.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Security & Disclaimer Section */}
      <section style={{ padding: '4rem 2rem', background: '#FFFFFF', borderTop: '1px solid #E2E8F0' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{
            background: '#F8FAFC',
            border: '1px solid #E2E8F0',
            borderRadius: '16px',
            padding: '2rem',
            marginBottom: '2rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.8rem' }}>
              <ShieldCheck size={24} color="#1E3A8A" />
              <h3 style={{ fontSize: '1.2rem', color: '#1E3A8A' }}>Security &amp; Data Privacy</h3>
            </div>
            <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.6 }}>
              All user passwords are cryptographically hashed using industry-standard <strong>bcrypt</strong> salts. API communication is authenticated with stateless <strong>JWT tokens</strong> with automatic session expiry. Applications are strictly isolated per user account.
            </p>
          </div>

          <div style={{
            background: '#FFFBEB',
            border: '1px solid #FDE68A',
            borderRadius: '16px',
            padding: '1.5rem',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '1rem'
          }}>
            <div style={{ color: '#D97706', marginTop: '2px' }}>⚠️</div>
            <div>
              <h4 style={{ fontSize: '0.95rem', color: '#92400E', marginBottom: '0.3rem' }}>
                AI Prediction Disclaimer
              </h4>
              <p style={{ fontSize: '0.85rem', color: '#B45309', lineHeight: 1.5 }}>
                This result is generated by the LoanSetu AI machine-learning model (XGBoost Classifier) and should not be treated as a guaranteed lending decision. Financial institutions must apply statutory underwriting verification before disbursement.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
