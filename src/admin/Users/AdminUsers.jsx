/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Layout from '../Utils/Layout';
import { toast } from 'react-hot-toast';
import { server } from '../../main';

const AdminUsers = ({ user }) => {
  const navigate = useNavigate();

  // Redirect non-admin users
  if (user && user.role !== 'admin') {
    navigate('/');
    return null;
  }

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all users
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${server}/api/users`, {
        headers: {
          token: localStorage.getItem('token'),
        },
      });
      const fetchedUsers = Array.isArray(response.data.users) ? response.data.users : [];
      setUsers(fetchedUsers);
      // Removed toast.success(`Fetched ${fetchedUsers.length} users successfully`);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch users');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  // Update user role
  const updateRole = async (id, currentRole) => {
    const newRole = prompt(
      `Current role: ${currentRole}\nEnter new role (user, admin, instructor):`,
      currentRole
    );

    if (!newRole) return;

    const validRoles = ['user', 'admin', 'instructor'];
    const normalizedNewRole = newRole.toLowerCase();

    if (!validRoles.includes(normalizedNewRole)) {
      toast.error("Invalid role. Please enter 'user', 'admin', or 'instructor'");
      return;
    }

    if (normalizedNewRole === currentRole.toLowerCase()) {
      toast.info('Role unchanged.');
      return;
    }

    if (confirm(`Are you sure you want to update this user's role to "${normalizedNewRole}"?`)) {
      try {
        const response = await axios.put(
          `${server}/api/user/${id}`,
          { role: normalizedNewRole },
          {
            headers: {
              token: localStorage.getItem('token'),
            },
          }
        );
        toast.success(response.data.message);
        fetchUsers();
      } catch (error) {
        toast.error(error.response?.data?.message || 'Error updating role');
      }
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <Layout>
      <div className="ml-[17%] sm:ml-[17%] md:ml-[15%] lg:ml-[17%] xl:ml-[20%] ipadpro:ml-[24%] ipadpro-landscape:ml-[20%] animate-fadeIn mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6">All Users</h1>

        {loading ? (
          <p className="text-center text-gray-600">Loading users...</p>
        ) : users.length === 0 ? (
          <p className="text-center text-gray-600">No users found</p>
        ) : (
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
                    {/* Mobile view */}
                    <tr className="sm:hidden">
                      <td colSpan="5" className="px-2 py-2 border-b border-gray-200">
                        <div className="text-sm text-gray-900 font-semibold">{user.name}</div>
                        <div className="text-xs text-gray-500">{user.email}</div>
                        <div className="text-xs text-gray-500">Role: {user.role}</div>
                        <button
                          onClick={() => updateRole(user._id, user.role)}
                          className="mt-2 text-xs text-indigo-600 hover:text-indigo-900"
                        >
                          Update Role
                        </button>
                      </td>
                    </tr>
                    {/* Desktop view */}
                    <tr className="hidden sm:table-row">
                      <td className="px-2 py-2 sm:px-4 sm:py-3 whitespace-nowrap text-sm text-gray-900">{index + 1}</td>
                      <td className="px-2 py-2 sm:px-4 sm:py-3 whitespace-nowrap text-sm text-gray-500">{user.name}</td>
                      <td className="px-2 py-2 sm:px-4 sm:py-3 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                      <td className="px-2 py-2 sm:px-4 sm:py-3 whitespace-nowrap text-sm text-gray-500">{user.role}</td>
                      <td className="px-2 py-2 sm:px-4 sm:py-3 whitespace-nowrap text-sm font-medium sm:text-right">
                        <button
                          onClick={() => updateRole(user._id, user.role)}
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
        )}
      </div>
    </Layout>
  );
};

export default AdminUsers;