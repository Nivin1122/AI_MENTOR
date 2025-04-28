import axios from 'axios';

const API_URL = 'http://localhost:8000'; 

const authHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};


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