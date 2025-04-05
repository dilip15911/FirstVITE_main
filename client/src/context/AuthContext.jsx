import { createContext, useState, useContext, useEffect } from 'react';
import { toast } from 'react-toastify';
import * as authAPI from '../api/auth';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = authAPI.getToken();
    if (token) {
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
      authAPI.clearToken();
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
        // Note: Typically signup doesn't return a token - user needs to verify email first
        // Only set token if it's returned from the API
        if (response.token) {
          authAPI.setToken(response.token);
          setUser(response.user);
        }
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
        authAPI.setToken(response.token);
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
    authAPI.clearToken();
    setUser(null);
  };

  const verifyEmail = async (userId, otp) => {
    try {
      const response = await authAPI.verifyEmail(userId, otp);
      if (response.success) {
        toast.success(response.message);
        return { success: true, message: response.message };
      }
      return { success: false, message: response.message };
    } catch (error) {
      console.error('Verification error:', error);
      toast.error(error.message);
      return { success: false, message: error.message };
    }
  };

  const resendVerification = async (userId) => {
    try {
      const response = await authAPI.resendVerification(userId);
      if (response.success) {
        toast.success(response.message);
        return { success: true, message: response.message };
      }
      return { success: false, message: response.message };
    } catch (error) {
      console.error('Resend verification error:', error);
      toast.error(error.message);
      return { success: false, message: error.message };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        signup,
        verifyEmail,
        resendVerification,
        loadUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
