import React from 'react';
import { Dropdown } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaUser } from 'react-icons/fa';
import './UserProfile.css';

const UserProfile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <Dropdown align="end">
      <Dropdown.Toggle variant="light" id="user-profile-dropdown" className="user-profile-toggle">
        <FaUser className="me-2" />
        {user?.name || 'User'}
      </Dropdown.Toggle>

      <Dropdown.Menu className="user-profile-menu">
        <div className="px-3 py-2 user-info">
          <h6 className="mb-0">{user?.name}</h6>
          <small className="text-muted">{user?.email}</small>
        </div>
        <Dropdown.Divider />
        <Dropdown.Item href="/profile">My Profile</Dropdown.Item>
        <Dropdown.Item href="/my-courses">My Courses</Dropdown.Item>
        <Dropdown.Item href="/settings">Settings</Dropdown.Item>
        <Dropdown.Divider />
        <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default UserProfile;
