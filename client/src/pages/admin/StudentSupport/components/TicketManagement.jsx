import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Form, Button, Badge, Table, Pagination, Dropdown } from 'react-bootstrap';
import { FaFilter, FaSearch, FaTicketAlt, FaExclamationTriangle, FaCheck, FaClock, FaReply } from 'react-icons/fa';

const TicketManagement = () => {
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [reply, setReply] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [ticketsPerPage] = useState(10);

  // Mock data for development
  const mockTickets = [
    {
      id: 1,
      title: 'Cannot access course materials',
      description: 'I paid for the Python course but cannot access the materials. Please help.',
      student: 'John Smith',
      email: 'john.smith@example.com',
      course: 'Python Programming Fundamentals',
      status: 'open',
      priority: 'high',
      createdAt: '2025-03-25T10:30:00',
      messages: [
        {
          sender: 'John Smith',
          content: 'I paid for the Python course but cannot access the materials. Please help.',
          createdAt: '2025-03-25T10:30:00'
        }
      ]
    },
    {
      id: 2,
      title: 'Assignment submission issue',
      description: 'I cannot submit my assignment for the JavaScript course. The submit button is not working.',
      student: 'Emma Johnson',
      email: 'emma.j@example.com',
      course: 'Advanced JavaScript',
      status: 'in-progress',
      priority: 'medium',
      createdAt: '2025-03-24T14:15:00',
      messages: [
        {
          sender: 'Emma Johnson',
          content: 'I cannot submit my assignment for the JavaScript course. The submit button is not working.',
          createdAt: '2025-03-24T14:15:00'
        },
        {
          sender: 'Support Team',
          content: 'Thank you for reporting this issue. We are looking into it and will get back to you shortly.',
          createdAt: '2025-03-24T15:30:00'
        }
      ]
    },
    {
      id: 3,
      title: 'Certificate not generated',
      description: 'I completed the Data Science course but my certificate has not been generated yet.',
      student: 'Michael Brown',
      email: 'michael.b@example.com',
      course: 'Data Science Masterclass',
      status: 'resolved',
      priority: 'low',
      createdAt: '2025-03-23T09:45:00',
      messages: [
        {
          sender: 'Michael Brown',
          content: 'I completed the Data Science course but my certificate has not been generated yet.',
          createdAt: '2025-03-23T09:45:00'
        },
        {
          sender: 'Support Team',
          content: 'We will check your course completion status and generate the certificate.',
          createdAt: '2025-03-23T11:20:00'
        },
        {
          sender: 'Support Team',
          content: 'Your certificate has been generated and sent to your email. Please check your inbox.',
          createdAt: '2025-03-23T14:05:00'
        }
      ]
    },
    {
      id: 4,
      title: 'Video playback issues',
      description: 'The videos in the React course are buffering too much and sometimes not playing at all.',
      student: 'Sarah Wilson',
      email: 'sarah.w@example.com',
      course: 'React Development',
      status: 'open',
      priority: 'medium',
      createdAt: '2025-03-26T16:20:00',
      messages: [
        {
          sender: 'Sarah Wilson',
          content: 'The videos in the React course are buffering too much and sometimes not playing at all.',
          createdAt: '2025-03-26T16:20:00'
        }
      ]
    },
    {
      id: 5,
      title: 'Refund request',
      description: 'I would like to request a refund for the UI/UX Design course as it does not meet my expectations.',
      student: 'David Lee',
      email: 'david.l@example.com',
      course: 'UI/UX Design Principles',
      status: 'open',
      priority: 'high',
      createdAt: '2025-03-27T08:10:00',
      messages: [
        {
          sender: 'David Lee',
          content: 'I would like to request a refund for the UI/UX Design course as it does not meet my expectations.',
          createdAt: '2025-03-27T08:10:00'
        }
      ]
    }
  ];

  useEffect(() => {
    // In a real app, fetch tickets from API
    // For now, use mock data
    fetchTickets();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [tickets, searchTerm, statusFilter, priorityFilter]);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      // In a real app:
      // const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/support-tickets`);
      // setTickets(response.data);
      
      // Using mock data for development
      setTickets(mockTickets);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch tickets');
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...tickets];
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(ticket => 
        ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.student.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.course.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(ticket => ticket.status === statusFilter);
    }
    
    // Apply priority filter
    if (priorityFilter !== 'all') {
      filtered = filtered.filter(ticket => ticket.priority === priorityFilter);
    }
    
    setFilteredTickets(filtered);
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      // In a real app:
      // await axios.put(`${process.env.REACT_APP_API_URL}/api/admin/support-tickets/${id}/status`, { status });
      
      // Update local state for development
      const updatedTickets = tickets.map(ticket => 
        ticket.id === id ? { ...ticket, status } : ticket
      );
      setTickets(updatedTickets);
      
      if (selectedTicket && selectedTicket.id === id) {
        setSelectedTicket({ ...selectedTicket, status });
      }
    } catch (err) {
      setError('Failed to update ticket status');
    }
  };

  const handlePriorityUpdate = async (id, priority) => {
    try {
      // In a real app:
      // await axios.put(`${process.env.REACT_APP_API_URL}/api/admin/support-tickets/${id}/priority`, { priority });
      
      // Update local state for development
      const updatedTickets = tickets.map(ticket => 
        ticket.id === id ? { ...ticket, priority } : ticket
      );
      setTickets(updatedTickets);
      
      if (selectedTicket && selectedTicket.id === id) {
        setSelectedTicket({ ...selectedTicket, priority });
      }
    } catch (err) {
      setError('Failed to update ticket priority');
    }
  };

  const handleReply = async (id) => {
    if (!reply.trim()) return;
    
    try {
      // In a real app:
      // await axios.post(`${process.env.REACT_APP_API_URL}/api/admin/support-tickets/${id}/reply`, { content: reply });
      
      // Update local state for development
      const newMessage = {
        sender: 'Support Team',
        content: reply,
        createdAt: new Date().toISOString()
      };
      
      const updatedTickets = tickets.map(ticket => {
        if (ticket.id === id) {
          const updatedMessages = [...ticket.messages, newMessage];
          return { ...ticket, messages: updatedMessages };
        }
        return ticket;
      });
      
      setTickets(updatedTickets);
      
      if (selectedTicket && selectedTicket.id === id) {
        const updatedMessages = [...selectedTicket.messages, newMessage];
        setSelectedTicket({ ...selectedTicket, messages: updatedMessages });
      }
      
      setReply('');
    } catch (err) {
      setError('Failed to send reply');
    }
  };

  // Pagination
  const indexOfLastTicket = currentPage * ticketsPerPage;
  const indexOfFirstTicket = indexOfLastTicket - ticketsPerPage;
  const currentTickets = filteredTickets.slice(indexOfFirstTicket, indexOfLastTicket);
  const totalPages = Math.ceil(filteredTickets.length / ticketsPerPage);

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
      case 'open':
        return <Badge bg="danger">Open</Badge>;
      case 'in-progress':
        return <Badge bg="warning">In Progress</Badge>;
      case 'resolved':
        return <Badge bg="success">Resolved</Badge>;
      default:
        return <Badge bg="secondary">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'high':
        return <Badge bg="danger">High</Badge>;
      case 'medium':
        return <Badge bg="warning">Medium</Badge>;
      case 'low':
        return <Badge bg="info">Low</Badge>;
      default:
        return <Badge bg="secondary">{priority}</Badge>;
    }
  };

  if (loading) return <div className="text-center p-5"><div className="spinner-border" role="status"></div></div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="ticket-management">
      <Row className="mb-4">
        <Col>
          <Card className="admin-stat-card">
            <div className="admin-stat-card-icon bg-primary">
              <FaTicketAlt />
            </div>
            <div className="admin-stat-card-content">
              <h3>{tickets.length}</h3>
              <p>Total Tickets</p>
            </div>
          </Card>
        </Col>
        <Col>
          <Card className="admin-stat-card">
            <div className="admin-stat-card-icon bg-danger">
              <FaExclamationTriangle />
            </div>
            <div className="admin-stat-card-content">
              <h3>{tickets.filter(t => t.status === 'open').length}</h3>
              <p>Open Tickets</p>
            </div>
          </Card>
        </Col>
        <Col>
          <Card className="admin-stat-card">
            <div className="admin-stat-card-icon bg-warning">
              <FaClock />
            </div>
            <div className="admin-stat-card-content">
              <h3>{tickets.filter(t => t.status === 'in-progress').length}</h3>
              <p>In Progress</p>
            </div>
          </Card>
        </Col>
        <Col>
          <Card className="admin-stat-card">
            <div className="admin-stat-card-icon bg-success">
              <FaCheck />
            </div>
            <div className="admin-stat-card-content">
              <h3>{tickets.filter(t => t.status === 'resolved').length}</h3>
              <p>Resolved</p>
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
                placeholder="Search tickets..."
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
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="admin-form-select"
          >
            <option value="all">All Statuses</option>
            <option value="open">Open</option>
            <option value="in-progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </Form.Select>
        </Col>
        <Col md={3}>
          <Form.Select 
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="admin-form-select"
          >
            <option value="all">All Priorities</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </Form.Select>
        </Col>
        <Col md={1} className="d-flex justify-content-end">
          <Button 
            variant="outline-secondary"
            onClick={() => {
              setSearchTerm('');
              setStatusFilter('all');
              setPriorityFilter('all');
            }}
            className="admin-btn"
          >
            <FaFilter /> Reset
          </Button>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <Card className="mb-4">
            <Card.Header className="bg-white">
              <h5 className="mb-0">Support Tickets</h5>
            </Card.Header>
            <Card.Body className="p-0">
              <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
                <Table className="admin-table mb-0">
                  <thead>
                    <tr>
                      <th>Ticket</th>
                      <th>Student</th>
                      <th>Status</th>
                      <th>Priority</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentTickets.length > 0 ? (
                      currentTickets.map(ticket => (
                        <tr 
                          key={ticket.id} 
                          className={selectedTicket?.id === ticket.id ? 'table-active' : ''}
                          onClick={() => setSelectedTicket(ticket)}
                          style={{ cursor: 'pointer' }}
                        >
                          <td>
                            <div className="d-flex flex-column">
                              <span className="fw-medium">{ticket.title}</span>
                              <small className="text-muted">{new Date(ticket.createdAt).toLocaleDateString()}</small>
                            </div>
                          </td>
                          <td>{ticket.student}</td>
                          <td>{getStatusBadge(ticket.status)}</td>
                          <td>{getPriorityBadge(ticket.priority)}</td>
                          <td>
                            <Dropdown>
                              <Dropdown.Toggle variant="light" size="sm" className="admin-btn-sm">
                                Actions
                              </Dropdown.Toggle>
                              <Dropdown.Menu>
                                <Dropdown.Header>Change Status</Dropdown.Header>
                                <Dropdown.Item onClick={() => handleStatusUpdate(ticket.id, 'open')}>Open</Dropdown.Item>
                                <Dropdown.Item onClick={() => handleStatusUpdate(ticket.id, 'in-progress')}>In Progress</Dropdown.Item>
                                <Dropdown.Item onClick={() => handleStatusUpdate(ticket.id, 'resolved')}>Resolved</Dropdown.Item>
                                <Dropdown.Divider />
                                <Dropdown.Header>Change Priority</Dropdown.Header>
                                <Dropdown.Item onClick={() => handlePriorityUpdate(ticket.id, 'high')}>High</Dropdown.Item>
                                <Dropdown.Item onClick={() => handlePriorityUpdate(ticket.id, 'medium')}>Medium</Dropdown.Item>
                                <Dropdown.Item onClick={() => handlePriorityUpdate(ticket.id, 'low')}>Low</Dropdown.Item>
                              </Dropdown.Menu>
                            </Dropdown>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="text-center py-4">No tickets found</td>
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
        <Col md={6}>
          {selectedTicket ? (
            <Card>
              <Card.Header className="bg-white d-flex justify-content-between align-items-center">
                <h5 className="mb-0">{selectedTicket.title}</h5>
                <div>
                  {getStatusBadge(selectedTicket.status)}
                  <span className="ms-2">{getPriorityBadge(selectedTicket.priority)}</span>
                </div>
              </Card.Header>
              <Card.Body>
                <div className="mb-4">
                  <Row>
                    <Col md={6}>
                      <p><strong>Student:</strong> {selectedTicket.student}</p>
                      <p><strong>Email:</strong> {selectedTicket.email}</p>
                    </Col>
                    <Col md={6}>
                      <p><strong>Course:</strong> {selectedTicket.course}</p>
                      <p><strong>Created:</strong> {new Date(selectedTicket.createdAt).toLocaleString()}</p>
                    </Col>
                  </Row>
                  <div className="mt-3">
                    <h6>Description:</h6>
                    <p>{selectedTicket.description}</p>
                  </div>
                </div>

                <div className="mb-4">
                  <h6>Conversation:</h6>
                  <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                    {selectedTicket.messages.map((message, index) => (
                      <Card key={index} className={`mb-2 ${message.sender === 'Support Team' ? 'border-primary' : ''}`}>
                        <Card.Body className="py-2 px-3">
                          <div className="d-flex justify-content-between">
                            <strong>{message.sender}</strong>
                            <small className="text-muted">
                              {new Date(message.createdAt).toLocaleString()}
                            </small>
                          </div>
                          <p className="mb-0 mt-2">{message.content}</p>
                        </Card.Body>
                      </Card>
                    ))}
                  </div>
                </div>

                <Form>
                  <Form.Group className="mb-3">
                    <Form.Label>Reply</Form.Label>
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
                      <Button
                        variant="success"
                        className="me-2 admin-btn"
                        onClick={() => handleStatusUpdate(selectedTicket.id, 'resolved')}
                      >
                        <FaCheck className="me-1" /> Mark Resolved
                      </Button>
                      <Button
                        variant="warning"
                        className="admin-btn"
                        onClick={() => handleStatusUpdate(selectedTicket.id, 'in-progress')}
                      >
                        <FaClock className="me-1" /> Mark In Progress
                      </Button>
                    </div>
                    <Button
                      variant="primary"
                      className="admin-btn"
                      onClick={() => handleReply(selectedTicket.id)}
                      disabled={!reply.trim()}
                    >
                      <FaReply className="me-1" /> Send Reply
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          ) : (
            <Card className="h-100 d-flex align-items-center justify-content-center">
              <Card.Body className="text-center text-muted">
                <FaTicketAlt size={40} className="mb-3" />
                <h5>Select a ticket to view details</h5>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default TicketManagement;
