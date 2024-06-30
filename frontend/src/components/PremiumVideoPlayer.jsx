import React, { useRef, useEffect } from "react";
import "./VideoPlayer.css";

const PremiumVideoPlayer = ({ videoPath }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.removeAttribute("src");
      videoRef.current.load();
    }
  }, [videoPath]);

  return (
    <div className="video-container">
      <video ref={videoRef} controls autoPlay>
        <source
          src={`http://localhost:3001/premiumvideos/${videoPath}`}
          type="video/mp4"
        />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default PremiumVideoPlayer;
