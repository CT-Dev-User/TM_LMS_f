/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React, { useRef, useState } from "react";
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
  duration,
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

  const handlePlayPause = () => {
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleFullscreen = () => {
    if (videoRef.current.requestFullscreen) {
      videoRef.current.requestFullscreen();
    } else if (videoRef.current.webkitRequestFullscreen) {
      videoRef.current.webkitRequestFullscreen();
    } else if (videoRef.current.msRequestFullscreen) {
      videoRef.current.msRequestFullscreen();
    }
  };

  const handleMute = () => {
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleProgress = () => {
    const progressPercentage =
      (videoRef.current.currentTime / videoRef.current.duration) * 100;
    setProgress(progressPercentage);
  };

  const handleSeek = (e) => {
    const newTime = (e.target.value / 100) * videoRef.current.duration;
    videoRef.current.currentTime = newTime;
    setProgress(e.target.value);
  };

  return (
    <div className="relative flex flex-col w-full lg:h-[70vh] h-full rounded-lg overflow-hidden shadow-lg transition-all duration-300">
      {/* Video Section */}
      {videoUrl && !videoError ? (
        <video
          ref={videoRef}
          src={videoUrl}
          poster={thumbnailUrl}
          className="w-full h-full object-cover rounded-lg"
          onClick={handlePlayPause}
          onTimeUpdate={handleProgress}
          controlsList="nodownload"
          onError={() => setVideoError(true)}
        >
          Your browser does not support the video tag.
        </video>
      ) : (
        <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-gray-800 to-black text-white">
          <p className="text-center text-lg">
            Video unavailable. Please check the source or try a different video.
          </p>
        </div>
      )}

      {/* Custom Controls */}
      <div className="absolute bottom-0 left-0 right-0 flex flex-col gap-3 p-4 bg-gradient-to-t from-black via-gray-900 to-transparent">
        {/* Progress Bar */}
        <input
          type="range"
          value={progress}
          onChange={handleSeek}
          className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-400"
          aria-label="Seek Video"
        />

        {/* Buttons and Info */}
        <div className="flex items-center justify-between text-white">
          {/* Left Controls */}
          <div className="flex items-center gap-4">
            <button
              onClick={onPrevious}
              className="p-2 rounded-full bg-gray-700 hover:bg-indigo-600 transition-all"
              aria-label="Previous Video"
            >
              <FaStepBackward size={20} />
            </button>
            <button
              onClick={handlePlayPause}
              className="p-3 rounded-full bg-gray-700 hover:bg-indigo-600 transition-all"
              aria-label={isPlaying ? "Pause Video" : "Play Video"}
            >
              {isPlaying ? <FaPause size={20} /> : <FaPlay size={20} />}
            </button>
            <button
              onClick={onNext}
              className="p-2 rounded-full bg-gray-700 hover:bg-indigo-600 transition-all"
              aria-label="Next Video"
            >
              <FaStepForward size={20} />
            </button>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-4">
            <button
              onClick={handleMute}
              className="p-2 rounded-full bg-gray-700 hover:bg-indigo-600 transition-all"
              aria-label={isMuted ? "Unmute Video" : "Mute Video"}
            >
              {isMuted ? <FaVolumeMute size={20} /> : <FaVolumeUp size={20} />}
            </button>
            <button
              onClick={handleFullscreen}
              className="p-2 rounded-full bg-gray-700 hover:bg-indigo-600 transition-all"
              aria-label="Fullscreen Video"
            >
              <FaExpand size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Title and Next Video Section */}
      <div className="flex flex-col gap-4 mt-4">
        {/* Video Title */}
        <div className="px-4 py-2 bg-gray-800 text-white rounded-md shadow-md">
          <h4 className="text-xl font-semibold">{title}</h4>
          <p className="text-sm text-gray-400">Duration: {duration}</p>
        </div>

        {/* Next Video Info */}
        {nextVideoTitle && (
          <div className="px-4 py-2 bg-gray-900 text-white rounded-md shadow-md">
            <h5 className="text-lg font-medium">Up Next:</h5>
            <p className="text-sm">
              <strong>{nextVideoTitle}</strong> - {nextVideoDuration}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
