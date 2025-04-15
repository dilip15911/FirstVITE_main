import React, { useState, useEffect } from 'react';
import {
    Container,
    Form,
    Button,
    Alert,
    Card,
    Row,
    Col,
    Tab,
    Tabs,
    Spinner,
    Image
} from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaSave, FaEye, FaCheck, FaArrowLeft } from 'react-icons/fa';
import { useAuth } from '../../../context/AuthContext';
import axios from 'axios';

// Base URL for API calls
const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// For clarity, we'll separate the base URL from the API prefix
// This makes it easier to construct correct endpoint paths
const API_PREFIX = '/api';
const API_BASE = BASE_URL.endsWith(API_PREFIX) ? BASE_URL.slice(0, -4) : BASE_URL;

// Log the configuration for debugging
console.log('CourseForm using API BASE:', API_BASE);
console.log('CourseForm using API PREFIX:', API_PREFIX);

const CourseForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const courseId = id || null;
    const isEditMode = !!courseId;
    const { user } = useAuth();

    const [course, setCourse] = useState({
        title: '',
        description: '',
        category_id: '',
        status: 'draft',
        level: 'beginner',
        preview_video_url: '',
        image_url: '',
        requirements: [],
        learning_outcomes: [],
        prerequisites: [],
        tags: [],
        resources: [],
        sections: []
    });

    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('details');
    const [showPreview, setShowPreview] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);
    const [showRequirementsModal, setShowRequirementsModal] = useState(false);
    const [showOutcomesModal, setShowOutcomesModal] = useState(false);
    const [showPrerequisitesModal, setShowPrerequisitesModal] = useState(false);
    const [showResourcesModal, setShowResourcesModal] = useState(false);
    const [showSectionsModal, setShowSectionsModal] = useState(false);

    useEffect(() => {
        fetchCategories();
        if (isEditMode) {
            fetchCourseDetails();
        }
    }, [isEditMode, id]);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_BASE}${API_PREFIX}/categories`);
            const data = response.data;
            if (data.success) {
                setCategories(data.data || []);
                // If in create mode, set the first category as default
                if (!isEditMode && categories.length > 0) {
                    setCourse(prev => ({
                        ...prev,
                        category_id: categories[0].id.toString()
                    }));
                }
            } else {
                throw new Error(data.message || 'Failed to fetch categories');
            }
        } catch (err) {
            console.error('Error fetching categories:', err);
            setError('Failed to fetch categories');
            // Set default categories if API fails
            const defaultCategories = [
                { id: 1, name: 'Web Development', description: 'Courses related to web technologies', image_url: '' },
                { id: 2, name: 'Mobile Development', description: 'Courses related to mobile app development', image_url: '' },
                { id: 3, name: 'Data Science', description: 'Courses related to data analysis and machine learning', image_url: '' },
                { id: 4, name: 'Design', description: 'Courses related to UI/UX design', image_url: '' }
            ];
            setCategories(defaultCategories);
            setCourse(prev => ({
                ...prev,
                category_id: defaultCategories[0].id.toString()
            }));
        } finally {
            setLoading(false);
        }
    };

    const fetchCourseDetails = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_BASE}${API_PREFIX}/admin/courses/${id}`);
            setCourse(response.data.data);
        } catch (err) {
            console.error('Error fetching course details:', err);
            setError('Failed to fetch course details');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCourse(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleArrayChange = (arrayName, index, value) => {
        setCourse(prev => {
            const newArray = [...prev[arrayName]];
            newArray[index] = value;
            return {
                ...prev,
                [arrayName]: newArray
            };
        });
    };

    const handleAddToArray = (arrayName) => {
        setCourse(prev => ({
            ...prev,
            [arrayName]: [...prev[arrayName], '']
        }));
    };

    const handleRemoveFromArray = (arrayName, index) => {
        setCourse(prev => {
            const newArray = [...prev[arrayName]];
            newArray.splice(index, 1);
            return {
                ...prev,
                [arrayName]: newArray
            };
        });
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result);
                setCourse(prev => ({
                    ...prev,
                    image_url: reader.result
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const validateForm = () => {
        if (!course.title.trim()) {
            setError('Please enter a course title');
            return false;
        }
        if (!course.description.trim()) {
            setError('Please enter a course description');
            return false;
        }
        if (!course.category_id || course.category_id === '') {
            setError('Please select a category');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate form before submission
        if (!validateForm()) {
            return;
        }

        setLoading(true);
        setError(null);

        // Prepare course data (move outside try block)
        const courseData = {
            title: course.title,
            description: course.description,
            category_id: parseInt(course.category_id), // Convert to number
            instructor_id: user?.id,
            status: course.status || 'draft',
            level: course.level,
            requirements: course.requirements.filter(req => req.trim() !== '').map(req => req.trim()),
            learning_outcomes: course.learning_outcomes.filter(outcome => outcome.trim() !== '').map(outcome => outcome.trim()),
            prerequisites: course.prerequisites.filter(prereq => prereq.trim() !== '').map(prereq => prereq.trim()),
            image_url: course.image_url,
            preview_video_url: course.preview_video_url
        };

        try {
            // Get the current token
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token found');
            }
            // Defensive: remove accidental 'Bearer ' prefix if present
            const cleanToken = token.replace(/^Bearer\s+/i, '');

            let response;

            // Set up common headers
            const headers = {
                'Authorization': `Bearer ${cleanToken}`,
                'Content-Type': 'application/json'
            };

            if (courseId) {
                console.log('Updating existing course');
                response = await axios.put(
                    `${API_BASE}${API_PREFIX}/admin/courses/${courseId}`,
                    courseData,
                    { headers }
                );
            } else {
                console.log('Creating new course');
                response = await axios.post(
                    `${API_BASE}${API_PREFIX}/courses`,
                    courseData,
                    { headers }
                );
            }

            if (response.data && response.data.success) {
                toast.success(isEditMode ? 'Course updated successfully!' : 'Course created successfully!');
                navigate('/admin/courses');
            } else {
                throw new Error(response.data.message || 'Operation failed');
            }
        } catch (err) {
            console.error('Course submission error:', err);
            // Handle token expiration
            if (err.response?.status === 401 && err.response?.data?.message?.includes('jwt expired')) {
                try {
                    // Try to refresh the token
                    const refreshToken = localStorage.getItem('refreshToken');
                    if (refreshToken) {
                        const refreshResponse = await axios.post(`${API_BASE}${API_PREFIX}/auth/refresh`, { refreshToken });
                        if (refreshResponse.data.success) {
                            localStorage.setItem('token', refreshResponse.data.token);
                            // Retry the original request with new token
                            await axios.post(`${API_BASE}${API_PREFIX}/courses`, courseData, {
                                headers: { Authorization: `Bearer ${refreshResponse.data.token}` }
                            });
                            toast.success('Course created successfully!');
                            navigate('/admin/courses');
                        } else {
                            // Refresh failed, redirect to login
                            toast.error('Session expired. Please log in again.');
                            localStorage.removeItem('token');
                            localStorage.removeItem('refreshToken');
                            navigate('/login');
                        }
                    } else {
                        // No refresh token, redirect to login
                        toast.error('Session expired. Please log in again.');
                        localStorage.removeItem('token');
                        localStorage.removeItem('refreshToken');
                        navigate('/login');
                    }
                } catch (refreshError) {
                    console.error('Token refresh failed:', refreshError);
                    toast.error('Session expired. Please log in again.');
                    localStorage.removeItem('token');
                    localStorage.removeItem('refreshToken');
                    navigate('/login');
                }
            } else {
                setError(err.response?.data?.message || 'Failed to save course');
                toast.error(err.response?.data?.message || 'Failed to save course');
            }
        } finally {
            setLoading(false);
        }


    };

    const handlePreview = () => {
        setShowPreview(true);
    };

    const handlePublish = async () => {
        if (window.confirm('Are you sure you want to publish this course?')) {
            try {
                const token = localStorage.getItem('token');
                await axios.put(
                    `${API_BASE}${API_PREFIX}/admin/courses/${id}/publish`,
                    {},
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    }
                );
                setCourse(prev => ({ ...prev, status: 'published' }));
                toast.success('Course published successfully!');
            } catch (err) {
                console.error('Error publishing course:', err);
                toast.error('Failed to publish course');
            }
        }
    };

    const handleEditSection = (section) => {
        // Find the index of the section to edit
        const index = course.sections.findIndex(s => s.title === section.title);
        if (index !== -1) {
            // Open the section modal with the current section data
            setCourse(prev => {
                const newSections = [...prev.sections];
                newSections[index] = {
                    ...section,
                    isEditing: true
                };
                return {
                    ...prev,
                    sections: newSections
                };
            });
            setShowSectionsModal(true);
        }
    };

    const handleRemoveSection = (index) => {
        if (window.confirm('Are you sure you want to remove this section?')) {
            setCourse(prev => {
                const newSections = [...prev.sections];
                newSections.splice(index, 1);
                return {
                    ...prev,
                    sections: newSections
                };
            });
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
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>{isEditMode ? 'Edit Course' : 'Create New Course'}</h2>
                <div>
                    <Button 
                        variant="secondary" 
                        onClick={() => navigate('/admin/courses')}
                        className="me-2"
                    >
                        <FaArrowLeft className="me-2" /> Back to Courses
                    </Button>
                    {isEditMode && course.status === 'draft' && (
                        <Button 
                            variant="success" 
                            onClick={handlePublish}
                            className="me-2"
                        >
                            <FaCheck className="me-2" /> Publish Course
                        </Button>
                    )}
                    <Button 
                        variant="primary" 
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <Spinner animation="border" size="sm" className="me-2" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <FaSave className="me-2" /> {isEditMode ? 'Update Course' : 'Create Course'}
                            </>
                        )}
                    </Button>
                </div>
            </div>

            {error && (
                <Alert variant="danger" onClose={() => setError(null)} dismissible>
                    {error}
                </Alert>
            )}

            <Card>
                <Card.Body>
                    <Tabs
                        activeKey={activeTab}
                        onSelect={(k) => setActiveTab(k)}
                        className="mb-4"
                    >
                        <Tab eventKey="details" title="Course Details">
                            <Form onSubmit={handleSubmit}>
                                {/* Course Title & Category */}
                                <Row>
                                    <Col md={8}>
                                        <Form.Group controlId="title" className="mb-3">
                                            <Form.Label>Course Title</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="title"
                                                value={course.title}
                                                onChange={handleChange}
                                                placeholder="Enter course title"
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={4}>
                                        <Form.Group controlId="category" className="mb-3">
                                            <Form.Label>Category <span className="text-danger">*</span></Form.Label>
                                            <Form.Select
                                                name="category_id"
                                                value={course.category_id}
                                                onChange={handleChange}
                                                required
                                            >
                                                <option value="">Select a category</option>
                                                {categories.map(category => (
                                                    <option key={category.id} value={category.id}>
                                                        {category.name}
                                                    </option>
                                                ))}
                                            </Form.Select>
                                            {course.category_id && (
                                                <div className="mt-2">
                                                    <div className="d-flex align-items-center mb-2">
                                                        {categories.find(c => c.id === parseInt(course.category_id))?.image_url && (
                                                            <Image
                                                                src={categories.find(c => c.id === parseInt(course.category_id))?.image_url}
                                                                thumbnail
                                                                style={{ maxWidth: '50px', maxHeight: '50px' }}
                                                                className="me-2"
                                                            />
                                                        )}
                                                        <div>
                                                            <strong>{categories.find(c => c.id === parseInt(course.category_id))?.name}</strong>
                                                            <p className="mb-0 small text-muted">
                                                                {categories.find(c => c.id === parseInt(course.category_id))?.description}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </Form.Group>
                                    </Col>
                                </Row>

                                {/* Course Description */}
                                <Form.Group controlId="description" className="mb-3">
                                    <Form.Label>Description</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={4}
                                        name="description"
                                        value={course.description}
                                        onChange={handleChange}
                                        placeholder="Enter course description"
                                        required
                                    />
                                </Form.Group>

                                {/* Course Details */}
                                <Row>
                                    <Col md={3}>
                                        <Form.Group controlId="level" className="mb-3">
                                            <Form.Label>Level</Form.Label>
                                            <Form.Select
                                                name="level"
                                                value={course.level}
                                                onChange={handleChange}
                                            >
                                                <option value="beginner">Beginner</option>
                                                <option value="intermediate">Intermediate</option>
                                                <option value="advanced">Advanced</option>
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                    <Col md={5}>
                                        <Form.Group controlId="previewVideo" className="mb-3">
                                            <Form.Label>Preview Video URL</Form.Label>
                                            <Form.Control
                                                type="url"
                                                name="preview_video_url"
                                                value={course.preview_video_url}
                                                onChange={handleChange}
                                                placeholder="Enter preview video URL"
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={4}>
                                        <Form.Group controlId="image" className="mb-3">
                                            <Form.Label>Course Image</Form.Label>
                                            <div className="d-flex align-items-center">
                                                <Form.Control
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleImageUpload}
                                                    className="me-2"
                                                />
                                                {previewImage && (
                                                    <Image
                                                        src={previewImage}
                                                        thumbnail
                                                        style={{ maxWidth: '100px', maxHeight: '100px' }}
                                                    />
                                                )}
                                            </div>
                                        </Form.Group>
                                    </Col>
                                </Row>



                                {/* Submit Button */}
                                <div className="d-flex justify-content-end mt-3">
                                    <Button 
                                        variant="secondary" 
                                        onClick={handlePreview}
                                        className="me-2"
                                    >
                                        <FaEye className="me-2" /> Preview Course
                                    </Button>
                                    <Button 
                                        variant="primary" 
                                        type="submit"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <Spinner animation="border" size="sm" className="me-2" />
                                                Saving...
                                            </>
                                        ) : (
                                            <>
                                                <FaSave className="me-2" /> {isEditMode ? 'Update Course' : 'Create Course'}
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </Form>
                        </Tab>
                    </Tabs>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default CourseForm;
