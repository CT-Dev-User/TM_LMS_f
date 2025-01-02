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
  const [controlsVisible, setControlsVisible] = useState(true); // New state for controls visibility

  useEffect(() => {
    if (lecture?.videos?.length > 0) {
      setCurrentVideo(lecture.videos[0]);
    }
  }, [lecture]);

  useEffect(() => {
    if (currentVideo && videoRef.current) {
      setIsPlaying(true);
      // Hide controls after a delay if video starts playing
      if (videoRef.current.currentTime > 0) {
        setTimeout(() => {
          setControlsVisible(false);
        }, 3000); // Hide controls after 3 seconds
      } else {
        setControlsVisible(true); // Show controls if video is paused or just started
      }
    } else {
      setIsPlaying(false);
      setControlsVisible(true); // Always show controls when no video is playing
    }
  }, [currentVideo]);

  const navigate = useNavigate();
  const handleBackToPlaylist = () => {
    setCurrentVideo(null);
    setIsPlaying(false);
    navigate(-1);
  };
  // Disable right-click and developer tools
  // useEffect(() => {
  //   const disableRightClick = (e) => {
  //     e.preventDefault();
  //   };

  //   const blockDevToolsShortcuts = (e) => {
  //     // Disable F12, Ctrl+Shift+I, and Ctrl+Shift+J
  //     if (
  //       (e.key === "F12") ||
  //       (e.ctrlKey && e.shiftKey && (e.key === "I" || e.key === "J"))
  //     ) {
  //       e.preventDefault();
  //     }
  //   };

  //   // Disable right-click
  //   document.addEventListener("contextmenu", disableRightClick);

  //   // Block developer tools shortcuts
  //   document.addEventListener("keydown", blockDevToolsShortcuts);

  //   // Cleanup listeners when component is unmounted
  //   return () => {
  //     document.removeEventListener("contextmenu", disableRightClick);
  //     document.removeEventListener("keydown", blockDevToolsShortcuts);
  //   };
  // }, []);
  
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

  // Show controls on mouse movement
  const handleMouseMove = () => {
    setControlsVisible(true);
    clearTimeout(); // Clear any existing timeout for hiding controls
    if (isPlaying) {
      setTimeout(() => {
        setControlsVisible(false);
      }, 3000); // Re-hide controls after 3 seconds if playing
    }
  };

  // Safe URLs for images and videos
  const safeImageUrl = lecture?.img || "https://via.placeholder.com/150";
  const safeVideoUrl =
    currentVideo?.url || "https://path-to-placeholder-video.mp4";

  return currentVideo ? (
    <div
      className={`flex flex-col lg:flex-row gap-6 p-6 bg-gray-900 transition-all ${isSidebarOpen ? (isLargeScreen ? "lg:ml-64" : "") : "ml-0"} relative`}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setControlsVisible(false)} // Hide controls when mouse leaves
    >
      {/* Back Button */}
      <NavLink
        className={`absolute top-6 left-6 flex items-center gap-2 px-2 py-2 bg-gradient-to-r text-white font-semibold rounded-lg shadow-md transition hover:from-indigo-600 z-10 ${isLargeScreen ? "lg:flex" : "sm:flex"} ${controlsVisible ? 'opacity-100' : 'opacity-0'}`}
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
        <div className="p-4 bg-gray-900 text-white rounded-lg shadow-md">
          <h2 className="text-xl font-bold">{currentVideo.title}</h2>
          <p className="text-sm text-gray-400">
            Duration: {currentVideo.duration}
          </p>
        </div>
      </div>

      {/* Playlist Section */}
      <div className="bg-gray-100 p-4 rounded-lg shadow-lg overflow-y-auto max-h-[60vh] sm:max-h-[50vh]">
        <h3 className="text-xl font-semibold text-indigo-700 mb-4 text-center">
          Videos in Playlist
        </h3>
        <div className="space-y-3">
          {lecture.videos.map((video) => (
            <div
              key={video.id}
              className={clsx(
                "flex items-center gap-3 p-3 bg-white shadow-md rounded-lg transition cursor-pointer",
                "hover:shadow-lg hover:bg-indigo-50",
                {
                  "relative after:absolute after:inset-0 after:bg-black after:opacity-20 after:rounded-lg": video.id === currentVideo.id,
                }
              )}
              onClick={() => setCurrentVideo(video)}
            >
              {/* Show image only on larger screens */}
              <div className="hidden sm:block w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden"
                style={{
                  backgroundImage: `url(${safeImageUrl})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              ></div>
              {/* Text for title and duration */}
              <div className="flex-1">
                <h4 className="text-base sm:text-lg font-semibold overflow-hidden break-words">{video.title}</h4>
                <p className="text-xs sm:text-sm text-gray-500">Duration: {video.duration}</p>
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