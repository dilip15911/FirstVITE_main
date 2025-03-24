import React from "react";
import { Card, Button } from "react-bootstrap";
import "./Courses.css";

const Courses = () => {
 const courses = [
   {
     id: 1,
     name: "React Basics",
     duration: "6 weeks",
     startDate: "April 10, 2025",
     image: "/Images/study-one.jpg",
   },
   {
     id: 2,
     name: "Node.js Fundamentals",
     duration: "8 weeks",
     startDate: "April 20, 2025",
     image: "/Images/study-two.jpg",
   },
   {
     id: 3,
     name: "SQL & Databases",
     duration: "5 weeks",
     startDate: "May 1, 2025",
     image: "/Images/study-three.jpg",
   },
   {
     id: 4,
     name: "Advanced React",
     duration: "7 weeks",
     startDate: "May 15, 2025",
     image: "/Images/study-one.jpg",
   },
   {
     id: 5,
     name: "Express.js & APIs",
     duration: "6 weeks",
     startDate: "June 1, 2025",
     image: "/Images/study-two.jpg",
   },
   {
     id: 6,
     name: "MongoDB Essentials",
     duration: "5 weeks",
     startDate: "June 10, 2025",
     image: "/Images/study-three.jpg",
   },
   {
     id: 7,
     name: "Full-Stack MERN",
     duration: "10 weeks",
     startDate: "June 25, 2025",
     image: "/Images/study-one.jpg",
   },
   {
     id: 8,
     name: "DevOps & Deployment",
     duration: "6 weeks",
     startDate: "July 5, 2025",
     image: "/Images/study-two.jpg",
   },
 ];


  return (
    <div className="courses-container">
      {courses.map((course) => (
        <Card key={course.id} className="course-card shadow-sm">
          <Card.Img variant="top" src={course.image} alt={course.name} />
          <Card.Body>
            <Card.Title>{course.name}</Card.Title>
            <Card.Text>
              <strong>Duration:</strong> {course.duration} <br />
              <strong>Cohort Starts:</strong> {course.startDate}
            </Card.Text>
            <Button variant="primary">View Program</Button>
          </Card.Body>
        </Card>
      ))}
    </div>
  );
};

export default Courses;
