import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Home.css"; // Import the CSS file for custom styling
import Subscribe from "./components/Subscribe";
import Profile from "./components/Profile"; // Import the Profile component
import Videos from "./components/Videos";
import PremiumVideos from "./components/PremiumVideos";
import UserStarter from "./components/UserStarter";
import VideoPlayer from "./components/VideoPlayer";
import axios from "axios";

const Home = () => {
  const [component, setComponent] = useState(null);
  const [profileType, setProfileType] = useState(null);
  const [sidebarVisible, setSidebarVisible] = useState(false); // State to manage sidebar visibility
  const navigate = useNavigate();
  const location = useLocation();
  const { email } = location.state || {};

  useEffect(() => {
    setComponent("videos");

    if (email) {
      axios
        .get(`http://localhost:3001/user/${email}`)
        .then((response) => {
          setProfileType(response.data.profileType);
        })
        .catch((error) => {
          console.error("Error fetching user profile:", error);
        });
    }
  }, [email]);

  const renderComponent = (componentName) => {
    switch (componentName) {
      case "subscribe":
        return <Subscribe email={email} />;
      case "starter":
        return <UserStarter />;
      case "videos":
        return <Videos />;
      case "premium":
        return <PremiumVideos />;
      case "profile":
        return <Profile email={email} />; // Pass email to Profile component
      default:
        return null;
    }
  };

  const handlePremiumClick = () => {
    if (profileType === "standard") {
      setComponent("subscribe");
    } else {
      setComponent("premium");
    }
  };

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
            <br />
            <ul className="nav flex-column">
              <li className="nav-item">
                <span
                  className="nav-link text-white"
                  onClick={() => {
                    setComponent("videos");
                    setSidebarVisible(false);
                  }}
                >
                  Videos
                </span>
              </li>
              <li className="nav-item">
                <span
                  className="nav-link text-white"
                  onClick={() => {
                    handlePremiumClick();
                    setSidebarVisible(false);
                  }}
                >
                  Premium Videos
                </span>
              </li>
              <li className="nav-item">
                <span
                  className="nav-link text-white"
                  onClick={() => {
                    setComponent("profile");
                    setSidebarVisible(false);
                  }}
                >
                  Profile
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

export default Home;
