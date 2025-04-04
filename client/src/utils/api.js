import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add a request interceptor to add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle network errors
    if (!error.response) {
      return Promise.reject({
        response: {
          data: {
            message: 'Network error. Please check your internet connection.'
          }
        }
      });
    }

    // Handle unauthorized errors (token expired or invalid)
    if (error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

// Auth endpoints
export const authEndpoints = {
  login: '/user/login',
  signup: '/user/signup',
  verifyEmail: '/user/verify-email',
  generateLoginOtp: '/user/generate-login-otp',
  verifyLoginOtp: '/user/verify-login-otp',
  generateLoginLink: '/user/generate-login-link',
  verifyLoginLink: '/user/verify-login-link',
  forgotPassword: '/user/forgot-password',
  resetPassword: '/user/reset-password',
  resendVerification: '/user/resend-verification'
};

// User endpoints
export const userEndpoints = {
  profile: '/user/profile',
  updateProfile: '/user/update-profile',
  changePassword: '/user/change-password'
};

export default api;
