import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Form, Row, Col, Spinner, Alert, Dropdown, Navigation} from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash, FaEye, FaPlus, FaFilter } from 'react-icons/fa';
import { fetchCourses, deleteCourse, fetchCategories } from '../../../services/courseService';
import { toast } from 'react-toastify';

const CourseList = () => {
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [showFilters, setShowFilters] = useState(false);
    const [sortConfig, setSortConfig] = useState({
        key: 'created_at',
        direction: 'desc'
    });

    useEffect(() => {
        loadCourses();
        loadCategories();
    }, []);

    const loadCourses = async () => {
        try {
            setLoading(true);
            const response = await fetchCourses({
                search: searchTerm,
                category: selectedCategory === 'all' ? '' : selectedCategory
            });
            setCourses(response.data);
        } catch (err) {
            setError(err.message || 'Failed to load courses');
            toast.error(err.message || 'Failed to load courses');
        } finally {
            setLoading(false);
        }
    };

    const loadCategories = async () => {
        try {
            const response = await fetchCategories();
            setCategories([{ id: 'all', name: 'All Categories' }, ...response.data]);
        } catch (err) {
            setError(err.message || 'Failed to load categories');
            toast.error(err.message || 'Failed to load categories');
        }
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        loadCourses();
    };

    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
        loadCourses();
    };

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
        
        const sortedCourses = [...courses].sort((a, b) => {
            if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
            if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
            return 0;
        });
        setCourses(sortedCourses);
    };

    const handleDelete = async (courseId) => {
        if (!window.confirm('Are you sure you want to delete this course?')) {
            return;
        }

        try {
            await deleteCourse(courseId);
            toast.success('Course deleted successfully');
            loadCourses();
        } catch (err) {
            toast.error(err.message || 'Failed to delete course');
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'active':
                return <span className="badge bg-success">Active</span>;
            case 'inactive':
                return <span className="badge bg-secondary">Inactive</span>;
            default:
                return <span className="badge bg-warning">{status}</span>;
        }
    };

    return (
        <Container fluid className="p-4">
            <Row className="mb-4">
                <Col>
                    <h2>Courses Management</h2>
                </Col>
            </Row>

            {error && (
                <Alert variant="danger" className="mb-4">
                    {error}
                </Alert>
            )}

            <Row className="mb-4">
                <Col md={6}>
                    <Form.Group className="mb-3">
                        <Form.Control
                            type="text"
                            placeholder="Search courses..."
                            value={searchTerm}
                            onChange={handleSearch}
                            className="me-2"
                        />
                    </Form.Group>
                </Col>
                <Col md={6}>
                    <Dropdown className="float-end">
                        <Dropdown.Toggle variant="outline-secondary">
                            {categories.find(c => c.id === selectedCategory)?.name || 'All Categories'}
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            {categories.map(category => (
                                <Dropdown.Item
                                    key={category.id}
                                    active={category.id === selectedCategory}
                                    onClick={() => handleCategoryChange(category.id)}
                                >
                                    {category.name}
                                </Dropdown.Item>
                            ))}
                        </Dropdown.Menu>
                    </Dropdown>
                </Col>
            </Row>

            <Row className="mb-4">
                <Col>
                    <Button variant="primary" onClick={() => navigate('/admin/course-management/course-list/create')} className="me-2">
                        <FaPlus /> Add New Course
                    </Button>
                    <Button variant="outline-secondary" onClick={() => setShowFilters(!showFilters)}>
                        <FaFilter /> {showFilters ? 'Hide Filters' : 'Show Filters'}
                    </Button>
                </Col>
            </Row>

            {showFilters && (
                <Row className="mb-4">
                    <Col>
                        <Form.Group className="mb-3">
                            <Form.Label>Sort By</Form.Label>
                            <Form.Select
                                value={sortConfig.key}
                                onChange={(e) => handleSort(e.target.value)}
                            >
                                <option value="title">Title</option>
                                <option value="created_at">Date Created</option>
                                <option value="enrollment_count">Enrollment Count</option>
                                <option value="average_rating">Average Rating</option>
                            </Form.Select>
                        </Form.Group>
                    </Col>
                </Row>
            )}

            <Row>
                <Col>
                    <Table striped hover responsive>
                        <thead>
                            <tr>
                                <th onClick={() => handleSort('title')}>
                                    Title
                                    {sortConfig.key === 'title' && (
                                        sortConfig.direction === 'asc' ? '↑' : '↓'
                                    )}
                                </th>
                                <th onClick={() => handleSort('category_name')}>
                                    Category
                                    {sortConfig.key === 'category_name' && (
                                        sortConfig.direction === 'asc' ? '↑' : '↓'
                                    )}
                                </th>
                                <th onClick={() => handleSort('instructor_name')}>
                                    Instructor
                                    {sortConfig.key === 'instructor_name' && (
                                        sortConfig.direction === 'asc' ? '↑' : '↓'
                                    )}
                                </th>
                                <th onClick={() => handleSort('status')}>
                                    Status
                                    {sortConfig.key === 'status' && (
                                        sortConfig.direction === 'asc' ? '↑' : '↓'
                                    )}
                                </th>
                                <th onClick={() => handleSort('price')}>
                                    Price
                                    {sortConfig.key === 'price' && (
                                        sortConfig.direction === 'asc' ? '↑' : '↓'
                                    )}
                                </th>
                                <th onClick={() => handleSort('enrollment_count')}>
                                    Enrollments
                                    {sortConfig.key === 'enrollment_count' && (
                                        sortConfig.direction === 'asc' ? '↑' : '↓'
                                    )}
                                </th>
                                <th onClick={() => handleSort('average_rating')}>
                                    Rating
                                    {sortConfig.key === 'average_rating' && (
                                        sortConfig.direction === 'asc' ? '↑' : '↓'
                                    )}
                                </th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="8" className="text-center py-4">
                                        <Spinner animation="border" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </Spinner>
                                    </td>
                                </tr>
                            ) : courses.length === 0 ? (
                                <tr>
                                    <td colSpan="8" className="text-center py-4">
                                        No courses found
                                    </td>
                                </tr>
                            ) : (
                                courses.map(course => (
                                    <tr key={course.id}>
                                        <td>
                                            <div className="d-flex align-items-center">
                                                {course.image_url && (
                                                    <img
                                                        src={course.image_url}
                                                        alt={course.title}
                                                        style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px', marginRight: '10px' }}
                                                    />
                                                )}
                                                <span>{course.title}</span>
                                            </div>
                                        </td>
                                        <td>{course.category_name}</td>
                                        <td>{course.instructor_name}</td>
                                        <td>{getStatusBadge(course.status)}</td>
                                        <td>${course.price}</td>
                                        <td>{course.enrollment_count}</td>
                                        <td>{course.average_rating ? `${course.average_rating}★` : 'N/A'}</td>
                                        <td>
                                            <Button
                                                variant="link"
                                                size="sm"
                                                onClick={() => navigate(`/admin/course-management/course-list/${course.id}`)}
                                                title="View Details"
                                            >
                                                <FaEye />
                                            </Button>
                                            <Button
                                                variant="link"
                                                size="sm"
                                                onClick={() => navigate('/admin/course-management/course-list/create', { state: { course } })}
                                                title="Edit"
                                            >
                                                <FaEdit />
                                            </Button>
                                            <Button
                                                variant="link"
                                                size="sm"
                                                onClick={() => handleDelete(course.id)}
                                                title="Delete"
                                            >
                                                <FaTrash />
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </Table>
                </Col>
            </Row>
        </Container>
    );
};

export default CourseList;
