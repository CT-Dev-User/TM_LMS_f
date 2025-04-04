import React from 'react';
import { Link } from 'react-router-dom';
import DropdownMenu from '../../pages/Dropdownmenu/dropdown.jsx';
import { UserData } from "../../context/UserContext";

const Header = ({ isAuth, handleLogout }) => {
  const { user } = UserData(); // Fetch user data from context

  return (
    <header className="flex justify-between items-center px-5 py-4 bg-white shadow-sm">
      {/* Logo Section */}
      <div className="logo text-2xl font-semibold text-[#8a4baf]">
        Tech Momentum
      </div>
      
      {/* Navigation Links */}
      <div className="flex items-center gap-4 sm:gap-6 lg:gap-8">
        {/* Links for Medium and Large Screens */}
        <nav className="hidden sm:flex items-center gap-6 lg:gap-8">
          <Link to="/" className="text-gray-800 hover:text-[#8a4baf] transition-colors duration-300">
            Home
          </Link>
          <Link to="/about" className="text-gray-800 hover:text-[#8a4baf] transition-colors duration-300">
            About
          </Link>
          {!isAuth ? (
            <Link to="/login" className="text-gray-800 hover:text-[#8a4baf] transition-colors duration-300">
              Login
            </Link>
          ) : (
            <>
              {user && user.role === "user" && (
                <Link to="/my-courses" className="text-gray-800 hover:text-[#8a4baf] transition-colors duration-300">
                  My Courses
                </Link>
              )}
              {user && user.role === "admin" && (
                <Link to="/admin/dashboard" className="text-gray-800 hover:text-[#8a4baf] transition-colors duration-300">
                  Admin Dashboard
                </Link>
              )}
              {user && user.role === "instructor" && (
                <Link to="/instructor/dashboard" className="text-gray-800 hover:text-[#8a4baf] transition-colors duration-300">
                  Instructor Dashboard
                </Link>
              )}
              <DropdownMenu user={user} setIsAuth={handleLogout} />
            </>
          )}
        </nav>

        {/* Dropdown for Small Screens */}
        <div className="sm:hidden">
          {isAuth ? (
            <DropdownMenu user={user} setIsAuth={handleLogout} />
          ) : (
            <Link to="/login" className="text-gray-800 hover:text-[#8a4baf] transition-colors duration-300">
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;