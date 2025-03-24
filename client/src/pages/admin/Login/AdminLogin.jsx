import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card, Alert } from 'react-bootstrap';
import axios from 'axios';

const AdminLogin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

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
        <Container className="mt-5">
            <Row className="justify-content-md-center">
                <Col md={6}>
                    <Card>
                        <Card.Header>Admin Login</Card.Header>
                        <Card.Body>
                            {error && <Alert variant="danger">{error}</Alert>}
                            <Form onSubmit={handleSubmit}>
                                <Form.Group controlId="formBasicUsername">
                                    <Form.Label>Username</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter username"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        required
                                    />
                                </Form.Group>

                                <Form.Group controlId="formBasicPassword" className="mt-3">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        placeholder="Enter password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </Form.Group>

                                <Button variant="primary" className="w-100 mt-3" type="submit" disabled={loading}>
                                    {loading ? 'Logging in...' : 'Login'}
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default AdminLogin;
