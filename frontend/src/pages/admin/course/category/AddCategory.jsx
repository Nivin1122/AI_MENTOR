import React, { useState } from 'react';
import axios from 'axios';

const AddCategory = () => {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('adminAccess');
      await axios.post('http://localhost:8000/courses/categories/', { name }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setMessageType('success');
      setMessage('Category created successfully!');
      setName('');
    } catch (err) {
      setMessageType('error');
      setMessage('Failed to create category.');
      console.error(err);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-gray-800 shadow-lg rounded-lg border border-gray-700">
      <h2 className="text-2xl font-bold mb-4 text-gray-100">Add New Category</h2>
      <form onSubmit={handleCreate}>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Category name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-gray-700 border border-gray-600 p-3 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>
        <button 
          type="submit" 
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          Create Category
        </button>
      </form>
      
      {message && (
        <div className={`mt-4 p-3 rounded-md ${
          messageType === 'success' ? 'bg-green-800 text-green-100' : 'bg-red-800 text-red-100'
        }`}>
          <p>{message}</p>
        </div>
      )}
    </div>
  );
};

export default AddCategory;