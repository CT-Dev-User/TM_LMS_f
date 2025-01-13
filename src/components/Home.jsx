// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import Navbar from "./Navbar";
import Routing from "../Routing";
import img from "../assets/profile.jpg";

const Home = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  const [course, setCourse] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const user = {
    name: "John Doe",
    email: "johndoe@example.com",
    profilePic: img,
  };

  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 1024);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch lectures from backend
  useEffect(() => {
    const fetchLectures = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get("http://localhost:3000/api/course/all");
        setCourse(data.courses); // Ensure your backend returns a `courses` field.
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchLectures();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="min-h-screen">
      <Navbar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />
      <div className="flex custom-margin">
        <div className="w-[16%] md:w-[10%] lg:w-[17%]">
          <Sidebar
            isSidebarOpen={isSidebarOpen || isLargeScreen}
            setIsSidebarOpen={setIsSidebarOpen}
            user={user}
            course={course}
          />
        </div>
        <main className="w-[84%] md:w-[90%] lg:w-[85%] p-4 mt-20">
          <Routing
            isSidebarOpen={isSidebarOpen}
            isLargeScreen={isLargeScreen}
            course={course}
          />
        </main>
      </div>
    </div>
  );
};

export default Home;