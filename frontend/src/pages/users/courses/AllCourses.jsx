import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { 
  Card, 
  Grid, 
  Typography, 
  Container, 
  CircularProgress, 
  Box,
  Rating,
  Chip,
  Skeleton,
  useTheme,
  alpha
} from '@mui/material';
import { motion } from 'framer-motion';
import { styled } from '@mui/material/styles';
import LanguageIcon from '@mui/icons-material/Language';
import CategoryIcon from '@mui/icons-material/Category';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import MainNavbar from '../../../components/navbar/MainNavbar';

// Styled components
const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: theme.shadows[8],
  },
}));

const ImageContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  paddingTop: '56.25%', // 16:9 aspect ratio
  overflow: 'hidden',
  backgroundColor: alpha(theme.palette.primary.main, 0.1),
}));

const StyledImage = styled('img')({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'scale(1.05)',
  },
});

const CourseInfo = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  flexGrow: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
}));

const CourseChip = styled(Chip)(({ theme }) => ({
  marginRight: theme.spacing(1),
  marginBottom: theme.spacing(1),
}));

const AllCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isVisible, setIsVisible] = useState(true);
  const sectionRef = useRef(null);
  const theme = useTheme();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get('http://localhost:8000/courses/list/');
        setCourses(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch courses. Please try again later.');
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  if (loading) {
    return (
      <>
        <MainNavbar />
        <div className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="bg-white rounded-xl shadow-sm overflow-hidden animate-pulse">
                  <div className="h-40 bg-gray-200"></div>
                  <div className="p-5">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <MainNavbar />
        <div className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-6 text-center">
            <div className="text-red-500 mb-2">{error}</div>
            <button 
              onClick={() => window.location.reload()}
              className="text-[#4DC1B8] hover:text-[#00CBB3] font-medium transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <MainNavbar />
      <div className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-[#252641]">
              All Courses
            </h2>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">
                {courses.length} courses available
              </span>
            </div>
          </div>

          <div 
            ref={sectionRef}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {courses.map((course, index) => (
              <Link to={`/courses/${course.id}`} key={course.id}>
                <div 
                  className="bg-white rounded-xl shadow-sm overflow-hidden transition-all duration-500 
                    hover:shadow-md hover:-translate-y-1 group"
                >
                  {/* Course Image with rounded corners */}
                  <div className="mx-4 mt-4 rounded-lg overflow-hidden">
                    <img 
                      src={course.image.startsWith('http') ? course.image : `http://localhost:8000${course.image}`}
                      alt={course.title}
                      className="w-full h-40 object-cover transition-transform duration-700 group-hover:scale-110"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "src/assets/home/course.jpg"; // Fallback image
                      }}
                    />
                  </div>
                  
                  {/* Course details */}
                  <div className="p-5">
                    <div className="flex justify-between items-center mb-3">
                      <span className="inline-block text-xs font-medium px-2 py-1 bg-gray-100 text-gray-600 rounded">
                        {course.category}
                      </span>
                      <div className="flex items-center text-sm text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        3 Month
                      </div>
                    </div>
                    
                    <h3 className="text-lg font-bold text-[#252641] mb-2 transition-colors duration-300 group-hover:text-[#4DC1B8]">
                      {course.title}
                    </h3>
                    
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {course.short_description}
                    </p>
                    
                    {/* Language and price */}
                    <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full mr-2 bg-gray-200 flex items-center justify-center overflow-hidden">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                          </svg>
                        </div>
                        <span className="text-sm font-medium">
                          {course.language}
                        </span>
                      </div>
                      
                      <div className="flex items-center">
                        <span className="text-lg text-[#4DC1B8] font-bold">
                          ₹{course.price}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default AllCourses;
