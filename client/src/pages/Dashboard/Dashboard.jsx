import { useAuth } from '../../context/AuthContext';
import { Container, Row, Col, Card } from 'react-bootstrap';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <Container className="dashboard-container">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="welcome-card">
            <Card.Body>
              <h2 className="text-center mb-4">Welcome to FirstVITE</h2>
              {user ? (
                <div className="text-center">
                  <h4>Hello, {user.name}!</h4>
                  <p>You are successfully logged in.</p>
                </div>
              ) : (
                <div className="text-center">
                  <p>Please log in to access your dashboard.</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
