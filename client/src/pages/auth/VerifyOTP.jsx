import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Form, Button, Container, Row, Col, Card } from 'react-bootstrap';
import { toast } from 'react-toastify';
import './Auth.css';

const VerifyOTP = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  const { verifyEmail, resendVerification } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { userId, email } = location.state || {};

  useEffect(() => {
    if (!userId || !email) {
      navigate('/signup');
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [userId, email, navigate]);

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (value === '' || /^[0-9]$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Auto-focus next input
      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        if (nextInput) nextInput.focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpString = otp.join('');
    
    if (otpString.length !== 6) {
      toast.error('Please enter a valid 6-digit code');
      return;
    }

    setLoading(true);
    try {
      const result = await verifyEmail(userId, otpString);
      
      if (result.success) {
        toast.success('Email verified successfully!');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        toast.error(result.message || 'Verification failed');
      }
    } catch (error) {
      console.error('Verification error:', error);
      toast.error('Failed to verify email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (timeLeft > 0) return;
    
    setLoading(true);
    try {
      const result = await resendVerification(userId);
      if (result.success) {
        setTimeLeft(600); // Reset timer to 10 minutes
        toast.success('New verification code sent to your email');
      } else {
        toast.error(result.message || 'Failed to resend code');
      }
    } catch (error) {
      console.error('Resend OTP error:', error);
      toast.error('Failed to resend verification code');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <Container fluid className="auth-container">
      <Row className="justify-content-center align-items-center min-vh-100">
        <Col md={6} lg={5} xl={4}>
          <Card className="auth-card">
            <Card.Body className="p-4">
              <div className="text-center mb-4">
                <h2>Verify Your Email</h2>
                <p className="text-muted">
                  We've sent a verification code to<br />
                  <strong>{email}</strong>
                </p>
              </div>

              <Form onSubmit={handleSubmit}>
                <div className="otp-container mb-4">
                  {otp.map((digit, index) => (
                    <Form.Control
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      maxLength="1"
                      value={digit}
                      onChange={(e) => handleChange(e, index)}
                      onKeyDown={(e) => handleKeyDown(e, index)}
                      className="otp-input"
                      required
                      autoComplete="off"
                    />
                  ))}
                </div>

                <div className="d-grid gap-2">
                  <Button 
                    variant="primary" 
                    type="submit" 
                    disabled={loading || otp.join('').length !== 6}
                    className="verify-btn"
                  >
                    {loading ? 'Verifying...' : 'Verify Email'}
                  </Button>

                  <div className="text-center mt-3">
                    <p className="text-muted mb-0">
                      Didn't receive the code?{' '}
                      {timeLeft > 0 ? (
                        <span>Wait {formatTime(timeLeft)}</span>
                      ) : (
                        <Button
                          variant="link"
                          onClick={handleResendOTP}
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

export default VerifyOTP;
