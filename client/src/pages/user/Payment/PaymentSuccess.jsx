import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FaCheckCircle, FaDownload, FaBook, FaArrowRight } from 'react-icons/fa';
import axios from 'axios';

const PaymentSuccess = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [transactionDetails, setTransactionDetails] = useState({
    transactionId: `TXN${Math.floor(Math.random() * 1000000)}`,
    date: new Date().toLocaleString(),
    amount: 0,
    status: 'completed'
  });

  useEffect(() => {
    fetchCourseDetails();
  }, [courseId]);

  const fetchCourseDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/courses/${courseId}`);
      setCourse(response.data);
      setTransactionDetails(prev => ({
        ...prev,
        amount: (response.data.price * 1.1).toFixed(2) // Including tax
      }));
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch course details. Please contact support.');
      setLoading(false);
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
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="border-0 shadow-sm">
            <Card.Body className="p-5">
              <div className="text-center mb-4">
                <FaCheckCircle size={60} className="text-success mb-3" />
                <h2>Payment Successful!</h2>
                <p className="text-muted">Your enrollment for {course?.title} has been confirmed.</p>
              </div>

              <Card className="bg-light mb-4">
                <Card.Body>
                  <h5 className="mb-3">Transaction Details</h5>
                  <Row>
                    <Col md={6}>
                      <p className="mb-2"><strong>Transaction ID:</strong></p>
                      <p className="mb-2"><strong>Date:</strong></p>
                      <p className="mb-2"><strong>Amount:</strong></p>
                      <p className="mb-0"><strong>Status:</strong></p>
                    </Col>
                    <Col md={6}>
                      <p className="mb-2">{transactionDetails.transactionId}</p>
                      <p className="mb-2">{transactionDetails.date}</p>
                      <p className="mb-2">${transactionDetails.amount}</p>
                      <p className="mb-0">
                        <span className="badge bg-success">
                          {transactionDetails.status}
                        </span>
                      </p>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>

              <div className="text-center mb-4">
                <h5>What's Next?</h5>
                <p>You can now access your course materials and start learning right away.</p>
              </div>

              <Row className="g-3">
                <Col md={6}>
                  <Button 
                    as={Link}
                    to={`/user/courses/${courseId}`}
                    variant="primary" 
                    className="w-100 d-flex align-items-center justify-content-center"
                  >
                    <FaBook className="me-2" /> Start Learning
                  </Button>
                </Col>
                <Col md={6}>
                  <Button 
                    as={Link}
                    to="/user/dashboard"
                    variant="outline-primary" 
                    className="w-100 d-flex align-items-center justify-content-center"
                  >
                    <FaArrowRight className="me-2" /> Go to Dashboard
                  </Button>
                </Col>
              </Row>

              <div className="mt-4">
                <Button 
                  variant="outline-secondary" 
                  size="sm"
                  className="d-flex align-items-center mx-auto"
                  onClick={() => {
                    // In a real app, this would generate and download a PDF receipt
                    alert('Receipt download functionality would be implemented here');
                  }}
                >
                  <FaDownload className="me-2" /> Download Receipt
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default PaymentSuccess;
