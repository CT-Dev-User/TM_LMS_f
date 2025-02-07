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
      const isLarge = window.innerWidth >= 1024; // Adjust this breakpoint as needed
      setIsLargeScreen(isLarge);
      setIsSidebarOpen(isLarge); // Sidebar opens by default on large screens
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const menuItems = [
    { path: '/admin/dashboard', icon: <AiFillHome size={24} />, label: 'Dashboard' },
    { path: '/admin/course', icon: <FaBook size={24} />, label: 'Course' },
    { path: '/admin/users', icon: <FaUserAlt size={24} />, label: 'Users' },
  ];

  const sidebarWidth = isLargeScreen || isSidebarOpen ? 'w-64' : 'w-16';

  return (
    <div className={` min-h-screen bg-gray-900 text-white shadow-lg transition-all duration-300 ease-in-out ${sidebarWidth} ${isLargeScreen && !isSidebarOpen ? '' : 'translate-x-0'}`}>
      <div className="flex flex-col h-full">
        <div className="p-5 flex justify-between items-center border-b border-gray-700">
          {!isLargeScreen && (
            <button onClick={toggleSidebar} className="text-lg">
              <AiOutlineMenu />
            </button>
          )}
          <span className={`font-bold ${isLargeScreen || isSidebarOpen ? 'inline' : 'hidden'}`}>Admin Panel</span>
        </div>

        <ul className="mt-4 space-y-1 flex-grow overflow-y-auto">
          {menuItems.map((item, index) => (
            <li key={index}>
              <Link 
                to={item.path}
                onClick={() => { if (!isLargeScreen) toggleSidebar(); }}
                className={`flex items-center p-5 ${isLargeScreen || isSidebarOpen ? 'space-x-3' : 'justify-center'} hover:bg-gray-800 transition-all rounded-md ${location.pathname === item.path ? 'bg-gray-800' : ''}`}
              >
                <div className="text-lg">{item.icon}</div>
                <span className={`${isLargeScreen || isSidebarOpen ? 'inline' : 'hidden'} capitalize`}>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;