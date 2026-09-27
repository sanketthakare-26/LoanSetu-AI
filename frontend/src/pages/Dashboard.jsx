import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { dashboardService, applicationService } from '../services/api';
import {
  FileSpreadsheet,
  CheckCircle2,
  XCircle,
  Percent,
  PlusCircle,
  Eye,
  TrendingUp,
  AlertCircle,
  CreditCard,
  Layers,
  ArrowRight
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart,
  Bar
} from 'recharts';

export const Dashboard = () => {
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [recentApps, setRecentApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');
        const [sumRes, recRes] = await Promise.all([
          dashboardService.summary(),
          dashboardService.recent()
        ]);
        setSummary(sumRes);
        setRecentApps(recRes);
      } catch (err) {
        setError('Failed to load dashboard metrics. Please ensure the backend is running.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="page-wrapper" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div style={{ color: 'var(--primary)', fontWeight: 600 }}>Loading Dashboard...</div>
      </div>
    );
  }

  // Chart 1 data: Approved vs Rejected
  const pieData = [
    { name: 'Approved', value: summary?.approved_count || 0, color: '#15803D' },
    { name: 'Rejected', value: summary?.rejected_count || 0, color: '#DC2626' }
  ];

  // Chart 2 data: Applications over time (grouped from recent applications)
  const timeGroupMap = {};
  [...recentApps].reverse().forEach((app) => {
    const d = new Date(app.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    timeGroupMap[d] = (timeGroupMap[d] || 0) + 1;
  });
  const timeData = Object.keys(timeGroupMap).length > 0 
    ? Object.keys(timeGroupMap).map(k => ({ date: k, count: timeGroupMap[k] }))
    : [
        { date: 'Mon', count: 0 },
        { date: 'Tue', count: 0 },
        { date: 'Wed', count: 0 },
        { date: 'Thu', count: 0 },
        { date: 'Today', count: summary?.total_applications || 0 }
      ];

  // Chart 3 data: Loan amount distribution
  const amountRanges = [
    { range: '< ₹2L', count: 0 },
    { range: '₹2L - ₹5L', count: 0 },
    { range: '₹5L - ₹10L', count: 0 },
    { range: '> ₹10L', count: 0 }
  ];
  recentApps.forEach(a => {
    const amt = parseFloat(a.loan_amount);
    if (amt < 200000) amountRanges[0].count++;
    else if (amt <= 500000) amountRanges[1].count++;
    else if (amt <= 1000000) amountRanges[2].count++;
    else amountRanges[3].count++;
  });

  return (
    <div className="page-wrapper">
      {/* Header Banner */}
      <div className="page-header">
        <div>
          <h1 className="page-title">
            Welcome, {user?.full_name || 'Borrower'} 👋
          </h1>
          <p className="page-subtitle">
            Overview of your loan evaluations and risk assessment metrics
          </p>
        </div>

        <Link to="/predict" className="btn btn-primary" style={{ padding: '0.75rem 1.4rem' }}>
          <PlusCircle size={18} />
          <span>New Loan Prediction</span>
        </Link>
      </div>

      {error && (
        <div className="alert alert-danger">
          <AlertCircle size={18} />
          <div>{error}</div>
        </div>
      )}

      {/* KPI Cards */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-info">
            <span className="metric-label">Total Applications</span>
            <span className="metric-number">{summary?.total_applications || 0}</span>
          </div>
          <div className="metric-icon-box" style={{ background: '#EFF6FF', color: '#1E3A8A' }}>
            <FileSpreadsheet size={24} />
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-info">
            <span className="metric-label">Approved</span>
            <span className="metric-number" style={{ color: '#15803D' }}>
              {summary?.approved_count || 0}
            </span>
          </div>
          <div className="metric-icon-box" style={{ background: '#F0FDF4', color: '#15803D' }}>
            <CheckCircle2 size={24} />
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-info">
            <span className="metric-label">Rejected</span>
            <span className="metric-number" style={{ color: '#DC2626' }}>
              {summary?.rejected_count || 0}
            </span>
          </div>
          <div className="metric-icon-box" style={{ background: '#FEF2F2', color: '#DC2626' }}>
            <XCircle size={24} />
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-info">
            <span className="metric-label">Approval Rate</span>
            <span className="metric-number" style={{ color: '#3B82F6' }}>
              {summary?.approval_percentage || 0}%
            </span>
          </div>
          <div className="metric-icon-box" style={{ background: '#EFF6FF', color: '#3B82F6' }}>
            <Percent size={24} />
          </div>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        {/* Chart 1: Approved vs Rejected */}
        <div className="card" style={{ height: '320px', display: 'flex', flexDirection: 'column' }}>
          <h3 className="card-title">
            <TrendingUp size={18} color="var(--primary)" />
            Approved vs Rejected
          </h3>
          <div style={{ flex: 1, width: '100%', minHeight: '200px' }}>
            {summary?.total_applications > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} applications`, 'Count']} />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                No applications submitted yet
              </div>
            )}
          </div>
        </div>

        {/* Chart 2: Applications Over Time */}
        <div className="card" style={{ height: '320px', display: 'flex', flexDirection: 'column' }}>
          <h3 className="card-title">
            <Layers size={18} color="var(--primary)" />
            Applications Over Time
          </h3>
          <div style={{ flex: 1, width: '100%', minHeight: '200px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timeData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Area type="monotone" dataKey="count" name="Applications" stroke="#3B82F6" strokeWidth={2} fillOpacity={1} fill="url(#colorApps)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Loan Amount Distribution */}
        <div className="card" style={{ height: '320px', display: 'flex', flexDirection: 'column' }}>
          <h3 className="card-title">
            <CreditCard size={18} color="var(--primary)" />
            Loan Amount Distribution
          </h3>
          <div style={{ flex: 1, width: '100%', minHeight: '200px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={amountRanges} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="range" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="count" name="Applications" fill="#1E3A8A" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Applications Table */}
      <div className="card" style={{ padding: 0 }}>
        <div style={{ padding: '1.2rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)' }}>
          <h2 style={{ fontSize: '1.15rem', color: 'var(--primary)' }}>
            Recent Applications
          </h2>
          <Link to="/history" style={{ fontSize: '0.85rem', color: 'var(--secondary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
            View All History <ArrowRight size={14} />
          </Link>
        </div>

        <div className="data-table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>App ID</th>
                <th>Date</th>
                <th>Loan Amount</th>
                <th>Credit Score</th>
                <th>Prediction</th>
                <th>Approval Prob</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {recentApps.length > 0 ? (
                recentApps.map((app) => (
                  <tr key={app.id}>
                    <td style={{ fontWeight: 700, color: 'var(--primary)' }}>
                      #{app.id}
                    </td>
                    <td>
                      {new Date(app.created_at).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                    <td style={{ fontWeight: 600 }}>
                      ₹{parseFloat(app.loan_amount).toLocaleString('en-IN')}
                    </td>
                    <td>
                      <span style={{
                        fontWeight: 600,
                        color: app.credit_score >= 750 ? '#15803D' : app.credit_score >= 600 ? '#D97706' : '#DC2626'
                      }}>
                        {app.credit_score}
                      </span>
                    </td>
                    <td>
                      {app.prediction ? (
                        <span className={`badge ${app.prediction.prediction === 'APPROVED' ? 'badge-approved' : 'badge-rejected'}`}>
                          {app.prediction.prediction === 'APPROVED' ? <CheckCircle2 size={13} /> : <XCircle size={13} />}
                          {app.prediction.prediction === 'APPROVED' ? 'Likely Approved' : 'Likely Rejected'}
                        </span>
                      ) : (
                        <span className="badge">Pending</span>
                      )}
                    </td>
                    <td>
                      {app.prediction ? (
                        <span style={{ fontWeight: 700 }}>
                          {(app.prediction.approval_probability * 100).toFixed(1)}%
                        </span>
                      ) : (
                        'N/A'
                      )}
                    </td>
                    <td>
                      <Link
                        to={`/applications/${app.id}`}
                        className="btn btn-outline"
                        style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
                      >
                        <Eye size={13} />
                        <span>View</span>
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
                    No loan applications found. Click "New Loan Prediction" above to evaluate your first loan!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
