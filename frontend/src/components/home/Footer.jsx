import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-[#272B4A] py-16">
      <div className="max-w-xl mx-auto px-6 flex flex-col items-center">
        {/* Logo and tagline */}
        <div className="flex flex-col md:flex-row items-center gap-4 mb-10">
          <div className="flex items-center">
            <div className="relative w-14 h-14">
              <div className="absolute inset-0 transform rotate-45 border-2 border-[#4DC1B8]"></div>
              <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-lg">
                TOTC
              </div>
            </div>
          </div>
          <div className="h-10 w-px bg-gray-700 hidden md:block mx-4"></div>
          <div className="text-white text-center md:text-left">
            <p className="font-medium">Virtual Class</p>
            <p className="text-sm text-gray-400">for Zoom</p>
          </div>
        </div>
        
        {/* Newsletter subscription */}
        <div className="mb-10 w-full">
          <h3 className="text-white text-center mb-6 text-base font-normal">
            Subscribe to get our Newsletter
          </h3>
          <div className="flex flex-col sm:flex-row gap-3">
            <input 
              type="email" 
              placeholder="Your Email" 
              className="flex-grow py-3 px-6 rounded-full bg-[#2F3454] border border-[#3C4073] text-white placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#4DC1B8]/50 text-sm"
            />
            <button className="sm:w-auto w-full px-8 py-3 bg-[#4DC1B8] rounded-full text-white font-medium hover:opacity-90 transition-opacity text-sm">
              Subscribe
            </button>
          </div>
        </div>
        
        {/* Footer links */}
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mb-6">
          <a href="#" className="text-white text-sm hover:text-[#4DC1B8] transition-colors">
            Careers
          </a>
          <span className="text-gray-600">|</span>
          <a href="#" className="text-white text-sm hover:text-[#4DC1B8] transition-colors">
            Privacy Policy
          </a>
          <span className="text-gray-600">|</span>
          <a href="#" className="text-white text-sm hover:text-[#4DC1B8] transition-colors">
            Terms & Conditions
          </a>
        </div>
        
        {/* Copyright */}
        <div className="text-gray-500 text-sm">
          © 2021 Class Technologies Inc.
        </div>
      </div>
    </footer>
  );
};

export default Footer;