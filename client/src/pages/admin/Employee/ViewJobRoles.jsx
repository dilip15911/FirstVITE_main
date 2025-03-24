// ViewJobRoles.js
import React from "react";

const ViewJobRoles = () => {
    const jobRoles = [
        { id: 1, name: "Software Engineer", description: "Develops software applications" },
        { id: 2, name: "HR Manager", description: "Manages human resources" },
    ];

    return (
        <div className="container mt-4">
            <h2>View Job Roles</h2>
            <ul className="list-group">
                {jobRoles.map((role) => (
                    <li key={role.id} className="list-group-item">
                        <strong>{role.name}</strong>: {role.description}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ViewJobRoles;