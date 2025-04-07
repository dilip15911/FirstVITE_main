import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Badge, Form, Row, Col, Card, Spinner, Alert, InputGroup } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash, FaEye, FaPlus, FaSearch, FaFilter } from 'react-icons/fa';
import { fetchCourses, deleteCourse, fetchCategories, fetchCoursesWithFilters } from '../../../services/courseService';
import { toast } from 'react-toastify';

const CourseList = () => {
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('all');
    const [deleteLoading, setDeleteLoading] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            setError(null);
            
            // Store admin flag in localStorage if not already set
            localStorage.setItem('isAdmin', 'true');
            
            // Fetch courses and categories in parallel
            const [coursesData, categoriesData] = await Promise.all([
                fetchCourses(),
                fetchCategories()
            ]);
            
            setCourses(coursesData || []);
            setCategories(categoriesData || []);
        } catch (err) {
            console.error('Error loading data:', err);
            setError(err.message || 'Failed to load data');
            toast.error(err.message || 'Failed to load data');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            setError(null);
            
            // Use the new search method with filters
            const courses = await fetchCoursesWithFilters(searchTerm, filterCategory);
            setCourses(courses || []);
        } catch (err) {
            console.error('Error searching courses:', err);
            setError(err.message || 'Failed to search courses');
            toast.error(err.message || 'Failed to search courses');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this course?')) {
            try {
                setDeleteLoading(true);
                await deleteCourse(id);
                toast.success('Course deleted successfully');
                // Refresh the course list
                await loadData();
            } catch (err) {
                console.error('Error deleting course:', err);
                setError(err.message || 'Failed to delete course');
                toast.error(err.message || 'Failed to delete course');
            } finally {
                setDeleteLoading(false);
            }
        }
    };

    if (loading) {
        return (
            <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '300px' }}>
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </Container>
        );
    }

    return (
        <Container fluid>
            {error && (
                <Alert variant="danger" dismissible onClose={() => setError(null)}>
                    {error}
                </Alert>
            )}
            
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Course Management</h2>
                <Button 
                    variant="primary" 
                    as={Link} 
                    to="/admin/courses/new"
                    className="d-flex align-items-center"
                >
                    <FaPlus className="me-2" /> Create New Course
                </Button>
            </div>

            <Card className="mb-4">
                <Card.Body>
                    <Form onSubmit={handleSearch} className="mb-3">
                        <Row>
                            <Col md={6}>
                                <Form.Group controlId="searchTerm">
                                    <Form.Label>Search Courses</Form.Label>
                                    <InputGroup>
                                        <Form.Control
                                            type="text"
                                            placeholder="Search by title or description"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="me-2"
                                        />
                                        <Button type="submit" variant="outline-secondary">
                                            <FaSearch />
                                        </Button>
                                    </InputGroup>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group controlId="filterCategory">
                                    <Form.Label>Filter by Category</Form.Label>
                                    <Form.Select
                                        value={filterCategory}
                                        onChange={(e) => setFilterCategory(e.target.value)}
                                    >
                                        <option value="all">All Categories</option>
                                        {categories.map(category => (
                                            <option key={category.id} value={category.id}>
                                                {category.name}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                        </Row>
                    </Form>
                </Card.Body>
            </Card>

            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Category</th>
                        <th>Status</th>
                        <th>Price</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {courses.map(course => (
                        <tr key={course.id}>
                            <td>{course.title}</td>
                            <td>{course.category_name || 'N/A'}</td>
                            <td>
                                <Badge bg={getStatusColor(course.status)}>
                                    {course.status}
                                </Badge>
                            </td>
                            <td>${course.price}</td>
                            <td>
                                <Button
                                    variant="outline-primary"
                                    size="sm"
                                    as={Link}
                                    to={`/admin/courses/${course.id}`}
                                    className="me-1"
                                >
                                    <FaEye className="me-1" /> View
                                </Button>
                                <Button
                                    variant="outline-warning"
                                    size="sm"
                                    as={Link}
                                    to={`/admin/courses/${course.id}/edit`}
                                    className="me-1"
                                >
                                    <FaEdit className="me-1" /> Edit
                                </Button>
                                <Button
                                    variant="outline-danger"
                                    size="sm"
                                    onClick={() => handleDelete(course.id)}
                                    disabled={deleteLoading}
                                >
                                    <FaTrash className="me-1" /> Delete
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Container>
    );
};

const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
        case 'published':
            return 'success';
        case 'draft':
            return 'warning';
        case 'archived':
            return 'secondary';
        default:
            return 'primary';
    }
};

export default CourseList;
