import React from 'react';
import { useAuth } from '../context/AuthContext';

const AuthRedirector = () => {
    const { user, loading, initialized } = useAuth();

    // Check if we need to redirect
    React.useEffect(() => {
        // Only proceed if auth is initialized and not loading
        if (!initialized || loading) return;

        const currentPath = window.location.pathname;

        if (user) {
            // If user is logged in and we're on login page, redirect to dashboard
            if (currentPath === '/admin/login') {
                window.location.href = '/admin/dashboard';
            }
            // If user is logged in and we're not on a protected admin route, redirect to dashboard
            else if (!currentPath.startsWith('/admin/')) {
                window.location.href = '/admin/dashboard';
            }
        } else {
            // If not logged in and we're on a protected admin route, redirect to login
            if (currentPath.startsWith('/admin/') && currentPath !== '/admin/login') {
                window.location.href = '/admin/login';
            }
        }
    }, [user, loading, initialized]);

    return null; // This component doesn't render anything
};

export default AuthRedirector;
