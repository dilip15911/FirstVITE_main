import React from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import './AdminLayout.css';

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, loading } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="admin-layout">
      <div className="admin-sidebar">
        <div className="admin-sidebar-header">
          <h2>Admin Panel</h2>
        </div>
        <nav className="admin-nav">
          <ul>
            <li>
              <Link 
                to="/admin/dashboard" 
                className={location.pathname === '/admin/dashboard' ? 'active' : ''}
              >
                Dashboard
              </Link>
            </li>
            <li>
              <Link 
                to="/admin/users" 
                className={location.pathname === '/admin/users' ? 'active' : ''}
              >
                Users
              </Link>
            </li>
            <li>
              <Link 
                to="/admin/products" 
                className={location.pathname === '/admin/products' ? 'active' : ''}
              >
                Products
              </Link>
            </li>
            <li>
              <Link 
                to="/admin/settings" 
                className={location.pathname === '/admin/settings' ? 'active' : ''}
              >
                Settings
              </Link>
            </li>
          </ul>
        </nav>
        <div className="admin-sidebar-footer">
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>
      </div>
      <div className="admin-main">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
