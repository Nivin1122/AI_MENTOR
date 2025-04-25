import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-[#4DC1B8] py-5">
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
          <Link to="/ai-mentor" className="text-white text-sm tracking-wider font-medium mx-5">
            AI MENTOR
          </Link>
          <Link to="/playground" className="text-white text-sm tracking-wider font-medium mx-5">
            PLAYGROUND
          </Link>
          <Link to="/suggestion" className="text-white text-sm tracking-wider font-medium mx-5">
            SUGGESTION
          </Link>
          <Link to="/about" className="text-white text-sm tracking-wider font-medium mx-5">
            ABOUT US
          </Link>
        </div>

        {/* Auth Buttons */}
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
      </div>
    </nav>
  );
};

export default Navbar;
