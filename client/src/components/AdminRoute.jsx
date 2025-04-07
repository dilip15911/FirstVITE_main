import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // Check if user exists and has admin role
  const isAdmin = user && (user.role === 'admin' || user.isAdmin === true);
  
  if (!isAdmin) {
    // Redirect to admin login if not authenticated as admin
    return <Navigate to="/admin/login" />;
  }

  return children;
};

export default AdminRoute;
