import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { FaCreditCard, FaLock, FaPaypal, FaMoneyBillWave } from 'react-icons/fa';
import axios from 'axios';

const PaymentCheckout = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [formData, setFormData] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
    saveCard: false
  });
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchCourseDetails();
  }, [courseId]);

  const fetchCourseDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/courses/${courseId}`);
      setCourse(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch course details. Please try again.');
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
  };

  const validateForm = () => {
    if (paymentMethod === 'card') {
      if (!formData.cardNumber || !formData.cardName || !formData.expiryDate || !formData.cvv) {
        setError('Please fill in all card details');
        return false;
      }
      // Basic validation for card number (16 digits)
      if (!/^\d{16}$/.test(formData.cardNumber.replace(/\s/g, ''))) {
        setError('Invalid card number');
        return false;
      }
      // Basic validation for expiry date (MM/YY)
      if (!/^\d{2}\/\d{2}$/.test(formData.expiryDate)) {
        setError('Invalid expiry date (MM/YY)');
        return false;
      }
      // Basic validation for CVV (3 or 4 digits)
      if (!/^\d{3,4}$/.test(formData.cvv)) {
        setError('Invalid CVV');
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) {
      return;
    }

    try {
      setProcessing(true);
      
      // In a real application, you would use a secure payment gateway like Stripe
      // For this demo, we'll simulate a successful payment
      const paymentData = {
        courseId,
        amount: course.price,
        paymentMethod,
        ...(paymentMethod === 'card' && {
          cardDetails: {
            last4: formData.cardNumber.slice(-4),
            expiryDate: formData.expiryDate,
            saveCard: formData.saveCard
          }
        })
      };

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real app:
      // const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/payments/process`, paymentData);
      
      setSuccess(true);
      setProcessing(false);
      
      // Redirect to success page after 2 seconds
      setTimeout(() => {
        navigate(`/user/payment/success/${courseId}`);
      }, 2000);
      
    } catch (err) {
      setError('Payment processing failed. Please try again.');
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (success) {
    return (
      <Container className="py-5">
        <Alert variant="success" className="text-center">
          <h4>Payment Successful!</h4>
          <p>Your enrollment for {course?.title} has been confirmed.</p>
          <p>Redirecting to confirmation page...</p>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <h2 className="mb-4">Checkout</h2>
      
      {error && <Alert variant="danger">{error}</Alert>}
      
      <Row>
        <Col md={8}>
          <Card className="mb-4">
            <Card.Header className="bg-white">
              <h5 className="mb-0">Payment Method</h5>
            </Card.Header>
            <Card.Body>
              <div className="mb-4">
                <div className="d-flex mb-3">
                  <Button 
                    variant={paymentMethod === 'card' ? 'primary' : 'outline-secondary'} 
                    className="me-2 d-flex align-items-center"
                    onClick={() => handlePaymentMethodChange('card')}
                  >
                    <FaCreditCard className="me-2" /> Credit/Debit Card
                  </Button>
                  <Button 
                    variant={paymentMethod === 'paypal' ? 'primary' : 'outline-secondary'} 
                    className="me-2 d-flex align-items-center"
                    onClick={() => handlePaymentMethodChange('paypal')}
                  >
                    <FaPaypal className="me-2" /> PayPal
                  </Button>
                  <Button 
                    variant={paymentMethod === 'bank' ? 'primary' : 'outline-secondary'} 
                    className="d-flex align-items-center"
                    onClick={() => handlePaymentMethodChange('bank')}
                  >
                    <FaMoneyBillWave className="me-2" /> Bank Transfer
                  </Button>
                </div>
              </div>

              {paymentMethod === 'card' && (
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Card Number</Form.Label>
                    <Form.Control
                      type="text"
                      name="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      maxLength="19"
                    />
                  </Form.Group>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>Cardholder Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="cardName"
                      placeholder="John Doe"
                      value={formData.cardName}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                  
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Expiry Date</Form.Label>
                        <Form.Control
                          type="text"
                          name="expiryDate"
                          placeholder="MM/YY"
                          value={formData.expiryDate}
                          onChange={handleInputChange}
                          maxLength="5"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>CVV</Form.Label>
                        <Form.Control
                          type="password"
                          name="cvv"
                          placeholder="123"
                          value={formData.cvv}
                          onChange={handleInputChange}
                          maxLength="4"
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  
                  <Form.Group className="mb-3">
                    <Form.Check
                      type="checkbox"
                      name="saveCard"
                      label="Save this card for future payments"
                      checked={formData.saveCard}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                  
                  <div className="d-grid">
                    <Button 
                      variant="primary" 
                      type="submit" 
                      size="lg"
                      disabled={processing}
                    >
                      {processing ? (
                        <>
                          <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                            className="me-2"
                          />
                          Processing...
                        </>
                      ) : (
                        <>Pay ${course?.price}</>
                      )}
                    </Button>
                  </div>
                </Form>
              )}
              
              {paymentMethod === 'paypal' && (
                <div className="text-center py-4">
                  <p>You will be redirected to PayPal to complete your payment.</p>
                  <Button 
                    variant="primary" 
                    size="lg"
                    onClick={handleSubmit}
                    disabled={processing}
                  >
                    {processing ? (
                      <>
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                          className="me-2"
                        />
                        Processing...
                      </>
                    ) : (
                      <>Continue to PayPal</>
                    )}
                  </Button>
                </div>
              )}
              
              {paymentMethod === 'bank' && (
                <div className="py-4">
                  <p>Please use the following details to make a bank transfer:</p>
                  <Card className="mb-3">
                    <Card.Body>
                      <p><strong>Bank Name:</strong> First VITE Bank</p>
                      <p><strong>Account Name:</strong> First VITE Education</p>
                      <p><strong>Account Number:</strong> 1234567890</p>
                      <p><strong>IFSC Code:</strong> FVITE0001234</p>
                      <p><strong>Amount:</strong> ${course?.price}</p>
                      <p><strong>Reference:</strong> COURSE-{courseId}</p>
                    </Card.Body>
                  </Card>
                  <p className="mb-4">After making the payment, please click the button below to notify us.</p>
                  <div className="d-grid">
                    <Button 
                      variant="primary" 
                      size="lg"
                      onClick={handleSubmit}
                      disabled={processing}
                    >
                      {processing ? (
                        <>
                          <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                            className="me-2"
                          />
                          Processing...
                        </>
                      ) : (
                        <>I've Completed the Bank Transfer</>
                      )}
                    </Button>
                  </div>
                </div>
              )}
              
              <div className="mt-4 text-center text-muted">
                <small><FaLock className="me-1" /> Your payment information is secure and encrypted</small>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={4}>
          <Card className="mb-4">
            <Card.Header className="bg-white">
              <h5 className="mb-0">Order Summary</h5>
            </Card.Header>
            <Card.Body>
              <div className="mb-3">
                <h6>{course?.title}</h6>
                <p className="text-muted">{course?.instructor}</p>
              </div>
              
              <hr />
              
              <div className="d-flex justify-content-between mb-2">
                <span>Course Price</span>
                <span>${course?.price}</span>
              </div>
              
              {course?.discount > 0 && (
                <div className="d-flex justify-content-between mb-2 text-success">
                  <span>Discount</span>
                  <span>-${course?.discount}</span>
                </div>
              )}
              
              <div className="d-flex justify-content-between mb-2">
                <span>Tax</span>
                <span>${(course?.price * 0.1).toFixed(2)}</span>
              </div>
              
              <hr />
              
              <div className="d-flex justify-content-between mb-0">
                <strong>Total</strong>
                <strong>${(course?.price * 1.1).toFixed(2)}</strong>
              </div>
            </Card.Body>
          </Card>
          
          <Card>
            <Card.Body>
              <h6>Need Help?</h6>
              <p className="text-muted mb-0">If you have any questions about your payment, please contact our support team.</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default PaymentCheckout;
