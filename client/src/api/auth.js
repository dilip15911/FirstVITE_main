import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Configure axios defaults
axios.defaults.baseURL = API_URL;

// Configure axios interceptors
const setupAxiosInterceptors = (token) => {
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
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }
  );
};

// Auth routes
const login = async (email, password) => {
  try {
    const response = await axios.post('/auth/login', { email, password });
    if (response.data.token) {
      setupAxiosInterceptors(response.data.token);
    }
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'An error occurred during login' };
  }
};

const signup = async (name, email, password) => {
  try {
    const response = await axios.post('/auth/signup', { name, email, password });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'An error occurred during signup' };
  }
};

const verifyEmail = async (userId, otp) => {
  try {
    const response = await axios.post('/auth/verify', { userId, otp });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'An error occurred during verification' };
  }
};

const resendVerification = async (userId) => {
  try {
    const response = await axios.post('/auth/resend-otp', { userId });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to resend verification code' };
  }
};

const getProfile = async () => {
  try {
    const response = await axios.get('/auth/profile');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch profile' };
  }
};

const updateProfile = async (data) => {
  try {
    const response = await axios.put('/auth/profile', data);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to update profile' };
  }
};

const getUserHistory = async () => {
  try {
    const response = await axios.get('/auth/history');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch history' };
  }
};

const restoreProfile = async (historyId) => {
  try {
    const response = await axios.post(`/auth/history/${historyId}/restore`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to restore profile' };
  }
};

export {
  login,
  signup,
  verifyEmail,
  resendVerification,
  getProfile,
  updateProfile,
  getUserHistory,
  restoreProfile,
  setupAxiosInterceptors
};
