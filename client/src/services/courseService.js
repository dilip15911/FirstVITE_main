import axios from 'axios';
import { toast } from 'react-toastify';

// Base URL for API calls - includes the /api prefix
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Log the configuration for debugging
console.log('CourseService using API URL:', API_URL);

export const fetchCourses = async (searchTerm = '', category = 'all') => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            // For testing, use a mock token
            localStorage.setItem('token', 'Bearer mock-token-for-testing');
            localStorage.setItem('isAdmin', 'true');
        }

        const isAdmin = localStorage.getItem('isAdmin') === 'true';
        const endpoint = isAdmin ? '/admin/courses' : '/courses';

        console.log('Fetching from endpoint:', `${API_URL}${endpoint}`);
        
        const response = await axios.get(`${API_URL}${endpoint}`, {
            headers: {
                'Authorization': token.startsWith('Bearer ') ? token : `Bearer ${token}`
            }
        });

        if (response.data && response.data.success) {
            return response.data.data;
        }
        throw new Error('Failed to fetch courses');
    } catch (error) {
        console.error('Error fetching courses:', error);
        toast.error(error.response?.data?.message || 'Failed to fetch courses');
        throw error;
    }
};

export const fetchCoursesWithFilters = async (searchTerm = '', category = 'all') => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            // For testing, use a mock token
            localStorage.setItem('token', 'Bearer mock-token-for-testing');
            localStorage.setItem('isAdmin', 'true');
        }

        const isAdmin = localStorage.getItem('isAdmin') === 'true';
        const endpoint = isAdmin ? '/admin/courses' : '/courses';

        console.log('Searching courses with:', { searchTerm, category });
        
        const response = await axios.get(`${API_URL}${endpoint}`, {
            headers: {
                'Authorization': token.startsWith('Bearer ') ? token : `Bearer ${token}`
            },
            params: {
                query: searchTerm,
                category: category
            }
        });

        if (response.data && response.data.success) {
            return response.data.data;
        }
        throw new Error('Failed to fetch courses');
    } catch (error) {
        console.error('Error searching courses:', error);
        toast.error(error.response?.data?.message || 'Failed to search courses');
        throw error;
    }
};

export const fetchCategories = async () => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            // For testing, use a mock token
            localStorage.setItem('token', 'Bearer mock-token-for-testing');
            localStorage.setItem('isAdmin', 'true');
        }

        console.log('Fetching categories from:', `${API_URL}/categories`);
        const response = await axios.get(`${API_URL}/categories`, {
            headers: {
                'Authorization': token.startsWith('Bearer ') ? token : `Bearer ${token}`
            }
        });

        if (response.data && response.data.success) {
            return response.data.data;
        }
        throw new Error('Failed to fetch categories');
    } catch (error) {
        console.error('Error fetching categories:', error);
        toast.error(error.response?.data?.message || 'Failed to fetch categories');
        throw error;
    }
};

export const createCourse = async (courseData) => {
    try {
        console.log('Creating course with data:', courseData);
        
        const token = localStorage.getItem('token');
        if (!token) {
            // For testing, use a mock token
            localStorage.setItem('token', 'Bearer mock-token-for-testing');
            localStorage.setItem('isAdmin', 'true');
        }

        const isAdmin = localStorage.getItem('isAdmin') === 'true';
        const endpoint = isAdmin ? '/admin/courses/direct' : '/courses/create';

        console.log('Creating course at endpoint:', `${API_URL}${endpoint}`);
        
        const response = await axios.post(`${API_URL}${endpoint}`, courseData, {
            headers: {
                'Authorization': token.startsWith('Bearer ') ? token : `Bearer ${token}`
            }
        });

        if (response.data && response.data.success) {
            return response.data.data;
        }
        throw new Error('Failed to create course');
    } catch (error) {
        console.error('Error creating course:', error);
        toast.error(error.response?.data?.message || 'Failed to create course');
        throw error;
    }
};

export const updateCourse = async (courseId, courseData) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            // For testing, use a mock token
            localStorage.setItem('token', 'Bearer mock-token-for-testing');
            localStorage.setItem('isAdmin', 'true');
        }

        console.log('Updating course with ID:', courseId);
        
        const response = await axios.put(`${API_URL}/admin/courses/${courseId}`, courseData, {
            headers: {
                'Authorization': token.startsWith('Bearer ') ? token : `Bearer ${token}`
            }
        });

        if (response.data && response.data.success) {
            return response.data.data;
        }
        throw new Error('Failed to update course');
    } catch (error) {
        console.error('Error updating course:', error);
        toast.error(error.response?.data?.message || 'Failed to update course');
        throw error;
    }
};

export const deleteCourse = async (courseId) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            // For testing, use a mock token
            localStorage.setItem('token', 'Bearer mock-token-for-testing');
            localStorage.setItem('isAdmin', 'true');
        }

        console.log('Deleting course with ID:', courseId);
        
        const response = await axios.delete(`${API_URL}/admin/courses/${courseId}`, {
            headers: {
                'Authorization': token.startsWith('Bearer ') ? token : `Bearer ${token}`
            }
        });

        if (response.data && response.data.success) {
            return true;
        }
        throw new Error('Failed to delete course');
    } catch (error) {
        console.error('Error deleting course:', error);
        toast.error(error.response?.data?.message || 'Failed to delete course');
        throw error;
    }
};
