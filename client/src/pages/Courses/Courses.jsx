import React from "react";
import { Card, Button, Container, Row, Col } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import "./Courses.css";

const Courses = () => {
  const navigate = useNavigate();
  const courses = [
    {
      id: 1,
      name: "React Basics",
      duration: "6 weeks",
      startDate: "April 10, 2025",
      description: "Master the fundamentals of React.js, including components, props, state, and hooks.",
      price: 499,
      image: "/Images/study-one.jpg",
      objectives: [
        "Build responsive web applications",
        "Understand React component lifecycle",
        "Implement state management",
        "Create reusable components"
      ]
    },
    {
      id: 2,
      name: "Node.js Fundamentals",
      duration: "8 weeks",
      startDate: "April 20, 2025",
      description: "Learn server-side JavaScript with Node.js, Express.js, and MongoDB.",
      price: 599,
      image: "/Images/study-two.jpg",
      objectives: [
        "Build RESTful APIs",
        "Implement authentication",
        "Work with databases",
        "Deploy Node.js applications"
      ]
    },
    {
      id: 3,
      name: "SQL & Databases",
      duration: "5 weeks",
      startDate: "May 1, 2025",
      description: "Master SQL queries and database design principles.",
      price: 399,
      image: "/Images/study-three.jpg",
      objectives: [
        "Write complex SQL queries",
        "Design database schemas",
        "Implement data relationships",
        "Optimize database performance"
      ]
    },
    {
      id: 4,
      name: "Advanced React",
      duration: "7 weeks",
      startDate: "May 15, 2025",
      description: "Take your React skills to the next level with advanced topics like Redux, React Router, and Webpack.",
      price: 699,
      image: "/Images/study-one.jpg",
      objectives: [
        "Build complex React applications",
        "Implement state management with Redux",
        "Use React Router for client-side routing",
        "Optimize application performance"
      ]
    },
    {
      id: 5,
      name: "Express.js & APIs",
      duration: "6 weeks",
      startDate: "June 1, 2025",
      description: "Learn to build RESTful APIs with Express.js and Node.js.",
      price: 599,
      image: "/Images/study-two.jpg",
      objectives: [
        "Build RESTful APIs",
        "Implement authentication",
        "Work with databases",
        "Deploy Node.js applications"
      ]
    },
    {
      id: 6,
      name: "MongoDB Essentials",
      duration: "5 weeks",
      startDate: "June 10, 2025",
      description: "Master MongoDB fundamentals, including data modeling, querying, and indexing.",
      price: 499,
      image: "/Images/study-three.jpg",
      objectives: [
        "Design MongoDB databases",
        "Implement data relationships",
        "Optimize database performance",
        "Work with MongoDB queries"
      ]
    },
    {
      id: 7,
      name: "Full-Stack MERN",
      duration: "10 weeks",
      startDate: "June 25, 2025",
      description: "Learn to build full-stack applications with MongoDB, Express.js, React, and Node.js.",
      price: 999,
      image: "/Images/study-one.jpg",
      objectives: [
        "Build full-stack applications",
        "Implement authentication",
        "Work with databases",
        "Deploy Node.js applications"
      ]
    },
    {
      id: 8,
      name: "DevOps & Deployment",
      duration: "6 weeks",
      startDate: "July 5, 2025",
      description: "Learn to deploy and manage applications with Docker, Kubernetes, and AWS.",
      price: 699,
      image: "/Images/study-two.jpg",
      objectives: [
        "Deploy applications with Docker",
        "Manage applications with Kubernetes",
        "Work with AWS services",
        "Implement continuous integration and deployment"
      ]
    }
  ];

  const handleViewProgram = (courseId) => {
    navigate(`/courses/${courseId}`);
  };

  return (
    <Container className="py-5">
      <h2 className="text-center mb-5">Available Courses</h2>
      <Row className="gx-4 gy-4">
        {courses.map((course) => (
          <Col key={course.id} md={4}>
            <Card className="course-card h-100 shadow-sm">
              <Card.Img variant="top" src={course.image} alt={course.name} className="card-img-top" />
              <Card.Body>
                <Card.Title className="mb-3">{course.name}</Card.Title>
                <Card.Text>
                  <div className="d-flex justify-content-between mb-2">
                    <span><strong>Duration:</strong> {course.duration}</span>
                    <span className="text-primary"><strong>${course.price}</strong></span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span><strong>Cohort Starts:</strong> {course.startDate}</span>
                    <span className="badge bg-success">Available</span>
                  </div>
                  <p className="text-muted mb-3">{course.description}</p>
                  <div className="d-flex justify-content-between align-items-center">
                    <Button 
                      variant="primary" 
                      onClick={() => handleViewProgram(course.id)}
                      className="w-100"
                    >
                      View Program Details
                    </Button>
                  </div>
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Courses;
