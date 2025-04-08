import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const AdminRoute = ({ children }) => {
    const { user, loading, isAdmin, refreshUser } = useAuth();
    const location = useLocation();
    const redirectPath = localStorage.getItem('redirectPath') || '/admin/dashboard';

    useEffect(() => {
        // Try to refresh user data if we have a token but no user data
        if (!loading && !user && localStorage.getItem('token')) {
            refreshUser();
        }
    }, [loading, user, refreshUser]);

    // Check if user is authenticated and is admin
    const isAuthenticated = user && isAdmin;

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        // Save the current location to redirect back after login
        localStorage.setItem('redirectPath', location.pathname);
        return <Navigate to="/admin/login" replace />;
    }

    return children;
};

export default AdminRoute;
