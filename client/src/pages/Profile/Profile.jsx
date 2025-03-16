import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Alert } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './Profile.css';

const Profile = () => {
  const { user, updateProfile, changePassword } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: user?.bio || '',
    phone: user?.phone || '',
    address: user?.address || ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        bio: user.bio || '',
        phone: user.phone || '',
        address: user.address || ''
      });
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateProfile(formData);
      setEditMode(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    setLoading(true);
    try {
      await changePassword(passwordData.currentPassword, passwordData.newPassword);
      setShowPasswordForm(false);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      toast.success('Password changed successfully!');
    } catch (error) {
      toast.error('Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <Container className="profile-container py-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="profile-card">
            <Card.Body>
              <div className="text-center mb-4">
                <div className="profile-avatar">
                  {user.profile_picture ? (
                    <img src={user.profile_picture} alt={user.name} className="avatar-img" />
                  ) : (
                    <div className="avatar-placeholder">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <h2 className="mt-3">{user.name}</h2>
                <p className="text-muted">{user.email}</p>
              </div>

              {!editMode ? (
                <div className="profile-info">
                  <Row className="mb-3">
                    <Col sm={3}>
                      <strong>Bio</strong>
                    </Col>
                    <Col sm={9}>
                      {user.bio || 'No bio added yet'}
                    </Col>
                  </Row>
                  <Row className="mb-3">
                    <Col sm={3}>
                      <strong>Phone</strong>
                    </Col>
                    <Col sm={9}>
                      {user.phone || 'No phone number added'}
                    </Col>
                  </Row>
                  <Row className="mb-3">
                    <Col sm={3}>
                      <strong>Address</strong>
                    </Col>
                    <Col sm={9}>
                      {user.address || 'No address added'}
                    </Col>
                  </Row>
                  <div className="text-center mt-4">
                    <Button 
                      variant="primary" 
                      onClick={() => setEditMode(true)}
                      className="me-2"
                    >
                      Edit Profile
                    </Button>
                    <Button 
                      variant="outline-primary"
                      onClick={() => setShowPasswordForm(!showPasswordForm)}
                    >
                      Change Password
                    </Button>
                  </div>
                </div>
              ) : (
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      value={formData.email}
                      disabled
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Bio</Form.Label>
                    <Form.Control
                      as="textarea"
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      rows={3}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Phone</Form.Label>
                    <Form.Control
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Address</Form.Label>
                    <Form.Control
                      as="textarea"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      rows={2}
                    />
                  </Form.Group>

                  <div className="text-center">
                    <Button 
                      variant="primary" 
                      type="submit"
                      disabled={loading}
                      className="me-2"
                    >
                      {loading ? 'Saving...' : 'Save Changes'}
                    </Button>
                    <Button 
                      variant="secondary"
                      onClick={() => {
                        setEditMode(false);
                        setFormData({
                          name: user.name || '',
                          email: user.email || '',
                          bio: user.bio || '',
                          phone: user.phone || '',
                          address: user.address || ''
                        });
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </Form>
              )}

              {showPasswordForm && (
                <div className="password-form mt-4">
                  <h4 className="mb-3">Change Password</h4>
                  <Form onSubmit={handlePasswordSubmit}>
                    <Form.Group className="mb-3">
                      <Form.Label>Current Password</Form.Label>
                      <Form.Control
                        type="password"
                        name="currentPassword"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                        required
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>New Password</Form.Label>
                      <Form.Control
                        type="password"
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        required
                        minLength={6}
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Confirm New Password</Form.Label>
                      <Form.Control
                        type="password"
                        name="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        required
                        minLength={6}
                      />
                    </Form.Group>

                    <div className="text-center">
                      <Button 
                        variant="primary" 
                        type="submit"
                        disabled={loading}
                        className="me-2"
                      >
                        {loading ? 'Changing...' : 'Change Password'}
                      </Button>
                      <Button 
                        variant="secondary"
                        onClick={() => {
                          setShowPasswordForm(false);
                          setPasswordData({
                            currentPassword: '',
                            newPassword: '',
                            confirmPassword: ''
                          });
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </Form>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Profile;
