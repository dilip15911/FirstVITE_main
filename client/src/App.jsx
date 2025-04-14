import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import './App.css';

// Public Routes
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import VerifyOTP from './pages/auth/VerifyOTP';

// Admin Routes
import AdminLogin from './pages/admin/Login/AdminLogin';
import AdminDashboard from './pages/admin/Dashboard';
import Students from './pages/admin/Students';
import AdminLayout from './pages/admin/AdminLayout';
import CourseManagement from './pages/admin/CourseManagement';
import CourseCreate from './pages/admin/CourseManagement/CourseCreate';
import CourseDetails from './pages/admin/CourseManagement/CourseDetails';
import CourseSettings from './pages/admin/CourseManagement/CourseSettings';

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/verify-otp" element={<VerifyOTP />} />

                    {/* Admin Routes */}
                    <Route path="/admin/login" element={<AdminLogin />} />
                    
                    {/* Protected Admin Routes */}
                    <Route path="/admin" element={<AdminRoute />}>
                        <Route element={<AdminLayout />}>
                            <Route index element={<Navigate to="dashboard" replace />} />
                            <Route path="dashboard" element={<AdminDashboard />} />
                            <Route path="students" element={<Students />} />
                            <Route path="course-management/*" element={<CourseManagement />} />
                        </Route>
                    </Route>

                    {/* Redirect to admin login if accessing admin routes directly */}
                    <Route path="/admin/*" element={<Navigate to="/admin/login" replace />} />

                    {/* Default route - redirect to login */}
                    <Route path="*" element={<Navigate to="/login" replace />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

// Protected route component
const AdminRoute = () => {
    const { user, loading } = useAuth();
    
    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }
    
    if (!user) {
        return <Navigate to="/admin/login" replace />;
    }
    
    if (!user.isAdmin && user.role !== 'admin') {
        return <Navigate to="/login" replace />;
    }
    
    return <Outlet />;
};

export default App;