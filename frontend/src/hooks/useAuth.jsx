import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const s = localStorage.getItem('loansetu_user');
      return s ? JSON.parse(s) : null;
    } catch { return null; }
  });
  const [token, setToken]   = useState(() => localStorage.getItem('loansetu_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      if (localStorage.getItem('loansetu_token')) {
        try {
          const profile = await authService.me();
          setUser(profile);
          localStorage.setItem('loansetu_user', JSON.stringify(profile));
        } catch {
          logout();
        }
      }
      setLoading(false);
    };
    init();
  }, []);

  const _persist = (data) => {
    setToken(data.access_token);
    setUser(data.user);
    localStorage.setItem('loansetu_token', data.access_token);
    localStorage.setItem('loansetu_user', JSON.stringify(data.user));
  };

  const login = async (email, password) => {
    const data = await authService.login(email, password);
    _persist(data);
    return data;
  };

  const register = async (fullName, email, password, phone) => {
    const data = await authService.register(fullName, email, password, phone);
    _persist(data);
    return data;
  };

  const updateUser = (updatedUserData) => {
    setUser(updatedUserData);
    localStorage.setItem('loansetu_user', JSON.stringify(updatedUserData));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('loansetu_token');
    localStorage.removeItem('loansetu_user');
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      isAuthenticated: !!token && !!user, 
      isAdmin, 
      loading, 
      login, 
      register, 
      logout,
      updateUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
};

