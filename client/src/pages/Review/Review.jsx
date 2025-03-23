import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const Review = () => {
  return (
    <div className="container py-5">
      <h1 className="text-center mb-4">Why Choose FirstVite?</h1>

      {/* About Section */}
      <div className="card p-4 shadow-sm mb-4">
        <h3>About FirstVite</h3>
        <p>
          FirstVite is a leading e-learning platform that provides high-quality online courses from top educators and institutions. Our goal is to make learning accessible, flexible, and industry-relevant.
        </p>
      </div>

      {/* Key Features */}
      <div className="card p-4 shadow-sm mb-4">
        <h3>Key Features</h3>
        <ul>
          <li>🌍 **Learn from anywhere, anytime**</li>
          <li>🎓 **Industry-recognized certifications**</li>
          <li>👨‍🏫 **Expert instructors and mentors**</li>
          <li>📚 **Wide range of courses across domains**</li>
          <li>🚀 **Career support and job assistance**</li>
        </ul>
      </div>

      {/* User Testimonials */}
      <div className="card p-4 shadow-sm">
        <h3>User Reviews & Testimonials</h3>
        <div className="mt-3">
          <div className="border-bottom pb-2 mb-3">
            <strong>⭐ 5/5 - Rajesh Kumar</strong>
            <p>"The courses are well-structured and easy to follow. The certifications helped me get a job!"</p>
          </div>
          <div className="border-bottom pb-2 mb-3">
            <strong>⭐ 4.8/5 - Priya Sharma</strong>
            <p>"Excellent platform for upskilling. The mentors are highly knowledgeable."</p>
          </div>
          <div>
            <strong>⭐ 4.7/5 - Aman Gupta</strong>
            <p>"Loved the flexibility of learning at my own pace. Highly recommended!"</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Review;
