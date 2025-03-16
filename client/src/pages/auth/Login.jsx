import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Form, Button, Container, Row, Col, Card, InputGroup } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import './Auth.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await login(formData.email, formData.password);
      
      if (result.success) {
        toast.success(result.message);
        navigate('/dashboard');
      } else if (result.needsVerification) {
        navigate('/verify-email', { 
          state: { 
            email: result.email,
            message: result.message 
          }
        });
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('An unexpected error occurred. Please try again.');
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
              <div className="auth-header">
                <h2>Welcome Back!</h2>
                <p>Continue your learning journey with FirstVITE</p>
              </div>

              <Form onSubmit={handleSubmit}>
                <InputGroup className="mb-3">
                  <InputGroup.Text>
                    <FontAwesomeIcon icon={faEnvelope} />
                  </InputGroup.Text>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    required
                    autoComplete="email"
                  />
                </InputGroup>

                <InputGroup className="mb-4">
                  <InputGroup.Text>
                    <FontAwesomeIcon icon={faLock} />
                  </InputGroup.Text>
                  <Form.Control
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    required
                    autoComplete="current-password"
                  />
                  <Button
                    variant="outline-secondary"
                    onClick={() => setShowPassword(!showPassword)}
                    type="button"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                  </Button>
                </InputGroup>

                <div className="auth-links">
                  <Form.Check
                    type="checkbox"
                    label="Remember me"
                    id="remember-me"
                    className="text-muted"
                  />
                  <Link to="/forgot-password" className="text-decoration-none">
                    Forgot password?
                  </Link>
                </div>

                <div className="d-grid gap-3 mt-4">
                  <Button 
                    variant="primary" 
                    type="submit" 
                    disabled={loading}
                    className="py-2"
                  >
                    {loading ? (
                      <span className="loading-dots">Logging in</span>
                    ) : (
                      'Login'
                    )}
                  </Button>
                </div>

                <div className="text-center mt-4">
                  <p className="text-muted mb-0">
                    New to FirstVITE?{' '}
                    <Link to="/signup" className="text-decoration-none">
                      Create an account
                    </Link>
                  </p>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
