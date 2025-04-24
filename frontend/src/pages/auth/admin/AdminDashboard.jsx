import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logoutAdmin } from '../../../redux/slices/auth/AdminAuthSlice';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const { token, isAuthenticated } = useSelector((state) => state.adminAuth || { token: null, isAuthenticated: false });
  const dispatch = useDispatch();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch dashboard data when component mounts
  useEffect(() => {
    // Check if we have authentication before proceeding
    const adminToken = token || localStorage.getItem('adminAccess');
    
    if (!adminToken) {
      console.log("No admin token found, redirecting to login");
      navigate('/admin-login');
      return;
    }
    
    console.log("Fetching dashboard with token:", adminToken);
    setLoading(true);
    
    axios
      .get("http://localhost:8000/admin-panel/dashboard/", {
        headers: { Authorization: `Bearer ${adminToken}` },
      })
      .then((res) => {
        console.log("Dashboard response:", res.data);
        setMessage(res.data.message);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Dashboard error:", err);
        setMessage("Access Denied: " + (err.response?.data?.detail || err.message));
        setLoading(false);
        
        // If we get a 401 Unauthorized, the token is invalid, so logout
        if (err.response && (err.response.status === 401 || err.response.status === 403)) {
          console.log("Token invalid or expired, logging out");
          dispatch(logoutAdmin());
          navigate('/admin-login');
        }
      });
  }, [token, dispatch, navigate]);

  // Handle logout
  const handleLogout = () => {
    dispatch(logoutAdmin());
    navigate('/admin-login');
  };

  if (loading) {
    return <div>Loading dashboard...</div>;
  }

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <p>{message}</p>

      <button onClick={handleLogout} style={{ padding: '10px', backgroundColor: 'red', color: 'white' }}>
        Logout
      </button>
    </div>
  );
};

export default AdminDashboard;