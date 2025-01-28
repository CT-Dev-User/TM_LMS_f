import React from "react";
import { useNavigate } from "react-router-dom";
import { UserData } from "../../context/UserContext";
import { server } from "../../main";

const CourseCard = ({ course, className }) => {
  const navigate = useNavigate();
  const { user, isAuth } = UserData();

  const handleStudyClick = () => {
    if (isAuth && user.subscription.includes(course._id)) {
      navigate(`/course/study/${course._id}`);
    } else {
      navigate(`/course/${course._id}`);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      navigate(`/course/${course._id}`);
    }
  };

  return (
    <div 
      className={`relative bg-white shadow-xl rounded-2xl overflow-hidden transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 group ${className}`}
      tabIndex="0"
      onKeyDown={handleKeyDown}
      role="button"
      aria-label={`Open course ${course.title}`}
    >
      <div className="relative">
        <img 
          src={`${server}/${course.image}`}
          alt={course.title || "Course thumbnail"}
          className="w-full h-56 object-cover rounded-t-2xl"
        />
        <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full z-10">
          {course.category || "Category"}
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900 opacity-70 rounded-t-2xl"></div>
      </div>

      <div className="p-5">
        <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-3">
          {course.title || "Untitled Course"}
        </h3>
        <p className="text-gray-600 text-sm mb-2">
          <strong className="text-gray-800">Instructor:</strong> {course.createdBy || "N/A"}
        </p>
        <p className="text-gray-600 text-sm mb-2 line-clamp-2">
          <strong className="text-gray-800">Description:</strong> {course.description || "N/A"}
        </p>
        <p className="text-gray-600 text-sm mb-4">
          <strong className="text-gray-800">Duration:</strong> {course.duration || "N/A"} Weeks
        </p>

        {isAuth ? (
          user.role !== "admin" ? (
            <>
              {user.subscription.includes(course._id) ? (
                <button
                  onClick={handleStudyClick}
                  className="w-full bg-gradient-to-r from-purple-500 to-blue-600 text-white font-semibold py-3 px-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group-hover:from-purple-600 group-hover:to-blue-700"
                >
                  Study
                </button>
              ) : (
                <button
                  onClick={handleStudyClick}
                  className="w-full bg-gradient-to-r from-purple-500 to-blue-600 text-white font-semibold py-3 px-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group-hover:from-purple-600 group-hover:to-blue-700"
                >
                  Get Started
                </button>
              )}
            </>
          ) : (
            <button
              onClick={handleStudyClick}
              className="w-full bg-gradient-to-r from-purple-500 to-blue-600 text-white font-semibold py-3 px-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group-hover:from-purple-600 group-hover:to-blue-700"
            >
              Study
            </button>
          )
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="w-full bg-gradient-to-r from-purple-500 to-blue-600 text-white font-semibold py-3 px-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group-hover:from-purple-600 group-hover:to-blue-700"
          >
            Get Started
          </button>
        )}

        {user && user.role === "admin" && (
          <button
            className="w-full mt-4 bg-red-600 text-white font-semibold py-3 px-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-red-700"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
};

export default CourseCard;