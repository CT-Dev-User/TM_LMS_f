import React from 'react';
import { Link, useParams } from 'react-router-dom';

const Paymentsuccess = ({ user }) => {
  const params = useParams();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-6">
      {user ? (
        <div className="bg-gray-800 rounded-lg shadow-xl p-8 max-w-md w-full text-center transform transition-all duration-500 hover:scale-105">
          {/* Success Icon */}
          <div className="mb-6">
            <svg
              className="w-16 h-16 mx-auto text-green-500 animate-bounce"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>

          {/* Success Message */}
          <h2 className="text-3xl font-bold text-white mb-4">Payment Successful!</h2>
          <p className="text-gray-300 text-lg mb-2">
            Your course subscription has been activated.
          </p>
          <p className="text-gray-400 text-sm mb-6">
            Reference No: <span className="font-semibold text-indigo-400">{params.id}</span>
          </p>

          {/* Dashboard Button */}
          <Link
            to={`/${user._id}/dashboard`}
            className="inline-block bg-gradient-to-r from-indigo-500 to-blue-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:from-indigo-600 hover:to-blue-700 transition-all duration-300"
          >
            Go to Dashboard
          </Link>
        </div>
      ) : (
        <div className="bg-gray-800 rounded-lg shadow-xl p-8 max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-red-400 mb-4">Access Denied</h2>
          <p className="text-gray-300">Please log in to view this page.</p>
        </div>
      )}
    </div>
  );
};

export default Paymentsuccess;