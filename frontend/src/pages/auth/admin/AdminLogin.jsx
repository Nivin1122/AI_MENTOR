import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setAdminToken } from '../../../redux/slices/auth/AdminAuthSlice';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector(state => state.adminAuth || { isAuthenticated: false });
  
  // Check if already authenticated
  useEffect(() => {
    const adminToken = localStorage.getItem('adminAccess');
    if (isAuthenticated || adminToken) {
      console.log("Already authenticated, redirecting to dashboard");
      navigate('/admin-dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      console.log("Attempting admin login with:", form.username);
      const res = await axios.post('http://localhost:8000/admin-panel/admin-login/', form);
      console.log("Login response:", res.data);
      
      // Store token in Redux & localStorage
      dispatch(setAdminToken(res.data.access));
      console.log("Token stored in Redux and localStorage");
      
      // Use setTimeout to ensure the token is saved before navigation
      setTimeout(() => {
        console.log("Navigating to dashboard");
        navigate('/admin-dashboard', { replace: true });
      }, 100);
      
    } catch (err) {
      console.error("Login error:", err);
      setError(err.response?.data?.detail || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px' }}>
      <h2>Admin Login</h2>
      {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <input 
          type="text" 
          name="username" 
          placeholder="Admin Username" 
          onChange={handleChange}
          style={{ padding: '8px' }}
          required
        />
        <input 
          type="password" 
          name="password" 
          placeholder="Password" 
          onChange={handleChange}
          style={{ padding: '8px' }}
          required
        />
        <button 
          type="submit" 
          disabled={loading}
          style={{ 
            padding: '10px', 
            backgroundColor: '#007bff', 
            color: 'white',
            border: 'none',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;