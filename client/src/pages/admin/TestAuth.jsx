import React, { useState, useEffect } from 'react';
import { Container, Button, Alert, Card } from 'react-bootstrap';
import { api } from '../../utils/api';

const TestAuth = () => {
    const [authStatus, setAuthStatus] = useState({
        isAuthenticated: false,
        token: null,
        tokenDetails: null,
        error: null
    });
    
    useEffect(() => {
        // Check if token exists in localStorage
        const token = localStorage.getItem('token');
        if (token) {
            try {
                // Parse token (assuming JWT format: header.payload.signature)
                const base64Url = token.split('.')[1];
                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
                    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                }).join(''));
                
                const tokenData = JSON.parse(jsonPayload);
                
                setAuthStatus({
                    isAuthenticated: true,
                    token: token,
                    tokenDetails: tokenData,
                    error: null
                });
            } catch (error) {
                setAuthStatus({
                    isAuthenticated: false,
                    token: token,
                    tokenDetails: null,
                    error: 'Invalid token format'
                });
            }
        }
    }, []);
    
    const handleTestAuth = async () => {
        try {
            // Make a test request to a protected endpoint
            const response = await api.get('/auth/profile');
            alert('Authentication successful! User data: ' + JSON.stringify(response.data));
        } catch (error) {
            alert('Authentication failed: ' + (error.response?.data?.error || error.message));
        }
    };
    
    const handleAdminLogin = async () => {
        try {
            const username = prompt('Enter admin username:');
            const password = prompt('Enter admin password:');
            
            if (!username || !password) {
                alert('Username and password are required');
                return;
            }
            
            const response = await api.post('/auth/admin/login', { username, password });
            
            // Store token properly
            const token = response.data.token;
            localStorage.setItem('token', token);
            
            // Refresh the page to update auth status
            window.location.reload();
        } catch (error) {
            alert('Login failed: ' + (error.response?.data?.error || error.message));
        }
    };
    
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.reload();
    };
    
    return (
        <Container className="mt-5">
            <h1>Authentication Test</h1>
            
            <Card className="mb-4">
                <Card.Body>
                    <Card.Title>Authentication Status</Card.Title>
                    {authStatus.isAuthenticated ? (
                        <Alert variant="success">
                            <strong>Authenticated</strong>
                        </Alert>
                    ) : (
                        <Alert variant="danger">
                            <strong>Not Authenticated</strong>
                            {authStatus.error && <p>{authStatus.error}</p>}
                        </Alert>
                    )}
                    
                    {authStatus.token && (
                        <div className="mt-3">
                            <h5>Token:</h5>
                            <pre className="bg-light p-2" style={{wordBreak: 'break-all'}}>
                                {authStatus.token}
                            </pre>
                        </div>
                    )}
                    
                    {authStatus.tokenDetails && (
                        <div className="mt-3">
                            <h5>Token Details:</h5>
                            <pre className="bg-light p-2">
                                {JSON.stringify(authStatus.tokenDetails, null, 2)}
                            </pre>
                        </div>
                    )}
                </Card.Body>
            </Card>
            
            <div className="d-flex gap-2 mb-4">
                <Button variant="primary" onClick={handleTestAuth}>
                    Test Authentication
                </Button>
                
                <Button variant="success" onClick={handleAdminLogin}>
                    Admin Login
                </Button>
                
                {authStatus.isAuthenticated && (
                    <Button variant="danger" onClick={handleLogout}>
                        Logout
                    </Button>
                )}
            </div>
            
            <Alert variant="info">
                <p><strong>Instructions:</strong></p>
                <ul>
                    <li>Click "Admin Login" to log in as an admin</li>
                    <li>Click "Test Authentication" to test if your authentication is working</li>
                    <li>Click "Logout" to clear your authentication tokens</li>
                </ul>
                <p>If you're authenticated but still can't create courses, there might be an issue with permissions or the API endpoint.</p>
            </Alert>
        </Container>
    );
};

export default TestAuth;
