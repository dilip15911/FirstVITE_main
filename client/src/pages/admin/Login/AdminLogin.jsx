import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Card, Alert } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import './AdminLogin.css';

const AdminLogin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const { user, adminLogin, refreshUser } = useAuth();

    // Check if already logged in as admin
    useEffect(() => {
        // If user exists and has admin role, redirect to dashboard
        if (user && (user.role === 'admin' || user.isAdmin === true)) {
            console.log('User is already logged in as admin, redirecting to dashboard');
            navigate('/admin/dashboard', { replace: true });
        }
    }, [user, navigate]);

    useEffect(() => {
        // Create particles
        const container = document.querySelector('.admin-login-container');
        if (container) {
            const particles = document.createElement('div');
            particles.className = 'particles';
            container.appendChild(particles);

            for (let i = 0; i < 10; i++) {
                const particle = document.createElement('div');
                particle.className = 'particle';

                // Random position
                const x = Math.random() * 100;
                const y = Math.random() * 100;

                particle.style.left = `${x}%`;
                particle.style.top = `${y}%`;

                particles.appendChild(particle);
            }
        }

        // Cleanup particles on unmount
        return () => {
            const particles = document.querySelector('.particles');
            if (particles && particles.parentNode) {
                particles.parentNode.removeChild(particles);
            }
        };
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            console.log('Attempting admin login with:', { username });

            // Use the adminLogin function from AuthContext
            const response = await adminLogin(username, password);
            console.log('Admin login response:', response);

            if (response.success) {
                console.log('Login successful, redirecting to dashboard');
                console.log('Token in localStorage:', localStorage.getItem('token'));
                console.log('AdminData in localStorage:', localStorage.getItem('adminData'));

                // Always redirect to the admin dashboard after successful login
                console.log('Redirecting to: /admin/dashboard');

                // Wait a moment for token to be properly set and context to update
                setTimeout(() => {
                    // Force refresh user data before navigation
                    refreshUser().then(() => {
                        // Navigate to the admin dashboard
                        navigate('/admin/dashboard', { replace: true });
                    });
                }, 300);
            } else {
                throw new Error(response.message || 'Invalid credentials');
            }
        } catch (err) {
            console.error('Login error:', err);
            setError(err.message || "Login failed. Please check your credentials.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-login-container">
            <Container className="mt-5">
                <Row className="justify-content-center">
                    <Col md={6} lg={4}>
                        <Card className="admin-login-card">
                            <Card.Header className="admin-login-header">
                                <h2 className="admin-login-title">Admin Panel</h2>
                            </Card.Header>
                            <Card.Body>
                                {error && (
                                    <Alert variant="danger" className="admin-login-alert">
                                        {error}
                                    </Alert>
                                )}
                                <Form onSubmit={handleSubmit}>
                                    <Form.Group controlId="formBasicUsername" className="mb-4">
                                        <Form.Label className="admin-login-label">Username</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Enter username"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            required
                                        />
                                    </Form.Group>

                                    <Form.Group controlId="formBasicPassword" className="mb-4">
                                        <Form.Label className="admin-login-label">Password</Form.Label>
                                        <Form.Control
                                            type="password"
                                            placeholder="Enter password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                    </Form.Group>

                                    <Button
                                        variant="primary"
                                        type="submit"
                                        className="admin-login-button w-100"
                                        disabled={loading}
                                    >
                                        {loading ? 'Logging in...' : 'Login'}
                                    </Button>
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default AdminLogin;