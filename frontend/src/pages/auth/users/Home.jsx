import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllCourses } from '../../../redux/slices/courses/courseSlice';
import Navbar from '../../../components/navbar/Navbar';
import SuccessMetrics from '../../../components/home/SuccessMetrics';
import CloudFeatures from '../../../components/home/CloudFeatures';
import CourseCategories from '../../../components/home/CourseCategories';
import PaidCourses from '../../../components/home/PaidCourses';
import FreeCourses from '../../../components/home/FreeCourses';
import Features from '../../../components/home/Features';
import Footer from '../../../components/home/Footer';

const HomePage = () => {
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { courses, loading, error } = useSelector((state) => state.courses);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");

    axios
      .get("http://localhost:8000/users/home/", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((res) => setMessage(res.data.message))
      .catch((err) => setMessage("Unauthorized: Please log in"));
  }, []);

  useEffect(() => {
    dispatch(fetchAllCourses());
  }, [dispatch]);

  return (
    <div>
      <div className="relative bg-[#4DC1B8] overflow-hidden">
        <Navbar /> 
        

        <div className="container mx-auto px-6 py-6 pb-12 md:pb-12 lg:pb-12 relative z-10">
          <div className="flex flex-col lg:flex-row items-center">
    
            <div className="w-full lg:w-1/2 text-white ml-20 mb-8 lg:mb-0">
              <h1 className="text-4xl lg:text-5xl font-bold leading-tight mb-4 lg:mb-6">
                <span className="text-[#FF9F67]">Studying</span> Online is now<br />
                much easier
              </h1>
              <p className="text-lg mb-6 max-w-lg">
                TOTC is an interesting platform that will teach
                you in more an interactive way
              </p>
              
              <div className="flex items-center space-x-4">
                <button 
                  onClick={() => navigate("/join")}
                  className="bg-[#65DAFF]/20 hover:bg-[#65DAFF]/30 text-white px-8 py-3 rounded-full text-sm font-medium transition-colors"
                >
                  Join for free
                </button>
                
                <button className="flex items-center justify-center">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#4DC1B8] ml-0.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="ml-3 text-white text-sm">Watch how it works</span>
                </button>
              </div>
            </div>
            
            {/* Right content with image and floating cards */}
            <div className="w-full lg:w-1/2 relative">
              {/* Container for the full image */}
              <div className="relative w-full" style={{ minHeight: "550px" }}>
                {/* Main image without clipping at the top */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <img 
                    src="src/assets/home/ai_robot.jpg" 
                    alt="Student with books" 
                    className="w-auto h-[600px] max-w-none object-contain z-5"
                  />
                </div>
              </div>
              
              {/* Floating elements */}
              {/* Students box */}
              {/* <div className="absolute top-16 left-0 lg:left-12 bg-white rounded-lg p-3 shadow-lg z-20 flex items-center">
                <div className="bg-[#4D95FC] p-2 rounded-lg mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div> */}
                {/* <div>
                  <div className="text-gray-800 font-bold text-lg">250k</div>
                  <div className="text-gray-500 text-sm">Assisted Student</div>
                </div> */}
              {/* </div> */}
              
              {/* Chart icon */}
              <div className="absolute top-10 right-5 lg:right-8 bg-[#FF5156] p-3 rounded-lg shadow-lg z-20">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              
              {/* Congratulations box */}
              {/* <div className="absolute right-6 top-1/3 bg-white rounded-lg p-3 shadow-lg z-20">
                <div className="flex items-center">
                  <div className="bg-[#FF9F67] p-2 rounded-lg mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-gray-800 font-medium text-sm">Congratulations</div>
                    <div className="text-gray-500 text-xs">Your admission completed</div>
                  </div>
                </div>
              </div> */}
              
              {/* Class notification - positioned to be visible above curve */}
              <div className="absolute bottom-28 md:bottom-32 lg:bottom-32 left-6 lg:left-12 bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-lg z-20 w-64 lg:w-72">
                <div className="flex items-start">
                  <div className="w-10 h-10 rounded-full mr-3 bg-gray-300 flex items-center justify-center overflow-hidden">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-gray-800 font-medium text-base">User Experience Class</h4>
                    <p className="text-gray-500 text-sm mb-3">Today at 12.00 PM</p>
                    
                    <button className="bg-[#EE4962] text-white px-5 py-2 rounded-full text-sm">
                      Join Now
                    </button>
                  </div>
                </div>        
              </div>
            </div>
          </div>
        </div>
        
        {/* Perfectly balanced downward arch curve */}
        <div className="absolute bottom-0 left-0 right-0 w-full z-10">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 1440 120"
            preserveAspectRatio="none" 
            className="w-full"
            style={{ display: 'block', height: '120px' }}
          >
            <path
              fill="#ffffff"
              fillOpacity="1"
              d="M0,0 L0,0 C360,120 1080,120 1440,0 L1440,0 L1440,120 L0,120 Z"
            ></path>
          </svg>
        </div>
      </div>

      <SuccessMetrics />
      <CloudFeatures />
      <CourseCategories />
      <PaidCourses />
      <FreeCourses apiCourses={courses} isLoading={loading} hasError={error} />
      <Features />
      <Footer />
    </div>
  );
};

export default HomePage;
