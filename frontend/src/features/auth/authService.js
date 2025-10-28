import api from '../../api/axios';
import { demoAuthService } from './demoAuthService';

const isDemoMode = import.meta.env.VITE_DEMO_MODE === 'true';

// Helper to unwrap API payloads consistently
const unwrap = (res) => res?.data?.data ?? res?.data ?? res;

export const authService = {
  // Login user and normalize payload
  async login(credentials) {
    if (isDemoMode) return demoAuthService.login(credentials);
    try {
      const res = await api.post('/auth/login', credentials);
      const data = unwrap(res);
      return {
        user: data.user ?? data,
        accessToken: data.accessToken ?? null,
        refreshToken: data.refreshToken ?? null,
      };
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
      throw error;
    }
  },

  // Register user and normalize payload
  async register(userData) {
    if (isDemoMode) return demoAuthService.register(userData);
    const res = await api.post('/auth/register', {
      ...userData,
      role: userData.role || userData.userType || 'candidate',
    });
    const data = unwrap(res);
    return {
      user: data.user ?? data ?? null,
      accessToken: data.accessToken ?? null,
      refreshToken: data.refreshToken ?? null,
    };
  },

  // Refresh token and normalize
  async refreshToken(refreshToken) {
    if (isDemoMode) return demoAuthService.refreshToken(refreshToken);
    const res = await api.post('/auth/refresh', { refreshToken });
    const data = unwrap(res);
    return { accessToken: data.accessToken ?? null, refreshToken: data.refreshToken ?? null };
  },

  // Logout
  async logout() {
    if (isDemoMode) return demoAuthService.logout();
    await api.post('/auth/logout');
  },

  // Get profile and return just the user object
  async getProfile() {
    if (isDemoMode) return demoAuthService.getProfile();
    const res = await api.get('/auth/me');
    const data = unwrap(res);
    return data;
  },
};
