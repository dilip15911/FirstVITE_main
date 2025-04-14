import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const StudentSupport = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  // Check if user is admin and redirect if not
  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
    }
  }, [isAdmin, navigate]);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Student Support Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Ticket Management */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Ticket Management</h2>
          <p className="text-gray-600">Manage student support tickets</p>
        </div>

        {/* Q&A Forum */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Q&A Forum</h2>
          <p className="text-gray-600">Manage student questions and discussions</p>
        </div>

        {/* Mentorship Program */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Mentorship Program</h2>
          <p className="text-gray-600">Manage mentor-student relationships</p>
        </div>

        {/* Resource Library */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Resource Library</h2>
          <p className="text-gray-600">Manage educational resources</p>
        </div>
      </div>
    </div>
  );
};

export default StudentSupport;
