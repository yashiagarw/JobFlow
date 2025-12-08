// API Configuration
// This file centralizes all backend API URLs
// Use environment variables for different environments (local, production)

// In production (Vercel), use the environment variable or fallback to deployed backend URL
// In development, use localhost
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 
  (import.meta.env.PROD ? 'https://job-flow-backend-nine.vercel.app' : 'http://localhost:3000');

export const API_ENDPOINTS = {
  // User endpoints
  REGISTER: `${API_BASE_URL}/api/v1/users/register`,
  LOGIN: `${API_BASE_URL}/api/v1/users/login`,
  GET_USER: `${API_BASE_URL}/api/v1/users/getuser`,
  LOGOUT: `${API_BASE_URL}/api/v1/users/logout`,
  UPDATE_PROFILE: `${API_BASE_URL}/api/v1/users/update/profile`,
  UPDATE_PASSWORD: `${API_BASE_URL}/api/v1/users/update/password`,

  // Job endpoints
  GET_ALL_JOBS: `${API_BASE_URL}/api/v1/job/getall`,
  GET_SINGLE_JOB: (jobId) => `${API_BASE_URL}/api/v1/job/get/${jobId}`,
  POST_JOB: `${API_BASE_URL}/api/v1/job/post`,
  GET_MY_JOBS: `${API_BASE_URL}/api/v1/job/getmyjobs`,
  DELETE_JOB: (id) => `${API_BASE_URL}/api/v1/job/delete/${id}`,

  // Application endpoints
  GET_EMPLOYER_APPLICATIONS: `${API_BASE_URL}/api/v1/application/employer/getall`,
  GET_JOBSEEKER_APPLICATIONS: `${API_BASE_URL}/api/v1/application/jobseeker/getall`,
  POST_APPLICATION: (jobId) => `${API_BASE_URL}/api/v1/application/post/${jobId}`,
  DELETE_APPLICATION: (id) => `${API_BASE_URL}/api/v1/application/delete/${id}`,
};

export default API_BASE_URL;

