import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./DeleteVideo.css";
import "bootstrap/dist/css/bootstrap.min.css";

const DeleteVideo = ({ setComponent }) => {
  const [videos, setVideos] = useState([]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const formattedDate = `${date.getDate().toString().padStart(2, "0")}-${(
      date.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}-${date.getFullYear()} | ${date
      .getHours()
      .toString()
      .padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}:${date
      .getSeconds()
      .toString()
      .padStart(2, "0")}`;
    return formattedDate;
  };

  const fetchVideos = () => {
    axios
      .get("http://localhost:3001/videos")
      .then((response) => {
        setVideos(response.data);
      })
      .catch((error) => {
        console.error("Error fetching videos:", error);
      });
  };

  // Function to delete a video
  const deleteVideo = (videoId, videoPath, videoType) => {
    axios
      .post("http://localhost:3001/deleteVideo", {
        videoId,
        videoPath,
        videoType,
      })
      .then((response) => {
        console.log(response.data);
        if (videoType === "premium") {
          alert("1 Premium Video deleted successfully");
        } else {
          alert("1 Standard Video deleted successfully");
        }
        // Fetch videos again after deletion
        fetchVideos();
      })
      .catch((error) => {
        console.error("Error deleting video:", error);
      });
  };

  useEffect(() => {
    fetchVideos(); // Fetch videos when component mounts
  }, []);

  return (
    <div className="delete-video-container">
      <div className="table-container">
        <h3>Delete/Update VIdeos</h3>
        <br />
        <table className="table table-responsive">
          <thead>
            <tr>
              <th>Title</th>
              <th>Type</th>
              <th>Upload Date</th>
              <th>Path</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {videos.map((video) => (
              <tr key={video._id}>
                <td>{video.title}</td>
                <td>{video.videoType}</td>
                <td>{formatDate(video.uploadDate)}</td>
                <td>{video.videoPath}</td>
                <td>
                  <Link
                    to={`/update/${video._id}`}
                    className="btn btn-info btn-sm"
                  >
                    Update
                  </Link>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() =>
                      deleteVideo(video._id, video.videoPath, video.videoType)
                    }
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DeleteVideo;
