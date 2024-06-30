import React, { useEffect, useState } from "react";
import axios from "axios";
import PremiumVideoPlayer from "./PremiumVideoPlayer";
import "./Videos.css";
import "./VideoPlayer.css";

const PremiumVideos = () => {
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedVideoTitle, setSelectedVideoTitle] = useState(null);
  const [selectedVideoDescription, setSelectedVideoDescription] =
    useState(null);
  const [selectedVideoUploadDate, setSelectedVideoUploadDate] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState("All"); // New state for selected filter

  useEffect(() => {
    axios
      .get("http://localhost:3001/premVideos")
      .then((response) => {
        setVideos(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching videos:", error);
        setLoading(false);
      });
  }, []);

  const handleWatch = (title) => {
    setLoading(true);
    axios
      .get(`http://localhost:3001/videoByTitle/${title}`)
      .then((response) => {
        setSelectedVideo(response.data.videoPath);
        setSelectedVideoTitle(response.data.title);
        setSelectedVideoDescription(response.data.description);
        setSelectedVideoUploadDate(response.data.uploadDate);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching video details:", error);
        setLoading(false);
      });
  };

  const getTimePassed = (uploadDate) => {
    const now = new Date();
    const upload = new Date(uploadDate);
    const diffInSeconds = (now - upload) / 1000;

    const intervals = [
      { label: "year", seconds: 31536000 },
      { label: "month", seconds: 2592000 },
      { label: "day", seconds: 86400 },
      { label: "hour", seconds: 3600 },
      { label: "minute", seconds: 60 },
    ];

    for (const interval of intervals) {
      const count = Math.floor(diffInSeconds / interval.seconds);
      if (count > 0) {
        return `${count} ${interval.label}${count !== 1 ? "s" : ""} ago`;
      }
    }
    return "Just now";
  };

  const filteredVideos = videos.filter((video) =>
    video.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getFilteredVideos = () => {
    if (selectedFilter === "All") {
      return filteredVideos;
    } else {
      const currentDate = new Date();
      return filteredVideos.filter((video) => {
        const uploadDate = new Date(video.uploadDate);
        switch (selectedFilter) {
          case "Today":
            return uploadDate.toDateString() === currentDate.toDateString();
          case "This Week":
            const weekStart = new Date(
              currentDate.getFullYear(),
              currentDate.getMonth(),
              currentDate.getDate() - currentDate.getDay()
            );
            return uploadDate >= weekStart;
          case "This Month":
            return (
              uploadDate.getMonth() === currentDate.getMonth() &&
              uploadDate.getFullYear() === currentDate.getFullYear()
            );
          case "This Year":
            return uploadDate.getFullYear() === currentDate.getFullYear();
          default:
            return true;
        }
      });
    }
  };

  return (
    <div className="videos-container">
      {selectedVideo ? (
        <div className="video-player">
          <button
            className="btn-back"
            onClick={() => {
              setSelectedVideo(null);
              setSelectedVideoTitle(null);
              setSelectedVideoDescription(null);
              setSelectedVideoUploadDate(null);
            }}
          >
            Back to Videos
          </button>
          <PremiumVideoPlayer videoPath={selectedVideo} />
          <h2>{selectedVideoTitle}</h2>
          <p>{selectedVideoDescription}</p>
          <p>Uploaded {getTimePassed(selectedVideoUploadDate)}</p>
        </div>
      ) : (
        <>
          <h2>Premium Videos</h2>
          <div>
            <label htmlFor="filterSelect">Filter by Upload Date: </label>
            <select
              id="filterSelect"
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
            >
              <option value="All">All</option>
              <option value="Today">Today</option>
              <option value="This Week">This Week</option>
              <option value="This Month">This Month</option>
              <option value="This Year">This Year</option>
            </select>
          </div>
          <center>
            <input
              type="text"
              className="search-bar"
              placeholder="Search videos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </center>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <div className="videos-grid">
              {getFilteredVideos().map((video) => (
                <div key={video._id} className="video-card">
                  <div className="video-thumbnail"></div>
                  <div className="video-title">{video.title}</div>
                  <center>
                    <p className="video-description">{video.description}</p>
                  </center>
                  <button
                    className="btn-primary"
                    onClick={() => handleWatch(video.title)}
                  >
                    Watch
                  </button>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PremiumVideos;
