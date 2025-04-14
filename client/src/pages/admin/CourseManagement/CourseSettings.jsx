import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Card, Row, Col, Spinner, Alert, Tab, Tabs } from 'react-bootstrap';
import { FaSave, FaUndo } from 'react-icons/fa';
import { toast } from 'react-toastify';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const CourseSettings = () => {
    const [settings, setSettings] = useState({
        default_course_status: 'draft',
        enable_course_reviews: true,
        enable_course_ratings: true,
        enable_student_enrollment: true,
        max_file_upload_size: 50,
        allowed_file_types: '.pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.zip,.mp4,.mp3',
        default_course_price: 0,
        currency: 'USD',
        enable_course_certificates: true,
        certificate_template: 'default',
        notification_emails: ''
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('general');

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Not authenticated');
            }

            console.log('Fetching course settings...');
            console.log('API URL:', `${API_URL}/api/admin/settings/courses`);
            console.log('Token:', token.startsWith('Bearer ') ? token : `Bearer ${token.slice(0, 10)}...`);

            const response = await axios.get(`${API_URL}/api/admin/settings/courses`, {
                headers: {
                    'Authorization': token.startsWith('Bearer ') ? token : `Bearer ${token}`
                }
            });

            if (response.data && response.data.success) {
                setSettings(response.data.data);
            } else {
                throw new Error('Failed to fetch course settings');
            }
        } catch (err) {
            console.error('Error fetching course settings:', err);
            setError(err.message || 'Failed to fetch course settings');
            toast.error(err.message || 'Failed to fetch course settings');
            
            // Keep default settings if API fails
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setSettings(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError(null);

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Not authenticated');
            }

            console.log('Updating course settings...');
            console.log('API URL:', `${API_URL}/api/admin/settings/courses`);
            console.log('Settings:', settings);
            console.log('Token:', token.startsWith('Bearer ') ? token : `Bearer ${token.slice(0, 10)}...`);

            const response = await axios.put(
                `${API_URL}/api/admin/settings/courses`,
                settings,
                {
                    headers: {
                        'Authorization': token.startsWith('Bearer ') ? token : `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.data && response.data.success) {
                toast.success('Course settings updated successfully!');
                fetchSettings(); // Refresh the settings after update
            } else {
                throw new Error(response.data.message || 'Failed to update settings');
            }
        } catch (err) {
            console.error('Error updating course settings:', err);
            setError(err.message || 'Failed to update course settings');
            toast.error(err.message || 'Failed to update course settings');
        } finally {
            setSaving(false);
        }
    };

    const handleReset = () => {
        if (window.confirm('Are you sure you want to reset all settings to default values?')) {
            setSettings({
                default_course_status: 'draft',
                enable_course_reviews: true,
                enable_course_ratings: true,
                enable_student_enrollment: true,
                max_file_upload_size: 50,
                allowed_file_types: '.pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.zip,.mp4,.mp3',
                default_course_price: 0,
                currency: 'USD',
                enable_course_certificates: true,
                certificate_template: 'default',
                notification_emails: ''
            });
            toast.info('Settings reset to default values');
        }
    };

    if (loading) {
        return (
            <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '300px' }}>
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </Container>
        );
    }

    return (
        <Container fluid>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Course Settings</h2>
                <div>
                    <Button 
                        variant="secondary" 
                        onClick={handleReset}
                        className="me-2"
                        disabled={saving}
                    >
                        <FaUndo className="me-2" /> Reset to Default
                    </Button>
                    <Button 
                        variant="primary" 
                        onClick={handleSubmit}
                        disabled={saving}
                    >
                        {saving ? (
                            <>
                                <Spinner animation="border" size="sm" className="me-2" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <FaSave className="me-2" /> Save Settings
                            </>
                        )}
                    </Button>
                </div>
            </div>

            {error && (
                <Alert variant="danger" onClose={() => setError(null)} dismissible>
                    {error}
                </Alert>
            )}

            <Card>
                <Card.Body>
                    <Form>
                        <Tabs
                            activeKey={activeTab}
                            onSelect={(k) => setActiveTab(k)}
                            className="mb-4"
                        >
                            <Tab eventKey="general" title="General Settings">
                                <Row className="mb-3">
                                    <Col md={6}>
                                        <Form.Group controlId="default_course_status">
                                            <Form.Label>Default Course Status</Form.Label>
                                            <Form.Select
                                                name="default_course_status"
                                                value={settings.default_course_status}
                                                onChange={handleChange}
                                            >
                                                <option value="draft">Draft</option>
                                                <option value="published">Published</option>
                                                <option value="archived">Archived</option>
                                            </Form.Select>
                                            <Form.Text className="text-muted">
                                                Default status for newly created courses
                                            </Form.Text>
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group controlId="default_course_price">
                                            <Form.Label>Default Course Price</Form.Label>
                                            <Form.Control
                                                type="number"
                                                name="default_course_price"
                                                value={settings.default_course_price}
                                                onChange={handleChange}
                                                min="0"
                                                step="0.01"
                                            />
                                            <Form.Text className="text-muted">
                                                Default price for new courses
                                            </Form.Text>
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Row className="mb-3">
                                    <Col md={6}>
                                        <Form.Group controlId="currency">
                                            <Form.Label>Currency</Form.Label>
                                            <Form.Select
                                                name="currency"
                                                value={settings.currency}
                                                onChange={handleChange}
                                            >
                                                <option value="USD">USD ($)</option>
                                                <option value="EUR">EUR (€)</option>
                                                <option value="GBP">GBP (£)</option>
                                                <option value="INR">INR (₹)</option>
                                                <option value="JPY">JPY (¥)</option>
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group controlId="notification_emails">
                                            <Form.Label>Notification Emails</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="notification_emails"
                                                value={settings.notification_emails}
                                                onChange={handleChange}
                                                placeholder="admin@example.com, support@example.com"
                                            />
                                            <Form.Text className="text-muted">
                                                Comma-separated list of emails to receive course notifications
                                            </Form.Text>
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Row className="mb-3">
                                    <Col md={6}>
                                        <Form.Group controlId="enable_student_enrollment" className="mb-3">
                                            <Form.Check
                                                type="checkbox"
                                                label="Enable Student Enrollment"
                                                name="enable_student_enrollment"
                                                checked={settings.enable_student_enrollment}
                                                onChange={handleChange}
                                            />
                                            <Form.Text className="text-muted">
                                                Allow students to enroll in courses
                                            </Form.Text>
                                        </Form.Group>
                                    </Col>
                                </Row>
                            </Tab>

                            <Tab eventKey="content" title="Content Settings">
                                <Row className="mb-3">
                                    <Col md={6}>
                                        <Form.Group controlId="max_file_upload_size">
                                            <Form.Label>Maximum File Upload Size (MB)</Form.Label>
                                            <Form.Control
                                                type="number"
                                                name="max_file_upload_size"
                                                value={settings.max_file_upload_size}
                                                onChange={handleChange}
                                                min="1"
                                                max="500"
                                            />
                                            <Form.Text className="text-muted">
                                                Maximum size for file uploads in megabytes
                                            </Form.Text>
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group controlId="allowed_file_types">
                                            <Form.Label>Allowed File Types</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="allowed_file_types"
                                                value={settings.allowed_file_types}
                                                onChange={handleChange}
                                                placeholder=".pdf,.doc,.docx,.mp4"
                                            />
                                            <Form.Text className="text-muted">
                                                Comma-separated list of allowed file extensions
                                            </Form.Text>
                                        </Form.Group>
                                    </Col>
                                </Row>
                            </Tab>

                            <Tab eventKey="feedback" title="Feedback Settings">
                                <Row className="mb-3">
                                    <Col md={6}>
                                        <Form.Group controlId="enable_course_reviews" className="mb-3">
                                            <Form.Check
                                                type="checkbox"
                                                label="Enable Course Reviews"
                                                name="enable_course_reviews"
                                                checked={settings.enable_course_reviews}
                                                onChange={handleChange}
                                            />
                                            <Form.Text className="text-muted">
                                                Allow students to leave written reviews
                                            </Form.Text>
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group controlId="enable_course_ratings" className="mb-3">
                                            <Form.Check
                                                type="checkbox"
                                                label="Enable Course Ratings"
                                                name="enable_course_ratings"
                                                checked={settings.enable_course_ratings}
                                                onChange={handleChange}
                                            />
                                            <Form.Text className="text-muted">
                                                Allow students to rate courses
                                            </Form.Text>
                                        </Form.Group>
                                    </Col>
                                </Row>
                            </Tab>

                            <Tab eventKey="certificates" title="Certificate Settings">
                                <Row className="mb-3">
                                    <Col md={6}>
                                        <Form.Group controlId="enable_course_certificates" className="mb-3">
                                            <Form.Check
                                                type="checkbox"
                                                label="Enable Course Certificates"
                                                name="enable_course_certificates"
                                                checked={settings.enable_course_certificates}
                                                onChange={handleChange}
                                            />
                                            <Form.Text className="text-muted">
                                                Issue certificates upon course completion
                                            </Form.Text>
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group controlId="certificate_template">
                                            <Form.Label>Certificate Template</Form.Label>
                                            <Form.Select
                                                name="certificate_template"
                                                value={settings.certificate_template}
                                                onChange={handleChange}
                                                disabled={!settings.enable_course_certificates}
                                            >
                                                <option value="default">Default</option>
                                                <option value="professional">Professional</option>
                                                <option value="academic">Academic</option>
                                                <option value="minimal">Minimal</option>
                                            </Form.Select>
                                            <Form.Text className="text-muted">
                                                Template design for course completion certificates
                                            </Form.Text>
                                        </Form.Group>
                                    </Col>
                                </Row>
                            </Tab>
                        </Tabs>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default CourseSettings;
