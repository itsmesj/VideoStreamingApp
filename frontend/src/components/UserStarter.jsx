import React from "react";
import "./UserStarter.css"; // Import CSS for styling

const UserStarter = () => {
  return (
    <div className="user-starter-container">
      <div className="user-starter-content">
        <h2 className="user-starter-title">Welcome to Your Dashboard!</h2>
        <p className="user-starter-description">
          Your journey begins here. Sit back, relax, and explore the endless
          possibilities awaiting you.
        </p>
        {/* Add more interactive elements as needed */}
      </div>
    </div>
  );
};

export default UserStarter;
