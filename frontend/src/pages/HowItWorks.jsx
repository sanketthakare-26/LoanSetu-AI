import React from 'react';
import { Link } from 'react-router-dom';
import {
  Cpu,
  Layers,
  CheckCircle2,
  Database,
  ArrowRight,
  TrendingUp,
  FileCheck2,
  ShieldCheck,
  Zap,
  Award,
  Sparkles
} from 'lucide-react';

export const HowItWorks = () => {
  return (
    <div className="page-wrapper">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <Cpu size={24} color="var(--primary)" />
            How LoanSetu AI Works
          </h1>
          <p className="page-subtitle">
            An inside look at our automated machine learning underwriting architecture
          </p>
        </div>

        <Link to="/predict" className="btn btn-primary">
          <Sparkles size={16} />
          <span>Try Prediction Engine</span>
        </Link>
      </div>

      {/* End-to-End Pipeline Visualization */}
      <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <span style={{ color: 'var(--secondary)', fontWeight: 700, fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
            ARCHITECTURE PIPELINE
          </span>
          <h2 style={{ fontSize: '1.6rem', color: 'var(--primary)', marginTop: '0.3rem' }}>
            The 8-Stage Underwriting Workflow
          </h2>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1.2rem',
          position: 'relative'
        }}>
          {/* Stage 1 */}
          <div style={{ background: '#F8FAFC', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '1.2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.6rem' }}>
              <span style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--primary)', color: '#FFFFFF', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.82rem' }}>1</span>
              <h3 style={{ fontSize: '1rem', color: 'var(--primary)', margin: 0 }}>Applicant Input</h3>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              User submits personal, employment, financial, and loan requirement parameters through the web form.
            </p>
          </div>

          {/* Stage 2 */}
          <div style={{ background: '#F8FAFC', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '1.2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.6rem' }}>
              <span style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--primary)', color: '#FFFFFF', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.82rem' }}>2</span>
              <h3 style={{ fontSize: '1rem', color: 'var(--primary)', margin: 0 }}>Backend Validation</h3>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              FastAPI + Pydantic validates input ranges (Credit score: 300–900, DTI: 0–1, non-negative income).
            </p>
          </div>

          {/* Stage 3 */}
          <div style={{ background: '#F8FAFC', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '1.2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.6rem' }}>
              <span style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--primary)', color: '#FFFFFF', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.82rem' }}>3</span>
              <h3 style={{ fontSize: '1rem', color: 'var(--primary)', margin: 0 }}>Data Preprocessing</h3>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              Categorical columns are one-hot encoded into a 27-feature matrix preserving exact training alignment.
            </p>
          </div>

          {/* Stage 4 */}
          <div style={{ background: '#F8FAFC', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '1.2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.6rem' }}>
              <span style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--primary)', color: '#FFFFFF', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.82rem' }}>4</span>
              <h3 style={{ fontSize: '1rem', color: 'var(--primary)', margin: 0 }}>StandardScaler</h3>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              Fitted scikit-learn StandardScaler normalizes features to zero mean and unit variance.
            </p>
          </div>

          {/* Stage 5 */}
          <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: 'var(--radius-md)', padding: '1.2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.6rem' }}>
              <span style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--secondary)', color: '#FFFFFF', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.82rem' }}>5</span>
              <h3 style={{ fontSize: '1rem', color: 'var(--primary)', margin: 0 }}>XGBoost Classifier</h3>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#1E40AF', lineHeight: 1.5 }}>
              The gradient boosted tree ensemble evaluates risk boundaries and computes tree path weights.
            </p>
          </div>

          {/* Stage 6 */}
          <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: 'var(--radius-md)', padding: '1.2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.6rem' }}>
              <span style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--secondary)', color: '#FFFFFF', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.82rem' }}>6</span>
              <h3 style={{ fontSize: '1rem', color: 'var(--primary)', margin: 0 }}>Probability Scoring</h3>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#1E40AF', lineHeight: 1.5 }}>
              Calibrated softmax outputs generate Approval Probability vs Rejection Probability.
            </p>
          </div>

          {/* Stage 7 */}
          <div style={{ background: '#F8FAFC', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '1.2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.6rem' }}>
              <span style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--primary)', color: '#FFFFFF', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.82rem' }}>7</span>
              <h3 style={{ fontSize: '1rem', color: 'var(--primary)', margin: 0 }}>MySQL Persistence</h3>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              Application, prediction verdict, and timing audit logs are written across relational tables.
            </p>
          </div>

          {/* Stage 8 */}
          <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: 'var(--radius-md)', padding: '1.2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.6rem' }}>
              <span style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--success)', color: '#FFFFFF', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.82rem' }}>8</span>
              <h3 style={{ fontSize: '1rem', color: 'var(--success)', margin: 0 }}>Interactive Results</h3>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#166534', lineHeight: 1.5 }}>
              User receives instant feedback with clear probability progress bars and downloadable audit reports.
            </p>
          </div>
        </div>
      </div>

      {/* XGBoost Classifier Deep Dive (Beginner Friendly) */}
      <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
          <div style={{
            background: 'var(--primary-subtle)',
            color: 'var(--primary)',
            width: '42px',
            height: '42px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Award size={24} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.4rem', color: 'var(--primary)', margin: 0 }}>
              What is the XGBoost Classifier?
            </h2>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              A beginner-friendly explanation of the machine learning model behind LoanSetu AI
            </div>
          </div>
        </div>

        <div style={{ fontSize: '0.92rem', color: 'var(--text-main)', lineHeight: 1.7, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <p>
            <strong>XGBoost</strong> stands for <em>Extreme Gradient Boosting</em>. It is one of the world's most powerful algorithms for structured financial and tabular data.
          </p>

          <div style={{ background: '#F8FAFC', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '1.2rem' }}>
            <h4 style={{ color: 'var(--primary)', marginBottom: '0.4rem', fontSize: '1rem' }}>
              🌲 How "Gradient Boosting" Works:
            </h4>
            <p style={{ color: '#475569', fontSize: '0.9rem' }}>
              Imagine an underwriting team of 100 expert loan officers. Rather than making a decision individually, the first officer looks at the application and makes a preliminary judgment. The second officer looks at where the first officer might have made mistakes (the <em>residuals</em>) and corrects them. Each successive decision tree focuses specifically on difficult edge cases until the committee reaches an optimal, calibrated consensus.
            </p>
          </div>

          <h3 style={{ color: 'var(--primary)', fontSize: '1.1rem', marginTop: '0.5rem' }}>
            Why XGBoost is Ideal for Loan Decisioning:
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
            <div style={{ padding: '1rem', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontWeight: 700, color: 'var(--primary)', marginBottom: '0.3rem' }}>1. Non-Linear Patterns</div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Captures complex interactions (e.g. a low credit score might be offset by strong collateral and low DTI, whereas a high credit score with high DTI is risky).
              </p>
            </div>

            <div style={{ padding: '1rem', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontWeight: 700, color: 'var(--primary)', marginBottom: '0.3rem' }}>2. Robust Against Outliers</div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Decision tree split boundaries are resilient against extreme salary numbers or unusual property values.
              </p>
            </div>

            <div style={{ padding: '1rem', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontWeight: 700, color: 'var(--primary)', marginBottom: '0.3rem' }}>3. Probabilistic Outputs</div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Provides true calibrated risk probabilities (e.g. 71.4% approval confidence) rather than a crude pass/fail.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
