import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";

const HireFromUs = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/get-started");
  };

  return (
    <div className="container py-5">
      {/* Hero Section */}
      <section className="text-center p-5 bg-primary text-white rounded">
        <h1 className="display-4 fw-bold">Hire Skilled Professionals from FirstVite</h1>
        <p className="mt-3 fs-5">Get access to top-trained candidates with industry-relevant skills.</p>
      </section>

      {/* Why Hire From Us Section */}
      <section className="row mt-5">
        <div className="col-md-4">
          <div className="p-4 bg-light rounded shadow-sm text-center">
            <h2 className="h5">Industry-Ready Talent</h2>
            <p className="mt-2 text-muted">Our students undergo rigorous training aligned with industry standards.</p>
          </div>
        </div>
        <div className="col-md-4">
          <div className="p-4 bg-light rounded shadow-sm text-center">
            <h2 className="h5">Diverse Skill Sets</h2>
            <p className="mt-2 text-muted">Find candidates in various domains like IT, marketing, finance, and more.</p>
          </div>
        </div>
        <div className="col-md-4">
          <div className="p-4 bg-light rounded shadow-sm text-center">
            <h2 className="h5">Certified Professionals</h2>
            <p className="mt-2 text-muted">Each candidate is certified and evaluated for real-world applications.</p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="text-center mt-5 p-5 bg-primary text-white rounded">
        <h2 className="h4 fw-bold">Start Hiring Today!</h2>
        <p className="mt-3">Connect with our pool of skilled professionals and find your perfect hire.</p>
        <button className="btn btn-light text-primary fw-bold mt-3" onClick={handleGetStarted}>
          Get Started
        </button>
      </section>
    </div>
  );
};

export default HireFromUs;
