import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import api from '../../utils/api';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();
  
  const [loginMethod, setLoginMethod] = useState('password');
  const [otpSent, setOtpSent] = useState(false);
  const [linkSent, setLinkSent] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      verifyLoginLink(token);
    }
  }, [searchParams]);

  const handlePasswordLogin = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const response = await api.post('/user/login', { 
        email, 
        password,
        rememberMe 
      });
      
      if (rememberMe) {
        localStorage.setItem('rememberedEmail', email);
      } else {
        localStorage.removeItem('rememberedEmail');
      }

      login(response.data.token, response.data.user);
      navigate('/dashboard', { replace: true });
    } catch (error) {
      setError(error.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      await api.post('/user/generate-login-otp', { email });
      setOtpSent(true);
      setMessage('OTP has been sent to your email');
    } catch (error) {
      console.error('Send OTP error:', error);
      setError(error.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpLogin = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      // Make sure OTP is 6 digits
      if (!/^\d{6}$/.test(otp)) {
        throw new Error('Please enter a valid 6-digit OTP');
      }

      const response = await api.post('/user/verify-login-otp', { 
        email, 
        otp
      });

      if (response.data.token && response.data.user) {
        if (rememberMe) {
          localStorage.setItem('rememberedEmail', email);
        } else {
          localStorage.removeItem('rememberedEmail');
        }

        login(response.data.token, response.data.user);
        navigate('/dashboard', { replace: true });
      } else {
        throw new Error('Invalid server response');
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      if (error.message === 'Please enter a valid 6-digit OTP') {
        setError(error.message);
      } else {
        setError(error.response?.data?.message || 'Invalid OTP');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSendLoginLink = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      await api.post('/user/generate-login-link', { email });
      setLinkSent(true);
      setMessage('Login link has been sent to your email');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to send login link');
    } finally {
      setLoading(false);
    }
  };

  const verifyLoginLink = async (token) => {
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/user/verify-login-link', { token });
      login(response.data.token, response.data.user);
      navigate('/dashboard', { replace: true });
    } catch (error) {
      setError(error.response?.data?.message || 'Invalid or expired login link');
    } finally {
      setLoading(false);
    }
  };

  const toggleLoginMethod = (method) => {
    setLoginMethod(method);
    setOtpSent(false);
    setLinkSent(false);
    setError('');
    setMessage('');
    setOtp('');
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Welcome Back</h2>
        <p>Please enter your details to sign in</p>

        {error && <div className="error-message">{error}</div>}
        {message && <div className="success-message">{message}</div>}

        <div className="login-toggle">
          <button
            type="button"
            className={loginMethod === 'password' ? 'active' : ''}
            onClick={() => toggleLoginMethod('password')}
          >
            Password
          </button>
          <button
            type="button"
            className={loginMethod === 'otp' ? 'active' : ''}
            onClick={() => toggleLoginMethod('otp')}
          >
            OTP
          </button>
          <button
            type="button"
            className={loginMethod === 'link' ? 'active' : ''}
            onClick={() => toggleLoginMethod('link')}
          >
            Magic Link
          </button>
        </div>

        {loginMethod === 'password' && (
          <form onSubmit={handlePasswordLogin}>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <div className="password-input-container">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                </button>
              </div>
            </div>
            <div className="form-options">
              <label>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                Remember me
              </label>
              <Link to="/forgot-password">Forgot Password?</Link>
            </div>
            <button type="submit" className="login-button" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
        )}

        {loginMethod === 'otp' && (
          <form onSubmit={otpSent ? handleOtpLogin : handleSendOtp}>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                disabled={otpSent}
              />
            </div>
            {otpSent && (
              <div className="form-group">
                <label>OTP</label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter OTP sent to your email"
                  required
                  maxLength="6"
                  pattern="[0-9]{6}"
                  title="Please enter a 6-digit OTP"
                />
              </div>
            )}
            {otpSent && (
              <div className="form-options">
                <label>
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  Remember me
                </label>
              </div>
            )}
            <button type="submit" className="login-button" disabled={loading}>
              {loading
                ? 'Processing...'
                : otpSent
                ? 'Verify OTP'
                : 'Send OTP'}
            </button>
            {otpSent && (
              <button
                type="button"
                className="resend-button"
                onClick={handleSendOtp}
                disabled={loading}
              >
                Resend OTP
              </button>
            )}
          </form>
        )}

        {loginMethod === 'link' && (
          <form onSubmit={handleSendLoginLink}>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                disabled={linkSent}
              />
            </div>
            <button type="submit" className="login-button" disabled={loading || linkSent}>
              {loading ? 'Sending...' : linkSent ? 'Link Sent!' : 'Send Login Link'}
            </button>
            {linkSent && (
              <button
                type="button"
                className="resend-button"
                onClick={handleSendLoginLink}
                disabled={loading}
              >
                Resend Login Link
              </button>
            )}
          </form>
        )}

        <p className="signup-link">
          Don't have an account? <Link to="/signup">Create an Account</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
