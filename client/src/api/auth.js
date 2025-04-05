import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Configure axios defaults
axios.defaults.baseURL = API_URL;

// Configure axios interceptors
export const setupAxiosInterceptors = (token) => {
// const setupAxiosInterceptors = (token) => {
  // Clear existing interceptors
  axios.interceptors.request.clear();
  axios.interceptors.response.clear();

  // Request interceptor
  axios.interceptors.request.use(
    (config) => {
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor
  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        clearToken();
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }
  );
};

// Token management
const getToken = () => localStorage.getItem('token');
const setToken = (token) => localStorage.setItem('token', token);
const clearToken = () => {
  localStorage.removeItem('token');
  // Clear axios interceptors
  axios.interceptors.request.clear();
  axios.interceptors.response.clear();
};

// Auth routes
export const login = async (email, password) => {
  try {
    const response = await axios.post('/auth/login', { email, password });
    if (response.data.token) {
      setToken(response.data.token);
      setupAxiosInterceptors(response.data.token);
    }
    return response.data;
  } catch (error) {
    clearToken();
    throw error.response?.data || { message: 'An error occurred during login' };
  }
};

export const signup = async (name, email, password) => {
  try {
    const response = await axios.post('/auth/signup', { name, email, password });
    return response.data;
  } catch (error) {
    clearToken();
    throw error.response?.data || { message: 'An error occurred during signup' };
  }
};

export const verifyEmail = async (userId, otp) => {
  try {
    const response = await axios.post(`/auth/verify-email/${userId}`, { otp });
    return response.data;
  } catch (error) {
    clearToken();
    throw error.response?.data || { message: 'Email verification failed' };
  }
};

export const resendVerification = async (userId) => {
  try {
    const response = await axios.post(`/auth/resend-verification/${userId}`);
    return response.data;
  } catch (error) {
    clearToken();
    throw error.response?.data || { message: 'Failed to resend verification' };
  }
};

export const getProfile = async () => {
  try {
    const response = await axios.get('/auth/profile');
    return response.data;
  } catch (error) {
    clearToken();
    throw error.response?.data || { message: 'Failed to get profile' };
  }
};

export const updateProfile = async (data) => {
  try {
    const response = await axios.put('/auth/profile', data);
    return response.data;
  } catch (error) {
    clearToken();
    throw error.response?.data || { message: 'Failed to update profile' };
  }
};

export const getUserHistory = async () => {
  try {
    const response = await axios.get('/auth/history');
    return response.data;
  } catch (error) {
    clearToken();
    throw error.response?.data || { message: 'Failed to get user history' };
  }
};

export const restoreProfile = async (historyId) => {
  try {
    const response = await axios.post(`/auth/restore/${historyId}`);
    return response.data;
  } catch (error) {
    clearToken();
    throw error.response?.data || { message: 'Failed to restore profile' };
  }
};

export default {
  login,
  signup,
  verifyEmail,
  resendVerification,
  getProfile,
  updateProfile,
  getUserHistory,
  restoreProfile,
  getToken,
  setToken,
  clearToken
};
