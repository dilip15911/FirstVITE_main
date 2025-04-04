import React, { useState } from "react";
import { Outlet } from "react-router-dom";  
import { Button, Table, Modal, Form } from "react-bootstrap";

const Courses = () => {
    const [show, setShow] = useState(false);
    const [courses, setCourses] = useState([
        { id: 1, name: "React for Beginners", category: "Web Development", status: "Published" },
        { id: 2, name: "Node.js Essentials", category: "Backend", status: "Draft" },
    ]);
    const [newCourse, setNewCourse] = useState({ name: "", category: "", status: "Draft" });

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleAddCourse = () => {
        setCourses([...courses, { id: courses.length + 1, ...newCourse }]);
        handleClose();
    };

    const handleDelete = (id) => {
        setCourses(courses.filter(course => course.id !== id));
    };

    return (
        <div className="container mt-4">
            <h2 className="mb-3">Courses Management</h2>
            <Button variant="primary" onClick={handleShow} className="mb-3">Add New Course</Button>

            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Course Name</th>
                        <th>Category</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {courses.map(course => (
                        <tr key={course.id}>
                            <td>{course.id}</td>
                            <td>{course.name}</td>
                            <td>{course.category}</td>
                            <td>{course.status}</td>
                            <td>
                                <Button variant="danger" size="sm" onClick={() => handleDelete(course.id)}>Delete</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {/* Add Course Modal */}
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Add New Course</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Course Name</Form.Label>
                            <Form.Control type="text" placeholder="Enter course name" onChange={(e) => setNewCourse({ ...newCourse, name: e.target.value })} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Category</Form.Label>
                            <Form.Control type="text" placeholder="Enter category" onChange={(e) => setNewCourse({ ...newCourse, category: e.target.value })} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Status</Form.Label>
                            <Form.Select onChange={(e) => setNewCourse({ ...newCourse, status: e.target.value })}>
                                <option value="Draft">Draft</option>
                                <option value="Published">Published</option>
                            </Form.Select>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>Close</Button>
                    <Button variant="primary" onClick={handleAddCourse}>Save Course</Button>
                </Modal.Footer>
            </Modal>

            <div className="courses-page-content">
                <Outlet />
            </div>
        </div>
    );
};

export default Courses;
