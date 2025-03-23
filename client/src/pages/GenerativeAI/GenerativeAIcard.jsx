import React from 'react'
import { Card, Button } from "react-bootstrap";
import { FaClock, FaCalendarAlt } from "react-icons/fa";

const GenerativeAIcard = () => {
  return (
    <Card style={{ width: "22rem", borderRadius: "10px", overflow: "hidden", boxShadow: "0 4px 10px rgba(0,0,0,0.1)" }}>
    {/* Course Image */}
    <Card.Img variant="top" src="https://via.placeholder.com/350x150" alt="Course Image" />

    <Card.Body>
      {/* Course Title */}
      <Card.Title>Applied Generative AI Specialization</Card.Title>

      {/* Duration & Cohort Info */}
      <Card.Text>
        <FaClock className="me-2" /> 16 Weeks <br />
        <FaCalendarAlt className="me-2" /> Cohort Starts: <b>12 Feb, 2025</b>
      </Card.Text>

      {/* University Logo */}
      <div className="text-center my-3">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/7/71/Purdue_University_wordmark.svg"
          alt="Purdue University"
          style={{ width: "150px" }}
        />
      </div>

      {/* View Program Button */}
      <Button variant="primary" className="w-100">
        View Program
      </Button>
    </Card.Body>
  </Card>  )
}

export default GenerativeAIcard



