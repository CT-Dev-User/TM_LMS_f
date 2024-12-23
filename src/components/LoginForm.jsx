/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import { motion } from "framer-motion";

const LoginForm = ({ onLogin, error }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(email, password);
  };

  return (
    <motion.form
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="max-w-lg w-full bg-white p-10 rounded-lg shadow-lg border border-gray-200"
      onSubmit={handleSubmit}
    >
      <h2 className="text-4xl font-extrabold text-indigo-600 text-center mb-8">
        Login
      </h2>

      {/* Email Input */}
      <div className="space-y-5">
        <label className="block text-gray-700 font-semibold">Email</label>
        <input
          type="email"
          placeholder="Enter your email"
          className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 transition-all"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      {/* Password Input */}
      <div className="space-y-5">
        <label className="block text-gray-700 font-semibold">Password</label>
        <input
          type="password"
          placeholder="Enter your password"
          className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 transition-all"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      {/* Error Message */}
      {error && <p className="text-red-500 text-sm text-center mt-2">{error}</p>}

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full py-4 mt-5 bg-indigo-600 text-white font-semibold rounded-lg transition-colors duration-300 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
      >
        Login
      </button>
    </motion.form>
  );
};

export default LoginForm;
