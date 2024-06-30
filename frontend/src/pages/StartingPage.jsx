import React, { useEffect, useState } from "react";
import "./StartingPage.css";
import Login from "../Login";
import Signup from "../Signup";
import Starter from "../components/Starter";
const StartingPage = () => {
  const [component, setComponent] = useState(null);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const renderComponent = (componentName) => {
    switch (componentName) {
      case "login":
        return <Login setComponent={setComponent} />;
      case "signup":
        return <Signup setComponent={setComponent} />;
      case "starter":
        return <Starter />;
      default:
        return null;
    }
  };
  useEffect(() => {
    setComponent("starter");
  }, []);
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
            <br />
            <div className="sidebar-logo text-white mb-4">
              <span id="logo">Video Streaming App</span>
            </div>
            <br />
            <br />
            <ul className="nav flex-column">
              <li className="nav-item">
                <span
                  className="nav-link text-white"
                  onClick={() => {
                    setComponent("starter");
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
                    setComponent("login");
                    setSidebarVisible(false);
                  }}
                >
                  Login
                </span>
              </li>
              <li className="nav-item">
                <span
                  className="nav-link text-white"
                  onClick={() => {
                    setComponent("signup");
                    setSidebarVisible(false);
                  }}
                >
                  Signup
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
            onClick={() => setSidebarVisible(!sidebarVisible)}
          >
            ☰
          </button>
          <div className="component-container">
            {component && renderComponent(component)}
          </div>
        </main>
      </div>
    </div>
  );
};
export default StartingPage;
