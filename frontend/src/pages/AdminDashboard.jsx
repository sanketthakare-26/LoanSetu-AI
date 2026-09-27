import React, { useState, useEffect } from 'react';
import { adminService } from '../services/api';
import {
  ShieldAlert,
  Users,
  FileSpreadsheet,
  CheckCircle2,
  XCircle,
  Percent,
  CreditCard,
  TrendingUp,
  BarChart3,
  Search,
  Eye,
  AlertCircle,
  Layers,
  Building
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import { Link } from 'react-router-dom';

const COLORS = ['#1E3A8A', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899'];

export const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [applications, setApplications] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'applications' | 'users'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchApp, setSearchApp] = useState('');

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        setLoading(true);
        setError('');
        const [statsRes, appsRes, usersRes] = await Promise.all([
          adminService.stats(),
          adminService.applications({ limit: 100 }),
          adminService.users({ limit: 100 })
        ]);
        setStats(statsRes);
        setApplications(appsRes);
        setUsersList(usersRes);
      } catch (err) {
        setError(err.response?.data?.detail || 'Failed to load administrator records. Ensure you have admin privileges.');
      } finally {
        setLoading(false);
      }
    };
    fetchAdminData();
  }, []);

  if (loading) {
    return (
      <div className="page-wrapper" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div style={{ color: 'var(--primary)', fontWeight: 600 }}>Loading Administrator Workspace...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-wrapper">
        <div className="alert alert-danger">
          <AlertCircle size={18} />
          <div>{error}</div>
        </div>
      </div>
    );
  }

  const filteredApps = applications.filter(a => {
    const s = searchApp.toLowerCase();
    return a.id.toString().includes(s) ||
           a.user_name.toLowerCase().includes(s) ||
           a.user_email.toLowerCase().includes(s) ||
           a.loan_purpose.toLowerCase().includes(s);
  });

  return (
    <div className="page-wrapper">
      {/* Header */}
      <div className="page-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.3rem' }}>
            <span className="badge badge-admin">Administrator Workspace</span>
          </div>
          <h1 className="page-title">
            System Portfolio &amp; Risk Analytics
          </h1>
          <p className="page-subtitle">
            System-wide loan applications, risk statistics, and user account management
          </p>
        </div>

        {/* Tab switcher */}
        <div style={{ display: 'flex', gap: '0.4rem', background: '#F1F5F9', padding: '0.3rem', borderRadius: 'var(--radius-md)' }}>
          <button
            type="button"
            className={`btn ${activeTab === 'overview' ? 'btn-primary' : 'btn-outline'}`}
            style={{ padding: '0.45rem 1rem', fontSize: '0.82rem', border: 'none' }}
            onClick={() => setActiveTab('overview')}
          >
            Overview &amp; Charts
          </button>
          <button
            type="button"
            className={`btn ${activeTab === 'applications' ? 'btn-primary' : 'btn-outline'}`}
            style={{ padding: '0.45rem 1rem', fontSize: '0.82rem', border: 'none' }}
            onClick={() => setActiveTab('applications')}
          >
            All Applications ({applications.length})
          </button>
          <button
            type="button"
            className={`btn ${activeTab === 'users' ? 'btn-primary' : 'btn-outline'}`}
            style={{ padding: '0.45rem 1rem', fontSize: '0.82rem', border: 'none' }}
            onClick={() => setActiveTab('users')}
          >
            Registered Users ({usersList.length})
          </button>
        </div>
      </div>

      {/* System Statistics Metrics Grid */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-info">
            <span className="metric-label">Total Users</span>
            <span className="metric-number">{stats?.total_users || 0}</span>
          </div>
          <div className="metric-icon-box" style={{ background: '#F3E8FF', color: '#7E22CE' }}>
            <Users size={22} />
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-info">
            <span className="metric-label">Total Applications</span>
            <span className="metric-number">{stats?.total_applications || 0}</span>
          </div>
          <div className="metric-icon-box" style={{ background: '#EFF6FF', color: '#1E3A8A' }}>
            <FileSpreadsheet size={22} />
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-info">
            <span className="metric-label">Approved</span>
            <span className="metric-number" style={{ color: '#15803D' }}>
              {stats?.total_approved || 0}
            </span>
          </div>
          <div className="metric-icon-box" style={{ background: '#F0FDF4', color: '#15803D' }}>
            <CheckCircle2 size={22} />
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-info">
            <span className="metric-label">Rejected</span>
            <span className="metric-number" style={{ color: '#DC2626' }}>
              {stats?.total_rejected || 0}
            </span>
          </div>
          <div className="metric-icon-box" style={{ background: '#FEF2F2', color: '#DC2626' }}>
            <XCircle size={22} />
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-info">
            <span className="metric-label">Platform Approval Rate</span>
            <span className="metric-number" style={{ color: '#3B82F6' }}>
              {stats?.approval_rate || 0}%
            </span>
          </div>
          <div className="metric-icon-box" style={{ background: '#EFF6FF', color: '#3B82F6' }}>
            <Percent size={22} />
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-info">
            <span className="metric-label">Total Loan Requested</span>
            <span className="metric-number" style={{ fontSize: '1.4rem' }}>
              ₹{((stats?.total_loan_amount || 0) / 100000).toFixed(1)}L
            </span>
          </div>
          <div className="metric-icon-box" style={{ background: '#FFFBEB', color: '#D97706' }}>
            <CreditCard size={22} />
          </div>
        </div>
      </div>

      {/* TAB 1: OVERVIEW & CHARTS */}
      {activeTab === 'overview' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          {/* Chart 1: Daily Applications */}
          <div className="card" style={{ height: '340px', display: 'flex', flexDirection: 'column' }}>
            <h3 className="card-title">
              <BarChart3 size={18} color="var(--primary)" />
              Daily Application Volume
            </h3>
            <div style={{ flex: 1, width: '100%', minHeight: '220px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats?.daily_applications || []} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="count" name="Applications" fill="#1E3A8A" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: Approval vs Rejection Trend */}
          <div className="card" style={{ height: '340px', display: 'flex', flexDirection: 'column' }}>
            <h3 className="card-title">
              <TrendingUp size={18} color="var(--primary)" />
              Approval vs Rejection Trend
            </h3>
            <div style={{ flex: 1, width: '100%', minHeight: '220px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stats?.approval_trend || []} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="approved" name="Approved" stroke="#15803D" strokeWidth={2} dot />
                  <Line type="monotone" dataKey="rejected" name="Rejected" stroke="#DC2626" strokeWidth={2} dot />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 3: Loan Purpose Distribution */}
          <div className="card" style={{ height: '340px', display: 'flex', flexDirection: 'column' }}>
            <h3 className="card-title">
              <Layers size={18} color="var(--primary)" />
              Loan Purpose Breakdown
            </h3>
            <div style={{ flex: 1, width: '100%', minHeight: '220px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats?.purpose_distribution || []}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="count"
                    nameKey="purpose"
                  >
                    {(stats?.purpose_distribution || []).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} applications`, 'Volume']} />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 4: Employment Distribution */}
          <div className="card" style={{ height: '340px', display: 'flex', flexDirection: 'column' }}>
            <h3 className="card-title">
              <Building size={18} color="var(--primary)" />
              Applicant Employment Status
            </h3>
            <div style={{ flex: 1, width: '100%', minHeight: '220px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats?.employment_distribution || []} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="status" tick={{ fontSize: 11 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="count" name="Applicants" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ALL APPLICATIONS */}
      {activeTab === 'applications' && (
        <div className="card" style={{ padding: 0 }}>
          <div style={{ padding: '1.2rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)' }}>
            <div style={{ position: 'relative', width: '320px' }}>
              <Search size={16} style={{ position: 'absolute', left: '10px', top: '10px', color: 'var(--text-muted)' }} />
              <input
                type="text"
                className="form-input"
                placeholder="Search user, email, purpose..."
                value={searchApp}
                onChange={(e) => setSearchApp(e.target.value)}
                style={{ paddingLeft: '2.2rem', padding: '0.5rem 0.8rem 0.5rem 2.2rem' }}
              />
            </div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Showing {filteredApps.length} applications
            </span>
          </div>

          <div className="data-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Applicant</th>
                  <th>Email</th>
                  <th>Loan Purpose</th>
                  <th>Amount</th>
                  <th>Credit Score</th>
                  <th>Verdict</th>
                  <th>Confidence</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredApps.map((a) => (
                  <tr key={a.id}>
                    <td style={{ fontWeight: 700, color: 'var(--primary)' }}>#{a.id}</td>
                    <td style={{ fontWeight: 600 }}>{a.user_name}</td>
                    <td style={{ color: 'var(--text-muted)' }}>{a.user_email}</td>
                    <td>{a.loan_purpose}</td>
                    <td style={{ fontWeight: 700 }}>₹{parseFloat(a.loan_amount).toLocaleString('en-IN')}</td>
                    <td>{a.credit_score}</td>
                    <td>
                      {a.prediction ? (
                        <span className={`badge ${a.prediction.prediction === 'APPROVED' ? 'badge-approved' : 'badge-rejected'}`}>
                          {a.prediction.prediction === 'APPROVED' ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                          {a.prediction.prediction}
                        </span>
                      ) : 'N/A'}
                    </td>
                    <td>
                      {a.prediction ? `${(a.prediction.approval_probability * 100).toFixed(1)}%` : 'N/A'}
                    </td>
                    <td>{new Date(a.created_at).toLocaleDateString('en-IN')}</td>
                    <td>
                      <Link to={`/applications/${a.id}`} className="btn btn-outline" style={{ padding: '0.3rem 0.6rem', fontSize: '0.78rem' }}>
                        <Eye size={13} />
                        <span>Inspect</span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: USERS MANAGEMENT */}
      {activeTab === 'users' && (
        <div className="card" style={{ padding: 0 }}>
          <div style={{ padding: '1.2rem 1.5rem', borderBottom: '1px solid var(--border)' }}>
            <h2 style={{ fontSize: '1.1rem', color: 'var(--primary)', margin: 0 }}>
              Registered Platform Users
            </h2>
          </div>

          <div className="data-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>User ID</th>
                  <th>Full Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Role</th>
                  <th>Applications Filed</th>
                  <th>Member Since</th>
                </tr>
              </thead>
              <tbody>
                {usersList.map((u) => (
                  <tr key={u.id}>
                    <td style={{ fontWeight: 700, color: 'var(--primary)' }}>#{u.id}</td>
                    <td style={{ fontWeight: 600 }}>{u.full_name}</td>
                    <td>{u.email}</td>
                    <td>{u.phone || '—'}</td>
                    <td>
                      <span className={`badge ${u.role === 'admin' ? 'badge-admin' : 'badge-user'}`}>
                        {u.role === 'admin' ? 'Administrator' : 'User'}
                      </span>
                    </td>
                    <td style={{ fontWeight: 700 }}>{u.applications_count}</td>
                    <td>{new Date(u.created_at).toLocaleDateString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
