import React from "react";
import Sidebar from "./AdminSidebar/sidebar";
import { Outlet } from "react-router-dom";
import ScrollToTop from "../../components/ScrollToTop";

const AdminLayout = () => {
    return (
        <div className="d-flex">
            <Sidebar />

            <div className="p-4 flex-grow-1" style={{ width: "100%" }}>
                <ScrollToTop />
                <Outlet />
            </div>
        </div>
    );
};

export default AdminLayout;
