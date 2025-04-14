import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Initialize axios with default headers
axios.defaults.baseURL = API_URL;
axios.defaults.headers.common['Content-Type'] = 'application/json';

// Token refresh state
let isRefreshing = false;
let refreshSubscribers = [];

const subscribeTokenRefresh = (cb) => {
    refreshSubscribers.push(cb);
    return () => {
        refreshSubscribers = refreshSubscribers.filter(callback => callback !== cb);
    }
};

const onTokenRefreshed = (newToken) => {
    refreshSubscribers.forEach(callback => callback(newToken));
};

// Configure axios interceptors
export const setupAxiosInterceptors = () => {
    // Clear existing interceptors
    axios.interceptors.request.clear();
    axios.interceptors.response.clear();

    // Request interceptor
    axios.interceptors.request.use(
        (config) => {
            // First try to get token from localStorage
            let token = localStorage.getItem('token');
            
            // If not found, try from userData or adminData objects
            if (!token) {
                const userData = JSON.parse(localStorage.getItem('userData') || '{}');
                const adminData = JSON.parse(localStorage.getItem('adminData') || '{}');
                token = userData.token || adminData.token;
                
                // If found in objects, store it properly
                if (token) {
                    localStorage.setItem('token', token);
                }
            }
            
            if (token) {
                // Remove Bearer prefix if it exists
                if (token.startsWith('Bearer ')) {
                    token = token.slice(7);
                }
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
        async (error) => {
            if (error.response?.status === 401) {
                try {
                    if (!isRefreshing) {
                        isRefreshing = true;
                        
                        try {
                            const storedToken = localStorage.getItem('token') || sessionStorage.getItem('token');
                            if (storedToken) {
                                const response = await axios.post(`${API_URL}/auth/refresh`, { token: storedToken });
                                if (response.data.success) {
                                    const newToken = response.data.token;
                                    localStorage.setItem('token', newToken);
                                    sessionStorage.setItem('token', newToken);
                                    onTokenRefreshed(newToken);
                                    
                                    // Retry the original request with new token
                                    error.config.headers.Authorization = `Bearer ${newToken}`;
                                    return axios(error.config);
                                }
                            }
                        } catch (refreshError) {
                            console.error('Token refresh failed:', refreshError);
                        } finally {
                            isRefreshing = false;
                        }
                    }

                    // Wait for refresh if already in progress
                    return new Promise((resolve, reject) => {
                        const unsubscribe = subscribeTokenRefresh((newToken) => {
                            error.config.headers.Authorization = `Bearer ${newToken}`;
                            unsubscribe();
                            resolve(axios(error.config));
                        });
                    });
                } catch (error) {
                    console.error('Failed to refresh token:', error);
                    // Clear invalid token
                    localStorage.removeItem('token');
                    sessionStorage.removeItem('token');
                    localStorage.removeItem('adminData');
                    localStorage.removeItem('userData');
                    localStorage.removeItem('isAdmin');
                    
                    // Redirect to appropriate login page
                    if (window.location.pathname.includes('/admin')) {
                        window.location.href = '/admin/login';
                    } else {
                        window.location.href = '/login';
                    }
                    
                    return Promise.reject(error);
                }
            }
            return Promise.reject(error);
        }
    );
};

// Token management
export const getToken = () => {
    return localStorage.getItem('token') || sessionStorage.getItem('token');
};

export const setToken = (token) => {
    if (token) {
        // Remove Bearer prefix if it exists
        if (token.startsWith('Bearer ')) {
            token = token.slice(7);
        }
        localStorage.setItem('token', token);
        // Set token in axios default headers immediately
        axios.defaults.headers.common.Authorization = `Bearer ${token}`;
        // Re-setup interceptors with new token
        setupAxiosInterceptors();
    }
};

export const clearToken = () => {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    localStorage.removeItem('adminData');
    localStorage.removeItem('userData');
    localStorage.removeItem('isAdmin');
    // Clear interceptors
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
            
            // Store user data in session
            localStorage.setItem('userData', JSON.stringify(response.data.user));
            
            // Set up interceptors
            setupAxiosInterceptors();
            
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
        // Clear any existing tokens first
        clearToken();
        
        console.log('Attempting admin login with:', { username });
        const response = await axios.post('/auth/admin/login', { username, password });
        console.log('Admin login response:', response.data);
        
        if (response.data.success) {
            // The server returns token with 'Bearer ' prefix, remove it if present
            let token = response.data.token;
            if (token.startsWith('Bearer ')) {
                token = token.slice(7);
            }
            
            // Store admin token in localStorage
            setToken(token);
            
            // Store admin data with token in localStorage
            const adminData = {
                ...response.data.admin,
                token: token
            };
            localStorage.setItem('adminData', JSON.stringify(adminData));
            localStorage.setItem('isAdmin', 'true');
            
            // Set up interceptors
            setupAxiosInterceptors();
            
            return response.data;
        }
        return { success: false, message: response.data.message || response.data.error };
    } catch (error) {
        console.error('Admin login error:', error);
        const errorMessage = error.response?.data?.error || 
            error.response?.data?.message || 
            error.message || 
            'Admin login failed. Please try again.';
        return { success: false, message: errorMessage };
    }
};

export const getProfile = async () => {
    try {
        const token = getToken();
        if (!token) {
            throw new Error('No token available');
        }
        
        // Ensure token is set in axios headers
        axios.defaults.headers.common.Authorization = `Bearer ${token}`;
        
        const response = await axios.get('/auth/profile');
        return response.data;
    } catch (error) {
        console.error('Profile error:', error.response?.data || error.message);
        // Only clear token if it's specifically a 401 error
        if (error.response?.status === 401) {
            // Try to refresh token before clearing
            try {
                const currentToken = getToken();
                const refreshResponse = await axios.post('/auth/refresh', { token: currentToken });
                if (refreshResponse.data.success) {
                    setToken(refreshResponse.data.token);
                    // Retry the profile request
                    return getProfile();
                }
            } catch (refreshError) {
                console.error('Token refresh failed:', refreshError);
                // Now clear the token
                clearToken();
                // Redirect to appropriate login page
                if (window.location.pathname.includes('/admin')) {
                    window.location.href = '/admin/login';
                } else {
                    window.location.href = '/login';
                }
            }
        }
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

// Add logout function
export const logout = async () => {
    try {
        const token = getToken();
        if (!token) {
            return { success: false, message: 'No token found' };
        }

        const response = await axios.post(`${API_URL}/auth/logout`, null, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (response.data.success) {
            // Clear all auth data
            clearToken();
            localStorage.removeItem('userData');
            localStorage.removeItem('adminData');
            localStorage.removeItem('isAdmin');
            sessionStorage.removeItem('token');
            
            return { success: true };
        }
        
        return { success: false, message: response.data.message || 'Logout failed' };
    } catch (error) {
        console.error('Logout error:', error);
        clearToken();
        localStorage.removeItem('userData');
        localStorage.removeItem('adminData');
        localStorage.removeItem('isAdmin');
        sessionStorage.removeItem('token');
        
        return { 
            success: false, 
            message: error.response?.data?.message || 
                     error.message || 
                     'Logout failed. Please try again.' 
        };
    }
};

const authService = {
    login,
    adminLogin,
    getProfile,
    updateProfile,
    setupAxiosInterceptors,
    getToken,
    setToken,
    clearToken,
    logout
};

export { authService };
