import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar/Sidebar";
import { CourseData } from "../../context/CourseContext";
import { UserData } from "../../context/UserContext";
import { server } from "../../main";

const PurchaseHistory = () => {
  const { mycourse: myCourses, fetchMyCourse } = CourseData();
  const { user } = UserData();
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 1024);

  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 1024);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!myCourses || myCourses.length === 0) {
      fetchMyCourse().catch(() => setError("Failed to load your courses"));
    }
  }, [fetchMyCourse, myCourses]);

  const handleStudyClick = (course) => {
    const safeTitle = course.title.toLowerCase().replace(/[^a-zA-Z0-9]/g, "-");
    navigate(`/${safeTitle}/lectures/${course._id}`, { state: { course } });
  };

  const filteredCourses = myCourses?.filter((course) =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.createdBy.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!myCourses) return <div className="h-screen flex items-center justify-center animate-pulse">Loading...</div>;
  if (error) return <div className="h-screen flex items-center justify-center text-red-500">Error: {error}</div>;

  return (
    <div className="flex bg-gray-100 min-h-screen">
      {/* Sidebar - Hidden on Small and Medium Screens */}
      {isLargeScreen && (
        <Sidebar user={user} course={myCourses} />
      )}

      {/* Main Content - Expands Fully on Small & Medium Screens */}
      <div className={`flex-grow p-6 ${isLargeScreen ? "ml-[50px]" : "ml-0"}`}>
        <div className="max-w-7xl mx-auto bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold text-gray-800">Purchase History</h1>
          <p className="text-gray-600 text-sm mt-1">View your purchased courses</p>

          {/* Search Input */}
          <div className="mt-4">
            <input
              type="text"
              placeholder="Search by course, category, or instructor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-purple-600"
            />
          </div>

          <div className="overflow-x-auto mt-6">
            {/* Table View for Large Screens */}
            <div className="hidden lg:block">
              <table className="w-full border border-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Course</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Instructor</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Duration</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredCourses.length > 0 ? (
                    filteredCourses.map((course) => (
                      <tr key={course._id} className="hover:bg-gray-50">
                        <td className="px-4 py-2 flex items-center">
                          <img src={course.image} alt={course.title} className="h-10 w-10 rounded-full object-cover" />
                          <span className="ml-4 text-sm font-medium text-gray-900">{course.title}</span>
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-900">{course.createdBy}</td>
                        <td className="px-4 py-2 text-sm text-gray-900">₹{course.price}</td>
                        <td className="px-4 py-2 text-sm text-gray-900">{course.category}</td>
                        <td className="px-4 py-2 text-sm text-gray-500">{course.duration} Weeks</td>
                        <td className="px-4 py-2">
                          <button
                            onClick={() => handleStudyClick(course)}
                            className="bg-yellow-200 font-bold text-yellow-800 hover:bg-yellow-400 px-4 py-2 rounded-md transition"
                          >
                            Study
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-4 py-4 text-center text-gray-500">No courses found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Card View for Small Screens */}
            <div className="lg:hidden">
              {filteredCourses.length > 0 ? (
                filteredCourses.map((course) => (
                  <div key={course._id} className="bg-white shadow-md rounded-lg p-4 mb-4">
                    <div className="flex items-center">
                      <img src={course.image} alt={course.title} className="h-14 w-14 rounded-full object-cover" />
                      <div className="ml-4">
                        <h2 className="text-lg font-bold text-gray-900">{course.title}</h2>
                        <p className="text-sm text-gray-600">Instructor: {course.createdBy}</p>
                        <p className="text-sm text-gray-600">Category: {course.category}</p>
                      </div>
                    </div>
                    <div className="mt-4 flex justify-between items-center">
                      <span className="text-sm text-gray-800 font-semibold">₹{course.price}</span>
                      <span className="text-xs text-gray-500">{course.duration} Weeks</span>
                      <button
                        onClick={() => handleStudyClick(course)}
                        className="bg-yellow-200 text-sm font-bold text-yellow-800 hover:bg-yellow-400 px-3 py-2 rounded-md transition"
                      >
                        Study
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500">No courses found.</div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PurchaseHistory;
