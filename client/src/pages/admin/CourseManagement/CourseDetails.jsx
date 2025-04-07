import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Button, Spinner, Alert, Tab, Tabs, ListGroup } from 'react-bootstrap';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FaEdit, FaArrowLeft, FaEye, FaTrash, FaCheck, FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const CourseDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('details');

    useEffect(() => {
        fetchCourseDetails();
    }, [id]);

    const fetchCourseDetails = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Not authenticated');
            }

            const response = await axios.get(`${API_URL}/api/admin/courses/${id}`, {
                headers: {
                    'Authorization': token.startsWith('Bearer ') ? token : `Bearer ${token}`
                }
            });

            if (response.data && response.data.success) {
                setCourse(response.data.data);
            } else {
                throw new Error('Failed to fetch course details');
            }
        } catch (err) {
            console.error('Error fetching course details:', err);
            setError(err.message || 'Failed to fetch course details');
            toast.error(err.message || 'Failed to fetch course details');
            
            // For demo purposes, create mock data if API fails
            const mockCourse = {
                id: parseInt(id),
                title: 'Sample Course',
                description: 'This is a sample course description for demonstration purposes.',
                category_id: 1,
                category_name: 'Web Development',
                instructor_id: 1,
                instructor_name: 'John Doe',
                price: 49.99,
                status: 'draft',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                lessons: [
                    { id: 1, title: 'Introduction', duration: '10:00', order: 1 },
                    { id: 2, title: 'Getting Started', duration: '15:30', order: 2 },
                    { id: 3, title: 'Advanced Concepts', duration: '20:15', order: 3 }
                ],
                students: [
                    { id: 1, name: 'Alice Johnson', email: 'alice@example.com', enrolled_date: new Date().toISOString() },
                    { id: 2, name: 'Bob Smith', email: 'bob@example.com', enrolled_date: new Date().toISOString() }
                ],
                reviews: [
                    { id: 1, student_name: 'Alice Johnson', rating: 4.5, comment: 'Great course!', created_at: new Date().toISOString() }
                ]
            };
            setCourse(mockCourse);
        } finally {
            setLoading(false);
        }
    };

    const handlePublishToggle = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Not authenticated');
            }

            const newStatus = course.status === 'published' ? 'draft' : 'published';
            
            await axios.patch(`${API_URL}/api/admin/courses/${id}/status`, 
                { status: newStatus },
                {
                    headers: {
                        'Authorization': token.startsWith('Bearer ') ? token : `Bearer ${token}`
                    }
                }
            );

            setCourse({
                ...course,
                status: newStatus
            });

            toast.success(`Course ${newStatus === 'published' ? 'published' : 'unpublished'} successfully`);
        } catch (err) {
            console.error('Error updating course status:', err);
            toast.error(err.message || 'Failed to update course status');
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('Not authenticated');
                }

                await axios.delete(`${API_URL}/api/admin/courses/${id}`, {
                    headers: {
                        'Authorization': token.startsWith('Bearer ') ? token : `Bearer ${token}`
                    }
                });

                toast.success('Course deleted successfully');
                navigate('/admin/courses');
            } catch (err) {
                console.error('Error deleting course:', err);
                toast.error(err.message || 'Failed to delete course');
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

    if (!course && !loading) {
        return (
            <Container>
                <Alert variant="danger">
                    Course not found or you don't have permission to view it.
                </Alert>
                <Button variant="primary" as={Link} to="/admin/courses">
                    <FaArrowLeft className="me-2" /> Back to Courses
                </Button>
            </Container>
        );
    }

    return (
        <Container fluid>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Course Details</h2>
                <div>
                    <Button 
                        variant="primary" 
                        as={Link} 
                        to="/admin/courses"
                        className="me-2"
                    >
                        <FaArrowLeft className="me-2" /> Back to Courses
                    </Button>
                    <Button 
                        variant="warning" 
                        as={Link} 
                        to={`/admin/courses/${id}/edit`}
                        className="me-2"
                    >
                        <FaEdit className="me-2" /> Edit Course
                    </Button>
                    <Button 
                        variant={course.status === 'published' ? 'secondary' : 'success'} 
                        onClick={handlePublishToggle}
                        className="me-2"
                    >
                        {course.status === 'published' ? (
                            <>
                                <FaTimes className="me-2" /> Unpublish
                            </>
                        ) : (
                            <>
                                <FaCheck className="me-2" /> Publish
                            </>
                        )}
                    </Button>
                    <Button 
                        variant="danger" 
                        onClick={handleDelete}
                    >
                        <FaTrash className="me-2" /> Delete
                    </Button>
                </div>
            </div>

            <Tabs
                activeKey={activeTab}
                onSelect={(k) => setActiveTab(k)}
                className="mb-4"
            >
                <Tab eventKey="details" title="Course Details">
                    <Row>
                        <Col md={8}>
                            <Card className="mb-4">
                                <Card.Header>
                                    <h3>{course.title}</h3>
                                    <Badge bg={
                                        course.status === 'published' ? 'success' :
                                        course.status === 'draft' ? 'warning' : 'secondary'
                                    }>
                                        {course.status || 'draft'}
                                    </Badge>
                                </Card.Header>
                                <Card.Body>
                                    <h5>Description</h5>
                                    <p>{course.description}</p>
                                    
                                    <Row className="mt-4">
                                        <Col md={6}>
                                            <h5>Category</h5>
                                            <p>{course.category_name || 'N/A'}</p>
                                        </Col>
                                        <Col md={6}>
                                            <h5>Instructor</h5>
                                            <p>{course.instructor_name || 'N/A'}</p>
                                        </Col>
                                    </Row>
                                    
                                    <Row className="mt-2">
                                        <Col md={6}>
                                            <h5>Price</h5>
                                            <p>${course.price || '0.00'}</p>
                                        </Col>
                                        <Col md={6}>
                                            <h5>Created</h5>
                                            <p>{new Date(course.created_at).toLocaleDateString()}</p>
                                        </Col>
                                    </Row>
                                </Card.Body>
                            </Card>
                        </Col>
                        
                        <Col md={4}>
                            <Card className="mb-4">
                                <Card.Header>
                                    <h4>Course Statistics</h4>
                                </Card.Header>
                                <Card.Body>
                                    <ListGroup variant="flush">
                                        <ListGroup.Item className="d-flex justify-content-between align-items-center">
                                            Total Lessons
                                            <Badge bg="primary" pill>
                                                {course.lessons?.length || 0}
                                            </Badge>
                                        </ListGroup.Item>
                                        <ListGroup.Item className="d-flex justify-content-between align-items-center">
                                            Enrolled Students
                                            <Badge bg="primary" pill>
                                                {course.students?.length || 0}
                                            </Badge>
                                        </ListGroup.Item>
                                        <ListGroup.Item className="d-flex justify-content-between align-items-center">
                                            Reviews
                                            <Badge bg="primary" pill>
                                                {course.reviews?.length || 0}
                                            </Badge>
                                        </ListGroup.Item>
                                        <ListGroup.Item className="d-flex justify-content-between align-items-center">
                                            Average Rating
                                            <Badge bg="success" pill>
                                                {course.reviews?.length > 0 
                                                    ? (course.reviews.reduce((acc, review) => acc + review.rating, 0) / course.reviews.length).toFixed(1) 
                                                    : 'N/A'}
                                            </Badge>
                                        </ListGroup.Item>
                                    </ListGroup>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Tab>
                
                <Tab eventKey="lessons" title="Lessons">
                    <Card>
                        <Card.Header className="d-flex justify-content-between align-items-center">
                            <h4>Course Lessons</h4>
                            <Button variant="primary" size="sm">
                                <FaPlus className="me-2" /> Add Lesson
                            </Button>
                        </Card.Header>
                        <Card.Body>
                            {course.lessons && course.lessons.length > 0 ? (
                                <ListGroup>
                                    {course.lessons.map((lesson, index) => (
                                        <ListGroup.Item key={lesson.id} className="d-flex justify-content-between align-items-center">
                                            <div>
                                                <strong>{index + 1}. {lesson.title}</strong>
                                                <div className="text-muted">Duration: {lesson.duration}</div>
                                            </div>
                                            <div>
                                                <Button variant="info" size="sm" className="me-2">
                                                    <FaEye />
                                                </Button>
                                                <Button variant="warning" size="sm" className="me-2">
                                                    <FaEdit />
                                                </Button>
                                                <Button variant="danger" size="sm">
                                                    <FaTrash />
                                                </Button>
                                            </div>
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                            ) : (
                                <Alert variant="info">
                                    No lessons have been added to this course yet.
                                </Alert>
                            )}
                        </Card.Body>
                    </Card>
                </Tab>
                
                <Tab eventKey="students" title="Enrolled Students">
                    <Card>
                        <Card.Header>
                            <h4>Enrolled Students</h4>
                        </Card.Header>
                        <Card.Body>
                            {course.students && course.students.length > 0 ? (
                                <Table striped bordered hover responsive>
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Name</th>
                                            <th>Email</th>
                                            <th>Enrolled Date</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {course.students.map((student, index) => (
                                            <tr key={student.id}>
                                                <td>{index + 1}</td>
                                                <td>{student.name}</td>
                                                <td>{student.email}</td>
                                                <td>{new Date(student.enrolled_date).toLocaleDateString()}</td>
                                                <td>
                                                    <Button variant="info" size="sm" className="me-2">
                                                        <FaEye />
                                                    </Button>
                                                    <Button variant="danger" size="sm">
                                                        <FaTrash /> Unenroll
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            ) : (
                                <Alert variant="info">
                                    No students are enrolled in this course yet.
                                </Alert>
                            )}
                        </Card.Body>
                    </Card>
                </Tab>
                
                <Tab eventKey="reviews" title="Reviews">
                    <Card>
                        <Card.Header>
                            <h4>Course Reviews</h4>
                        </Card.Header>
                        <Card.Body>
                            {course.reviews && course.reviews.length > 0 ? (
                                course.reviews.map(review => (
                                    <Card key={review.id} className="mb-3">
                                        <Card.Body>
                                            <div className="d-flex justify-content-between">
                                                <h5>{review.student_name}</h5>
                                                <div>
                                                    Rating: <Badge bg="success">{review.rating}</Badge>
                                                </div>
                                            </div>
                                            <p>{review.comment}</p>
                                            <small className="text-muted">
                                                Posted on {new Date(review.created_at).toLocaleDateString()}
                                            </small>
                                        </Card.Body>
                                    </Card>
                                ))
                            ) : (
                                <Alert variant="info">
                                    No reviews have been submitted for this course yet.
                                </Alert>
                            )}
                        </Card.Body>
                    </Card>
                </Tab>
            </Tabs>
        </Container>
    );
};

export default CourseDetails;
