/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import {
  AiOutlineBook,
  AiOutlineHeart,
  AiOutlineHistory,
} from "react-icons/ai";
import { FaBars, FaTimes } from "react-icons/fa"; 

function Sidebar({ isSidebarOpen, setIsSidebarOpen, user }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State for dropdown
  const [isLargeScreen, setIsLargeScreen] = useState(false); // State to track if the screen is large

  const menuItems = [
    { icon: <AiOutlineHeart size={24} />, label: "Wishlist" },
    { icon: <AiOutlineHistory size={24} />, label: "Purchase History" },
  ];

  const courses = [
    "React",
    "Next.js",
    "TypeScript",
    "Game Development",
    "Python Programming",
    "JavaScript Basics",
    "Machine Learning",
    "Full Stack Development",
    "Cloud Computing",
    "AI Programming", // Added more courses for scrollable content
  ]; // List of courses

  // Hook to track screen size
  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 1024); // Consider "lg" screen as 1024px and above
    };

    // Call the handler on mount
    handleResize();

    // Set up the resize event listener
    window.addEventListener("resize", handleResize);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      {/* Overlay background */}
      <div
        className={`fixed inset-0 z-40   transition-opacity duration-300 ${
          isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsSidebarOpen(false)}
      ></div>

      {/* Sidebar */}
      <aside
        className={`fixed top-20 inset-y-0 left-0 transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-500 ease-in-out bg-indigo-700 text-white shadow-xl z-50 flex flex-col ${
          isSidebarOpen ? "w-64" : "w-16"
        }`}
        style={{
          // Ensure the sidebar is fixed and doesn't push content to the right
          position: "fixed", 
        }}
      >
        {/* Cross Icon (above the user image) when sidebar is open and screen is small */}
        {!isLargeScreen && isSidebarOpen && (
          <div
            className="absolute top-4 right-4 text-2xl cursor-pointer text-white"
            onClick={() => setIsSidebarOpen(false)} // Close sidebar on click
          >
            <FaTimes />
          </div>
        )}

        {/* User Profile */}
        {isSidebarOpen && (
          <div className="p-6 text-center">
            <img
              src={user.profilePic}
              alt="User Profile"
              className="w-24 h-24 rounded-full mx-auto border-4 border-white transition-transform duration-300 hover:scale-105"
            />
            <h2 className="text-lg font-bold mt-4">{user.name}</h2>
            <p className="text-sm text-indigo-200">{user.email}</p>
          </div>
        )}

        {/* Sidebar Menu */}
        <nav className="flex-1 mt-4 overflow-y-auto max-h-screen"> {/* Sidebar content scrollable */}
          <ul className="space-y-6">
            {/* My Courses with Dropdown */}
            <li>
              <div
                className="flex items-center justify-between gap-4 px-4 py-2 cursor-pointer hover:bg-indigo-600 rounded-lg transition-all duration-300"
                onClick={() => setIsDropdownOpen((prev) => !prev)}
              >
                <div className="flex items-center gap-4">
                  <AiOutlineBook size={24} />
                  {isSidebarOpen && <span>My Courses</span>}
                </div>
                {isSidebarOpen && (
                  <span
                    className={`transition-transform duration-300 ${
                      isDropdownOpen ? "rotate-90" : "rotate-0"
                    }`}
                  >
                    &gt;
                  </span>
                )}
              </div>
              {/* Dropdown with Custom Scroll */}
              <ul
                className={`pl-8 mt-2 space-y-2 transition-all duration-500 ease-in-out ${
                  isDropdownOpen && isSidebarOpen ? "max-h-64" : "max-h-0"
                } overflow-y-auto scrollbar-hidden`}
              >
                {courses.map((course, index) => (
                  <li
                    key={index}
                    className="cursor-pointer px-4 py-2 bg-indigo-800 hover:bg-indigo-600 rounded-lg transition-colors duration-300 shadow-md"
                  >
                    {course}
                  </li>
                ))}
              </ul>
            </li>

            {/* Other Menu Items */}
            {menuItems.map((item, index) => (
              <li
                key={index}
                className={`flex items-center gap-4 px-4 py-2 cursor-pointer ${
                  isSidebarOpen
                    ? "hover:bg-indigo-600 rounded-lg"
                    : "justify-center"
                } transition-colors duration-300`}
              >
                {item.icon}
                {isSidebarOpen && <span>{item.label}</span>}
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Always Visible Icons (Collapsed Sidebar) */}
      {!isSidebarOpen && (
        <aside className="mt-20 p-1 fixed inset-y-0 left-0 bg-indigo-700 text-white w-16 shadow-xl z-40 flex flex-col items-center py-6 space-y-6">
          {/* Hamburger Icon visible only when sidebar is collapsed */}
          <div
            className="cursor-pointer flex justify-center items-center w-12 h-12 hover:bg-indigo-600 rounded-lg transition-colors duration-300"
            onClick={() => setIsSidebarOpen(true)} // Open sidebar on click
          >
            <FaBars size={24} />
          </div>

          {/* Other menu icons */}
          {[...menuItems.slice(1), { icon: <AiOutlineBook size={24} /> }].map(
            (item, index) => (
              <div
                key={index}
                className="cursor-pointer flex justify-center items-center w-12 h-12 hover:bg-indigo-600 rounded-lg transition-colors duration-300"
                onClick={() => setIsSidebarOpen(true)} // Open sidebar on click
              >
                {item.icon}
              </div>
            )
          )}
        </aside>
      )}
    </>
  );
}

export default Sidebar;
