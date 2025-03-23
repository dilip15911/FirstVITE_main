import React from 'react'
import { Container, Row, Col, Button } from "react-bootstrap";
import { FaCheckCircle } from "react-icons/fa";


const GenerativeAipagedetails = () => {
  return (
    <Container className="my-5">
    <Row className="align-items-center">
      {/* Left Side Content */}
      <Col md={7}>
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/7/71/Purdue_University_wordmark.svg"
          alt="Purdue University"
          style={{ width: "200px", marginBottom: "10px" }}
        />
        <h2 className="fw-bold mt-2">Applied Generative AI Specialization</h2>
        <hr style={{ width: "50px", border: "2px solid blue" }} />

        <p className="text-muted">
          Learn To Develop And Deploy GenAI-Enabled Applications In Applied AI Course
        </p>

        {/* Features List */}
        <ul className="list-unstyled">
          <li>
            <FaCheckCircle className="text-success me-2" />
            Attend live masterclasses from Purdue faculty and staff
          </li>
          <li>
            <FaCheckCircle className="text-success me-2" />
            Gain exclusive membership in Purdue’s Alumni Association
          </li>
          <li>
            <FaCheckCircle className="text-success me-2" />
            Build an end-to-end RAG-based application through hands-on projects
          </li>
        </ul>

        {/* Collaboration */}
        <p className="text-muted mt-3">In Collaboration with:</p>
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/a/a6/Microsoft_Azure_Logo.svg"
          alt="Microsoft Azure"
          style={{ width: "150px" }}
        />

        {/* Buttons */}
        <div className="mt-4">
          <Button variant="primary" className="me-3 px-4 py-2">
            Apply Now
          </Button>
          <Button variant="outline-primary" className="px-4 py-2">
            Download Syllabus
          </Button>
        </div>
      </Col>

      {/* Right Side Image */}
      <Col md={5} className="text-center">
        <div
          style={{
            background: "linear-gradient(135deg, #c4a27c, #9d8360)",
            padding: "20px",
            borderRadius: "15px",
            display: "inline-block",
          }}
        >
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/d/d5/Purdue-gateway-arch.jpg"
            alt="Purdue University"
            style={{ width: "100%", borderRadius: "10px" }}
          />
        </div>
      </Col>
    </Row>
  </Container>  )
}

export default GenerativeAipagedetails