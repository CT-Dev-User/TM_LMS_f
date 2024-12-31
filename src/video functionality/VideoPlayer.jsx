/* eslint-disable react/no-unknown-property */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useRef, useState, useEffect } from "react";
import {
  FaPlay,
  FaPause,
  FaStepBackward,
  FaStepForward,
  FaExpand,
  FaVolumeMute,
  FaVolumeUp,
} from "react-icons/fa";

export default function VideoPlayer({
  videoUrl,
  thumbnailUrl,
  onNext,
  onPrevious,
  title,
  nextVideoTitle,
  nextVideoDuration,
}) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPipActive, setIsPipActive] = useState(false);
  const [isMounted, setIsMounted] = useState(true);
  const [currentTime, setCurrentTime] = useState("0:00");
  const [controlsVisible, setControlsVisible] = useState(true);
  const [duration, setDuration] = useState("0:00"); // New state for duration
    
  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false); // Cleanup on unmount
  }, []);

  // Reset video playback when videoUrl changes, including error state
  useEffect(() => {
    if (videoRef.current && isMounted) {
      videoRef.current.pause();
      videoRef.current.load(); // Reload the video
      setIsPlaying(false);
      setProgress(0);
      setCurrentTime("0:00");
      setVideoError(false);
      setControlsVisible(true);
      // Reset duration as well since it's calculated for each video
      setDuration("0:00");
    }
  }, [videoUrl, isMounted]);

  // Handle fullscreen state changes
  useEffect(() => {
    if (isMounted) {
      const handleFullscreenChange = () => {
        setIsFullscreen(!!document.fullscreenElement);
      };
      document.addEventListener("fullscreenchange", handleFullscreenChange);
      return () => {
        if (isMounted) {
          document.removeEventListener(
            "fullscreenchange",
            handleFullscreenChange
          );
        }
      };
    }
  }, [isMounted]);

  // Handle PIP state changes
  useEffect(() => {
    if (videoRef.current && isMounted) {
      const handlePipChange = () => {
        setIsPipActive(!!document.pictureInPictureElement);
      };

      videoRef.current.addEventListener(
        "enterpictureinpicture",
        handlePipChange
      );
      videoRef.current.addEventListener(
        "leavepictureinpicture",
        handlePipChange
      );

      return () => {
        if (videoRef.current && isMounted) {
          videoRef.current.removeEventListener(
            "enterpictureinpicture",
            handlePipChange
          );
          videoRef.current.removeEventListener(
            "leavepictureinpicture",
            handlePipChange
          );
        }
      };
    }
  }, [isMounted]);

  // Hide controls after 3 seconds of inactivity if playing
  useEffect(() => {
    let timer;
    if (isPlaying && isMounted) {
      timer = setTimeout(() => {
        setControlsVisible(false);
      }, 3000);
    } else {
      // If video is not playing, keep controls visible
      setControlsVisible(true);
    }
    return () => {
      clearTimeout(timer);
    };
  }, [isPlaying, isMounted]);

  // Calculate and set duration when video metadata is loaded
  useEffect(() => {
    if (videoRef.current && isMounted) {
      const handleLoadedMetadata = () => {
        if (videoRef.current.duration !== Infinity) {
          const minutes = Math.floor(videoRef.current.duration / 60);
          const seconds = Math.floor(videoRef.current.duration % 60);
          setDuration(`${minutes}:${seconds < 10 ? "0" + seconds : seconds}`);
        }
      };

      videoRef.current.addEventListener("loadedmetadata", handleLoadedMetadata);
      return () => {
        if (videoRef.current) {
          videoRef.current.removeEventListener(
            "loadedmetadata",
            handleLoadedMetadata
          );
        }
      };
    }
  }, [videoUrl, isMounted]);

  const handlePlayPause = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
    setControlsVisible(true); // Show controls on play/pause
  };

  const handleFullscreen = () => {
    if (!videoRef.current) return;
    if (videoRef.current.requestFullscreen) {
      videoRef.current.requestFullscreen();
    } else if (videoRef.current.webkitRequestFullscreen) {
      videoRef.current.webkitRequestFullscreen();
    } else if (videoRef.current.msRequestFullscreen) {
      videoRef.current.msRequestFullscreen();
    }
    setControlsVisible(true); // Show controls on fullscreen toggle
  };

  const handleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
    setControlsVisible(true); // Show controls on mute/unmute
  };

  const handleProgress = () => {
    if (!videoRef.current) return;
    const progressPercentage =
      (videoRef.current.currentTime / videoRef.current.duration) * 100;
    setProgress(progressPercentage);

    // Update current time
    const minutes = Math.floor(videoRef.current.currentTime / 60);
    const seconds = Math.floor(videoRef.current.currentTime % 60);
    setCurrentTime(`${minutes}:${seconds < 10 ? "0" + seconds : seconds}`);
  };

  const handleSeek = (e) => {
    if (!videoRef.current) return;
    const newTime = (e.target.value / 100) * videoRef.current.duration;
    videoRef.current.currentTime = newTime;
    setProgress(e.target.value);
    setControlsVisible(true); // Show controls on seek
  };

  // Handle seeking by 10 seconds when arrow keys are pressed
  const handleSeekByArrowKeys = (e) => {
    if (videoRef.current) {
      let newTime = videoRef.current.currentTime;
      if (e.key === "ArrowRight") {
        newTime = Math.min(videoRef.current.duration, newTime + 10);
      } else if (e.key === "ArrowLeft") {
        newTime = Math.max(0, newTime - 10);
      }
      videoRef.current.currentTime = newTime;
      setProgress((newTime / videoRef.current.duration) * 100);
      setCurrentTime(
        `${Math.floor(newTime / 60)}:${(newTime % 60)
          .toFixed(0)
          .padStart(2, "0")}`
      );
      setControlsVisible(true); // Show controls on seek
    }
  };

  useEffect(() => {
    if (isMounted) {
      if (isFullscreen) {
        document.addEventListener("keydown", handleSeekByArrowKeys);
      } else {
        document.removeEventListener("keydown", handleSeekByArrowKeys);
      }
    }
    return () => {
      if (isMounted) {
        document.removeEventListener("keydown", handleSeekByArrowKeys);
      }
    };
  }, [isFullscreen, isMounted]);

  const handleNextVideo = () => {
    onNext();
    if (isPipActive && videoRef.current) {
      // Stop the current PIP session
      videoRef.current
        .exitPictureInPicture()
        .then(() => {
          // Reload the video to ensure the new source is recognized
          videoRef.current.load();
          // Start PIP again for the new video
          videoRef.current.requestPictureInPicture();
        })
        .catch((error) => {
          console.error("Error stopping PIP:", error);
        });
    }
    setControlsVisible(true); // Show controls on next video
  };

  const handlePreviousVideo = () => {
    onPrevious();
    if (isPipActive && videoRef.current) {
      // Similar logic as above for previous video
      videoRef.current
        .exitPictureInPicture()
        .then(() => {
          videoRef.current.load();
          videoRef.current.requestPictureInPicture();
        })
        .catch((error) => {
          console.error("Error stopping PIP:", error);
        });
    }
    setControlsVisible(true); // Show controls on previous video
  };

  // Automatically play the next video when the current video ends, only if in fullscreen
  useEffect(() => {
    if (videoRef.current && isMounted) {
      const handleVideoEnd = () => {
        if (isFullscreen && nextVideoTitle) {
          handleNextVideo();
        }
      };
      videoRef.current.addEventListener("ended", handleVideoEnd);
      return () => {
        if (videoRef.current && isMounted) {
          videoRef.current.removeEventListener("ended", handleVideoEnd);
        }
      };
    }
  }, [isFullscreen, nextVideoTitle, isMounted]);

  // Error handling for video loading
  const handleVideoError = () => {
    setVideoError(true);
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

  return (
    <div
      className="relative flex flex-col w-full h-full rounded-lg overflow-hidden shadow-lg transition-all duration-300 bg-black"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => !isPlaying && setControlsVisible(false)}
    >
      {/* Video Section */}
      <div
        className="relative w-full pb-[86.25%] sm:pb-[76.25%] md:pb-[56.25%] lg:h-[71vh]"
        style={{ maxHeight: isFullscreen ? "100vh" : "auto" }}
      >
        {videoUrl && !videoError ? (
          <video
            ref={videoRef}
            src={videoUrl}
            poster={thumbnailUrl}
            className={`absolute top-0 left-0 w-full h-full object-contain ${
              isFullscreen ? "object-cover" : ""
            }`}
            onClick={handlePlayPause}
            onTimeUpdate={handleProgress}
            controlsList="nodownload"
            onError={handleVideoError}
            onEnterPictureInPicture={() => setIsPipActive(true)}
            onLeavePictureInPicture={() => setIsPipActive(false)}
          >
            Your browser does not support the video tag.
          </video>
        ) : (
          <div className="absolute top-0 left-0 flex items-center justify-center w-full h-full bg-gradient-to-br from-gray-800 to-black text-white">
            <p className="text-center text-lg">
              Video unavailable. Please check the source or try a different
              video.
            </p>
          </div>
        )}
      </div>

      {/* Custom Controls */}
      <div
        className={`absolute bottom-0 left-0 right-0 flex flex-col gap-2 p-4 sm:p-6 bg-gradient-to-t from-black via-gray-900 to-transparent bg-opacity-50 rounded-lg transition-opacity duration-300 ${
          controlsVisible || !isPlaying ? "opacity-100" : "opacity-0"
        }`}
      >
        {/* Progress Bar */}
        <input
          type="range"
          value={progress}
          onChange={handleSeek}
          className="w-full h-1 sm:h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-400"
          aria-label="Seek Video"
        />

        {/* Duration Display */}
        <div className="text-white flex justify-between items-center text-xs sm:text-sm">
          <span>{currentTime}</span>
          <span>{duration}</span>
        </div>

        {/* Buttons and Info */}
        <div className="flex items-center justify-between text-white">
          {/* Left Controls */}
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={handlePreviousVideo}
              className="hidden sm:flex p-2 sm:p-3 rounded-full bg-gray-700 hover:bg-indigo-600 transition-all transform hover:scale-105"
              aria-label="Previous Video"
            >
              <FaStepBackward size={16} sm:size={20} />
            </button>
            <button
              onClick={handlePlayPause}
              className="p-2 sm:p-3 rounded-full bg-gray-700 hover:bg-indigo-600 transition-all transform hover:scale-105"
              aria-label={isPlaying ? "Pause Video" : "Play Video"}
            >
              {isPlaying ? (
                <FaPause size={16} sm:size={20} />
              ) : (
                <FaPlay size={16} sm:size={20} />
              )}
            </button>
            <button
              onClick={handleNextVideo}
              className="p-2 sm:p-3 rounded-full bg-gray-700 hover:bg-indigo-600 transition-all transform hover:scale-105"
              aria-label="Next Video"
            >
              <FaStepForward size={16} sm:size={20} />
            </button>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={handleMute}
              className="hidden sm:flex p-2 sm:p-3 rounded-full bg-gray-700 hover:bg-indigo-600 transition-all transform hover:scale-105"
              aria-label={isMuted ? "Unmute Video" : "Mute Video"}
            >
              {isMuted ? (
                <FaVolumeMute size={16} sm:size={20} />
              ) : (
                <FaVolumeUp size={16} sm:size={20} />
              )}
            </button>
            <button
              onClick={handleFullscreen}
              className="p-2 sm:p-3 rounded-full bg-gray-700 hover:bg-indigo-600 transition-all transform hover:scale-105"
              aria-label="Fullscreen Video"
            >
              <FaExpand size={16} sm:size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Title and Next Video Section */}
      <div
        className={`flex flex-col gap-2 sm:gap-4 mt-4 px-4 sm:px-6 transition-opacity duration-200 ${
          controlsVisible || !isPlaying ? "opacity-100" : "opacity-0"
        }`}
      >
        {/* Next Video Info */}
        {nextVideoTitle && (
          <div className="px-2 sm:px-4 py-1 sm:py-2 bg-gray-900 text-white rounded-md shadow-lg">
            <h5 className="text-sm sm:text-lg font-medium">Up Next:</h5>
            <p className="text-xs sm:text-sm">
              <strong>{nextVideoTitle}</strong> - {nextVideoDuration}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
