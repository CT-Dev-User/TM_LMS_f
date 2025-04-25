/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { BsFillChatRightTextFill, BsInfoCircleFill } from "react-icons/bs";
import { CgProfile } from "react-icons/cg";
import { FaBook, FaCartArrowDown, FaUserAlt } from "react-icons/fa";
import { IoMdHome, IoMdLogOut } from "react-icons/io";
import { IoSchool } from "react-icons/io5";
import { MdDashboard } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { UserData } from "../../context/UserContext";

function DropdownMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { user, logoutUser } = UserData();

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleClickOutside = useCallback((event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, handleClickOutside]);

  // Function to generate initials from name
  const getInitials = (name) => {
    if (!name) return "";
    const [firstName, lastName] = name.split(" ");
    return `${firstName?.charAt(0) || ""}${lastName?.charAt(0) || ""}`.toUpperCase();
  };

  return (
    <div ref={dropdownRef} className="relative">
      <div
        className="user-avatar w-10 h-10 flex items-center justify-center rounded-full bg-gray-200 cursor-pointer ring-2 ring-gray-300 dark:ring-gray-500"
        onClick={toggleDropdown}
      >
        {user?.profileImage ? (
          <img
            src={user.profileImage}
            alt={user?.name || "User"}
            className="w-full h-full object-cover rounded-full"
          />
        ) : (
          <div
            className="w-full h-full rounded-full bg-[#007BFF] flex items-center justify-center text-white text-sm"
            title={`${user?.name || "User"}`}
          >
            {getInitials(user?.name || "")}
          </div>
        )}
      </div>

      {isOpen && (
        <div className="dropdown-content absolute right-0 mt-2 w-60 bg-white border border-purple-600 rounded-lg shadow-lg z-50">
          <div className="p-6 text-center animate-fadeIn">
            {user?.profileImage ? (
              <img
                src={user.profileImage}
                alt={user?.name || "User"}
                className="w-24 h-24 rounded-full mx-auto border-4 border-white transition-transform duration-300 hover:scale-105"
              />
            ) : (
              <div
                className="w-24 h-24 rounded-full bg-[#007BFF] flex items-center justify-center text-white text-2xl mx-auto border-4 border-white"
                title={`${user?.name || "User"}`}
              >
                {getInitials(user?.name || "")}
              </div>
            )}
            <h2 className="text-lg font-bold mt-4 animate-fadeIn">{user?.name || "User"}</h2>
          </div>
          <div className="py-1">
            <Link
              to="/"
              className="flex items-center gap-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-purple-200 hover:border-l-4 hover:border-purple-600"
              onClick={toggleDropdown}
            >
              <IoMdHome /> Home
            </Link>

            {user?.role === "admin" && (
              <Link
                to="/admin/course"
                className="flex items-center gap-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-purple-200 hover:border-l-4 hover:border-purple-600"
                onClick={toggleDropdown}
              >
                <FaBook /> Courses
              </Link>
            )}
            {user?.role === "admin" && (
              <Link
                to="/admin/users"
                className="flex items-center gap-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-purple-200 hover:border-l-4 hover:border-purple-600"
                onClick={toggleDropdown}
              >
                <FaUserAlt /> Users
              </Link>
            )}

            {user?.role === "user" && (
              <>
                <Link
                  to="/my-courses"
                  className="flex items-center gap-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-purple-200 hover:border-l-4 hover:border-purple-600"
                  onClick={toggleDropdown}
                >
                  <IoSchool /> My Courses
                </Link>
                <Link
                  to="/purchase-history"
                  className="flex items-center gap-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-purple-200 hover:border-l-4 hover:border-purple-600"
                  onClick={toggleDropdown}
                >
                  <FaCartArrowDown /> Purchase History
                </Link>
              </>
            )}
            {user?.role === "instructor" && (
              <Link
                to="/instructor/dashboard"
                className="flex items-center gap-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-purple-200 hover:border-l-4 hover:border-purple-600"
                onClick={toggleDropdown}
              >
                <MdDashboard /> Instructor Dashboard
              </Link>
            )}
            {user?.role === "instructor" && (
              <Link
                to="/instructor/payoutreport"
                className="flex items-center gap-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-purple-200 hover:border-l-4 hover:border-purple-600"
                onClick={toggleDropdown}
              >
                <BsFillChatRightTextFill /> Payment Report
              </Link>
            )}
            {user?.role === "instructor" && (
              <Link
                to="/instructor/course"
                className="flex items-center gap-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-purple-200 hover:border-l-4 hover:border-purple-600"
                onClick={toggleDropdown}
              >
                <FaBook /> Courses
              </Link>
            )}
            {user?.role === "instructor" && (
              <Link
                to="/instructor/students"
                className="flex items-center gap-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-purple-200 hover:border-l-4 hover:border-purple-600"
                onClick={toggleDropdown}
              >
                <FaUserAlt /> Students
              </Link>
            )}
            <Link
              to="/profile"
              className="flex items-center gap-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-purple-200 hover:border-l-4 hover:border-purple-600"
              onClick={toggleDropdown}
            >
              <CgProfile /> Profile
            </Link>
            <Link
              to="/about"
              className="flex items-center gap-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-purple-200 hover:border-l-4 hover:border-purple-600"
              onClick={toggleDropdown}
            >
              <BsInfoCircleFill /> About
            </Link>
            {user?.role === "admin" && (
              <button
                onClick={() => {
                  navigate(`/admin/dashboard`);
                  toggleDropdown();
                }}
                className="w-full flex items-center gap-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-purple-200 hover:border-l-4 hover:border-purple-600"
              >
                <MdDashboard /> Admin Dashboard
              </button>
            )}

            <div className="border-t border-gray-200"></div>
            <button
              onClick={() => logoutUser(navigate)}
              className="w-full flex items-center gap-x-2 px-4 py-2 text-sm text-red-600 hover:bg-red-100 hover:border-l-4 hover:border-red-600"
            >
              <IoMdLogOut /> Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DropdownMenu;