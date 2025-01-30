import React, { useEffect } from 'react';
import axios from "axios";
import { useState } from 'react';
import { server } from '../../main';
import { useNavigate } from 'react-router-dom';
import Layout from '../Utils/Layout';
import { toast } from 'react-hot-toast';

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
      console.log(error);
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
        toast.error(error.response.data.message);
      }
    }
  };

  return (
    <Layout>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">All Users</h1>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider lg:w-1/6 lg:text-right">Actions</th>              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user, index) => (
                <tr key={user._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{index + 1}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.role}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium lg:text-center lg:py-2">
                    <button 
                      onClick={() => updateRole(user._id)} 
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      Update Role
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default AdminUsers;