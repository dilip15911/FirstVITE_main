import React, { useState, useEffect, useCallback } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../../utils/api';
import axios from 'axios';
import { toast } from 'react-toastify';

const CourseForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const courseId = id || null; // Store courseId in a variable for use
    const isEditMode = !!courseId;

    const [course, setCourse] = useState({
        title: '',
        description: '',
        category_id: '1', // Default to first category
        category_name: '',
        status: 'draft'
    });

    const [categories, setCategories] = useState([]);
    const [loadingCategories, setLoadingCategories] = useState(true);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Fetch categories when component mounts
        const fetchCategories = async () => {
            try {
                const response = await api.getCourses();
                if (response.success && response.data) {
                    const categoriesData = response.data.categories || [];
                    if (categoriesData.length > 0) {
                        setCategories(categoriesData);
                        // Set default category to first one
                        setCourse(prev => ({
                            ...prev,
                            category_id: categoriesData[0].id.toString(),
                            category_name: categoriesData[0].name
                        }));
                    }
                } else {
                    // Set default categories if fetch fails
                    const defaultCategories = [
                        { id: 1, name: 'Web Development', slug: 'web-development' },
                        { id: 2, name: 'Mobile Development', slug: 'mobile-development' },
                        { id: 3, name: 'Data Science', slug: 'data-science' },
                        { id: 4, name: 'Design', slug: 'design' },
                        { id: 5, name: 'Business', slug: 'business' },
                        { id: 6, name: 'Marketing', slug: 'marketing' },
                        { id: 7, name: 'Personal Development', slug: 'personal-development' }
                    ];
                    setCategories(defaultCategories);
                    // Set first default category
                    setCourse(prev => ({
                        ...prev,
                        category_id: defaultCategories[0].id.toString(),
                        category_name: defaultCategories[0].name
                    }));
                }
            } catch (error) {
                console.error('Failed to fetch categories:', error);
                toast.error('Failed to load categories from server. Using default categories.');
                // Set default categories if fetch fails
                const defaultCategories = [
                    { id: 1, name: 'Web Development', slug: 'web-development' },
                    { id: 2, name: 'Mobile Development', slug: 'mobile-development' },
                    { id: 3, name: 'Data Science', slug: 'data-science' },
                    { id: 4, name: 'Design', slug: 'design' },
                    { id: 5, name: 'Business', slug: 'business' },
                    { id: 6, name: 'Marketing', slug: 'marketing' },
                    { id: 7, name: 'Personal Development', slug: 'personal-development' }
                ];
                setCategories(defaultCategories);
                // Set first default category
                setCourse(prev => ({
                    ...prev,
                    category_id: defaultCategories[0].id.toString(),
                    category_name: defaultCategories[0].name
                }));
            } finally {
                setLoadingCategories(false);
            }
        };
        fetchCategories();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCourse(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        
        try {
            // Validate required fields
            if (!course.title.trim()) {
                setError('Please enter a course title');
                setLoading(false);
                return;
            }
            if (!course.category_id || !categories.some(cat => cat.id.toString() === course.category_id)) {
                setError('Please select a valid category from the dropdown');
                setLoading(false);
                return;
            }
            if (!course.description.trim()) {
                setError('Please enter a course description');
                setLoading(false);
                return;
            }

            // Get authentication data
            const token = localStorage.getItem('token');
            const userData = localStorage.getItem('userData');
            const adminData = localStorage.getItem('adminData');

            // Check if we have a valid token and user ID
            if (!token || (!userData && !adminData)) {
                setError('Not authenticated. Please log in again.');
                toast.error('Not authenticated. Please log in again.');
                setLoading(false);
                setTimeout(() => {
                    navigate(window.location.pathname.includes('/admin') ? '/admin/login' : '/login');
                }, 1500);
                return;
            }

            let userId = null;
            if (userData) {
                const parsedUserData = JSON.parse(userData);
                userId = parsedUserData.id;
            } else if (adminData) {
                const parsedAdminData = JSON.parse(adminData);
                userId = parsedAdminData.id;
            }

            // Prepare course data for submission
            const courseData = {
                title: course.title,
                description: course.description,
                category_id: parseInt(course.category_id) || 1, // Convert to number and use default if invalid
                instructor_id: userId
            };

            console.log('Submitting course data:', courseData);
            
            // We'll handle file uploads separately if needed
            const hasThumbnail = !!course.thumbnail;

            console.log('Course data being sent:', {
                title: courseData.title,
                category_id: courseData.category_id,
                description: courseData.description.substring(0, 30) + '...',
                hasThumbnail: hasThumbnail
            });

            // Check if we're in admin section
            const isAdminSection = window.location.pathname.includes('/admin');
            
            // Use the main endpoint for both admin and instructor
            // This avoids the 500 error with the admin endpoint
            const endpoint = '/api/courses';
            
            console.log('Sending request to:', endpoint);
            console.log('Using token:', token);

            try {
                // Make the API request with explicit headers
                const response = await axios.post(
                    `http://localhost:5000${endpoint}`, 
                    courseData, 
                    {       
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': token.startsWith('Bearer ') ? token : `Bearer ${token}`
                        }
                    }
                );
                
                console.log('Course creation response:', response.data);
                
                if (response.data && response.data.success) {
                    // Show success message
                    toast.success('Course created successfully!');
                    
                    // Clear any previous errors
                    setError('');
                    
                    // Reset form data
                    setCourse({
                        title: '',
                        description: '',
                        category_id: '',
                        thumbnail: null
                    });
                    
                    // Navigate after a short delay
                    setTimeout(() => {
                        try {
                            navigate(isAdminSection ? '/admin/courses' : '/courses');
                        } catch (navError) {
                            console.error('Navigation error:', navError);
                            // If navigation fails, at least show success
                            setError('');
                        }
                    }, 1000);
                } else {
                    setError(response.data?.message || 'Failed to create course. Please try again.');
                    toast.error(response.data?.message || 'Failed to create course');
                }
            } catch (apiError) {
                console.error('Course creation error:', apiError);
                
                // Log detailed error information for debugging
                console.log('API Error Details:', {
                    message: apiError.message,
                    response: apiError.response?.data,
                    status: apiError.response?.status,
                    stack: apiError.stack
                });
                
                if (apiError.response?.status === 401) {
                    setError('Authentication required. Please log in again.');
                    toast.error('Session expired. Please log in again.');
                    // Don't clear token immediately to allow user to see the error
                    setTimeout(() => {
                        localStorage.removeItem('token');
                        localStorage.removeItem('userData');
                        localStorage.removeItem('adminData');
                        try {
                            navigate(isAdminSection ? '/admin/login' : '/login');
                        } catch (navError) {
                            console.error('Navigation error:', navError);
                            window.location.href = isAdminSection ? '/admin/login' : '/login';
                        }
                    }, 2000);
                } else if (apiError.response?.status === 400) {
                    setError(apiError.response.data?.message || 'Invalid data provided. Please check your input and try again.');
                    toast.error(apiError.response.data?.message || 'Invalid data provided');
                } else if (apiError.response?.status === 404) {
                    setError('API endpoint not found. Please contact the administrator.');
                    toast.error('API endpoint not found');
                } else if (apiError.response?.status === 500) {
                    // Special handling for 500 errors
                    const errorMessage = apiError.response.data?.message || 'Server error while creating course';
                    setError(errorMessage + '. Please try again later.');
                    toast.error(errorMessage);
                    
                    // Check if the course might have been created despite the error
                    if (apiError.response.data?.courseId) {
                        console.log('Course may have been created with ID:', apiError.response.data.courseId);
                        toast.info('Your course might have been created despite the error. Please check the courses list.');
                    }
                } else {
                    setError('Server error while creating course. Please try again later.');
                    toast.error('Server error encountered');
                }
            }
        } catch (error) {
            console.error('Unexpected error:', error);
            console.error('Error stack:', error.stack);
            
            // More detailed error message
            setError('An unexpected error occurred: ' + (error.message || 'Unknown error') + '. Please try again.');
            toast.error('An unexpected error occurred');
            
            // Try to recover by checking if the course was created
            try {
                // We could add an API call here to check if the course was created
                console.log('Attempting to recover from error...');
            } catch (recoveryError) {
                console.error('Recovery attempt failed:', recoveryError);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e) => {
        setCourse(prev => ({
            ...prev,
            thumbnail: e.target.files[0]
        }));
    };

    return (
        <Container>
            <h2>{isEditMode ? 'Edit Course' : 'Create New Course'}</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="title">
                    <Form.Label>Title *</Form.Label>
                    <Form.Control
                        type="text"
                        name="title"
                        value={course.title}
                        onChange={handleChange}
                        required
                        placeholder="Enter course title"
                    />
                </Form.Group>
                <Form.Group controlId="category">
                    <Form.Label>Category *</Form.Label>
                    <Form.Select 
                        name="category_id" 
                        value={course.category_id} 
                        onChange={handleChange} 
                        required
                        disabled={loadingCategories}
                    >
                        <option value="">Select Category</option>
                        {categories.map(category => (
                            <option 
                                key={category.id} 
                                value={category.id.toString()}
                            >
                                {category.name} (ID: {category.id})
                            </option>
                        ))}
                    </Form.Select>
                    {loadingCategories && (
                        <Form.Text className="text-muted">
                            Loading categories...
                        </Form.Text>
                    )}
                </Form.Group>
                <Form.Group controlId="description">
                    <Form.Label>Description *</Form.Label>
                    <Form.Control
                        as="textarea"
                        name="description"
                        value={course.description}
                        onChange={handleChange}
                        required
                        rows={3}
                        placeholder="Enter course description"
                    />
                </Form.Group>
                <Form.Group controlId="thumbnail">
                    <Form.Label>Course Thumbnail</Form.Label>
                    <Form.Control
                        type="file"
                        name="thumbnail"
                        onChange={handleFileChange}
                        accept="image/*"
                    />
                    {course.thumbnail && (
                        <div className="mt-2">
                            <img 
                                src={URL.createObjectURL(course.thumbnail)} 
                                alt="Preview" 
                                style={{ maxWidth: '200px', maxHeight: '200px' }}
                            />
                        </div>
                    )}
                </Form.Group>
                <Button variant="primary" type="submit" disabled={loading}>
                    {loading ? 'Creating...' : 'Create Course'}
                </Button>
            </Form>
        </Container>
    );
};

export default CourseForm;
