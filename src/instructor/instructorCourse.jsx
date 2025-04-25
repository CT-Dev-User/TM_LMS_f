/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserData } from "../context/UserContext";
import { CourseData } from "../context/CourseContext";
import Sidebar from "./Sidebar";
import { server } from "../main";

const InstructorCourses = ({ user }) => {
  const navigate = useNavigate();
  const { isAuth } = UserData();
  const { courses, fetchCourses } = CourseData();

  // Redirect if user is not authenticated or not an instructor/admin
  if (!isAuth || (user && user.role !== "instructor")) {
    return navigate("/login");
  }

  useEffect(() => {
    fetchCourses(); // Fetch courses on mount
  }, []);

// Inside InstructorCourses component
const InstructorCourseCard = ({ course }) => {
  const handleStudyClick = () => {
    navigate(`/instructor/course/${course._id}/manage`); // Changed navigation path
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      navigate(`/instructor/course/${course._id}/manage`);
    }
  };

  // Rest of the component remains the same...

    return (
      <div
        className="relative bg-white shadow-lg rounded-2xl overflow-hidden transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 group"
        tabIndex="0"
        onKeyDown={handleKeyDown}
        role="button"
        aria-label={`Open course ${course.title}`}
      >
        {/* Course Thumbnail */}
        <div className="relative h-56 overflow-hidden">
          <img
            src={course.image}
            alt={course.title || "Course thumbnail"}
            className="w-full h-full object-cover transform transition-all duration-300 group-hover:scale-105"
          />
          <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full z-10">
            {course.category || "Category"}
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900 opacity-70"></div>
        </div>

        {/* Course Details */}
        <div className="p-6">
          {/* Course Title */}
          <h3 className="text-xl font-bold text-gray-900 mb-3 truncate capitalize">
            {course.title || "Untitled Course"}
          </h3>

          {/* Course Metadata */}
          <div className="space-y-2 mb-4">
            <p className="text-sm text-gray-600">
              <span className="font-semibold text-gray-800 capitalize">Instructor:</span> {course.createdBy || "N/A"}
            </p>
            <p className="text-sm text-gray-600 line-clamp-2">
              <span className="font-semibold text-gray-800">Description:</span> {course.description || "N/A"}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-semibold text-gray-800">Duration:</span> {course.duration || "N/A"} Weeks
            </p>
          </div>

          {/* Action Button */}
          <div className="space-y-3">
            <button
              onClick={handleStudyClick}
              className="w-full bg-gradient-to-r from-purple-500 to-blue-600 text-white font-semibold py-2.5 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:from-purple-600 hover:to-blue-700 transform hover:scale-105"
            >
              Teach
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-gradient-to-r from-indigo-50 to-blue-100">
      <Sidebar />
      
      <main className="flex-1 overflow-y-auto  p-6 lg:ml-64">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-semibold mb-4 text-indigo-800">All Courses</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 ipadpro:grid-cols-2 gap-6">
            {courses && courses.length > 0 ? (
              courses.map((course) => (
                <InstructorCourseCard key={course._id} course={course} />
              ))
            ) : (
              <p className="text-center text-gray-600 col-span-full">No Courses Available Yet</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default InstructorCourses;