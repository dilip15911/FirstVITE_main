import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Badge, Form, Row, Col, Card } from 'react-bootstrap';
import axios from 'axios';
import { FaEdit, FaTrash, FaEye } from 'react-icons/fa';

const CourseList = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('all');

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/courses`);
            setCourses(response.data);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch courses');
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this course?')) {
            try {
                await axios.delete(`${process.env.REACT_APP_API_URL}/api/admin/courses/${id}`);
                fetchCourses();
            } catch (err) {
                setError('Failed to delete course');
            }
        }
    };

    const filteredCourses = courses.filter(course => {
        const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            course.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = filterCategory === 'all' || course.category === filterCategory;
        return matchesSearch && matchesCategory;
    });

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="text-danger">{error}</div>;

    return (
        <Container fluid>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Course Management</h2>
                <Button variant="primary" href="/admin/courses/create">Create New Course</Button>
            </div>

            <Card className="mb-4">
                <Card.Body>
                    <Row>
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label>Search Courses</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Search by title or description"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label>Filter by Category</Form.Label>
                                <Form.Select
                                    value={filterCategory}
                                    onChange={(e) => setFilterCategory(e.target.value)}
                                >
                                    <option value="all">All Categories</option>
                                    <option value="programming">Programming</option>
                                    <option value="web-development">Web Development</option>
                                    <option value="data-science">Data Science</option>
                                    <option value="devops">DevOps</option>
                                    <option value="mobile-dev">Mobile Development</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>Serial No</th>
                        <th>Title</th>
                        <th>Category</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredCourses.map(course => (
                        <tr key={course.id}>
                            <td>{course.id}</td>
                            <td>{course.title}</td>
                            <td>{course.category}</td>
                            <td>
                                <Button variant="info" size="sm" className="me-2" href={`/admin/courses/${course.id}`}>
                                    <FaEye />
                                </Button>
                                <Button variant="warning" size="sm" className="me-2" href={`/admin/courses/${course.id}/edit`}>
                                    <FaEdit />
                                </Button>
                                <Button variant="danger" size="sm" onClick={() => handleDelete(course.id)}>
                                    <FaTrash />
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Container>
    );
};

export default CourseList;
