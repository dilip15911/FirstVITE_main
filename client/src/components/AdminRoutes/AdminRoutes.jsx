import React, { useState, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import axios from 'axios';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';

const AdminRoutes = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        if (!token) {
          setIsAuthenticated(false);
          setLoading(false);
          return;
        }

        const response = await axios.get('http://localhost:5000/api/admin/verify', {
          headers: { Authorization: `Bearer ${token}` }
        });

        setIsAuthenticated(response.data.isValid);
        setLoading(false);
      } catch (error) {
        console.error('Token verification failed:', error);
        setIsAuthenticated(false);
        setLoading(false);
      }
    };

    verifyToken();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/admin/login" />;
};

export default AdminRoutes;
