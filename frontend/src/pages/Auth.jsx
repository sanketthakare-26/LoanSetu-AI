import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Landmark, Mail, Lock, Phone, User, LogIn, UserPlus, AlertCircle } from 'lucide-react';

// --------------------------------------------------------------------------
// Shared styled input
// --------------------------------------------------------------------------
const InputWithIcon = ({ icon: Icon, ...props }) => (
  <div style={{ position: 'relative' }}>
    <input {...props} style={{ width: '100%', paddingLeft: '2.6rem', ...props.style }} className={`form-input ${props.className || ''}`} />
    <Icon size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
  </div>
);

// --------------------------------------------------------------------------
// Login
// --------------------------------------------------------------------------
export const Login = () => {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  const { login }    = useAuth();
  const navigate     = useNavigate();
  const location     = useLocation();
  const from         = location.state?.from?.pathname || '/';

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid email or password.');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: '85vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem' }}>
      <div className="fade-in" style={{
        background: '#fff', border: '1px solid var(--border-light)',
        borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-lg)',
        padding: '2.5rem', width: '100%', maxWidth: '460px', position: 'relative', overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 5, background: 'linear-gradient(90deg,var(--navy-deep),var(--gold-accent),var(--navy-light))' }} />

        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ background: 'linear-gradient(135deg,var(--navy-deep),var(--navy-primary))', color: 'var(--gold-accent)', width: 56, height: 56, borderRadius: 16, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', boxShadow: '0 8px 18px rgba(11,31,58,.25)' }}>
            <Landmark size={30} />
          </div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', color: 'var(--navy-deep)', margin: 0 }}>Welcome Back</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.4rem' }}>Sign in to LoanSetu AI</p>
        </div>

        {error && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.8rem 1rem', background: 'var(--danger-bg)', border: '1px solid var(--danger-border)', borderRadius: 'var(--radius-md)', color: 'var(--danger)', fontSize: '0.85rem', marginBottom: '1.4rem' }}>
            <AlertCircle size={18} /><span>{error}</span>
          </div>
        )}

        <form onSubmit={submit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <InputWithIcon icon={Mail} type="email" required placeholder="priya@example.com" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <InputWithIcon icon={Lock} type="password" required placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} />
          </div>
          <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', padding: '0.85rem', marginTop: '0.5rem', fontSize: '1rem' }}>
            {loading ? 'Signing in…' : <><LogIn size={18} /><span>Sign In to LoanSetu AI</span></>}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
          Don't have an account?{' '}<Link to="/register" style={{ color: 'var(--navy-primary)', fontWeight: 700 }}>Create Account</Link>
        </p>
      </div>
    </div>
  );
};

// --------------------------------------------------------------------------
// Register
// --------------------------------------------------------------------------
export const Register = () => {
  const [form, setForm] = useState({ full_name: '', email: '', password: '', confirm: '', phone: '' });
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate     = useNavigate();

  const set = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password.length < 6)       return setError('Password must be at least 6 characters.');
    if (form.password !== form.confirm) return setError('Passwords do not match.');
    setLoading(true);
    try {
      await register(form.full_name, form.email, form.password, form.phone || null);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed. Please try again.');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: '85vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem' }}>
      <div className="fade-in" style={{
        background: '#fff', border: '1px solid var(--border-light)',
        borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-lg)',
        padding: '2.5rem', width: '100%', maxWidth: '480px', position: 'relative', overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 5, background: 'linear-gradient(90deg,var(--gold-accent),var(--navy-deep),var(--navy-light))' }} />

        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ background: 'linear-gradient(135deg,var(--navy-deep),var(--navy-primary))', color: 'var(--gold-accent)', width: 56, height: 56, borderRadius: 16, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', boxShadow: '0 8px 18px rgba(11,31,58,.25)' }}>
            <Landmark size={30} />
          </div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', color: 'var(--navy-deep)', margin: 0 }}>Create Account</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.4rem' }}>Start predicting loan approvals instantly</p>
        </div>

        {error && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.8rem 1rem', background: 'var(--danger-bg)', border: '1px solid var(--danger-border)', borderRadius: 'var(--radius-md)', color: 'var(--danger)', fontSize: '0.85rem', marginBottom: '1.4rem' }}>
            <AlertCircle size={18} /><span>{error}</span>
          </div>
        )}

        <form onSubmit={submit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <InputWithIcon icon={User} type="text" required placeholder="Priya Sharma" value={form.full_name} onChange={set('full_name')} />
          </div>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <InputWithIcon icon={Mail} type="email" required placeholder="priya@example.com" value={form.email} onChange={set('email')} />
          </div>
          <div className="form-group">
            <label className="form-label">Phone <span style={{ fontWeight: 400, color: 'var(--text-muted)' }}>(optional)</span></label>
            <InputWithIcon icon={Phone} type="tel" placeholder="9876543210" value={form.phone} onChange={set('phone')} />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <InputWithIcon icon={Lock} type="password" required placeholder="Minimum 6 characters" value={form.password} onChange={set('password')} />
          </div>
          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <InputWithIcon icon={Lock} type="password" required placeholder="Re-type your password" value={form.confirm} onChange={set('confirm')} />
          </div>
          <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', padding: '0.85rem', marginTop: '0.5rem', fontSize: '1rem' }}>
            {loading ? 'Creating Account…' : <><UserPlus size={18} /><span>Register &amp; Access System</span></>}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
          Already have an account?{' '}<Link to="/login" style={{ color: 'var(--navy-primary)', fontWeight: 700 }}>Sign In</Link>
        </p>
      </div>
    </div>
  );
};
