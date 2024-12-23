// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import { motion } from "framer-motion";

const RegisterForm = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = (e) => {
    e.preventDefault();
    console.log("Registration Details:", { username, email, password });
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6 bg-white p-6 rounded-lg shadow-md animate-fadeIn"
      onSubmit={handleRegister}
    >
      <h2 className="text-2xl font-bold text-gray-800 text-center">Register</h2>

      {/* Username Field */}
      <div className="flex flex-col">
        <label className="text-gray-700 font-semibold">Username</label>
        <input
          type="text"
          placeholder="Enter your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
        />
      </div>

      {/* Email Field */}
      <div className="flex flex-col">
        <label className="text-gray-700 font-semibold">Email</label>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
        />
      </div>

      {/* Password Field */}
      <div className="flex flex-col">
        <label className="text-gray-700 font-semibold">Password</label>
        <input
          type="password"
          placeholder="Create a password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full bg-indigo-500 text-white py-2 rounded-lg font-semibold hover:bg-indigo-600 transition"
      >
        Register
      </button>
    </motion.form>
  );
};

export default RegisterForm;
