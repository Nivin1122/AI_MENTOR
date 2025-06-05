import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { motion } from 'framer-motion'

const MainNavbar = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showDropdown, setShowDropdown] = useState(false)
  const [showLoginPopup, setShowLoginPopup] = useState(false)
  const isLoggedIn = localStorage.getItem("accessToken") !== null

  useEffect(() => {
    const fetchUserData = async () => {
      if (isLoggedIn) {
        try {
          const token = localStorage.getItem('accessToken')
          if (!token) {
            throw new Error('No token found')
          }

          const response = await axios.get('http://localhost:8000/users/profile/', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          })
          
          if (response.data) {
            setUser(response.data)
          }
        } catch (error) {
          console.error('Error fetching user data:', error)
          if (error.response?.status === 401 || error.response?.status === 400) {
            handleLogout()
          }
        }
      }
      setIsLoading(false)
    }

    fetchUserData()
  }, [isLoggedIn])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showDropdown && !event.target.closest('.user-dropdown')) {
        setShowDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showDropdown])

  const handleLogout = () => {
    localStorage.removeItem("accessToken")
    localStorage.removeItem("refreshToken")
    setUser(null)
    setShowDropdown(false)
    navigate("/login")
  }

  const handleProtectedRoute = (e, path) => {
    if (!isLoggedIn) {
      e.preventDefault()
      setShowLoginPopup(true)
    } else {
      navigate(path)
    }
  }

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
                setShowLoginPopup(false)
                navigate('/login')
              }}
              className="px-4 py-2 bg-gradient-to-r from-teal-400 to-teal-300 text-white rounded-md hover:opacity-90 transition-opacity"
            >
              Login Now
            </button>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <header className="bg-white py-3 px-12 flex items-center justify-between border-b border-gray-100">
      {/* Logo */}
      <div className="flex items-center">
        <Link to="/" className="flex items-center">
          <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-teal-300 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">TOTC</span>
          </div>
        </Link>
      </div>
      
      {/* Navigation Links */}
      <nav className="flex items-center space-x-10 mx-auto">
        <NavLink to="/" active={location.pathname === "/"}>HOME</NavLink>
        {/* <NavLink to="/ai-mentor" active={location.pathname === "/ai-mentor"}>AI MENTOR</NavLink> */}
        <NavLink to="/courses" active={location.pathname === "/courses"}>COURSES</NavLink>
        <ProtectedNavLink 
          to="/playground" 
          active={location.pathname === "/playground"}
          onClick={(e) => handleProtectedRoute(e, '/playground')}
        >
          PLAYGROUND
        </ProtectedNavLink>
        {/* <NavLink to="/suggestion" active={location.pathname === "/suggestion"}>SUGGESTION</NavLink> */}
        <ProtectedNavLink 
          to="/problem-solving" 
          active={location.pathname === "/problem-solving"}
          onClick={(e) => handleProtectedRoute(e, '/problem-solving')}
        >
          PROBLEM SOLVING
        </ProtectedNavLink>
      </nav>
      
      {/* Add LoginPopup component */}
      <LoginPopup />
      
      {/* User Profile or Auth Buttons */}
      {isLoading ? (
        <div className="w-24 h-8 bg-gray-100 rounded-full animate-pulse"></div>
      ) : isLoggedIn && user ? (
        <div className="relative user-dropdown">
          <button 
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-400 to-teal-300 flex items-center justify-center overflow-hidden">
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
            <span className="text-gray-700 text-sm font-medium">{user.username}</span>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className={`h-4 w-4 text-gray-400 transition-transform ${showDropdown ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Dropdown Menu */}
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 border border-gray-100">
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
            className="text-gray-700 hover:text-gray-900 text-sm font-medium transition-colors"
          >
            Login
          </Link>
          <Link 
            to="/register" 
            className="bg-gradient-to-r from-teal-400 to-teal-300 text-white px-6 py-2 rounded-full text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Sign Up
          </Link>
        </div>
      )}
    </header>
  )
}

// Modify NavLink component to handle protected routes
const ProtectedNavLink = ({ to, active, onClick, children }) => {
  return (
    <Link 
      to={to} 
      onClick={onClick}
      className={`text-xs tracking-wide font-medium ${active ? 'text-black' : 'text-gray-500'} hover:text-black transition-colors`}
    >
      {children}
    </Link>
  )
}

// Keep the original NavLink for non-protected routes
const NavLink = ({ to, active, children }) => {
  return (
    <Link 
      to={to} 
      className={`text-xs tracking-wide font-medium ${active ? 'text-black' : 'text-gray-500'} hover:text-black transition-colors`}
    >
      {children}
    </Link>
  )
}

export default MainNavbar