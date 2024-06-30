import React from "react";
import "./DefaultPage.css";

const DefaultPage = () => {
  return (
    <div className="default-page">
      <div className="content">
        <br />
        <br />
        <br />
        <br />
        <br />  
        <h1>Welcome to StreamTube Admin Panel</h1>
        <p>
          Explore the controls on the left to manage your videos, upload new
          ones, or delete existing ones. Enjoy the power and simplicity of
          StreamTube!
        </p>
      </div>
      <div className="animation-container">
        <div className="circle"></div>
        <div className="circle"></div>
        <div className="circle"></div>
        <div className="circle"></div>
        <div className="circle"></div>
      </div>
    </div>
  );
};

export default DefaultPage;
