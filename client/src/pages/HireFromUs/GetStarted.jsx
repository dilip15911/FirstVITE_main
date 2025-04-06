import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";

const GetStarted = () => {
  const [formData, setFormData] = useState({
    company_name: "",
    contact_email: "",
    contact_number: "",
    job_role: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3000/hiring-register", formData);
      navigate("/our-student");
    } catch (error) {
      console.error("Error registering user:", error);
    }
  };

  return (
    <div className="container py-5 text-center">
      <h1 className="display-4 fw-bold">Welcome to FirstVite Hiring</h1>
      <p className="mt-3 fs-5">Fill out the form below to connect with top talent.</p>

      <div className="card mx-auto p-4 mt-4" style={{ maxWidth: "500px" }}>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Company Name</label>
            <input type="text" name="company_name" className="form-control" placeholder="Enter your company name" onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Contact Email</label>
            <input type="email" name="contact_email" className="form-control" placeholder="Enter your email" onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Phone Numbar</label>
            <input type="number" name="contact_number" className="form-control" placeholder="Enter your mobile number" onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Job Role</label>
            <input type="text" name="job_role" className="form-control" placeholder="Enter the job role you are hiring for" onChange={handleChange} required />
          </div>
          <button type="submit" className="btn btn-primary w-100">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default GetStarted;
