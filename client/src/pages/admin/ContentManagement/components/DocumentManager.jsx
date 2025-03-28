import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Form, Button, Table, Badge, Modal, Spinner } from 'react-bootstrap';
import { FaFile, FaPlus, FaEdit, FaTrash, FaDownload, FaSearch, FaFilter } from 'react-icons/fa';
import axios from 'axios';
import MDEditor from '@uiw/react-md-editor';

const DocumentManager = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentDocument, setCurrentDocument] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [categories, setCategories] = useState([]);
  const [previewDocument, setPreviewDocument] = useState(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  // Mock data for development
  const mockDocuments = [
    {
      id: 1,
      title: 'Student Handbook',
      description: 'Comprehensive guide for students',
      category: 'Policies',
      content: '# Student Handbook\n\nThis handbook provides essential information for all students enrolled in our courses.\n\n## Academic Policies\n\n- Attendance requirements\n- Grading system\n- Academic integrity\n\n## Student Services\n\n- Counseling\n- Career guidance\n- Technical support\n\n## Resources\n\n- Library access\n- Online learning tools\n- Study groups',
      createdAt: '2025-01-15T10:30:00',
      updatedAt: '2025-03-10T14:20:00',
      status: 'published'
    },
    {
      id: 2,
      title: 'Course Development Guidelines',
      description: 'Guidelines for instructors developing new courses',
      category: 'Instructors',
      content: '# Course Development Guidelines\n\n## Planning Your Course\n\n1. Define clear learning objectives\n2. Identify target audience\n3. Plan assessment methods\n\n## Content Creation\n\n- Create engaging video lectures\n- Develop practical exercises\n- Design comprehensive assessments\n\n## Quality Standards\n\n- Content must be accurate and up-to-date\n- Materials should be accessible to all students\n- Regular updates are required',
      createdAt: '2025-02-05T09:15:00',
      updatedAt: '2025-03-01T11:45:00',
      status: 'published'
    },
    {
      id: 3,
      title: 'Payment and Refund Policy',
      description: 'Detailed information about payment options and refund procedures',
      category: 'Policies',
      content: '# Payment and Refund Policy\n\n## Payment Methods\n\n- Credit/Debit Cards\n- PayPal\n- Bank Transfers\n\n## Refund Eligibility\n\n- Full refund within 7 days of purchase\n- Partial refund within 30 days\n- No refunds after 30 days\n\n## Refund Process\n\n1. Submit request through student portal\n2. Provide reason for refund\n3. Allow 5-7 business days for processing',
      createdAt: '2025-01-20T13:25:00',
      updatedAt: '2025-02-15T16:30:00',
      status: 'published'
    },
    {
      id: 4,
      title: 'Technical Requirements',
      description: 'Hardware and software requirements for courses',
      category: 'Technical',
      content: '# Technical Requirements\n\n## Hardware Requirements\n\n- Computer with minimum 8GB RAM\n- Webcam and microphone\n- Stable internet connection\n\n## Software Requirements\n\n- Updated web browser (Chrome, Firefox, Safari)\n- Required programming tools for specific courses\n- PDF reader\n\n## Recommended Setup\n\n- Dual monitors for better productivity\n- Headphones for better audio quality\n- External storage for backups',
      createdAt: '2025-02-10T15:30:00',
      updatedAt: '2025-03-05T09:45:00',
      status: 'draft'
    },
    {
      id: 5,
      title: 'Instructor Onboarding Guide',
      description: 'Step-by-step guide for new instructors',
      category: 'Instructors',
      content: '# Instructor Onboarding Guide\n\n## Getting Started\n\n1. Complete profile setup\n2. Review platform features\n3. Schedule orientation session\n\n## Creating Your First Course\n\n- Use course templates\n- Follow content guidelines\n- Submit for review\n\n## Support Resources\n\n- Technical support contact\n- Instructor community\n- Training webinars',
      createdAt: '2025-01-25T10:20:00',
      updatedAt: '2025-02-20T14:15:00',
      status: 'published'
    }
  ];

  const mockCategories = [
    'Policies',
    'Instructors',
    'Technical',
    'Students',
    'General'
  ];

  useEffect(() => {
    fetchDocuments();
    fetchCategories();
  }, []);

  useEffect(() => {
    if (searchTerm || filterCategory !== 'all') {
      filterDocuments();
    }
  }, [searchTerm, filterCategory]);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      // In a real app:
      // const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/content/documents`);
      // setDocuments(response.data);
      
      // Using mock data for development
      setDocuments(mockDocuments);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch documents');
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      // In a real app:
      // const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/content/categories`);
      // setCategories(response.data);
      
      // Using mock data for development
      setCategories(mockCategories);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  };

  const filterDocuments = () => {
    let filtered = [...mockDocuments];
    
    if (searchTerm) {
      filtered = filtered.filter(doc => 
        doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (filterCategory !== 'all') {
      filtered = filtered.filter(doc => doc.category === filterCategory);
    }
    
    setDocuments(filtered);
  };

  const handleAdd = () => {
    setCurrentDocument({
      title: '',
      description: '',
      category: '',
      content: '',
      status: 'draft'
    });
    setShowModal(true);
  };

  const handleEdit = (document) => {
    setCurrentDocument(document);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      try {
        // In a real app:
        // await axios.delete(`${process.env.REACT_APP_API_URL}/api/admin/content/documents/${id}`);
        
        // For development:
        setDocuments(documents.filter(doc => doc.id !== id));
      } catch (err) {
        setError('Failed to delete document');
      }
    }
  };

  const handlePreview = (document) => {
    setPreviewDocument(document);
    setShowPreviewModal(true);
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      
      if (currentDocument.id) {
        // Update existing document
        // In a real app:
        // await axios.put(`${process.env.REACT_APP_API_URL}/api/admin/content/documents/${currentDocument.id}`, currentDocument);
        
        // For development:
        setDocuments(documents.map(doc => 
          doc.id === currentDocument.id ? { ...currentDocument, updatedAt: new Date().toISOString() } : doc
        ));
      } else {
        // Create new document
        // In a real app:
        // const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/admin/content/documents`, currentDocument);
        
        // For development:
        const newDocument = {
          ...currentDocument,
          id: Math.max(...documents.map(doc => doc.id)) + 1,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        setDocuments([...documents, newDocument]);
      }
      
      setShowModal(false);
      setCurrentDocument(null);
      setLoading(false);
    } catch (err) {
      setError('Failed to save document');
      setLoading(false);
    }
  };

  const handleDownload = (document) => {
    // In a real app, this would generate and download a PDF or markdown file
    const element = document.createElement('a');
    const file = new Blob([document.content], {type: 'text/markdown'});
    element.href = URL.createObjectURL(file);
    element.download = `${document.title.replace(/\s+/g, '_')}.md`;
    document.body.appendChild(element);
    element.click();
  };

  if (loading && documents.length === 0) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <>
      <Card className="mb-4">
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Document Management</h5>
          <Button variant="primary" onClick={handleAdd}>
            <FaPlus className="me-1" /> Add Document
          </Button>
        </Card.Header>
        <Card.Body>
          <Row className="mb-4">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Search</Form.Label>
                <div className="position-relative">
                  <Form.Control
                    type="text"
                    placeholder="Search by title or description"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <FaSearch className="position-absolute" style={{ right: '10px', top: '10px', color: '#6c757d' }} />
                </div>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Filter by Category</Form.Label>
                <Form.Select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                >
                  <option value="all">All Categories</option>
                  {categories.map((category, index) => (
                    <option key={index} value={category}>{category}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={2} className="d-flex align-items-end">
              <Button 
                variant="outline-secondary" 
                className="w-100"
                onClick={() => {
                  setSearchTerm('');
                  setFilterCategory('all');
                  fetchDocuments();
                }}
              >
                <FaFilter /> Clear
              </Button>
            </Col>
          </Row>

          <div className="table-responsive">
            <Table hover>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Category</th>
                  <th>Last Updated</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {documents.length > 0 ? (
                  documents.map(document => (
                    <tr key={document.id}>
                      <td>{document.title}</td>
                      <td>{document.description}</td>
                      <td>{document.category}</td>
                      <td>{new Date(document.updatedAt).toLocaleDateString()}</td>
                      <td>
                        <Badge bg={document.status === 'published' ? 'success' : 'warning'}>
                          {document.status === 'published' ? 'Published' : 'Draft'}
                        </Badge>
                      </td>
                      <td>
                        <Button 
                          variant="outline-primary" 
                          size="sm" 
                          className="me-1"
                          onClick={() => handlePreview(document)}
                        >
                          <FaFile />
                        </Button>
                        <Button 
                          variant="outline-secondary" 
                          size="sm"
                          className="me-1"
                          onClick={() => handleEdit(document)}
                        >
                          <FaEdit />
                        </Button>
                        <Button 
                          variant="outline-danger" 
                          size="sm"
                          className="me-1"
                          onClick={() => handleDelete(document.id)}
                        >
                          <FaTrash />
                        </Button>
                        <Button 
                          variant="outline-info" 
                          size="sm"
                          onClick={() => handleDownload(document)}
                        >
                          <FaDownload />
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-4">
                      No documents found
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>

      {/* Add/Edit Document Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{currentDocument?.id ? 'Edit Document' : 'Add New Document'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Title</Form.Label>
                  <Form.Control
                    type="text"
                    value={currentDocument?.title || ''}
                    onChange={(e) => setCurrentDocument({...currentDocument, title: e.target.value})}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Category</Form.Label>
                  <Form.Select
                    value={currentDocument?.category || ''}
                    onChange={(e) => setCurrentDocument({...currentDocument, category: e.target.value})}
                    required
                  >
                    <option value="">Select a category</option>
                    {categories.map((category, index) => (
                      <option key={index} value={category}>{category}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={currentDocument?.description || ''}
                onChange={(e) => setCurrentDocument({...currentDocument, description: e.target.value})}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Content (Markdown)</Form.Label>
              <MDEditor
                value={currentDocument?.content || ''}
                onChange={(value) => setCurrentDocument({...currentDocument, content: value})}
                height={400}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Select
                value={currentDocument?.status || 'draft'}
                onChange={(e) => setCurrentDocument({...currentDocument, status: e.target.value})}
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave} disabled={loading}>
            {loading ? <Spinner animation="border" size="sm" /> : 'Save'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Preview Document Modal */}
      <Modal show={showPreviewModal} onHide={() => setShowPreviewModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{previewDocument?.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-3">
            <Badge bg="secondary" className="me-2">{previewDocument?.category}</Badge>
            <Badge bg={previewDocument?.status === 'published' ? 'success' : 'warning'}>
              {previewDocument?.status === 'published' ? 'Published' : 'Draft'}
            </Badge>
          </div>
          <p className="text-muted">{previewDocument?.description}</p>
          <div className="border p-3 rounded">
            <MDEditor.Markdown source={previewDocument?.content || ''} />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowPreviewModal(false)}>
            Close
          </Button>
          <Button 
            variant="primary" 
            onClick={() => {
              setShowPreviewModal(false);
              handleEdit(previewDocument);
            }}
          >
            Edit
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default DocumentManager;
