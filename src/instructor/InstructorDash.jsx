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

  // Redirect if user is not an instructor or admin (for testing)
  if (user && user.role !== "instructor") {
    navigate("/");
  }

  const [stats, setStats] = useState({
    totalCourses: 0,
    totalStudents: 0, // Will exclude admins
    activeCourses: 0,
  });

  const handleAddNewCourse = () => {
    navigate("/instructor/course");
  };
  async function fetchStats() {
    try {
      // Fetch general stats
      const { data: statsData } = await axios.get(`${server}/api/stats`, {
        headers: {
          token: localStorage.getItem("token"),
        },
      });

      // Fetch user data to filter out admins
      const { data: usersData } = await axios.get(`${server}/api/users`, {
        headers: {
          token: localStorage.getItem("token"),
        },
      });

      // Calculate total students by excluding users with role "admin"
      const totalStudents = usersData.users?.filter(u => u.role !== "admin").length || 0;

      setStats({
        totalCourses: statsData.stats?.totalCourses || 0,
        totalStudents: totalStudents, // Use filtered count
        activeCourses: statsData.stats?.totalCourses || 0, // Assuming all courses are active
      });
    } catch (error) {
      console.log("Error fetching stats:", error);
    }
  }

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="flex h-screen bg-gradient-to-r from-indigo-50 to-blue-100">
      <Sidebar />

      <div className="flex-1 flex flex-col  lg:ml-64">
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6 sm:p-10">
          <div className="max-w-7xl mx-auto">
            {/* Dashboard Stats */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8">
              <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg p-4 shadow-lg transform hover:scale-105 transition-transform duration-300">
                <div className="text-white">
                  <h3 className="text-lg font-medium">Total Courses</h3>
                  <p className="text-3xl font-bold">{stats.totalCourses}</p>
                </div>
              </div>
              <div className="bg-gradient-to-r from-green-400 to-blue-500 rounded-lg p-4 shadow-lg transform hover:scale-105 transition-transform duration-300">
                <div className="text-white">
                  <h3 className="text-lg font-medium">Total Students</h3>
                  <p className="text-3xl font-bold">{stats.totalStudents}</p>
                </div>
              </div>
              <div className="bg-gradient-to-r from-pink-500 to-red-500 rounded-lg p-4 shadow-lg transform hover:scale-105 transition-transform duration-300">
                <div className="text-white">
                  <h3 className="text-lg font-medium">Active Courses</h3>
                  <p className="text-3xl font-bold">{stats.activeCourses}</p>
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
                <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-full shadow-lg">
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