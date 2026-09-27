import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import {
  Sparkles,
  LayoutDashboard,
  FileSpreadsheet,
  User,
  ShieldAlert,
  HelpCircle,
  Cpu,
  LogOut,
  Landmark,
  Home
} from 'lucide-react';

export const Sidebar = ({ isOpen, closeSidebar }) => {
  const { user, isAdmin, logout } = useAuth();

  const userNavItems = [
    {
      to: '/dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard size={18} />
    },
    {
      to: '/predict',
      label: 'New Prediction',
      icon: <Sparkles size={18} />,
      badge: 'ML'
    },
    {
      to: '/history',
      label: 'Application History',
      icon: <FileSpreadsheet size={18} />
    },
    {
      to: '/profile',
      label: 'Profile & Security',
      icon: <User size={18} />
    },
    {
      to: '/how-it-works',
      label: 'How It Works',
      icon: <HelpCircle size={18} />
    }
  ];

  const adminNavItems = [
    {
      to: '/admin',
      label: 'Admin Workspace',
      icon: <ShieldAlert size={18} />,
      badge: 'Admin'
    },
    {
      to: '/predict',
      label: 'New Prediction',
      icon: <Sparkles size={18} />
    },
    {
      to: '/dashboard',
      label: 'User Dashboard',
      icon: <LayoutDashboard size={18} />
    },
    {
      to: '/history',
      label: 'Application History',
      icon: <FileSpreadsheet size={18} />
    },
    {
      to: '/profile',
      label: 'Profile',
      icon: <User size={18} />
    }
  ];

  const items = isAdmin ? adminNavItems : userNavItems;

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={closeSidebar}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(23, 32, 51, 0.4)',
            zIndex: 45,
            display: 'block'
          }}
        />
      )}

      <aside
        style={{
          width: '250px',
          background: '#FFFFFF',
          borderRight: '1px solid var(--border)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          zIndex: 50,
          position: isOpen ? 'fixed' : 'relative',
          top: 0,
          bottom: 0,
          left: 0,
          height: '100vh',
          transform: isOpen ? 'translateX(0)' : undefined,
          transition: 'transform 0.25s ease',
          boxShadow: 'var(--shadow-sm)'
        }}
      >
        <div style={{ padding: '1.5rem 1.2rem' }}>
          {/* Brand header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            paddingBottom: '1.2rem',
            marginBottom: '1.2rem',
            borderBottom: '1px solid var(--border)'
          }}>
            <div style={{
              background: 'var(--primary)',
              color: '#FFFFFF',
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '0.9rem'
            }}>
              <Landmark size={18} />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--primary)' }}>LoanSetu AI</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                {isAdmin ? 'Admin Console' : 'Fintech Underwriting'}
              </div>
            </div>
          </div>

          <div style={{
            fontSize: '0.72rem',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            color: 'var(--text-muted)',
            fontWeight: 700,
            marginBottom: '0.6rem',
            paddingLeft: '0.5rem'
          }}>
            {isAdmin ? 'ADMIN NAVIGATION' : 'MAIN MENU'}
          </div>

          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            {items.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={closeSidebar}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.65rem 0.85rem',
                  borderRadius: 'var(--radius-md)',
                  color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                  background: isActive ? 'var(--primary-subtle)' : 'transparent',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: '0.88rem',
                  transition: 'all 0.15s ease',
                  textDecoration: 'none',
                  borderLeft: isActive ? '3px solid var(--secondary)' : '3px solid transparent'
                })}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span style={{
                    fontSize: '0.65rem',
                    background: item.badge === 'Admin' ? '#F3E8FF' : 'var(--secondary)',
                    color: item.badge === 'Admin' ? '#7E22CE' : '#FFFFFF',
                    padding: '0.1rem 0.45rem',
                    borderRadius: 'var(--radius-full)',
                    fontWeight: 700
                  }}>
                    {item.badge}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Model Spec Footer Card */}
        <div style={{
          padding: '1rem',
          margin: '1rem',
          background: 'var(--bg-main)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.4rem' }}>
            <Cpu size={15} color="var(--primary)" />
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary)' }}>Engine Spec</span>
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
            XGBoost Classifier (27 features)<br />
            StandardScaler normalized
          </div>
          <div style={{ marginTop: '0.6rem', paddingTop: '0.5rem', borderTop: '1px solid var(--border)', fontSize: '0.7rem', color: 'var(--text-light)' }}>
            LoanSetu AI &middot; v2.0.0
          </div>
        </div>
      </aside>
    </>
  );
};
