// AdminPage.jsx
import React, { useState, useEffect } from "react";
import UploadVideo from "../components/UploadVideo";
import DeleteVideo from "../components/DeleteVideo";
import UpdateVideo from "../components/UpdateVideo";
import DefaultPage from "../components/DefaultPage";
import Users from "../components/Users";
import Finance from "../components/Finance";
import "./AdminPage.css";
import { useNavigate } from "react-router-dom";
const AdminPage = () => {
  const [component, setComponent] = useState(null);
  const [sidebarVisible, setSidebarVisible] = useState(false); // State to manage sidebar visibility
  const navigate = useNavigate();
  const renderComponent = (componentName) => {
    switch (componentName) {
      case "UploadVideo":
        return <UploadVideo />;
      case "DeleteVideo":
        return <DeleteVideo />;
      case "UpdateVideo":
        return <UpdateVideo setComponent={setComponent} />;
      case "DefaultPage":
        return <DefaultPage />;
      case "finance":
        return <Finance />;
      case "users":
        return <Users />;
      default:
        return null;
    }
  };
  useEffect(() => {
    // Set the default component when the component mounts
    setComponent("DefaultPage");
  }, []);

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible); // Toggle sidebar visibility
  };
  return (
    <div className="container-fluid">
      <div className="row">
        <nav
          className={`col-md-3 col-lg-2 d-md-block bg-dark sidebar ${
            sidebarVisible ? "visible" : ""
          }`}
        >
          <br />
          <br />
          <div className="sidebar-sticky">
            <div className="sidebar-logo text-white mb-4">
              <span id="logo">StreamTube</span>
            </div>
            <br />
            <div className="sidebar-logo text-white mb-4">
              <span id="logo-admin" onClick={() => setComponent("DefaultPage")}>
                Admin Controls
              </span>
            </div>
            <br />
            <ul className="nav flex-column">
              <li className="nav-item">
                <span
                  className="nav-link text-white"
                  onClick={() => {
                    setComponent("DefaultPage");
                    setSidebarVisible(false);
                  }}
                >
                  Home
                </span>
              </li>
              <li className="nav-item">
                <span
                  className="nav-link text-white"
                  onClick={() => {
                    setComponent("UploadVideo");
                    setSidebarVisible(false);
                  }}
                >
                  Upload Video
                </span>
              </li>
              <li className="nav-item">
                <span
                  className="nav-link text-white"
                  onClick={() => {
                    setComponent("DeleteVideo");
                    setSidebarVisible(false);
                  }}
                >
                  Delete Video
                </span>
              </li>
              <li className="nav-item">
                <span
                  className="nav-link text-white"
                  onClick={() => {
                    setComponent("finance");
                    setSidebarVisible(false);
                  }}
                >
                  Finance
                </span>
              </li>
              <li className="nav-item">
                <span
                  className="nav-link text-white"
                  onClick={() => {
                    setComponent("users");
                    setSidebarVisible(false);
                  }}
                >
                  Users
                </span>
              </li>
              <li className="nav-item">
                <span
                  className="nav-link text-white"
                  onClick={() => {
                    alert("Logout Successful");
                    navigate("/");
                  }}
                >
                  Logout
                </span>
              </li>
            </ul>
          </div>
        </nav>
        <main
          role="main"
          className="col-md-9 ml-sm-auto col-lg-10 px-4 main-content"
        >
          <button
            className="btn btn-dark menu-button d-md-none"
            onClick={toggleSidebar}
          >
            {sidebarVisible ? "☰" : "☰"}
          </button>
          <div className="component-container">
            {component && renderComponent(component)}
          </div>
        </main>
      </div>
    </div>
  );
};
export default AdminPage;
