import React from "react";
import { Link } from "react-router-dom";
import { AiFillHome, AiOutlineLogout } from "react-icons/ai";
import { FaBook, FaUserAlt } from "react-icons/fa";

const Sidebar = () => {
  return (
    <div className="w-64 min-h-screen bg-gray-900 text-white shadow-lg">
      <div className="p-6 text-xl font-bold text-center border-b border-gray-700">
        Admin Panel
      </div>
      <ul className="mt-6 space-y-2">
        <li>
          <Link
            to="/admin/dashboard"
            className="flex items-center p-3 space-x-3 hover:bg-gray-800 transition-all rounded-md"
          >
            <AiFillHome className="text-xl" />
            <span>Admin Dashboard</span>
          </Link>
        </li>

        <li>
          <Link
            to="/admin/course"
            className="flex items-center p-3 space-x-3 hover:bg-gray-800 transition-all rounded-md"
          >
            <FaBook className="text-xl" />
            <span>Courses</span>
          </Link>
        </li>

        <li>
          <Link
            to="/admin/users"
            className="flex items-center p-3 space-x-3 hover:bg-gray-800 transition-all rounded-md"
          >
            <FaUserAlt className="text-xl" />
            <span>Users</span>
          </Link>
        </li>

      </ul>
    </div>
  );
};

export default Sidebar;
