// src/admin/Dashboard/AdminDashboard.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../Utils/Layout';
import axios from 'axios';
import { server } from '../../main';

const AdminDashboard = ({ user }) => {
  const navigate = useNavigate();

  // Redirect non-admin users
  if (user && user.role !== 'admin') {
    navigate('/');
    return null; // Prevent rendering before redirect
  }

  // Initialize stats as an object, not an array
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalLectures: 0,
    totalUsers: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch stats from the backend
  const fetchStats = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${server}/api/stats`, {
        headers: {
          token: localStorage.getItem('token'),
        },
      });
      setStats(data.stats || { totalCourses: 0, totalLectures: 0, totalUsers: 0 });
    } catch (err) {
      console.error('Error fetching stats:', err);
      setError('Failed to load dashboard stats');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  // return (
  //   <Layout>
  //     <div className="ml-[17%] sm:ml-[17%] md:ml-[15%] lg:ml-[17%] xl:ml-[20%] ipadpro:ml-[24%] ipadpro-landscape:ml-[20%] animate-fadeIn mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
  //       <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-gray-900 mb-6">
  //         Admin Dashboard
  //       </h2>

  //       {loading ? (
  //         <p className="text-center text-gray-600">Loading stats...</p>
  //       ) : error ? (
  //         <p className="text-center text-red-600">{error}</p>
  //       ) : (
  //         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 lg:gap-10">
  //           {/* Total Courses */}
  //           <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg p-3 sm:p-4 md:p-6 shadow-lg transform hover:scale-105 transition-transform duration-300">
  //             <div className="flex items-center">
  //               <div className="text-white">
  //                 <p className="text-sm sm:text-base md:text-lg font-medium">Total Courses</p>
  //                 <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold">
  //                   {stats.totalCourses}
  //                 </p>
  //               </div>
  //             </div>
  //           </div>

  //           {/* Total Lectures */}
  //           <div className="bg-gradient-to-r from-green-400 to-blue-500 rounded-lg p-3 sm:p-4 md:p-6 shadow-lg transform hover:scale-105 transition-transform duration-300">
  //             <div className="flex items-center">
  //               <div className="text-white">
  //                 <p className="text-sm sm:text-base md:text-lg font-medium">Total Lectures</p>
  //                 <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold">
  //                   {stats.totalLectures}
  //                 </p>
  //               </div>
  //             </div>
  //           </div>

  //           {/* Total Users */}
  //           <div className="bg-gradient-to-r from-pink-500 to-red-500 rounded-lg p-3 sm:p-4 md:p-6 shadow-lg transform hover:scale-105 transition-transform duration-300">
  //             <div className="flex items-center">
  //               <div className="text-white">
  //                 <p className="text-sm sm:text-base md:text-lg font-medium">Total Users</p>
  //                 <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold">
  //                   {stats.totalUsers}
  //                 </p>
  //               </div>
  //             </div>
  //           </div>
  //         </div>
  //       )}
  //     </div>
  //   </Layout>
  // );



  return (
    <Layout>
<div className=" xl:ml-[20%] ipadpro:ml-[24%] ipadpro-landscape:ml-[20%] animate-fadeIn mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12"><h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-gray-900 mb-6">Admin Dashboard</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 lg:gap-10">
                {/* Total Courses */}
                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg p-3 sm:p-4 md:p-6 shadow-lg transform hover:scale-105 transition-transform duration-300">
                    <div className="flex items-center">
                        <div className="text-white">
                            <p className="text-sm sm:text-base md:text-lg font-medium">Total Courses</p>
                            <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold">{stats.totalCourses || 0}</p>
                        </div>
                    </div>
                </div>

                {/* Total Lectures */}
                <div className="bg-gradient-to-r from-green-400 to-blue-500 rounded-lg p-3 sm:p-4 md:p-6 shadow-lg transform hover:scale-105 transition-transform duration-300">
                    <div className="flex items-center">
                        <div className="text-white">
                            <p className="text-sm sm:text-base md:text-lg font-medium">Total Lectures</p>
                            <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold">{stats.totalLectures || 0}</p>
                        </div>
                    </div>
                </div>

                {/* Total Users */}
                <div className="bg-gradient-to-r from-pink-500 to-red-500 rounded-lg p-3 sm:p-4 md:p-6 shadow-lg transform hover:scale-105 transition-transform duration-300">
                    <div className="flex items-center">
                        <div className="text-white">
                            <p className="text-sm sm:text-base md:text-lg font-medium">Total Users</p>
                            <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold">{stats.totalUsers || 0}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </Layout>
);

};

export default AdminDashboard;