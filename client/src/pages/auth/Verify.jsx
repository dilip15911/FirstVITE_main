import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Form, Button, Container, Card, Alert, InputGroup } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faKey } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import './Auth.css';

const Verify = () => {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const userId = location.state?.userId;
  const email = location.state?.email;

  const handleVerify = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await axios.post('http://localhost:5000/api/auth/verify', {
        userId,
        otp
      });

      setSuccess('Email verified successfully! Redirecting to login...');
      
      // Redirect to login after successful verification
      setTimeout(() => {
        navigate('/login', { 
          state: { message: 'Email verified successfully! Please login.' }
        });
      }, 2000);
    } catch (error) {
      setError(error.response?.data?.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setError('');
    setSuccess('');
    setResending(true);

    try {
      await axios.post('http://localhost:5000/api/auth/resend-otp', {
        userId,
        email
      });
      setSuccess('New verification code sent! Please check your email.');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to resend verification code');
    } finally {
      setResending(false);
    }
  };

  if (!userId || !email) {
    return (
      <Container className="auth-container">
        <Card className="auth-card">
          <Card.Body>
            <div className="auth-header">
              <h2>Invalid Link</h2>
              <p>Please try signing up again</p>
            </div>
            <Button 
              variant="primary"
              onClick={() => navigate('/signup')}
              className="w-100"
            >
              Go to Signup
            </Button>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  return (
    <Container className="auth-container">
      <Card className="auth-card">
        <Card.Body>
          <div className="auth-header">
            <h2>Verify Your Email</h2>
            <p>Enter the verification code sent to your email</p>
          </div>
          
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}
          
          <Form onSubmit={handleVerify}>
            <InputGroup className="mb-4">
              <InputGroup.Text>
                <FontAwesomeIcon icon={faKey} />
              </InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="Enter the 6-digit code"
                value={otp}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9]/g, '');
                  if (value.length <= 6) setOtp(value);
                }}
                required
                maxLength="6"
                pattern="[0-9]{6}"
                className="text-center fs-4 letter-spacing-2"
              />
            </InputGroup>
            
            <Form.Text className="text-muted text-center d-block mb-4">
              Please check your email for the verification code.<br />
              The code will expire in 10 minutes.
            </Form.Text>

            <Button
              variant="primary"
              type="submit"
              disabled={loading || resending}
              className="mb-3"
            >
              {loading ? 'Verifying...' : 'Verify Email'}
            </Button>

            <div className="text-center">
              Didn't receive the code?{' '}
              <Button
                variant="link"
                onClick={handleResendOTP}
                disabled={loading || resending}
                className="p-0"
              >
                {resending ? 'Sending...' : 'Resend Code'}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Verify;
