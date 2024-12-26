/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-key */
import React, { useState, useEffect } from "react";
import vid from "../assets/vid.mp4";
import tmjc from "../assets/tjmc.mp4";
import vid1 from "../assets/vid1.mp4";
import ContentCard from "../common components/ContentCard";
import { BiCheckCircle } from "react-icons/bi";
import { FaRegClock } from "react-icons/fa";
import { GrCertificate } from "react-icons/gr";
import { PiBookOpenBold } from "react-icons/pi";
// import { progress } from "framer-motion";

const DashboardPage = () => {
  // Hardcoded lecture data
  const lectures = [
    {
      id: 1,
      title: "Introduction to React",
      description: "Learn the basics of React",
      progress: 43,
      img: "https://lh7-us.googleusercontent.com/D6BrXu23nOJepuMbM-ZSNza1nfl8qLh1PtaGzyYUebo6llBebhDTSKODso4N6JZsFMXuwxSRga2pIqidn6rPkjHJTNd7opp-5HYY87OOFXqiC0nGCcHHenuytpXoG5u4jHzD4MVPdfgW0QvUijKh5q8",
      about: "This course introduces React, a JavaScript library for building user interfaces. Learn the fundamentals like components, JSX, and state management.",
      videos: [
        { id: 1, title: "Video 1: Basics of React", duration: "10:32", url: vid },
        { id: 2, title: "Video 2: Components in React", duration: "12:45", url: "https://www.w3schools.com/html/mov_bbb.mp4" },
      ],
    },
    {
      id: 2,
      title: "Advanced JavaScript",
      description: "Deep dive into JavaScript concepts",
      progress: 93,
      img: "https://miro.medium.com/v2/resize:fit:1100/format:webp/1*dbggYEdKfBg-4SqRqrkFow.png",
      about: "Explore advanced JavaScript concepts like closures, asynchronous programming, and more. This course will enhance your coding and problem-solving skills.",
      videos: [
        { id: 1, title: "Video 1: Closures in JS", duration: "15:32", url: "https://www.w3schools.com/html/mov_bbb.mp4" },
        { id: 2, title: "Video 2: JavaScript Asynchronous", duration: "14:30", url: vid },
      ],
    },
    {
      id: 3,
      title: "Python for Beginners",
      description: "Start coding with Python",
      progress: 73,
      img: "https://www.cromacampus.com/public/uploads/Blog/2023/11/week_1/Python_Programming_Large.webp",
      about: "This course covers the basics of Python programming. Learn the syntax, data types, functions, and more in a beginner-friendly format.",
      videos: [
        { id: 1, title: "Video 1: Introduction to Python", duration: "13:00", url: "https://www.w3schools.com/html/mov_bbb.mp4" },
        { id: 2, title: "Video 2: Data Types in Python", duration: "11:45", url: tmjc },
      ],
    },
    {
      id: 4,
      title: "Machine Learning Basics",
      description: "Get started with Machine Learning",
      progress: 53,
      img: "https://miro.medium.com/v2/resize:fit:1100/format:webp/1*IPXid1JP4fZPUjt7od9CKQ.png",
      about: "This course introduces the basics of machine learning, including supervised learning, and how to implement ML algorithms.",
      videos: [
        { id: 1, title: "Video 1: Introduction to ML", duration: "18:10", url: "https://www.w3schools.com/html/mov_bbb.mp4" },
        { id: 2, title: "Video 2: Supervised Learning", duration: "16:30", url: "https://www.w3schools.com/html/mov_bbb.mp4" },
      ],
    },
    {
      id: 5,
      title: "Web Development with HTML & CSS",
      description: "Master the foundations of web development",
      progress: 20,
      img: "https://media.geeksforgeeks.org/wp-content/cdn-uploads/20221222184908/web-development1.png",
      about: "Learn the fundamental web development skills with HTML and CSS. Build a solid foundation to start creating responsive websites.",
      videos: [
        { id: 1, title: "Video 1: Introduction to HTML", duration: "14:15", url: vid1 },
        { id: 2, title: "Video 2: CSS Basics", duration: "12:30", url: "https://www.w3schools.com/html/mov_bbb.mp4" },
      ],
    },
  ];
  
  

  const [selectedLecture, setSelectedLecture] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLargeScreen, setIsLargeScreen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 1024);
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Initial check

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="w-full">
      {/* Stats */}
      <div className=" w-full mt-4 mb-10 flex flex-wrap gap-4 md:gap-2 lg:gap-4">
        <div className="w-full md:w-[48%] lg:w-[23%] px-3 shadow-md py-4 rounded-md border flex items-center gap-2 justify-between">
          <div className="flex flex-col gap-2">
            <h3 className="text-zinc-700">Courses in Progress</h3>
            <p className=" text-3xl">0</p>
          </div>
          <div className="bg-blue-100 text-blue-700 font-bold text-xl p-4 rounded-md">
            <PiBookOpenBold />
          </div>
        </div>

        <div className="w-full md:w-[48%] lg:w-[23%] px-3 shadow-md py-4 rounded-md border flex items-center gap-2 justify-between">
          <div className="flex flex-col gap-2">
            <h3 className="text-zinc-700">Completed Courses</h3>
            <p className=" text-3xl">0</p>
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
            <p className="bold text-3xl">0</p>
          </div>
          <div className="bg-yellow-300 text-amber-950 font-bold text-xl p-4 rounded-md">
            <GrCertificate />
          </div>
        </div>
      </div>

      {/* Courses Watched */}
      <div>
        <h2 className="text-2xl font-semibold">Continue Learning</h2>
        <div className="mt-4 flex flex-wrap gap-4 md:gap-2 lg:gap-4">
          <ContentCard
            lectures={lectures}
            onLectureClick={(lecture) => setSelectedLecture(lecture)}
            setIsSidebarOpen={setIsSidebarOpen}
            setIsLargeScreen={setIsLargeScreen}
            isSidebarOpen={isSidebarOpen} // Pass sidebar state to ContentCard
            isLargeScreen={isLargeScreen} // Pass screen size state to ContentCard
            
          />
        </div>
      </div>

      {selectedLecture && (
        <div>
          <h3>Selected Lecture:</h3>
          <p>{selectedLecture.title}</p>
          <p>{selectedLecture.description}</p>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;


