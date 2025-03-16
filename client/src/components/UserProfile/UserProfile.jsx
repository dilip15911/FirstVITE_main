import { useState } from 'react';
import { Card, Button, Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faPencilAlt, faSave, faTimes } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import './UserProfile.css';

const UserProfile = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(formData);
      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  return (
    <Card className="user-profile-card">
      <Card.Body>
        <div className="profile-header">
          <h3>
            <FontAwesomeIcon icon={faUser} className="me-2" />
            Profile Information
          </h3>
          {!isEditing && (
            <Button
              variant="outline-primary"
              onClick={() => setIsEditing(true)}
              className="edit-button"
            >
              <FontAwesomeIcon icon={faPencilAlt} className="me-2" />
              Edit
            </Button>
          )}
        </div>

        {isEditing ? (
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>
                <FontAwesomeIcon icon={faUser} className="me-2" />
                Name
              </Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>
                <FontAwesomeIcon icon={faEnvelope} className="me-2" />
                Email
              </Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                disabled
              />
              <Form.Text className="text-muted">
                Email cannot be changed
              </Form.Text>
            </Form.Group>

            <div className="d-flex gap-2">
              <Button variant="primary" type="submit">
                <FontAwesomeIcon icon={faSave} className="me-2" />
                Save Changes
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  setIsEditing(false);
                  setFormData({
                    name: user?.name || '',
                    email: user?.email || ''
                  });
                }}
              >
                <FontAwesomeIcon icon={faTimes} className="me-2" />
                Cancel
              </Button>
            </div>
          </Form>
        ) : (
          <div className="profile-info">
            <p>
              <FontAwesomeIcon icon={faUser} className="me-2" />
              <strong>Name:</strong> {user?.name}
            </p>
            <p>
              <FontAwesomeIcon icon={faEnvelope} className="me-2" />
              <strong>Email:</strong> {user?.email}
            </p>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default UserProfile;
