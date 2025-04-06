import axios from 'axios';

// Force using port 5000 regardless of environment variables
const BASE_URL = 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Accept': 'application/json'
  }
});

// Add a request interceptor to add token to requests
api.interceptors.request.use(
  async (config) => {
    console.log('Request config:', {
      url: config.url,
      method: config.method,
      headers: config.headers
    });

    // Add token to request headers
    const token = localStorage.getItem('token');
    if (token) {
      // Ensure token has Bearer prefix
      const formattedToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
      console.log('Using token for request:', formattedToken.substring(0, 20) + '...');
      config.headers.Authorization = formattedToken;
    } else {
      console.log('No token found for request:', config.url);
    }

    // Set content type based on request type
    if (config.method === 'post' || config.method === 'put') {
      // Only set content type if it's not already set
      if (!config.headers['Content-Type']) {
        config.headers['Content-Type'] = config.data instanceof FormData ? 'multipart/form-data' : 'application/json';
      }
    }

    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    console.log('Response received:', {
      status: response.status,
      data: response.data
    });
    return response;
  },
  async (error) => {
    console.error('Response error:', {
      status: error.response?.status,
      data: error.response?.data,
      config: error.config
    });

    if (!error.response) {
      return Promise.reject({
        response: {
          data: {
            success: false,
            message: 'Network error. Please check your internet connection.'
          }
        }
      });
    }

    // Handle unauthorized errors
    if (error.response.status === 401) {
      console.log('401 Unauthorized error detected');
      
      // Clear token and user data
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Redirect to login page
      window.location.href = '/login';
      
      return Promise.reject({
        response: {
          data: {
            success: false,
            message: 'Session expired. Please log in again.'
          }
        }
      });
    }

    // Handle other errors
    return Promise.reject({
      response: {
        data: {
          success: false,
          message: error.response.data?.message || 'An error occurred. Please try again.'
        }
      }
    });
  }
);

// Add course-related methods
api.createCourse = async (courseData) => {
  try {
    console.log('Creating course with data:', {
      title: courseData.get('title'),
      category_id: courseData.get('category_id'),
      description: courseData.get('description'),
      hasThumbnail: courseData.get('thumbnail') ? 'Yes' : 'No'
    });

    // Send request to the correct endpoint
    const response = await api.post('/courses/instructor', courseData);

    console.log('Course creation response:', {
      success: response.data.success,
      message: response.data.message,
      data: response.data.data
    });

    return response.data;
  } catch (error) {
    console.error('Course creation error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      config: error.config
    });
    throw error;
  }
};

api.updateCourse = async (id, courseData) => {
  try {
    const response = await api.put(`/courses/admin/${id}`, courseData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Course update error:', error);
    throw error;
  }
};

api.getCourse = async (id) => {
  try {
    const response = await api.get(`/courses/${id}`);
    return response.data;
  } catch (error) {
    console.error('Get course error:', error);
    throw error;
  }
};

api.getCourses = async (params = {}) => {
  try {
    const response = await api.get('/courses', { params });
    return response.data;
  } catch (error) {
    console.error('Get courses error:', error);
    throw error;
  }
};

// Auth API functions
const auth = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  signup: async (userData) => {
    const response = await api.post('/auth/signup', userData);
    return response.data;
  },

  verifyEmail: async (userId, otp) => {
    const response = await api.post('/auth/verify-email', { userId, otp });
    return response.data;
  },

  resendOtp: async (userId) => {
    const response = await api.post('/auth/resend-otp', { userId });
    return response.data;
  },

  updateProfile: async (profileData) => {
    const response = await api.put('/auth/profile', profileData);
    return response.data;
  },

  adminLogin: async (username, password) => {
    console.log('Calling admin login with:', { username });
    const response = await api.post('/auth/admin/login', { username, password });
    console.log('Admin login response:', response.data);
    return response.data;
  }
};

// Export both the api instance and auth functions
export { api, auth };

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
