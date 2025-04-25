import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'; // Added toast import
import image from '../../assets/Animation-verify.gif';
import { UserData } from '../../context/UserContext';

const Verify = () => {
  const [otp, setOtp] = useState("");
  const { verifyOtp } = UserData();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");

  const submitHandler = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      const result = await verifyOtp(otp, navigate);
      if (result && result.message === "User registered successfully") {
        toast.success("Account verified and user registered!");
        navigate('/login');
      } else {
        setErrorMessage("Verification failed. Please check your OTP.");
      }
    } catch (error) {
      console.error("Verification error:", error);
      if (error.response?.data?.message) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage("An error occurred during verification. Please try again.");
      }
    }
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row items-center justify-center bg-purple-100 py-12 px-4 sm:px-6 lg:px-8 xl:px-12">
      {/* Image Container - Responsive adjustments */}
      <div className="w-full lg:w-1/2 flex justify-center mb-8 lg:mb-0 lg:mr-8 px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-24">
        <img 
          src={image} 
          alt="Verification illustration" 
          className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl object-contain"
        />
      </div>
      
      {/* Form Container */}
      <div className="w-full max-w-md p-6 sm:p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-purple-700">
          Verify Account
        </h2>
        
        {errorMessage && (
          <p className="mt-2 text-red-500 text-sm sm:text-base text-center">
            {errorMessage}
          </p>
        )}
        
        <form className="mt-6 sm:mt-8 space-y-6" onSubmit={submitHandler}>
          <div>
            <label htmlFor="otp" className="block text-sm sm:text-base font-medium text-gray-700">
              Enter OTP
            </label>
            <input 
              type="text" 
              id="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required 
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 text-sm sm:text-base"
              placeholder="Enter OTP"
              inputMode="numeric" // Shows numeric keypad on mobile
              pattern="[0-9]*" // Ensures only numbers are entered
            />
          </div>
          
          <div>
            <button 
              type='submit' 
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm sm:text-base font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors duration-200"
            >
              Verify
            </button>
          </div>
        </form>
        
        <p className="mt-4 text-center text-xs sm:text-sm text-gray-600">
          Go to <Link to="/login" className="font-medium text-purple-600 hover:text-purple-500 transition-colors duration-200">Login</Link> page
        </p>
      </div>
    </div>
  )
}

export default Verify;