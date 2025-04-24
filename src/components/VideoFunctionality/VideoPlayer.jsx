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
  const [duration, setDuration] = useState("0:00"); 

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false); // Cleanup on unmount
  }, []);

  useEffect(() => {
    if (videoRef.current && isMounted) {
      videoRef.current.pause();
      videoRef.current.load(); // Reload the video
      setIsPlaying(false);
      setProgress(0);
      setCurrentTime("0:00");
      setVideoError(false);
      setControlsVisible(true);
      setDuration("0:00");
    }
  }, [videoUrl, isMounted]);

  useEffect(() => {
    if (isMounted) {
      const handleFullscreenChange = () => {
        setIsFullscreen(!!document.fullscreenElement);
      };
      document.addEventListener("fullscreenchange", handleFullscreenChange);
      return () => {
        if (isMounted) {
          document.removeEventListener("fullscreenchange", handleFullscreenChange);
        }
      };
    }
  }, [isMounted]);

  useEffect(() => {
    if (videoRef.current && isMounted) {
      const handlePipChange = () => {
        setIsPipActive(!!document.pictureInPictureElement);
      };

      videoRef.current.addEventListener("enterpictureinpicture", handlePipChange);
      videoRef.current.addEventListener("leavepictureinpicture", handlePipChange);

      return () => {
        if (videoRef.current && isMounted) {
          videoRef.current.removeEventListener("enterpictureinpicture", handlePipChange);
          videoRef.current.removeEventListener("leavepictureinpicture", handlePipChange);
        }
      };
    }
  }, [isMounted]);

  useEffect(() => {
    let timer;
    if (isPlaying && isMounted) {
      timer = setTimeout(() => {
        setControlsVisible(false);
      }, 3000);
    } else {
      setControlsVisible(true);
    }
    return () => {
      clearTimeout(timer);
    };
  }, [isPlaying, isMounted]);

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
          videoRef.current.removeEventListener("loadedmetadata", handleLoadedMetadata);
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
    setControlsVisible(true);
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
    setControlsVisible(true);
  };

  const handleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
    setControlsVisible(true);
  };

  const handleProgress = () => {
    if (!videoRef.current) return;
    const progressPercentage = (videoRef.current.currentTime / videoRef.current.duration) * 100;
    setProgress(progressPercentage);

    const minutes = Math.floor(videoRef.current.currentTime / 60);
    const seconds = Math.floor(videoRef.current.currentTime % 60);
    setCurrentTime(`${minutes}:${seconds < 10 ? "0" + seconds : seconds}`);
  };

  const handleSeek = (e) => {
    if (!videoRef.current) return;
    const newTime = (e.target.value / 100) * videoRef.current.duration;
    videoRef.current.currentTime = newTime;
    setProgress(e.target.value);
    setControlsVisible(true);
  };

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
      setCurrentTime(`${Math.floor(newTime / 60)}:${(newTime % 60).toFixed(0).padStart(2, "0")}`);
      setControlsVisible(true);
    }
  };

  useEffect(() => {
    if (isMounted) {
      document.addEventListener("keydown", handleSeekByArrowKeys);
    }
    return () => {
      if (isMounted) {
        document.removeEventListener("keydown", handleSeekByArrowKeys);
      }
    };
  }, [isMounted]);

  const handleNextVideo = () => {
    onNext();
    setControlsVisible(true);
  };

  const handlePreviousVideo = () => {
    onPrevious();
    setControlsVisible(true);
  };

  useEffect(() => {
    if (videoRef.current && isMounted) {
      const handleVideoEnd = () => {
        handleNextVideo();
      };
      videoRef.current.addEventListener("ended", handleVideoEnd);
      return () => {
        if (videoRef.current && isMounted) {
          videoRef.current.removeEventListener("ended", handleVideoEnd);
        }
      };
    }
  }, [isMounted]);

  const handleVideoError = () => {
    setVideoError(true);
  };

  const handleMouseMove = () => {
    setControlsVisible(true);
    clearTimeout(); 
    if (isPlaying) {
      setTimeout(() => {
        setControlsVisible(false);
      }, 3000);
    }
  };

  return (
    <div
      className="relative flex flex-col w-full rounded-lg overflow-hidden shadow-lg transition-all duration-300 bg-black"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => !isPlaying && setControlsVisible(false)}
    >
      <div
        className="relative w-full pb-[86.25%] sm:pb-[76.25%] md:pb-[56.25%] lg:h-[71vh]"
        style={{ 
          maxHeight: isFullscreen ? "100vh" : "auto",
          height: isFullscreen ? "100vh" : "auto" 
        }}
      >
        {videoUrl && !videoError ? (
          <video
            ref={videoRef}
            src={videoUrl}
            poster={thumbnailUrl}
            className={`absolute top-0 left-0 w-full h-full object-contain ${isFullscreen ? "object-cover sm:object-contain" : ""}`}
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
              Video unavailable. Please check the source or try a different video.
            </p>
          </div>
        )}
      </div>

      <div
        className={`absolute bottom-0 left-0 right-0 flex flex-col gap-2 p-4 sm:p-6 bg-gradient-to-t from-black via-gray-900 to-transparent bg-opacity-50 rounded-lg transition-opacity duration-300 ${controlsVisible || !isPlaying ? "opacity-100" : "opacity-0"}`}
      >
        <input
          type="range"
          value={progress}
          onChange={handleSeek}
          className="w-full h-1 sm:h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-400"
          aria-label="Seek Video"
        />

        <div className="text-white flex justify-between items-center text-xs sm:text-sm">
          <span>{currentTime}</span>
          <span>{duration}</span>
        </div>

        <div className="flex items-center justify-between text-white">
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={handlePreviousVideo}
              className="hidden sm:block p-2 sm:p-3 rounded-full bg-gray-700 hover:bg-indigo-600 transition-all transform hover:scale-105"
              aria-label="Previous Video"
            >
              <FaStepBackward className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
            <button
              onClick={handlePlayPause}
              className="p-2 sm:p-3 rounded-full bg-gray-700 hover:bg-indigo-600 transition-all transform hover:scale-105"
              aria-label={isPlaying ? "Pause Video" : "Play Video"}
            >
              {isPlaying ? (
                <FaPause className="h-4 w-4 sm:h-5 sm:w-5" />
              ) : (
                <FaPlay className="h-4 w-4 sm:h-5 sm:w-5" />
              )}
            </button>
            <button
              onClick={handleNextVideo}
              className="p-2 sm:p-3 rounded-full bg-gray-700 hover:bg-indigo-600 transition-all transform hover:scale-105"
              aria-label="Next Video"
            >
              <FaStepForward className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={handleMute}
              className="hidden sm:block p-2 sm:p-3 rounded-full bg-gray-700 hover:bg-indigo-600 transition-all transform hover:scale-105"
              aria-label={isMuted ? "Unmute Video" : "Mute Video"}
            >
              {isMuted ? (
                <FaVolumeMute className="h-4 w-4 sm:h-5 sm:w-5" />
              ) : (
                <FaVolumeUp className="h-4 w-4 sm:h-5 sm:w-5" />
              )}
            </button>
            <button
              onClick={handleFullscreen}
              className="p-2 sm:p-3 rounded-full bg-gray-700 hover:bg-indigo-600 transition-all transform hover:scale-105"
              aria-label="Toggle Fullscreen"
            >
              <FaExpand className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}