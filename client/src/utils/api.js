import axios from 'axios';

// Force using port 5000 regardless of environment variables
const BASE_URL = 'http://localhost:5000';

// Create axios instance with default config
const api = axios.create({
  baseURL: 'http://localhost:5000',
  headers: {
    'Accept': 'application/json'
  }
});

// Add request interceptor to include token in all requests
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Add a request interceptor to add token to requests
api.interceptors.request.use(
  async (config) => {
    try {
      // Get token from localStorage
      const token = localStorage.getItem('token');
      
      if (token) {
        // Ensure token has Bearer prefix
        const formattedToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
        config.headers.Authorization = formattedToken;
      }

      // Add content type based on request type
      if (config.method === 'post' || config.method === 'put') {
        // Only set content type if it's not already set
        if (!config.headers['Content-Type']) {
          config.headers['Content-Type'] = config.data instanceof FormData ? 'multipart/form-data' : 'application/json';
        }
      }

      // Log request details for debugging
      console.log('API Request:', {
        method: config.method,
        url: config.url,
        headers: {
          ...config.headers,
          Authorization: config.headers.Authorization ? 'Bearer ***' : undefined
        }
      });

      return config;
    } catch (error) {
      console.error('Request interceptor error:', error);
      throw error;
    }
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', {
      status: response.status,
      url: response.config.url
    });
    return response;
  },
  async (error) => {
    console.error('Response error:', {
      status: error.response?.status,
      url: error.config.url,
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

    const { status, data } = error.response;
    
    // Handle unauthorized errors
    if (status === 401) {
      console.log('401 Unauthorized error detected');
      
      // Clear token and user data
      localStorage.removeItem('token');
      localStorage.removeItem('userData');
      localStorage.removeItem('adminData');
      
      // Determine if we're in admin section
      const isAdminSection = window.location.pathname.includes('/admin');
      
      // Redirect to appropriate login page
      window.location.href = isAdminSection ? '/admin/login' : '/login';
      
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
          message: data?.message || 'An error occurred. Please try again.'
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

    // Check if we're in admin section
    const isAdminSection = window.location.pathname.includes('/admin');
    
    // Send request to the appropriate endpoint
    const endpoint = isAdminSection 
      ? '/api/courses/admin'  // Full path for admin
      : '/api/courses/instructor';  // Full path for instructor

    console.log('Sending request to:', endpoint);
    
    // Get token and add to headers
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found. Please log in again.');
    }
    
    // Log headers for debugging
    console.log('Request headers:', {
      Authorization: token.startsWith('Bearer ') ? token : `Bearer ${token}`
    });
    
    // Make the API request with explicit headers
    const response = await axios.post(`http://localhost:5000${endpoint}`, courseData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': token.startsWith('Bearer ') ? token : `Bearer ${token}`
      }
    });

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
    const response = await api.put(`/api/courses/admin/${id}`, courseData, {
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
    const response = await api.get(`/api/courses/${id}`);
    return response.data;
  } catch (error) {
    console.error('Get course error:', error);
    throw error;
  }
};

api.getCourses = async (params = {}) => {
  try {
    const response = await api.get('/api/courses', { params });
    return response.data;
  } catch (error) {
    console.error('Get courses error:', error);
    throw error;
  }
};

// Add user-related methods
api.getUsers = async (params = {}) => {
  try {
    const response = await api.get('/api/users', { params });
    return response.data;
  } catch (error) {
    console.error('Get users error:', error);
    throw error;
  }
};

api.searchUsers = async (searchTerm) => {
  try {
    const response = await api.get(`/api/users?search=${encodeURIComponent(searchTerm)}`);
    return response.data;
  } catch (error) {
    console.error('Search users error:', error);
    throw error;
  }
};

// Auth API functions
const auth = {
  login: async (email, password) => {
    const response = await api.post('/api/auth/login', { email, password });
    return response.data;
  },

  signup: async (userData) => {
    const response = await api.post('/api/auth/signup', userData);
    return response.data;
  },

  verifyEmail: async (userId, otp) => {
    const response = await api.post('/api/auth/verify-email', { userId, otp });
    return response.data;
  },

  resendOtp: async (userId) => {
    const response = await api.post('/api/auth/resend-otp', { userId });
    return response.data;
  },

  updateProfile: async (profileData) => {
    const response = await api.put('/api/auth/profile', profileData);
    return response.data;
  },

  adminLogin: async (username, password) => {
    console.log('Calling admin login with:', { username });
    const response = await api.post('/api/auth/admin/login', { username, password });
    console.log('Admin login response:', response.data);
    return response.data;
  }
};

// Export both the api instance and auth functions
export { api, auth };

// Auth endpoints
export const authEndpoints = {
  login: '/api/user/login',
  signup: '/api/user/signup',
  verifyEmail: '/api/user/verify-email',
  generateLoginOtp: '/api/user/generate-login-otp',
  verifyLoginOtp: '/api/user/verify-login-otp',
  generateLoginLink: '/api/user/generate-login-link',
  verifyLoginLink: '/api/user/verify-login-link',
  forgotPassword: '/api/user/forgot-password',
  resetPassword: '/api/user/reset-password',
  resendVerification: '/api/user/resend-verification'
};

// User endpoints
export const userEndpoints = {
  profile: '/api/user/profile',
  updateProfile: '/api/user/update-profile',
  changePassword: '/api/user/change-password'
};

export default api;
