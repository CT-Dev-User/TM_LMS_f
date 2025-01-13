// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserData } from "../../context/UserContext";

const Login = () => {
  const navigate = useNavigate();
  const { btnLoading, loginUser } = UserData();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();
    await loginUser(email, password, navigate);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-purple-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full p-8 space-y-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-center text-purple-700">
          Login
        </h2>
        <form className="mt-8 space-y-6" onSubmit={submitHandler}>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="relative">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
              placeholder="Your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute inset-y-1 right-0  top-7 flex items-center pr-3 text-gray-400 hover:text-gray-600 focus:outline-none"
            >
              {showPassword ? (
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 12a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7V5"
                  />
                </svg>
              ) : (
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7A9.97 9.97 0 014.02 8L2 10v6M3 16l6-6m12 6l-3-3m0 0l-3-3m3 3L15 5m6 11l-3 3m0 0l-3 3m3-3l3 3"
                  />
                </svg>
              )}
            </button>
          </div>
          <div>
            <button
              type="submit"
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                btnLoading
                  ? "bg-purple-400 cursor-not-allowed"
                  : "bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              }`}
              disabled={btnLoading}
            >
              {btnLoading ? "Please Wait..." : "Login"}
            </button>
          </div>
        </form>
        <p className="text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="font-medium text-purple-600 hover:text-purple-500"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
