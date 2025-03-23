import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Table, Alert } from 'react-bootstrap';
import { FaHistory, FaUndo } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import './Profile.css';

const COURSE_OPTIONS = [
  'Introduction to Information Technology',
  'Computer Basics & Internet Fundamentals',
  'Programming with Python',
  'Web Development (HTML, CSS, JavaScript)',
  'Database Management (SQL & MySQL)',
  'Introduction to Cybersecurity',
  'Cloud Computing Fundamentals',
  'Networking Basics (CCNA, CompTIA Network+)',
  'Operating Systems (Windows & Linux)',
  'IT Support & Helpdesk Essentials',
  'Intermediate IT Courses',
  'Full-Stack Web Development (MERN, MEAN, LAMP)',
  'Data Science & Machine Learning with Python',
  'Mobile App Development (React Native, Flutter, Android, iOS)',
  'Advanced Cybersecurity & Ethical Hacking',
  'Amazon Web Services (AWS) Certification',
  'Microsoft Azure Fundamentals',
  'Software Testing & QA Automation',
  'DevOps & CI/CD (Docker, Kubernetes, Jenkins)',
  'Blockchain Development',
  'Internet of Things (IoT) Development',
  'Advanced IT Courses',
  'Artificial Intelligence (AI) & Deep Learning',
  'Big Data & Hadoop Analytics',
  'Advanced Networking (CCNP, CCIE, SD-WAN)',
  'Cyber Threat Intelligence & Incident Response',
  'Penetration Testing & Red Teaming',
  'Advanced Cloud Computing & Multi-Cloud Management',
  'Virtual Reality (VR) & Augmented Reality (AR) Development',
  'Digital Forensics & Cyber Crime Investigation',
  'Quantum Computing & AI Research',
  'IT Project Management (Agile, Scrum, PMP)',
  'Operating Systems (Windows & Linux)',
'IT Support & Helpdesk Essentials',
'Intermediate IT Courses',
'Full-Stack Web Development (MERN, MEAN, LAMP)',
'Data Science & Machine Learning with Python',
'Mobile App Development (React Native, Flutter, Android, iOS)',
'Advanced Cybersecurity & Ethical Hacking',
'Amazon Web Services (AWS) Certification',
'Microsoft Azure Fundamentals',
'Software Testing & QA Automation',
'DevOps & CI/CD (Docker, Kubernetes, Jenkins)',
'Blockchain Development',
'Internet of Things (IoT) Development',
'Advanced IT Courses',
'Artificial Intelligence (AI) & Deep Learning',
'Big Data & Hadoop Analytics',
'Advanced Networking (CCNP, CCIE, SD-WAN)',
'Cyber Threat Intelligence & Incident Response',
'Penetration Testing & Red Teaming',
'Advanced Cloud Computing & Multi-Cloud Management',
'Virtual Reality (VR) & Augmented Reality (AR) Development',
'Digital Forensics & Cyber Crime Investigation',
'Quantum Computing & AI Research',
'IT Project Management (Agile, Scrum, PMP)'
];

const Profile = () => {
  const { user, updateProfile, getUserHistory, restoreProfile } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    course: ''
  });
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        mobile: user.mobile || '',
        course: user.course || ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateMobile = (mobile) => {
    if (!mobile) return true; // Allow empty mobile
    const mobileRegex = /^[6-9]\d{9}$/;
    return mobileRegex.test(mobile);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    // Validate mobile number
    if (!validateMobile(formData.mobile)) {
      setError('Please enter a valid 10-digit mobile number');
      setLoading(false);
      return;
    }

    try {
      const result = await updateProfile({
        name: formData.name,
        mobile: formData.mobile,
        course: formData.course
      });

      if (result.success) {
        setMessage('Profile updated successfully');
      } else {
        setError(result.message || 'Failed to update profile');
      }
    } catch (error) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
      setTimeout(() => {
        setMessage(null);
        setError(null);
      }, 3000);
    }
  };

  const fetchUserHistory = async () => {
    try {
      const result = await getUserHistory();
      if (result.success) {
        setHistory(result.history);
        setShowHistory(true);
      } else {
        setError(result.message || 'Failed to fetch history');
      }
    } catch (error) {
      setError('An unexpected error occurred');
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleRestoreData = async (historyId) => {
    try {
      const result = await restoreProfile(historyId);
      if (result.success) {
        setMessage('Profile data restored successfully');
        setFormData({
          name: result.user.name || '',
          email: result.user.email || '',
          mobile: result.user.mobile || '',
          course: result.user.course || ''
        });
      } else {
        setError(result.message || 'Failed to restore profile data');
      }
    } catch (error) {
      setError('An unexpected error occurred');
    } finally {
      setTimeout(() => {
        setMessage(null);
        setError(null);
      }, 3000);
    }
  };

  return (
    <Container className="py-5">
      <Row>
        <Col md={8} className="mx-auto">
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h4 className="mb-0">Profile Settings</h4>
              <Button 
                variant="outline-primary" 
                onClick={fetchUserHistory}
                className="d-flex align-items-center gap-2"
              >
                <FaHistory /> View History
              </Button>
            </Card.Header>
            <Card.Body>
              {message && <Alert variant="success">{message}</Alert>}
              {error && <Alert variant="danger">{error}</Alert>}
              
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    value={formData.email}
                    disabled
                  />
                  <Form.Text className="text-muted">
                    Email cannot be changed
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Enter your full name"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Mobile Number</Form.Label>
                  <Form.Control
                    type="tel"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    placeholder="Enter your 10-digit mobile number"
                  />
                  <Form.Text className="text-muted">
                    Format: 10 digits starting with 6-9
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Course</Form.Label>
                  <Form.Select
                    name="course"
                    value={formData.course}
                    onChange={handleChange}
                  >
                    <option value="">Select a course</option>
                    {COURSE_OPTIONS.map((course) => (
                      <option key={course} value={course}>
                        {course}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>

                <Button 
                  type="submit" 
                  variant="primary" 
                  className="w-100"
                  disabled={loading}
                >
                  {loading ? 'Updating...' : 'Update Profile'}
                </Button>
              </Form>

              {showHistory && history.length > 0 && (
                <div className="mt-4">
                  <h5>Profile History</h5>
                  <Table responsive hover>
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Name</th>
                        <th>Mobile</th>
                        <th>Course</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {history.map((item) => (
                        <tr key={item.id}>
                          <td>{new Date(item.changed_at).toLocaleDateString()}</td>
                          <td>{item.name}</td>
                          <td>{item.mobile || '-'}</td>
                          <td>{item.course || '-'}</td>
                          <td>
                            <Button
                              variant="outline-secondary"
                              size="sm"
                              onClick={() => handleRestoreData(item.id)}
                              className="d-flex align-items-center gap-1"
                            >
                              <FaUndo /> Restore
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
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
