import React from "react";
import { Container, Row, Col, Button, Dropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
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
    <footer className="bg-dark text-white py-4">
      <Container className="footer-top">
        <Row>
          <Col md={6}>
            <h5>Policies</h5>
            <p>
              <Link to="/terms-and-conditions" className="text-white">
                Terms and Conditions
              </Link>{" "}
              |{" "}
              <Link to="/privacy-policy" className="text-white">
                Privacy Policy
              </Link>{" "}
              |{" "}
              <Link to="/refund-policy" className="text-white">
                Refund Policy
              </Link>
            </p>
          </Col>
          <Col md={6}>
            <h5>Country </h5>
            <Dropdown>
              <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                🇮🇳 India
              </Dropdown.Toggle>
            </Dropdown>
            <p>
              Address: H-161 BSI Business Park, Sector-63, Noida, Gautam Budh
              Nagar, Uttar Pradesh 201301
            </p>
            <p>
              Phone No:{" "}
              <Link to="/contact" className="text-white">
                9810585808
              </Link>
            </p>
          </Col>
        </Row>
      </Container>

      <Container>
        {/* Footer Middle */}
        <Row className="g-4 text-center text-md-start">
          <Col md={2} sm={6}>
            <h5>Follow Us</h5>
            <Button variant="outline-light" className="w-100 mb-2">
              Refer and Earn
            </Button>
            <div className="d-flex justify-content-center justify-content-md-start gap-2">
              <Link to="/facebook">
                <FaFacebook size={20} />
              </Link>
              <Link to="/twitter">
                <FaTwitter size={20} />
              </Link>
              <Link to="/instagram">
                <FaInstagram size={20} />
              </Link>
              <Link to="/linkedin">
                <FaLinkedin size={20} />
              </Link>
              <Link to="/telegram">
                <FaTelegram size={20} />
              </Link>
              <Link to="/youtube">
                <FaYoutube size={20} />
              </Link>
            </div>
          </Col>

          <Col md={2} sm={6}>
            <h5>Company</h5>
            <ul className="list-unstyled">
              <li>
                <Link to="/about-us" className="text-white">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/careers" className="text-white">
                  Careers
                </Link>
              </li>
              <li>
                <Link to="/newsroom" className="text-white">
                  Newsroom
                </Link>
              </li>
              <li>
                <Link to="/alumni" className="text-white">
                  Alumni Speak
                </Link>
              </li>
              <li>
                <Link to="/grievance" className="text-white">
                  Grievance
                </Link>
              </li>
              <li>
                <Link to="/contact-us" className="text-white">
                  Contact Us
                </Link>
              </li>
            </ul>
          </Col>

          <Col md={2} sm={6}>
            <h5>Work With Us</h5>
            <ul className="list-unstyled">
              <li>
                <Link to="/become-instructor" className="text-white">
                  Become an Instructor
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-white">
                  Blog as Guest
                </Link>
              </li>
            </ul>
          </Col>

          <Col md={2} sm={6}>
            <h5>Discover</h5>
            <ul className="list-unstyled">
              <li>
                <Link to="/free-courses" className="text-white">
                  Free Courses
                </Link>
              </li>
              <li>
                <Link to="/sitemap" className="text-white">
                  Sitemap
                </Link>
              </li>
              <li>
                <Link to="/resources" className="text-white">
                  Resources
                </Link>
              </li>
              <li>
                <Link to="/rss" className="text-white">
                  RSS Feed
                </Link>
              </li>
            </ul>
          </Col>

          <Col md={2} sm={6}>
            <h5>For Business</h5>
            <ul className="list-unstyled">
              <li>
                <Link to="/corporate" className="text-white">
                  Corporate Training
                </Link>
              </li>
              <li>
                <Link to="/learning-hub" className="text-white">
                  Learning Hub+
                </Link>
              </li>
              <li>
                <Link to="/guaranteed-classes" className="text-white">
                  Guaranteed Classes
                </Link>
              </li>
              <li>
                <Link to="/partners" className="text-white">
                  Partners
                </Link>
              </li>
            </ul>
          </Col>

          <Col md={2} sm={6}>
            <h5>Get the App</h5>
            <Button variant="outline-light" className="w-100 mb-2">
              <FaApple className="me-2" />
              <Link to="/ios-app" className="text-white">
                iOS App
              </Link>
            </Button>
            <Button variant="outline-light" className="w-100">
              <FaAndroid className="me-2" />
              <Link to="/android-app" className="text-white">
                Android App
              </Link>
            </Button>
          </Col>
        </Row>
      </Container>

      <section className="term-condition">
        <TermAndCondition />
      </section>
    </footer>
  );
};

export default Footer;
