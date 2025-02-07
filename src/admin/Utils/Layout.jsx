import React from "react";
import Sidebar from "./Sidebar";

const Layout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar/>
      <div className="flex-1  sm:p-6 md:p-8 lg:p-10 ml-8">
        {children}
      </div>
    </div>
  );
};

export default Layout;