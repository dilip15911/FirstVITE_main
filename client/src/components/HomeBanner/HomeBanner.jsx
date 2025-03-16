import React from 'react';
import { Container } from 'react-bootstrap';
import './HomeBanner.css';

const HomeBanner = () => {
  return (
    <div className="home-banner">
      <Container>
        <div className="banner-content">
          <h1>Welcome to FirstVITE</h1>
          <p>Empowering your journey in technology and innovation</p>
          <div className="banner-cta">
            <a href="#programs" className="primary-btn">Explore Programs</a>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default HomeBanner;
