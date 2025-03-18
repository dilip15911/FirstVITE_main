import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { ListGroup, Card } from "react-bootstrap";
import { FaAngleRight } from "react-icons/fa";
import "./Programs.css";

const ProgramCategories = [
  {
    name: "Generative AI",
    description: "Explore AI-generated content and creative AI models.",
    courses: [
      {
        title: "Intro to Generative AI",
        details: "Learn the basics of AI-generated content.",
        image: "https://source.unsplash.com/400x200/?AI,technology",
        duration: "3 Weeks"
      },
      {
        title: "Building AI Models",
        details: "Develop and train your own AI models.",
        image: "https://source.unsplash.com/400x200/?robot,artificial-intelligence",
        duration: "4 Weeks"
      },
    ],
  },
  {
    name: "AI & Machine Learning",
    description: "Learn about machine learning algorithms and AI applications.",
    courses: [
      {
        title: "Machine Learning Basics",
        details: "Understand ML concepts and algorithms.",
        image: "https://source.unsplash.com/400x200/?machine-learning,data",
        duration: "5 Weeks"
      },
      {
        title: "Deep Learning",
        details: "Explore deep neural networks and AI applications.",
        image: "https://source.unsplash.com/400x200/?deep-learning,neural-network",
        duration: "6 Weeks"
      },
    ],
  },
  {
    name: "Data Science & Business Analytics",
    description: "Analyze data trends and make business decisions.",
    courses: [
      {
        title: "Data Science for Beginners",
        details: "Introduction to data analysis and visualization.",
        image: "https://source.unsplash.com/400x200/?data-science,analytics",
        duration: "7 Weeks"
      },
      {
        title: "Business Analytics",
        details: "Learn data-driven decision making for business.",
        image: "https://source.unsplash.com/400x200/?business,analytics",
        duration: "8 Weeks"
      },
    ],
  },
  {
    name: "Project Management",
    description: "Master project planning, execution, and agile methodologies.",
    courses: [
      {
        title: "Project Management Basics",
        details: "Introduction to project management principles.",
        image: "https://source.unsplash.com/400x200/?project-management,management",
        duration: "9 Weeks"
      },
      {
        title: "Agile Project Management",
        details: "Learn agile methodologies and practices.",
        image: "https://source.unsplash.com/400x200/?agile,project",
        duration: "10 Weeks"
      },
    ],
  },
];

const AllPrograms = () => {
  const [selectedCategory, setSelectedCategory] = useState(ProgramCategories[0] || { name: "", description: "", courses: [] });

  return (
    <div className="container program-container" style={{ paddingBottom: "5px" }}>
      <div className="row">
        {/* Sidebar Section */}
        <div className="col-lg-3 col-12 p-3 bg-light program-sidebar">
          <button className="btn btn-primary w-100 mb-3">Most Popular</button>

          {/* Category List */}
          <ListGroup>
            {ProgramCategories.map((category, index) => (
              <ListGroup.Item
                key={index}
                className={`text-dark font-semibold bg-gray-100 border-0 d-flex justify-content-between align-items-center ${selectedCategory.name === category.name ? "active" : ""
                  }`}
                style={{ background: selectedCategory.name === category.name ? "#007bff" : "#f7f8f8", color: selectedCategory.name === category.name ? "#fff" : "#000" }}
                action
                onClick={() => setSelectedCategory(category)}
              >
                {category.name}
                <FaAngleRight />
              </ListGroup.Item>
            ))}
          </ListGroup>
        </div>

        {/* Main Content (Dynamic Category Info with Cards) */}
        <div className="col-lg-9 col-12 p-4">
          <h3>{selectedCategory.name}</h3>
          <p>{selectedCategory.description}</p>

          {/* Display Courses as Cards */}
          <div className="row">
            {(selectedCategory.courses || []).map((course, index) => (
              <div key={index} className="col-md-6 mb-3">
                <Card className="shadow-sm">
                  <Card.Img variant="top" src={course.image} alt={course.title} />
                  <Card.Body>
                    <Card.Title>{course.title}</Card.Title>
                    <Card.Text>{course.details}</Card.Text>
                    <Card.Text><strong>Duration:</strong> {course.duration}</Card.Text>
                    <button className="btn btn-primary">Explore</button>
                  </Card.Body>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllPrograms;