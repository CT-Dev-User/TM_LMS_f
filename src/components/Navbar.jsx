/* eslint-disable no-unused-vars */
import React from "react";
import { AiOutlineLogout } from "react-icons/ai"; // Import logout icon
import logo from "../assets/profile.jpg";

function Navbar() {
  const handleLogout = () => {
    // Add your logout functionality here
    console.log("Logged out!");
  };

  return (
    <>
      {/* Header */}
      <header className="p-5 flex items-center justify-between bg-indigo-600 text-white shadow-md z-20 fixed w-full top-0 left-0">
        {/* LMS Logo and Name */}
        <div className="flex items-center cursor-pointer">
          <img
            src={logo} // Placeholder logo
            alt="LMS Logo"
            className="h-10 w-10 rounded-full mr-2"
          />
          <h1 className="text-xl font-bold">LMS Dashboard</h1>
        </div>

        {/* Logout Icon and Text Combined */}
        <div
          onClick={handleLogout}
          className="flex items-center space-x-2 cursor-pointer hover:text-red-500 transition-colors duration-300"
        >
          <AiOutlineLogout className="text-white text-2xl" />
          <span className="hidden sm:inline text-white text-lg pb-1">Logout</span>
        </div>
      </header>
    </>
  );
}

export default Navbar;
