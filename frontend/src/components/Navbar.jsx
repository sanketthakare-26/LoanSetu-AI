import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { systemService } from '../services/api';
import {
  Landmark,
  User,
  LogOut,
  Menu,
  X,
  ShieldCheck,
  Cpu,
  Sparkles,
  LayoutDashboard,
  FileSpreadsheet,
  HelpCircle,
  ShieldAlert
} from 'lucide-react';

export const Navbar = ({ toggleSidebar, isSidebarOpen }) => {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [health, setHealth] = useState({ backend: 'checking', model: 'checking' });

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const res = await systemService.health();
        setHealth(res);
      } catch {
        setHealth({ backend: 'offline', model: 'offline' });
      }
    };
    checkHealth();
    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isHealthy = health.backend === 'healthy' && (health.model === 'loaded' || health.model?.startsWith('loaded'));

  return (
    <nav style={{
      background: '#FFFFFF',
      borderBottom: '1px solid var(--border)',
      padding: '0.85rem 2rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 40,
      boxShadow: 'var(--shadow-xs)'
    }}>
      {/* Left side: Hamburger (if logged in/mobile) + Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {isAuthenticated && (
          <button
            onClick={toggleSidebar}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              padding: '0.4rem',
              borderRadius: 'var(--radius-sm)'
            }}
            title="Toggle Navigation Menu"
          >
            {isSidebarOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        )}

        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{
            background: 'var(--primary)',
            color: '#FFFFFF',
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <Landmark size={22} />
          </div>
          <div>
            <div style={{
              fontFamily: 'var(--font-heading)',
              fontWeight: 800,
              fontSize: '1.25rem',
              color: 'var(--primary)',
              letterSpacing: '-0.3px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              LoanSetu <span style={{ color: 'var(--secondary)' }}>AI</span>
            </div>
          </div>
        </Link>
      </div>

      {/* Middle nav links (When unauthenticated) */}
      {!isAuthenticated && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <Link
            to="/"
            style={{
              fontSize: '0.9rem',
              fontWeight: 600,
              color: location.pathname === '/' ? 'var(--primary)' : 'var(--text-muted)'
            }}
          >
            Home
          </Link>
          <Link
            to="/how-it-works"
            style={{
              fontSize: '0.9rem',
              fontWeight: 600,
              color: location.pathname === '/how-it-works' ? 'var(--primary)' : 'var(--text-muted)'
            }}
          >
            How It Works
          </Link>
          <Link
            to="/how-it-works"
            style={{
              fontSize: '0.9rem',
              fontWeight: 600,
              color: location.pathname === '/about' ? 'var(--primary)' : 'var(--text-muted)'
            }}
          >
            About
          </Link>
        </div>
      )}

      {/* Right side: Live model status badge + Auth actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
        {/* ML Status indicator */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.45rem',
          background: isHealthy ? 'var(--success-bg)' : 'var(--danger-bg)',
          padding: '0.3rem 0.75rem',
          borderRadius: 'var(--radius-full)',
          fontSize: '0.78rem',
          fontWeight: 600,
          color: isHealthy ? 'var(--success)' : 'var(--danger)',
          border: `1px solid ${isHealthy ? 'var(--success-border)' : 'var(--danger-border)'}`
        }}>
          <span style={{
            width: '7px',
            height: '7px',
            borderRadius: '50%',
            backgroundColor: isHealthy ? 'var(--success)' : 'var(--danger)',
            display: 'inline-block'
          }}></span>
          <Cpu size={13} />
          <span>{isHealthy ? 'XGBoost Active' : 'Model Offline'}</span>
        </div>

        {isAuthenticated ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <Link
              to="/profile"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: 'var(--bg-main)',
                padding: '0.35rem 0.8rem',
                borderRadius: 'var(--radius-full)',
                border: '1px solid var(--border)'
              }}
              title="View Profile"
            >
              <div style={{
                background: 'var(--primary)',
                color: '#FFFFFF',
                width: '26px',
                height: '26px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.78rem',
                fontWeight: 700
              }}>
                {user?.full_name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <span style={{
                fontSize: '0.85rem',
                fontWeight: 600,
                color: 'var(--primary)',
                maxWidth: '130px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}>
                {user?.full_name || 'User'}
              </span>
              {isAdmin && (
                <span className="badge badge-admin" style={{ padding: '0.15rem 0.45rem', fontSize: '0.68rem' }}>
                  Admin
                </span>
              )}
            </Link>

            <button
              onClick={handleLogout}
              className="btn btn-outline"
              style={{ padding: '0.4rem 0.8rem', fontSize: '0.82rem' }}
              title="Sign Out"
            >
              <LogOut size={14} />
              <span>Logout</span>
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Link to="/login" className="btn btn-outline" style={{ padding: '0.45rem 1rem', fontSize: '0.85rem' }}>
              Login
            </Link>
            <Link to="/register" className="btn btn-primary" style={{ padding: '0.45rem 1.1rem', fontSize: '0.85rem' }}>
              Register
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};
