import React from 'react'
import { Container, Row, Col, Card, Button } from "react-bootstrap";

const GenerativeAipage = () => {
  return (
    <Container className="mt-4">
      <h1 className="text-center">Applied Gen AI Course Overview</h1>
      <p className="text-center mt-3">
            This Applied Generative AI course will equip you with the skills to deploy
            generative AI techniques in real-world scenarios. You'll build a holistic
            understanding of applied generative AI, from mastering concepts like GANs,
            VAEs, and prompt engineering to exploring advanced topics like LLM
            application development, RAG, and fine-tuning.
          </p>
    
          <h2 className="mt-5">Key Features</h2>
          <Row className="mt-3">
            <Col md={6} lg={4} className="mb-4">
              <Card>
                <Card.Body>
                  <Card.Text>
                    ✅ Program completion certificate from Purdue University Online and firstVITE
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6} lg={4} className="mb-4">
              <Card>
                <Card.Body>
                  <Card.Text>
                    ✅ Access to Purdue’s alumni association membership on program completion
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6} lg={4} className="mb-4">
              <Card>
                <Card.Body>
                  <Card.Text>
                    ✅ 70+ hours of core curriculum delivered in live online classes by industry experts
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6} lg={4} className="mb-4">
              <Card>
                <Card.Body>
                  <Card.Text>
                    ✅ Master GenAI-enabled application development with 60+ exercises, 7 industry-relevant projects
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6} lg={4} className="mb-4">
              <Card>
                <Card.Body>
                  <Card.Text>
                    ✅ Live online masterclasses delivered by Purdue faculty and staff
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6} lg={4} className="mb-4">
              <Card>
                <Card.Body>
                  <Card.Text>
                    ✅ Gain exposure to Copilot, Azure AI Studio, ChatGPT, OpenAI, Dall-E 2, Hugging Face & other prominent tools
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6} lg={4} className="mb-4">
              <Card>
                <Card.Body>
                  <Card.Text>
                    ✅ Explore concepts like prompt engineering, attention mechanism, transformers, LLM applications
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6} lg={4} className="mb-4">
              <Card>
                <Card.Body>
                  <Card.Text>
                    ✅ firstVITE’s JobAssist helps you get noticed by top hiring companies
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6} lg={4} className="mb-4">
              <Card>
                <Card.Body>
                  <Card.Text>
                    ✅ Course completion certificate hosted on the Microsoft Learn portal
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
    
          <div className="text-center mt-4">
            <Button variant="primary" href="#">Apply Now</Button>
          </div>
        </Container>
      );
    };
    
    export default GenerativeAipage