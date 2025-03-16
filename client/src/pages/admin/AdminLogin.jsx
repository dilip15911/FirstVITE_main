import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Alert } from 'react-bootstrap';
import { FaLock, FaUser } from 'react-icons/fa';
import axios from 'axios';
import '../../styles/Auth.css';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if admin is already logged in
    const token = localStorage.getItem('adminToken');
    if (token) {
      navigate('/admin/dashboard');
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError('All fields are required');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post('http://localhost:5000/api/admin/login', {
        email: formData.email,
        password: formData.password
      });

      if (response.data.token) {
        localStorage.setItem('adminToken', response.data.token);
        navigate('/admin/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid admin credentials');
      // Clear password field on error
      setFormData(prev => ({ ...prev, password: '' }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container" style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)' }}>
      <div className="auth-card" style={{ maxWidth: '400px' }}>
        <div className="auth-header">
          <div className="text-center mb-4">
            <div className="admin-icon-wrapper" style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: '#6366f1',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem'
            }}>
              <FaUser size={40} color="white" />
            </div>
          </div>
          <h1>Admin Portal</h1>
          <p>Access the administration dashboard</p>
        </div>

        {error && (
          <Alert variant="danger" className="mb-4">
            <div className="d-flex align-items-center">
              <FaLock className="me-2" />
              {error}
            </div>
          </Alert>
        )}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="form-group">
            <Form.Label>Admin Email</Form.Label>
            <div className="input-group">
              <div className="input-group-text" style={{ background: '#f8fafc' }}>
                <FaUser />
              </div>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter admin email"
                required
                className="form-control"
                style={{ borderLeft: 'none' }}
              />
            </div>
          </Form.Group>

          <Form.Group className="form-group">
            <Form.Label>Password</Form.Label>
            <div className="input-group">
              <div className="input-group-text" style={{ background: '#f8fafc' }}>
                <FaLock />
              </div>
              <Form.Control
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter admin password"
                required
                className="form-control"
                style={{ borderLeft: 'none' }}
              />
            </div>
          </Form.Group>

          <button
            type="submit"
            className="auth-btn"
            disabled={loading}
            style={{
              background: '#6366f1',
              marginTop: '1.5rem'
            }}
          >
            {loading ? 'Authenticating...' : 'Login to Admin Panel'}
          </button>
        </Form>

        <div className="form-footer" style={{ marginTop: '2rem' }}>
          <small className="text-muted">
            This is a secure area. Unauthorized access is prohibited.
          </small>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
