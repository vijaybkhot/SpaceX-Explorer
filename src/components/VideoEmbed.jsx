"use client";
import React from "react";
const VideoEmbed = ({ videoId }) => {
  if (!videoId) {
    return <p className="video-error">Invalid video URL</p>;
  }

  const embedUrl = `https://www.youtube.com/embed/${videoId}`;

  return (
    <div className="video-wrapper">
      <iframe
        className="video-frame"
        src={embedUrl}
        title="Launch Video"
        allowFullScreen
      ></iframe>
    </div>
  );
};

export default VideoEmbed;
