import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';

const Navbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const isLoggedIn = localStorage.getItem("accessToken") !== null;

  useEffect(() => {
    const fetchUserData = async () => {
      if (isLoggedIn) {
        try {
          const token = localStorage.getItem('accessToken');
          if (!token) {
            throw new Error('No token found');
          }

          const response = await axios.get('http://localhost:8000/users/profile/', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (response.data) {
            setUser(response.data);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          if (error.response?.status === 401 || error.response?.status === 400) {
            handleLogout();
          }
        }
      }
      setIsLoading(false);
    };

    fetchUserData();
  }, [isLoggedIn]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showDropdown && !event.target.closest('.user-dropdown')) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showDropdown]);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setUser(null);
    setShowDropdown(false);
    navigate("/login");
  };

  const handleProtectedRoute = (e, path) => {
    if (!isLoggedIn) {
      e.preventDefault();
      setShowLoginPopup(true);
    } else {
      navigate(path);
    }
  };

  // Add LoginPopup component
  const LoginPopup = () => {
    if (!showLoginPopup) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-lg p-6 max-w-sm w-full mx-4"
        >
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Login Required</h3>
          <p className="text-gray-600 mb-6">
            Please login to access this feature. You'll need an account to continue.
          </p>
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setShowLoginPopup(false)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                setShowLoginPopup(false);
                navigate('/login');
              }}
              className="px-4 py-2 bg-[#4DC1B8] text-white rounded-md hover:bg-[#45b0a8] transition-colors"
            >
              Login Now
            </button>
          </div>
        </motion.div>
      </div>
    );
  };

  return (
    <nav className="bg-[#4DC1B8] py-5 relative z-50">
      <div className="container mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <Link to="/" className="text-white font-bold flex items-center">
            <div className="w-9 h-9 border-2 border-white flex items-center justify-center transform rotate-45 mr-3">
              <span className="transform -rotate-45 text-xl tracking-tight">TOTC</span>
            </div>
          </Link>
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center">
          <Link to="/" className="text-white text-sm tracking-wider font-medium mx-5">
            HOME
          </Link>
          {/* <Link to="/ai-mentor" className="text-white text-sm tracking-wider font-medium mx-5">
            AI MENTOR
          </Link> */}
          <Link to="/courses" className="text-white text-sm tracking-wider font-medium mx-5">
            COURSES
          </Link>
          <Link 
            to="/playground" 
            className="text-white text-sm tracking-wider font-medium mx-5"
            onClick={(e) => handleProtectedRoute(e, '/playground')}
          >
            PLAYGROUND
          </Link>
          <Link 
            to="/problem-solving" 
            className="text-white text-sm tracking-wider font-medium mx-5"
            onClick={(e) => handleProtectedRoute(e, '/problem-solving')}
          >
            PROBLEM SOLVING
          </Link>
          <Link to="/about" className="text-white text-sm tracking-wider font-medium mx-5">
            ABOUT US
          </Link>
        </div>

        {/* Add LoginPopup component */}
        <LoginPopup />

        {/* Auth Buttons or User Profile */}
        {isLoading ? (
          <div className="w-24 h-8 bg-white/20 rounded-full animate-pulse"></div>
        ) : isLoggedIn && user ? (
          <div className="relative user-dropdown z-50">
            <button 
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center space-x-2 text-white hover:text-gray-100 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center overflow-hidden">
                {user.profile_image ? (
                  <img 
                    src={user.profile_image} 
                    alt={user.username} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-white font-medium">
                    {user.username?.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <span className="text-sm font-medium">{user.username}</span>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className={`h-4 w-4 transition-transform ${showDropdown ? 'rotate-180' : ''}`}
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 border border-gray-100 z-50">
                <button 
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50 transition-colors flex items-center space-x-2"
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-4 w-4" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" 
                    />
                  </svg>
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center space-x-3">
            <Link 
              to="/login" 
              className="bg-white text-gray-700 px-7 py-2 rounded-full text-sm font-medium hover:bg-gray-100 transition-colors"
            >
              Login
            </Link>
            <Link 
              to="/register" 
              className="bg-[#4DC1B8] text-white px-7 py-2 rounded-full text-sm font-medium border border-white hover:bg-[#45b0a8] transition-colors"
            >
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
