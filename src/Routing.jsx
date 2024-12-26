// eslint-disable-next-line no-unused-vars
import React from "react";
import PropTypes from "prop-types"; // Import PropTypes
import { Route, Routes } from "react-router-dom";
import DashboardPage from "./Dashboard/Page";
import Playlist from "./video functionality/PlaylistDetail";

const Routing = ({ isSidebarOpen, isLargeScreen }) => {
  return (
    <Routes>
      <Route
        path="/dashboard"
        element={
          <DashboardPage
            isSidebarOpen={isSidebarOpen}
            isLargeScreen={isLargeScreen}
          />
        }
      />
      {/* Updated to handle dynamic playlist URLs with course title */}
      <Route
        path="/playlist/:courseTitle"
        element={
          <Playlist     
          isSidebarOpen={isSidebarOpen}
          isLargeScreen={isLargeScreen}  
          />
        }
      />
      <Route path="/" element={<div>Welcome to the app!</div>} />
    </Routes>
  );
};

// Define PropTypes for Routing
Routing.propTypes = {
  isSidebarOpen: PropTypes.bool.isRequired, // Ensure it's a required boolean
  isLargeScreen: PropTypes.bool.isRequired, // Ensure it's a required boolean
};

export default Routing;
