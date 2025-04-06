import { createContext, useState, useContext, useEffect } from 'react';
import { toast } from 'react-toastify';
import * as authAPI from '../api/auth';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = authAPI.getToken();
        if (token) {
          // Check if we're in admin section
          const isAdminSection = window.location.pathname.includes('/admin');
          
          // For admin section, use admin data
          if (isAdminSection) {
            const adminData = sessionStorage.getItem('adminData');
            if (adminData) {
              setUser(JSON.parse(adminData));
            }
          } else {
            // For regular users, use user data
            const userData = sessionStorage.getItem('userData');
            if (userData) {
              setUser(JSON.parse(userData));
            }
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        // Clear invalid token
        authAPI.clearToken();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const loadUser = async () => {
    try {
      const response = await authAPI.getProfile();
      if (response.success) {
        setUser(response.user);
        // Update session storage with fresh user data
        sessionStorage.setItem('userData', JSON.stringify(response.user));
      }
    } catch (error) {
      console.error('Error loading user:', error);
      // Clear invalid token and user data
      authAPI.clearToken();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await authAPI.login(email, password);
      if (response.success) {
        toast.success(response.message);
        setUser(response.user);
        // Update session storage with fresh user data
        sessionStorage.setItem('userData', JSON.stringify(response.user));
      }
      return response;
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.message);
      // Clear any invalid token
      authAPI.clearToken();
      return { success: false, message: error.message };
    }
  };

  const adminLogin = async (username, password) => {
    try {
      const response = await authAPI.adminLogin(username, password);
      if (response.success) {
        toast.success('Admin login successful');
        setUser(response.user);
        // Update session storage with fresh admin data
        sessionStorage.setItem('adminData', JSON.stringify(response.admin));
      }
      return response;
    } catch (error) {
      console.error('Admin login error:', error);
      toast.error(error.message);
      // Clear any invalid token
      authAPI.clearToken();
      return { success: false, message: error.message };
    }
  };

  const logout = () => {
    authAPI.clearToken();
    // Clear user data from session storage
    sessionStorage.removeItem('userData');
    sessionStorage.removeItem('adminData');
    setUser(null);
    
    // Redirect based on current path
    if (window.location.pathname.includes('/admin')) {
      window.location.href = '/admin/login';
    } else {
      window.location.href = '/login';
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        adminLogin,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
