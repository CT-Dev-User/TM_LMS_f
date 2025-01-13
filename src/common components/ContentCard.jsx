/* eslint-disable no-constant-binary-expression */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import { useNavigate } from "react-router-dom";

function ContentCard({ course, onLectureClick, isSidebarOpen, isLargeScreen }) {
  const navigate = useNavigate();

  const handleLectureClick = (course) => {
    if (!course._id) {
      console.error("Course ID is missing", course);
      return;
    }
  
    // Navigate to the lectures endpoint using the course ID
    navigate(`/lectures/${course._id}`, {
      state: { course, isSidebarOpen, isLargeScreen },
    });
  };
  
  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 ipadpro:grid-cols-2 gap-6 ${
        !isSidebarOpen ? "" : ""
      }`}
    >
      {course.length > 0 ? (
        course.map((c) => {
          const progress = c.progress || 0; // Default to 0 if progress is undefined

          return (
            <div
              key={c._id}
              onClick={() => {
                handleLectureClick(c);
                if (onLectureClick) {
                  onLectureClick(c);
                }
              }}
              className="cursor-pointer bg-white shadow-lg rounded-lg overflow-hidden transform transition-all w-full hover:scale-105 hover:shadow-xl duration-300"
              tabIndex="0"
              onKeyDown={(e) => e.key === "Enter" && handleLectureClick(c)}
              role="button"
              aria-label={`Open lecture ${c.title}`}
            >
              <img
                src={
                  `http://localhost:3000/${c.image.replace(/\\/g, "/")}` ||
                  "https://via.placeholder.com/150"
                }
                alt={c.title || "Lecture thumbnail"}
                className="w-full h-48 object-cover rounded-t-lg"
              />

              <div className="p-4">
                <h3 className="text-xl font-semibold text-indigo-700 mb-2 ipadpro:text-lg">
                  {c.title || "Untitled Lecture"}
                </h3>
                <p className="text-gray-500 text-sm mb-4 ipadpro:text-xs">
                  {c.description || "No description available."}
                </p>

                {/* Add Price Display */}
                {c.price && (
                  <div className="text-lg text-gray-800 font-semibold">
                    ${c.price}
                  </div>
                )}

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
