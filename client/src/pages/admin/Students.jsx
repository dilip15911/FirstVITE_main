import React, { useState, useEffect } from "react";

const Students = () => {
    const [students, setStudents] = useState([]);
    const [newStudent, setNewStudent] = useState({ name: "", email: "", course: "", mobile: "" });

    useEffect(() => {
        // Fetch students data from API (Dummy data for now)
        setStudents([
            { id: 1, name: "John Doe", email: "john@example.com", course: "React", mobile: "9876543210" },
            { id: 2, name: "Jane Smith", email: "jane@example.com", course: "Node.js", mobile: "9876543211" },
        ]);
    }, []);

    const handleChange = (e) => {
        setNewStudent({ ...newStudent, [e.target.name]: e.target.value });
    };

    const addStudent = () => {
        setStudents([...students, { id: students.length + 1, ...newStudent }]);
        setNewStudent({ name: "", email: "", course: "", mobile: "" });
    };

    const deleteStudent = (id) => {
        setStudents(students.filter(student => student.id !== id));
    };

    return (
        <div className="container mt-4">
            <h2>Students Management</h2>

            {/* Add Student Form */}
            <div className="mb-4">
                <h4>Add Student</h4>
                <input 
                    type="text" 
                    name="name" 
                    placeholder="Name" 
                    value={newStudent.name} 
                    onChange={handleChange} 
                    className="form-control mb-2" 
                />
                <input 
                    type="email" 
                    name="email" 
                    placeholder="Email" 
                    value={newStudent.email} 
                    onChange={handleChange} 
                    className="form-control mb-2" 
                />
                    <input 
                        type="tel" 
                        name="mobile" 
                        placeholder="Mobile Number" 
                        value={newStudent.mobile} 
                        onChange={handleChange} 
                        className="form-control mb-2" 
                    />
                <input 
                    type="text" 
                    name="course" 
                    placeholder="Course" 
                    value={newStudent.course} 
                    onChange={handleChange} 
                    className="form-control mb-2" 
                />
                <button className="btn btn-primary" onClick={addStudent}>Add Student</button>
            </div>

            {/* Students List */}
            <h4>Manage Students</h4>
            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Mobile</th>
                        <th>Course</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {students.map(student => (
                        <tr key={student.id}>
                            <td>{student.id}</td>
                            <td>{student.name}</td>
                            <td>{student.email}</td>
                            <td>{student.mobile}</td>
                            <td>{student.course}</td>
                            <td>
                                <button className="btn btn-danger btn-sm" onClick={() => deleteStudent(student.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Students;