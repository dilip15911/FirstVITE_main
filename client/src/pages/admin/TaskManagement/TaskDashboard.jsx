import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Table, Badge, Modal, Tabs, Tab, Dropdown, ProgressBar, Alert } from 'react-bootstrap';
import { FaTasks, FaPlus, FaEdit, FaTrash, FaCheck, FaClock, FaExclamationTriangle, FaFilter, FaSort, FaCalendarAlt, FaUser } from 'react-icons/fa';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const TaskDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState({
    status: 'all',
    priority: 'all',
    assignee: 'all',
    dueDate: 'all',
    search: ''
  });
  const [sortConfig, setSortConfig] = useState({
    key: 'dueDate',
    direction: 'asc'
  });

  useEffect(() => {
    document.title = "Task Management | Admin Dashboard";
    fetchTasks();
    fetchUsers();
  }, []);

  useEffect(() => {
    filterTasks();
  }, [tasks, filter, activeTab]);

  useEffect(() => {
    sortTasks();
  }, [filteredTasks, sortConfig]);

  // Mock data for development
  const fetchTasks = () => {
    // In a real application, this would be an API call
    setTimeout(() => {
      const mockTasks = generateMockTasks();
      setTasks(mockTasks);
      setFilteredTasks(mockTasks);
      setLoading(false);
    }, 1000);
  };

  const fetchUsers = () => {
    // In a real application, this would be an API call
    setTimeout(() => {
      const mockUsers = [
        { id: 1, name: 'Admin User', role: 'Administrator', avatar: 'https://via.placeholder.com/40' },
        { id: 2, name: 'John Doe', role: 'Instructor', avatar: 'https://via.placeholder.com/40' },
        { id: 3, name: 'Jane Smith', role: 'Content Manager', avatar: 'https://via.placeholder.com/40' },
        { id: 4, name: 'Michael Johnson', role: 'Support Staff', avatar: 'https://via.placeholder.com/40' },
        { id: 5, name: 'Emily Davis', role: 'Marketing', avatar: 'https://via.placeholder.com/40' }
      ];
      setUsers(mockUsers);
    }, 500);
  };

  const generateMockTasks = () => {
    const statuses = ['pending', 'in_progress', 'completed', 'on_hold'];
    const priorities = ['low', 'medium', 'high', 'urgent'];
    const categories = ['content', 'technical', 'administrative', 'support', 'marketing'];
    const titles = [
      'Update course content for JavaScript module',
      'Fix login issue on student portal',
      'Prepare monthly financial report',
      'Respond to student support tickets',
      'Create marketing materials for new course',
      'Review instructor applications',
      'Update privacy policy document',
      'Implement new payment gateway',
      'Organize virtual meetup for students',
      'Conduct system maintenance',
      'Update course syllabus',
      'Create assessment questions',
      'Review student feedback',
      'Prepare instructor training materials',
      'Optimize website performance'
    ];
    
    const mockTasks = [];
    const today = new Date();
    
    for (let i = 1; i <= 30; i++) {
      const createdDate = new Date(today);
      createdDate.setDate(today.getDate() - Math.floor(Math.random() * 30));
      
      const dueDate = new Date(createdDate);
      dueDate.setDate(createdDate.getDate() + Math.floor(Math.random() * 14) + 1);
      
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const completedDate = status === 'completed' ? new Date(dueDate) : null;
      if (completedDate) {
        completedDate.setDate(dueDate.getDate() - Math.floor(Math.random() * 3));
      }
      
      mockTasks.push({
        id: i,
        title: titles[Math.floor(Math.random() * titles.length)],
        description: `This is a detailed description for task ${i}. It includes all the necessary details for completing the task successfully.`,
        status: status,
        priority: priorities[Math.floor(Math.random() * priorities.length)],
        category: categories[Math.floor(Math.random() * categories.length)],
        assigneeId: Math.floor(Math.random() * 5) + 1,
        createdBy: 1, // Admin User
        createdAt: createdDate,
        dueDate: dueDate,
        completedAt: completedDate,
        comments: [],
        attachments: []
      });
    }
    
    return mockTasks;
  };

  const filterTasks = () => {
    if (!tasks.length) return;
    
    let filtered = [...tasks];
    
    // Filter by tab
    if (activeTab !== 'all') {
      if (activeTab === 'my_tasks') {
        filtered = filtered.filter(task => task.assigneeId === 1); // Assuming current user is Admin User (id: 1)
      } else if (activeTab === 'overdue') {
        filtered = filtered.filter(task => {
          return task.status !== 'completed' && new Date(task.dueDate) < new Date();
        });
      } else if (activeTab === 'upcoming') {
        const today = new Date();
        const nextWeek = new Date(today);
        nextWeek.setDate(today.getDate() + 7);
        
        filtered = filtered.filter(task => {
          const dueDate = new Date(task.dueDate);
          return task.status !== 'completed' && dueDate >= today && dueDate <= nextWeek;
        });
      }
    }
    
    // Apply filters
    if (filter.status !== 'all') {
      filtered = filtered.filter(task => task.status === filter.status);
    }
    
    if (filter.priority !== 'all') {
      filtered = filtered.filter(task => task.priority === filter.priority);
    }
    
    if (filter.assignee !== 'all') {
      filtered = filtered.filter(task => task.assigneeId === parseInt(filter.assignee));
    }
    
    if (filter.dueDate !== 'all') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (filter.dueDate === 'today') {
        filtered = filtered.filter(task => {
          const dueDate = new Date(task.dueDate);
          dueDate.setHours(0, 0, 0, 0);
          return dueDate.getTime() === today.getTime();
        });
      } else if (filter.dueDate === 'this_week') {
        const endOfWeek = new Date(today);
        endOfWeek.setDate(today.getDate() + (7 - today.getDay()));
        
        filtered = filtered.filter(task => {
          const dueDate = new Date(task.dueDate);
          return dueDate >= today && dueDate <= endOfWeek;
        });
      } else if (filter.dueDate === 'next_week') {
        const startOfNextWeek = new Date(today);
        startOfNextWeek.setDate(today.getDate() + (7 - today.getDay() + 1));
        
        const endOfNextWeek = new Date(startOfNextWeek);
        endOfNextWeek.setDate(startOfNextWeek.getDate() + 6);
        
        filtered = filtered.filter(task => {
          const dueDate = new Date(task.dueDate);
          return dueDate >= startOfNextWeek && dueDate <= endOfNextWeek;
        });
      } else if (filter.dueDate === 'overdue') {
        filtered = filtered.filter(task => {
          return task.status !== 'completed' && new Date(task.dueDate) < today;
        });
      }
    }
    
    // Search filter
    if (filter.search) {
      const searchTerm = filter.search.toLowerCase();
      filtered = filtered.filter(task => 
        task.title.toLowerCase().includes(searchTerm) || 
        task.description.toLowerCase().includes(searchTerm)
      );
    }
    
    setFilteredTasks(filtered);
  };

  const sortTasks = () => {
    const { key, direction } = sortConfig;
    const sortedTasks = [...filteredTasks].sort((a, b) => {
      if (key === 'dueDate' || key === 'createdAt' || key === 'completedAt') {
        const dateA = a[key] ? new Date(a[key]) : new Date(0);
        const dateB = b[key] ? new Date(b[key]) : new Date(0);
        
        return direction === 'asc' ? dateA - dateB : dateB - dateA;
      } else if (key === 'priority') {
        const priorityOrder = { low: 1, medium: 2, high: 3, urgent: 4 };
        return direction === 'asc' 
          ? priorityOrder[a[key]] - priorityOrder[b[key]]
          : priorityOrder[b[key]] - priorityOrder[a[key]];
      } else {
        if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
        if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
        return 0;
      }
    });
    
    setFilteredTasks(sortedTasks);
  };

  const handleSort = (key) => {
    const direction = sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc';
    setSortConfig({ key, direction });
  };

  const handleFilterChange = (name, value) => {
    setFilter(prev => ({ ...prev, [name]: value }));
  };

  const handleAddTask = () => {
    setCurrentTask({
      title: '',
      description: '',
      status: 'pending',
      priority: 'medium',
      category: 'administrative',
      assigneeId: 1,
      dueDate: new Date(new Date().setDate(new Date().getDate() + 7))
    });
    setShowModal(true);
  };

  const handleEditTask = (task) => {
    setCurrentTask({ ...task });
    setShowModal(true);
  };

  const handleDeleteTask = (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      // In a real application, this would be an API call
      const updatedTasks = tasks.filter(task => task.id !== taskId);
      setTasks(updatedTasks);
    }
  };

  const handleSaveTask = () => {
    // In a real application, this would be an API call
    if (currentTask.id) {
      // Update existing task
      const updatedTasks = tasks.map(task => 
        task.id === currentTask.id ? { ...currentTask } : task
      );
      setTasks(updatedTasks);
    } else {
      // Add new task
      const newTask = {
        ...currentTask,
        id: tasks.length + 1,
        createdBy: 1, // Admin User
        createdAt: new Date(),
        comments: [],
        attachments: []
      };
      setTasks([...tasks, newTask]);
    }
    
    setShowModal(false);
  };

  const handleStatusChange = (taskId, newStatus) => {
    // In a real application, this would be an API call
    const updatedTasks = tasks.map(task => {
      if (task.id === taskId) {
        const updatedTask = { ...task, status: newStatus };
        if (newStatus === 'completed') {
          updatedTask.completedAt = new Date();
        } else {
          updatedTask.completedAt = null;
        }
        return updatedTask;
      }
      return task;
    });
    
    setTasks(updatedTasks);
  };

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'pending':
        return 'secondary';
      case 'in_progress':
        return 'primary';
      case 'completed':
        return 'success';
      case 'on_hold':
        return 'warning';
      default:
        return 'light';
    }
  };

  const getPriorityBadgeVariant = (priority) => {
    switch (priority) {
      case 'low':
        return 'info';
      case 'medium':
        return 'secondary';
      case 'high':
        return 'warning';
      case 'urgent':
        return 'danger';
      default:
        return 'light';
    }
  };

  const getCategoryBadgeVariant = (category) => {
    switch (category) {
      case 'content':
        return 'info';
      case 'technical':
        return 'dark';
      case 'administrative':
        return 'secondary';
      case 'support':
        return 'success';
      case 'marketing':
        return 'primary';
      default:
        return 'light';
    }
  };

  const getAssigneeName = (assigneeId) => {
    const user = users.find(user => user.id === assigneeId);
    return user ? user.name : 'Unassigned';
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const isOverdue = (task) => {
    return task.status !== 'completed' && new Date(task.dueDate) < new Date();
  };

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
    return <Alert variant="danger">{error}</Alert>;
  }

  return (
    <Container fluid className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Task Management</h2>
        <Button variant="primary" onClick={handleAddTask}>
          <FaPlus className="me-2" /> Add New Task
        </Button>
      </div>
      
      <Tabs
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k)}
        className="mb-4"
      >
        <Tab eventKey="all" title={<><FaTasks className="me-2" />All Tasks</>}>
          <Card className="mb-4">
            <Card.Header>
              <h5 className="mb-0">Task Filters</h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={2}>
                  <Form.Group className="mb-3">
                    <Form.Label>Status</Form.Label>
                    <Form.Select 
                      value={filter.status} 
                      onChange={(e) => handleFilterChange('status', e.target.value)}
                    >
                      <option value="all">All Statuses</option>
                      <option value="pending">Pending</option>
                      <option value="in_progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="on_hold">On Hold</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={2}>
                  <Form.Group className="mb-3">
                    <Form.Label>Priority</Form.Label>
                    <Form.Select 
                      value={filter.priority} 
                      onChange={(e) => handleFilterChange('priority', e.target.value)}
                    >
                      <option value="all">All Priorities</option>
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group className="mb-3">
                    <Form.Label>Assignee</Form.Label>
                    <Form.Select 
                      value={filter.assignee} 
                      onChange={(e) => handleFilterChange('assignee', e.target.value)}
                    >
                      <option value="all">All Assignees</option>
                      {users.map(user => (
                        <option key={user.id} value={user.id}>{user.name}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={2}>
                  <Form.Group className="mb-3">
                    <Form.Label>Due Date</Form.Label>
                    <Form.Select 
                      value={filter.dueDate} 
                      onChange={(e) => handleFilterChange('dueDate', e.target.value)}
                    >
                      <option value="all">All Dates</option>
                      <option value="today">Today</option>
                      <option value="this_week">This Week</option>
                      <option value="next_week">Next Week</option>
                      <option value="overdue">Overdue</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group className="mb-3">
                    <Form.Label>Search</Form.Label>
                    <Form.Control 
                      type="text" 
                      placeholder="Search tasks..." 
                      value={filter.search}
                      onChange={(e) => handleFilterChange('search', e.target.value)}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Card.Body>
          </Card>
          
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Tasks</h5>
              <span className="text-muted">Showing {filteredTasks.length} of {tasks.length} tasks</span>
            </Card.Header>
            <Card.Body>
              <div className="table-responsive">
                <Table hover>
                  <thead>
                    <tr>
                      <th onClick={() => handleSort('title')} style={{ cursor: 'pointer' }}>
                        Title {sortConfig.key === 'title' && (
                          <FaSort className={`ms-1 ${sortConfig.direction === 'asc' ? 'text-muted' : 'text-primary'}`} />
                        )}
                      </th>
                      <th onClick={() => handleSort('status')} style={{ cursor: 'pointer' }}>
                        Status {sortConfig.key === 'status' && (
                          <FaSort className={`ms-1 ${sortConfig.direction === 'asc' ? 'text-muted' : 'text-primary'}`} />
                        )}
                      </th>
                      <th onClick={() => handleSort('priority')} style={{ cursor: 'pointer' }}>
                        Priority {sortConfig.key === 'priority' && (
                          <FaSort className={`ms-1 ${sortConfig.direction === 'asc' ? 'text-muted' : 'text-primary'}`} />
                        )}
                      </th>
                      <th onClick={() => handleSort('assigneeId')} style={{ cursor: 'pointer' }}>
                        Assignee {sortConfig.key === 'assigneeId' && (
                          <FaSort className={`ms-1 ${sortConfig.direction === 'asc' ? 'text-muted' : 'text-primary'}`} />
                        )}
                      </th>
                      <th onClick={() => handleSort('dueDate')} style={{ cursor: 'pointer' }}>
                        Due Date {sortConfig.key === 'dueDate' && (
                          <FaSort className={`ms-1 ${sortConfig.direction === 'asc' ? 'text-muted' : 'text-primary'}`} />
                        )}
                      </th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTasks.map(task => (
                      <tr key={task.id} className={isOverdue(task) ? 'table-danger' : ''}>
                        <td>
                          <div className="fw-bold">{task.title}</div>
                          <Badge bg={getCategoryBadgeVariant(task.category)} className="me-2">
                            {task.category.charAt(0).toUpperCase() + task.category.slice(1)}
                          </Badge>
                        </td>
                        <td>
                          <Dropdown>
                            <Dropdown.Toggle variant={getStatusBadgeVariant(task.status)} size="sm" id={`status-dropdown-${task.id}`}>
                              {task.status.replace('_', ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                              <Dropdown.Item onClick={() => handleStatusChange(task.id, 'pending')}>Pending</Dropdown.Item>
                              <Dropdown.Item onClick={() => handleStatusChange(task.id, 'in_progress')}>In Progress</Dropdown.Item>
                              <Dropdown.Item onClick={() => handleStatusChange(task.id, 'completed')}>Completed</Dropdown.Item>
                              <Dropdown.Item onClick={() => handleStatusChange(task.id, 'on_hold')}>On Hold</Dropdown.Item>
                            </Dropdown.Menu>
                          </Dropdown>
                        </td>
                        <td>
                          <Badge bg={getPriorityBadgeVariant(task.priority)}>
                            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                          </Badge>
                        </td>
                        <td>{getAssigneeName(task.assigneeId)}</td>
                        <td>
                          <div className={isOverdue(task) ? 'text-danger fw-bold' : ''}>
                            {formatDate(task.dueDate)}
                          </div>
                          {isOverdue(task) && <small className="text-danger">Overdue</small>}
                        </td>
                        <td>
                          <Button variant="outline-primary" size="sm" className="me-2" onClick={() => handleEditTask(task)}>
                            <FaEdit />
                          </Button>
                          <Button variant="outline-danger" size="sm" onClick={() => handleDeleteTask(task.id)}>
                            <FaTrash />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        </Tab>
        
        <Tab eventKey="my_tasks" title={<><FaUser className="me-2" />My Tasks</>}>
          {/* My Tasks content - will be filtered in the filterTasks function */}
        </Tab>
        
        <Tab eventKey="overdue" title={<><FaExclamationTriangle className="me-2" />Overdue</>}>
          {/* Overdue tasks content - will be filtered in the filterTasks function */}
        </Tab>
        
        <Tab eventKey="upcoming" title={<><FaClock className="me-2" />Upcoming</>}>
          {/* Upcoming tasks content - will be filtered in the filterTasks function */}
        </Tab>
      </Tabs>
      
      {/* Add/Edit Task Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{currentTask?.id ? 'Edit Task' : 'Add New Task'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control 
                type="text" 
                value={currentTask?.title || ''} 
                onChange={(e) => setCurrentTask({...currentTask, title: e.target.value})}
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control 
                as="textarea" 
                rows={3} 
                value={currentTask?.description || ''} 
                onChange={(e) => setCurrentTask({...currentTask, description: e.target.value})}
              />
            </Form.Group>
            
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Status</Form.Label>
                  <Form.Select 
                    value={currentTask?.status || 'pending'} 
                    onChange={(e) => setCurrentTask({...currentTask, status: e.target.value})}
                  >
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="on_hold">On Hold</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Priority</Form.Label>
                  <Form.Select 
                    value={currentTask?.priority || 'medium'} 
                    onChange={(e) => setCurrentTask({...currentTask, priority: e.target.value})}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Category</Form.Label>
                  <Form.Select 
                    value={currentTask?.category || 'administrative'} 
                    onChange={(e) => setCurrentTask({...currentTask, category: e.target.value})}
                  >
                    <option value="content">Content</option>
                    <option value="technical">Technical</option>
                    <option value="administrative">Administrative</option>
                    <option value="support">Support</option>
                    <option value="marketing">Marketing</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Assignee</Form.Label>
                  <Form.Select 
                    value={currentTask?.assigneeId || 1} 
                    onChange={(e) => setCurrentTask({...currentTask, assigneeId: parseInt(e.target.value)})}
                  >
                    {users.map(user => (
                      <option key={user.id} value={user.id}>{user.name}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            
            <Form.Group className="mb-3">
              <Form.Label>Due Date</Form.Label>
              <DatePicker
                selected={currentTask?.dueDate ? new Date(currentTask.dueDate) : new Date()}
                onChange={(date) => setCurrentTask({...currentTask, dueDate: date})}
                className="form-control"
                dateFormat="MMMM d, yyyy"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSaveTask}>
            {currentTask?.id ? 'Update Task' : 'Create Task'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default TaskDashboard;
