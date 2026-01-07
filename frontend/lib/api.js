import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Create axios instance
const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  signup: (data) => api.post('/auth/signup', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
  forgotPassword: (data) => api.post('/auth/forgot-password', data),
  resetPassword: (data) => api.post('/auth/reset-password', data),
};

// Jobs API
export const jobsAPI = {
  getJobs: (params) => api.get('/jobs', { params }),
  getJobById: (id) => api.get(`/jobs/${id}`),
  applyToJob: (id) => api.post(`/jobs/${id}/apply`),
  bookmarkJob: (id) => api.post(`/jobs/${id}/bookmark`),
  markNotInterested: (id) => api.post(`/jobs/${id}/not-interested`),
  getBookmarkedJobs: () => api.get('/jobs/bookmarked/list'),
  getAppliedJobs: () => api.get('/jobs/applied/list'),
  getNotInterestedJobs: () => api.get('/jobs/not-interested/list'),
};

// Users API
export const usersAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
  uploadResume: (formData) => api.post('/users/resume', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  getResumes: () => api.get('/users/resume'),
  deleteResume: (id) => api.delete(`/users/resume/${id}`),
  downloadResume: (id) => api.get(`/users/resume/${id}/download`, {
    responseType: 'blob',
  }),
};

// Admin API
export const adminAPI = {
  getAllJobs: (params) => api.get('/admin/jobs', { params }),
  getJobById: (id) => api.get(`/admin/jobs/${id}`),
  createJob: (data) => api.post('/admin/jobs', data),
  updateJob: (id, data) => api.put(`/admin/jobs/${id}`, data),
  deleteJob: (id) => api.delete(`/admin/jobs/${id}`),
};

export default api;
