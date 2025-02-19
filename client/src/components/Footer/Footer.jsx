import React from "react";
import { Container, Row, Col, Button, Dropdown } from "react-bootstrap";
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaTelegram,
  FaYoutube,
  FaAndroid,
  FaApple,
} from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Footer.css";
import TermAndCondition from "./TermAndConditionn";

const Footer = () => {
  return (
    <footer className="bg-dark text-white py-4  ">
      <Container className="mb-5 ">
        <Row>
          {/* <Col md={4}>
              <h5>Trending Resources</h5>
              <p>
                Python Tutorial | JavaScript Tutorial | Java Tutorial | Angular Tutorial | Node.js Tutorial |
                Docker Tutorial | Git Tutorial | Kubernetes Tutorial | Power BI Tutorial | CSS Tutorial
              </p>
            </Col> */}
          <Col md={6}>
            <h5>Policies</h5>
            <p>Terms and Conditions | Privacy Policy | Refund Policy</p>
          </Col>
          <Col md={6}>
            <h5>Country </h5>
            <Dropdown>
              <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                🇮🇳 India
              </Dropdown.Toggle>

              {/* <Dropdown.Menu>
                  <Dropdown.Item href="#">USA</Dropdown.Item>
                  <Dropdown.Item href="#">UK</Dropdown.Item>
                  <Dropdown.Item href="#">Canada</Dropdown.Item>
                </Dropdown.Menu> */}
            </Dropdown>
            <p>
              Address: H-161 BSI Business Park Sector-63 Noida gautam Budh Nagar
              Uttar pardesh 201301
            </p>
            <p>Phone No: 9810585808</p>
          </Col>
        </Row>
      </Container>

      <Container>
        <Row className="flex-wrap footer-bottom">
          <Col md={2} sm={4} xs={6}>
            <h5>Follow us!</h5>
            <Button variant="outline-light" className="mb-2">
              Refer and Earn
            </Button>
            <div className="container p-0 ">
              <div className="row">
                <div className="col d-flex gap-4   justify-content:space-evenly ">
                  <FaFacebook size={24} />
                  <FaTwitter size={24} />
                  <FaInstagram size={24} />
                </div>
                <div className="col d-flex gap-4 justify-content:space-evenly mt-2">
                  <FaLinkedin size={24} />
                  <FaTelegram size={24} />
                  <FaYoutube size={24} />
                </div>
              </div>
            </div>
          </Col>

          <Col md={2} sm={4} xs={6}>
            <h5>Company</h5>
            <ul className="list-unstyled">
              <li>About us</li>
              <li>Careers</li>
              <li>Newsroom</li>
              <li>Alumni speak</li>
              <li>Grievance redressal</li>
              <li>Contact us</li>
            </ul>
          </Col>

          <Col md={2} sm={4} xs={6}>
            <h5>Work with us</h5>
            <ul className="list-unstyled">
              <li>Become an instructor</li>
              <li>Blog as guest</li>
            </ul>
          </Col>

          <Col md={2} sm={4} xs={6}>
            <h5>Discover</h5>
            <ul className="list-unstyled">
              <li>Free Courses</li>
              <li>Skillup Sitemap</li>
              <li>Resources</li>
              <li>RSS feed</li>
              <li>City Sitemap</li>
            </ul>
          </Col>

          <Col md={2} sm={4} xs={6}>
            <h5>For Businesses</h5>
            <ul className="list-unstyled">
              <li>Corporate training</li>
              <li>Simplilearn Learning Hub+</li>
              <li>Guaranteed-to-run Classes</li>
              <li>Partners</li>
            </ul>
          </Col>

          <Col md={2} sm={4} xs={6}>
            <h5>Learn On the Go!</h5>
            {/* <Button variant="outline-light" className="d-flex align-items-center mb-2">
                            <FaAndroid className="me-2" /> Get Android App
                        </Button> */}
            <Button
              variant="outline-light"
              className="d-flex align-items-center"
            >
              <FaApple className="me-2" /> Get iOS App
            </Button>
            <Button
              variant="outline-light"
              className="d-flex align-items-center"
            >
              <FaAndroid className="me-2" /> Get Android
            </Button>
          </Col>
        </Row>
      </Container>
      <section className="term-condition">
        <TermAndCondition/>
      </section>
    </footer>
  );
};

export default Footer;
