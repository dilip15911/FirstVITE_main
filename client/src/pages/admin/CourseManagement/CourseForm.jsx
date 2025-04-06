import React, { useState, useEffect, useCallback } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../../utils/api';
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
                return;
            }
            if (!course.category_id || !categories.some(cat => cat.id.toString() === course.category_id)) {
                setError('Please select a valid category from the dropdown');
                return;
            }
            if (!course.description.trim()) {
                setError('Please enter a course description');
                return;
            }

            // Create FormData
            const formData = new FormData();
            formData.append('title', course.title);
            formData.append('description', course.description);
            formData.append('category_id', parseInt(course.category_id)); // Convert to number
            
            if (course.thumbnail) {
                formData.append('thumbnail', course.thumbnail);
            }

            console.log('Form data being sent:', {
                title: formData.get('title'),
                category_id: formData.get('category_id'),
                description: formData.get('description'),
                hasThumbnail: formData.get('thumbnail') ? 'Yes' : 'No'
            });

            // Check if we have a valid token
            const token = localStorage.getItem('token');
            if (!token) {
                setError('Not authenticated. Please log in again.');
                toast.error('Not authenticated. Please log in again.');
                return;
            }

            try {
                const response = await api.createCourse(formData);
                
                if (response.success) {
                    toast.success('Course created successfully!');
                    navigate('/admin/dashboard');
                } else {
                    setError(response.message || 'Failed to create course. Please try again.');
                    toast.error(response.message || 'Failed to create course');
                }
            } catch (apiError) {
                console.error('Course creation error:', {
                    message: apiError.message,
                    response: apiError.response?.data,
                    status: apiError.response?.status,
                    config: apiError.config
                });
                
                if (apiError.response?.status === 401) {
                    setError('Authentication required. Please log in again.');
                    toast.error('Session expired. Please log in again.');
                    // Clear token and redirect to login
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    navigate('/login');
                } else if (apiError.response?.status === 400) {
                    setError(apiError.response.data?.message || 'Invalid data provided. Please check your input and try again.');
                    toast.error(apiError.response.data?.message || 'Invalid data provided');
                } else {
                    setError('Server error while creating course. Please try again later.');
                    toast.error('Server error encountered');
                }
            }
        } catch (error) {
            console.error('Unexpected error:', error);
            setError('An unexpected error occurred. Please try again.');
            toast.error('An unexpected error occurred');
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
