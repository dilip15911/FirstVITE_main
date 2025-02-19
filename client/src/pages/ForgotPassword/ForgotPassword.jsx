import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import api from '../../utils/api';
import './ForgotPassword.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [step, setStep] = useState('request'); // 'request', 'verify', 'reset'
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRequestReset = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await api.post('/user/forgot-password', { email });
      setSuccess('Reset code sent to your email');
      setStep('verify');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send reset code');
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
      setError(err.response?.data?.message || 'Invalid reset code');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    setLoading(true);

    try {
      await api.post('/user/reset-password', {
        email,
        code,
        newPassword
      });
      setSuccess('Password reset successful! You can now login.');
      setStep('done');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-box">
        <h1>Reset Password</h1>
        
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        {step === 'request' && (
          <form onSubmit={handleRequestReset}>
            <p className="subtitle">Enter your email to receive a reset code</p>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
              />
            </div>
            <button type="submit" className="submit-btn">
              Send Reset Code
            </button>
          </form>
        )}

        {step === 'verify' && (
          <form onSubmit={handleVerifyCode}>
            <p className="subtitle">Enter the reset code sent to your email</p>
            <div className="form-group">
              <label htmlFor="code">Reset Code</label>
              <input
                type="text"
                id="code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
                placeholder="Enter 6-digit code"
                maxLength="6"
              />
            </div>
            <button type="submit" className="submit-btn">
              Verify Code
            </button>
          </form>
        )}

        {step === 'reset' && (
          <form onSubmit={handleResetPassword}>
            <p className="subtitle">Create your new password</p>
            <div className="form-group">
              <label htmlFor="newPassword">New Password</label>
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                placeholder="Enter new password"
                minLength="8"
              />
            </div>
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="Confirm new password"
                minLength="8"
              />
            </div>
            <button type="submit" className="submit-btn">
              Reset Password
            </button>
          </form>
        )}

        {step === 'done' && (
          <div className="text-center">
            <Link to="/login" className="login-link">
              Return to Login
            </Link>
          </div>
        )}

        {step !== 'done' && (
          <div className="back-to-login">
            <Link to="/login">Back to Login</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
