// // eslint-disable-next-line no-unused-vars
// import React, { useState, useEffect, useRef } from "react";
// import { Link } from "react-router-dom"; // Import Link from react-router-dom
// import { AiFillHome, AiOutlineMenu } from "react-icons/ai";
// import { FaBook, FaUserAlt } from "react-icons/fa";

// function Sidebar() {
//   const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 1024);
//   const sidebarRef = useRef(null);

//   // Toggle sidebar only if screen width is less than 1024px
//   const toggleSidebar = () => {
//     if (window.innerWidth < 1024) {
//       setIsSidebarOpen(!isSidebarOpen);
//     }
//   };

//   const checkScreenSize = () => {
//     // Sidebar should be open if screen width is at least 1024px
//     setIsSidebarOpen(window.innerWidth >= 1024);
//   };

//   useEffect(() => {
//     window.addEventListener("resize", checkScreenSize);

//     const handleClickOutside = (event) => {
//       if (
//         sidebarRef.current &&
//         !sidebarRef.current.contains(event.target) &&
//         isSidebarOpen &&
//         window.innerWidth < 1024
//       ) {
//         setIsSidebarOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);

//     return () => {
//       window.removeEventListener("resize", checkScreenSize);
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, [isSidebarOpen]);

//   const menuItems = [
//     { path: "/instructor/dashboard", icon: <AiFillHome size={24} />, label: "Dashboard", color: "text-blue-400" },
//     { path: "/instructor/course", icon: <FaBook size={24} />, label: "Courses", color: "text-purple-400" },
//     { path: "/instructor/students", icon: <FaUserAlt size={24} />, label: "Students", color: "text-green-400" },
//   ];

//   // Sidebar width: 64px when open, 16px when closed for small screens to show icons
//   const sidebarWidth = isSidebarOpen ? "w-64" : "w-16";

//   return (
//     <>
//       {/* Overlay for smaller screens */}
//       {isSidebarOpen && window.innerWidth < 1024 && (
//         <div className="" onClick={toggleSidebar}></div>
//       )}

//       <aside
//         ref={sidebarRef}
//         className={`absolute h-screen bg-gradient-to-b from-gray-900 to-slate-800 text-gray-300 shadow-2xl transition-all duration-300 ease-in-out ${sidebarWidth} overflow-y-auto z-50`}
//       >
//         <div className="flex flex-col h-full">
//           <div className="flex justify-between items-center p-5 border-b border-slate-700">
//             <button
//               onClick={toggleSidebar}
//               className={`text-gray-300 hover:text-white ${isSidebarOpen || window.innerWidth >= 1024 ? "hidden" : "block"}`}
//             >
//               <AiOutlineMenu size={28} />
//             </button>
//             <span className={`font-extrabold text-2xl ${isSidebarOpen ? "block" : "hidden"} text-white`}>
//               Instructor Dashboard
//             </span>
//           </div>

//           <nav className="mt-6 flex-grow">
//             <ul className="space-y-2">
//               {menuItems.map((item, index) => (
//                 <li key={index}>
//                   <Link
//                     to={item.path}
//                     className={`flex items-center p-4 hover:bg-slate-700 transition-all rounded-lg ${
//                       isSidebarOpen ? "space-x-4" : "justify-center"
//                     } ${item.color} hover:text-white`}
//                   >
//                     <span className={`transition-opacity ${isSidebarOpen ? "opacity-100" : "opacity-75"}`}>
//                       {item.icon}
//                     </span>
//                     <span className={`${isSidebarOpen ? "inline" : "hidden"} font-medium`}>{item.label}</span>
//                   </Link>
//                 </li>
//               ))}
//             </ul>
//           </nav>

//           <div className={`mt-auto mb-4 ${isSidebarOpen ? "px-4" : "px-2"}`}></div>
//         </div>
//       </aside>
//     </>
//   );
// }

// export default Sidebar;


import React, { useEffect, useRef, useState } from "react";
import { AiFillHome } from "react-icons/ai";
import { BsFillChatRightTextFill } from "react-icons/bs";
import { FaBook, FaUserAlt } from "react-icons/fa";
import { Link } from "react-router-dom"; // Import Link from react-router-dom

function Sidebar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 1024);
  const sidebarRef = useRef(null);

  const checkScreenSize = () => {
    setIsSidebarOpen(window.innerWidth >= 1024);
  };

  useEffect(() => {
    window.addEventListener("resize", checkScreenSize);
    return () => {
      window.removeEventListener("resize", checkScreenSize);
    };
  }, []);

  if (window.innerWidth < 1024) return null; // Hide sidebar on small screens

  const menuItems = [
    { path: "/instructor/dashboard", icon: <AiFillHome size={24} />, label: "Dashboard", color: "text-blue-400" },
    { path: "/instructor/course", icon: <FaBook size={24} />, label: "Courses", color: "text-purple-400" },
    { path: "/instructor/students", icon: <FaUserAlt size={24} />, label: "Students", color: "text-green-400" },
    { path: "/instructor/payoutreport", icon: <BsFillChatRightTextFill size={24} />, label: "Payout Report", color: "text-[#888888]" },
  ];

  return (
    <aside
      ref={sidebarRef}
      className="absolute h-screen w-64 bg-gradient-to-b from-gray-900 to-slate-800 text-gray-300 shadow-2xl overflow-y-auto z-50"
    >
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-center p-5 border-b border-slate-700">
          <span className="font-extrabold text-2xl text-white">Instructor Dashboard</span>
        </div>

        <nav className="mt-6 flex-grow">
          <ul className="space-y-2">
            {menuItems.map((item, index) => (
              <li key={index}>
                <Link
                  to={item.path}
                  className={`flex items-center p-4 hover:bg-slate-700 transition-all rounded-lg space-x-4 ${item.color} hover:text-white`}
                >
                  <span>{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  );
}

export default Sidebar;
