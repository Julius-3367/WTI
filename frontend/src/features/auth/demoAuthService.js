/**
 * Demo authentication service for testing without backend
 */
import { demoUsers } from '../../seed/demoData';

export const demoAuthService = {
  /**
   * Demo login - validates against demo users
   */
  async login(credentials) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const user = demoUsers.find(u => 
      u.email === credentials.email && u.password === credentials.password
    );
    
    if (!user) {
      throw new Error('Invalid credentials');
    }
    
    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
      accessToken: `demo-access-token-${user.id}`,
      refreshToken: `demo-refresh-token-${user.id}`,
    };
  },

  /**
   * Demo register - creates new user in demo data
   */
  async register(userData) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if email already exists
    const existingUser = demoUsers.find(u => u.email === userData.email);
    if (existingUser) {
      throw new Error('Email already registered');
    }
    
    // Create new user
    const newUser = {
      id: Math.max(...demoUsers.map(u => u.id)) + 1,
      email: userData.email,
      password: userData.password,
      firstName: userData.firstName,
      lastName: userData.lastName,
      role: userData.role || 'candidate',
      isActive: true,
      createdAt: new Date().toISOString(),
    };
    
    // Add to demo users array
    demoUsers.push(newUser);
    
    return {
      user: {
        id: newUser.id,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        role: newUser.role,
      },
      accessToken: `demo-access-token-${newUser.id}`,
      refreshToken: `demo-refresh-token-${newUser.id}`,
    };
  },

  /**
   * Demo refresh token
   */
  async refreshToken(refreshToken) {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      accessToken: `demo-access-token-${Date.now()}`,
      refreshToken: `demo-refresh-token-${Date.now()}`,
    };
  },

  /**
   * Demo logout
   */
  async logout() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return { message: 'Logged out successfully' };
  },

  /**
   * Demo get profile
   */
  async getProfile() {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Return a demo user profile
    return {
      id: 1,
      email: 'admin@umsl.edu',
      firstName: 'John',
      lastName: 'Admin',
      role: 'admin',
    };
  },
};
