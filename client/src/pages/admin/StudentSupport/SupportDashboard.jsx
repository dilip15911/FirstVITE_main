import React, { useState } from 'react';
import { Container, Row, Col, Tab, Nav } from 'react-bootstrap';
import { FaTicketAlt, FaQuestionCircle, FaUsers, FaBook } from 'react-icons/fa';
import TicketManagement from './components/TicketManagement';
import QAForum from './components/QAForum';
import MentorshipProgram from './components/MentorshipProgram';
import ResourceLibrary from './components/ResourceLibrary';

const SupportDashboard = () => {
  const [activeTab, setActiveTab] = useState('tickets');

  return (
    <Container fluid>
      <h2 className="mb-4">Student Support</h2>

      <Tab.Container activeKey={activeTab} onSelect={setActiveTab}>
        <Row className="mb-4">
          <Col>
            <Nav variant="pills">
              <Nav.Item>
                <Nav.Link eventKey="tickets">
                  <FaTicketAlt className="me-2" /> Support Tickets
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="qa">
                  <FaQuestionCircle className="me-2" /> Q&A Forum
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="mentorship">
                  <FaUsers className="me-2" /> Mentorship
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="resources">
                  <FaBook className="me-2" /> Resource Library
                </Nav.Link>
              </Nav.Item>
            </Nav>
          </Col>
        </Row>

        <Tab.Content>
          <Tab.Pane eventKey="tickets">
            <TicketManagement />
          </Tab.Pane>
          <Tab.Pane eventKey="qa">
            <QAForum />
          </Tab.Pane>
          <Tab.Pane eventKey="mentorship">
            <MentorshipProgram />
          </Tab.Pane>
          <Tab.Pane eventKey="resources">
            <ResourceLibrary />
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
    </Container>
  );
};

export default SupportDashboard;