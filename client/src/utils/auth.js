import axios from 'axios';
import { api } from './api';

// Token management
export const getToken = () => {
  return localStorage.getItem('token');
};

export const setToken = (token) => {
  localStorage.setItem('token', token);
};

export const clearToken = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('userData');
  localStorage.removeItem('adminData');
};

// Add token to all requests
axios.interceptors.request.use(
  (config) => {
    const token = getToken();
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
      clearToken();
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
export const login = async (email, password) => {
  try {
    console.log('Attempting login with:', { email });
    const response = await api.post('/api/auth/login', { email, password });
    console.log('Login response:', response.data);
    
    if (response.data.success) {
      // Store token
      setToken(response.data.token);
      return response.data;
    }
    return { success: false, message: response.data.message };
  } catch (error) {
    console.error('Login error:', error);
    console.error('Error details:', error.response?.data);
    clearToken();
    return { success: false, message: error.response?.data?.message || 'Login failed' };
  }
};

export const adminLogin = async (username, password) => {
  try {
    console.log('Attempting admin login with:', { username });
    const response = await api.post('/api/auth/admin/login', { username, password });
    console.log('Admin login response:', response.data);
    
    if (response.data.success) {
      // Store token
      setToken(response.data.token);
      return response.data;
    }
    return { success: false, message: response.data.message };
  } catch (error) {
    console.error('Admin login error:', error);
    console.error('Error details:', error.response?.data);
    clearToken();
    return { success: false, message: error.response?.data?.message || 'Admin login failed' };
  }
};

export const getProfile = async () => {
  try {
    const response = await api.get('/api/auth/profile');
    return response.data;
  } catch (error) {
    console.error('Profile error:', error);
    return { success: false, message: error.response?.data?.message || 'Failed to get profile' };
  }
};

export const logout = () => {
  clearToken();
};

export const isAuthenticated = () => {
  const token = getToken();
  return !!token;
};
