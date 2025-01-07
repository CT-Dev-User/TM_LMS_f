/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import ContentCard from "../common components/ContentCard";
import { BiCheckCircle } from "react-icons/bi";
import { FaRegClock } from "react-icons/fa";
import { GrCertificate } from "react-icons/gr";
import { PiBookOpenBold } from "react-icons/pi";
// import { progress } from "framer-motion";

const DashboardPage = ({lectures}) => {
  
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
    <div className="w-full h-full">
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


