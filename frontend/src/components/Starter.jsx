import React from "react";
import "./Starter.css";

const Starter = () => {
  return (
    <div className="starter-container">
      <div className="starter-content">
        <h1 className="starter-title">Welcome to StreamTube</h1>
        <p className="starter-description">
          Discover, watch, and share your favorite videos with the world.
        </p>
      </div>
      <div className="video-play-container">
        <div className="circle"></div>
      </div>
    </div>
  );
};

export default Starter;
