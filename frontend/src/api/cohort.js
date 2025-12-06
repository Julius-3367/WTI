import axios from './axios';

const API_URL = '/cohorts';

export const cohortService = {
  // Cohort CRUD
  getCohorts: (params) => axios.get(API_URL, { params }),
  getCohortById: (id) => axios.get(`${API_URL}/${id}`),
  createCohort: (data) => axios.post(API_URL, data),
  updateCohort: (id, data) => axios.put(`${API_URL}/${id}`, data),
  deleteCohort: (id) => axios.delete(`${API_URL}/${id}`),

  // Cohort Status Management
  publishCohort: (id) => axios.post(`${API_URL}/${id}/publish`),
  openEnrollment: (id) => axios.post(`${API_URL}/${id}/open-enrollment`),
  closeEnrollment: (id) => axios.post(`${API_URL}/${id}/close-enrollment`),
  archiveCohort: (id) => axios.post(`${API_URL}/${id}/archive`),

  // Enrollment Management
  enrollStudent: (id, data) => axios.post(`${API_URL}/${id}/enroll`, data),
  updateEnrollmentStatus: (cohortId, enrollmentId, data) => 
    axios.put(`${API_URL}/${cohortId}/enrollments/${enrollmentId}`, data),
  getCohortEnrollments: (id) => axios.get(`${API_URL}/${id}/enrollments`),

  // Progress & Metrics
  getCohortProgress: (id) => axios.get(`${API_URL}/${id}/progress`),
  updateCohortMetrics: (id) => axios.post(`${API_URL}/${id}/update-metrics`),
  generateProgressSummary: (id) => axios.post(`${API_URL}/${id}/generate-summary`),

  // Session Management
  createSession: (id, data) => axios.post(`${API_URL}/${id}/sessions`, data),
  updateSession: (cohortId, sessionId, data) => 
    axios.put(`${API_URL}/${cohortId}/sessions/${sessionId}`, data),
  getCohortSessions: (id, params) => axios.get(`${API_URL}/${id}/sessions`, { params }),

  // Export
  exportCohortData: (id) => axios.get(`${API_URL}/${id}/export`, {
    responseType: 'blob',
  }),
};

export default cohortService;
