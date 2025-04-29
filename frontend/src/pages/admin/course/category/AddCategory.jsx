import React, { useState } from 'react';
import axios from 'axios';


const AddCategory = () => {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('adminAccess');
      await axios.post('http://localhost:8000/courses/categories/', { name }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setMessage('Category created successfully!');
      setName('');
    } catch (err) {
      setMessage('Failed to create category.');
      console.error(err);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto bg-white shadow-md rounded">
      <h2 className="text-xl font-bold mb-2">Add New Category</h2>
      <form onSubmit={handleCreate}>
        <input
          type="text"
          placeholder="Category name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border p-2 mb-2 rounded"
          required
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Create
        </button>
      </form>
      {message && <p className="mt-2">{message}</p>}
    </div>
  );
};

export default AddCategory;
