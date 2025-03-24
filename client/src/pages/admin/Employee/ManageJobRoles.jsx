// ManageJobRoles.js
import React from "react";

const ManageJobRoles = () => {
    const jobRoles = [
        { id: 1, name: "Software Engineer", description: "Develops software applications" },
        { id: 2, name: "HR Manager", description: "Manages human resources" },
    ];

    return (
        <div className="container mt-4">
            <h2>Manage Job Roles</h2>
            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Role Name</th>
                        <th>Description</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {jobRoles.map((role) => (
                        <tr key={role.id}>
                            <td>{role.id}</td>
                            <td>{role.name}</td>
                            <td>{role.description}</td>
                            <td>
                                <button className="btn btn-warning btn-sm me-2">Edit</button>
                                <button className="btn btn-danger btn-sm">Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ManageJobRoles;