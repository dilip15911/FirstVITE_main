import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import "./HomeBanner.css"

const HomeBanner = () => {
  return (
    <Container fluid className="bg-primary text-white py-5">
      <Row className="justify-content-center">
        <Col md={10} lg={8} className="text-center">
          <h1>Join over 1+ million learners already enrolled-are you next ?</h1>
          <p className="mt-3">
            Join our top-tier, highly engaging, and results-driven professional
            upskilling programs built for your success.
          </p>
          <ul className="list-unstyled text-start mx-auto d-inline-block  ">
            <li>✅ Most in-demand skills on offer</li>
            <li>✅ Global partnerships with the best</li>
            <li>✅ World-class Bootcamps</li>
            <li>✅ 8X better learning experience</li>
          </ul>
          {/* <Row className="mt-4">
            <Col>
              <div>
                <p>
                  <h1>Explore OurTop Programes</h1>
                </p>
              </div>
              <Button variant="light" className="m-2 text-dark">
                📊 Data Science & Business Analytics
              </Button>
              <Button variant="light" className="m-2 text-dark">
                🔒 Cyber Security
              </Button>
              <Button variant="light" className="m-2 text-dark">
                📋 Project Management
              </Button>
              <Button variant="light" className="m-2 text-dark">
                🤖 AI & Machine Learning
              </Button>
            </Col>
          </Row> */}
        </Col>
        {/* <Col md={4} className="text-center mt-4">
          <img
            src="https://via.placeholder.com/200"
            alt="Student"
            className="rounded-circle"
          />
        </Col> */}
      </Row>
    </Container>
  );
};

export default HomeBanner;
