// src/pages/admin/employees/CreateEmployee.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CreateEmployee = () => {
    const [formData, setFormData] = useState({ name: '', email: '', role: '' });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/employees', formData);
            navigate('/admin/employees/manage');
        } catch (error) {
            console.error('Error creating employee:', error);
        }
    };

    return (
        <div className="container mt-4">
            <h2>Create Employee</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" name="name" placeholder="Name" onChange={handleChange} required />
                <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
                <input type="text" name="role" placeholder="Role" onChange={handleChange} required />
                <button type="submit">Create</button>
            </form>
        </div>
    );
};
export default CreateEmployee;