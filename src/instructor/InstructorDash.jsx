/* eslint-disable no-unused-vars */
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserData } from "../context/UserContext";
import { server } from "../main"; // Adjust the path to your server config
import Sidebar from "./Sidebar";

function InstructorDash() {
  const navigate = useNavigate();
  const { user } = UserData();

  // Redirect if user is not an instructor
  if (user && user.role !== "instructor") {
    navigate("/");
  }

  const [stats, setStats] = useState({
    assignedCourses: 0,
    totalLectures: 0,
    totalStudents: 0,
  });

  const handleAddNewCourse = () => {
    navigate("/instructor/course");
  };

  const handleManageStudents = () => {
    navigate("/instructor/students");
  };

  async function fetchInstructorStats() {
    try {
      // Fetch courses assigned to the instructor
      const { data: coursesData } = await axios.get(`${server}/api/instructor/courses`, {
        headers: { token: localStorage.getItem("token") },
      });

      if (!coursesData.success) {
        throw new Error(coursesData.message || "Failed to fetch courses");
      }

      const courses = coursesData.courses || [];
      let totalLectures = 0;
      const studentSet = new Set(); // To deduplicate students

      // Fetch lectures and students for each course
      for (const course of courses) {
        try {
          // Fetch lectures
          const { data: lecturesData } = await axios.get(
            `${server}/api/course/${course._id}/lectures`,
            { headers: { token: localStorage.getItem("token") } }
          );
          if (lecturesData.success) {
            totalLectures += (lecturesData.lectures || []).length;
          }
        } catch (error) {
          console.error(`Error fetching lectures for course ${course._id}:`, error);
        }

        try {
          // Fetch students
          const { data: studentsData } = await axios.get(
            `${server}/api/course/${course._id}/students`,
            { headers: { token: localStorage.getItem("token") } }
          );
          if (studentsData.success) {
            (studentsData.students || []).forEach((student) => {
              // Only include non-admin users
              if (student.role !== "admin") {
                studentSet.add(student._id);
              }
            });
          }
        } catch (error) {
          console.error(`Error fetching students for course ${course._id}:`, error);
        }
      }

      setStats({
        assignedCourses: courses.length,
        totalLectures,
        totalStudents: studentSet.size,
      });
    } catch (error) {
      console.error("Error fetching instructor stats:", error);
    }
  }

  useEffect(() => {
    fetchInstructorStats();
  }, []);

  return (
    <div className="flex h-screen bg-gradient-to-r from-indigo-50 to-blue-100">
      <Sidebar />

      <div className="flex-1 flex flex-col lg:ml-64">
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6 sm:p-10">
          <div className="max-w-7xl mx-auto">
            {/* Dashboard Stats */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8">
              <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg p-4 shadow-lg transform hover:scale-105 transition-transform duration-300">
                <div className="text-white">
                  <h3 className="text-lg font-medium">Assigned Courses</h3>
                  <p className="text-3xl font-bold">{stats.assignedCourses}</p>
                </div>
              </div>
              <div className="bg-gradient-to-r from-green-400 to-blue-500 rounded-lg p-4 shadow-lg transform hover:scale-105 transition-transform duration-300">
                <div className="text-white">
                  <h3 className="text-lg font-medium">Total Lecture Videos</h3>
                  <p className="text-3xl font-bold">{stats.totalLectures}</p>
                </div>
              </div>
              <div className="bg-gradient-to-r from-pink-500 to-red-500 rounded-lg p-4 shadow-lg transform hover:scale-105 transition-transform duration-300">
                <div className="text-white">
                  <h3 className="text-lg font-medium">Enrolled Students</h3>
                  <p className="text-3xl font-bold">{stats.totalStudents}</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <section className="mt-6">
              <div className="flex justify-start space-x-4">
                <button
                  onClick={handleAddNewCourse}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-full shadow-lg"
                >
                  View Courses
                </button>
                <button
                  onClick={handleManageStudents}
                  className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-full shadow-lg"
                >
                  Manage Students
                </button>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}

export default InstructorDash;