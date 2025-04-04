import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Form, Button, Badge, Table, Pagination } from 'react-bootstrap';
import { FaUsers, FaCheck, FaClock, FaComments } from 'react-icons/fa';

const MentorshipProgram = () => {
  const [mentorships, setMentorships] = useState([]);
  const [filteredMentorships, setFilteredMentorships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMentorship, setSelectedMentorship] = useState(null);
  const [reply, setReply] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [mentorshipsPerPage] = useState(10);

  // Mock data for development
  const mockMentorships = [
    {
      id: 1,
      student: {
        id: 101,
        name: "Emma Johnson",
        email: "emma.j@example.com",
        program: "Full Stack Development"
      },
      mentor: {
        id: 201,
        name: "Dr. Robert Chen",
        email: "robert.c@example.com",
        expertise: "Web Development, React, Node.js",
        rating: 4.9
      },
      status: "active",
      startDate: "2025-01-15T00:00:00",
      endDate: "2025-04-15T00:00:00",
      goals: "Master React and build a portfolio project",
      progress: 65,
      nextSession: "2025-03-30T14:00:00",
      sessions: [
        {
          date: "2025-01-20T14:00:00",
          duration: 60,
          topics: "React fundamentals, component structure",
          notes: "Covered basic concepts, assigned first mini-project"
        },
        {
          date: "2025-02-05T14:00:00",
          duration: 60,
          topics: "State management, hooks",
          notes: "Reviewed mini-project, discussed state patterns"
        }
      ],
      feedback: [
        {
          from: "mentor",
          date: "2025-02-10T00:00:00",
          content: "Emma is making excellent progress. She quickly grasps new concepts and applies them effectively."
        },
        {
          from: "student",
          date: "2025-02-12T00:00:00",
          content: "Dr. Chen explains complex topics clearly and provides practical examples that help me understand."
        }
      ]
    },
    {
      id: 2,
      student: {
        id: 102,
        name: "Michael Brown",
        email: "michael.b@example.com",
        program: "Data Science"
      },
      mentor: {
        id: 202,
        name: "Dr. Sarah Wilson",
        email: "sarah.w@example.com",
        expertise: "Machine Learning, Python, Statistics",
        rating: 4.8
      },
      status: "pending",
      startDate: "2025-03-01T00:00:00",
      endDate: "2025-06-01T00:00:00",
      goals: "Learn advanced machine learning techniques and complete a capstone project",
      progress: 10,
      nextSession: "2025-03-29T10:00:00",
      sessions: [
        {
          date: "2025-03-10T10:00:00",
          duration: 60,
          topics: "Introduction and goal setting",
          notes: "Discussed learning path and project ideas"
        }
      ],
      feedback: []
    },
    {
      id: 3,
      student: {
        id: 103,
        name: "Sophia Martinez",
        email: "sophia.m@example.com",
        program: "UI/UX Design"
      },
      mentor: {
        id: 203,
        name: "James Taylor",
        email: "james.t@example.com",
        expertise: "UI/UX Design, Figma, User Research",
        rating: 4.7
      },
      status: "completed",
      startDate: "2024-11-01T00:00:00",
      endDate: "2025-02-01T00:00:00",
      goals: "Master UI/UX principles and create a professional portfolio",
      progress: 100,
      nextSession: null,
      sessions: [
        {
          date: "2024-11-05T15:00:00",
          duration: 60,
          topics: "Design principles and tools setup",
          notes: "Introduced key design concepts and set up Figma workspace"
        },
        {
          date: "2024-11-20T15:00:00",
          duration: 60,
          topics: "User research methods",
          notes: "Covered user personas, journey mapping, and research techniques"
        },
        {
          date: "2024-12-10T15:00:00",
          duration: 60,
          topics: "Wireframing and prototyping",
          notes: "Created initial wireframes for portfolio project"
        },
        {
          date: "2025-01-05T15:00:00",
          duration: 60,
          topics: "Final review and career advice",
          notes: "Reviewed completed portfolio and discussed job application strategies"
        }
      ],
      feedback: [
        {
          from: "mentor",
          date: "2025-02-05T00:00:00",
          content: "Sophia has shown exceptional creativity and attention to detail. Her portfolio demonstrates strong design skills and user-centered thinking."
        },
        {
          from: "student",
          date: "2025-02-06T00:00:00",
          content: "James was an excellent mentor who provided valuable insights and constructive feedback throughout the program."
        }
      ]
    }
  ];

  useEffect(() => {
    // In a real app, fetch mentorships from API
    // For now, use mock data
    fetchMentorships();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [mentorships, searchTerm, statusFilter]);

  const fetchMentorships = async () => {
    try {
      setLoading(true);
      // In a real app:
      // const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/mentorships`);
      // setMentorships(response.data);
      
      // Using mock data for development
      setMentorships(mockMentorships);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch mentorships');
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...mentorships];
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(mentorship => 
        mentorship.student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mentorship.mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mentorship.goals.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(mentorship => mentorship.status === statusFilter);
    }
    
    setFilteredMentorships(filtered);
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      // In a real app:
      // await axios.put(`${process.env.REACT_APP_API_URL}/api/admin/mentorships/${id}/status`, { status });
      
      // Update local state for development
      const updatedMentorships = mentorships.map(mentorship => 
        mentorship.id === id ? { ...mentorship, status } : mentorship
      );
      setMentorships(updatedMentorships);
      
      if (selectedMentorship && selectedMentorship.id === id) {
        setSelectedMentorship({ ...selectedMentorship, status });
      }
    } catch (err) {
      setError('Failed to update mentorship status');
    }
  };

  const addFeedback = async (id) => {
    if (!reply.trim()) return;
    
    try {
      // In a real app:
      // await axios.post(`${process.env.REACT_APP_API_URL}/api/admin/mentorships/${id}/feedback`, { content: reply });
      
      // Update local state for development
      const newFeedback = {
        from: "admin",
        date: new Date().toISOString(),
        content: reply
      };
      
      const updatedMentorships = mentorships.map(mentorship => {
        if (mentorship.id === id) {
          const updatedFeedback = [...(mentorship.feedback || []), newFeedback];
          return { ...mentorship, feedback: updatedFeedback };
        }
        return mentorship;
      });
      
      setMentorships(updatedMentorships);
      
      if (selectedMentorship && selectedMentorship.id === id) {
        const updatedFeedback = [...(selectedMentorship.feedback || []), newFeedback];
        setSelectedMentorship({ ...selectedMentorship, feedback: updatedFeedback });
      }
      
      setReply('');
    } catch (err) {
      setError('Failed to add feedback');
    }
  };

  // Pagination
  const indexOfLastMentorship = currentPage * mentorshipsPerPage;
  const indexOfFirstMentorship = indexOfLastMentorship - mentorshipsPerPage;
  const currentMentorships = filteredMentorships.slice(indexOfFirstMentorship, indexOfLastMentorship);
  const totalPages = Math.ceil(filteredMentorships.length / mentorshipsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const renderPagination = () => {
    if (totalPages <= 1) return null;
    
    const pageItems = [];
    for (let i = 1; i <= totalPages; i++) {
      pageItems.push(
        <Pagination.Item 
          key={i} 
          active={i === currentPage}
          onClick={() => paginate(i)}
        >
          {i}
        </Pagination.Item>
      );
    }
    
    return (
      <Pagination className="justify-content-center mt-4">
        <Pagination.Prev 
          onClick={() => paginate(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
        />
        {pageItems}
        <Pagination.Next 
          onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
        />
      </Pagination>
    );
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return <Badge bg="success">Active</Badge>;
      case 'pending':
        return <Badge bg="warning">Pending</Badge>;
      case 'completed':
        return <Badge bg="secondary">Completed</Badge>;
      default:
        return <Badge bg="info">{status}</Badge>;
    }
  };

  const getProgressBar = (progress) => {
    let variant = 'primary';
    if (progress < 30) variant = 'danger';
    else if (progress < 70) variant = 'warning';
    else variant = 'success';
    
    return (
      <div className="progress" style={{ height: '8px' }}>
        <div 
          className={`progress-bar bg-${variant}`} 
          role="progressbar" 
          style={{ width: `${progress}%` }} 
          aria-valuenow={progress} 
          aria-valuemin="0" 
          aria-valuemax="100"
        ></div>
      </div>
    );
  };

  if (loading) return <div className="text-center p-5"><div className="spinner-border" role="status"></div></div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="mentorship-program">
      <Row className="mb-4">
        <Col>
          <Card className="admin-stat-card">
            <div className="admin-stat-card-icon bg-primary">
              <FaUsers />
            </div>
            <div className="admin-stat-card-content">
              <h3>{mentorships.length}</h3>
              <p>Total Mentorships</p>
            </div>
          </Card>
        </Col>
        <Col>
          <Card className="admin-stat-card">
            <div className="admin-stat-card-icon bg-success">
              <FaCheck />
            </div>
            <div className="admin-stat-card-content">
              <h3>{mentorships.filter(m => m.status === 'active').length}</h3>
              <p>Active Mentorships</p>
            </div>
          </Card>
        </Col>
        <Col>
          <Card className="admin-stat-card">
            <div className="admin-stat-card-icon bg-warning">
              <FaClock />
            </div>
            <div className="admin-stat-card-content">
              <h3>{mentorships.filter(m => m.status === 'pending').length}</h3>
              <p>Pending Requests</p>
            </div>
          </Card>
        </Col>
        <Col>
          <Card className="admin-stat-card">
            <div className="admin-stat-card-icon bg-secondary">
              <FaCheck />
            </div>
            <div className="admin-stat-card-content">
              <h3>{mentorships.filter(m => m.status === 'completed').length}</h3>
              <p>Completed</p>
            </div>
          </Card>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col md={6}>
          <Form.Group className="mb-0">
            <div className="position-relative">
              <Form.Control
                type="text"
                placeholder="Search mentorships..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="admin-form-control"
              />
            </div>
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="admin-form-select"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </Form.Select>
        </Col>
      </Row>

      <Row>
        <Col md={5}>
          <Card className="mb-4">
            <Card.Header className="bg-white">
              <h5 className="mb-0">Mentorship Relationships</h5>
            </Card.Header>
            <Card.Body className="p-0">
              <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
                <Table className="admin-table mb-0">
                  <thead>
                    <tr>
                      <th>Student</th>
                      <th>Mentor</th>
                      <th>Status</th>
                      <th>Progress</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentMentorships.length > 0 ? (
                      currentMentorships.map(mentorship => (
                        <tr 
                          key={mentorship.id} 
                          className={selectedMentorship?.id === mentorship.id ? 'table-active' : ''}
                          onClick={() => setSelectedMentorship(mentorship)}
                          style={{ cursor: 'pointer' }}
                        >
                          <td>{mentorship.student.name}</td>
                          <td>{mentorship.mentor.name}</td>
                          <td>{getStatusBadge(mentorship.status)}</td>
                          <td>
                            <div className="d-flex align-items-center">
                              <div className="flex-grow-1 me-2">
                                {getProgressBar(mentorship.progress)}
                              </div>
                              <span>{mentorship.progress}%</span>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="text-center py-4">No mentorships found</td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
            <Card.Footer className="bg-white">
              {renderPagination()}
            </Card.Footer>
          </Card>
        </Col>
        <Col md={7}>
          {selectedMentorship ? (
            <Card>
              <Card.Header className="bg-white d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Mentorship Details</h5>
                <div>
                  {getStatusBadge(selectedMentorship.status)}
                </div>
              </Card.Header>
              <Card.Body>
                <Row className="mb-4">
                  <Col md={6}>
                    <h6>Student</h6>
                    <p className="mb-1"><strong>Name:</strong> {selectedMentorship.student.name}</p>
                    <p className="mb-1"><strong>Email:</strong> {selectedMentorship.student.email}</p>
                    <p className="mb-1"><strong>Program:</strong> {selectedMentorship.student.program}</p>
                  </Col>
                  <Col md={6}>
                    <h6>Mentor</h6>
                    <p className="mb-1"><strong>Name:</strong> {selectedMentorship.mentor.name}</p>
                    <p className="mb-1"><strong>Email:</strong> {selectedMentorship.mentor.email}</p>
                    <p className="mb-1"><strong>Expertise:</strong> {selectedMentorship.mentor.expertise}</p>
                    <p className="mb-1"><strong>Rating:</strong> {selectedMentorship.mentor.rating}/5</p>
                  </Col>
                </Row>
                
                <div className="mb-4">
                  <h6>Mentorship Information</h6>
                  <Row>
                    <Col md={6}>
                      <p className="mb-1"><strong>Start Date:</strong> {new Date(selectedMentorship.startDate).toLocaleDateString()}</p>
                      <p className="mb-1"><strong>End Date:</strong> {new Date(selectedMentorship.endDate).toLocaleDateString()}</p>
                    </Col>
                    <Col md={6}>
                      <p className="mb-1"><strong>Status:</strong> {selectedMentorship.status}</p>
                      <p className="mb-1"><strong>Progress:</strong> {selectedMentorship.progress}%</p>
                    </Col>
                  </Row>
                  <p className="mb-1 mt-2"><strong>Goals:</strong> {selectedMentorship.goals}</p>
                  {selectedMentorship.nextSession && (
                    <p className="mb-1"><strong>Next Session:</strong> {new Date(selectedMentorship.nextSession).toLocaleString()}</p>
                  )}
                </div>
                
                <div className="mb-4">
                  <h6>Session History</h6>
                  <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                    {selectedMentorship.sessions && selectedMentorship.sessions.length > 0 ? (
                      selectedMentorship.sessions.map((session, index) => (
                        <Card key={index} className="mb-2">
                          <Card.Body className="py-2 px-3">
                            <div className="d-flex justify-content-between">
                              <strong>{new Date(session.date).toLocaleDateString()}</strong>
                              <span>{session.duration} minutes</span>
                            </div>
                            <p className="mb-1 mt-1"><strong>Topics:</strong> {session.topics}</p>
                            <p className="mb-0"><strong>Notes:</strong> {session.notes}</p>
                          </Card.Body>
                        </Card>
                      ))
                    ) : (
                      <p className="text-muted">No sessions recorded yet</p>
                    )}
                  </div>
                </div>
                
                <div className="mb-4">
                  <h6>Feedback</h6>
                  <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                    {selectedMentorship.feedback && selectedMentorship.feedback.length > 0 ? (
                      selectedMentorship.feedback.map((feedback, index) => (
                        <Card key={index} className="mb-2">
                          <Card.Body className="py-2 px-3">
                            <div className="d-flex justify-content-between">
                              <strong>From: {feedback.from}</strong>
                              <small>{new Date(feedback.date).toLocaleDateString()}</small>
                            </div>
                            <p className="mb-0 mt-1">{feedback.content}</p>
                          </Card.Body>
                        </Card>
                      ))
                    ) : (
                      <p className="text-muted">No feedback recorded yet</p>
                    )}
                  </div>
                </div>
                
                <Form>
                  <Form.Group className="mb-3">
                    <Form.Label>Add Feedback or Note</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={reply}
                      onChange={(e) => setReply(e.target.value)}
                      className="admin-form-control"
                    />
                  </Form.Group>
                  <div className="d-flex justify-content-between">
                    <div>
                      {selectedMentorship.status !== 'completed' && (
                        <>
                          <Button
                            variant="success"
                            className="me-2 admin-btn"
                            onClick={() => handleStatusUpdate(selectedMentorship.id, 'active')}
                            disabled={selectedMentorship.status === 'active'}
                          >
                            <FaCheck className="me-1" /> Mark Active
                          </Button>
                          <Button
                            variant="secondary"
                            className="admin-btn"
                            onClick={() => handleStatusUpdate(selectedMentorship.id, 'completed')}
                          >
                            <FaCheck className="me-1" /> Mark Completed
                          </Button>
                        </>
                      )}
                    </div>
                    <Button
                      variant="primary"
                      className="admin-btn"
                      onClick={() => addFeedback(selectedMentorship.id)}
                      disabled={!reply.trim()}
                    >
                      <FaComments className="me-1" /> Add Feedback
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          ) : (
            <Card className="h-100 d-flex align-items-center justify-content-center">
              <Card.Body className="text-center text-muted">
                <FaUsers size={40} className="mb-3" />
                <h5>Select a mentorship to view details</h5>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default MentorshipProgram;
