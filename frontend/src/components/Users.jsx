import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Users.css";
import "bootstrap/dist/css/bootstrap.min.css";

const Users = () => {
  const [data, setData] = useState([]);
  const [viewType, setViewType] = useState("users"); // "users" or "subscriptions"
  const [profileType, setProfileType] = useState("standard");

  const fetchData = async () => {
    try {
      if (viewType === "users") {
        const response = await axios.get(
          `http://localhost:3001/users/${profileType}`
        );
        setData(response.data);
      } else {
        const response = await axios.get(`http://localhost:3001/subscriptions`);
        setData(response.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setData([]); // Reset data in case of error
    }
  };

  useEffect(() => {
    fetchData();
  }, [viewType, profileType]);

  return (
    <div className="users-container">
      <div className="w-100 bg-white rounded p-3 table-responsive">
        <h2>{viewType === "users" ? "Users" : "Subscriptions"}</h2>
        {viewType === "users" && (
          <div className="mb-3">
            <label>
              Select Profile Type:
              <select
                value={profileType}
                onChange={(e) => setProfileType(e.target.value)}
                className="form-select"
              >
                <option value="standard">Standard</option>
                <option value="premium">Premium</option>
              </select>
            </label>
          </div>
        )}
        <table className="table table-striped">
          <thead>
            <tr>
              {viewType === "users" ? (
                <>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Profile Type</th>
                  <th>Gender</th>
                </>
              ) : (
                <>
                  <th>Email</th>
                  <th>Plan (in days)</th>
                  <th>Start Date</th>
                  <th>Expiry Date</th>
                  <th>Amount</th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {Array.isArray(data) && data.length > 0 ? (
              data.map((item, index) => (
                <tr key={index}>
                  {viewType === "users" ? (
                    <>
                      <td>{item.name}</td>
                      <td>{item.email}</td>
                      <td>{item.profileType}</td>
                      <td>{item.gender}</td>
                    </>
                  ) : (
                    <>
                      <td>{item.email}</td>
                      <td>{item.plan}</td>
                      <td>{new Date(item.startDate).toLocaleDateString()}</td>
                      <td>{new Date(item.expiryDate).toLocaleDateString()}</td>
                      <td>{item.amount}</td>
                    </>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={viewType === "users" ? 4 : 5}
                  className="text-center"
                >
                  No data found
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="mb-3">
          <label>
            Select View Type:
            <select
              value={viewType}
              onChange={(e) => setViewType(e.target.value)}
              className="form-select"
            >
              <option value="users">Users</option>
              <option value="subscriptions">Subscriptions</option>
            </select>
          </label>
        </div>
      </div>
    </div>
  );
};

export default Users;
