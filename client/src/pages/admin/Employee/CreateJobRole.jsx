// CreateJobRole.js
import React, { useState } from "react";

const CreateJobRole = () => {
    const [roleName, setRoleName] = useState("");
    const [description, setDescription] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Job Role Created:", { roleName, description });
        // Add API call to save job role
    };

    return (
        <div className="container mt-4">
            <h2>Create Job Role</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Role Name</label>
                    <input type="text" className="form-control" value={roleName} onChange={(e) => setRoleName(e.target.value)} required />
                </div>
                <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea className="form-control" value={description} onChange={(e) => setDescription(e.target.value)} required />
                </div>
                <button type="submit" className="btn btn-primary">Create</button>
            </form>
        </div>
    );
};

export default CreateJobRole;