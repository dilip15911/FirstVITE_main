import { Link, useLocation } from "react-router-dom";
import { FaHome, FaUserGraduate, FaBook, FaChalkboardTeacher, FaList, FaChartBar, FaCog, FaBars, FaTachometerAlt } from "react-icons/fa";
import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`d-flex flex-column bg-dark text-white vh-100 ${isOpen ? "p-3 w-25" : "p-2 w-10"}`} style={{ transition: "width 0.3s ease", overflow: "hidden", maxWidth: "250px", minWidth: "250px" }}>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <span className="fs-4 fw-bold">{isOpen ? "Admin Panel" : ""}</span>
        <button onClick={toggleSidebar} className="btn text-white">
          <FaBars size={24} />
        </button>
      </div>
      <nav>
        <ul className="nav flex-column">
          <li className="nav-item">
            <Link to="/admin/home" className={`nav-link text-white d-flex align-items-center ${location.pathname === "/admin/home" ? "bg-secondary" : ""}`}>
              <FaHome size={20} className="me-2" />
              {isOpen && "Home"}
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/admin/dashboard" className={`nav-link text-white d-flex align-items-center ${location.pathname === "/admin/dashboard" ? "bg-secondary" : ""}`}>
              <FaTachometerAlt size={20} className="me-2" />
              {isOpen && "Dashboard"}
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
          <li className="nav-item">
            <Link to="/admin/instructors" className={`nav-link text-white d-flex align-items-center ${location.pathname === "/admin/instructors" ? "bg-secondary" : ""}`}>
              <FaChalkboardTeacher size={20} className="me-2" />
              {isOpen && "Instructors"}
            </Link>
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
