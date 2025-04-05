import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, Row, Col, Form, Button, Badge, Table, Nav, Modal } from 'react-bootstrap';
import { FaBook, FaVideo, FaFileAlt, FaLink, FaPlus, FaEdit, FaTrash, FaSearch, FaDownload, FaEye, FaStar } from 'react-icons/fa';

const ResourceLibrary = () => {
  const [resources, setResources] = useState([]);
  const [filteredResources, setFilteredResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [activeCategory, setActiveCategory] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedResource, setSelectedResource] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    type: 'document',
    category: 'programming',
    description: '',
    url: '',
    featured: false
  });

  // Mock data for development
  const mockResources = useMemo(() => [
    {
      id: 1,
      title: "JavaScript Fundamentals Guide",
      type: "document",
      category: "programming",
      description: "Comprehensive guide covering JavaScript basics to advanced concepts",
      url: "https://example.com/js-guide",
      downloadCount: 245,
      rating: 4.7,
      featured: true,
      createdAt: "2025-01-10T00:00:00"
    },
    {
      id: 2,
      title: "Introduction to React Development",
      type: "video",
      category: "programming",
      description: "Video tutorial series on React fundamentals and best practices",
      url: "https://example.com/react-intro",
      downloadCount: 189,
      rating: 4.5,
      featured: false,
      createdAt: "2025-01-15T00:00:00"
    },
    {
      id: 3,
      title: "Data Science with Python Cheatsheet",
      type: "document",
      category: "data-science",
      description: "Quick reference guide for common Python data science libraries and functions",
      url: "https://example.com/ds-cheatsheet",
      downloadCount: 320,
      rating: 4.8,
      featured: true,
      createdAt: "2025-01-20T00:00:00"
    },
    {
      id: 4,
      title: "UI/UX Design Principles",
      type: "presentation",
      category: "design",
      description: "Slide deck covering essential UI/UX design principles and examples",
      url: "https://example.com/uiux-principles",
      downloadCount: 156,
      rating: 4.3,
      featured: false,
      createdAt: "2025-02-05T00:00:00"
    },
    {
      id: 5,
      title: "Database Optimization Techniques",
      type: "document",
      category: "database",
      description: "Guide to optimizing database performance and query efficiency",
      url: "https://example.com/db-optimization",
      downloadCount: 210,
      rating: 4.6,
      featured: false,
      createdAt: "2025-02-10T00:00:00"
    },
    {
      id: 6,
      title: "Machine Learning Algorithms Explained",
      type: "video",
      category: "data-science",
      description: "Video series explaining common machine learning algorithms with examples",
      url: "https://example.com/ml-algorithms",
      downloadCount: 275,
      rating: 4.9,
      featured: true,
      createdAt: "2025-02-15T00:00:00"
    },
    {
      id: 7,
      title: "Git & GitHub for Beginners",
      type: "tutorial",
      category: "tools",
      description: "Step-by-step tutorial on using Git and GitHub for version control",
      url: "https://example.com/git-tutorial",
      downloadCount: 310,
      rating: 4.7,
      featured: false,
      createdAt: "2025-02-20T00:00:00"
    },
    {
      id: 8,
      title: "Responsive Web Design Guide",
      type: "document",
      category: "web-development",
      description: "Comprehensive guide to creating responsive websites with HTML, CSS, and JavaScript",
      url: "https://example.com/responsive-design",
      downloadCount: 198,
      rating: 4.4,
      featured: false,
      createdAt: "2025-03-01T00:00:00"
    }
  ], []);

  // Extract unique categories from resources
  const categories = ['all', ...new Set(mockResources.map(resource => resource.category))];

  const fetchResources = useCallback(async () => {
    try {
      setLoading(true);
      // In a real app:
      // const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/resources`);
      // setResources(response.data);
      
      // Using mock data for development
      setResources(mockResources);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch resources');
      setLoading(false);
    }
  }, []);

  const applyFilters = useCallback(() => {
    let filtered = [...resources];
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(resource => 
        resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(resource => resource.type === typeFilter);
    }
    
    // Apply category filter
    if (activeCategory !== 'all') {
      filtered = filtered.filter(resource => resource.category === activeCategory);
    }
    
    setFilteredResources(filtered);
  }, [resources, searchTerm, typeFilter, activeCategory]);

  useEffect(() => {
    fetchResources();
  }, [fetchResources]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const handleAddResource = () => {
    // Reset form data
    setFormData({
      title: '',
      type: 'document',
      category: 'programming',
      description: '',
      url: '',
      featured: false
    });
    setShowAddModal(true);
  };

  const handleEditResource = (resource) => {
    setSelectedResource(resource);
    setFormData({
      title: resource.title,
      type: resource.type,
      category: resource.category,
      description: resource.description,
      url: resource.url,
      featured: resource.featured
    });
    setShowEditModal(true);
  };

  const handleDeleteResource = async (id) => {
    if (!window.confirm('Are you sure you want to delete this resource?')) return;
    
    try {
      // In a real app:
      // await axios.delete(`${process.env.REACT_APP_API_URL}/api/admin/resources/${id}`);
      
      // Update local state for development
      const updatedResources = resources.filter(resource => resource.id !== id);
      setResources(updatedResources);
    } catch (err) {
      setError('Failed to delete resource');
    }
  };

  const handleSubmitAdd = async (e) => {
    e.preventDefault();
    
    try {
      // In a real app:
      // const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/admin/resources`, formData);
      // const newResource = response.data;
      
      // Update local state for development
      const newResource = {
        id: Date.now(),
        ...formData,
        downloadCount: 0,
        rating: 0,
        createdAt: new Date().toISOString()
      };
      
      setResources([...resources, newResource]);
      setShowAddModal(false);
    } catch (err) {
      setError('Failed to add resource');
    }
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    
    try {
      // In a real app:
      // await axios.put(`${process.env.REACT_APP_API_URL}/api/admin/resources/${selectedResource.id}`, formData);
      
      // Update local state for development
      const updatedResources = resources.map(resource => 
        resource.id === selectedResource.id ? { ...resource, ...formData } : resource
      );
      
      setResources(updatedResources);
      setShowEditModal(false);
    } catch (err) {
      setError('Failed to update resource');
    }
  };

  const handleToggleFeatured = async (id, featured) => {
    try {
      // In a real app:
      // await axios.put(`${process.env.REACT_APP_API_URL}/api/admin/resources/${id}/featured`, { featured });
      
      // Update local state for development
      const updatedResources = resources.map(resource => 
        resource.id === id ? { ...resource, featured } : resource
      );
      
      setResources(updatedResources);
    } catch (err) {
      setError('Failed to update featured status');
    }
  };

  const getResourceIcon = (type) => {
    switch (type) {
      case 'document':
        return <FaFileAlt />;
      case 'video':
        return <FaVideo />;
      case 'presentation':
        return <FaBook />;
      case 'tutorial':
        return <FaBook />;
      default:
        return <FaLink />;
    }
  };

  const formatCategory = (category) => {
    return category
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  if (loading) return <div className="text-center p-5"><div className="spinner-border" role="status"></div></div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="resource-library">
      <Row className="mb-4">
        <Col>
          <Card className="admin-stat-card">
            <div className="admin-stat-card-icon bg-primary">
              <FaBook />
            </div>
            <div className="admin-stat-card-content">
              <h3>{resources.length}</h3>
              <p>Total Resources</p>
            </div>
          </Card>
        </Col>
        <Col>
          <Card className="admin-stat-card">
            <div className="admin-stat-card-icon bg-success">
              <FaDownload />
            </div>
            <div className="admin-stat-card-content">
              <h3>{resources.reduce((total, resource) => total + resource.downloadCount, 0)}</h3>
              <p>Total Downloads</p>
            </div>
          </Card>
        </Col>
        <Col>
          <Card className="admin-stat-card">
            <div className="admin-stat-card-icon bg-warning">
              <FaStar />
            </div>
            <div className="admin-stat-card-content">
              <h3>{resources.filter(r => r.featured).length}</h3>
              <p>Featured Resources</p>
            </div>
          </Card>
        </Col>
        <Col>
          <Card className="admin-stat-card">
            <div className="admin-stat-card-icon bg-info">
              <FaEye />
            </div>
            <div className="admin-stat-card-content">
              <h3>
                {(resources.reduce((sum, resource) => sum + resource.rating, 0) / resources.length).toFixed(1)}
              </h3>
              <p>Avg. Rating</p>
            </div>
          </Card>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col md={5}>
          <Form.Group className="mb-0">
            <div className="position-relative">
              <Form.Control
                type="text"
                placeholder="Search resources..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="admin-form-control"
              />
              <FaSearch className="position-absolute" style={{ right: '10px', top: '12px', color: '#64748b' }} />
            </div>
          </Form.Group>
        </Col>
        <Col md={3}>
          <Form.Select 
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="admin-form-select"
          >
            <option value="all">All Types</option>
            <option value="document">Documents</option>
            <option value="video">Videos</option>
            <option value="presentation">Presentations</option>
            <option value="tutorial">Tutorials</option>
          </Form.Select>
        </Col>
        <Col md={4} className="d-flex justify-content-end">
          <Button 
            variant="primary"
            onClick={handleAddResource}
            className="admin-btn"
          >
            <FaPlus className="me-1" /> Add Resource
          </Button>
        </Col>
      </Row>

      <Row>
        <Col md={3}>
          <Card className="mb-4">
            <Card.Header className="bg-white">
              <h5 className="mb-0">Categories</h5>
            </Card.Header>
            <Card.Body className="p-0">
              <Nav className="flex-column">
                {categories.map((category, index) => (
                  <Nav.Link 
                    key={index}
                    className={`border-bottom py-3 px-3 ${activeCategory === category ? 'active bg-light' : ''}`}
                    onClick={() => setActiveCategory(category)}
                  >
                    {category === 'all' ? 'All Categories' : formatCategory(category)}
                    <Badge bg="secondary" className="float-end">
                      {category === 'all' 
                        ? resources.length 
                        : resources.filter(r => r.category === category).length}
                    </Badge>
                  </Nav.Link>
                ))}
              </Nav>
            </Card.Body>
          </Card>
        </Col>
        <Col md={9}>
          <Card>
            <Card.Header className="bg-white d-flex justify-content-between align-items-center">
              <h5 className="mb-0">
                {activeCategory === 'all' ? 'All Resources' : `${formatCategory(activeCategory)} Resources`}
              </h5>
              <span>{filteredResources.length} resources found</span>
            </Card.Header>
            <Card.Body className="p-0">
              <Table className="admin-table mb-0">
                <thead>
                  <tr>
                    <th>Resource</th>
                    <th>Type</th>
                    <th>Category</th>
                    <th>Stats</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredResources.length > 0 ? (
                    filteredResources.map(resource => (
                      <tr key={resource.id}>
                        <td>
                          <div className="d-flex flex-column">
                            <span className="fw-medium">
                              {resource.featured && <FaStar className="text-warning me-1" />}
                              {resource.title}
                            </span>
                            <small className="text-muted">{new Date(resource.createdAt).toLocaleDateString()}</small>
                          </div>
                        </td>
                        <td>
                          <Badge bg="light" text="dark" className="d-flex align-items-center">
                            <span className="me-1">{getResourceIcon(resource.type)}</span>
                            {resource.type.charAt(0).toUpperCase() + resource.type.slice(1)}
                          </Badge>
                        </td>
                        <td>{formatCategory(resource.category)}</td>
                        <td>
                          <div className="d-flex flex-column">
                            <small><FaDownload className="me-1" />{resource.downloadCount} downloads</small>
                            <small><FaStar className="me-1 text-warning" />{resource.rating} rating</small>
                          </div>
                        </td>
                        <td>
                          <Button 
                            variant="outline-primary" 
                            size="sm" 
                            className="me-1 admin-btn-sm"
                            onClick={() => handleEditResource(resource)}
                          >
                            <FaEdit />
                          </Button>
                          <Button 
                            variant="outline-danger" 
                            size="sm" 
                            className="me-1 admin-btn-sm"
                            onClick={() => handleDeleteResource(resource.id)}
                          >
                            <FaTrash />
                          </Button>
                          <Button 
                            variant={resource.featured ? "warning" : "outline-warning"} 
                            size="sm" 
                            className="admin-btn-sm"
                            onClick={() => handleToggleFeatured(resource.id, !resource.featured)}
                          >
                            <FaStar />
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center py-4">No resources found</td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Add Resource Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Add New Resource</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmitAdd}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                required
                className="admin-form-control"
              />
            </Form.Group>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Type</Form.Label>
                  <Form.Select
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    className="admin-form-select"
                  >
                    <option value="document">Document</option>
                    <option value="video">Video</option>
                    <option value="presentation">Presentation</option>
                    <option value="tutorial">Tutorial</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Category</Form.Label>
                  <Form.Select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="admin-form-select"
                  >
                    {categories.filter(c => c !== 'all').map((category, index) => (
                      <option key={index} value={category}>
                        {formatCategory(category)}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                required
                className="admin-form-control"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>URL</Form.Label>
              <Form.Control
                type="url"
                value={formData.url}
                onChange={(e) => setFormData({...formData, url: e.target.value})}
                required
                className="admin-form-control"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="Featured Resource"
                checked={formData.featured}
                onChange={(e) => setFormData({...formData, featured: e.target.checked})}
                className="admin-form-check"
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Add Resource
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Edit Resource Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Edit Resource</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmitEdit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                required
                className="admin-form-control"
              />
            </Form.Group>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Type</Form.Label>
                  <Form.Select
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    className="admin-form-select"
                  >
                    <option value="document">Document</option>
                    <option value="video">Video</option>
                    <option value="presentation">Presentation</option>
                    <option value="tutorial">Tutorial</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Category</Form.Label>
                  <Form.Select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="admin-form-select"
                  >
                    {categories.filter(c => c !== 'all').map((category, index) => (
                      <option key={index} value={category}>
                        {formatCategory(category)}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                required
                className="admin-form-control"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>URL</Form.Label>
              <Form.Control
                type="url"
                value={formData.url}
                onChange={(e) => setFormData({...formData, url: e.target.value})}
                required
                className="admin-form-control"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="Featured Resource"
                checked={formData.featured}
                onChange={(e) => setFormData({...formData, featured: e.target.checked})}
                className="admin-form-check"
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowEditModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Save Changes
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default ResourceLibrary;
