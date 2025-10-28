import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authAPI } from '../api/auth';

const useAuthStore = create(
  persist(
    (set, get) => ({
      // State
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Actions
      login: async (credentials) => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await authAPI.login(credentials);
          
          if (response.success) {
            const { user, accessToken, refreshToken } = response.data;
            
            set({
              user,
              accessToken,
              refreshToken,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
            
            return { success: true, data: response.data };
          } else {
            set({
              isLoading: false,
              error: response.message || 'Login failed',
            });
            return { success: false, error: response.message };
          }
        } catch (error) {
          const errorMessage = error.response?.data?.message || 'Login failed';
          set({
            isLoading: false,
            error: errorMessage,
          });
          return { success: false, error: errorMessage };
        }
      },

      register: async (userData) => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await authAPI.register(userData);
          
          if (response.success) {
            set({ isLoading: false, error: null });
            return { success: true, data: response.data };
          } else {
            set({
              isLoading: false,
              error: response.message || 'Registration failed',
            });
            return { success: false, error: response.message };
          }
        } catch (error) {
          const errorMessage = error.response?.data?.message || 'Registration failed';
          set({
            isLoading: false,
            error: errorMessage,
          });
          return { success: false, error: errorMessage };
        }
      },

      logout: async () => {
        set({ isLoading: true });
        
        try {
          const { refreshToken } = get();
          if (refreshToken) {
            await authAPI.logout(refreshToken);
          }
        } catch (error) {
          console.error('Logout error:', error);
        } finally {
          // Clear state regardless of API call success
          set({
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
        }
      },

      refreshToken: async () => {
        const { refreshToken } = get();
        
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        try {
          const response = await authAPI.refreshToken(refreshToken);
          
          if (response.success) {
            const { accessToken } = response.data;
            set({ accessToken });
            return accessToken;
          } else {
            throw new Error('Token refresh failed');
          }
        } catch (error) {
          // If refresh fails, logout user
          get().logout();
          throw error;
        }
      },

      getProfile: async () => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await authAPI.getProfile();
          
          if (response.success) {
            set({
              user: response.data,
              isLoading: false,
              error: null,
            });
            return { success: true, data: response.data };
          } else {
            set({
              isLoading: false,
              error: response.message || 'Failed to get profile',
            });
            return { success: false, error: response.message };
          }
        } catch (error) {
          const errorMessage = error.response?.data?.message || 'Failed to get profile';
          set({
            isLoading: false,
            error: errorMessage,
          });
          return { success: false, error: errorMessage };
        }
      },

      changePassword: async (passwordData) => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await authAPI.changePassword(passwordData);
          
          if (response.success) {
            set({ isLoading: false, error: null });
            return { success: true, message: response.message };
          } else {
            set({
              isLoading: false,
              error: response.message || 'Password change failed',
            });
            return { success: false, error: response.message };
          }
        } catch (error) {
          const errorMessage = error.response?.data?.message || 'Password change failed';
          set({
            isLoading: false,
            error: errorMessage,
          });
          return { success: false, error: errorMessage };
        }
      },

      clearError: () => set({ error: null }),

      // Helper functions
      hasRole: (role) => {
        const { user } = get();
        return user?.role?.name === role;
      },

      hasAnyRole: (roles) => {
        const { user } = get();
        return roles.includes(user?.role?.name);
      },

      canAccess: (permission) => {
        const { user } = get();
        if (!user?.role?.permissions) return false;
        
        const permissions = user.role.permissions;
        return permissions[permission]?.includes('read') || 
               permissions[permission]?.includes('create') ||
               permissions[permission]?.includes('update') ||
               permissions[permission]?.includes('delete');
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useAuthStore;
