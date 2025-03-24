import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLocation } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div>Loading...</div>;
  }

  // Check if this is an admin route
  const isAdminRoute = location.pathname.startsWith('/admin');
  
  // Allow access to admin routes without login
  if (isAdminRoute) {
    return children;
  }

  // For non-admin routes, use existing logic
  return user ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
