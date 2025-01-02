// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "./Navbar";
import img from "../assets/profile.jpg";
import Routing from "../Routing";
import vid from "../assets/vid.mp4";
import tmjc from "../assets/tjmc.mp4";
import vid1 from "../assets/vid1.mp4";
const Home = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(false);
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
          { id: 2, title: "Video 2: Supervised Learning", duration: "16:30", url: vid },
          { id: 3, title: "Video 3: Introduction to ML", duration: "18:10", url: "" },
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
        ]
    },
  ];

  const user = {
    name: "John Doe",
    email: "johndoe@example.com",
    profilePic: img,
  };


  
// Disable right-click and developer tools
  useEffect(() => {
    const disableRightClick = (e) => {
      e.preventDefault();
    };

    const blockDevToolsShortcuts = (e) => {
      // Disable F12, Ctrl+Shift+I, and Ctrl+Shift+J
      if (
        (e.key === "F12") ||
        (e.ctrlKey && e.shiftKey && (e.key === "I" || e.key === "J"))
      ) {
        e.preventDefault();
      }
    };

    // Disable right-click
    document.addEventListener("contextmenu", disableRightClick);

    // Block developer tools shortcuts
    document.addEventListener("keydown", blockDevToolsShortcuts);

    // Cleanup listeners when component is unmounted
    return () => {
      document.removeEventListener("contextmenu", disableRightClick);
      document.removeEventListener("keydown", blockDevToolsShortcuts);
    };
  }, []);
  

  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 1024);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />
<div className="flex custom-margin">      
          <div className=" w-[16%] md:w-[10%] lg:w-[17%] ">
            <Sidebar
              isSidebarOpen={isSidebarOpen || isLargeScreen}
              setIsSidebarOpen={setIsSidebarOpen}
              user={user}
              lectures={lectures}
            />
          </div>
        
        <main className="w-[84%] md:w-[90%] lg:w-[85%] p-4 mt-20">
          {/* Pass the states as props to Routing */}
          <Routing
            isSidebarOpen={isSidebarOpen}
            isLargeScreen={isLargeScreen}
          />
        </main>
      </div>
    </div>
  );
};

export default Home;
