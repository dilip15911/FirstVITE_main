import React, { useState } from 'react';
import { Container, Form, Button, Alert, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import api from '../../utils/api';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [step, setStep] = useState('email'); // email, verify, reset
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendCode = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await api.post('/user/forgot-password', { email });
      setSuccess('If your email is registered, you will receive a reset code');
      setStep('verify');
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await api.post('/user/verify-reset-code', { email, code });
      setStep('reset');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid or expired code');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      await api.post('/user/reset-password', { email, code, newPassword });
      setSuccess('Password reset successful! You can now login with your new password.');
      setTimeout(() => {
        window.location.href = '/login';
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <Card style={{ width: '400px' }}>
        <Card.Body>
          <h2 className="text-center mb-4">Reset Password</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}

          {step === 'email' && (
            <Form onSubmit={handleSendCode}>
              <Form.Group className="mb-3">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Enter your email"
                />
              </Form.Group>
              <Button className="w-100 mb-3" type="submit" disabled={loading}>
                {loading ? 'Sending...' : 'Send Reset Code'}
              </Button>
            </Form>
          )}

          {step === 'verify' && (
            <Form onSubmit={handleVerifyCode}>
              <Form.Group className="mb-3">
                <Form.Label>Verification Code</Form.Label>
                <Form.Control
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  required
                  placeholder="Enter verification code"
                />
              </Form.Group>
              <Button className="w-100 mb-3" type="submit" disabled={loading}>
                {loading ? 'Verifying...' : 'Verify Code'}
              </Button>
            </Form>
          )}

          {step === 'reset' && (
            <Form onSubmit={handleResetPassword}>
              <Form.Group className="mb-3">
                <Form.Label>New Password</Form.Label>
                <Form.Control
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  placeholder="Enter new password"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  placeholder="Confirm new password"
                />
              </Form.Group>
              <Button className="w-100 mb-3" type="submit" disabled={loading}>
                {loading ? 'Resetting...' : 'Reset Password'}
              </Button>
            </Form>
          )}

          <div className="text-center">
            <Link to="/login">Back to Login</Link>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ForgotPassword;
