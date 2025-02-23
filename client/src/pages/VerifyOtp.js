import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../../utils/api';

const VerifyOtp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const email = location.state?.email; // Email from signup page

  useEffect(() => {
    if (!email) {
      setError('Email not found. Please sign up again.');
    }
  }, [email]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Invalid session. Please sign up again.');
      return;
    }

    try {
      const response = await api.post('/user/verify-otp', { email, otp: otp.trim() });

      if (response.data.success) {
        alert('OTP Verified! You can now log in.');
        navigate('/login');
      } else {
        setError(response.data.message || 'Invalid OTP. Please try again.');
      }
    } catch (error) {
      console.error('OTP verification error:', error.response?.data);
      setError(error.response?.data?.message || 'Invalid or expired OTP');
    }
  };

  return (
    <div className="otp-container">
      <h2>Verify Your Email</h2>
      {email ? (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />
          <button type="submit">Verify OTP</button>
        </form>
      ) : (
        <p className="error">No email found. Please sign up again.</p>
      )}
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default VerifyOtp;
