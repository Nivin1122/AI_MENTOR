// utils/api.js
import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
  baseURL: 'http://localhost:8000'
});

// Request interceptor to add authorization header
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const adminToken = localStorage.getItem('adminAccess');
    
    // If token exists, add to headers
    if (adminToken) {
      config.headers.Authorization = `Bearer ${adminToken}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;