// eslint-disable-next-line no-unused-vars
import React from "react";
import PropTypes from "prop-types"; // Import PropTypes
import { Navigate, Route, Routes } from "react-router-dom";
import DashboardPage from "./Dashboard/Page";
import Playlist from "./video functionality/PlaylistDetail";
import CalenderComponent from "./Dashboard/CalenderComponent";
import PurchaseHistory from "./purchase history/page";

const Routing = ({ isSidebarOpen, isLargeScreen, lectures }) => {
  return (
    <Routes>
      <Route
        path="/dashboard" 
        element={
          <DashboardPage
            isSidebarOpen={isSidebarOpen}
            isLargeScreen={isLargeScreen}
            lectures={lectures}
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
      <Route path="/calendar" element={<CalenderComponent/>}/>
      <Route path="/purchase-history" element={<PurchaseHistory/>}/>
      <Route path="/" element={<Navigate to='/dashboard'/>} />
    </Routes>
  );
};

// Define PropTypes for Routing
Routing.propTypes = {
  isSidebarOpen: PropTypes.bool.isRequired, 
  isLargeScreen: PropTypes.bool.isRequired,
  lectures: PropTypes.array.isRequired // Add this prop type check
};

export default Routing;