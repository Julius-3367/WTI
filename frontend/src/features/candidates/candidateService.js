import api from '../../api/axios';

/**
 * Candidates service for API calls
 */
export const candidateService = {
  /**
   * Fetch all candidates with pagination and filters
   * @param {Object} params - { page, limit, search, status, role }
   * @returns {Promise<Object>} - { candidates, pagination }
   */
  async getCandidates(params = {}) {
    const response = await api.get('/candidates', { params });
    return response.data;
  },

  /**
   * Get candidate by ID
   * @param {string|number} id - Candidate ID
   * @returns {Promise<Object>} - Candidate data
   */
  async getCandidateById(id) {
    const response = await api.get(`/candidates/${id}`);
    return response.data;
  },

  /**
   * Create new candidate
   * @param {Object} candidateData - Candidate data
   * @returns {Promise<Object>} - Created candidate
   */
  async createCandidate(candidateData) {
    const response = await api.post('/candidates', candidateData);
    return response.data;
  },

  /**
   * Update candidate
   * @param {string|number} id - Candidate ID
   * @param {Object} candidateData - Updated candidate data
   * @returns {Promise<Object>} - Updated candidate
   */
  async updateCandidate(id, candidateData) {
    const response = await api.put(`/candidates/${id}`, candidateData);
    return response.data;
  },

  /**
   * Delete candidate
   * @param {string|number} id - Candidate ID
   * @returns {Promise<void>}
   */
  async deleteCandidate(id) {
    await api.delete(`/candidates/${id}`);
  },

  /**
   * Upload document for candidate
   * @param {string|number} id - Candidate ID
   * @param {FormData} formData - Document file
   * @returns {Promise<Object>} - Upload response
   */
  async uploadDocument(id, formData) {
    const response = await api.post(`/candidates/${id}/docs`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  /**
   * Download candidate document
   * @param {string|number} candidateId - Candidate ID
   * @param {string|number} docId - Document ID
   * @returns {Promise<Blob>} - Document file
   */
  async downloadDocument(candidateId, docId) {
    const response = await api.get(`/candidates/${candidateId}/documents/${docId}`, {
      responseType: 'blob',
    });
    return response.data;
  },
};
