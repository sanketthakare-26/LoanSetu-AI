import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { applicationService } from '../services/api';
import {
  FileSpreadsheet,
  Search,
  Filter,
  Trash2,
  Eye,
  CheckCircle2,
  XCircle,
  PlusCircle,
  AlertCircle,
  ArrowUpDown,
  FileText
} from 'lucide-react';

export const ApplicationsHistory = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState(''); // '' | 'APPROVED' | 'REJECTED'
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('desc'); // 'desc' | 'asc'
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  const [deleteModalApp, setDeleteModalApp] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await applicationService.getAll({ limit: 100, prediction: filter });
      setApplications(data);
    } catch (err) {
      setError('Failed to load application history. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
    setCurrentPage(1);
  }, [filter]);

  const handleDelete = async () => {
    if (!deleteModalApp) return;
    try {
      setIsDeleting(true);
      await applicationService.delete(deleteModalApp.id);
      setApplications(prev => prev.filter(a => a.id !== deleteModalApp.id));
      setDeleteModalApp(null);
    } catch (err) {
      alert('Failed to delete application. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  // Search filter
  const filteredApps = applications.filter((app) => {
    const q = searchTerm.toLowerCase();
    const idMatch = app.id.toString().includes(q);
    const purposeMatch = (app.loan_purpose || '').toLowerCase().includes(q);
    const amountMatch = app.loan_amount.toString().includes(q);
    const statusMatch = (app.prediction?.prediction || '').toLowerCase().includes(q);
    return idMatch || purposeMatch || amountMatch || statusMatch;
  });

  // Sort
  const sortedApps = [...filteredApps].sort((a, b) => {
    const dateA = new Date(a.created_at).getTime();
    const dateB = new Date(b.created_at).getTime();
    return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
  });

  // Pagination
  const totalPages = Math.ceil(sortedApps.length / pageSize) || 1;
  const paginatedApps = sortedApps.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="page-wrapper">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <FileSpreadsheet size={24} color="var(--primary)" />
            Application History
          </h1>
          <p className="page-subtitle">
            Track and manage all your past loan underwriting assessments
          </p>
        </div>

        <Link to="/predict" className="btn btn-primary">
          <PlusCircle size={18} />
          <span>New Prediction</span>
        </Link>
      </div>

      {error && (
        <div className="alert alert-danger">
          <AlertCircle size={18} />
          <div>{error}</div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="card" style={{ padding: '1.2rem', marginBottom: '1.5rem' }}>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1rem',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          {/* Search box */}
          <div style={{ position: 'relative', minWidth: '260px', flex: '1' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '10px', color: 'var(--text-muted)' }} />
            <input
              type="text"
              className="form-input"
              placeholder="Search by ID, purpose, amount..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              style={{ paddingLeft: '2.4rem' }}
            />
          </div>

          {/* Filter tabs */}
          <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, marginRight: '4px' }}>
              Filter:
            </span>
            <button
              type="button"
              className={`btn ${filter === '' ? 'btn-primary' : 'btn-outline'}`}
              style={{ padding: '0.4rem 0.85rem', fontSize: '0.82rem' }}
              onClick={() => setFilter('')}
            >
              All ({applications.length})
            </button>
            <button
              type="button"
              className={`btn ${filter === 'APPROVED' ? 'btn-success' : 'btn-outline'}`}
              style={{ padding: '0.4rem 0.85rem', fontSize: '0.82rem' }}
              onClick={() => setFilter('APPROVED')}
            >
              Approved
            </button>
            <button
              type="button"
              className={`btn ${filter === 'REJECTED' ? 'btn-danger' : 'btn-outline'}`}
              style={{ padding: '0.4rem 0.85rem', fontSize: '0.82rem' }}
              onClick={() => setFilter('REJECTED')}
            >
              Rejected
            </button>

            {/* Sort toggle */}
            <button
              type="button"
              className="btn btn-outline"
              style={{ padding: '0.4rem 0.85rem', fontSize: '0.82rem', marginLeft: '0.5rem' }}
              onClick={() => setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')}
              title="Toggle sorting direction"
            >
              <ArrowUpDown size={14} />
              <span>{sortOrder === 'desc' ? 'Newest' : 'Oldest'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Applications Table */}
      <div className="card" style={{ padding: 0 }}>
        <div className="data-table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>App ID</th>
                <th>Submission Date</th>
                <th>Loan Purpose</th>
                <th>Loan Amount</th>
                <th>Term</th>
                <th>Credit Score</th>
                <th>Verdict</th>
                <th>Approval Prob</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={9} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                    Loading your applications...
                  </td>
                </tr>
              ) : paginatedApps.length > 0 ? (
                paginatedApps.map((app) => (
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
                    <td>
                      <span style={{ fontWeight: 600 }}>{app.loan_purpose}</span>
                    </td>
                    <td style={{ fontWeight: 700 }}>
                      ₹{parseFloat(app.loan_amount).toLocaleString('en-IN')}
                    </td>
                    <td>{app.loan_term} mo</td>
                    <td>
                      <span style={{
                        fontWeight: 700,
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
                        <span style={{ fontWeight: 800 }}>
                          {(app.prediction.approval_probability * 100).toFixed(1)}%
                        </span>
                      ) : (
                        'N/A'
                      )}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        <Link
                          to={`/applications/${app.id}`}
                          className="btn btn-outline"
                          style={{ padding: '0.35rem 0.65rem', fontSize: '0.8rem' }}
                          title="View Application Details"
                        >
                          <Eye size={14} />
                          <span>View</span>
                        </Link>
                        <Link
                          to={`/report/${app.id}`}
                          className="btn btn-outline"
                          style={{ padding: '0.35rem 0.65rem', fontSize: '0.8rem' }}
                          title="Print / Download PDF Report"
                        >
                          <FileText size={14} />
                        </Link>
                        <button
                          type="button"
                          className="btn btn-danger"
                          style={{ padding: '0.35rem 0.65rem', fontSize: '0.8rem' }}
                          onClick={() => setDeleteModalApp(app)}
                          title="Delete Application"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} style={{ textAlign: 'center', padding: '3.5rem 1rem', color: 'var(--text-muted)' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📁</div>
                    <div style={{ fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.3rem' }}>
                      No applications found
                    </div>
                    <p style={{ fontSize: '0.88rem' }}>
                      {searchTerm ? 'Try adjusting your search criteria or filter.' : 'You have not submitted any loan applications yet.'}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '1rem 1.5rem',
            borderTop: '1px solid var(--border)'
          }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Showing Page {currentPage} of {totalPages} ({sortedApps.length} total)
            </span>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                type="button"
                className="btn btn-outline"
                style={{ padding: '0.35rem 0.8rem', fontSize: '0.82rem' }}
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              >
                Previous
              </button>
              <button
                type="button"
                className="btn btn-outline"
                style={{ padding: '0.35rem 0.8rem', fontSize: '0.82rem' }}
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModalApp && (
        <div className="modal-overlay" onClick={() => setDeleteModalApp(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '440px', padding: '2rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                background: 'var(--danger-bg)',
                color: 'var(--danger)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '0.8rem'
              }}>
                <Trash2 size={28} />
              </div>
              <h2 style={{ fontSize: '1.3rem', color: 'var(--text-main)', marginBottom: '0.4rem' }}>
                Delete Application #{deleteModalApp.id}?
              </h2>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                This will permanently remove the application record, prediction result, and logs from MySQL database. This action cannot be undone.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => setDeleteModalApp(null)}
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Confirm Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
