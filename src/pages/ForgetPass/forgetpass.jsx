/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import axios from 'axios';
import { server } from '../../main'; // Import server from main.jsx

const ForgetPass = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [resetStep, setResetStep] = useState('email'); // 'email' or 'otp'

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const response = await axios.post(
        `${server}/api/user/forgot-password`, // Use server variable
        { email }
      );
      console.log('Email Submit Response:', response.data);
      setMessage('OTP sent to your email. Please check your inbox.');
      setResetStep('otp');
      localStorage.setItem('resetToken', response.data.resetToken);
    } catch (err) {
      console.error('Error Sending OTP:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Failed to send OTP');
    }
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    const resetToken = localStorage.getItem('resetToken');
    if (!resetToken) {
      setError('Reset token is missing. Please restart the process.');
      return;
    }

    try {
      const response = await axios.post(
        `${server}/api/user/reset-password`, // Use server variable
        {
          resetToken,
          otp,
          newPassword,
        }
      );
      console.log('Reset Password Response:', response.data);
      setMessage('Password reset successfully!');
      setResetStep('email');
      setEmail('');
      setOtp('');
      setNewPassword('');
      localStorage.removeItem('resetToken');
    } catch (err) {
      console.error('Error Resetting Password:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Failed to reset password');
    }
  };

  return (
    <div className="forget-pass-container max-w-md w-full p-8 space-y-8 bg-white rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold text-center text-purple-700">Reset Your Password</h2>
      {message && <p className="text-green-600 text-center">{message}</p>}
      {error && <p className="text-red-600 text-center">{error}</p>}

      {resetStep === 'email' ? (
        <form className="mt-8 space-y-6" onSubmit={handleEmailSubmit}>
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              Send OTP
            </button>
          </div>
        </form>
      ) : (
        <form className="mt-8 space-y-6" onSubmit={handleResetSubmit}>
          <div>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
            />
          </div>
          <div>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="New Password"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              Reset Password
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ForgetPass;