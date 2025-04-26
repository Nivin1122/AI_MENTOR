import React from 'react'
import { Link, useLocation } from 'react-router-dom'

const MainNavbar = () => {
  const location = useLocation()
  
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
        <NavLink to="/ai-mentor" active={location.pathname === "/ai-mentor"}>AI MENTOR</NavLink>
        <NavLink to="/playground" active={location.pathname === "/playground"}>PLAYGROUND</NavLink>
        <NavLink to="/suggestion" active={location.pathname === "/suggestion"}>SUGGESTION</NavLink>
        <NavLink to="/problem-solving" active={location.pathname === "/problem-solving"}>PROBLEM SOLVING</NavLink>
      </nav>
      
      {/* User Profile */}
      <div className="flex items-center">
        <div className="flex items-center">
          <img 
            src="/src/assets/home/hero.png" 
            alt="User Profile" 
            className="w-8 h-8 rounded-full object-cover border-2 border-white"
          />
          <span className="ml-2 text-gray-700 text-sm font-medium">LINA</span>
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-4 w-4 ml-1 text-gray-400" 
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </header>
  )
}

// Helper component for navigation links
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