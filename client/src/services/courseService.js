import axios from 'axios';
import { toast } from 'react-toastify';
import { API_URL } from '../config/api';

// Get all categories
export const fetchCategories = async () => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('Not authenticated');
        }

        const response = await axios.get(`${API_URL}/categories`, {
            headers: {
                'Authorization': token.startsWith('Bearer ') ? token : `Bearer ${token}`
            }
        });
        return response.data.data;
    } catch (error) {
        console.error('Error fetching categories:', error);
        toast.error(error.response?.data?.message || 'Failed to fetch categories');
        throw error;
    }
};

// Get all instructors
export const fetchInstructors = async () => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('Not authenticated');
        }

        const response = await axios.get(`${API_URL}/users/instructors`, {
            headers: {
                'Authorization': token.startsWith('Bearer ') ? token : `Bearer ${token}`
            }
        });
        return response.data.data;
    } catch (error) {
        console.error('Error fetching instructors:', error);
        toast.error(error.response?.data?.message || 'Failed to fetch instructors');
        throw error;
    }
};

// Get all courses for admin
export const fetchCourses = async () => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('Not authenticated');
        }

        const response = await axios.get(`${API_URL}/courses`, {
            headers: {
                'Authorization': token.startsWith('Bearer ') ? token : `Bearer ${token}`
            }
        });
        return response.data.data;
    } catch (error) {
        console.error('Error fetching courses:', error);
        toast.error(error.response?.data?.message || 'Failed to fetch courses');
        throw error;
    }
};

// Delete a course
export const deleteCourse = async (courseId) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('Not authenticated');
        }

        const response = await axios.delete(`${API_URL}/courses/${courseId}`, {
            headers: {
                'Authorization': token.startsWith('Bearer ') ? token : `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error deleting course:', error);
        toast.error(error.response?.data?.message || 'Failed to delete course');
        throw error;
    }
};

// Get single course
export const getCourse = async (courseId) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('Not authenticated');
        }

        const response = await axios.get(`${API_URL}/courses/${courseId}`, {
            headers: {
                'Authorization': token.startsWith('Bearer ') ? token : `Bearer ${token}`
            }
        });
        return response.data.data;
    } catch (error) {
        console.error('Error fetching course:', error);
        toast.error(error.response?.data?.message || 'Failed to fetch course');
        throw error;
    }
};

// Create a new course
export const createCourse = async (courseData) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('Not authenticated');
        }

        const response = await axios.post(`${API_URL}/courses`, courseData, {
            headers: {
                'Authorization': token.startsWith('Bearer ') ? token : `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error creating course:', error);
        toast.error(error.response?.data?.message || 'Failed to create course');
        throw error;
    }
};

// Update an existing course
export const updateCourse = async (courseId, courseData) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('Not authenticated');
        }

        const response = await axios.put(`${API_URL}/courses/${courseId}`, courseData, {
            headers: {
                'Authorization': token.startsWith('Bearer ') ? token : `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        toast.success('Course updated successfully');
        return response.data.data;
    } catch (error) {
        console.error('Error updating course:', error);
        toast.error(error.response?.data?.message || 'Failed to update course');
        throw error;
    }
};

// Get course statistics
export const fetchCourseStats = async () => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('Not authenticated');
        }

        const response = await axios.get(`${API_URL}/courses/stats`, {
            headers: {
                'Authorization': token.startsWith('Bearer ') ? token : `Bearer ${token}`
            }
        });
        return response.data.data;
    } catch (error) {
        console.error('Error fetching course statistics:', error);
        toast.error(error.response?.data?.message || 'Failed to fetch course statistics');
        throw error;
    }
};
