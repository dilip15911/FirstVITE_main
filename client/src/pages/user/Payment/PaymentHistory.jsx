import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Badge, Form, Button, Pagination } from 'react-bootstrap';
import { FaDownload, FaSearch, FaFilter, FaEye } from 'react-icons/fa';
import { Link } from 'react-router-dom';
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
  const [currentPage, setCurrentPage] = useState(1);
  const [transactionsPerPage] = useState(10);

  // Mock data for development
  const mockTransactions = [
    {
      id: 1,
      transactionId: 'TXN123456',
      date: '2025-03-15T10:30:00',
      course: 'Advanced React Development',
      amount: 99.99,
      status: 'completed',
      paymentMethod: 'Credit Card (**** 1234)'
    },
    {
      id: 2,
      transactionId: 'TXN123457',
      date: '2025-03-10T14:20:00',
      course: 'Data Science Fundamentals',
      amount: 149.99,
      status: 'completed',
      paymentMethod: 'PayPal'
    },
    {
      id: 3,
      transactionId: 'TXN123458',
      date: '2025-03-05T09:15:00',
      course: 'UI/UX Design Masterclass',
      amount: 79.99,
      status: 'completed',
      paymentMethod: 'Credit Card (**** 5678)'
    },
    {
      id: 4,
      transactionId: 'TXN123459',
      date: '2025-02-28T16:45:00',
      course: 'Python for Machine Learning',
      amount: 129.99,
      status: 'refunded',
      paymentMethod: 'Credit Card (**** 9012)'
    },
    {
      id: 5,
      transactionId: 'TXN123460',
      date: '2025-02-20T11:10:00',
      course: 'Web Development Bootcamp',
      amount: 199.99,
      status: 'completed',
      paymentMethod: 'Bank Transfer'
    },
    {
      id: 6,
      transactionId: 'TXN123461',
      date: '2025-02-15T13:25:00',
      course: 'JavaScript Fundamentals',
      amount: 69.99,
      status: 'pending',
      paymentMethod: 'Bank Transfer'
    },
    {
      id: 7,
      transactionId: 'TXN123462',
      date: '2025-02-10T15:30:00',
      course: 'Mobile App Development with Flutter',
      amount: 149.99,
      status: 'completed',
      paymentMethod: 'Credit Card (**** 3456)'
    }
  ];

  useEffect(() => {
    fetchTransactions();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [transactions, searchTerm, statusFilter, dateRange]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      // In a real app:
      // const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/user/payments/history`);
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
        transaction.course.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(transaction => transaction.status === statusFilter);
    }
    
    // Apply date range filter
    if (startDate && endDate) {
      filtered = filtered.filter(transaction => {
        const transactionDate = new Date(transaction.date);
        return transactionDate >= startDate && transactionDate <= endDate;
      });
    }
    
    setFilteredTransactions(filtered);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setDateRange([null, null]);
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

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <div className="alert alert-danger">{error}</div>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <h2 className="mb-4">Payment History</h2>
      
      <Card className="mb-4">
        <Card.Body>
          <Row className="g-3">
            <Col md={4}>
              <Form.Group>
                <Form.Label>Search</Form.Label>
                <div className="position-relative">
                  <Form.Control
                    type="text"
                    placeholder="Transaction ID or Course"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <FaSearch className="position-absolute" style={{ right: '10px', top: '10px', color: '#6c757d' }} />
                </div>
              </Form.Group>
            </Col>
            <Col md={3}>
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
        </Card.Body>
      </Card>
      
      <Card>
        <Card.Body className="p-0">
          <Table responsive className="mb-0">
            <thead>
              <tr>
                <th>Transaction ID</th>
                <th>Date</th>
                <th>Course</th>
                <th>Amount</th>
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
                    <td>{new Date(transaction.date).toLocaleDateString()}</td>
                    <td>{transaction.course}</td>
                    <td>${transaction.amount.toFixed(2)}</td>
                    <td>{transaction.paymentMethod}</td>
                    <td>{getStatusBadge(transaction.status)}</td>
                    <td>
                      <Button 
                        variant="outline-primary" 
                        size="sm" 
                        className="me-1"
                        as={Link}
                        to={`/user/payment/details/${transaction.id}`}
                      >
                        <FaEye />
                      </Button>
                      <Button 
                        variant="outline-secondary" 
                        size="sm"
                        onClick={() => {
                          // In a real app, this would generate and download a receipt
                          alert('Receipt download functionality would be implemented here');
                        }}
                      >
                        <FaDownload />
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-4">
                    No transactions found
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
        {totalPages > 1 && (
          <Card.Footer className="bg-white">
            <Pagination className="justify-content-center mb-0">
              <Pagination.Prev 
                onClick={() => paginate(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              />
              {[...Array(totalPages)].map((_, i) => (
                <Pagination.Item
                  key={i + 1}
                  active={i + 1 === currentPage}
                  onClick={() => paginate(i + 1)}
                >
                  {i + 1}
                </Pagination.Item>
              ))}
              <Pagination.Next 
                onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
              />
            </Pagination>
          </Card.Footer>
        )}
      </Card>
    </Container>
  );
};

export default PaymentHistory;
