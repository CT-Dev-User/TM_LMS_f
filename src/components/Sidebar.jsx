/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import {
  AiOutlineBook,
  AiOutlineHeart,
  AiOutlineHistory,
} from "react-icons/ai";
import { CiMoneyCheck1 } from "react-icons/ci";
import { FaBars, FaTimes } from "react-icons/fa";
import { MdOutlineDashboardCustomize } from "react-icons/md";
import { SlCalender } from "react-icons/sl";
import { NavLink, useNavigate } from "react-router-dom";
import { formatTitle } from "../components/Utils"; // Import the title formatting utility

function Sidebar({ isSidebarOpen, setIsSidebarOpen, user, lectures }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State for dropdown
  const [isLargeScreen, setIsLargeScreen] = useState(false); // State to track if the screen is large
  const navigate = useNavigate(); // Initialize navigate

  const menuItems = [
    { icon: <AiOutlineHeart size={24} />, label: "Wishlist", link: "/" },
    {
      icon: <MdOutlineDashboardCustomize size={24} />,
      label: "Dashboard",
      link: "/dashboard",
    },
    {
      icon: <CiMoneyCheck1 size={24} />,
      label: "Purchase History",
      link: "/purchase-history",
    },
    { icon: <SlCalender size={24} />, label: "Calendar", link: "/calendar" },
  ];

  // Hook to track screen size
  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 1024); // Consider "lg" screen as 1024px and above
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Handle course navigation
  const handleCourseClick = (lecture) => {
    const formattedTitle = formatTitle(lecture.title); // Use utility for title formatting

    navigate(`/playlist/${formattedTitle}`, {
      state: { lecture, isSidebarOpen, isLargeScreen },
    });
  };

  return (
    <>
      {/* Sidebar */}
      <aside
        className={`fixed top-20 inset-y-0 left-0 transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-500 ease-in-out bg-indigo-700 text-white shadow-xl z-50 flex flex-col ${
          isSidebarOpen ? "w-64" : "w-16"
        }`}
      >
        {/* Close Icon for Small Screens */}
        {!isLargeScreen && isSidebarOpen && (
          <div
            className="absolute top-4 right-4 text-2xl cursor-pointer text-white"
            onClick={() => setIsSidebarOpen(false)}
          >
            <FaTimes />
          </div>
        )}

        {/* User Profile Section */}
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
        <nav className="flex-1 mt-4 overflow-y-auto max-h-screen">
          <ul className="space-y-6">
            {/* My Courses Dropdown */}
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
              <ul
                className={`mb-2 ml-2 pl-2 mt-2 space-y-2 transition-all duration-500 ease-in-out ${
                  isDropdownOpen && isSidebarOpen ? "max-h-64" : "max-h-0"
                } overflow-y-auto scrollbar-hidden`}
              >
                {lectures.map((lecture) => (
                  <li
                    key={lecture.id} // Fixed typo here: was lectures.id
                    className="cursor-pointer px-4 py-2 bg-indigo-800 hover:bg-indigo-600 rounded-lg transition-colors duration-300 shadow-md"
                    onClick={() => handleCourseClick(lecture)}
                  >
                    {lecture.title}
                  </li>
                ))}
              </ul>
            </li>

            {/* Other Menu Items */}
            {menuItems.map((item, index) => (
              <NavLink key={index} to={item.link}>
                <li
                  className={`mb-1 pb-3 flex items-center gap-2 px-4 py-2 cursor-pointer ${
                    isSidebarOpen
                      ? "hover:bg-indigo-600 rounded-lg"
                      : "justify-center"
                  } transition-colors duration-300`}
                >
                  {item.icon}
                  {isSidebarOpen && <span>{item.label}</span>}
                </li>
              </NavLink>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Collapsed Sidebar Icons */}
      {!isSidebarOpen && (
        <aside className="mt-20 p-1 fixed inset-y-0 left-0 bg-indigo-700 text-white w-16 shadow-xl z-40 flex flex-col items-center py-6 space-y-6">
          <div
            className="cursor-pointer flex justify-center items-center w-12 h-12 hover:bg-indigo-600 rounded-lg transition-colors duration-300"
            onClick={() => setIsSidebarOpen(true)}
          >
            <FaBars size={24} />
          </div>

          {menuItems.map((item, index) => (
            <NavLink
              key={index}
              to={item.link}
              className="cursor-pointer flex justify-center items-center w-12 h-12 hover:bg-indigo-600 rounded-lg transition-colors duration-300"
            >
              {item.icon}
            </NavLink>
          ))}
        </aside>
      )}
    </>
  );
}

export default Sidebar;