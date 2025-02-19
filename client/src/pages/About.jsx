import React from 'react';

const About = () => {
  return (
    <main className="main-content">
      <section className="about-section">
        <h1>About Us</h1>
        <div className="about-content">
          <p>
            Welcome to our full-stack application! This project demonstrates the integration
            of React for the frontend, Express.js for the backend, and MySQL for the database.
          </p>
          <h2>Our Stack</h2>
          <ul>
            <li>
              <strong>Frontend:</strong> React.js with React Router for navigation
            </li>
            <li>
              <strong>Backend:</strong> Node.js with Express.js
            </li>
            <li>
              <strong>Database:</strong> MySQL for data persistence
            </li>
            <li>
              <strong>Styling:</strong> Modern CSS with responsive design
            </li>
          </ul>
        </div>
      </section>
    </main>
  );
};

export default About;
