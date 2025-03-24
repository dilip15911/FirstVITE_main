import React, { useEffect, useState, useCallback } from "react";
import { faTrash, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../../App.css";

export default function Home() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch all users (Memoized to prevent re-renders)
  const getAllUser = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/users?search=${searchQuery}`, {
        method: "GET",
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const responseData = await response.json();
      console.log(responseData, "userData");
      setData(responseData.data || []);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to fetch user data');
      setData([]);
      setLoading(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    getAllUser();
  }, [getAllUser]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p>{error}</p>
      </div>
    );
  }

  // Logout function
  const logOut = () => {
    window.localStorage.clear();
    window.location.href = "/login";
  };

  async function deleteUser(id, name) {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/deleteUser`, {
          method: "POST",
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            "Content-Type": "application/json",
            Accept: "application/json",
            "Access-Control-Allow-Origin": "*",
          },
          body: JSON.stringify({
            userid: id,
          }),
        });
        
        if (!response.ok) {
          throw new Error('Failed to delete user');
        }

        const data = await response.json();
        alert(data.data);
        getAllUser();
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Failed to delete user');
      }
    }
  }

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="auth-wrapper" style={{ height: "auto", marginTop: 50 }}>
      <div className="auth-inner" style={{ width: "fit-content" }}>
        <h3>Welcome Admin</h3>
        <div style={{ position: "relative", marginBottom: 10 }}>
          <FontAwesomeIcon
            icon={faSearch}
            style={{ position: "absolute", left: 10, top: 13, color: "black" }}
          />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearch}
            style={{
              padding: "8px 32px 8px 32px",
              borderRadius: "4px",
              border: "1px solid #ccc",
              width: "100%",
              boxSizing: "border-box",
            }}
          />
          <span
            style={{ position: "absolute", right: 10, top: 8, color: "#aaa" }}
          >
            {searchQuery.length > 0
              ? `Records Found ${data.length}`
              : `Total Records ${data.length}`}
          </span>
        </div>

        <table style={{ width: 700 }}>
          <thead>
            <tr style={{ textAlign: "center" }}>
              <th>Name</th>
              <th>Email</th>
              <th>User Type</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {data.map((i, index) => (
              <tr key={index} style={{ textAlign: "center" }}>
                <td>{i.fname}</td>
                <td>{i.email}</td>
                <td>{i.userType}</td>
                <td>
                  <FontAwesomeIcon
                    icon={faTrash}
                    onClick={() => deleteUser(i._id, i.fname)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <button
          onClick={logOut}
          className="btn btn-primary"
          style={{ marginTop: 10 }}
        >
          Log Out
        </button>
      </div>
    </div>
  );
}
