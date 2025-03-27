// src/pages/admin/employees/ViewEmployee.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const ViewEmployee = () => {
    const { id } = useParams();
    const [employee, setEmployee] = useState(null);

    useEffect(() => {
        axios.get(`/api/employees/${id}`)
            .then(response => setEmployee(response.data))
            .catch(error => console.error('Error fetching employee:', error));
    }, [id]);

    if (!employee) return <p>Loading...</p>;

    return (
        <div className="container mt-4">
            <h2>Employee Details</h2>
            <p><strong>Name:</strong> {employee.name}</p>
            <p><strong>Email:</strong> {employee.email}</p>
            <p><strong>Role:</strong> {employee.role}</p>
        </div>
    );
};
export default ViewEmployee;