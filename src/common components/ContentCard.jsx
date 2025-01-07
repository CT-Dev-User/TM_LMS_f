/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import { useNavigate } from "react-router-dom";

function ContentCard({ lectures, onLectureClick, isSidebarOpen, isLargeScreen }) {
  const navigate = useNavigate();

  const handleLectureClick = (lecture) => {
    const formattedTitle = lecture.title
      .replace(/[^a-zA-Z0-9\s-]/g, "") // Remove non-alphanumeric characters
      .replace(/\s+/g, "-") // Replace spaces with hyphens
      .toLowerCase();

    navigate(`/playlist/${formattedTitle}`, { state: { lecture, isSidebarOpen, isLargeScreen } });

    if (onLectureClick) onLectureClick(lecture); // Call callback if defined
  };

  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 ipadpro:grid-cols-2 gap-6 ${!isSidebarOpen ? "ml-16" : ""}`}
    >
      {lectures.map((lecture) => {
        const progress = lecture.progress || 0; // Default progress to 0 if undefined

        return (
          <div
            key={lecture.id}
            onClick={() => handleLectureClick(lecture)}
            className="cursor-pointer bg-white shadow-lg rounded-lg overflow-hidden transform transition-all w-full hover:scale-105 hover:shadow-xl duration-300"
            tabIndex="0"
            onKeyDown={(e) => e.key === "Enter" && handleLectureClick(lecture)}
          >
            <img
              src={lecture.img || "https://via.placeholder.com/150"}
              alt={lecture.title}
              className="w-full h-48 object-cover rounded-t-lg"
            />
            <div className="p-4">
              <h3 className="text-xl font-semibold text-indigo-700 mb-2 ipadpro:text-lg">
                {lecture.title}
              </h3>
              <p className="text-gray-500 text-sm mb-4 ipadpro:text-xs">{lecture.description}</p>

              <div className="relative pt-1">
                <div className="flex mb-2 items-center justify-between">
                  <span className="text-xs font-semibold inline-block py-1 uppercase ipadpro:text-[0.65rem]">
                    Progress
                  </span>
                  <span className="text-xs font-semibold inline-block py-1 uppercase ipadpro:text-[0.65rem]">
                    {progress}%
                  </span>
                </div>
                <div className="flex mb-2 items-center justify-between">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-indigo-600 h-2.5 rounded-full"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default ContentCard;