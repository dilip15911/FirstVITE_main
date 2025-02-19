import axios from 'axios';

// Add token to all requests
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle 401 responses
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('adminToken');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

export const isAuthenticated = () => {
  const token = localStorage.getItem('adminToken');
  return !!token;
};

export const logout = () => {
  localStorage.removeItem('adminToken');
  window.location.href = '/admin/login';
};
