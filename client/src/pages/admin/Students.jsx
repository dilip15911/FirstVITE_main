import React, { useState, useEffect } from "react";
import { toast } from 'react-toastify';
import { FaPlus, FaSearch, FaTrash, FaEdit, FaUserGraduate } from "react-icons/fa";
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

const Students = () => {
    const [students, setStudents] = useState([]);
    const [newStudent, setNewStudent] = useState({ name: "", email: "", mobile: "", course: "" });
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [editMode, setEditMode] = useState(false);
    const [currentStudentId, setCurrentStudentId] = useState(null);
    const [formVisible, setFormVisible] = useState(false);
    const { user, isAdmin, refreshUser } = useAuth();

    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

    // Set up axios interceptors once
    useEffect(() => {
        axios.interceptors.request.use(
            config => {
                // Get token from localStorage, ensuring it doesn't have Bearer prefix
                let token = localStorage.getItem('token');
                if (token) {
                    // Remove Bearer prefix if it exists
                    if (token.startsWith('Bearer ')) {
                        token = token.slice(7);
                    }
                    config.headers.Authorization = `Bearer ${token}`;
                    console.log('Added token to request:', config.url);
                }
                return config;
            },
            error => {
                return Promise.reject(error);
            }
        );
    }, []);

    const fetchStudents = async () => {
        try {
            setLoading(true);
            
            // Get the current token
            let token = localStorage.getItem('token');
            if (!token) {
                const adminData = JSON.parse(localStorage.getItem('adminData') || '{}');
                token = adminData.token;
                
                if (token) {
                    // Store token in localStorage
                    localStorage.setItem('token', token);
                }
            }
            
            if (!token) {
                throw new Error('No authentication token found. Please log in again.');
            }
            
            // Ensure token is properly formatted
            if (token.startsWith('Bearer ')) {
                token = token.slice(7);
            }
            
            // Set the token in axios headers for this specific request
            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            };
            
            console.log('Fetching students with token');
            const response = await axios.get(`${API_URL}/students?search=${searchTerm}`, config);
            setStudents(response.data || []);
        } catch (error) {
            console.error('Error fetching students:', error);
            toast.error(error.response?.data?.message || 'Failed to load students');
            if (error.response?.status === 401) {
                // Clear token and redirect to login
                localStorage.removeItem('token');
                window.location.href = '/admin/login';
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isAdmin) {
            fetchStudents();
        }
    }, [searchTerm, isAdmin]);

    const handleChange = (e) => {
        setNewStudent({ ...newStudent, [e.target.name]: e.target.value });
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const validateForm = () => {
        if (!newStudent.name || !newStudent.email || !newStudent.mobile || !newStudent.course) {
            toast.error('All fields are required');
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(newStudent.email)) {
            toast.error('Please enter a valid email address');
            return false;
        }

        const mobileRegex = /^[0-9]{10}$/;
        if (!mobileRegex.test(newStudent.mobile)) {
            toast.error('Please enter a valid 10-digit mobile number');
            return false;
        }

        return true;
    };

    const addStudent = async () => {
        if (!validateForm()) return;

        try {
            setLoading(true);
            
            // Get the current token
            let token = localStorage.getItem('token');
            if (!token) {
                const adminData = JSON.parse(localStorage.getItem('adminData') || '{}');
                token = adminData.token;
                
                if (token) {
                    // Store token in localStorage
                    localStorage.setItem('token', token);
                }
            }
            
            if (!token) {
                throw new Error('No authentication token found. Please log in again.');
            }
            
            // Ensure token is properly formatted
            if (token.startsWith('Bearer ')) {
                token = token.slice(7);
            }
            
            // Set the token in axios headers for this specific request
            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            };
            
            console.log('Sending request to add student with token');
            const response = await axios.post(`${API_URL}/students`, newStudent, config);
            
            if (response.status === 201) {
                toast.success('Student added successfully');
                setNewStudent({ name: "", email: "", mobile: "", course: "" });
                setEditMode(false);
                setCurrentStudentId(null);
                setFormVisible(false);
                fetchStudents();
            } else {
                throw new Error(response.data.message || 'Failed to add student');
            }
        } catch (error) {
            console.error('Error adding student:', error);
            toast.error(error.response?.data?.message || 'Failed to add student');
            if (error.response?.status === 401) {
                // Clear token and redirect to login
                localStorage.removeItem('token');
                window.location.href = '/admin/login';
            }
        } finally {
            setLoading(false);
        }
    };

    const editStudent = (student) => {
        setNewStudent({
            name: student.name,
            email: student.email,
            mobile: student.mobile,
            course: student.course
        });
        setCurrentStudentId(student.id);
        setEditMode(true);
        setFormVisible(true);
    };

    const updateStudent = async () => {
        if (!validateForm()) return;

        try {
            setLoading(true);
            
            // Get the current token
            let token = localStorage.getItem('token');
            if (!token) {
                const adminData = JSON.parse(localStorage.getItem('adminData') || '{}');
                token = adminData.token;
                
                if (token) {
                    // Store token in localStorage
                    localStorage.setItem('token', token);
                }
            }
            
            if (!token) {
                throw new Error('No authentication token found. Please log in again.');
            }
            
            // Ensure token is properly formatted
            if (token.startsWith('Bearer ')) {
                token = token.slice(7);
            }
            
            // Set the token in axios headers for this specific request
            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            };
            
            console.log('Updating student with token');
            const response = await axios.put(`${API_URL}/students/${currentStudentId}`, newStudent, config);
            
            if (response.status === 200) {
                toast.success('Student updated successfully');
                setNewStudent({ name: "", email: "", mobile: "", course: "" });
                setEditMode(false);
                setCurrentStudentId(null);
                setFormVisible(false);
                fetchStudents();
            } else {
                throw new Error(response.data.message || 'Failed to update student');
            }
        } catch (error) {
            console.error('Error updating student:', error);
            toast.error(error.response?.data?.message || 'Failed to update student');
            if (error.response?.status === 401) {
                // Clear token and redirect to login
                localStorage.removeItem('token');
                window.location.href = '/admin/login';
            }
        } finally {
            setLoading(false);
        }
    };

    const deleteStudent = async (id) => {
        if (!window.confirm('Are you sure you want to delete this student?')) return;

        try {
            setLoading(true);
            
            // Get the current token
            let token = localStorage.getItem('token');
            if (!token) {
                const adminData = JSON.parse(localStorage.getItem('adminData') || '{}');
                token = adminData.token;
                
                if (token) {
                    // Store token in localStorage
                    localStorage.setItem('token', token);
                }
            }
            
            if (!token) {
                throw new Error('No authentication token found. Please log in again.');
            }
            
            // Ensure token is properly formatted
            if (token.startsWith('Bearer ')) {
                token = token.slice(7);
            }
            
            // Set the token in axios headers for this specific request
            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            };
            
            console.log('Deleting student with token');
            const response = await axios.delete(`${API_URL}/students/${id}`, config);
            
            if (response.status === 200) {
                toast.success('Student deleted successfully');
                fetchStudents();
            } else {
                throw new Error(response.data.message || 'Failed to delete student');
            }
        } catch (error) {
            console.error('Error deleting student:', error);
            toast.error(error.response?.data?.message || 'Failed to delete student');
            if (error.response?.status === 401) {
                // Clear token and redirect to login
                localStorage.removeItem('token');
                window.location.href = '/admin/login';
            }
        } finally {
            setLoading(false);
        }
    };

    const toggleForm = () => {
        if (formVisible && editMode) {
            // If closing form while in edit mode, reset form
            setNewStudent({ name: "", email: "", mobile: "", course: "" });
            setEditMode(false);
            setCurrentStudentId(null);
        }
        setFormVisible(!formVisible);
    };

    return (
        <div className="container-fluid p-4">
            <div className="row mb-4">
                <div className="col-md-6">
                    <h2 className="mb-0">
                        <FaUserGraduate className="me-2" />
                        Student Management
                    </h2>
                    <p className="text-muted">Manage all student records</p>
                </div>
                <div className="col-md-6 d-flex justify-content-end align-items-center">
                    <div className="input-group me-3" style={{ maxWidth: '300px' }}>
                        <span className="input-group-text bg-light">
                            <FaSearch />
                        </span>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search students..."
                            value={searchTerm}
                            onChange={handleSearch}
                        />
                    </div>
                    <button 
                        className="btn btn-primary"
                        onClick={toggleForm}
                    >
                        <FaPlus className="me-2" />
                        {formVisible ? 'Hide Form' : 'Add Student'}
                    </button>
                </div>
            </div>

            {formVisible && (
                <div className="card mb-4 shadow-sm">
                    <div className="card-header bg-light">
                        <h5 className="mb-0">{editMode ? 'Edit Student' : 'Add New Student'}</h5>
                    </div>
                    <div className="card-body">
                        <form onSubmit={(e) => e.preventDefault()}>
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Full Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="name"
                                        value={newStudent.name}
                                        onChange={handleChange}
                                        placeholder="Enter full name"
                                        required
                                    />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Email</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        name="email"
                                        value={newStudent.email}
                                        onChange={handleChange}
                                        placeholder="Enter email address"
                                        required
                                    />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Mobile Number</label>
                                    <input
                                        type="tel"
                                        className="form-control"
                                        name="mobile"
                                        value={newStudent.mobile}
                                        onChange={handleChange}
                                        placeholder="Enter 10-digit mobile number"
                                        required
                                    />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Course</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="course"
                                        value={newStudent.course}
                                        onChange={handleChange}
                                        placeholder="Enter course name"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="d-flex justify-content-end mt-3">
                                <button 
                                    type="button"
                                    className="btn btn-secondary me-2"
                                    onClick={toggleForm}
                                    disabled={loading}
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={editMode ? updateStudent : addStudent}
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                            {editMode ? 'Updating...' : 'Adding...'}
                                        </>
                                    ) : (
                                        <>{editMode ? 'Update' : 'Add'} Student</>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="card shadow-sm">
                <div className="card-header bg-light">
                    <h5 className="mb-0">Student Records</h5>
                </div>
                <div className="card-body p-0">
                    {loading && !students.length ? (
                        <div className="text-center p-5">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                            <p className="mt-2">Loading students...</p>
                        </div>
                    ) : students.length === 0 ? (
                        <div className="text-center p-5">
                            <p className="mb-0">No students found. {searchTerm ? 'Try a different search term.' : 'Add a student to get started.'}</p>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-hover mb-0">
                                <thead className="table-light">
                                    <tr>
                                        <th>ID</th>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Mobile</th>
                                        <th>Course</th>
                                        <th className="text-end">Actions</th>
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
                                            <td className="text-end">
                                                <button 
                                                    className="btn btn-sm btn-outline-primary me-2"
                                                    onClick={() => editStudent(student)}
                                                    disabled={loading}
                                                >
                                                    <FaEdit /> Edit
                                                </button>
                                                <button 
                                                    className="btn btn-sm btn-outline-danger"
                                                    onClick={() => deleteStudent(student.id)}
                                                    disabled={loading}
                                                >
                                                    <FaTrash /> Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
                <div className="card-footer bg-light">
                    <div className="d-flex justify-content-between align-items-center">
                        <span>Total Students: {students.length}</span>
                        {students.length > 0 && (
                            <button 
                                className="btn btn-sm btn-outline-primary"
                                onClick={fetchStudents}
                                disabled={loading}
                            >
                                {loading ? (
                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                ) : (
                                    <span>Refresh</span>
                                )}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Students;