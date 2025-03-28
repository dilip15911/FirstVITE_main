import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Form, Button, Badge, Table, Pagination, Dropdown } from 'react-bootstrap';
import { FaSearch, FaQuestionCircle, FaCheck, FaReply, FaThumbsUp, FaThumbsDown, FaEye, FaStar } from 'react-icons/fa';
import axios from 'axios';

const QAForum = () => {
  const [threads, setThreads] = useState([]);
  const [filteredThreads, setFilteredThreads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedThread, setSelectedThread] = useState(null);
  const [reply, setReply] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [courseFilter, setCourseFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [threadsPerPage] = useState(10);

  // Mock data for development
  const mockThreads = [
    {
      id: 1,
      title: 'How to implement authentication in React?',
      content: 'I am building a React application and need to implement user authentication. What is the best approach for this?',
      student: 'Alex Johnson',
      course: 'React Development',
      status: 'unanswered',
      views: 45,
      upvotes: 12,
      featured: true,
      createdAt: '2025-03-20T08:15:00',
      answers: []
    },
    {
      id: 2,
      title: 'Difference between var, let and const in JavaScript',
      content: 'Can someone explain the key differences between var, let, and const declarations in JavaScript? When should I use each one?',
      student: 'Maria Garcia',
      course: 'Advanced JavaScript',
      status: 'answered',
      views: 120,
      upvotes: 28,
      featured: false,
      createdAt: '2025-03-18T14:30:00',
      answers: [
        {
          id: 1,
          content: 'The main differences are in scoping and reassignment capabilities:\n\n- var: function-scoped, can be redeclared and updated\n- let: block-scoped, can be updated but not redeclared\n- const: block-scoped, cannot be updated or redeclared\n\nUse const by default, let when you need to reassign values, and avoid var in modern code.',
          author: 'Instructor David',
          isInstructor: true,
          upvotes: 15,
          downvotes: 1,
          createdAt: '2025-03-18T16:45:00',
          isAccepted: true
        },
        {
          id: 2,
          content: 'Also note that var declarations are hoisted to the top of their scope, while let and const are not hoisted in the same way (they exist in the temporal dead zone until the declaration line).',
          author: 'Support Team',
          isInstructor: false,
          upvotes: 8,
          downvotes: 0,
          createdAt: '2025-03-19T09:20:00',
          isAccepted: false
        }
      ]
    },
    {
      id: 3,
      title: 'How to normalize data in SQL?',
      content: 'I am learning about database design and struggling with normalization concepts. Can someone explain the different normal forms and when to use them?',
      student: 'Thomas Wilson',
      course: 'Database Management',
      status: 'answered',
      views: 78,
      upvotes: 15,
      featured: false,
      createdAt: '2025-03-22T11:05:00',
      answers: [
        {
          id: 3,
          content: 'Database normalization is a process of organizing data to minimize redundancy. Here are the main normal forms:\n\n1NF: Each table cell should contain a single value and each record needs to be unique.\n\n2NF: The table is in 1NF and all non-key attributes are fully dependent on the primary key.\n\n3NF: The table is in 2NF and all attributes are only dependent on the primary key.\n\nBCNF: Every determinant is a candidate key.\n\nNormalization reduces data redundancy but can make queries more complex due to joins.',
          author: 'Instructor Sarah',
          isInstructor: true,
          upvotes: 20,
          downvotes: 0,
          createdAt: '2025-03-22T13:30:00',
          isAccepted: true
        }
      ]
    },
    {
      id: 4,
      title: 'Best practices for Python exception handling',
      content: 'What are the best practices for handling exceptions in Python? When should I use try/except blocks and how specific should my exception handling be?',
      student: 'James Lee',
      course: 'Python Programming Fundamentals',
      status: 'unanswered',
      views: 32,
      upvotes: 7,
      featured: false,
      createdAt: '2025-03-25T15:40:00',
      answers: []
    },
    {
      id: 5,
      title: 'Understanding Big O notation',
      content: 'I am struggling to understand Big O notation and algorithm complexity. Can someone explain it in simple terms with examples?',
      student: 'Sophia Martinez',
      course: 'Data Structures and Algorithms',
      status: 'answered',
      views: 95,
      upvotes: 22,
      featured: true,
      createdAt: '2025-03-19T10:25:00',
      answers: [
        {
          id: 4,
          content: 'Big O notation describes the performance or complexity of an algorithm in terms of the worst-case scenario as the input size grows.\n\nCommon complexities:\n- O(1): Constant time (e.g., accessing an array element)\n- O(log n): Logarithmic (e.g., binary search)\n- O(n): Linear (e.g., simple for loop)\n- O(n log n): Log-linear (e.g., efficient sorting algorithms)\n- O(n²): Quadratic (e.g., nested loops)\n- O(2^n): Exponential (e.g., recursive fibonacci)\n\nWhen analyzing algorithms, we focus on how they scale with large inputs, ignoring constants and lower-order terms.',
          author: 'Instructor Michael',
          isInstructor: true,
          upvotes: 18,
          downvotes: 0,
          createdAt: '2025-03-19T12:15:00',
          isAccepted: true
        },
        {
          id: 5,
          content: 'Here\'s a practical example: Finding a specific element in an unsorted array requires checking each element (O(n)), while finding it in a sorted array using binary search is much faster (O(log n)).',
          author: 'Teaching Assistant Robert',
          isInstructor: false,
          upvotes: 10,
          downvotes: 1,
          createdAt: '2025-03-19T14:30:00',
          isAccepted: false
        }
      ]
    }
  ];

  const courses = [...new Set(mockThreads.map(thread => thread.course))];

  useEffect(() => {
    // In a real app, fetch threads from API
    // For now, use mock data
    fetchThreads();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [threads, searchTerm, statusFilter, courseFilter]);

  const fetchThreads = async () => {
    try {
      setLoading(true);
      // In a real app:
      // const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/qa-threads`);
      // setThreads(response.data);
      
      // Using mock data for development
      setThreads(mockThreads);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch Q&A threads');
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...threads];
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(thread => 
        thread.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        thread.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        thread.student.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(thread => thread.status === statusFilter);
    }
    
    // Apply course filter
    if (courseFilter !== 'all') {
      filtered = filtered.filter(thread => thread.course === courseFilter);
    }
    
    setFilteredThreads(filtered);
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      // In a real app:
      // await axios.put(`${process.env.REACT_APP_API_URL}/api/admin/qa-threads/${id}/status`, { status });
      
      // Update local state for development
      const updatedThreads = threads.map(thread => 
        thread.id === id ? { ...thread, status } : thread
      );
      setThreads(updatedThreads);
      
      if (selectedThread && selectedThread.id === id) {
        setSelectedThread({ ...selectedThread, status });
      }
    } catch (err) {
      setError('Failed to update thread status');
    }
  };

  const handleFeaturedUpdate = async (id, featured) => {
    try {
      // In a real app:
      // await axios.put(`${process.env.REACT_APP_API_URL}/api/admin/qa-threads/${id}/featured`, { featured });
      
      // Update local state for development
      const updatedThreads = threads.map(thread => 
        thread.id === id ? { ...thread, featured } : thread
      );
      setThreads(updatedThreads);
      
      if (selectedThread && selectedThread.id === id) {
        setSelectedThread({ ...selectedThread, featured });
      }
    } catch (err) {
      setError('Failed to update featured status');
    }
  };

  const handleReply = async (id) => {
    if (!reply.trim()) return;
    
    try {
      // In a real app:
      // await axios.post(`${process.env.REACT_APP_API_URL}/api/admin/qa-threads/${id}/answer`, { content: reply });
      
      // Update local state for development
      const newAnswer = {
        id: Date.now(), // Generate a temporary ID
        content: reply,
        author: 'Support Team',
        isInstructor: false,
        upvotes: 0,
        downvotes: 0,
        createdAt: new Date().toISOString(),
        isAccepted: false
      };
      
      const updatedThreads = threads.map(thread => {
        if (thread.id === id) {
          const updatedAnswers = [...thread.answers, newAnswer];
          return { 
            ...thread, 
            answers: updatedAnswers,
            status: thread.status === 'unanswered' ? 'answered' : thread.status
          };
        }
        return thread;
      });
      
      setThreads(updatedThreads);
      
      if (selectedThread && selectedThread.id === id) {
        const updatedAnswers = [...selectedThread.answers, newAnswer];
        setSelectedThread({ 
          ...selectedThread, 
          answers: updatedAnswers,
          status: selectedThread.status === 'unanswered' ? 'answered' : selectedThread.status
        });
      }
      
      setReply('');
    } catch (err) {
      setError('Failed to post answer');
    }
  };

  const markAnswerAsAccepted = async (threadId, answerId) => {
    try {
      // In a real app:
      // await axios.put(`${process.env.REACT_APP_API_URL}/api/admin/qa-threads/${threadId}/answers/${answerId}/accept`);
      
      // Update local state for development
      const updatedThreads = threads.map(thread => {
        if (thread.id === threadId) {
          const updatedAnswers = thread.answers.map(answer => ({
            ...answer,
            isAccepted: answer.id === answerId
          }));
          return { ...thread, answers: updatedAnswers };
        }
        return thread;
      });
      
      setThreads(updatedThreads);
      
      if (selectedThread && selectedThread.id === threadId) {
        const updatedAnswers = selectedThread.answers.map(answer => ({
          ...answer,
          isAccepted: answer.id === answerId
        }));
        setSelectedThread({ ...selectedThread, answers: updatedAnswers });
      }
    } catch (err) {
      setError('Failed to mark answer as accepted');
    }
  };

  // Pagination
  const indexOfLastThread = currentPage * threadsPerPage;
  const indexOfFirstThread = indexOfLastThread - threadsPerPage;
  const currentThreads = filteredThreads.slice(indexOfFirstThread, indexOfLastThread);
  const totalPages = Math.ceil(filteredThreads.length / threadsPerPage);

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
      case 'unanswered':
        return <Badge bg="danger">Unanswered</Badge>;
      case 'answered':
        return <Badge bg="success">Answered</Badge>;
      default:
        return <Badge bg="secondary">{status}</Badge>;
    }
  };

  if (loading) return <div className="text-center p-5"><div className="spinner-border" role="status"></div></div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="qa-forum">
      <Row className="mb-4">
        <Col>
          <Card className="admin-stat-card">
            <div className="admin-stat-card-icon bg-primary">
              <FaQuestionCircle />
            </div>
            <div className="admin-stat-card-content">
              <h3>{threads.length}</h3>
              <p>Total Questions</p>
            </div>
          </Card>
        </Col>
        <Col>
          <Card className="admin-stat-card">
            <div className="admin-stat-card-icon bg-danger">
              <FaQuestionCircle />
            </div>
            <div className="admin-stat-card-content">
              <h3>{threads.filter(t => t.status === 'unanswered').length}</h3>
              <p>Unanswered</p>
            </div>
          </Card>
        </Col>
        <Col>
          <Card className="admin-stat-card">
            <div className="admin-stat-card-icon bg-success">
              <FaCheck />
            </div>
            <div className="admin-stat-card-content">
              <h3>{threads.filter(t => t.status === 'answered').length}</h3>
              <p>Answered</p>
            </div>
          </Card>
        </Col>
        <Col>
          <Card className="admin-stat-card">
            <div className="admin-stat-card-icon bg-warning">
              <FaStar />
            </div>
            <div className="admin-stat-card-content">
              <h3>{threads.filter(t => t.featured).length}</h3>
              <p>Featured</p>
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
                placeholder="Search questions..."
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
            <option value="unanswered">Unanswered</option>
            <option value="answered">Answered</option>
          </Form.Select>
        </Col>
        <Col md={4}>
          <Form.Select 
            value={courseFilter}
            onChange={(e) => setCourseFilter(e.target.value)}
            className="admin-form-select"
          >
            <option value="all">All Courses</option>
            {courses.map((course, index) => (
              <option key={index} value={course}>{course}</option>
            ))}
          </Form.Select>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <Card className="mb-4">
            <Card.Header className="bg-white">
              <h5 className="mb-0">Q&A Threads</h5>
            </Card.Header>
            <Card.Body className="p-0">
              <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
                <Table className="admin-table mb-0">
                  <thead>
                    <tr>
                      <th>Question</th>
                      <th>Course</th>
                      <th>Status</th>
                      <th>Stats</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentThreads.length > 0 ? (
                      currentThreads.map(thread => (
                        <tr 
                          key={thread.id} 
                          className={selectedThread?.id === thread.id ? 'table-active' : ''}
                          onClick={() => setSelectedThread(thread)}
                          style={{ cursor: 'pointer' }}
                        >
                          <td>
                            <div className="d-flex flex-column">
                              <span className="fw-medium">
                                {thread.featured && <FaStar className="text-warning me-1" />}
                                {thread.title}
                              </span>
                              <small className="text-muted">{new Date(thread.createdAt).toLocaleDateString()}</small>
                            </div>
                          </td>
                          <td>{thread.course}</td>
                          <td>{getStatusBadge(thread.status)}</td>
                          <td>
                            <div className="d-flex align-items-center">
                              <span className="me-2"><FaEye className="me-1" />{thread.views}</span>
                              <span><FaThumbsUp className="me-1" />{thread.upvotes}</span>
                            </div>
                          </td>
                          <td>
                            <Dropdown>
                              <Dropdown.Toggle variant="light" size="sm" className="admin-btn-sm">
                                Actions
                              </Dropdown.Toggle>
                              <Dropdown.Menu>
                                <Dropdown.Item 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleFeaturedUpdate(thread.id, !thread.featured);
                                  }}
                                >
                                  {thread.featured ? 'Remove from Featured' : 'Mark as Featured'}
                                </Dropdown.Item>
                              </Dropdown.Menu>
                            </Dropdown>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="text-center py-4">No questions found</td>
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
          {selectedThread ? (
            <Card>
              <Card.Header className="bg-white d-flex justify-content-between align-items-center">
                <h5 className="mb-0">
                  {selectedThread.featured && <FaStar className="text-warning me-1" />}
                  {selectedThread.title}
                </h5>
                <div>
                  {getStatusBadge(selectedThread.status)}
                </div>
              </Card.Header>
              <Card.Body>
                <div className="mb-4">
                  <Row>
                    <Col md={6}>
                      <p><strong>Student:</strong> {selectedThread.student}</p>
                      <p><strong>Course:</strong> {selectedThread.course}</p>
                    </Col>
                    <Col md={6}>
                      <p><strong>Created:</strong> {new Date(selectedThread.createdAt).toLocaleString()}</p>
                      <p>
                        <span className="me-3"><FaEye className="me-1" />{selectedThread.views} views</span>
                        <span><FaThumbsUp className="me-1" />{selectedThread.upvotes} upvotes</span>
                      </p>
                    </Col>
                  </Row>
                  <div className="mt-3">
                    <h6>Question:</h6>
                    <p>{selectedThread.content}</p>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h6 className="mb-0">Answers ({selectedThread.answers.length}):</h6>
                    <Button 
                      variant={selectedThread.featured ? "warning" : "outline-warning"}
                      size="sm"
                      onClick={() => handleFeaturedUpdate(selectedThread.id, !selectedThread.featured)}
                    >
                      <FaStar className="me-1" /> 
                      {selectedThread.featured ? 'Remove from Featured' : 'Mark as Featured'}
                    </Button>
                  </div>
                  
                  <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                    {selectedThread.answers.length > 0 ? (
                      selectedThread.answers.map((answer, index) => (
                        <Card 
                          key={index} 
                          className={`mb-3 ${answer.isAccepted ? 'border-success' : ''} ${answer.isInstructor ? 'border-primary' : ''}`}
                        >
                          <Card.Header className={`py-2 ${answer.isAccepted ? 'bg-success text-white' : answer.isInstructor ? 'bg-primary text-white' : 'bg-light'}`}>
                            <div className="d-flex justify-content-between align-items-center">
                              <div>
                                <strong>{answer.author}</strong>
                                {answer.isInstructor && <Badge bg="light" text="dark" className="ms-2">Instructor</Badge>}
                                {answer.isAccepted && <Badge bg="light" text="dark" className="ms-2">Accepted Answer</Badge>}
                              </div>
                              <small>{new Date(answer.createdAt).toLocaleString()}</small>
                            </div>
                          </Card.Header>
                          <Card.Body className="py-3">
                            <p className="mb-2">{answer.content}</p>
                            <div className="d-flex justify-content-between align-items-center mt-3">
                              <div>
                                <span className="me-3"><FaThumbsUp className="me-1" />{answer.upvotes}</span>
                                <span><FaThumbsDown className="me-1" />{answer.downvotes}</span>
                              </div>
                              {!answer.isAccepted && (
                                <Button 
                                  variant="outline-success" 
                                  size="sm"
                                  onClick={() => markAnswerAsAccepted(selectedThread.id, answer.id)}
                                >
                                  <FaCheck className="me-1" /> Mark as Accepted
                                </Button>
                              )}
                            </div>
                          </Card.Body>
                        </Card>
                      ))
                    ) : (
                      <div className="text-center py-4 text-muted">
                        <FaQuestionCircle size={30} className="mb-2" />
                        <p>No answers yet</p>
                      </div>
                    )}
                  </div>
                </div>

                <Form>
                  <Form.Group className="mb-3">
                    <Form.Label>Your Answer</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={reply}
                      onChange={(e) => setReply(e.target.value)}
                      className="admin-form-control"
                    />
                  </Form.Group>
                  <div className="d-flex justify-content-end">
                    <Button
                      variant="primary"
                      className="admin-btn"
                      onClick={() => handleReply(selectedThread.id)}
                      disabled={!reply.trim()}
                    >
                      <FaReply className="me-1" /> Post Answer
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          ) : (
            <Card className="h-100 d-flex align-items-center justify-content-center">
              <Card.Body className="text-center text-muted">
                <FaQuestionCircle size={40} className="mb-3" />
                <h5>Select a question to view details</h5>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default QAForum;
