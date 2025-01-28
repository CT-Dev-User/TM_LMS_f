import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import image from "../../assets/Regs.png";
import { UserData } from '../../context/UserContext.jsx';

const Register = () => {
    const navigate = useNavigate();
    const { btnLoading, registerUser } = UserData();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(""); // New state for error message

    const submitHandler = async (e) => {
        e.preventDefault();
        setError(""); // Clear any previous errors
        try {
            // Assuming registerUser returns a promise that resolves to the user's data
            const user = await registerUser(name, email, password, navigate);
            if (user) {
                // Registration successful, redirect to user profile or dashboard
                navigate('/dashboard');
            }
        } catch (err) {
            // Handle any error from registerUser function
            setError(err.message || "Registration failed. Please try again.");
        }
    };

    return (
        <div className="min-h-screen flex flex-col sm:flex-row items-center justify-center bg-purple-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="px-24 mb-8 sm:mb-0 sm:mr-8">
                <img src={image} alt="img" className='w-1000px sm:w-80' />
            </div>
            <div className="max-w-md w-full p-8 space-y-8 bg-white rounded-lg shadow-lg">
                <h2 className="text-3xl font-bold text-center text-purple-700">
                    Register
                </h2>
                <p className='text-gray-400'>Explore, learn, and grow with us. Enjoy a seamless and enriching educational journey. Let's begin!</p>
                <form className="mt-8 space-y-6" onSubmit={submitHandler}>
                    {error && <p className="text-red-500 text-xs">{error}</p>}
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                            Name
                        </label>
                        <input 
                            type="text" 
                            id="name" 
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            name="name" 
                            required 
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                            placeholder="Your name"
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <input 
                            type="email" 
                            id="email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            name="email" 
                            required 
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                            placeholder="Your email"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <input 
                            type="password" 
                            id="password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            name="password" 
                            required 
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                            placeholder="Your password"
                        />
                    </div>
                    <div>
                        <button 
                            type='submit' 
                            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${btnLoading ? 'bg-purple-400 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500'}`}
                            disabled={btnLoading}
                        >
                            {btnLoading ? "Registering..." : "Register"}
                        </button>
                    </div>
                </form>
                <p className="text-center text-sm text-gray-600">
                    Already have an account? <Link to="/login" className="font-medium text-purple-600 hover:text-purple-500">Login</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;