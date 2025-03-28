import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Nav, Tab } from 'react-bootstrap';
import { FaCode, FaBook, FaFile, FaPlus, FaEdit, FaTrash, FaDownload, FaImage, FaFileAlt, FaChartBar } from 'react-icons/fa';
import axios from 'axios';
import DocumentManager from './components/DocumentManager';
import MediaManager from './components/MediaManager';

const ContentDashboard = () => {
    const [activeTab, setActiveTab] = useState('documents');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        document.title = "Content Management | Admin Dashboard";
    }, []);

    if (loading) {
        return (
            <div className="text-center my-5">
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return <div className="alert alert-danger">{error}</div>;
    }

    return (
        <Container fluid className="p-4">
            <h2 className="mb-4">Content Management</h2>
            
            <Tab.Container id="content-tabs" activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
                <Row className="mb-4">
                    <Col>
                        <Nav variant="tabs" className="content-nav">
                            <Nav.Item>
                                <Nav.Link eventKey="documents">
                                    <FaFileAlt className="me-2" />
                                    Documents
                                </Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="media">
                                    <FaImage className="me-2" />
                                    Media
                                </Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="code">
                                    <FaCode className="me-2" />
                                    Code Snippets
                                </Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="analytics">
                                    <FaChartBar className="me-2" />
                                    Content Analytics
                                </Nav.Link>
                            </Nav.Item>
                        </Nav>
                    </Col>
                </Row>
                
                <Tab.Content>
                    <Tab.Pane eventKey="documents">
                        <DocumentManager />
                    </Tab.Pane>
                    
                    <Tab.Pane eventKey="media">
                        <MediaManager />
                    </Tab.Pane>
                    
                    <Tab.Pane eventKey="code">
                        <Card className="mb-4">
                            <Card.Header>
                                <h5 className="mb-0">Code Snippets Management</h5>
                            </Card.Header>
                            <Card.Body>
                                <div className="p-5 text-center">
                                    <FaCode className="display-1 text-muted mb-4" />
                                    <h4>Code Snippets Management</h4>
                                    <p className="text-muted">
                                        Manage code examples, solutions, and programming resources for students.
                                    </p>
                                    <p>
                                        This feature is coming soon. Check back later for updates.
                                    </p>
                                </div>
                            </Card.Body>
                        </Card>
                    </Tab.Pane>
                    
                    <Tab.Pane eventKey="analytics">
                        <Card className="mb-4">
                            <Card.Header>
                                <h5 className="mb-0">Content Analytics</h5>
                            </Card.Header>
                            <Card.Body>
                                <div className="p-5 text-center">
                                    <FaChartBar className="display-1 text-muted mb-4" />
                                    <h4>Content Performance Analytics</h4>
                                    <p className="text-muted">
                                        Track engagement, views, downloads, and other metrics for your content.
                                    </p>
                                    <p>
                                        This feature is coming soon. Check back later for updates.
                                    </p>
                                </div>
                            </Card.Body>
                        </Card>
                    </Tab.Pane>
                </Tab.Content>
            </Tab.Container>
        </Container>
    );
};

export default ContentDashboard;
