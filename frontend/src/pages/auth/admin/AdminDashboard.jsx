import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logoutAdmin } from '../../../redux/slices/auth/AdminAuthSlice';
import api from '../../../api/api';

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    // Check if admin is authenticated
    const adminToken = localStorage.getItem('adminAccess');
    if (!adminToken) {
      navigate('/admin-login');
      return;
    }

    // Fetch dashboard data
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const response = await api.get('/admin-panel/dashboard/');
        setDashboardData(response.data);
        setError('');
      } catch (err) {
        console.error('Dashboard fetch error:', err);
        setError(
          err.response?.data?.message || 
          'Failed to load dashboard data. Please check your authentication.'
        );

        if (err.response?.status === 401) {
          handleLogout();
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboard();
  }, [navigate]);

  const handleLogout = () => {

    localStorage.removeItem('adminAccess');
    localStorage.removeItem('adminRefresh');
    
    dispatch(logoutAdmin());
    
    navigate('/admin-login');
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  return (
    <div className="admin-dashboard">
      <header className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <button 
          onClick={handleLogout}
          className="logout-button"
        >
          Logout
        </button>
      </header>

      <div className="dashboard-content">
        {error ? (
          <div className="error-message">{error}</div>
        ) : (
          <div className="welcome-message">
            <h2>{dashboardData.message}</h2>
            
            <div className="dashboard-stats">
           
              <div className="stat-card">
                <h3>Users</h3>
                <p>0</p>
              </div>
              <div className="stat-card">
                <h3>Courses</h3>
                <p>0</p>
              </div>
              <div className="stat-card">
                <h3>Enrollments</h3>
                <p>0</p>
              </div>
            </div>
            
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;