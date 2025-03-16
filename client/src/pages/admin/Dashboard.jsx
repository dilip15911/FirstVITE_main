import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import axios from 'axios';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activePrograms: 0,
    totalRevenue: 0
  });

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        const response = await axios.get('http://localhost:5000/api/admin/dashboard', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      }
    };

    fetchDashboardStats();
  }, []);

  return (
    <Container className="dashboard-container">
      <h1 className="dashboard-title">Admin Dashboard</h1>
      <Row className="mt-4">
        <Col md={4}>
          <Card className="dashboard-card">
            <Card.Body>
              <Card.Title>Total Users</Card.Title>
              <Card.Text className="stat-number">{stats.totalUsers}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="dashboard-card">
            <Card.Body>
              <Card.Title>Active Programs</Card.Title>
              <Card.Text className="stat-number">{stats.activePrograms}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="dashboard-card">
            <Card.Body>
              <Card.Title>Total Revenue</Card.Title>
              <Card.Text className="stat-number">₹{stats.totalRevenue}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
