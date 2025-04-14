import React from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import Courses from './Courses';
import CourseCreate from './CourseCreate';
import CourseSettings from './CourseSettings';
import CourseList from './CourseList';

const CourseManagement = () => {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <div className="course-management-container">
            <Routes>
                <Route path="" element={<Navigate to="course-list" replace />} />
                <Route path="course-list" element={<CourseList />} />
                <Route path="courses" element={<Courses />} />
                <Route path="courses/:id" element={<CourseSettings />} />
                <Route path="courses/:id/edit" element={<CourseCreate />} />
                <Route path="create" element={<CourseCreate />} />
                <Route path="settings" element={<CourseSettings />} />
            </Routes>
        </div>
    );
};

export default CourseManagement;
