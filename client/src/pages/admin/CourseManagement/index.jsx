import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import CourseList from './CourseList';
import CourseCreate from './CourseCreate';
import CourseSettings from './CourseSettings';
import CourseAdd from './CourseAdd';

const CourseManagement = () => {
    return (
        <Routes>
            <Route path="" element={<CourseList />} />
            <Route path="create" element={<Navigate to="course-list/create" replace />} />
            <Route path="course-list/create" element={<CourseAdd />} />
            <Route path="settings" element={<CourseSettings />} />
            <Route path="*" element={<Navigate to="" replace />} />
        </Routes>
    );
};

export default CourseManagement;
