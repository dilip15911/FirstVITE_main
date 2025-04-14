import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Table, Button, Spinner, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { FaEye, FaEdit, FaTrash, FaPlus, FaSearch, FaFilter, FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { fetchCourses } from '../../../services/courseService';
import { toast } from 'react-toastify';

const Courses = () => {
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [sortConfig, setSortConfig] = useState({
        key: '',
        direction: ''
    });

    // Fetch courses from backend
    const fetchCoursesData = async () => {
        try {
            setLoading(true);
            const response = await fetchCourses();
            if (response && Array.isArray(response)) {
                setCourses(response);
            } else {
                setCourses([]);
            }
            setError(null);
        } catch (err) {
            console.error('Error fetching courses:', err);
            setError('Failed to fetch courses. Please try again later.');
            toast.error('Failed to fetch courses. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    // Sort courses
    const requestSort = (key) => {
        const direction = sortConfig.key === key && sortConfig.direction === 'ascending' ? 'descending' : 'ascending';
        setSortConfig({ key, direction });
        
        const sortedCourses = [...courses].sort((a, b) => {
            if (a[key] < b[key]) return direction === 'ascending' ? -1 : 1;
            if (a[key] > b[key]) return direction === 'ascending' ? 1 : -1;
            return 0;
        });
        
        setCourses(sortedCourses);
    };

    // Filter courses
    const filteredCourses = courses && Array.isArray(courses) 
        ? courses.filter(course => {
            const matchesSearch = course.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                course.description?.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = categoryFilter === 'all' || course.category_id === parseInt(categoryFilter);
            return matchesSearch && matchesCategory;
        })
        : [];

    useEffect(() => {
        fetchCoursesData();
    }, []);

    if (loading) {
        return (
            <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '300px' }}>
                <Spinner animation="border" role="status" style={{ width: '4rem', height: '4rem' }}>
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="text-center py-5">
                <h3 className="text-danger">{error}</h3>
                <Button variant="primary" onClick={fetchCoursesData}>
                    Retry
                </Button>
            </Container>
        );
    }

    return (
        <Container fluid>
            <Row className="mb-4">
                <Col>
                    <h2>Courses</h2>
                </Col>
                <Col xs="auto">
                    <Button variant="primary" as={Link} to="/admin/course-management/create">
                        <FaPlus className="me-2" />Create Course
                    </Button>
                </Col>
            </Row>

            <Row className="mb-4">
                <Col md={6}>
                    <div className="input-group">
                        <span className="input-group-text">
                            <FaSearch />
                        </span>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search courses..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </Col>
                <Col md={6}>
                    <select
                        className="form-select"
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                    >
                        <option value="all">All Categories</option>
                        {courses && Array.isArray(courses) && courses.length > 0 && 
                            [...new Set(courses.map(course => course.category_id))].map(categoryId => (
                                <option key={categoryId} value={categoryId}>
                                    {courses.find(c => c.category_id === categoryId)?.category_name || 'Unknown'}
                                </option>
                            ))
                        }
                    </select>
                </Col>
            </Row>

            <Table striped hover>
                <thead>
                    <tr>
                        <th onClick={() => requestSort('title')}>
                            Title{' '}
                            {sortConfig.key === 'title' && (
                                sortConfig.direction === 'ascending' ? <FaSortUp /> : <FaSortDown />
                            )}
                        </th>
                        <th onClick={() => requestSort('instructor_name')}>
                            Instructor{' '}
                            {sortConfig.key === 'instructor_name' && (
                                sortConfig.direction === 'ascending' ? <FaSortUp /> : <FaSortDown />
                            )}
                        </th>
                        <th onClick={() => requestSort('category_name')}>
                            Category{' '}
                            {sortConfig.key === 'category_name' && (
                                sortConfig.direction === 'ascending' ? <FaSortUp /> : <FaSortDown />
                            )}
                        </th>
                        <th onClick={() => requestSort('status')}>
                            Status{' '}
                            {sortConfig.key === 'status' && (
                                sortConfig.direction === 'ascending' ? <FaSortUp /> : <FaSortDown />
                            )}
                        </th>
                        <th>Enrollment</th>
                        <th>Rating</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredCourses.length > 0 ? filteredCourses.map((course) => (
                        <tr key={course.id}>
                            <td>{course.title}</td>
                            <td>{course.instructor_name}</td>
                            <td>{course.category_name}</td>
                            <td>
                                <span className={`badge bg-${getStatusColor(course.status)}`}>
                                    {course.status}
                                </span>
                            </td>
                            <td>{course.enrollment_count || 0}</td>
                            <td>{course.average_rating || 'N/A'}</td>
                            <td>
                                <div className="d-flex gap-2">
                                    <OverlayTrigger
                                        placement="top"
                                        overlay={<Tooltip>View Details</Tooltip>}
                                    >
                                        <Link to={`/admin/course-management/courses/${course.id}`}>
                                            <Button variant="outline-primary" size="sm">
                                                <FaEye />
                                            </Button>
                                        </Link>
                                    </OverlayTrigger>
                                    <OverlayTrigger
                                        placement="top"
                                        overlay={<Tooltip>Edit Course</Tooltip>}
                                    >
                                        <Link to={`/admin/course-management/courses/${course.id}/edit`}>
                                            <Button variant="outline-warning" size="sm">
                                                <FaEdit />
                                            </Button>
                                        </Link>
                                    </OverlayTrigger>
                                    <OverlayTrigger
                                        placement="top"
                                        overlay={<Tooltip>Delete Course</Tooltip>}
                                    >
                                        <Button
                                            variant="outline-danger"
                                            size="sm"
                                            onClick={() => handleDelete(course.id)}
                                        >
                                            <FaTrash />
                                        </Button>
                                    </OverlayTrigger>
                                </div>
                            </td>
                        </tr>
                    )) : (
                        <tr>
                            <td colSpan={7} className="text-center py-4">
                                <p className="text-muted">No courses found</p>
                            </td>
                        </tr>
                    )}
                </tbody>
            </Table>
        </Container>
    );

    function getStatusColor(status) {
        switch (status) {
            case 'published':
                return 'success';
            case 'draft':
                return 'warning';
            case 'archived':
                return 'secondary';
            default:
                return 'primary';
        }
    }

    async function handleDelete(courseId) {
        if (window.confirm('Are you sure you want to delete this course?')) {
            try {
                await fetchCourses.deleteCourse(courseId);
                toast.success('Course deleted successfully');
                fetchCoursesData();
            } catch (error) {
                toast.error(error.response?.data?.message || 'Failed to delete course');
            }
        }
    }
};

export default Courses;
