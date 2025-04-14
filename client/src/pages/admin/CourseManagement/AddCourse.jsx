import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Row, Col, Alert, Spinner, Card, CardGroup, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaSave, FaTimes, FaInfoCircle, FaCheck, FaExclamationTriangle, FaEye, FaEdit, FaTrash, FaUpload, FaPlus } from 'react-icons/fa';
import { createCourse, fetchCategories, fetchInstructors } from '../../../services/courseService';
import { toast } from 'react-toastify';

const AddCourse = () => {
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category_id: '',
        instructor_id: '',
        status: 'active',
        price: '',
        duration: '',
        level: 'beginner',
        image_url: '',
        objectives: [],
        prerequisites: [],
        curriculum: []
    });

    const [categories, setCategories] = useState([]);
    const [instructors, setInstructors] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [formErrors, setFormErrors] = useState({});
    const [imagePreview, setImagePreview] = useState(null);
    const [imageFile, setImageFile] = useState(null);

    useEffect(() => {
        loadOptions();
    }, []);

    const loadOptions = async () => {
        try {
            setLoading(true);
            const [categoriesData, instructorsData] = await Promise.all([
                fetchCategories(),
                fetchInstructors()
            ]);
            setCategories(categoriesData || []);
            setInstructors(instructorsData || []);
        } catch (err) {
            setError(err.message || 'Failed to load options');
            toast.error(err.message || 'Failed to load options');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        validateField(name, value);
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
                setImageFile(file);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAddObjective = () => {
        setFormData(prev => ({
            ...prev,
            objectives: [...prev.objectives, '']
        }));
    };

    const handleRemoveObjective = (index) => {
        setFormData(prev => ({
            ...prev,
            objectives: prev.objectives.filter((_, i) => i !== index)
        }));
    };

    const handleObjectiveChange = (index, value) => {
        setFormData(prev => ({
            ...prev,
            objectives: prev.objectives.map((obj, i) => 
                i === index ? value : obj
            )
        }));
    };

    const handleAddPrerequisite = () => {
        setFormData(prev => ({
            ...prev,
            prerequisites: [...prev.prerequisites, '']
        }));
    };

    const handleRemovePrerequisite = (index) => {
        setFormData(prev => ({
            ...prev,
            prerequisites: prev.prerequisites.filter((_, i) => i !== index)
        }));
    };

    const handlePrerequisiteChange = (index, value) => {
        setFormData(prev => ({
            ...prev,
            prerequisites: prev.prerequisites.map((prereq, i) => 
                i === index ? value : prereq
            )
        }));
    };

    const handleAddCurriculum = () => {
        setFormData(prev => ({
            ...prev,
            curriculum: [...prev.curriculum, { title: '', description: '' }]
        }));
    };

    const handleRemoveCurriculum = (index) => {
        setFormData(prev => ({
            ...prev,
            curriculum: prev.curriculum.filter((_, i) => i !== index)
        }));
    };

    const handleCurriculumChange = (index, field, value) => {
        setFormData(prev => ({
            ...prev,
            curriculum: prev.curriculum.map((item, i) => 
                i === index ? { ...item, [field]: value } : item
            )
        }));
    };

    const validateField = (name, value) => {
        let error = '';
        
        switch (name) {
            case 'title':
                error = !value ? 'Title is required' : '';
                break;
            case 'description':
                error = !value ? 'Description is required' : '';
                break;
            case 'category_id':
                error = !value ? 'Category is required' : '';
                break;
            case 'instructor_id':
                error = !value ? 'Instructor is required' : '';
                break;
            case 'status':
                error = !value ? 'Status is required' : '';
                break;
            default:
                break;
        }

        setFormErrors(prev => ({
            ...prev,
            [name]: error
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate all fields
        const errors = {};
        Object.keys(formData).forEach(key => {
            validateField(key, formData[key]);
        });

        if (Object.values(formErrors).some(error => error)) {
            toast.error('Please fix the form errors');
            return;
        }

        try {
            setLoading(true);
            setError(null);

            // If image file exists, upload it first
            let imageUrl = formData.image_url;
            if (imageFile) {
                // TODO: Implement image upload functionality
                // This will depend on your backend implementation
                imageUrl = imageFile;
            }

            // Prepare the data to send
            const courseData = {
                ...formData,
                image_url: imageUrl
            };

            await createCourse(courseData);
            toast.success('Course created successfully');
            navigate('/admin/course-management');
        } catch (err) {
            setError(err.message || 'Failed to create course');
            toast.error(err.message || 'Failed to create course');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container fluid className="p-4">
            <Row className="mb-4">
                <Col>
                    <h2>Add New Course</h2>
                </Col>
            </Row>

            {error && (
                <Alert variant="danger" className="mb-4">
                    {error}
                </Alert>
            )}

            <Card>
                <Card.Body>
                    <Form onSubmit={handleSubmit}>
                        {/* Basic Information */}
                        <Card className="mb-4">
                            <Card.Header>
                                <h4>Basic Information</h4>
                            </Card.Header>
                            <Card.Body>
                                <Row>
                                    <Col md={6}>
                                        <Form.Group controlId="title">
                                            <Form.Label>Title *</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="title"
                                                value={formData.title}
                                                onChange={handleChange}
                                                isInvalid={!!formErrors.title}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {formErrors.title}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>

                                    <Col md={6}>
                                        <Form.Group controlId="status">
                                            <Form.Label>Status *</Form.Label>
                                            <Form.Select
                                                name="status"
                                                value={formData.status}
                                                onChange={handleChange}
                                                isInvalid={!!formErrors.status}
                                            >
                                                <option value="active">Active</option>
                                                <option value="inactive">Inactive</option>
                                            </Form.Select>
                                            <Form.Control.Feedback type="invalid">
                                                {formErrors.status}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Form.Group controlId="description" className="mb-4">
                                    <Form.Label>Description *</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        isInvalid={!!formErrors.description}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {formErrors.description}
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <Row>
                                    <Col md={6}>
                                        <Form.Group controlId="category_id">
                                            <Form.Label>Category *</Form.Label>
                                            <Form.Select
                                                name="category_id"
                                                value={formData.category_id}
                                                onChange={handleChange}
                                                isInvalid={!!formErrors.category_id}
                                            >
                                                <option value="">Select a category</option>
                                                {categories.map(category => (
                                                    <option key={category.id} value={category.id}>
                                                        {category.name}
                                                    </option>
                                                ))}
                                            </Form.Select>
                                            <Form.Control.Feedback type="invalid">
                                                {formErrors.category_id}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>

                                    <Col md={6}>
                                        <Form.Group controlId="instructor_id">
                                            <Form.Label>Instructor *</Form.Label>
                                            <Form.Select
                                                name="instructor_id"
                                                value={formData.instructor_id}
                                                onChange={handleChange}
                                                isInvalid={!!formErrors.instructor_id}
                                            >
                                                <option value="">Select an instructor</option>
                                                {instructors.map(instructor => (
                                                    <option key={instructor.id} value={instructor.id}>
                                                        {instructor.name}
                                                    </option>
                                                ))}
                                            </Form.Select>
                                            <Form.Control.Feedback type="invalid">
                                                {formErrors.instructor_id}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>

                        {/* Course Details */}
                        <Card className="mb-4">
                            <Card.Header>
                                <h4>Course Details</h4>
                            </Card.Header>
                            <Card.Body>
                                <Row>
                                    <Col md={4}>
                                        <Form.Group controlId="price">
                                            <Form.Label>Price</Form.Label>
                                            <Form.Control
                                                type="number"
                                                name="price"
                                                value={formData.price}
                                                onChange={handleChange}
                                            />
                                        </Form.Group>
                                    </Col>

                                    <Col md={4}>
                                        <Form.Group controlId="duration">
                                            <Form.Label>Duration (hours)</Form.Label>
                                            <Form.Control
                                                type="number"
                                                name="duration"
                                                value={formData.duration}
                                                onChange={handleChange}
                                            />
                                        </Form.Group>
                                    </Col>

                                    <Col md={4}>
                                        <Form.Group controlId="level">
                                            <Form.Label>Level</Form.Label>
                                            <Form.Select
                                                name="level"
                                                value={formData.level}
                                                onChange={handleChange}
                                            >
                                                <option value="beginner">Beginner</option>
                                                <option value="intermediate">Intermediate</option>
                                                <option value="advanced">Advanced</option>
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Form.Group controlId="objectives" className="mt-3">
                                    <Form.Label>Learning Objectives</Form.Label>
                                    {formData.objectives.map((objective, index) => (
                                        <div key={index} className="d-flex align-items-center mb-2">
                                            <Form.Control
                                                type="text"
                                                value={objective}
                                                onChange={(e) => handleObjectiveChange(index, e.target.value)}
                                                style={{ flex: 1 }}
                                            />
                                            <Button
                                                variant="outline-danger"
                                                size="sm"
                                                onClick={() => handleRemoveObjective(index)}
                                                className="ms-2"
                                            >
                                                <FaTrash />
                                            </Button>
                                        </div>
                                    ))}
                                    <Button
                                        variant="outline-primary"
                                        onClick={handleAddObjective}
                                        className="mt-2"
                                    >
                                        <FaPlus /> Add Objective
                                    </Button>
                                </Form.Group>

                                <Form.Group controlId="prerequisites" className="mt-3">
                                    <Form.Label>Prerequisites</Form.Label>
                                    {formData.prerequisites.map((prereq, index) => (
                                        <div key={index} className="d-flex align-items-center mb-2">
                                            <Form.Control
                                                type="text"
                                                value={prereq}
                                                onChange={(e) => handlePrerequisiteChange(index, e.target.value)}
                                                style={{ flex: 1 }}
                                            />
                                            <Button
                                                variant="outline-danger"
                                                size="sm"
                                                onClick={() => handleRemovePrerequisite(index)}
                                                className="ms-2"
                                            >
                                                <FaTrash />
                                            </Button>
                                        </div>
                                    ))}
                                    <Button
                                        variant="outline-primary"
                                        onClick={handleAddPrerequisite}
                                        className="mt-2"
                                    >
                                        <FaPlus /> Add Prerequisite
                                    </Button>
                                </Form.Group>

                                <Form.Group controlId="curriculum" className="mt-3">
                                    <Form.Label>Course Curriculum</Form.Label>
                                    {formData.curriculum.map((item, index) => (
                                        <div key={index} className="mb-3">
                                            <Row>
                                                <Col md={6}>
                                                    <Form.Group controlId={`curriculumTitle${index}`}>
                                                        <Form.Label>Module Title</Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            value={item.title}
                                                            onChange={(e) => handleCurriculumChange(index, 'title', e.target.value)}
                                                        />
                                                    </Form.Group>
                                                </Col>
                                                <Col md={6}>
                                                    <Form.Group controlId={`curriculumDesc${index}`}>
                                                        <Form.Label>Description</Form.Label>
                                                        <Form.Control
                                                            as="textarea"
                                                            rows={2}
                                                            value={item.description}
                                                            onChange={(e) => handleCurriculumChange(index, 'description', e.target.value)}
                                                        />
                                                    </Form.Group>
                                                </Col>
                                            </Row>
                                            <Button
                                                variant="outline-danger"
                                                size="sm"
                                                onClick={() => handleRemoveCurriculum(index)}
                                                className="mt-2"
                                            >
                                                <FaTrash /> Remove Module
                                            </Button>
                                        </div>
                                    ))}
                                    <Button
                                        variant="outline-primary"
                                        onClick={handleAddCurriculum}
                                        className="mt-2"
                                    >
                                        <FaPlus /> Add Module
                                    </Button>
                                </Form.Group>

                                <Form.Group controlId="image_url" className="mt-3">
                                    <Form.Label>Course Image</Form.Label>
                                    <Form.Control
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                    />
                                    {imagePreview && (
                                        <div className="mt-2">
                                            <img
                                                src={imagePreview}
                                                alt="Course"
                                                style={{ maxWidth: '200px', height: 'auto' }}
                                            />
                                        </div>
                                    )}
                                </Form.Group>
                            </Card.Body>
                        </Card>

                        <div className="mt-4">
                            <Button
                                variant="primary"
                                type="submit"
                                disabled={loading}
                                className="me-2"
                            >
                                {loading ? (
                                    <>
                                        <Spinner
                                            as="span"
                                            animation="border"
                                            size="sm"
                                            role="status"
                                            aria-hidden="true"
                                        />
                                        {' Saving...'}
                                    </>
                                ) : (
                                    'Save Course'
                                )}
                            </Button>
                            <Button
                                variant="secondary"
                                onClick={() => navigate('/admin/course-management')}
                            >
                                Cancel
                            </Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default AddCourse;
