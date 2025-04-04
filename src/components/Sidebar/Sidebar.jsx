// /* eslint-disable no-unused-vars */
// /* eslint-disable react/prop-types */
// import React, { useState, useEffect } from "react";
// import {
//   AiOutlineBook,
//   AiOutlineHeart,
//   AiOutlineHistory,
// } from "react-icons/ai";
// import { CiMoneyCheck1 } from "react-icons/ci";
// import { FaBars, FaTimes } from "react-icons/fa";
// import { MdOutlineDashboardCustomize } from "react-icons/md";
// import { SlCalender } from "react-icons/sl";
// import { BsPersonCircle, BsInfoCircle } from "react-icons/bs";

// import { NavLink, useNavigate, useLocation } from "react-router-dom";

// function Sidebar({ user, course }) {
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Sidebar starts closed on all screens
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const [isLargeScreen, setIsLargeScreen] = useState(false);
//   const navigate = useNavigate();
//   const location = useLocation(); // To check current pathname

//   // Function to generate initials from name
//   const getInitials = (name) => {
//     if (!name) return '';
//     const [firstName, lastName] = name.split(' ');
//     return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
//   };

//   const menuItems = [
//     {
//       icon: <MdOutlineDashboardCustomize size={24} />,
//       label: "Home",
//       link: "/",
//     },
//     {
//       icon: <CiMoneyCheck1 size={24} />, 
//       label: "Purchase History", 
//       link: "/purchase-history",
//     },
//     // { icon: <BsInfoCircle size={24} />, label: "About", link: "/about" },
//     { icon: <BsPersonCircle size={24} />, label: "Profile", link: "/profile" },
//   ];

//   const handleCourseClick = (course) => {
//     if (!course._id || !course.title) {
//       console.error("Course ID or title is missing", course);
//       return;
//     }
  
//     const safeTitle = encodeURIComponent(course.title.replace(/ /g, '-').toLowerCase());
//     navigate(`/${safeTitle}/lectures/${course._id}`, {
//       state: { course, isSidebarOpen, isLargeScreen },
//     });
//   };

//   useEffect(() => {
//     const handleResize = () => {
//       const isLarge = window.innerWidth >= 1024;
//       setIsLargeScreen(isLarge);
//       setIsSidebarOpen(isLarge); // Sidebar opens on large screens by default
//     };

//     handleResize();
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   return (
//     <>
//       <aside
//         className={`absolute top-0 left-0 transform ${isSidebarOpen || isLargeScreen ? "translate-x-0" : "-translate-x-full"} transition-transform duration-500 ease-in-out bg-[#8a5baf] text-white shadow-xl z-50 flex flex-col ${isSidebarOpen || isLargeScreen ? "w-64" : "w-16"} h-full animate-fadeIn`}
//       >
//         {/* Close Button on Small Screens */}
//         {!isLargeScreen && isSidebarOpen && (
//           <div
//             className="absolute top-4 right-4 text-2xl cursor-pointer text-white"
//             onClick={() => setIsSidebarOpen(false)}
//           >
//             <FaTimes />
//           </div>
//         )}

//         {/* User Profile Section */}
//         {isSidebarOpen && (
//           <div className="p-6 text-center animate-fadeIn">
//             {user.profileImage || localStorage.getItem('profileImage') ? (
//               <img
//                 src={user.profileImage || localStorage.getItem('profileImage')}
//                 alt={user.name}
//                 className="w-24 h-24 rounded-full mx-auto border-4 border-white transition-transform duration-300 hover:scale-105"
//               />
//             ) : (
//               <div 
//                 className="w-24 h-24 rounded-full bg-[#007BFF] flex items-center justify-center text-white text-2xl mx-auto border-4 border-white"
//                 title={`${user.name}`}
//               >
//                 {getInitials(user.name)}
//               </div>
//             )}
//             <h2 className="text-lg font-bold mt-4 animate-fadeIn">{user.name}</h2>
//             <p className="text-sm text-indigo-200 animate-fadeIn">{user.email}</p>
//           </div>
//         )}

//         {/* Sidebar Menu */}
//         <nav className="flex-1 overflow-y-auto max-h-full animate-fadeIn">
//           <ul className="space-y-6 px-2">
//             {/* My Courses Dropdown or Navigation */}
//             <li>
//               <div
//                 className="flex items-center justify-between gap-4 px-4 py-2 cursor-pointer hover:bg-[#9f68c9] rounded-lg transition-all duration-300 animate-fadeIn"
//                 onClick={() => {
//                   if (location.pathname === '/my-courses') {
//                     setIsDropdownOpen(prev => !prev);
//                   } else {
//                     navigate('/my-courses');
//                   }
//                 }}
//               >
//                 <div className="flex items-center gap-4">
//                   <AiOutlineBook size={24} />
//                   {isSidebarOpen && <span>My Courses</span>}
//                 </div>
//                 {isSidebarOpen && location.pathname === '/my-courses' && (
//                   <span
//                     className={`transition-transform duration-300 ${isDropdownOpen ? "rotate-90" : "rotate-0"}`}
//                   ></span>
//                 )}
//               </div>
//               {location.pathname === '/my-courses' && (
//                 <ul
//                   className={`mb-2 ml-2 pl-2 mt-2 space-y-2 transition-all duration-500 ease-in-out ${isDropdownOpen && isSidebarOpen ? "max-h-64" : "max-h-0"} overflow-y-auto scrollbar-hidden animate-fadeIn`}
//                 >
//                   {course.map((c) => (
//                     <li
//                       key={c.id}
//                       className="cursor-pointer px-4 py-2 bg-[#8a5baf] hover:bg-[#9f68c9] rounded-lg transition-colors duration-300 shadow-md animate-fadeIn"
//                       onClick={() => handleCourseClick(c)}
//                     >
//                       {c.title}
//                     </li>
//                   ))}
//                 </ul>
//               )}
//             </li>

//             {/* Other Menu Items */}
//             {menuItems.map((item, index) => (
//               <NavLink key={index} to={item.link}>
//                 <li
//                   className={`mb-1 pb-3 flex items-center gap-2 px-4 py-2 cursor-pointer ${isSidebarOpen ? "hover:bg-[#9f68c9] rounded-lg" : "justify-center"} transition-colors duration-300 animate-fadeIn`}
//                 >
//                   {item.icon}
//                   {isSidebarOpen && <span>{item.label}</span>}
//                 </li>
//               </NavLink>
//             ))}
//           </ul>
//         </nav>
//       </aside>

//       {/* Collapsed Sidebar Icons */}
//       {!isSidebarOpen && (
//         <aside
//           className={`pt-10 space-y-2 absolute top-0 left-0 transform ${!isSidebarOpen || isLargeScreen ? "translate-x-0" : "-translate-x-full"} transition-transform duration-500 ease-in-out bg-[#8a5baf] text-white shadow-xl z-50 w-16 h-full animate-fadeIn`}
//         >
//           <div
//             className="cursor-pointer flex justify-center items-center w-12 h-12 hover:bg-[#9f68c9] rounded-lg transition-colors duration-300 animate-fadeIn"
//             onClick={() => setIsSidebarOpen(true)}
//           >
//             <FaBars size={24} />
//           </div>

//           {menuItems.map((item, index) => (
//             <NavLink
//               key={index}
//               to={item.link}
//               className="cursor-pointer flex justify-center items-center w-12 h-12 hover:bg-[#9f68c9] rounded-lg transition-colors duration-300 animate-fadeIn"
//             >
//               {item.icon}
//             </NavLink>
//           ))}
//         </aside>
//       )}
//     </>
//   );
// }

// export default Sidebar;



import React, { useEffect, useState } from "react";
import { AiOutlineMenu } from "react-icons/ai";
import { BsPersonCircle } from "react-icons/bs";
import { CiMoneyCheck1 } from "react-icons/ci";
import { MdOutlineDashboardCustomize } from "react-icons/md";
import { NavLink, useLocation, useNavigate } from "react-router-dom";

function Sidebar({ user, course }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  const [isMediumScreen, setIsMediumScreen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsLargeScreen(width >= 1024);
      setIsMediumScreen(width >= 768 && width < 1024);
      setIsSidebarOpen(width >= 1024);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    if (isMediumScreen) {
      setIsSidebarOpen(!isSidebarOpen);
    }
  };

  const menuItems = [
    { icon: <MdOutlineDashboardCustomize size={24} />, label: "Home", link: "/" },
    ...(user.role === "user"
      ? [{ icon: <CiMoneyCheck1 size={24} />, label: "Purchase History", link: "/purchase-history" }]
      : []),
    { icon: <BsPersonCircle size={24} />, label: "Profile", link: "/profile" },
  ];

  return (
    <>
      <aside
        className={` bg-[#8a5baf] text-white shadow-lg transition-all duration-300 ease-in-out z-50
        ${isLargeScreen ? "w-64" : isMediumScreen && isSidebarOpen ? "w-64" : "w-0 hidden"} md:block`}
      >
        <div className="p-4 flex items-center justify-between border-b border-gray-700">
          {isSidebarOpen && <span className="font-bold text-lg">User Panel</span>}
          {isMediumScreen && (
            <button onClick={toggleSidebar} className="text-lg">
              <AiOutlineMenu />
            </button>
          )}
        </div>

        {isSidebarOpen && (
          <div className="p-4 flex flex-col items-center border-b border-gray-700">
            {user.profileImage ? (
              <img
                src={user.profileImage}
                alt={user.name}
                className="w-20 h-20 rounded-full border-2 border-white"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-gray-500 flex items-center justify-center text-white text-xl">
                {user.name?.charAt(0).toUpperCase()}
              </div>
            )}
            <h2 className="text-lg mt-2 text-center">{user.name}</h2>
            <p className="text-sm text-gray-300 text-center">{user.email}</p>
          </div>
        )}

        <nav className="flex-1 overflow-y-auto max-h-full">
          <ul className="space-y-6 px-2">
            {menuItems.map((item, index) => (
              <NavLink key={index} to={item.link}>
                <li
                  className="mb-1 pb-3 flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-[#9f68c9] rounded-lg transition-colors duration-300"
                  onClick={() => isMediumScreen && toggleSidebar()}
                >
                  {item.icon}
                  <span className="ml-3">{item.label}</span>
                </li>
              </NavLink>
            ))}
          </ul>
        </nav>
      </aside>

      {isSidebarOpen && isMediumScreen && (
        <div className="inset-0 bg-black bg-opacity-50 z-40" onClick={toggleSidebar}></div>
      )}
    </>
  );
}

export default Sidebar;