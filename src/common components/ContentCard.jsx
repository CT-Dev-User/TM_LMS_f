/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import { useNavigate } from "react-router-dom";
import { formatTitle } from "../components/Utils"; // Import the title formatting utility

function ContentCard({ lectures = [], onLectureClick, isSidebarOpen, isLargeScreen }) {
  const navigate = useNavigate();

  const handleLectureClick = (lecture) => {
    const formattedTitle = formatTitle(lecture.title);

    navigate(`/playlist/${formattedTitle}`, { 
      state: { lecture, isSidebarOpen, isLargeScreen } 
    });

    if (onLectureClick) onLectureClick(lecture); // Trigger callback if provided
  };

  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 ipadpro:grid-cols-2 gap-6 ${
        !isSidebarOpen ? "ml-16" : ""
      }`}
    >
      {lectures.length > 0 ? (
        lectures.map((lecture) => {
          const progress = lecture.progress || 0; // Default to 0 if progress is undefined

          return (
            <div
              key={lecture.id}
              onClick={() => handleLectureClick(lecture)}
              className="cursor-pointer bg-white shadow-lg rounded-lg overflow-hidden transform transition-all w-full hover:scale-105 hover:shadow-xl duration-300"
              tabIndex="0"
              onKeyDown={(e) => e.key === "Enter" && handleLectureClick(lecture)}
              role="button"
              aria-label={`Open lecture ${lecture.title}`}
            >
              <img
                src={lecture.img || "https://via.placeholder.com/150"}
                alt={lecture.title || "Lecture thumbnail"}
                className="w-full h-48 object-cover rounded-t-lg"
              />
              <div className="p-4">
                <h3 className="text-xl font-semibold text-indigo-700 mb-2 ipadpro:text-lg">
                  {lecture.title || "Untitled Lecture"}
                </h3>
                <p className="text-gray-500 text-sm mb-4 ipadpro:text-xs">
                  {lecture.description || "No description available."}
                </p>

                <div className="relative pt-1">
                  <div className="flex mb-2 items-center justify-between">
                    <span className="text-xs font-semibold inline-block py-1 uppercase ipadpro:text-[0.65rem]">
                      Progress
                    </span>
                    <span className="text-xs font-semibold inline-block py-1 uppercase ipadpro:text-[0.65rem]">
                      {progress}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-indigo-600 h-2.5 rounded-full"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <p className="text-center text-gray-500">No lectures available.</p>
      )}
    </div>
  );
}

export default ContentCard;
