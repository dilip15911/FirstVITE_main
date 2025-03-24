import { Link, useLocation } from "react-router-dom";
import { FaUserGraduate, FaBook, FaBars } from "react-icons/fa";
import { useState } from "react";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`h-screen bg-gray-800 text-white ${isOpen ? "w-64" : "w-20"} transition-all duration-300`}> 
      <div className="p-4 flex items-center justify-between">
        <span className="text-xl font-bold">{isOpen ? "Admin Panel" : ""}</span>
        <button onClick={toggleSidebar} className="text-white focus:outline-none">
          <FaBars size={24} />
        </button>
      </div>
      <nav className="mt-5">
        <ul>
          <li>
            <Link
              to="/admin/students"
              className={`flex items-center p-3 hover:bg-gray-700 ${location.pathname === "/admin/students" ? "bg-gray-700" : ""}`}
            >
              <FaUserGraduate size={20} className="mr-3" />
              {isOpen && "Students"}
            </Link>
          </li>
          <li>
            <Link
              to="/admin/courses"
              className={`flex items-center p-3 hover:bg-gray-700 ${location.pathname === "/admin/courses" ? "bg-gray-700" : ""}`}
            >
              <FaBook size={20} className="mr-3" />
              {isOpen && "Courses"}
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
