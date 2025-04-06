import React, { useState, useEffect } from 'react';
import { Container, Button, Alert } from 'react-bootstrap';
import { api } from '../../../utils/api';

const TestAuth = () => {
    const [authStatus, setAuthStatus] = useState('');
    const [error, setError] = useState('');
    const [token, setToken] = useState('');

    useEffect(() => {
        // Get and display the current token
        const currentToken = localStorage.getItem('token');
        setToken(currentToken || 'No token found');
    }, []);

    const testAuth = async () => {
        try {
            setAuthStatus('Testing...');
            setError('');
            
            // Make a simple authenticated request
            const response = await api.get('/users/profile');
            
            setAuthStatus(`Authentication successful! User: ${response.data.user.name}`);
        } catch (err) {
            console.error('Auth test error:', err);
            setError(err.response?.data?.message || 'Authentication failed');
            setAuthStatus('Failed');
        }
    };

    const loginAsAdmin = async () => {
        try {
            setAuthStatus('Logging in...');
            setError('');
            
            // Admin credentials - replace with your actual admin credentials
            const response = await api.post('/auth/admin/login', {
                username: 'admin',
                password: 'admin123'
            });
            
            localStorage.setItem('token', response.data.token);
            setToken(response.data.token);
            setAuthStatus('Admin login successful!');
        } catch (err) {
            console.error('Login error:', err);
            setError(err.response?.data?.message || 'Login failed');
            setAuthStatus('Login failed');
        }
    };

    return (
        <Container className="mt-5">
            <h2>Authentication Test</h2>
            
            <div className="mb-4">
                <h4>Current Token:</h4>
                <div className="border p-3 bg-light">
                    <code style={{ wordBreak: 'break-all' }}>{token}</code>
                </div>
            </div>
            
            {authStatus && (
                <Alert variant={authStatus.includes('successful') ? 'success' : 'info'}>
                    {authStatus}
                </Alert>
            )}
            
            {error && (
                <Alert variant="danger">
                    {error}
                </Alert>
            )}
            
            <div className="d-flex gap-3">
                <Button variant="primary" onClick={testAuth}>
                    Test Authentication
                </Button>
                
                <Button variant="warning" onClick={loginAsAdmin}>
                    Login as Admin
                </Button>
            </div>
        </Container>
    );
};

export default TestAuth;
