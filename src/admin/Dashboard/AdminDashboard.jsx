import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../Utils/Layout';
import axios from 'axios';
import { useState } from 'react';
import { server } from '../../main';

const AdminDashboard = ({ user }) => {
    const navigate = useNavigate();
    if(user && user.role !== "admin") return navigate("/");

    const [stats, setStats] = useState([]);

    async function fetchStats(){
        try{
            const {data} = await axios.get(`${server}/api/stats`, {
                headers: {
                    token: localStorage.getItem("token"),
                },
            });
            setStats(data.stats);
        }
        catch(error){
            console.log(error);
        }
    }

    useEffect(()=>{
        fetchStats();
    },[]);

    return (
        <div>
            <Layout>
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
                    <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl mb-6">Admin Dashboard</h2>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {/* Total Courses */}
                        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg p-6 shadow-lg transform hover:scale-105 transition-transform duration-300">
                            <div className="flex items-center">
                                <div className="text-white">
                                    <p className="text-lg font-medium">Total Courses</p>
                                    <p className="text-3xl font-bold">{stats.totalCourses || 0}</p>
                                </div>
                            </div>
                        </div>

                        {/* Total Lectures */}
                        <div className="bg-gradient-to-r from-green-400 to-blue-500 rounded-lg p-6 shadow-lg transform hover:scale-105 transition-transform duration-300">
                            <div className="flex items-center">
                                <div className="text-white">
                                    <p className="text-lg font-medium">Total Lectures</p>
                                    <p className="text-3xl font-bold">{stats.totalLectures || 0}</p>
                                </div>
                            </div>
                        </div>

                        {/* Total Users */}
                        <div className="bg-gradient-to-r from-pink-500 to-red-500 rounded-lg p-6 shadow-lg transform hover:scale-105 transition-transform duration-300">
                            <div className="flex items-center">
                                <div className="text-white">
                                    <p className="text-lg font-medium">Total Users</p>
                                    <p className="text-3xl font-bold">{stats.totalUsers || 0}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Layout>
        </div>
    );
}

export default AdminDashboard;