import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000',
});

api.interceptors.request.use(
  (config) => {

    const publicEndpoints = ['/courses/list/'];
    const isPublic = publicEndpoints.some((url) => config.url.includes(url));

    if (!isPublic) {
      const adminToken = localStorage.getItem('adminAccess');
      const userToken = localStorage.getItem('accessToken');
      const token = adminToken || userToken;

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export const fetchCourses = () => api.get('/courses/list/');

export default api;