/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState, useEffect, useRef, useCallback } from "react";
import toast from "react-hot-toast";
import { BsInfoCircleFill } from "react-icons/bs";
import { FaCartArrowDown } from "react-icons/fa";
import { IoMdHome, IoMdLogOut } from "react-icons/io";
import { IoPersonSharp, IoSchool } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import { UserData } from "../../context/UserContext";

function DropdownMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { user } = UserData();
  const { setIsAuth, setUser } = UserData();

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
    if (!name) return '';
    const [firstName, lastName] = name.split(' ');
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  };

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    setIsAuth(false);
    toast.success("Logout Successfully");
    navigate("/");
  };

  return (
    <div ref={dropdownRef} className="relative">
      <div
        className="dropdown-icon w-10 h-10 flex items-center justify-center rounded-full bg-gray-200 text-purple-600 cursor-pointer"
        onClick={toggleDropdown}
      >
        <div className="menu-icon text-xl">≡</div>
      </div>

      {isOpen && (
        <div className="dropdown-content absolute right-0 mt-2 w-60 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <div className="p-6 text-center animate-fadeIn">
            {user?.profileImage || localStorage.getItem('profileImage') ? (
              <img
                src={user?.profileImage || localStorage.getItem('profileImage')}
                alt={user?.name}
                className="w-24 h-24 rounded-full mx-auto border-4 border-white transition-transform duration-300 hover:scale-105"
              />
            ) : (
              <div 
                className="w-24 h-24 rounded-full bg-[#007BFF] flex items-center justify-center text-white text-2xl mx-auto border-4 border-white"
                title={`${user?.name}`}
              >
                {getInitials(user?.name || '')}
              </div>
            )}
            <h2 className="text-lg font-bold mt-4 animate-fadeIn">{user?.name}</h2>
            <p className="text-sm text-indigo-200 animate-fadeIn">{user?.email}</p>
          </div>
          <div className="py-1">
            {isMobile && (
              <>
                <Link
                  to="/"
                  className="flex items-center gap-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-purple-200 hover:border-l-4 hover:border-purple-600"
                >
                  <IoMdHome /> Home
                </Link>
                <Link
                  to="/about"
                  className="flex items-center gap-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-purple-200 hover:border-l-4 hover:border-purple-600"
                >
                  <BsInfoCircleFill /> About
                </Link>
              </>
            )}
            <Link
              to="/my-courses"
              className="flex items-center gap-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-purple-200 hover:border-l-4 hover:border-purple-600"
            >
              <IoSchool /> My Courses
            </Link>
            <Link
              to="/purchase-history"
              className="flex items-center gap-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-purple-200 hover:border-l-4 hover:border-purple-600"
            >
              <FaCartArrowDown /> Purchase History
            </Link>
            <Link
              to="/profile"
              className="flex items-center gap-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-purple-200 hover:border-l-4 hover:border-purple-600"
              onClick={toggleDropdown}
            >
              <IoPersonSharp /> Profile
            </Link>
            <div className="border-t border-gray-200"></div>
            <button
              onClick={handleLogout}
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