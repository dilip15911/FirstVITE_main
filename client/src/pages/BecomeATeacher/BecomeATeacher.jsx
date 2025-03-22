import React from 'react'
import { Container, Row, Col, Form, Button } from 'react-bootstrap'

const BecomeATeacher = () => {
  return (
    <Container fluid className="p-0">
    {/* Hero Section */}
    <div className="text-white text-center py-5" style={{ background: "linear-gradient(to right, #003366, #0055A4)" }}>
     <h1>Become a Trainer</h1>
      <h2>Teach. Create. Earn.</h2>
    </div>

 { /* Content Section */}
      <Container className="py-5 " >
        <Row>
          <Col md={8} style={{ fontSize: "16px" }}>
          <div><p>Passionate about teaching? Looking for a platform where you can share your knowledge, connect with professionals, and enrich careers, all while earning supplemental income?</p></div>
          <h4><strong>You&apos;ve come to the right place.</strong></h4>
          <p>
            At our platform, we aim to build a network of world-class trainers and industry experts.
            Our focus is on Full Stack, DevOps, Cloud Computing, Big Data, Deep Learning, and NLP.
          </p>

          <h4><strong>What&apos;s in it for me?</strong></h4>
          <p>
          We're glad you asked! The material you produce will be used to train professionals worldwide, meaning increased visibility, a larger audience for your content, and the chance to become a part of an elite worldwide training community!            </p>

          <h4><strong>Show me the money</strong></h4>
          <p>
          At firstvite, we know the value of your time and effort, and also understand that offering fair and flexible compensation is a part of your business ethos. With our revenue-sharing model, you have the opportunity to earn tens of thousands of dollars every month!            </p>

          <h4><strong>What does it take.</strong></h4>
           <div>
          <ul style={{ listStyleType: "circle" }}>
          <li><p>A great deal of passion for teaching and sharing knowledge</p></li>
          <li><p>Domain expertise with relevant certifications</p></li>
          <li><p>Strong communication and presentation skills required</p></li>
          <li><p>A commitment to developing and delivering best-in-class training to a global audience</p></li>
           </ul>
           </div>
          </Col>
          <Col md={4}>
          {/* Form Section */}
          <div className="p-4 border rounded shadow-sm">
            <h5 className="mb-3">INTERESTED IN WORKING WITH US?</h5>
            <p style={{ fontSize: "16px" }}>Please submit this form and we will reach out to you.</p>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Name*</Form.Label>
                <Form.Control type="text" placeholder="Enter your name" required />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Email*</Form.Label>
                <Form.Control type="email" placeholder="Enter your email" required />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Select Course*</Form.Label>
                <Form.Select required>
                  <option>Choose a course</option>
                  <option>Full Stack</option>
                  <option>DevOps</option>
                  <option>Cloud Computing</option>
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Phone Number*</Form.Label>
                <Form.Control type="text" placeholder="Enter your phone number" required />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>LinkedIn URL*</Form.Label>
                <Form.Control type="url" placeholder="Enter LinkedIn profile URL" required />
              </Form.Group>
              <Button variant="primary" type="submit" className="w-100">SUBMIT</Button>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  </Container>  )
}

export default BecomeATeacher