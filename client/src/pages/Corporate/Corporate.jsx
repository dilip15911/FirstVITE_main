import React from "react";
import { Container, Button, Row, Col, Card } from "react-bootstrap";
import { FaPhone, FaWhatsapp, FaEnvelope, FaCheckCircle } from "react-icons/fa";
import "./Corporate.css";

const Corporate = () => {
  return (
    <div className="corporate">
      <Container>
        <h2 className="text-center">Corporate Training</h2>
        <p className="text-center" style={{ fontStyle: "italic" }}>
          Upskill Your Organization with Industry-Leading Training Programs
        </p>

        {/* Features Section */}
        <Row className="mt-5 features">
          {["Customized Training Programs", "Expert Trainers", "Flexible Learning Modes", "Certification & Assessments", "Real-world Case Studies", "Post-training Support"].map((feature, index) => (
            <Col md={4} key={index} className="feature-card mb-4">
              <Card style={{ backgroundColor: "transparent", border: "1px solid white" }} className="text-center p-3">
                <FaCheckCircle size={30} color="lightgreen" className="mb-2" />
                <h5>{feature}</h5>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Brochure & Contact Section */}
        <div className="corporate-brochure text-center mt-5">
          <Button variant="light" className="my-3">DOWNLOAD BROCHURE</Button>
          <div className="corporate-contact d-flex justify-content-center gap-3 mt-3">
            <Button variant="outline-light" className="d-flex align-items-center gap-2">
              <FaPhone /> +91-999066567
            </Button>
            <Button variant="outline-light" className="d-flex align-items-center gap-2">
              <FaWhatsapp /> Whatsapp Us
            </Button>
            <Button variant="outline-light" className="d-flex align-items-center gap-2">
              <FaEnvelope /> info@firstvite.com
            </Button>
          </div>
        </div>

        {/* Floating Contact Button */}
        <div
          style={{
            position: "fixed",
            right: "10px",
            bottom: "20px",
            backgroundColor: "green",
            color: "white",
            padding: "10px 15px",
            borderRadius: "30px",
            display: "flex",
            alignItems: "center",
            gap: "5px",
          }}
        >
          <FaPhone /> +91 9899 577 620
        </div>
      </Container>
    </div>
  );
};

export default Corporate;
