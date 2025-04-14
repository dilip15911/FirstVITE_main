import axios from 'axios';
import { toast } from 'react-toastify';

// Base URL for API calls - includes the /api prefix
export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
export const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add request interceptor to handle tokens
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = token.startsWith('Bearer ') ? 
                token : 
                `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor to handle errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.error('API Error:', error.response.data);
            toast.error(error.response.data.message || 'An error occurred');
        } else if (error.request) {
            // The request was made but no response was received
            console.error('Network Error:', error.message);
            toast.error('Network error occurred');
        } else {
            // Something happened in setting up the request that triggered an Error
            console.error('Error:', error.message);
            toast.error('An error occurred');
        }
        return Promise.reject(error);
    }
);
