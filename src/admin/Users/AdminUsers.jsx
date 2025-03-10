import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Layout from '../Utils/Layout';
import { toast } from 'react-hot-toast';
import { server } from '../../main';

const AdminUsers = ({ user }) => {
  const navigate = useNavigate();
  if (user && user.role !== "admin") return navigate("/");

  const [users, setUsers] = useState([]);
  
  async function fetchUsers() {
    try {
      const { data } = await axios.get(`${server}/api/users`, {
        headers: {
          token: localStorage.getItem("token")
        },
      });
      setUsers(data.users);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to fetch users.");
    }
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  const updateRole = async (id) => {
    if (confirm("Are you sure you want to update the role?")) {
      try {
        const { data } = await axios.put(
          `${server}/api/user/${id}`, {}, {
            headers: {
              token: localStorage.getItem("token"),
            },
          }
        );
        toast.success(data.message);
        fetchUsers();
      } catch (error) {
        toast.error(error.response?.data?.message || "An error occurred");
      }
    }
  };

  return (
    <Layout>
      <div className="p-4 sm:p-6 ">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6">All Users</h1>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr className="hidden sm:table-row">
                <th className="px-2 py-2 sm:px-4 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                <th className="px-2 py-2 sm:px-4 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-2 py-2 sm:px-4 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-2 py-2 sm:px-4 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-2 py-2 sm:px-4 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sm:text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user, index) => (
                <React.Fragment key={user._id}>
                  <tr className="sm:hidden">
                    <td colSpan="5" className="px-2 py-2 border-b border-gray-200">
                      <div className="text-sm text-gray-900 font-semibold">{user.name}</div>
                      <div className="text-xs text-gray-500">{user.email}</div>
                      <div className="text-xs text-gray-500">Role: {user.role}</div>
                      <button 
                        onClick={() => updateRole(user._id)} 
                        className="mt-2 text-xs text-indigo-600 hover:text-indigo-900"
                      >
                        Update Role
                      </button>
                    </td>
                  </tr>
                  <tr className="hidden sm:table-row">
                    <td className="px-2 py-2 sm:px-4 sm:py-3 whitespace-nowrap text-sm text-gray-900">{index + 1}</td>
                    <td className="px-2 py-2 sm:px-4 sm:py-3 whitespace-nowrap text-sm text-gray-500">{user.name}</td>
                    <td className="px-2 py-2 sm:px-4 sm:py-3 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                    <td className="px-2 py-2 sm:px-4 sm:py-3 whitespace-nowrap text-sm text-gray-500">{user.role}</td>
                    <td className="px-2 py-2 sm:px-4 sm:py-3 whitespace-nowrap text-sm font-medium sm:text-right">
                      <button 
                        onClick={() => updateRole(user._id)} 
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        Update Role
                      </button>
                    </td>
                  </tr>
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default AdminUsers;