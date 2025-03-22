// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { AiFillHome, AiOutlineMenu } from "react-icons/ai";
import { FaBook, FaUserAlt } from "react-icons/fa";

const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => {
      const isLarge = window.innerWidth >= 1024;
      setIsLargeScreen(isLarge);
      setIsSidebarOpen(isLarge); // Open by default on large screens
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    if (!isLargeScreen) { // Only toggle on small/medium screens
      setIsSidebarOpen(!isSidebarOpen);
    }
  };

  const menuItems = [
    { path: "/admin/dashboard", icon: <AiFillHome size={24} />, label: "Dashboard"},
    { path: "/admin/course", icon: <FaBook size={24} />, label: "Course" },
    { path: "/admin/users", icon: <FaUserAlt size={24} />, label: "Users" },
  ];

  return (
    <div className="relative">
      {/* Sidebar */}
      <div
        className={`absolute h-full bg-gray-900 text-white shadow-lg transition-all duration-300 ease-in-out z-50 ${
          isSidebarOpen ? "w-64" : "w-16"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="p-4 flex justify-between items-center border-b border-gray-700">
            {!isLargeScreen && ( // Hide hamburger on large screens
              <button onClick={toggleSidebar} className="text-lg">
                <AiOutlineMenu />
              </button>
            )}
            {isSidebarOpen && <span className="font-bold">Admin Panel</span>}
          </div>

          {/* Sidebar Menu */}
          <ul className="mt-4 space-y-1 flex-grow overflow-y-auto">
            {menuItems.map((item, index) => (
              <li key={index}>
                <Link
                  to={item.path}
                  onClick={() => {
                    if (!isLargeScreen) toggleSidebar();
                  }}
                  className={`flex items-center p-4 hover:bg-gray-800 transition-all rounded-md ${
                    location.pathname === item.path ? "bg-gray-800" : ""
                  }`}
                >
                  <div className="text-lg">{item.icon}</div>
                  <span className={`ml-3 transition-opacity ${isSidebarOpen ? "opacity-100" : "opacity-0 hidden"}`}>
                    {item.label}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Overlay to Prevent Clicking Content When Sidebar is Open */}
      {isSidebarOpen && !isLargeScreen && (
        <div
          className="z-40"
          onClick={toggleSidebar}
        ></div>
      )}
    </div>
  );
};

export default Sidebar;