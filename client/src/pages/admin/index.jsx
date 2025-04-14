import { Routes, Route } from 'react-router-dom';
import CourseManagement from './CourseManagement';
import Students from './Students';
import Login from './Login';

const AdminRoutes = () => {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/course-management/*" element={<CourseManagement />} />
            <Route path="/students" element={<Students />} />
        </Routes>
    );
};

export default AdminRoutes;
