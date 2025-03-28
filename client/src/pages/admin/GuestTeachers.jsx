import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Table, Alert } from 'react-bootstrap';
import axios from 'axios';

const GuestTeachers = () => {
    const [teachers, setTeachers] = useState([]);
    const [newTeacher, setNewTeacher] = useState({
        name: '',
        email: '',
        phone: '',
        specialization: '',
        availability: '',
        rate: '',
        status: 'active'
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        fetchTeachers();
    }, []);

    const fetchTeachers = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/admin/guest-teachers`);
            setTeachers(response.data);
        } catch (err) {
            setError('Failed to fetch guest teachers');
        }
    };

    const handleChange = (e) => {
        setNewTeacher({
            ...newTeacher,
            [e.target.name]: e.target.value
        });
    };

    const addTeacher = async () => {
        try {
            await axios.post(`${process.env.REACT_APP_API_URL}/admin/guest-teachers`, newTeacher);
            setSuccess('Teacher added successfully');
            setNewTeacher({
                name: '',
                email: '',
                phone: '',
                specialization: '',
                availability: '',
                rate: '',
                status: 'active'
            });
            fetchTeachers();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add teacher');
        }
    };

    const updateStatus = async (id, status) => {
        try {
            await axios.put(`${process.env.REACT_APP_API_URL}/admin/guest-teachers/${id}/status`, { status });
            fetchTeachers();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update status');
        }
    };

    const deleteTeacher = async (id) => {
        if (window.confirm('Are you sure you want to delete this teacher?')) {
            try {
                await axios.delete(`${process.env.REACT_APP_API_URL}/admin/guest-teachers/${id}`);
                fetchTeachers();
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to delete teacher');
            }
        }
    };

    const getStatusBadge = (status) => {
        switch (status.toLowerCase()) {
            case 'active':
                return <span className="badge bg-success">Active</span>;
            case 'inactive':
                return <span className="badge bg-secondary">Inactive</span>;
            case 'pending':
                return <span className="badge bg-warning text-dark">Pending</span>;
            default:
                return <span className="badge bg-info">{status}</span>;
        }
    };

    return (
        <Container className="mt-4">
            <h2>Guest Teachers Management</h2>

            {/* Add Teacher Form */}
            <Row className="mb-4">
                <Col md={6}>
                    <h4>Add New Guest Teacher</h4>
                    {error && <Alert variant="danger">{error}</Alert>}
                    {success && <Alert variant="success">{success}</Alert>}
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                value={newTeacher.name}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                value={newTeacher.email}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Phone</Form.Label>
                            <Form.Control
                                type="tel"
                                name="phone"
                                value={newTeacher.phone}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Specialization</Form.Label>
                            <Form.Control
                                type="text"
                                name="specialization"
                                value={newTeacher.specialization}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Availability</Form.Label>
                            <Form.Control
                                type="text"
                                name="availability"
                                value={newTeacher.availability}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Hourly Rate</Form.Label>
                            <Form.Control
                                type="number"
                                name="rate"
                                value={newTeacher.rate}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <Button variant="primary" onClick={addTeacher}>
                            Add Teacher
                        </Button>
                    </Form>
                </Col>
            </Row>

            {/* Teachers List */}
            <Row>
                <Col>
                    <h4>Manage Guest Teachers</h4>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Specialization</th>
                                <th>Availability</th>
                                <th>Rate</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {teachers.map(teacher => (
                                <tr key={teacher.id}>
                                    <td>{teacher.name}</td>
                                    <td>{teacher.email}</td>
                                    <td>{teacher.phone}</td>
                                    <td>{teacher.specialization}</td>
                                    <td>{teacher.availability}</td>
                                    <td>${teacher.rate}/hr</td>
                                    <td>
                                        {getStatusBadge(teacher.status)}
                                    </td>
                                    <td>
                                        <Button
                                            variant={teacher.status === 'active' ? 'warning' : 'success'}
                                            size="sm"
                                            onClick={() => updateStatus(teacher.id, teacher.status === 'active' ? 'inactive' : 'active')}
                                            className="me-2"
                                        >
                                            {teacher.status === 'active' ? 'Deactivate' : 'Activate'}
                                        </Button>
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            onClick={() => deleteTeacher(teacher.id)}
                                        >
                                            Delete
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Col>
            </Row>
        </Container>
    );
};

export default GuestTeachers;