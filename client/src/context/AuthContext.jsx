import { createContext, useState, useContext, useEffect } from 'react';
import { toast } from 'react-toastify';
import * as authAPI from '../api/auth';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      authAPI.setupAxiosInterceptors(token);
      loadUser();
    } else {
      setLoading(false);
    }
  }, []);

  const loadUser = async () => {
    try {
      const response = await authAPI.getProfile();
      if (response.success) {
        setUser(response.user);
      }
    } catch (error) {
      console.error('Error loading user:', error);
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const signup = async (name, email, password) => {
    try {
      const response = await authAPI.signup(name, email, password);
      if (response.success) {
        toast.success(response.message);
        return {
          success: true,
          userId: response.userId,
          email: response.email,
          message: response.message
        };
      }
      return {
        success: false,
        message: response.message || 'Registration failed. Please try again.'
      };
    } catch (error) {
      console.error('Signup error:', error);
      toast.error(error.message);
      return { success: false, message: error.message };
    }
  };

  const login = async (email, password) => {
    try {
      const response = await authAPI.login(email, password);
      if (response.success) {
        const token = response.token;
        localStorage.setItem('token', token);
        authAPI.setupAxiosInterceptors(token);
        setUser(response.user);
        return { success: true, message: response.message };
      }
      return { success: false, message: response.message };
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.message);
      return { success: false, message: error.message };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    authAPI.setupAxiosInterceptors(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        signup,
        loadUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
