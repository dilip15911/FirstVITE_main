import React, { useState, useEffect } from 'react';
import { Table, Button, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { fetchCourses, deleteCourse } from '../services/courseService';

const CourseList = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchCoursesList();
    }, []);

    const fetchCoursesList = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await fetchCourses();
            setCourses(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (courseId) => {
        if (!window.confirm('Are you sure you want to delete this course?')) {
            return;
        }

        try {
            await deleteCourse(courseId);
            // Refresh the list after successful deletion
            fetchCoursesList();
        } catch (err) {
            console.error('Error deleting course:', err);
        }
    };

    if (loading) {
        return (
            <div className="text-center mt-5">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center mt-5">
                <p className="text-danger">{error}</p>
                <Button variant="primary" onClick={fetchCoursesList}>
                    Retry
                </Button>
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <h2>Courses</h2>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <Link to="/admin/courses/new" className="btn btn-primary">
                    Add New Course
                </Link>
            </div>
            
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Category</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {courses.map((course) => (
                        <tr key={course.id}>
                            <td>{course.title}</td>
                            <td>{course.description.substring(0, 100)}...</td>
                            <td>{course.category?.name || 'N/A'}</td>
                            <td>
                                <span className={`badge ${
                                    course.status === 'published' ? 'bg-success' :
                                    course.status === 'draft' ? 'bg-warning' :
                                    'bg-secondary'
                                }`}>
                                    {course.status}
                                </span>
                            </td>
                            <td>
                                <Link to={`/admin/courses/${course.id}/edit`} className="btn btn-sm btn-primary me-2">
                                    Edit
                                </Link>
                                <Button
                                    variant="danger"
                                    size="sm"
                                    onClick={() => handleDelete(course.id)}
                                >
                                    Delete
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
};

export default CourseList;
