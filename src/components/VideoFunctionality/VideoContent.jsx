import React, { useEffect, useState } from "react";
import { FaFileAlt } from "react-icons/fa";
import { PiBookmarkSimpleThin, PiChats, PiVideoCameraFill } from "react-icons/pi";
import { server } from "../../main";
import Forum from "./AddQ";

export default function VideoContent({ activeSection, setActiveSection, lecture, courseId }) {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  // Fetch meetings based on courseId
  useEffect(() => {
    const fetchMeetings = async () => {
      if (courseId) {
        try {
          const response = await fetch(`${server}/api/lecture/${courseId}/meetings`, {
            headers: {
              token: localStorage.getItem("token"), // Assuming the token is used for authorization
            },
          });
          const data = await response.json();
          if (data.success) {
            setMeetings(data.meetings);
          } else {
            setError("Failed to fetch meetings.");
          }
        } catch (err) {
          console.error("Error fetching meetings:", err);
          setError("An error occurred while fetching meetings.");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchMeetings();
  }, [courseId]);
  // Loading or error state handling
  if (loading) {
    return <div>Loading meetings...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="mt-2 flex justify-center px-2 sm:px-4 animate-fadeIn">
      <div className="w-full">
        <div className="hidden sm:flex justify-start mb-4 space-x-4 border-b-2 border-gray-200 animate-fadeIn">
          {[
            { section: "summary", icon: <PiBookmarkSimpleThin />, text: "Summary" },
            { section: "live-class", icon: <PiVideoCameraFill />, text: "Live class" },
            { section: "assignment", icon: <FaFileAlt />, text: "Assignment" },
            { section: "forum", icon: <PiChats />, text: "Forum" },
          ].map(({ section, icon, text }) => (
            <button
              key={section}
              onClick={() => setActiveSection(section)}
              className={`flex items-center gap-2 px-3 py-2 text-sm sm:text-base font-medium transition-all duration-300 ${
                activeSection === section
                  ? "text-purple-500 border-b-2 border-purple-500"
                  : "text-gray-100 hover:text-purple-400"
              } animate-fadeIn`}
            >
              {icon}
              <span>{text}</span>
            </button>
          ))}
        </div>

        <div className="sm:hidden w-full mb-3 animate-fadeIn">
          <select
            value={activeSection}
            onChange={(e) => setActiveSection(e.target.value)}
            className="w-full mt-2 p-2 border border-gray-300 rounded-lg bg-gray-700 text-white animate-fadeIn"
          >
            <option value="summary">Summary</option>
            <option value="live-class">Live class</option>
            <option value="assignment">Assignment</option>
            <option value="forum">Forum</option>
          </select>
        </div>

        <div className="bg-gray-100 p-4 sm:p-6 rounded-lg shadow-lg animate-fadeIn">
          {activeSection === "summary" && (
            <div className="animate-fadeIn">
              <h2 className="text-xl sm:text-2xl font-bold text-blue-500 mb-4">Summary</h2>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">
                {lecture?.title || "Untitled Lecture"}
              </h3>
              <p className="text-gray-600">{lecture?.description || "No description available for this lecture."}</p>
              <p className="text-base sm:text-lg text-gray-700">Total 0 Assignments</p>
            </div>
          )}

          {activeSection === "live-class" && (
            <div className="text-center animate-fadeIn">
              <h2 className="text-xl sm:text-2xl font-bold text-blue-500 mb-4">Live Class Schedule</h2>
              {meetings.length > 0 ? (
                meetings.map((meeting, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center bg-white p-4 sm:p-6 mb-4 rounded-lg shadow-md"
                  >
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">{meeting.platform} Meeting</h3>
                    <p className="text-sm sm:text-base text-gray-600 mb-4">
                      {meeting.meetingTime}, {new Date(meeting.meetingDate).toLocaleDateString()}
                    </p>
                    <a
                      href={meeting.meetingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600"
                    >
                      <PiVideoCameraFill className="inline mr-2" />
                      Join Meeting
                    </a>
                  </div>
                ))
              ) : (
                <p className="text-gray-600">No meetings scheduled for this course.</p>
              )}
            </div>
          )}

          {activeSection === "assignment" && (
            <div className="animate-fadeIn">
              <h2 className="text-xl sm:text-2xl font-bold text-blue-500 mb-4">Assignment</h2>
              <p className="text-base sm:text-lg text-gray-700">Total 0 Assignments.</p>
            </div>
          )}

          {activeSection === "forum" && (
            <div className="flex justify-center items-center animate-fadeIn">
              <div className="w-full max-w-4xl">
                <Forum />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
