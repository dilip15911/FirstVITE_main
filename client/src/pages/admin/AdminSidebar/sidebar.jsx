import { Link, useLocation } from "react-router-dom";
import { 
  FaUserGraduate, FaBook, FaList, FaChartBar, FaCog, FaTachometerAlt, 
  FaHome, FaUsers, FaUserPlus, FaClipboardList, FaBriefcase, FaChalkboardTeacher, 
  FaGraduationCap, FaChartLine, FaFolder, FaHeadset, FaCreditCard,
  FaChevronDown, FaChevronRight, FaPlus, FaChartPie, FaMoneyBillWave,
  FaExchangeAlt, FaCogs, FaHistory
} from "react-icons/fa";
import { useState, useEffect } from "react";
import "../../../styles/adminTheme.css";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const [isEmployeeOpen, setIsEmployeeOpen] = useState(false);
  const [isCourseOpen, setIsCourseOpen] = useState(false);
  const [isAssessmentOpen, setIsAssessmentOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Auto-expand relevant dropdown based on current path
    if (location.pathname.includes('/admin/courses')) {
      setIsCourseOpen(true);
    }
    
    if (location.pathname.includes('/admin/employee')) {
      setIsEmployeeOpen(true);
    }

    if (location.pathname.includes('/admin/assessments')) {
      setIsAssessmentOpen(true);
    }
    
    if (location.pathname.includes('/admin/payments')) {
      setIsPaymentOpen(true);
    }
  }, [location.pathname]);

  const toggleEmployeeDropdown = (e) => {
    e.preventDefault();
    setIsEmployeeOpen(!isEmployeeOpen);
  };

  const toggleCourseDropdown = (e) => {
    e.preventDefault();
    setIsCourseOpen(!isCourseOpen);
  };

  const toggleAssessmentDropdown = (e) => {
    e.preventDefault();
    setIsAssessmentOpen(!isAssessmentOpen);
  };
  
  const togglePaymentDropdown = (e) => {
    e.preventDefault();
    setIsPaymentOpen(!isPaymentOpen);
  };

  return (
    <div className="sidebar-menu">
      <div className="menu-item">
        <Link to="/admin/dashboard" className={location.pathname === "/admin/dashboard" ? "active" : ""}>
          <span className="menu-icon"><FaTachometerAlt /></span>
          {isOpen && "Dashboard"}
        </Link>
      </div>
      
      <div className="menu-item">
        <Link to="/admin/home" className={location.pathname === "/admin/home" ? "active" : ""}>
          <span className="menu-icon"><FaHome /></span>
          {isOpen && "Home"}
        </Link>
      </div>
      
      <div className="menu-item">
        <Link to="/admin/students" className={location.pathname === "/admin/students" ? "active" : ""}>
          <span className="menu-icon"><FaUserGraduate /></span>
          {isOpen && "Students"}
        </Link>
      </div>
      
      {/* Course Management Dropdown */}
      <div className={`menu-item ${isCourseOpen ? "active" : ""}`}>
        <button onClick={toggleCourseDropdown}>
          <span className="menu-icon"><FaBook /></span>
          {isOpen && "Course Management"}
          {isOpen && <span className="ms-auto">{isCourseOpen ? <FaChevronDown size={12} /> : <FaChevronRight size={12} />}</span>}
        </button>
        
        {isCourseOpen && isOpen && (
          <div className="submenu">
            <div className="menu-item">
              <Link to="/admin/courses" className={location.pathname === "/admin/courses" ? "active" : ""}>
                <span className="menu-icon"><FaList /></span>
                Course List
              </Link>
            </div>
            <div className="menu-item">
              <Link to="/admin/courses/new" className={location.pathname === "/admin/courses/new" ? "active" : ""}>
                <span className="menu-icon"><FaPlus /></span>
                Add New Course
              </Link>
            </div>
            <div className="menu-item">
              <Link to="/admin/categories" className={location.pathname === "/admin/categories" ? "active" : ""}>
                <span className="menu-icon"><FaList /></span>
                Categories
              </Link>
            </div>
          </div>
        )}
      </div>
      
      {/* Assessment Center Dropdown */}
      <div className={`menu-item ${isAssessmentOpen ? "active" : ""}`}>
        <button onClick={toggleAssessmentDropdown}>
          <span className="menu-icon"><FaGraduationCap /></span>
          {isOpen && "Assessment Center"}
          {isOpen && <span className="ms-auto">{isAssessmentOpen ? <FaChevronDown size={12} /> : <FaChevronRight size={12} />}</span>}
        </button>
        
        {isAssessmentOpen && isOpen && (
          <div className="submenu">
            <div className="menu-item">
              <Link to="/admin/assessments" className={location.pathname === "/admin/assessments" ? "active" : ""}>
                <span className="menu-icon"><FaList /></span>
                All Assessments
              </Link>
            </div>
            <div className="menu-item">
              <Link to="/admin/assessments/create" className={location.pathname === "/admin/assessments/create" ? "active" : ""}>
                <span className="menu-icon"><FaPlus /></span>
                Create Assessment
              </Link>
            </div>
            <div className="menu-item">
              <Link to="/admin/assessments/results" className={location.pathname === "/admin/assessments/results" ? "active" : ""}>
                <span className="menu-icon"><FaChartPie /></span>
                Assessment Results
              </Link>
            </div>
          </div>
        )}
      </div>
      
      <div className="menu-item">
        <Link to="/admin/analytics" className={location.pathname === "/admin/analytics" ? "active" : ""}>
          <span className="menu-icon"><FaChartLine /></span>
          {isOpen && "Analytics"}
        </Link>
      </div>
      
      <div className="menu-item">
        <Link to="/admin/content" className={location.pathname === "/admin/content" ? "active" : ""}>
          <span className="menu-icon"><FaFolder /></span>
          {isOpen && "Content Management"}
        </Link>
      </div>
      
      <div className="menu-item">
        <Link to="/admin/support" className={location.pathname === "/admin/support" ? "active" : ""}>
          <span className="menu-icon"><FaHeadset /></span>
          {isOpen && "Student Support"}
        </Link>
      </div>
      
      {/* Payment Management Dropdown */}
      <div className={`menu-item ${isPaymentOpen ? "active" : ""}`}>
        <button onClick={togglePaymentDropdown}>
          <span className="menu-icon"><FaCreditCard /></span>
          {isOpen && "Payment Management"}
          {isOpen && <span className="ms-auto">{isPaymentOpen ? <FaChevronDown size={12} /> : <FaChevronRight size={12} />}</span>}
        </button>
        
        {isPaymentOpen && isOpen && (
          <div className="submenu">
            <div className="menu-item">
              <Link to="/admin/payments" className={location.pathname === "/admin/payments" ? "active" : ""}>
                <span className="menu-icon"><FaMoneyBillWave /></span>
                Dashboard
              </Link>
            </div>
            <div className="menu-item">
              <Link to="/admin/payments/history" className={location.pathname === "/admin/payments/history" ? "active" : ""}>
                <span className="menu-icon"><FaHistory /></span>
                Payment History
              </Link>
            </div>
            <div className="menu-item">
              <Link to="/admin/payments/refunds" className={location.pathname === "/admin/payments/refunds" ? "active" : ""}>
                <span className="menu-icon"><FaExchangeAlt /></span>
                Refund Requests
              </Link>
            </div>
            <div className="menu-item">
              <Link to="/admin/payments/settings" className={location.pathname === "/admin/payments/settings" ? "active" : ""}>
                <span className="menu-icon"><FaCogs /></span>
                Payment Settings
              </Link>
            </div>
          </div>
        )}
      </div>
      
      <div className="menu-item">
        <Link to="/admin/guest-teachers" className={location.pathname === "/admin/guest-teachers" ? "active" : ""}>
          <span className="menu-icon"><FaChalkboardTeacher /></span>
          {isOpen && "Guest Teachers"}
        </Link>
      </div>

      {/* Employees Dropdown */}
      <div className={`menu-item ${isEmployeeOpen ? "active" : ""}`}>
        <button onClick={toggleEmployeeDropdown}>
          <span className="menu-icon"><FaUsers /></span>
          {isOpen && "Employees"}
          {isOpen && <span className="ms-auto">{isEmployeeOpen ? <FaChevronDown size={12} /> : <FaChevronRight size={12} />}</span>}
        </button>
        
        {isEmployeeOpen && isOpen && (
          <div className="submenu">
            <div className="menu-item">
              <Link to="/admin/employee/create-employee" className={location.pathname === "/admin/employee/create-employee" ? "active" : ""}>
                <span className="menu-icon"><FaUserPlus /></span>
                Create Employee
              </Link>
            </div>
            <div className="menu-item">
              <Link to="/admin/employee/manage-employee" className={location.pathname === "/admin/employee/manage-employee" ? "active" : ""}>
                <span className="menu-icon"><FaClipboardList /></span>
                Manage Employees
              </Link>
            </div>
            <div className="menu-item">
              <Link to="/admin/employee/view-employee" className={location.pathname === "/admin/employee/view-employee" ? "active" : ""}>
                <span className="menu-icon"><FaUsers /></span>
                View Employees
              </Link>
            </div>
            <div className="menu-item">
              <Link to="/admin/employee/create-jobrole" className={location.pathname === "/admin/employee/create-jobrole" ? "active" : ""}>
                <span className="menu-icon"><FaBriefcase /></span>
                Create Job Role
              </Link>
            </div>
            <div className="menu-item">
              <Link to="/admin/employee/manage-jobrole" className={location.pathname === "/admin/employee/manage-jobrole" ? "active" : ""}>
                <span className="menu-icon"><FaBriefcase /></span>
                Manage Job Roles
              </Link>
            </div>
            <div className="menu-item">
              <Link to="/admin/employee/view-jobrole" className={location.pathname === "/admin/employee/view-jobrole" ? "active" : ""}>
                <span className="menu-icon"><FaBriefcase /></span>
                View Job Roles
              </Link>
            </div>
          </div>
        )}
      </div>

      <div className="menu-item">
        <Link to="/admin/categories" className={location.pathname === "/admin/categories" ? "active" : ""}>
          <span className="menu-icon"><FaList /></span>
          {isOpen && "Categories"}
        </Link>
      </div>
      
      <div className="menu-item">
        <Link to="/admin/reports" className={location.pathname === "/admin/reports" ? "active" : ""}>
          <span className="menu-icon"><FaChartBar /></span>
          {isOpen && "Reports"}
        </Link>
      </div>
      
      <div className="menu-item">
        <Link to="/admin/settings" className={location.pathname === "/admin/settings" ? "active" : ""}>
          <span className="menu-icon"><FaCog /></span>
          {isOpen && "Settings"}
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
