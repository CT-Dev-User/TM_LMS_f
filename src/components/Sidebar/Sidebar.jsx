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
import { BsPersonCircle, BsInfoCircle } from "react-icons/bs"; // Added icons for About and Accounts

import { NavLink, useNavigate } from "react-router-dom";

function Sidebar({ user, course }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  const navigate = useNavigate();

  // Updated menuItems with new entries
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
    { icon: <BsInfoCircle size={24} />, label: "About", link: "/about" },
    { icon: <BsPersonCircle size={24} />, label: "Account", link: "/account" },
  ];

  const handleCourseClick = (course) => {
    if (!course._id || !course.title) {
      console.error("Course ID or title is missing", course);
      return;
    }
  
    // Assuming course.title is URL-safe, if not, you might need to encode it
    const safeTitle = encodeURIComponent(course.title.replace(/ /g, '-').toLowerCase());
    
    navigate(`/${safeTitle}/lectures/${course._id}`, {
      state: { course, isSidebarOpen, isLargeScreen },
    });
  };

  useEffect(() => {
    const handleResize = () => {
      const isLarge = window.innerWidth >= 1024;
      setIsLargeScreen(isLarge);
      setIsSidebarOpen(isLarge); // Sidebar open by default on large screens
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <aside
        className={`absolute top-0 left-0 transform ${
          isSidebarOpen || isLargeScreen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-500 ease-in-out bg-[#8a5baf] text-white shadow-xl z-50 flex flex-col ${
          isSidebarOpen || isLargeScreen ? "w-64" : "w-16"
        } h-full`}
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
        <nav className="flex-1 overflow-y-auto max-h-full">
          <ul className="space-y-6 px-2">
            {/* My Courses Dropdown */}
            <li>
              <div
                className="flex items-center justify-between gap-4 px-4 py-2 cursor-pointer hover:bg-[#9f68c9] rounded-lg transition-all duration-300"
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
                  ></span>
                )}
              </div>
              <ul
                className={`mb-2 ml-2 pl-2 mt-2 space-y-2 transition-all duration-500 ease-in-out ${
                  isDropdownOpen && isSidebarOpen ? "max-h-64" : "max-h-0"
                } overflow-y-auto scrollbar-hidden`}
              >
                {course.map((c) => (
                  <li
                    key={c.id}
                    className="cursor-pointer px-4 py-2 bg-[#8a5baf] hover:bg-[#9f68c9] rounded-lg transition-colors duration-300 shadow-md"
                    onClick={() => handleCourseClick(c)}
                  >
                    {c.title}
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
                      ? "hover:bg-[#9f68c9] rounded-lg"
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
        <aside
          className={` pt-10 space-y-2 absolute top-0 left-0 transform ${
            !isSidebarOpen || isLargeScreen
              ? "translate-x-0"
              : "-translate-x-full"
          } transition-transform duration-500 ease-in-out bg-[#8a5baf] text-white shadow-xl z-50 flex flex-col ${
            isSidebarOpen || isLargeScreen ? "w-64" : "w-16"
          } h-full`}
        >
          <div
            className="cursor-pointer flex justify-center items-center w-12 h-12 hover:bg-[#9f68c9] rounded-lg transition-colors duration-300"
            onClick={() => setIsSidebarOpen(true)}
          >
            <FaBars size={24} />
          </div>

          {menuItems.map((item, index) => (
            <NavLink
              key={index}
              to={item.link}
              className="cursor-pointer flex justify-center items-center w-12 h-12 hover:bg-[#9f68c9] rounded-lg transition-colors duration-300"
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