import React, { useState, useEffect } from 'react';
import { getAllUsers } from '../../../services/userService';
import { motion, AnimatePresence } from 'framer-motion';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getAllUsers();
        setUsers(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load users. You may not have admin privileges.');
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) return <div className="loading text-white">Loading users...</div>;
  if (error) return <div className="error-message text-red-400">{error}</div>;

  return (
    <div className="user-list-container px-2 md:px-8 py-6 max-w-7xl mx-auto bg-gray-900 min-h-screen">
      <h2 className="text-2xl md:text-3xl font-bold mb-4 text-center text-white">User Management</h2>
      <div className="user-count mb-4 text-gray-400 text-center">Total Users: {users.length}</div>
      
      <div className="overflow-x-auto rounded-lg shadow-lg bg-gray-800">
        <table className="user-table min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-800">
            <tr>
              <th className="px-3 py-2 text-xs md:text-sm font-semibold text-gray-400">ID</th>
              <th className="px-3 py-2 text-xs md:text-sm font-semibold text-gray-400">Username</th>
              <th className="px-3 py-2 text-xs md:text-sm font-semibold text-gray-400">Email</th>
              <th className="px-3 py-2 text-xs md:text-sm font-semibold text-gray-400">Name</th>
              <th className="px-3 py-2 text-xs md:text-sm font-semibold text-gray-400">Active</th>
              <th className="px-3 py-2 text-xs md:text-sm font-semibold text-gray-400">Staff</th>
              <th className="px-3 py-2 text-xs md:text-sm font-semibold text-gray-400">Date Joined</th>
              <th className="px-3 py-2 text-xs md:text-sm font-semibold text-gray-400">Actions</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {users.map(user => (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="hover:bg-gray-700 transition-colors"
                >
                  <td className="px-3 py-2 text-xs md:text-sm text-gray-200">{user.id}</td>
                  <td className="px-3 py-2 text-xs md:text-sm text-gray-200">{user.username}</td>
                  <td className="px-3 py-2 text-xs md:text-sm text-gray-200">{user.email}</td>
                  <td className="px-3 py-2 text-xs md:text-sm text-gray-200">{`${user.first_name} ${user.last_name}`}</td>
                  <td className="px-3 py-2 text-xs md:text-sm">
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold
                      ${user.is_active ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}`}>
                      {user.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-xs md:text-sm text-gray-200">{user.is_staff ? 'Yes' : 'No'}</td>
                  <td className="px-3 py-2 text-xs md:text-sm text-gray-400">{new Date(user.date_joined).toLocaleString()}</td>
                  <td className="px-3 py-2 text-xs md:text-sm flex gap-2">
                    <button
                      className="px-3 py-1 rounded-full text-xs font-bold shadow bg-green-700 hover:bg-green-600 text-white transition-all duration-200"
                    >
                      Active
                    </button>
                    <button
                      className="px-3 py-1 rounded-full text-xs font-bold shadow bg-red-700 hover:bg-red-600 text-white transition-all duration-200"
                    >
                      Inactive
                    </button>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserList;