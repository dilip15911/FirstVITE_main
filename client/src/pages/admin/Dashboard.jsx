import React from "react";
import { FaUser, FaCalendarCheck, FaTasks, FaChartLine, FaCog } from "react-icons/fa";

const Dashboard = () => {
    const employee = {
        name: "John Doe",
        email: "johndoe@example.com",
        role: "Administrator",
        lastLogin: "March 24, 2025",
    };

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Admin Dashboard</h2>

            {/* Employee Profile */}
            <div className="card p-3 mb-4">
                <h4><FaUser className="me-2" /> Employee Details</h4>
                <p><strong>Name:</strong> {employee.name}</p>
                <p><strong>Email:</strong> {employee.email}</p>
                <p><strong>Role:</strong> {employee.role}</p>
                <p><strong>Last Login:</strong> {employee.lastLogin}</p>
            </div>

            {/* Quick Actions */}
            <div className="row">
                <div className="col-md-4">
                    <div className="card text-center p-3 mb-3 bg-primary text-white">
                        <FaCalendarCheck size={30} className="mb-2" />
                        <h5>Attendance</h5>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card text-center p-3 mb-3 bg-success text-white">
                        <FaTasks size={30} className="mb-2" />
                        <h5>Manage Tasks</h5>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card text-center p-3 mb-3 bg-warning text-white">
                        <FaChartLine size={30} className="mb-2" />
                        <h5>Reports</h5>
                    </div>
                </div>
            </div>

            {/* Settings */}
            <div className="card text-center p-3 mt-3 bg-secondary text-white">
                <FaCog size={30} className="mb-2" />
                <h5>Settings</h5>
            </div>
        </div>
    );
};

export default Dashboard;
