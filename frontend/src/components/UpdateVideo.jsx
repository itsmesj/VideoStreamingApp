import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const UpdateVideo = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:3001/getVideo/" + id)
      .then((result) => {
        console.log(result);
        setTitle(result.data.title);
        setDescription(result.data.description);
      })
      .catch((err) => console.log(err));
  }, [id]);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateInputs()) {
      return;
    }
    axios
      .post("http://localhost:3001/updateVideo/" + id, { title, description })
      .then((result) => {
        console.log(result);
        alert("Video details updated");
        navigate("/admin/");
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="d-flex vh-100 bg-primary justify-content-center align-items-center">
      <div className="w-50 bg-white rounded p-3">
        <form onSubmit={handleSubmit}>
          <h2>Update Video Details</h2>
          {errorMessage && (
            <div className="alert alert-danger">{errorMessage}</div>
          )}
          <div className="mb-2">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              className="form-control"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setErrorMessage(""); // Clear error message when input changes
              }}
            />
          </div>
          <div className="mb-2">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              className="form-control"
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                setErrorMessage(""); // Clear error message when input changes
              }}
            />
          </div>
          <button className="btn btn-success">Update</button>
        </form>
      </div>
    </div>
  );
};

export default UpdateVideo;
