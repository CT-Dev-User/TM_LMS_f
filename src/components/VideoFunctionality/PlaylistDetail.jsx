/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import VideoPlayer from "./VideoPlayer";
import { NavLink } from "react-router-dom";
import clsx from "clsx"; // For conditional styling
import VideoContent from "./VideoContent";

const PlaylistDetail = ({ isSidebarOpen, isLargeScreen }) => {
  const { courseId } = useParams(); // Extract courseId from the route
  const [lectures, setLectures] = useState([]);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(true);
  const navigate = useNavigate();
  const [courseImage, setCourseImage] = useState(null); // New state for course image
  const [activeSection, setActiveSection] = useState("summary");

  // Fetch course image when courseId changes
  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:3000/api/course/${courseId}`
        );
        setCourseImage(data.course?.image); // Set course image from the response
      } catch (err) {
        setError("Failed to load course details.");
      }
    };

    fetchCourseDetails();
  }, [courseId]);

  // Fetch lectures for the course when courseId changes
  useEffect(() => {
    const fetchLectures = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(
          `http://localhost:3000/api/lectures/${courseId}`, // Updated endpoint
          {
            headers: {
              token: localStorage.getItem("token"), // Authorization header
            },
          }
        );
        setLectures(data.lectures || []);
        if (data.lectures?.length > 0) {
          setCurrentVideo(data.lectures[0]); // Set the first video as current
        }
        setLoading(false);
      } catch (err) {
        setError("Failed to load lectures.");
        setLoading(false);
      }
    };
  
    fetchLectures();
  }, [courseId]);
  
  const handleBackToPlaylist = () => {
    navigate(-1); // Navigating to playlist details
  };

  const handleNextVideo = () => {
    const currentIndex = lectures.findIndex(
      (lecture) => lecture._id === currentVideo._id
    );
    if (currentIndex < lectures.length - 1) {
      setCurrentVideo(lectures[currentIndex + 1]);
    }
  };

  const handlePreviousVideo = () => {
    const currentIndex = lectures.findIndex(
      (lecture) => lecture._id === currentVideo._id
    );
    if (currentIndex > 0) {
      setCurrentVideo(lectures[currentIndex - 1]);
    }
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

  const safeImageUrl = courseImage
    ? `http://localhost:3000/${courseImage.replace(/\\/g, "/")}`
    : null;
  const safeVideoUrl = `http://localhost:3000/${
    currentVideo?.video || "path-to-placeholder-video.mp4"
  }`;

  if (loading) return <div className="animate-fadeIn">Loading...</div>;
  if (error) return <div className="animate-fadeIn">Error: {error}</div>;

  return (
    <div
      className={`ml-[4%] mt-[1%] mr-[4%] mb-[4%] rounded-lg flex flex-col lg:flex-row gap-6 p-2 pt-4 pb-2 bg-gray-900 transition-all ${
        isSidebarOpen ? (isLargeScreen ? "lg:ml-64" : "") : "ml-0"
      } relative ipadpro:flex-col animate-fadeIn`}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setControlsVisible(false)} // Hide controls when mouse leaves
    >
      {/* Back Button */}
      <NavLink
        className={`absolute top-5 left-3 flex items-center gap-2 px-2 py-2 bg-gradient-to-r text-white font-semibold rounded-lg shadow-md transition hover:from-indigo-600 z-10 ${
          isLargeScreen ? "lg:flex" : "sm:flex"
        } ipadpro:flex ${controlsVisible ? "opacity-100" : "opacity-0"} animate-fadeIn`}
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
        <span className="hidden lg:inline-block ipadpro:hidden">
          Back to Courses
        </span>
      </NavLink>

      {/* Video Player Section */}
      <div
        className="flex-1 bg-gray-800 rounded-lg overflow-hidden shadow-lg relative ipadpro:mb-4 animate-fadeIn"
        onMouseMove={() => setControlsVisible(true)} // Show controls when mouse moves over video
      >
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
        <div className="p-4 bg-gray-900 text-white rounded-lg shadow-md animate-fadeIn">
          <h2 className="text-xl font-bold ipadpro:text-lg animate-fadeIn">
            {currentVideo.title}
          </h2>
          <p className="text-sm text-gray-400 ipadpro:text-xs animate-fadeIn">
            Duration: {currentVideo.duration}
          </p>
          {/* VideoContent Component */}
          <VideoContent
            activeSection={activeSection}
            setActiveSection={setActiveSection}
            lecture={currentVideo}
          />
        </div>
      </div>

      {/* Playlist Section */}
      <div className="bg-gray-100 p-4 rounded-lg shadow-lg overflow-y-auto max-h-[60vh] sm:max-h-[50vh] ipadpro:max-h-[40vh] lg:max-h-[70vh] lg:w-[32%] ipadpro:w-[93%] ipadpro:mx-auto animate-fadeIn">
  <h3 className="text-xl font-semibold text-indigo-700 mb-4 text-center ipadpro:text-lg animate-fadeIn">
    Videos in Playlist
  </h3>
  <div className="space-y-3 animate-fadeIn">
    {lectures.map((video) => (
      <div
        key={video._id}
        className={clsx(
          "flex items-center gap-3 p-3 bg-white shadow-md rounded-lg transition cursor-pointer animate-fadeIn",
          "hover:shadow-lg hover:bg-indigo-50",
          {
            "relative after:absolute after:inset-0 after:bg-black after:opacity-20 after:rounded-lg":
              video._id === currentVideo._id,
          }
        )}
        onClick={() => setCurrentVideo(video)}
      >
        {/* Show image on all screens including iPad Pro */}
        <div
          className="hidden sm:block w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden ipadpro:block animate-fadeIn"
          style={{
            backgroundImage: `url(${safeImageUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        ></div>
        {/* Text for title and duration */}
        <div className="flex-1 animate-fadeIn">
          <h4 className="text-base sm:text-lg font-semibold overflow-hidden break-words ipadpro:text-sm animate-fadeIn">
            {video.title}
          </h4>
          <p className="text-xs sm:text-sm text-gray-500 ipadpro:text-[0.7rem] animate-fadeIn">
            Duration: {video.duration}
          </p>
        </div>
      </div>
    ))}
  </div>
</div>

    </div>
  );
};

export default PlaylistDetail;