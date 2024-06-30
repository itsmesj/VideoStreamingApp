import React, { useState, useEffect } from "react";
import axios from "axios";
import "./UploadVideo.css";
import "bootstrap/dist/css/bootstrap.min.css";

const UploadVideo = () => {
  const [file, setFile] = useState(null);
  const [isPremium, setIsPremium] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [existingFilenames, setExistingFilenames] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:3001/videoFilenames")
      .then((result) => {
        setExistingFilenames(result.data);
      })
      .catch((err) => console.log(err));
  }, []);

  const validateInputs = () => {
    if (title.length < 2) {
      setErrorMessage("Title must be at least 2 characters long.");
      return false;
    }
    if (description.length < 10) {
      setErrorMessage("Description must be at least 10 characters long.");
      return false;
    }
    return true;
  };

  const upload = () => {
    if (!validateInputs()) {
      return;
    }

    if (existingFilenames.includes(file.name)) {
      setErrorMessage("Video with this filename already exists!");
      return;
    }

    const vidType = isPremium ? "premium" : "standard";
    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("videoType", vidType);

    const uploadUrl =
      vidType === "standard"
        ? "http://localhost:3001/upload"
        : "http://localhost:3001/uploadPremiumVideo";

    axios
      .post(uploadUrl, formData)
      .then((res) => {
        console.log(res.data);
        alert(
          `${
            vidType === "standard" ? "Standard" : "Premium"
          } Video uploaded successfully!`
        );
        resetForm();
        setErrorMessage(""); // Clear the error message after successful upload
      })
      .catch((err) => {
        console.error(err);
        alert("Error uploading video. Please try again.");
      });
  };

  const resetForm = () => {
    setFile(null);
    setIsPremium(false);
    setTitle("");
    setDescription("");
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setErrorMessage(""); // Clear any existing error messages when a new file is selected
  };

  return (
    <div className="upload-video-container">
      <div className="form-container">
        <form>
          <h2>Upload Video</h2>
          <br />
          {errorMessage && (
            <div className="alert alert-danger">{errorMessage}</div>
          )}
          <div className="mb-2">
            <label htmlFor="title">Video Title</label>
            <input
              type="text"
              id="title"
              placeholder="Enter Video Title"
              className="form-control"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="mb-2">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              placeholder="Enter Description"
              className="form-control"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>
          <div className="mb-2">
            <label htmlFor="videoType">Video Type</label>
            <div>
              <label className="mr-3">
                <input
                  type="checkbox"
                  checked={isPremium}
                  onChange={() => setIsPremium(!isPremium)}
                />
                Premium Video
              </label>
            </div>
          </div>
          <label htmlFor="file" className="file-input-label">
            {file ? file.name : "Select File"}
            <input
              type="file"
              id="file"
              onChange={handleFileChange}
              className="form-control-file"
            />
          </label>
          <br />
          <center>
            <button
              type="button"
              onClick={upload}
              className="btn btn-info fadeIn"
              disabled={!file || !title || !description}
            >
              Upload Video
            </button>
          </center>
        </form>
      </div>
    </div>
  );
};

export default UploadVideo;
