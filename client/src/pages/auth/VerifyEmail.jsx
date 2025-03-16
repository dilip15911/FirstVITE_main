import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Form, Button, Container, Row, Col, Card, InputGroup } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faKey } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import './Auth.css';

const VerifyEmail = () => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(600); // 10 minutes in seconds
  const { verifyEmail, resendVerification } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { userId, email, message } = location.state || {};

  useEffect(() => {
    if (!userId || !email) {
      navigate('/signup');
      return;
    }

    // Show initial message
    if (message) {
      toast.info(message);
    }

    // Start countdown
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [userId, email, message, navigate]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await verifyEmail(userId, otp);
      
      if (result.success) {
        toast.success(result.message);
        // Redirect to login page after a short delay
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error('Verification error:', error);
      toast.error('Failed to verify email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (loading || countdown > 0) return;
    
    setLoading(true);
    try {
      const result = await resendVerification(userId);
      
      if (result.success) {
        toast.success('New verification code sent! Please check your email.');
        setCountdown(600); // Reset countdown to 10 minutes
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error('Resend OTP error:', error);
      toast.error('Failed to resend verification code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container fluid className="auth-container">
      <Row className="justify-content-center align-items-center min-vh-100">
        <Col md={6} lg={5} xl={4}>
          <Card className="auth-card">
            <Card.Body className="p-4">
              <div className="auth-header text-center">
                <h2>Verify Your Email</h2>
                <p className="text-muted">
                  We've sent a verification code to<br />
                  <strong>{email}</strong>
                </p>
              </div>

              <Form onSubmit={handleSubmit}>
                <InputGroup className="mb-3">
                  <InputGroup.Text>
                    <FontAwesomeIcon icon={faKey} />
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter verification code"
                    required
                    maxLength={6}
                    pattern="[0-9]{6}"
                    title="Please enter a 6-digit code"
                  />
                </InputGroup>

                <div className="d-grid gap-3">
                  <Button 
                    variant="primary" 
                    type="submit" 
                    disabled={loading || !otp}
                    className="py-2"
                  >
                    {loading ? (
                      <span className="loading-dots">Verifying</span>
                    ) : (
                      'Verify Email'
                    )}
                  </Button>

                  <div className="text-center">
                    <p className="text-muted mb-2">
                      Didn't receive the code? {countdown > 0 ? (
                        <span>Wait {formatTime(countdown)}</span>
                      ) : (
                        <Button
                          variant="link"
                          onClick={handleResendOtp}
                          disabled={loading}
                          className="p-0"
                        >
                          Resend Code
                        </Button>
                      )}
                    </p>
                  </div>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default VerifyEmail;
