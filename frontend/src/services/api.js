import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
});

// Attach JWT token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('loansetu_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 globally
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401 && localStorage.getItem('loansetu_token')) {
      localStorage.removeItem('loansetu_token');
      localStorage.removeItem('loansetu_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ── Auth ──────────────────────────────────────────────
export const authService = {
  register: async (fullName, email, password, phone = null) => {
    const r = await api.post('/api/auth/register', {
      full_name: fullName, email, password, phone,
    });
    return r.data;
  },
  login: async (email, password) => {
    const r = await api.post('/api/auth/login', { email, password });
    return r.data;
  },
  me: async () => {
    const r = await api.get('/api/auth/me');
    return r.data;
  },
  updateProfile: async (fullName, phone = null) => {
    const r = await api.put('/api/auth/profile', {
      full_name: fullName, phone,
    });
    return r.data;
  },
  changePassword: async (currentPassword, newPassword) => {
    const r = await api.put('/api/auth/change-password', {
      current_password: currentPassword,
      new_password: newPassword,
    });
    return r.data;
  },
};

// ── Predictions ───────────────────────────────────────
export const predictionService = {
  predict: async (formData) => {
    const r = await api.post('/api/predictions/predict', formData);
    return r.data;
  },
};

// ── Applications ──────────────────────────────────────
export const applicationService = {
  getAll: async ({ limit = 50, offset = 0, prediction = '' } = {}) => {
    const params = new URLSearchParams({ limit, offset });
    if (prediction) params.append('prediction', prediction);
    const r = await api.get(`/api/applications?${params}`);
    return r.data;
  },
  getById: async (id) => {
    const r = await api.get(`/api/applications/${id}`);
    return r.data;
  },
  delete: async (id) => {
    await api.delete(`/api/applications/${id}`);
  },
};

// ── Dashboard ─────────────────────────────────────────
export const dashboardService = {
  summary: async () => {
    const r = await api.get('/api/dashboard/summary');
    return r.data;
  },
  recent: async () => {
    const r = await api.get('/api/dashboard/recent');
    return r.data;
  },
};

// ── Admin ─────────────────────────────────────────────
export const adminService = {
  stats: async () => {
    const r = await api.get('/api/admin/stats');
    return r.data;
  },
  applications: async ({ limit = 50, offset = 0, prediction = '', search = '' } = {}) => {
    const params = new URLSearchParams({ limit, offset });
    if (prediction) params.append('prediction', prediction);
    if (search) params.append('search', search);
    const r = await api.get(`/api/admin/applications?${params}`);
    return r.data;
  },
  users: async ({ limit = 50, offset = 0 } = {}) => {
    const params = new URLSearchParams({ limit, offset });
    const r = await api.get(`/api/admin/users?${params}`);
    return r.data;
  },
};

// ── Health ────────────────────────────────────────────
export const systemService = {
  health: async () => {
    const r = await api.get('/api/health');
    return r.data;
  },
};

export default api;
