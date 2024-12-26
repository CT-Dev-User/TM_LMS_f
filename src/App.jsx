// eslint-disable-next-line no-unused-vars
import React from "react";
import Auth from "./components/Auth";
import "./styles/Auth.css"; // Global styles
import "../src/index.css"
function App() {
  return (
    <div>
      {/* <Navbar/> */}
      <Auth />
    </div>
  );
}

export default App;
// eslint-disable-next-line no-unused-vars
// import React, { useState, useEffect } from "react";
// import {
//   BrowserRouter as Router,
//   Routes,
//   Route,
//   Navigate,
// } from "react-router-dom";
// import Auth from "./components/Auth"; 
// import "../src/index.css";

// function App() {
//   const [isAuthenticated, setIsAuthenticated] = useState(false);

//   useEffect(() => {
//     const authStatus = localStorage.getItem("isAuthenticated");
//     if (authStatus === "true") {
//       setIsAuthenticated(true);
//     }
//   }, []);

//   return (
//     <Router>
//       <div className="flex">
//         <main className="flex-1">
//           <Routes>
//             {/* Redirect to Home if authenticated, otherwise show Login */}
//             <Route
//               path="/"
//               element={isAuthenticated ? <Navigate to="/home" /> : <Auth />}
//             />
//           </Routes>
//         </main>
//       </div>
//     </Router>
//   );
// }

// export default App;
