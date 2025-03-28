import React, { useState, useEffect } from "react";
import Sidebar from "./AdminSidebar/sidebar";
import { Outlet } from "react-router-dom";
import ScrollToTop from "../../components/ScrollToTop";
import { FaSearch, FaBell, FaEnvelope, FaCog, FaSignOutAlt, FaUser } from "react-icons/fa";
import "../../styles/adminTheme.css";

const AdminLayout = () => {
    const [sidebarExpanded, setSidebarExpanded] = useState(true);
    const [notifications, setNotifications] = useState([]);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        // Handle responsive behavior
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setSidebarExpanded(false);
            } else {
                setSidebarExpanded(true);
            }
        };

        // Initial check
        handleResize();

        // Add event listener
        window.addEventListener("resize", handleResize);

        // Clean up
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Mock notifications data
    useEffect(() => {
        setNotifications([
            { id: 1, type: "message", content: "New message from John Doe", time: "5 min ago" },
            { id: 2, type: "alert", content: "System update scheduled", time: "1 hour ago" },
            { id: 3, type: "info", content: "New course published", time: "2 hours ago" }
        ]);
    }, []);

    const toggleSidebar = () => {
        setSidebarExpanded(!sidebarExpanded);
    };

    const toggleUserMenu = () => {
        setUserMenuOpen(!userMenuOpen);
    };

    return (
        <div className="admin-layout">
            {/* Sidebar */}
            <div className={`admin-sidebar ${sidebarExpanded ? "expanded" : "collapsed"}`}>
                <div className="sidebar-header">
                    <div className="sidebar-logo">
                        {sidebarExpanded && <span className="fs-4 fw-bold">FirstVITE</span>}
                    </div>
                    <button className="sidebar-toggle" onClick={toggleSidebar}>
                        <FaSearch size={16} />
                    </button>
                </div>
                <Sidebar isOpen={sidebarExpanded} toggleSidebar={toggleSidebar} />
            </div>

            {/* Main Content */}
            <div className={`admin-content ${!sidebarExpanded ? "sidebar-collapsed" : ""}`}>
                {/* Header */}
                <div className={`admin-header ${!sidebarExpanded ? "sidebar-collapsed" : ""}`}>
                    <div className="header-search">
                        <span className="header-search-icon">
                            <FaSearch size={14} />
                        </span>
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="header-actions">
                        <button className="header-icon-btn">
                            <FaBell size={18} />
                            {notifications.length > 0 && (
                                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                    {notifications.length}
                                </span>
                            )}
                        </button>
                        <button className="header-icon-btn">
                            <FaEnvelope size={18} />
                        </button>
                        <button className="header-icon-btn">
                            <FaCog size={18} />
                        </button>

                        <div className="header-user" onClick={toggleUserMenu}>
                            <div className="header-user-avatar">
                                A
                            </div>
                            {sidebarExpanded && (
                                <div className="header-user-info">
                                    <div className="header-user-name">Admin User</div>
                                    <div className="header-user-role">Administrator</div>
                                </div>
                            )}
                            {userMenuOpen && (
                                <div className="position-absolute top-100 end-0 mt-2 bg-white rounded shadow-sm" style={{ width: "200px", zIndex: 1000 }}>
                                    <div className="py-2 px-3 border-bottom">
                                        <div className="fw-bold">Admin User</div>
                                        <div className="small text-muted">admin@firstvite.com</div>
                                    </div>
                                    <div className="py-1">
                                        <a href="#profile" className="dropdown-item py-2 px-3 d-flex align-items-center">
                                            <FaUser className="me-2" size={14} /> Profile
                                        </a>
                                        <a href="#settings" className="dropdown-item py-2 px-3 d-flex align-items-center">
                                            <FaCog className="me-2" size={14} /> Settings
                                        </a>
                                        <div className="dropdown-divider"></div>
                                        <a href="#logout" className="dropdown-item py-2 px-3 d-flex align-items-center text-danger">
                                            <FaSignOutAlt className="me-2" size={14} /> Logout
                                        </a>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Page Content */}
                <div className="admin-page-content">
                    <ScrollToTop />
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default AdminLayout;
