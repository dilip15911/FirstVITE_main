import { createContext, useState, useContext, useEffect } from 'react';
import { toast } from 'react-toastify';
import * as authAPI from '../api/auth';

const AuthContext = createContext();

export { AuthContext };

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [initialized, setInitialized] = useState(false);

    const isAdmin = user && (user.role === 'admin' || user.isAdmin === true);

    const refreshUser = async () => {
        try {
            const token = authAPI.getToken();
            if (!token) {
                // Check if we have admin data in localStorage
                const adminData = JSON.parse(localStorage.getItem('adminData') || '{}');
                if (adminData.token) {
                    // We have admin data but no token in localStorage, restore it
                    authAPI.setToken(adminData.token);
                    setUser({
                        ...adminData,
                        role: 'admin',
                        isAdmin: true
                    });
                    return true;
                }
                throw new Error('No token available');
            }

            // Try to get user profile
            const response = await authAPI.getProfile();
            console.log('Profile response:', response);
            
            if (response.success) {
                const userData = {
                    ...response.user,
                    token: token
                };
                
                // Update localStorage
                localStorage.setItem('userData', JSON.stringify(userData));
                if (userData.role === 'admin') {
                    localStorage.setItem('adminData', JSON.stringify(userData));
                    localStorage.setItem('isAdmin', 'true');
                }
                
                // Update state
                setUser(userData);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error refreshing user:', error);
            // Clear invalid token
            authAPI.clearToken();
            setUser(null);
            return false;
        }
    };

    useEffect(() => {
        const initializeAuth = async () => {
            try {
                setLoading(true);
                
                // Check if we have a token
                const token = authAPI.getToken();
                
                // Check for admin data
                const isAdmin = localStorage.getItem('isAdmin') === 'true';
                const adminData = JSON.parse(localStorage.getItem('adminData') || '{}');
                
                if (isAdmin && adminData.token) {
                    // We have admin data, set it as the current user
                    if (!token) {
                        // Restore token from adminData if not in localStorage
                        authAPI.setToken(adminData.token);
                    }
                    
                    setUser({
                        ...adminData,
                        role: 'admin',
                        isAdmin: true
                    });
                    
                    // Set up axios interceptors
                    authAPI.setupAxiosInterceptors();
                    setLoading(false);
                    setInitialized(true);
                    return;
                }
                
                if (!token) {
                    // No token, clear any stale data
                    setUser(null);
                    setLoading(false);
                    setInitialized(true);
                    return;
                }
                
                // Set up axios interceptors
                authAPI.setupAxiosInterceptors();
                
                // Try to get user data
                const success = await refreshUser();
                if (!success) {
                    // Token is invalid, clear it
                    authAPI.clearToken();
                    setUser(null);
                }
            } catch (error) {
                console.error('Error initializing auth:', error);
                // Clear invalid token
                authAPI.clearToken();
                setUser(null);
            } finally {
                setLoading(false);
                setInitialized(true);
            }
        };

        initializeAuth();
    }, []);

    const login = async (email, password) => {
        try {
            const response = await authAPI.login(email, password);
            if (response.success) {
                // Store token and user data
                const userData = {
                    ...response.user,
                    token: response.token
                };
                authAPI.setToken(response.token);
                setUser(userData);
                
                // Store user data
                localStorage.setItem('userData', JSON.stringify(userData));
                
                return { success: true, user: userData };
            }
            return { success: false, message: response.message };
        } catch (error) {
            console.error('Login error:', error);
            return { 
                success: false, 
                message: error.response?.data?.message || 
                         error.message || 
                         'Login failed. Please try again.' 
            };
        }
    };

    const adminLogin = async (username, password) => {
        try {
            console.log('AuthContext: Attempting admin login');
            const response = await authAPI.adminLogin(username, password);
            console.log('AuthContext: Admin login response:', response);
            
            if (response.success) {
                // Set user with admin role
                const adminData = response.admin || {};
                let token = response.token;
                
                // Remove Bearer prefix if present
                if (token && token.startsWith('Bearer ')) {
                    token = token.slice(7);
                }
                
                const userData = {
                    ...adminData,
                    role: 'admin',
                    isAdmin: true,
                    token: token
                };
                
                console.log('AuthContext: Setting user with admin data:', userData);
                setUser(userData);
                
                // Set up axios interceptors with the new token
                authAPI.setupAxiosInterceptors();
                
                return response;
            }
            return response;
        } catch (error) {
            console.error('Admin login error in context:', error);
            return { 
                success: false, 
                message: error.response?.data?.message || 
                         error.message || 
                         'Admin login failed. Please try again.' 
            };
        }
    };

    const logout = () => {
        authAPI.clearToken();
        setUser(null);
    };

    return (
        <AuthContext.Provider 
            value={{
                user,
                loading,
                initialized,
                isAdmin,
                login,
                adminLogin,
                logout,
                refreshUser
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
