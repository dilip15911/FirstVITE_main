import React from 'react';
import { NavLink } from 'react-router-dom';

const NotFound = () => {
  return (
    <main className="main-content">
      <section className="not-found">
        <h1>404 - Page Not Found</h1>
        <p>The page you are looking for does not exist.</p>
        <NavLink to="/" className="back-home">
          Back to Home
        </NavLink>
      </section>
    </main>
  );
};

export default NotFound;
