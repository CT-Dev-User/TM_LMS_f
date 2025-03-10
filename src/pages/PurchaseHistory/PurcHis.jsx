import React, { useEffect, useState } from "react";
import { IoMdHome } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar/Sidebar";
import { CourseData } from "../../context/CourseContext";
import { UserData } from "../../context/UserContext";
import { server } from "../../main";

const Purchasehistory = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  const { mycourse: myCourses, fetchMyCourse } = CourseData();
  const [error, setError] = useState(null);
  const { user } = UserData();
  const [searchQuery, setSearchQuery] = useState("");
  const [timeFilter, setTimeFilter] = useState("All Time");
  const navigate = useNavigate();
  const filteredCourses = myCourses?.filter((course) =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.createdBy.toLowerCase().includes(searchQuery.toLowerCase())
  );


  const handleStudyClick = (course) => {
    const safeTitle = course.title.toLowerCase().replace(/[^a-zA-Z0-9]/g, "-");
    navigate(`/${safeTitle}/lectures/${course._id}`, {
      state: { course },
    });
  };
  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 1024);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!myCourses || myCourses.length === 0) {
      fetchMyCourse().catch(() => setError("Failed to load your courses"));
    }
  }, [fetchMyCourse, myCourses]);

  if (!myCourses) return <div className="h-screen flex items-center justify-center animate-pulse">Loading...</div>;
  if (error) return <div className="h-screen flex items-center justify-center text-red-500">Error: {error}</div>;

  return (
    <div className="w-full flex flex-col min-h-screen bg-gray-50">
      <div className="flex flex-grow relative">
        <div className={`custom-margin w-[16%] ml-8 md:w-[10%] lg:w-[1%] ipad:w-[17%] ipad-landscape:w-[17%] ipad-pro:w-[17%] ipad-pro-landscape:w-[17%] ${isSidebarOpen || isLargeScreen ? "block" : "hidden"}`}>
          <Sidebar
            isSidebarOpen={isSidebarOpen || isLargeScreen}
            setIsSidebarOpen={setIsSidebarOpen}
            user={user}
            course={myCourses}
          />
        </div>

        <main className={`flex-grow p-4 sm:p-6 animate-fadeIn ${isSidebarOpen || isLargeScreen ? "lg:ml-[12%] ipad:ml-[12%] ipad-landscape:ml-[12%] ipad-pro:ml-[12%] ipad-pro-landscape:ml-[15%]" : ""}`}>
          <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-md p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Purchase History</h1>
                <p className="text-gray-600 text-sm sm:text-base mt-1">View your course purchases</p>
              </div>
            </div>

            <div className="mb-6">
              <input
                type="text"
                placeholder="Search by course, category or instructor..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 transition-all"
              />
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                    <th className="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell ">Instructor</th>
                    <th className="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden xl:table-cell ">Amount</th>
                    <th className="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden xl:table-cell ">Purchase Date</th>
                    <th className="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Category</th>
                    <th className="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Duration</th>
                    <th className="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredCourses.length > 0 ? (
                    filteredCourses.map((course) => (
                      <tr key={course._id} className="hover:bg-gray-50">
                        <td className="px-3 py-2 sm:px-6 sm:py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <img
                              src={`${server}/${course.image}`}
                              alt={course.title}
                              className="h-8 w-8 sm:h-10 sm:w-10 rounded-full object-cover"
                            />
                            <div className="ml-2 sm:ml-4">
                              <div className="text-xs sm:text-sm font-medium text-gray-900">{course.title}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-3  py-2 sm:px-6 sm:py-4 whitespace-nowrap hidden sm:table-cell">
                          <div className="text-xs sm:text-sm text-gray-900">{course.createdBy}</div>
                        </td>
                        <td className="px-4  py-2 sm:px-6 sm:py-4 whitespace-nowrap hidden xl:table-cell">
                          <div className="text-xs sm:text-sm text-gray-900">₹{course.price}</div>
                        </td>
                        <td className="px-4 py-2 sm:px-6 sm:py-4 whitespace-nowrap hidden xl:table-cell">
                          <div className="text-xs sm:text-sm text-gray-900">
                            {new Date(course.purchaseDate).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-3 py-2 sm:px-6 sm:py-4 whitespace-nowrap hidden sm:table-cell">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                            {course.category}
                          </span>
                        </td>
                        <td className="px-3 py-2 sm:px-6 sm:py-4 whitespace-nowrap hidden sm:table-cell text-xs sm:text-sm text-gray-500">
                          {course.duration} Weeks
                        </td>
                        <td className="px-3 py-2 sm:px-6 sm:py-4 whitespace-nowrap">
                          <button
                            onClick={() => handleStudyClick(course)}
                            className="bg-yellow-200 font-bold text-yellow-800 hover:bg-yellow-400 px-2 sm:px-4 py-1 sm:py-2 rounded-md transition-colors duration-200 text-xs sm:text-sm"
                          >
                            Study
                          </button>

                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="px-3 py-4 text-center">
                        <div className="flex flex-col items-center justify-center space-y-4">
                          <p className="text-gray-500 text-sm md:text-base xl:text-lg">No courses found matching your search</p>
                          <Link
                            to="/"
                            className="flex items-center gap-2 px-6 py-3 text-sm md:text-base xl:text-lg text-gray-700 bg-gray-100 hover:bg-purple-200 rounded-lg transition-all duration-200 hover:shadow-md transform hover:-translate-y-0.5 hover:border-4 hover:border-purple-600"
                          >
                            <IoMdHome className="text-xl md:text-2xl" />
                            <span>Return Home</span>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Purchasehistory;
