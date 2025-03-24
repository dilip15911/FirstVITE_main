// src/pages/admin/employees/ManageEmployees.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ManageEmployees = () => {
    const [employees, setEmployees] = useState([]);

    useEffect(() => {
        axios.get('/api/employees')
            .then(response => setEmployees(response.data))
            .catch(error => console.error('Error fetching employees:', error));
    }, []);

    const handleDelete = async (id) => {
        try {
            await axios.delete(`/api/employees/${id}`);
            setEmployees(employees.filter(emp => emp.id !== id));
        } catch (error) {
            console.error('Error deleting employee:', error);
        }
    };

    return (
        <div className="container mt-4">
            <h2>Manage Employees</h2>
            <ul>
                {employees.map(emp => (
                    <li key={emp.id}>{emp.name} - {emp.email} - {emp.role} <button onClick={() => handleDelete(emp.id)}>Delete</button></li>
                ))}
            </ul>
        </div>
    );
};
export default ManageEmployees;
