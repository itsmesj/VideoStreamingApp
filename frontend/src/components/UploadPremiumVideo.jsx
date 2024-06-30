import React, { useState } from "react";

const UploadPremiumVideo = () => {
  const [premiumFile, setPremiumFile] = useState(null);

  const uploadPremium = () => {
    // Perform premium upload logic here
    console.log("Uploading premium file:", premiumFile);
    // Reset premiumFile state after upload
    setPremiumFile(null);
  };

  return (
    <div className="d-flex justify-content-center align-items-center file-container upload-container">
      <label htmlFor="premium-file" className="file-input-label">
        {premiumFile ? premiumFile.name : "Select Premium File"}
        <input
          type="file"
          id="premium-file"
          onChange={(e) => setPremiumFile(e.target.files[0])}
          data-file-name=""
        />
      </label>
      <button
        type="button"
        onClick={uploadPremium}
        className="fadeIn"
        disabled={!premiumFile}
      >
        Upload Premium Video
      </button>
    </div>
  );
};

export default UploadPremiumVideo;
