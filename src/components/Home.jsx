/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "./Navbar";
import img from "../assets/profile.jpg";
import ContentCard from "../components/ContentCard";  // Import the ContentCard

const Home = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(false);

  const user = {
    name: "John Doe",
    email: "johndoe@example.com",
    profilePic: img,
  };

  //  Hardcode Detials
  const lectures = [
    { title: "Introduction to React", description: "Learn the basics of React" },
    { title: "Advanced JavaScript", description: "Deep dive into JavaScript concepts" },
    { title: "Python for Beginners", description: "Start coding with Python" },
    { title: "Machine Learning Basics", description: "Get started with Machine Learning" },
  ];

  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 1024);
    };

    window.addEventListener("resize", handleResize);
    handleResize(); 

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="  h-full mt-20 min-h-screen bg-gray-50 relative">
      <Navbar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />
      <div className="flex flex-1">
        <Sidebar
          isSidebarOpen={isSidebarOpen || isLargeScreen}
          setIsSidebarOpen={setIsSidebarOpen}
          user={user}
        />
        <ContentCard
  lectures={lectures}
  isSidebarOpen={isSidebarOpen || isLargeScreen}
  isLargeScreen={isLargeScreen}
/>

      </div>
    </div>
  );
};

export default Home;
