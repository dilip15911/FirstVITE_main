import axios from 'axios';
import { toast } from 'react-toastify';
// import { API_URL } from '../config/api';

// Base URL for API calls - includes the /api prefix
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Log the configuration for debugging
console.log('CourseService using API URL:', API_URL);

export const fetchCourses = async (searchTerm = '', category = 'all') => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No authentication token found');
        }

        const isAdmin = localStorage.getItem('isAdmin') === 'true';
        const endpoint = isAdmin ? '/courses' : '/courses';

        console.log('Fetching from endpoint:', `${API_URL}${endpoint}`);
        
        try {
            const response = await axios.get(`${API_URL}${endpoint}`, {
                params: {
                    role: isAdmin ? 'admin' : 'user'
                },
                headers: {
                    'Authorization': token.startsWith('Bearer ') ? token : `Bearer ${token}`
                }
            });

        if (response.data && response.data.success) {
            return response.data.data;
        }
        throw new Error('Failed to fetch courses');
        } catch (error) {
            if (error.response?.status === 401) {
                // Handle token refresh
                try {
                    const refreshToken = localStorage.getItem('refreshToken');
                    if (!refreshToken) throw new Error('No refresh token found');

                    const refreshResponse = await axios.post(`${API_URL}/auth/refresh`, {
                        refreshToken
                    });

                    if (refreshResponse.data && refreshResponse.data.success) {
                        localStorage.setItem('token', refreshResponse.data.token);
                        // Retry the original request with new token
                        const retryResponse = await axios.get(`${API_URL}${endpoint}`, {
                            headers: {
                                'Authorization': `Bearer ${refreshResponse.data.token}`
                            }
                        });
                        if (retryResponse.data && retryResponse.data.success) {
                            return retryResponse.data.data;
                        }
                        throw new Error('Failed to fetch courses after token refresh');
                    }
                } catch (refreshError) {
                    console.error('Token refresh failed:', refreshError);
                    toast.error('Session expired. Please log in again.');
                    localStorage.removeItem('token');
                    localStorage.removeItem('refreshToken');
                    localStorage.removeItem('isAdmin');
                    window.location.href = '/login';
                    throw refreshError;
                }
            }
            throw error;
        }
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
            throw new Error('No authentication token found');
        }

        const isAdmin = localStorage.getItem('isAdmin') === 'true';
        const endpoint = isAdmin ? '/courses' : '/courses';

        console.log('Searching courses with:', { searchTerm, category });
        
        try {
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
            if (error.response?.status === 401) {
                // Handle token refresh
                try {
                    const refreshToken = localStorage.getItem('refreshToken');
                    if (!refreshToken) throw new Error('No refresh token found');

                    const refreshResponse = await axios.post(`${API_URL}/auth/refresh`, {
                        refreshToken
                    });

                    if (refreshResponse.data && refreshResponse.data.success) {
                        localStorage.setItem('token', refreshResponse.data.token);
                        // Retry the original request with new token
                        const retryResponse = await axios.get(`${API_URL}${endpoint}`, {
                            headers: {
                                'Authorization': `Bearer ${refreshResponse.data.token}`
                            }
                        });
                        if (retryResponse.data && retryResponse.data.success) {
                            return retryResponse.data.data;
                        }
                        throw new Error('Failed to fetch courses after token refresh');
                    }
                } catch (refreshError) {
                    console.error('Token refresh failed:', refreshError);
                    toast.error('Session expired. Please log in again.');
                    localStorage.removeItem('token');
                    localStorage.removeItem('refreshToken');
                    localStorage.removeItem('isAdmin');
                    window.location.href = '/login';
                    throw refreshError;
                }
            }
            throw error;
        }
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
            throw new Error('No authentication token found');
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
            throw new Error('No authentication token found');
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
// export const fetchCourses = async () => {
//     try {
//         const token = localStorage.getItem('token');
//         if (!token) {
//             throw new Error('No authentication token found');
//         }

//         const response = await axios.get(`${API_URL}/courses`, {
//             headers: {
//                 'Authorization': token.startsWith('Bearer ') ? token : `Bearer ${token}`
//             }
//         });
//         return response.data.data;
//     } catch (error) {
//         console.error('Error fetching courses:', error);
//         toast.error(error.response?.data?.message || 'Failed to fetch courses');
//         throw error;
//     }
// };

// Delete a course
export const deleteCourse = async (courseId) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No authentication token found');
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
            throw new Error('No authentication token found');
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
            throw new Error('No authentication token found');
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
            throw new Error('No authentication token found');
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
