import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { ListGroup } from "react-bootstrap";
import { FaAngleRight } from "react-icons/fa";
import "./Programs.css";

const ProgramCategories = [
  { name: "Generative AI", link: "/generative-ai" },
  { name: "AI & Machine Learning", link: "/ai-and-machine-learning" },
  {
    name: "Data Science & Business Analytics",
    link: "/data-science-business-analytics",
  },
  { name: "Project Management", link: "/project-management" },
  { name: "Cyber Security", link: "/cyber-security" },
  { name: "Agile and Scrum", link: "/agile-and-scrum" },
  { name: "Cloud Computing & DevOps", link: "/cloud-computing-devops" },
  { name: "Business and Leadership", link: "/business-and-leadership" },
  { name: "Software Development", link: "/software-development" },
  { name: "Product and Design", link: "/product-and-design" },
];

const Program = () => {
  return (
    <>
      <div className="container program-container">
        <div className="row">
          {/* Sidebar Section */}
          <div className="col-lg-3 col-12 p-3 bg-light program-sidebar">
            {/* Most Popular Button */}
            <button className="btn btn-primary w-100 mb-3">Most Popular</button>

            {/* Category List */}
            <ListGroup>
              {ProgramCategories.map((category, index) => (
                <ListGroup.Item
                  key={index}
                  className="text-dark font-semibold bg-gray-100 border-0 d-flex justify-content-between align-items-center"
                  style={{ background: "#f7f8f8" }}
                  action
                  href={category.link}
                >
                  {category.name}
                  <FaAngleRight />
                </ListGroup.Item>
              ))}
            </ListGroup>
          </div>

          {/* Main Content (Example) */}
          <div className="col-lg-9 col-12">
            <h3>Main Content Area</h3>
            <p>This is where the main content of the page will go.</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Program;
