/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect, useRef } from "react";
import VideoPlayer from "./VideoPlayer";
import { NavLink, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import clsx from "clsx"; // Import clsx for conditional class management

const PlaylistDetail = ({
  isSidebarOpen,
  isLargeScreen,
}) => {
  const [currentVideo, setCurrentVideo] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);
  const location = useLocation();
  const lecture = location.state?.lecture; // Access the lecture from state safely

  useEffect(() => {
    if (lecture?.videos?.length > 0) {
      setCurrentVideo(lecture.videos[0]);
    }
  }, [lecture]);

  useEffect(() => {
    if (currentVideo && videoRef.current) {
      setIsPlaying(true);
    } else {
      setIsPlaying(false);
    }
  }, [currentVideo]);

  const navigate = useNavigate();
  const handleBackToPlaylist = () => {
    setCurrentVideo(null);
    setIsPlaying(false);
    navigate(-1);
  };

  const handleNextVideo = () => {
    const currentIndex = lecture.videos.findIndex(
      (video) => video.id === currentVideo.id
    );
    if (currentIndex < lecture.videos.length - 1) {
      setCurrentVideo(lecture.videos[currentIndex + 1]);
    }
  };

  const handlePreviousVideo = () => {
    const currentIndex = lecture.videos.findIndex(
      (video) => video.id === currentVideo.id
    );
    if (currentIndex > 0) {
      setCurrentVideo(lecture.videos[currentIndex - 1]);
    }
  };

  // Safe URLs for images and videos
  const safeImageUrl = lecture?.img || "https://via.placeholder.com/150";
  const safeVideoUrl =
    currentVideo?.url || "https://path-to-placeholder-video.mp4";

  return currentVideo ? (
    // Video player with playlist view
    <div
      className={`flex flex-col lg:flex-row gap-6 p-6 bg-gray-900 transition-all ${isSidebarOpen ? (isLargeScreen ? "lg:ml-64" : "") : "ml-0"} relative`} // Ensure parent container has relative positioning
    >
      {/* Back Button */}
      <NavLink
        className={`absolute top-6 left-6 flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-indigo-700 text-white font-semibold rounded-lg shadow-md transition hover:from-indigo-600 z-10 ${
          isLargeScreen ? "lg:flex" : "sm:flex"
        }`}
        onClick={handleBackToPlaylist}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 12H5m7-7l-7 7 7 7"
          />
        </svg>
        <span className="hidden lg:inline-block">Back to Playlist</span>
      </NavLink>

      {/* Video Player Section */}
      <div className="flex-1 bg-gray-800 rounded-lg overflow-hidden shadow-lg">
        <VideoPlayer
          ref={videoRef}
          videoUrl={safeVideoUrl}
          thumbnailUrl={safeImageUrl}
          duration={currentVideo.duration}
          title={currentVideo.title}
          onNext={handleNextVideo}
          onPrevious={handlePreviousVideo}
          isPlaying={isPlaying}
          setIsPlaying={setIsPlaying}
        />
        <div className="mt-4 p-4 bg-gray-900 text-white rounded-lg shadow-md">
          <h2 className="text-xl font-bold">{currentVideo.title}</h2>
          <p className="text-sm text-gray-400">
            Duration: {currentVideo.duration}
          </p>
        </div>
      </div>

      {/* Playlist Section */}
      <div className=" lg:w-1/2.5 bg-gray-100 p-6 rounded-lg shadow-lg overflow-y-auto max-h-[60vh] sm:max-h-[50vh]">
        <h3 className="text-xl font-semibold text-indigo-700 mb-4">
          Videos in Playlist
        </h3>
        <div className="grid grid-cols-1 gap-4">
          {lecture.videos.map((video) => (
            <div
              key={video.id}
              className={clsx(
                "flex items-center gap-4 p-4 bg-white shadow-md rounded-lg hover:shadow-lg transition cursor-pointer",
                { "bg-indigo-100": video.id === currentVideo.id }
              )}
              onClick={() => setCurrentVideo(video)}
            >
              <div
                className="w-24 h-20 rounded-lg"
                style={{
                  backgroundImage: `url(${safeImageUrl})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              ></div>
              <div>
                <h4 className="text-lg font-semibold">{video.title}</h4>
                <p className="text-sm text-gray-500">Duration: {video.duration}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  ) : (
    <div>Loading...</div>
  );
};

export default PlaylistDetail;
