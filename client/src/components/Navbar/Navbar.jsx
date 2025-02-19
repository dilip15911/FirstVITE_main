"use client";
import React from "react";
import Button from "react-bootstrap/Button"; // Bootstrap Button component
import Container from "react-bootstrap/Container"; // Bootstrap Container component
import Form from "react-bootstrap/Form"; // Bootstrap Form component
import Nav from "react-bootstrap/Nav"; // Bootstrap Nav component
import Navbar from "react-bootstrap/Navbar"; // Bootstrap Navbar component
import NavDropdown from "react-bootstrap/NavDropdown"; // Bootstrap NavDropdown component
import { FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import SearchBar from "../SearchBar/SearchBar";
import { useAuth } from "../../context/AuthContext";
import UserProfile from "../UserProfile/UserProfile";

const NavbarWrapper = () => {
  const { user } = useAuth();
  return (
    <Navbar
      expand="lg"
      className="bg-body-tertiary p-0"
      style={{ position: "fixed", width: "100%", zIndex: "10" }}
    >
      <Container fluid>
        <Navbar.Brand className="mx-2" as={Link} to="/">
          <span
            style={{
              color: "#F47C26",
              fontWeight: "bolder",
              fontSize: "1.5em",
            }}
          >
            First
          </span>
          <span
            style={{
              color: "#1E90FF",
              fontWeight: "bolder",
              fontSize: "1.5em",
            }}
          >
            VITE
          </span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav
            className="me-auto my-2 my-lg-0 justify-content-center w-100"
            style={{ maxHeight: "100px" }}
            navbarScroll
          >
            <Nav.Link as={Link} to={"/"}>
              Home
            </Nav.Link>
            <NavDropdown title="All courses" id="navbarScrollingDropdown">
              <NavDropdown.Item as={Link} to={"generative-ai"}>
                Generative AI
              </NavDropdown.Item>
              <NavDropdown.Item href="#action4">
                Data Science & Business Analytics
              </NavDropdown.Item>
              <NavDropdown.Item href="#action5">
                Project Management
              </NavDropdown.Item>
              {/* Add other courses */}
            </NavDropdown>
            <Nav.Link as={Link} to="/corporate-traning">
              Corporate Training
            </Nav.Link>
            <NavDropdown title="For Business" id="basic-nav-dropdown">
              {/* Business related links */}
              <NavDropdown.Item href="#action3">
                Become a Trainer
              </NavDropdown.Item>
            </NavDropdown>
            <NavDropdown title="More" id="basic-nav-dropdown">
              {/* Other links */}
              <NavDropdown.Item href="#action3">Alumuni</NavDropdown.Item>
              <NavDropdown.Item href="#action3">
                Resume Builder
              </NavDropdown.Item>
              <NavDropdown.Item href="#action3">Resourses</NavDropdown.Item>
            </NavDropdown>
            <Nav.Link href="#Blog">Blog</Nav.Link>
          </Nav>

          <div className="d-flex align-items-center gap-3">
            <SearchBar />
            {user ? (
              <UserProfile />
            ) : (
              <Button
                as={Link}
                to="/login"
                variant="primary"
                className="rounded-pill px-4"
              >
                Login
              </Button>
            )}
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavbarWrapper;
