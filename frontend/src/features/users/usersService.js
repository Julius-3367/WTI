import api from '../../api/axios';

/**
 * Users service for API calls
 */
export const usersService = {
  /**
   * Fetch all users with pagination
   * @param {Object} params - { page, limit, search, role }
   * @returns {Promise<Object>} - { users, pagination }
   */
  async getUsers(params = {}) {
    const response = await api.get('/users', { params });
    return response.data;
  },

  /**
   * Get user by ID
   * @param {string|number} id - User ID
   * @returns {Promise<Object>} - User data
   */
  async getUserById(id) {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  /**
   * Create new user
   * @param {Object} userData - User data
   * @returns {Promise<Object>} - Created user
   */
  async createUser(userData) {
    const response = await api.post('/users', userData);
    return response.data;
  },

  /**
   * Update user
   * @param {string|number} id - User ID
   * @param {Object} userData - Updated user data
   * @returns {Promise<Object>} - Updated user
   */
  async updateUser(id, userData) {
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
  },

  /**
   * Delete user
   * @param {string|number} id - User ID
   * @returns {Promise<void>}
   */
  async deleteUser(id) {
    await api.delete(`/users/${id}`);
  },
};
