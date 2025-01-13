/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React from "react";
import PropTypes from "prop-types";
import { Navigate, Route, Routes } from "react-router-dom";
import DashboardPage from "./Dashboard/Page";
import Playlist from "./video functionality/PlaylistDetail";
import CalenderComponent from "./Dashboard/CalenderComponent";
import PurchaseHistory from "./purchase history/page";

const Routing = ({ isSidebarOpen, isLargeScreen, course }) => {
  return (
    <Routes>
      <Route
        path="/dashboard"
        element={
          <DashboardPage
            isSidebarOpen={isSidebarOpen}
            isLargeScreen={isLargeScreen}
            course={course}
          />
        }
      />
      <Route
        path="/lectures/:courseId"
        element={
          <Playlist
            isSidebarOpen={isSidebarOpen}
            isLargeScreen={isLargeScreen}
          />
        }
      />
      <Route path="/calendar" element={<CalenderComponent />} />
      <Route path="/purchase-history" element={<PurchaseHistory />} />
      <Route path="/" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
};

// Define PropTypes for Routing
Routing.propTypes = {
  isSidebarOpen: PropTypes.bool.isRequired,
  isLargeScreen: PropTypes.bool.isRequired,
  lectures: PropTypes.array.isRequired,
};

export default Routing;
