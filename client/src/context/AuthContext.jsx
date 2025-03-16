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
      const errorMessage = error.errors?.[0]?.msg ||
                         error.message ||
                         'Registration failed. Please try again.';
      toast.error(errorMessage);
      return { success: false, message: errorMessage };
    }
  };

  const verifyEmail = async (userId, otp) => {
    try {
      const response = await authAPI.verifyEmail(userId, otp);
      if (response.success) {
        toast.success(response.message);
        return {
          success: true,
          message: response.message,
          redirectTo: response.redirectTo
        };
      }
      return {
        success: false,
        message: response.message || 'Verification failed. Please try again.'
      };
    } catch (error) {
      console.error('Verification error:', error);
      const errorMessage = error.message || 'Verification failed';
      toast.error(errorMessage);
      return { success: false, message: errorMessage };
    }
  };

  const resendVerification = async (userId) => {
    try {
      const response = await authAPI.resendVerification(userId);
      if (response.success) {
        toast.success(response.message || 'Verification code sent! Please check your email.');
        return { success: true };
      }
      return {
        success: false,
        message: response.message || 'Failed to resend verification code'
      };
    } catch (error) {
      console.error('Resend verification error:', error);
      const errorMessage = error.message || 'Failed to resend verification code';
      toast.error(errorMessage);
      return { success: false, message: errorMessage };
    }
  };

  const login = async (email, password) => {
    try {
      const response = await authAPI.login(email, password);
      const { token, user, message, needsVerification } = response;

      if (needsVerification) {
        return {
          success: false,
          needsVerification: true,
          userId: response.userId,
          email: response.email,
          message: message || 'Please verify your email'
        };
      }

      if (token && user) {
        localStorage.setItem('token', token);
        setUser(user);
        toast.success(message || 'Login successful!');
        return { success: true };
      }

      return {
        success: false,
        message: message || 'Login failed'
      };
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error.message || 'Login failed';
      toast.error(errorMessage);
      return { success: false, message: errorMessage };
    }
  };

  const updateProfile = async (data) => {
    try {
      const response = await authAPI.updateProfile(data);
      if (response.success) {
        setUser(response.user);
        toast.success(response.message || 'Profile updated successfully');
        return { success: true, user: response.user };
      }
      return { success: false, message: response.message };
    } catch (error) {
      console.error('Profile update error:', error);
      const errorMessage = error.message || 'Failed to update profile';
      toast.error(errorMessage);
      return { success: false, message: errorMessage };
    }
  };

  const getUserHistory = async () => {
    try {
      const response = await authAPI.getUserHistory();
      return response;
    } catch (error) {
      console.error('Get user history error:', error);
      const errorMessage = error.message || 'Failed to fetch history';
      toast.error(errorMessage);
      return { success: false, message: errorMessage };
    }
  };

  const restoreProfile = async (historyId) => {
    try {
      const response = await authAPI.restoreProfile(historyId);
      if (response.success) {
        setUser(response.user);
        toast.success(response.message || 'Profile restored successfully');
        return { success: true, user: response.user };
      }
      return { success: false, message: response.message };
    } catch (error) {
      console.error('Profile restore error:', error);
      const errorMessage = error.message || 'Failed to restore profile';
      toast.error(errorMessage);
      return { success: false, message: errorMessage };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    toast.success('Logged out successfully!');
  };

  const value = {
    user,
    loading,
    signup,
    login,
    logout,
    verifyEmail,
    resendVerification,
    updateProfile,
    getUserHistory,
    restoreProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
