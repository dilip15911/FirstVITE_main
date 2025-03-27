import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Card, Alert } from 'react-bootstrap';
import axios from 'axios';
import './AdminLogin.css';

const AdminLogin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

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
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/admin/login`, {
                username,
                password
            });

            localStorage.setItem("token", response.data.token);
            window.location.href = "/admin";
        } catch (err) {
            console.error('Login error:', err.response?.data);
            setError(err.response?.data?.error || "Login failed");
            // Log the error details for debugging
            console.error('Error details:', err.response?.data?.details);
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
                                            className="admin-login-input"
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
                                            className="admin-login-input"
                                            required
                                        />
                                    </Form.Group>

                                    <Button 
                                        variant="primary" 
                                        className="w-100 admin-login-button"
                                        type="submit"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                Logging in...
                                            </>
                                        ) : (
                                            'Login'
                                        )}
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
