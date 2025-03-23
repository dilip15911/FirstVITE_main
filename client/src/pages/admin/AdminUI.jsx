// App.js
import React from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';



const AdminUI = () => {
  return (
    <Container fluid className="vh-100 d-flex align-items-center justify-content-center">
      <Row className="shadow-lg p-4 rounded w-75">
        {/* Left Side: Login Form */}
        <Col md={6} className="p-4">
          <h3 className="mb-3 text-center">Welcome back!</h3>
          <p className="text-center">Log in with your email</p>
          <Form>
            <Form.Group controlId="formEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control type="email" placeholder="Enter email" required />
            </Form.Group>

            <Form.Group controlId="formPassword" className="mt-3">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" placeholder="Enter password" required />
            </Form.Group>

            <Form.Group className="d-flex justify-content-between mt-2">
              <Form.Check type="checkbox" label="Remember Me" />
              <a href="#" className="text-primary">Forgot Password?</a>
            </Form.Group>

            <Button variant="primary" className="w-100 mt-3" type="submit">
              Login
            </Button>
          </Form>

          <hr />

          <Button variant="light" className="w-100 mt-2">
            <img src="https://img.icons8.com/color/16/000000/google-logo.png" alt="Google" className="me-2" />
            Continue with Google
          </Button>

          <Button variant="light" className="w-100 mt-2">
            <img src="https://img.icons8.com/color/16/000000/linkedin.png" alt="LinkedIn" className="me-2" />
            Continue with LinkedIn
          </Button>

          <p className="text-center mt-3">
            Don't have an account? <a href="#" className="text-primary">Sign Up</a>
          </p>
        </Col>

        {/* Right Side: Banner */}
        <Col md={6} className="d-flex flex-column justify-content-center align-items-center text-white text-center p-4" style={{ background: "#002147" }}>
          <h2>Get Certified. Get Ahead.</h2>
          <p>Get started with your immersive learning experience</p>
          <ul className="list-unstyled">
            <li>✔ 5M+ careers advanced</li>
            <li>✔ 1500+ Live classes every month</li>
            <li>✔ 85% report promotion or a new job</li>
          </ul>
        </Col>
      </Row>
    </Container>
  );
};


export default AdminUI;
