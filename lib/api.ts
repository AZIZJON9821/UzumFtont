import axios from 'axios';

const api = axios.create({
  baseURL: 'https://uzumbec.onrender.com', // Backend URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - maybe redirect to login
      if (typeof window !== 'undefined') {
        // localStorage.removeItem('accessToken');
        // window.location.href = '/auth/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
