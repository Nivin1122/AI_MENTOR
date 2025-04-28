import axios from 'axios';

const API_URL = 'http://localhost:8000';  // Update with your Django backend URL

// Function to get auth header with JWT token
const authHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Function to fetch all users (admin only)
export const getAllUsers = async () => {
  try {
    const response = await axios.get(`${API_URL}/admin-panel/admin/users/`, {
      headers: authHeader()
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};