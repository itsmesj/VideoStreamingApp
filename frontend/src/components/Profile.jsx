import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Profile.css"; // Import CSS for styling
import { useNavigate } from "react-router-dom";

const Profile = ({ email }) => {
  const [userDetails, setUserDetails] = useState({});
  const [isEditingName, setIsEditingName] = useState(false); // State to track if name editing is enabled
  const [newName, setNewName] = useState(""); // State to hold the new name
  const [nameError, setNameError] = useState(""); // State to hold the name validation error
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`http://localhost:3001/user/${email}`)
      .then((response) => {
        setUserDetails(response.data);
      })
      .catch((error) => {
        console.error("Error fetching user details:", error);
      });
  }, [email]);

  const handleDeleteProfile = () => {
    axios
      .delete(`http://localhost:3001/user/${email}`)
      .then((response) => {
        alert(response.data.message);
        navigate("/");
      })
      .catch((error) => {
        console.error("Error deleting user profile:", error);
        alert(
          "An error occurred while deleting your profile. Please try again."
        );
      });
  };

  const handleNameChange = () => {
    setIsEditingName(true);
  };

  const validateName = () => {
    const nameRegex = /^[a-zA-Z]{3,}$/;
    if (!nameRegex.test(newName)) {
      setNameError(
        "Name must contain at least 3 alphabetic characters and no special characters or digits."
      );
      return false;
    }
    return true;
  };

  const handleSaveName = () => {
    // Validate name
    if (!validateName()) {
      return;
    }
    // Call API to update the name
    axios
      .post(`http://localhost:3001/updateName/${email}`, { newName })
      .then((response) => {
        alert("Name updated successfully!");
        setUserDetails((prevDetails) => ({
          ...prevDetails,
          name: response.data.name,
        }));
        setIsEditingName(false); // Disable name editing mode
        setNameError(""); // Clear name validation error
      })
      .catch((error) => {
        console.error("Error updating user name:", error);
        alert("An error occurred while updating your name. Please try again.");
      });
  };

  const handleCancelNameEdit = () => {
    setIsEditingName(false); // Disable name editing mode
    setNewName(""); // Clear the new name input
    setNameError(""); // Clear name validation error
  };

  return (
    <div className="profile-container">
      <h2>User Profile</h2>
      <div className="profile-details">
        <p>
          <strong>Email:</strong> {email}
        </p>
        <p>
          <strong>Name:</strong>{" "}
          {isEditingName ? (
            <>
              <input
                type="text"
                value={newName}
                onChange={(e) => {
                  setNewName(e.target.value);
                  setNameError(""); // Clear name validation error when input changes
                }}
              />
              {nameError && <div className="error">{nameError}</div>}
            </>
          ) : (
            userDetails.name
          )}
        </p>
        <p>
          <strong>Gender:</strong> {userDetails.gender}
        </p>
        <p>
          <strong>Profile Type:</strong> {userDetails.profileType}
        </p>
      </div>
      {!isEditingName && (
        <button className="btn btn-info" onClick={handleNameChange}>
          Edit Name
        </button>
      )}
      {isEditingName && (
        <>
          <button className="btn btn-success" onClick={handleSaveName}>
            Save Name
          </button>
          <button className="btn btn-danger" onClick={handleCancelNameEdit}>
            Cancel
          </button>
        </>
      )}
      <button className="btn btn-warning" onClick={() => navigate("/")}>
        Logout
      </button>
      <button className="btn btn-danger" onClick={handleDeleteProfile}>
        Delete Profile
      </button>
    </div>
  );
};

export default Profile;
