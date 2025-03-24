import React, { useEffect, useState } from "react";
import { faTrash, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Home() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const getAllUser = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/users?search=${searchQuery}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }

      const responseData = await response.json();
      setData(responseData.data || []);
    } catch (err) {
      setError("Failed to fetch user data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllUser();
  }, [searchQuery]);

  const logOut = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  const deleteUser = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/deleteUser`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ userid: id }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to delete user");
        }

        const result = await response.json();
        alert(result.data);
        getAllUser();
      } catch (error) {
        alert("Failed to delete user");
      }
    }
  };

  return (
    <div className="container mt-5">
      <div className="card p-4 shadow">
        <h3 className="mb-4">Welcome Admin</h3>

        {/* Search Input */}
        <div className="input-group mb-3">
          <span className="input-group-text">
            <FontAwesomeIcon icon={faSearch} />
          </span>
          <input
            type="text"
            className="form-control"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Loading and Error Handling */}
        {loading && <p className="text-center">Loading users...</p>}
        {error && <p className="text-danger text-center">{error}</p>}

        {/* User Table */}
        {!loading && !error && (
          <div className="table-responsive">
            <table className="table table-bordered table-hover text-center">
              <thead className="table-dark">
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>User Type</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {data.length > 0 ? (
                  data.map((user, index) => (
                    <tr key={index}>
                      <td>{user.fname}</td>
                      <td>{user.email}</td>
                      <td>{user.userType}</td>
                      <td>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => deleteUser(user._id, user.fname)}
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4">No users found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Logout Button */}
        <button onClick={logOut} className="btn btn-primary mt-3">
          Log Out
        </button>
      </div>
    </div>
  );
}
