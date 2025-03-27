import { Link, useLocation } from "react-router-dom";
import { FaUserGraduate, FaBook, FaList, FaChartBar, FaCog, FaBars, FaTachometerAlt, FaHome, FaUsers, FaUserPlus, FaClipboardList, FaBriefcase } from "react-icons/fa";
import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [isEmployeeOpen, setIsEmployeeOpen] = useState(false); // Employee dropdown toggle
  const location = useLocation();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const toggleEmployeeDropdown = () => {
    setIsEmployeeOpen(!isEmployeeOpen);
  };

  return (
    <div className={`d-flex flex-column bg-dark text-white vh-100 ${isOpen ? "p-3 w-25" : "p-2 w-10"}`}>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <span className="fs-4 fw-bold">{isOpen ? "Admin Panel" : ""}</span>
        <button onClick={toggleSidebar} className="btn text-white">
          <FaBars size={24} />
        </button>
      </div>
      <nav>
        <ul className="nav flex-column">
          <li className="nav-item">
            <Link to="/admin/dashboard" className={`nav-link text-white d-flex align-items-center ${location.pathname === "/admin/dashboard" ? "bg-secondary" : ""}`}>
              <FaTachometerAlt size={20} className="me-2" />
              {isOpen && "Dashboard"}
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/admin/home" className={`nav-link text-white d-flex align-items-center ${location.pathname === "/admin/home" ? "bg-secondary" : ""}`}>
              <FaHome size={20} className="me-2" />
              {isOpen && "Home"}
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/admin/students" className={`nav-link text-white d-flex align-items-center ${location.pathname === "/admin/students" ? "bg-secondary" : ""}`}>
              <FaUserGraduate size={20} className="me-2" />
              {isOpen && "Students"}
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/admin/courses" className={`nav-link text-white d-flex align-items-center ${location.pathname === "/admin/courses" ? "bg-secondary" : ""}`}>
              <FaBook size={20} className="me-2" />
              {isOpen && "Courses"}
            </Link>
          </li>

          {/* Employees Dropdown */}
          <li className="nav-item">
            <button className="btn text-white d-flex align-items-center w-100" onClick={toggleEmployeeDropdown}>
              <FaUsers size={20} className="me-2" />
              {isOpen && "Employees"}
              <span className="ms-auto">{isEmployeeOpen ? "▲" : "▼"}</span>
            </button>
            <ul className={`nav flex-column ps-3 ${isEmployeeOpen ? "d-block" : "d-none"}`}>
              <li className="nav-item">
                <Link to="/admin/employee/create-employee" className={`nav-link text-white ${location.pathname === "/admin/employee/create-employee" ? "bg-secondary" : ""}`}>
                  <FaUserPlus size={18} className="me-2" />
                  {isOpen && "Create Employee"}
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/admin/employee/manage-employee" className={`nav-link text-white ${location.pathname === "/admin/employee/manage-employee" ? "bg-secondary" : ""}`}>
                  <FaClipboardList size={18} className="me-2" />
                  {isOpen && "Manage Employees"}
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/admin/employee/view-employee" className={`nav-link text-white ${location.pathname === "/admin/employee/view-employee" ? "bg-secondary" : ""}`}>
                  <FaUsers size={18} className="me-2" />
                  {isOpen && "View Employees"}
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/admin/employee/create-jobrole" className={`nav-link text-white ${location.pathname === "/admin/employee/create-jobrole" ? "bg-secondary" : ""}`}>
                  <FaBriefcase size={18} className="me-2" />
                  {isOpen && "Create Job Role"}
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/admin/employee/manage-jobrole" className={`nav-link text-white ${location.pathname === "/admin/employee/manage-jobrole" ? "bg-secondary" : ""}`}>
                  <FaBriefcase size={18} className="me-2" />
                  {isOpen && "Manage Job Roles"}
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/admin/employee/view-jobrole" className={`nav-link text-white ${location.pathname === "/admin/employee/view-jobrole" ? "bg-secondary" : ""}`}>
                  <FaBriefcase size={18} className="me-2" />
                  {isOpen && "View Job Roles"}
                </Link>
              </li>
            </ul>
          </li>

          <li className="nav-item">
            <Link to="/admin/categories" className={`nav-link text-white d-flex align-items-center ${location.pathname === "/admin/categories" ? "bg-secondary" : ""}`}>
              <FaList size={20} className="me-2" />
              {isOpen && "Categories"}
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/admin/reports" className={`nav-link text-white d-flex align-items-center ${location.pathname === "/admin/reports" ? "bg-secondary" : ""}`}>
              <FaChartBar size={20} className="me-2" />
              {isOpen && "Reports"}
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/admin/settings" className={`nav-link text-white d-flex align-items-center ${location.pathname === "/admin/settings" ? "bg-secondary" : ""}`}>
              <FaCog size={20} className="me-2" />
              {isOpen && "Settings"}
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
