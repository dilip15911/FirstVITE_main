import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Configure axios defaults
axios.defaults.baseURL = API_URL;

// Configure axios interceptors
export const setupAxiosInterceptors = (token) => {
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
        console.log('401 Unauthorized error detected');
        
        // Check if we're in admin section
        const isAdminSection = window.location.pathname.includes('/admin');
        
        // For admin routes, let the component handle the error
        if (isAdminSection) {
          return Promise.reject({
            ...error,
            isFormError: true
          });
        }
        
        // For other routes, handle as usual
        clearToken();
        // Instead of immediate redirect, let the component handle it
        return Promise.reject({
          ...error,
          shouldRedirect: true
        });
      }
      return Promise.reject(error);
    }
  );
};

// Token management
export const getToken = () => {
  const token = localStorage.getItem('token');
  return token || sessionStorage.getItem('token');
};

export const setToken = (token) => {
  if (token) {
    localStorage.setItem('token', token);
    sessionStorage.setItem('token', token);
  }
};

export const clearToken = () => {
  localStorage.removeItem('token');
  sessionStorage.removeItem('token');
  // Clear axios interceptors
  axios.interceptors.request.clear();
  axios.interceptors.response.clear();
};

// Auth routes
export const login = async (email, password) => {
  try {
    const response = await axios.post('/auth/login', { email, password });
    if (response.data.success) {
      // Store token in both local and session storage
      setToken(response.data.token);
      setupAxiosInterceptors(response.data.token);
      
      // Store user data in session
      sessionStorage.setItem('userData', JSON.stringify(response.data.user));
      
      return response.data;
    }
    return { success: false, message: response.data.message };
  } catch (error) {
    console.error('Login error:', error);
    const errorMessage = error.response?.data?.message || 
      error.message || 
      'Login failed. Please try again.';
    return { success: false, message: errorMessage };
  }
};

export const adminLogin = async (username, password) => {
  try {
    const response = await axios.post('/auth/admin/login', { username, password });
    if (response.data.success) {
      // Store admin token in localStorage
      setToken(response.data.token);
      setupAxiosInterceptors(response.data.token);
      
      // Store admin data in localStorage
      localStorage.setItem('adminData', JSON.stringify(response.data.admin));
      
      // Set isAdmin flag
      localStorage.setItem('isAdmin', 'true');
      
      // Ensure admin has the correct role
      if (response.data.admin && !response.data.admin.role) {
        response.data.admin.role = 'admin';
        localStorage.setItem('adminData', JSON.stringify(response.data.admin));
      }
      
      return response.data;
    }
    return { success: false, message: response.data.message };
  } catch (error) {
    console.error('Admin login error:', error);
    const errorMessage = error.response?.data?.message || 
      error.message || 
      'Admin login failed. Please try again.';
    return { success: false, message: errorMessage };
  }
};

export const verifyEmail = async (userId, otp) => {
  try {
    const response = await axios.post(`/auth/verify-email/${userId}`, { otp });
    return response.data;
  } catch (error) {
    console.error('Email verification error:', error);
    return { success: false, message: error.response?.data?.message || 'Email verification failed' };
  }
};

export const resendVerification = async (userId) => {
  try {
    const response = await axios.post(`/auth/resend-verification/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Resend verification error:', error);
    return { success: false, message: error.response?.data?.message || 'Failed to resend verification' };
  }
};

export const getProfile = async () => {
  try {
    const response = await axios.get('/auth/profile');
    return response.data;
  } catch (error) {
    console.error('Profile error:', error);
    return { success: false, message: error.response?.data?.message || 'Failed to load profile' };
  }
};

export const updateProfile = async (data) => {
  try {
    const response = await axios.put('/auth/profile', data);
    return response.data;
  } catch (error) {
    console.error('Update profile error:', error);
    return { success: false, message: error.response?.data?.message || 'Failed to update profile' };
  }
};

export const getUserHistory = async () => {
  try {
    const response = await axios.get('/auth/history');
    return response.data;
  } catch (error) {
    console.error('User history error:', error);
    return { success: false, message: error.response?.data?.message || 'Failed to get user history' };
  }
};

export const restoreProfile = async (historyId) => {
  try {
    const response = await axios.post(`/auth/restore/${historyId}`);
    return response.data;
  } catch (error) {
    console.error('Restore profile error:', error);
    return { success: false, message: error.response?.data?.message || 'Failed to restore profile' };
  }
};

const authService = {
  login,
  adminLogin,
  verifyEmail,
  resendVerification,
  getProfile,
  updateProfile,
  getUserHistory,
  restoreProfile,
  setupAxiosInterceptors,
  getToken,
  setToken,
  clearToken
};

export { authService };
