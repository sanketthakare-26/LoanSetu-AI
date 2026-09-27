import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { authService } from '../services/api';
import {
  User,
  Mail,
  Phone,
  Calendar,
  Lock,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Save,
  KeyRound
} from 'lucide-react';

export const Profile = () => {
  const { user, updateUser } = useAuth();

  const [fullName, setFullName] = useState(user?.full_name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileError, setProfileError] = useState('');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setProfileError('Full name is required.');
      return;
    }

    try {
      setProfileLoading(true);
      setProfileError('');
      setProfileSuccess('');
      const updated = await authService.updateProfile(fullName.trim(), phone.trim() || null);
      updateUser(updated);
      setProfileSuccess('Profile details updated successfully!');
    } catch (err) {
      setProfileError(err.response?.data?.detail || 'Failed to update profile.');
    } finally {
      setProfileLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      setPasswordError('Please fill in all password fields.');
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }

    try {
      setPasswordLoading(true);
      setPasswordError('');
      setPasswordSuccess('');
      await authService.changePassword(currentPassword, newPassword);
      setPasswordSuccess('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setPasswordError(err.response?.data?.detail || 'Failed to change password. Please check your current password.');
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="page-wrapper">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <User size={24} color="var(--primary)" />
            Account &amp; Security Profile
          </h1>
          <p className="page-subtitle">
            Manage your personal profile details and account security settings
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
        {/* Profile Details Card */}
        <div className="card">
          <h2 className="card-title" style={{ marginBottom: '0.4rem' }}>
            Personal Details
          </h2>
          <p className="card-subtitle">
            Update your contact and identification details
          </p>

          {profileSuccess && (
            <div className="alert alert-success">
              <CheckCircle2 size={18} />
              <div>{profileSuccess}</div>
            </div>
          )}

          {profileError && (
            <div className="alert alert-danger">
              <AlertCircle size={18} />
              <div>{profileError}</div>
            </div>
          )}

          <form onSubmit={handleUpdateProfile}>
            <div className="form-group">
              <label className="form-label" htmlFor="fullName">
                Full Name
              </label>
              <input
                id="fullName"
                type="text"
                className="form-input"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="email">
                Email Address (Read-only)
              </label>
              <input
                id="email"
                type="email"
                className="form-input"
                value={user?.email || ''}
                disabled
                style={{ background: '#F1F5F9', color: 'var(--text-muted)' }}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="phone">
                Phone Number
              </label>
              <input
                id="phone"
                type="tel"
                className="form-input"
                placeholder="e.g. 9876543210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div style={{
              background: '#F8FAFC',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              padding: '0.85rem',
              marginBottom: '1.2rem',
              fontSize: '0.82rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Role:</span>{' '}
                <span className={`badge ${user?.role === 'admin' ? 'badge-admin' : 'badge-user'}`} style={{ marginLeft: '4px' }}>
                  {user?.role === 'admin' ? 'Administrator' : 'Standard User'}
                </span>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Joined:</span>{' '}
                <strong>
                  {user?.created_at ? new Date(user.created_at).toLocaleDateString('en-IN') : 'N/A'}
                </strong>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%' }}
              disabled={profileLoading}
            >
              <Save size={16} />
              <span>{profileLoading ? 'Saving...' : 'Save Profile Changes'}</span>
            </button>
          </form>
        </div>

        {/* Change Password Card */}
        <div className="card">
          <h2 className="card-title" style={{ marginBottom: '0.4rem' }}>
            Change Password
          </h2>
          <p className="card-subtitle">
            Update your password securely using bcrypt encryption
          </p>

          {passwordSuccess && (
            <div className="alert alert-success">
              <CheckCircle2 size={18} />
              <div>{passwordSuccess}</div>
            </div>
          )}

          {passwordError && (
            <div className="alert alert-danger">
              <AlertCircle size={18} />
              <div>{passwordError}</div>
            </div>
          )}

          <form onSubmit={handleChangePassword}>
            <div className="form-group">
              <label className="form-label" htmlFor="currentPassword">
                Current Password
              </label>
              <input
                id="currentPassword"
                type="password"
                className="form-input"
                placeholder="Enter current password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="newPassword">
                New Password
              </label>
              <input
                id="newPassword"
                type="password"
                className="form-input"
                placeholder="At least 6 characters"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="confirmPassword">
                Confirm New Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                className="form-input"
                placeholder="Re-type new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '0.5rem' }}
              disabled={passwordLoading}
            >
              <KeyRound size={16} />
              <span>{passwordLoading ? 'Updating Password...' : 'Change Password'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
