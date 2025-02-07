import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import { CourseData } from "../../context/CourseContext";
import { UserData } from "../../context/UserContext";
import ContentCard from "../dashboard/ContentCard.jsx";

const Purchasehistory = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  const { mycourse: myCourses, fetchMyCourse } = CourseData();
  const [error, setError] = useState(null);

  const { user } = UserData();

  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 1024);
    };
    window.addEventListener("resize", handleResize);
    handleResize(); // Initial check
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!myCourses || myCourses.length === 0) {
      fetchMyCourse().catch(() => setError("Failed to load your courses"));
    }
  }, [fetchMyCourse, myCourses]);

  if (!myCourses)
    return (
      <div className=" h-screen flex items-center justify-center animate-pulse">
        Loading...
      </div>
    );

  if (error)
    return (
      <div className="h-screen flex items-center justify-center animate-pulse">
        Error: {error}
      </div>
    );

  return (
    <div className="w-full flex flex-col min-h-screen">
      <div className="flex flex-grow relative">
        {/* Sidebar */}
        <div
          className={`custom-margin w-[16%] ml-8 md:w-[10%] lg:w-[1%] ipad:w-[17%] ipad-landscape:w-[17%] ipad-pro:w-[17%] ipad-pro-landscape:w-[17%] ${
            isSidebarOpen || isLargeScreen ? "block" : "hidden"
          }`}
        >
          <Sidebar
            isSidebarOpen={isSidebarOpen || isLargeScreen}
            setIsSidebarOpen={setIsSidebarOpen}
            user={user}
            course={myCourses}
          />
        </div>

        {/* Main Content */}
        <main
          className={`flex-grow p-4 animate-fadeIn ${
            isSidebarOpen || isLargeScreen
              ? "lg:ml-[17%] ipad:ml-[17%] ipad-landscape:ml-[17%] ipad-pro:ml-[17%] ipad-pro-landscape:ml-[20%]"
              : ""
          }`}
        >
          {/* Courses Section */}
          <div className="animate-fadeIn">
            {myCourses.length > 0 ? (
              <>
                <h2 className="text-2xl font-semibold pb-5">Purchase History</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 ipadpro:grid-cols-2 ipadpro-landscape:grid-cols-3 gap-4 mt-4">
                  {myCourses.map((course) => (
                    <ContentCard key={course._id} course={course} />
                  ))}
                </div>
              </>
            ) : (
              <p className="text-2xl font-semibold pb-5">No Courses Enrolled Yet</p>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

// Reusable Stats Card Component
const StatCard = ({ title, count, icon, bgColor, textColor }) => (
  <div className="w-full sm:w-[48%] md:w-[48%] lg:w-[23%] xl:w-[23%] px-3 shadow-md py-4 rounded-md border flex items-center gap-2 justify-between animate-fadeIn">
    <div className="flex flex-col gap-2">
      <h3 className="text-zinc-700">{title}</h3>
      <p className="text-3xl">{count}</p>
    </div>
    <div className={`${bgColor} ${textColor} font-bold text-xl p-4 rounded-md`}>
      {icon}
    </div>
  </div>
);

export default Purchasehistory;
