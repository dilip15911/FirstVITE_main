import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar as BootstrapNavbar, Nav, NavDropdown, Container, Button, Form } from 'react-bootstrap';
// import { Form } from "react-bootstrap";
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setExpanded(false);
  };

  return (
    <BootstrapNavbar
      style={{ maxWidth: "100%", margin: "0 auto", padding: "0px 5rem" }}
      bg="light"
      expand="lg"
      fixed="top"
      className="shadow-sm"
      expanded={expanded}
      onToggle={() => setExpanded(!expanded)}
    >
      <Container style={{ maxWidth: "100%", margin: "0 auto", padding: "0" }}>
        <BootstrapNavbar.Brand as={Link} to="/" onClick={() => setExpanded(false)} 
        style={{
          margin: "0px 2rem 0px 0px",
          padding: "0px",
        }}>
          <span style={{
            color: "#F47C26",
            fontWeight: "bolder",
            fontSize: "1.5em",
          }}>First</span>
          <span style={{
            color: "#1E90FF",
            fontWeight: "bolder",
            fontSize: "1.5em",
          }}>VITE</span>
        </BootstrapNavbar.Brand>

        <BootstrapNavbar.Toggle aria-controls="navbar-nav" />
        <BootstrapNavbar.Collapse id="navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/" onClick={() => setExpanded(false)}>
              Home
            </Nav.Link>

            <NavDropdown title="All Courses" id="courses-dropdown">
              <NavDropdown.Item as={Link} to="/courses/generative-ai" onClick={() => setExpanded(false)}>
                Generative AI
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/courses/web-development" onClick={() => setExpanded(false)}>
                Web Development
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/courses/data-science" onClick={() => setExpanded(false)}>
                Data Science
              </NavDropdown.Item>
            </NavDropdown>

            <Nav.Link as={Link} to="/corporate-training" onClick={() => setExpanded(false)}>
              Corporate Training
            </Nav.Link>

            <NavDropdown title="Resources" id="resources-dropdown">
              <NavDropdown.Item as={Link} to="/blog" onClick={() => setExpanded(false)}>
                Blog
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/tutorials" onClick={() => setExpanded(false)}>
                Tutorials
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/documentation" onClick={() => setExpanded(false)}>
                Documentation
              </NavDropdown.Item>
            </NavDropdown>

            <NavDropdown title="More" id="more-dropdown" style={{ backgroundColor: "white" }}>
              <NavDropdown.Item as={Link} to="/become-a-teacher" onClick={() => setExpanded(false)}>
                Become a Teacher
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/hire-from-us" onClick={() => setExpanded(false)}>
                Hire From Us
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/reviews" onClick={() => setExpanded(false)}>
                Reviews
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>

          


            <Form className="d-flex">
              <Form.Control
                type="search"
                placeholder="Search"
                className="me-2"
                aria-label="Search"
                onChange={(e) => {
                  const query = e.target.value;
                  if (query.length > 2) {
                    navigate(`/search?q=${query}`);
                  }
                }}
                style={{
                  maxWidth: "300px",
                }}
              />
            </Form>

          <Nav>
            {!user ? (
              <>
                <Nav.Link className="login-btn" as={Link} to="/login" onClick={() => setExpanded(false)}>
                  Login
                </Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/dashboard" onClick={() => setExpanded(false)}>
                  Dashboard
                </Nav.Link>
                <Nav.Link as={Link} to="/profile" onClick={() => setExpanded(false)}>
                  Profile
                </Nav.Link>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={handleLogout}
                  className="ms-2 my-1"
                >
                  Logout
                </Button>
              </>
            )}
          </Nav>

            
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
};

export default Navbar;
