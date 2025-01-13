/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import axios from "axios";
import { BiCheckCircle } from "react-icons/bi";
import { FaRegClock } from "react-icons/fa";
import { GrCertificate } from "react-icons/gr";
import { PiBookOpenBold } from "react-icons/pi";
import ContentCard from "./ContentCard";
import Sidebar from "../../components/Sidebar/Sidebar";

const DashboardPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  const [course, setCourse] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mock user data
  const user = {
    name: "John Doe",
    email: "johndoe@example.com",
    profilePic: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png',
  };

  // Handle window resize to detect large screen
  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 1024);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get("http://localhost:3000/api/course/all");
        setCourse(data.courses || []); // Ensure backend returns a `courses` field
        setLoading(false);
      } catch (err) {
        setError("Failed to load courses");
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  if (loading) return <div className="h-screen flex items-center justify-center">Loading...</div>;
  if (error) return <div className="h-screen flex items-center justify-center">Error: {error}</div>;

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex flex-grow">
        {/* Sidebar */}
        <div className={`w-[16%] md:w-[10%] lg:w-[2%] ${isSidebarOpen || isLargeScreen ? "block" : "hidden"}`}>
          <Sidebar
            isSidebarOpen={isSidebarOpen || isLargeScreen}
            setIsSidebarOpen={setIsSidebarOpen}
            user={user}
            course={course}
          />
        </div>

        {/* Main Content */}
        <main className={`flex-grow p-4 ${isSidebarOpen || isLargeScreen ? "ml-[17%]" : ""}`}>
          {/* Stats Section */}
          <div className="w-full mt-4 mb-10 flex flex-wrap gap-2 md:gap-2 lg:gap-4">
            <div className="w-full md:w-[48%] lg:w-[23%] px-3 shadow-md py-4 rounded-md border flex items-center gap-2 justify-between">
              <div className="flex flex-col gap-2">
                <h3 className="text-zinc-700">Courses in Progress</h3>
                <p className="text-3xl">0</p>
              </div>
              <div className="bg-blue-100 text-blue-700 font-bold text-xl p-4 rounded-md">
                <PiBookOpenBold />
              </div>
            </div>

            <div className="w-full md:w-[48%] lg:w-[23%] px-3 shadow-md py-4 rounded-md border flex items-center gap-2 justify-between">
              <div className="flex flex-col gap-2">
                <h3 className="text-zinc-700">Completed Courses</h3>
                <p className="text-3xl">0</p>
              </div>
              <div className="bg-green-100 text-green-700 font-bold text-xl p-4 rounded-md">
                <BiCheckCircle />
              </div>
            </div>

            <div className="w-full md:w-[48%] lg:w-[23%] px-3 shadow-md py-4 rounded-md border flex items-center gap-2 justify-between">
              <div className="flex flex-col gap-2">
                <h3 className="text-zinc-700">Hours Spent</h3>
                <p className="text-3xl">0</p>
              </div>
              <div className="bg-purple-300 text-purple-700 font-bold text-xl p-4 rounded-md">
                <FaRegClock />
              </div>
            </div>

            <div className="w-full md:w-[48%] lg:w-[23%] px-3 shadow-md py-4 rounded-md border flex items-center gap-2 justify-between">
              <div className="flex flex-col gap-2">
                <h3 className="text-zinc-700">Certificates</h3>
                <p className="text-3xl">0</p>
              </div>
              <div className="bg-yellow-300 text-amber-950 font-bold text-xl p-4 rounded-md">
                <GrCertificate />
              </div>
            </div>
          </div>

          {/* Courses Section */}
          <div>
            <h2 className="text-2xl font-semibold pb-5">Continue Learning</h2>
            <div className="mt-4 flex-wrap gap-4 md:gap-2 lg:gap-4">
              <ContentCard course={course} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
