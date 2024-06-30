import React, { useState } from "react";

const DeletePremiumVideo = () => {
  // Assuming you have a state for storing premiumVideos and selectedPremiumVideo
  const [premiumVideos, setPremiumVideos] = useState([]);
  const [selectedPremiumVideo, setSelectedPremiumVideo] = useState("");

  // Function to handle deletion of premium video
  const deletePremiumVideo = () => {
    // Perform delete logic here
    console.log("Deleting premium video:", selectedPremiumVideo);
    // Optionally, update premiumVideos state after deletion
    setPremiumVideos(
      premiumVideos.filter((video) => video !== selectedPremiumVideo)
    );
    // Reset selected premium video state after deletion
    setSelectedPremiumVideo("");
  };

  return (
    <div className="d-flex justify-content-center align-items-center delete-container">
      <label htmlFor="delete-premium-video">
        Select premium video to delete:
      </label>
      <select
        id="delete-premium-video"
        onChange={(e) => setSelectedPremiumVideo(e.target.value)}
        className="fadeIn"
        value={selectedPremiumVideo}
      >
        <option value="">-- Select a premium video --</option>
        {premiumVideos.map((video) => (
          <option key={video} value={video}>
            {video}
          </option>
        ))}
      </select>
      <button
        type="button"
        onClick={deletePremiumVideo}
        className="fadeIn"
        disabled={!selectedPremiumVideo}
      >
        Delete Premium Video
      </button>
    </div>
  );
};

export default DeletePremiumVideo;
