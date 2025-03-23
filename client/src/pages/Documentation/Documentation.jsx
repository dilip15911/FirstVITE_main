import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const Documentation = () => {
  return (
    <div className="container py-5">
      <h1 className="text-center mb-4 text-primary fw-bold">📖 FirstVite Documentation</h1>

      {/* Introduction Section */}
      <section className="mb-5 p-4 bg-light rounded shadow-sm">
        <h3 className="text-dark">🚀 Introduction</h3>
        <p>
          FirstVite is an advanced e-learning platform designed to provide high-quality education and job-oriented courses. This documentation will guide you through using the platform, exploring courses, and hiring skilled professionals.
        </p>
      </section>

      {/* How It Works Section */}
      <section className="mb-5">
        <h3 className="text-dark">🔹 How It Works</h3>
        <div className="row mt-3">
          <div className="col-md-4">
            <div className="card p-3 shadow-sm border-primary">
              <h5>1️⃣ Sign Up & Profile</h5>
              <p>Register on FirstVite, create your profile, and access the learning dashboard.</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card p-3 shadow-sm border-success">
              <h5>2️⃣ Explore Courses</h5>
              <p>Choose from a variety of courses across multiple domains.</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card p-3 shadow-sm border-warning">
              <h5>3️⃣ Enroll & Learn</h5>
              <p>Start learning at your own pace with expert-led courses.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="mb-5 p-4 bg-info text-white rounded shadow-sm">
        <h3>🌟 Key Features</h3>
        <ul className="mt-3">
          <li>📚 **Wide Course Library** – Courses in tech, business, design, and more.</li>
          <li>🎓 **Certified Programs** – Get industry-recognized certificates.</li>
          <li>👨‍🏫 **Expert Mentorship** – Learn from experienced professionals.</li>
          <li>📈 **Career Support** – Job placement and internship opportunities.</li>
          <li>💻 **Flexible Learning** – Learn anytime, anywhere.</li>
        </ul>
      </section>

      {/* FAQ Section */}
      <section className="mb-5 p-4 bg-light rounded shadow-sm">
        <h3>❓ Frequently Asked Questions (FAQs)</h3>
        <div className="mt-3">
          <div className="border-bottom pb-2 mb-3">
            <strong>📌 Q: Is FirstVite free?</strong>
            <p>A: Some courses are free, while others require payment for certification.</p>
          </div>
          <div className="border-bottom pb-2 mb-3">
            <strong>📌 Q: How do I get a certificate?</strong>
            <p>A: After completing a course, you can download your certificate from your dashboard.</p>
          </div>
          <div className="border-bottom pb-2 mb-3">
            <strong>📌 Q: Can companies hire from FirstVite?</strong>
            <p>A: Yes! Companies can access our talent pool through the "Hire From Us" section.</p>
          </div>
        </div>
      </section>

      {/* Contact & Support Section */}
      <section className="p-4 bg-dark text-white rounded shadow-sm">
        <h3>📞 Need Help?</h3>
        <p>For any queries, contact our support team:</p>
        <ul>
          <li>📩 Email: support@firstvite.com</li>
          <li>📞 Phone: +91 123 456 7890</li>
          <li>🌐 Website: www.firstvite.com</li>
        </ul>
      </section>
    </div>
  );
};

export default Documentation;
