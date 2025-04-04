// src/pages/admin/employees/CreateEmployee.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../utils/api';

const CreateEmployee = () => {
    const [formData, setFormData] = useState({ name: '', email: '', role: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await api.post('/employees', formData);
            navigate('/admin/employees/manage');
        } catch (error) {
            setError(error.response?.data?.message || 'Error creating employee. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Create Employee</h2>
            <form onSubmit={handleSubmit} className="max-w-md">
                <div className="mb-4">
                    <input 
                        type="text" 
                        name="name" 
                        placeholder="Name" 
                        value={formData.name}
                        onChange={handleChange} 
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500" 
                        required 
                    />
                </div>
                <div className="mb-4">
                    <input 
                        type="email" 
                        name="email" 
                        placeholder="Email" 
                        value={formData.email}
                        onChange={handleChange} 
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500" 
                        required 
                    />
                </div>
                <div className="mb-4">
                    <input 
                        type="text" 
                        name="role" 
                        placeholder="Role" 
                        value={formData.role}
                        onChange={handleChange} 
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500" 
                        required 
                    />
                </div>
                {error && (
                    <div className="mb-4 text-red-500">{error}</div>
                )}
                <button 
                    type="submit" 
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 disabled:bg-blue-300"
                    disabled={loading}
                >
                    {loading ? 'Creating...' : 'Create Employee'}
                </button>
            </form>
        </div>
    );
};
export default CreateEmployee;