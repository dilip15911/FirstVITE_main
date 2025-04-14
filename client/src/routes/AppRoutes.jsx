import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Login from '../pages/auth/Login';
import Signup from '../pages/auth/Signup';
import Verify from '../pages/auth/Verify';
import Profile from '../pages/user/Profile';
import PrivateRoute from '../components/PrivateRoute/PrivateRoute';
import CreateEmployee from '../pages/admin/Employee/CreateEmployee';
import ManageEmployees from '../pages/admin/Employee/ManageEmployees';
import ViewEmployees from '../pages/admin/Employee/ViewEmployees';
import StudentSupport from '../pages/admin/StudentSupport';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/verify" element={<Verify />} />
      <Route
        path="/profile"
        element={
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/studentsupport"
        element={
          <PrivateRoute>
            <StudentSupport />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/employees/create"
        element={
          <PrivateRoute>
            <CreateEmployee />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/employees/manage"
        element={
          <PrivateRoute>
            <ManageEmployees />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/employees/view"
        element={
          <PrivateRoute>
            <ViewEmployees />
          </PrivateRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
