import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Card, Row, Col, Alert } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Editor } from '@tinymce/tinymce-react';

const CourseForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = !!id;

    const [course, setCourse] = useState({
        title: '',
        description: '',
        category: '',
        level: 'beginner',
        duration: '',
        price: '',
        prerequisites: '',
        learningObjectives: '',
        curriculum: '',
        status: 'draft',
        thumbnail: null,
        materials: []
    });

    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isEditMode) {
            fetchCourse();
        }
    }, [id]);

    const fetchCourse = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/courses/${id}`);
            setCourse(response.data);
        } catch (err) {
            setError('Failed to fetch course details');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCourse(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleEditorChange = (content, editor) => {
        setCourse(prev => ({
            ...prev,
            curriculum: content
        }));
    };

    const handleFileChange = (e) => {
        setCourse(prev => ({
            ...prev,
            thumbnail: e.target.files[0]
        }));
    };

    const handleMaterialUpload = (e) => {
        const files = Array.from(e.target.files);
        setCourse(prev => ({
            ...prev,
            materials: [...prev.materials, ...files]
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const formData = new FormData();
            Object.keys(course).forEach(key => {
                if (key === 'materials') {
                    course.materials.forEach(file => {
                        formData.append('materials', file);
                    });
                } else if (key === 'thumbnail' && course[key]) {
                    formData.append('thumbnail', course[key]);
                } else {
                    formData.append(key, course[key]);
                }
            });

            if (isEditMode) {
                await axios.put(`${process.env.REACT_APP_API_URL}/api/admin/courses/${id}`, formData);
                setSuccess('Course updated successfully');
            } else {
                await axios.post(`${process.env.REACT_APP_API_URL}/api/admin/courses`, formData);
                setSuccess('Course created successfully');
            }

            setTimeout(() => {
                navigate('/admin/courses');
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save course');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container>
            <h2>{isEditMode ? 'Edit Course' : 'Create New Course'}</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}

            <Form onSubmit={handleSubmit}>
                <Card className="mb-4">
                    <Card.Header>Basic Information</Card.Header>
                    <Card.Body>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Course Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="title"
                                        value={course.title}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Category</Form.Label>
                                    <Form.Select
                                        name="category"
                                        value={course.category}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Select Category</option>
                                        <option value="programming">Programming</option>
                                        <option value="web-development">Web Development</option>
                                        <option value="data-science">Data Science</option>
                                        <option value="devops">DevOps</option>
                                        <option value="mobile-dev">Mobile Development</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Form.Group className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                name="description"
                                value={course.description}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                    </Card.Body>
                </Card>

                <Card>
                    <Card.Body>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Course Logo</Form.Label>
                                    <Form.Control
                                        type="file"
                                        name="thumbnail"
                                        onChange={handleFileChange}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
                <Card>
                    <Card.Body>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Course Overview</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={2}
                                        name="courseOverview"
                                        value={course.courseOverview}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Key Features</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={2}
                                        name="keyFeatures"
                                        value={course.keyFeatures}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
                <Card>
                    <Card.Body>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Course Skills</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={2}
                                        name="courseSkills"
                                        value={course.skills}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Course Benefits</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={2}
                                        name="courseBenefits"
                                        value={course.benefits}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>

                <Card className="mb-4">
                    <Card.Header>Course Content</Card.Header>
                    <Card.Body>
                        <Form.Group className="mb-3">
                            <Form.Label>Prerequisites</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={2}
                                name="prerequisites"
                                value={course.prerequisites}
                                onChange={handleChange}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Learning Objectives</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                name="learningObjectives"
                                value={course.learningObjectives}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Curriculum</Form.Label>
                            <Editor
                                initialValue={course.curriculum}
                                init={{
                                    height: 400,
                                    menubar: false,
                                    plugins: [
                                        'advlist autolink lists link image charmap print preview anchor',
                                        'searchreplace visualblocks code fullscreen',
                                        'insertdatetime media table paste code help wordcount'
                                    ],
                                    toolbar: 'undo redo | formatselect | bold italic backcolor | \
                                        alignleft aligncenter alignright alignjustify | \
                                        bullist numlist outdent indent | removeformat | help'
                                }}
                                onEditorChange={handleEditorChange}
                            />
                        </Form.Group>
                    </Card.Body>
                </Card>


                <Card>
                    <Card.Body>
                        <Card.Header>FAQs</Card.Header>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Question</Form.Label>
                                    <Form.Control
                                        type="textarea"
                                        rows={3}
                                        name="faqs"
                                        value={course.faqs}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Answer</Form.Label>
                                    <Form.Control
                                        type="textarea"
                                        rows={3}
                                        name="faqs"
                                        value={course.faqs}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Question</Form.Label>
                                    <Form.Control
                                        type="textarea"
                                        rows={3}
                                        name="faqs"
                                        value={course.faqs}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Answer</Form.Label>
                                    <Form.Control
                                        type="textarea"
                                        rows={3}
                                        name="faqs"
                                        value={course.faqs}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Question</Form.Label>
                                    <Form.Control
                                        type="textarea"
                                        rows={3}
                                        name="faqs"
                                        value={course.faqs}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Answer</Form.Label>
                                    <Form.Control
                                        type="textarea"
                                        rows={3}
                                        name="faqs"
                                        value={course.faqs}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Question</Form.Label>
                                    <Form.Control
                                        type="textarea"
                                        rows={3}
                                        name="faqs"
                                        value={course.faqs}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Answer</Form.Label>
                                    <Form.Control
                                        type="textarea"
                                        rows={3}
                                        name="faqs"
                                        value={course.faqs}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Question</Form.Label>
                                    <Form.Control
                                        type="textarea"
                                        rows={3}
                                        name="faqs"
                                        value={course.faqs}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Answer</Form.Label>
                                    <Form.Control
                                        type="textarea"
                                        rows={3}
                                        name="faqs"
                                        value={course.faqs}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>

                <Card className="mb-4">
                    <Card.Header>Media & Materials</Card.Header>
                    <Card.Body>
                        <Form.Group className="mb-3">
                            <Form.Label>Course Thumbnail</Form.Label>
                            <Form.Control
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Course Materials</Form.Label>
                            <Form.Control
                                type="file"
                                multiple
                                onChange={handleMaterialUpload}
                            />
                            <Form.Text className="text-muted">
                                Upload PDFs, presentations, or other course materials
                            </Form.Text>
                        </Form.Group>
                    </Card.Body>
                </Card>

                <div className="d-flex justify-content-end gap-2 mb-4">
                    <Button variant="secondary" onClick={() => navigate('/admin/courses')}>
                        Cancel
                    </Button>
                    <Button variant="primary" type="submit" disabled={loading}>
                        {loading ? 'Saving...' : (isEditMode ? 'Update Course' : 'Create Course')}
                    </Button>
                </div>
            </Form>
        </Container>
    );
};

export default CourseForm;
