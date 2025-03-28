import React, { useState, useEffect } from 'react';
import { Card, Table, Badge, Button, Form, Row, Col, Pagination, Dropdown } from 'react-bootstrap';
import { FaDownload, FaSearch, FaFilter, FaEye, FaFileExport } from 'react-icons/fa';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const PaymentHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentMethodFilter, setPaymentMethodFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [transactionsPerPage] = useState(10);
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');

  // Mock data for development
  const mockTransactions = [
    {
      id: 1,
      transactionId: 'TXN123456',
      date: '2025-03-15T10:30:00',
      student: 'John Doe',
      course: 'Advanced React Development',
      amount: 99.99,
      status: 'completed',
      paymentMethod: 'Credit Card'
    },
    {
      id: 2,
      transactionId: 'TXN123457',
      date: '2025-03-10T14:20:00',
      student: 'Jane Smith',
      course: 'Data Science Fundamentals',
      amount: 149.99,
      status: 'completed',
      paymentMethod: 'PayPal'
    },
    {
      id: 3,
      transactionId: 'TXN123458',
      date: '2025-03-05T09:15:00',
      student: 'Michael Johnson',
      course: 'UI/UX Design Masterclass',
      amount: 79.99,
      status: 'completed',
      paymentMethod: 'Credit Card'
    },
    {
      id: 4,
      transactionId: 'TXN123459',
      date: '2025-02-28T16:45:00',
      student: 'Emily Davis',
      course: 'Python for Machine Learning',
      amount: 129.99,
      status: 'refunded',
      paymentMethod: 'Credit Card'
    },
    {
      id: 5,
      transactionId: 'TXN123460',
      date: '2025-02-20T11:10:00',
      student: 'David Wilson',
      course: 'Web Development Bootcamp',
      amount: 199.99,
      status: 'completed',
      paymentMethod: 'Bank Transfer'
    },
    {
      id: 6,
      transactionId: 'TXN123461',
      date: '2025-02-15T13:25:00',
      student: 'Sarah Brown',
      course: 'JavaScript Fundamentals',
      amount: 69.99,
      status: 'pending',
      paymentMethod: 'Bank Transfer'
    },
    {
      id: 7,
      transactionId: 'TXN123462',
      date: '2025-02-10T15:30:00',
      student: 'Robert Taylor',
      course: 'Mobile App Development with Flutter',
      amount: 149.99,
      status: 'completed',
      paymentMethod: 'Credit Card'
    },
    {
      id: 8,
      transactionId: 'TXN123463',
      date: '2025-02-05T09:45:00',
      student: 'Jennifer Martinez',
      course: 'Cloud Computing Essentials',
      amount: 129.99,
      status: 'completed',
      paymentMethod: 'PayPal'
    },
    {
      id: 9,
      transactionId: 'TXN123464',
      date: '2025-01-30T14:15:00',
      student: 'Thomas Anderson',
      course: 'Cybersecurity Fundamentals',
      amount: 179.99,
      status: 'completed',
      paymentMethod: 'Credit Card'
    },
    {
      id: 10,
      transactionId: 'TXN123465',
      date: '2025-01-25T10:20:00',
      student: 'Lisa Garcia',
      course: 'Digital Marketing Masterclass',
      amount: 89.99,
      status: 'refunded',
      paymentMethod: 'PayPal'
    },
    {
      id: 11,
      transactionId: 'TXN123466',
      date: '2025-01-20T16:30:00',
      student: 'Daniel Lee',
      course: 'Blockchain Development',
      amount: 199.99,
      status: 'completed',
      paymentMethod: 'Credit Card'
    },
    {
      id: 12,
      transactionId: 'TXN123467',
      date: '2025-01-15T11:45:00',
      student: 'Michelle Rodriguez',
      course: 'Artificial Intelligence Basics',
      amount: 149.99,
      status: 'pending',
      paymentMethod: 'Bank Transfer'
    }
  ];

  useEffect(() => {
    fetchTransactions();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [transactions, searchTerm, statusFilter, paymentMethodFilter, dateRange, sortBy, sortOrder]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      // In a real app:
      // const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/payments/history`);
      // setTransactions(response.data);
      
      // Using mock data for development
      setTransactions(mockTransactions);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch payment history. Please try again.');
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...transactions];
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(transaction => 
        transaction.transactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.student.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.course.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(transaction => transaction.status === statusFilter);
    }
    
    // Apply payment method filter
    if (paymentMethodFilter !== 'all') {
      filtered = filtered.filter(transaction => transaction.paymentMethod === paymentMethodFilter);
    }
    
    // Apply date range filter
    if (startDate && endDate) {
      filtered = filtered.filter(transaction => {
        const transactionDate = new Date(transaction.date);
        return transactionDate >= startDate && transactionDate <= endDate;
      });
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'date':
          comparison = new Date(a.date) - new Date(b.date);
          break;
        case 'amount':
          comparison = a.amount - b.amount;
          break;
        case 'student':
          comparison = a.student.localeCompare(b.student);
          break;
        case 'course':
          comparison = a.course.localeCompare(b.course);
          break;
        default:
          comparison = new Date(a.date) - new Date(b.date);
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });
    
    setFilteredTransactions(filtered);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setPaymentMethodFilter('all');
    setDateRange([null, null]);
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const exportData = (format) => {
    // In a real app, this would generate and download a file
    alert(`Exporting data in ${format} format`);
  };

  // Pagination
  const indexOfLastTransaction = currentPage * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  const currentTransactions = filteredTransactions.slice(indexOfFirstTransaction, indexOfLastTransaction);
  const totalPages = Math.ceil(filteredTransactions.length / transactionsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return <Badge bg="success">Completed</Badge>;
      case 'pending':
        return <Badge bg="warning">Pending</Badge>;
      case 'refunded':
        return <Badge bg="danger">Refunded</Badge>;
      default:
        return <Badge bg="secondary">{status}</Badge>;
    }
  };

  // Get unique payment methods for filter
  const paymentMethods = ['all', ...new Set(transactions.map(t => t.paymentMethod))];

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
    <>
      <Card className="mb-4">
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Payment History</h5>
          <Dropdown>
            <Dropdown.Toggle variant="outline-secondary" id="dropdown-export">
              <FaFileExport className="me-1" /> Export
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => exportData('csv')}>CSV</Dropdown.Item>
              <Dropdown.Item onClick={() => exportData('excel')}>Excel</Dropdown.Item>
              <Dropdown.Item onClick={() => exportData('pdf')}>PDF</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Card.Header>
        <Card.Body>
          <Row className="g-3 mb-4">
            <Col md={3}>
              <Form.Group>
                <Form.Label>Search</Form.Label>
                <div className="position-relative">
                  <Form.Control
                    type="text"
                    placeholder="ID, Student, or Course"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <FaSearch className="position-absolute" style={{ right: '10px', top: '10px', color: '#6c757d' }} />
                </div>
              </Form.Group>
            </Col>
            <Col md={2}>
              <Form.Group>
                <Form.Label>Status</Form.Label>
                <Form.Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Statuses</option>
                  <option value="completed">Completed</option>
                  <option value="pending">Pending</option>
                  <option value="refunded">Refunded</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={2}>
              <Form.Group>
                <Form.Label>Payment Method</Form.Label>
                <Form.Select
                  value={paymentMethodFilter}
                  onChange={(e) => setPaymentMethodFilter(e.target.value)}
                >
                  <option value="all">All Methods</option>
                  {paymentMethods.filter(m => m !== 'all').map((method, index) => (
                    <option key={index} value={method}>{method}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Date Range</Form.Label>
                <DatePicker
                  selectsRange={true}
                  startDate={startDate}
                  endDate={endDate}
                  onChange={(update) => setDateRange(update)}
                  placeholderText="Select date range"
                  className="form-control"
                  isClearable={true}
                />
              </Form.Group>
            </Col>
            <Col md={1} className="d-flex align-items-end">
              <Button 
                variant="outline-secondary" 
                className="w-100"
                onClick={clearFilters}
              >
                <FaFilter /> Clear
              </Button>
            </Col>
          </Row>
          
          <div className="table-responsive">
            <Table hover>
              <thead>
                <tr>
                  <th>Transaction ID</th>
                  <th className="cursor-pointer" onClick={() => handleSort('student')}>
                    Student {sortBy === 'student' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </th>
                  <th className="cursor-pointer" onClick={() => handleSort('course')}>
                    Course {sortBy === 'course' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </th>
                  <th className="cursor-pointer" onClick={() => handleSort('amount')}>
                    Amount {sortBy === 'amount' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </th>
                  <th className="cursor-pointer" onClick={() => handleSort('date')}>
                    Date {sortBy === 'date' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </th>
                  <th>Payment Method</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentTransactions.length > 0 ? (
                  currentTransactions.map(transaction => (
                    <tr key={transaction.id}>
                      <td>{transaction.transactionId}</td>
                      <td>{transaction.student}</td>
                      <td>{transaction.course}</td>
                      <td>${transaction.amount.toFixed(2)}</td>
                      <td>{new Date(transaction.date).toLocaleDateString()}</td>
                      <td>{transaction.paymentMethod}</td>
                      <td>{getStatusBadge(transaction.status)}</td>
                      <td>
                        <Button 
                          variant="outline-primary" 
                          size="sm" 
                          className="me-1"
                          onClick={() => {
                            // In a real app, this would navigate to transaction details
                            alert(`View details for transaction ${transaction.transactionId}`);
                          }}
                        >
                          <FaEye />
                        </Button>
                        <Button 
                          variant="outline-secondary" 
                          size="sm"
                          onClick={() => {
                            // In a real app, this would generate and download a receipt
                            alert(`Download receipt for transaction ${transaction.transactionId}`);
                          }}
                        >
                          <FaDownload />
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center py-4">
                      No transactions found
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
          
          {totalPages > 1 && (
            <div className="d-flex justify-content-between align-items-center mt-3">
              <div>
                Showing {indexOfFirstTransaction + 1} to {Math.min(indexOfLastTransaction, filteredTransactions.length)} of {filteredTransactions.length} entries
              </div>
              <Pagination className="mb-0">
                <Pagination.Prev 
                  onClick={() => paginate(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                />
                {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                  let pageNumber;
                  if (totalPages <= 5) {
                    pageNumber = i + 1;
                  } else if (currentPage <= 3) {
                    pageNumber = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNumber = totalPages - 4 + i;
                  } else {
                    pageNumber = currentPage - 2 + i;
                  }
                  
                  return (
                    <Pagination.Item
                      key={pageNumber}
                      active={pageNumber === currentPage}
                      onClick={() => paginate(pageNumber)}
                    >
                      {pageNumber}
                    </Pagination.Item>
                  );
                })}
                <Pagination.Next 
                  onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                />
              </Pagination>
            </div>
          )}
        </Card.Body>
      </Card>
    </>
  );
};

export default PaymentHistory;
