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
                }
                
                // Try to refresh user if token exists
                if (token) {
                    await refreshUser();
                }
            } catch (error) {
                console.error('Auth initialization error:', error);
                authAPI.clearToken();
                setUser(null);
            } finally {
                setLoading(false);
                setInitialized(true);
            }
        };

        initializeAuth();
    }, []);

    const login = async (credentials, isAdminLogin = false) => {
        try {
            setLoading(true);
            const response = await authAPI.login(credentials, isAdminLogin);
            
            if (response.success) {
                const userData = {
                    ...response.user,
                    token: response.token
                };
                
                // Update localStorage
                localStorage.setItem('userData', JSON.stringify(userData));
                if (isAdminLogin || userData.role === 'admin') {
                    localStorage.setItem('adminData', JSON.stringify(userData));
                    localStorage.setItem('isAdmin', 'true');
                }
                
                // Update state
                setUser(userData);
                
                // Set up axios interceptors
                authAPI.setupAxiosInterceptors();
                
                return true;
            }
            return false;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            setLoading(true);
            await authAPI.logout();
            authAPI.clearToken();
            localStorage.removeItem('userData');
            localStorage.removeItem('adminData');
            localStorage.removeItem('isAdmin');
            setUser(null);
            return true;
        } catch (error) {
            console.error('Logout error:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            isAdmin,
            login,
            logout,
            refreshUser
        }}>
            {initialized ? children : null}
        </AuthContext.Provider>
    );
};
