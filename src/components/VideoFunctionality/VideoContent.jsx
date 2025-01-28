/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React from "react";
import { FaFileAlt } from "react-icons/fa";
import {
  PiBookmarkSimpleThin,
  PiChats,
  PiVideoCameraFill,
} from "react-icons/pi";
import Forum from "./AddQ";

export default function VideoContent({
  activeSection,
  setActiveSection,
  lecture,
}) {
  return (
    <div className="mt-2 flex justify-center px-2 sm:px-4 animate-fadeIn">
      <div className="w-full ">
        {/* Navigation Buttons for larger screens */}
        <div className="hidden sm:flex justify-start mb-4 space-x-4 border-b-2 border-gray-200 animate-fadeIn">
          {[
            {
              section: "summary",
              icon: <PiBookmarkSimpleThin />,
              text: "Summary",
            },
            {
              section: "live-class",
              icon: <PiVideoCameraFill />,
              text: "Live class",
            },
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

        {/* Dropdown for smaller screens */}
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

        {/* Content based on active section */}
        <div className="bg-gray-100 p-4 sm:p-6 rounded-lg shadow-lg animate-fadeIn">
          {activeSection === "summary" && (
            <div className="animate-fadeIn">
              <h2 className="text-xl sm:text-2xl font-bold text-blue-500 mb-4">
                Summary
              </h2>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">
                {lecture?.title || "Untitled Lecture"}
              </h3>
              <p className="text-gray-600">
                {lecture?.description || "No description available for this title."}
              </p>
              
              <p className="text-base sm:text-lg text-gray-700">
                Total 0 Assignments
              </p>
            </div>
          )}
          {activeSection === "live-class" && (
            <div className="text-center animate-fadeIn">
              <h2 className="text-xl sm:text-2xl font-bold text-blue-500 mb-4 ">
                Live Class Schedule
              </h2>
              {[
                {
                  platform: "BigBlueButton",
                  date: "Friday, January 5, 2025",
                  time: "08:00 PM",
                },
                {
                  platform: "Zoom",
                  date: "Wed, 14 Dec 2022",
                  time: "08:00 PM",
                },
                {
                  platform: "Jitsi",
                  date: "Wed, 14 Dec 2022",
                  time: "08:00 PM",
                },
              ].map(({ platform, date, time }, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center bg-white p-4 sm:p-6 mb-4 last:mb-0 rounded-lg shadow-md animate-fadeIn"
                >
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">
                    {platform} Class
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 mb-4">
                    {time}, {date}
                  </p>
                  <button className="bg-blue-500 text-white px-4 py-2 sm:px-6 sm:py-2.5 rounded-full flex items-center justify-center space-x-2 transition-all duration-300 hover:bg-blue-600 animate-fadeIn">
                    <PiVideoCameraFill />
                    <span>Join Class</span>
                  </button>
                </div>
              ))}
            </div>
          )}
          {activeSection === "assignment" && (
            <div className="animate-fadeIn">
              <h2 className="text-xl sm:text-2xl font-bold text-blue-500 mb-4">
                Assignment
              </h2>
              <p className="text-base sm:text-lg text-gray-700">
                Total 0 Assignments.
              </p>
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