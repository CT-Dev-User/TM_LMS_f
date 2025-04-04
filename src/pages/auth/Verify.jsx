import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import image from '../../assets/Animation-verify.gif';
import { UserData } from '../../context/UserContext';

const Verify = () => {
  const [otp, setOtp] = useState("");
  const { verifyOtp } = UserData();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");

  const submitHandler = async (e) => {
    e.preventDefault();
    setErrorMessage(""); // Clear any previous error message

    try {
      const result = await verifyOtp(otp, navigate); // Removed Number(), since otp can be string or number
      if (result && result.message === "User registered successfully") {
        toast.success("Account verified and user registered!"); // Assuming you have toast imported
        navigate('/login');
      } else {
        setErrorMessage("Verification failed. Please check your OTP.");
      }
    } catch (error) {
      console.error("Verification error:", error);
      if (error.response && error.response.data && error.response.data.message) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage("An error occurred during verification. Please try again.");
      }
    }
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row space-x-24 items-center justify-center bg-purple-100 py-12 px-4 sm:px-6 lg:px-8 space-y-6 md:space-y-0 md:space-x-24">
      {/* Image Section */}
      <div className="mb-4 md:mb-0 md:mr-8">
        <img src={image} alt="img" className='w-72 sm:w-96' />
      </div>

      {/* Form Section */}
      <div className="max-w-md w-full p-8 space-y-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-center text-purple-700">
          Verify Account
        </h2>
        {errorMessage && <p className="text-red-500 text-sm text-center">{errorMessage}</p>}
        <form className="mt-8 space-y-6" onSubmit={submitHandler}>
          <div>
            <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
              Enter OTP
            </label>
            <input 
              type="text" // Changed to text since OTP can be prefixed with zeros
              id="otp"
              value={otp}
              onChange={e => setOtp(e.target.value)}
              required 
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
              placeholder="Enter OTP"
            />
          </div>
          <div>
            <button 
              type='submit' 
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              Verify
            </button>
          </div>
        </form>
        <p className="text-center text-sm text-gray-600">
          Go to <Link to="/login" className="font-medium text-purple-600 hover:text-purple-500">Login</Link> page
        </p>
      </div>
    </div>
  )
}

export default Verify;