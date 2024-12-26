// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import LoginForm from "../forms/LoginForm";
import RegisterForm from "../forms/RegisterForm";
import Home from "./Home";
import { motion } from "framer-motion";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Check if user is already logged in from localStorage
    const loggedInUser = localStorage.getItem("isAuthenticated");
    if (loggedInUser === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (email, password) => {
    if (email === "test@gmail.com" && password === "test") {
      setIsAuthenticated(true);
      localStorage.setItem("isAuthenticated", "true"); // Save login state
      setError("");
    } else {
      setError("Invalid email or password. Please try again.");
    }
  };

  const toggleForm = () => setIsLogin(!isLogin);

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("isAuthenticated"); // Remove login state from localStorage
  };

  if (isAuthenticated) {
    return (
      <Home onLogout={handleLogout} /> // Assuming you pass logout function to Home component
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-100 to-indigo-200 "
    >
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full ">
        {isLogin ? (
          <LoginForm onLogin={handleLogin} error={error} />
        ) : (
          <RegisterForm />
        )}
        <p className="text-center mt-4 text-gray-700">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <span
            className="text-indigo-600 font-semibold cursor-pointer hover:underline"
            onClick={toggleForm}
          >
            {isLogin ? "Register" : "Login"}
          </span>
        </p>
      </div>
    </motion.div>
  );
};

export default Auth;
