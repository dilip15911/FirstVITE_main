import React from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import './WhyUs.css'

const features = [
  { title: "Tailor Made Training", img: "", color: "#F8C8C4" },
  { title: "Flexible Schedule", img: "", color: "#E6A8D7" },
  { title: "10 in 1 Program", img: "", color: "#C4A484" },
  { title: "One-to-One Training", img: "", color: "#E9967A" },
  { title: "Experienced Instructors", img: "", color: "#C3B1E1" },
  { title: "Post Training Followups", img: "", color: "#A1DAB4" },
  { title: "Access to the Recorded Sessions", img: "", color: "#90EE90" },
  { title: "Masterclasses By firstVite", img: "", color: "#B0D9B1" },
];

const WhyUs = () => {
  return (
    <Container className="py-1">
      <h2 className="text-center mb-4">Why Us?</h2>
      <Row>
        {features.map((feature, index) => (
          <Col md={6} lg={3} key={index} className="mb-4">
            <Card
              style={{ backgroundColor: feature.color, border: "none", height: "100%" }}
              className="text-center p-3 shadow d-flex flex-column"
            >
              <Card.Img
                variant="top"
                src={feature.img}
                className="mx-auto"
                style={{ width: "50px" }}
              />
              <Card.Body className="d-flex flex-column justify-content-between h-100">
                <Card.Title>{feature.title}</Card.Title>
                <a href="/">
                  <Button variant="light">Learn More</Button>
                </a>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default WhyUs;
