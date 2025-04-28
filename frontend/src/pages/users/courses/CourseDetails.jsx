import React, { useEffect, useState, useRef } from 'react'
import { FiStar, FiCheckCircle, FiClock, FiUsers } from 'react-icons/fi'
import { 
  FaFacebookF, 
  FaTwitter, 
  FaYoutube, 
  FaLinkedinIn, 
  FaPinterestP, 
  FaWhatsapp 
} from 'react-icons/fa'
import { motion, useScroll, useTransform, useMotionValue } from 'framer-motion'
import MainNavbar from '../../../components/navbar/MainNavbar'
import { useParams } from 'react-router-dom';
import axios from 'axios';


const CourseDetails = () => {
  const containerRef = useRef(null);
  const overviewRef = useRef(null);

  const { id } = useParams();
  const [course, setCourse] = useState(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/courses/courses/${id}/`);
        setCourse(response.data);
      } catch (error) {
        console.error('Error fetching course:', error);
      }
    };

    fetchCourse();
  }, [id]);

  if (!course) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  
  return (
    <div>
      <MainNavbar />
      <div className="container mx-auto px-6 py-8" ref={containerRef}>
        
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="w-full relative mb-8"
      >
        <div className="relative w-full h-[450px] overflow-hidden rounded-lg">
   
          <motion.img 
            initial={{ scale: 1.05 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.2 }}
            src={`http://127.0.0.1:8000${course.image}`}
            alt="Course training session" 
            className="w-full h-full object-cover object-center"
          />
        </div>

        <div style={{ height: "50px" }} className="w-full"></div>
          
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.7, type: "spring" }}
          style={{ 
            position: "absolute", 
            top: "120px",
            right: "40px"
          }}
          className="w-72 bg-white rounded-xl shadow-lg overflow-hidden z-10"
        >

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="w-full h-44 overflow-hidden border-4 border-white"
          >
            <motion.img 
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              src={`http://127.0.0.1:8000${course.image}`}
              alt="Course thumbnail"
              className="w-full h-full object-cover"
            />
          </motion.div>

          <div className="p-5">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.5 }}
              className="flex justify-between items-start"
            >
              <div className="flex flex-col">
                <span className="text-2xl font-bold line-through">{course.price}</span>
                <span className="text-gray-400 text-sm line-through">{course.price}</span>
              </div>
              <motion.span 
                whileHover={{ scale: 1.05 }}
                className="bg-blue-50 text-blue-800 text-xs font-bold px-2.5 py-1.5 rounded"
              >
                50% Off
              </motion.span>
            </motion.div>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.5 }}
              className="text-sm text-teal-500 font-medium my-2"
            >
              11 hour left at this price
            </motion.p>
            
            <motion.button 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.1, duration: 0.5 }}
              whileHover={{ scale: 1.03, backgroundColor: "#00a99d" }}
              whileTap={{ scale: 0.97 }}
              className="w-full py-3 bg-teal-500 text-white rounded-md font-medium transition-all"
            >
              Buy Now
            </motion.button>
            
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.5 }}
              className="mt-5"
            >
              <h4 className="font-semibold text-base mb-2">This Course included</h4>
              
              <div className="space-y-2">
                <CourseFeature icon={<FiCheckCircle />} text="Money Back Guarantee" delay={1.3} />
                <CourseFeature icon={<FiCheckCircle />} text="Access on all devices" delay={1.4} />
                <CourseFeature icon={<FiCheckCircle />} text="Certification of completion" delay={1.5} />
                <CourseFeature icon={<FiClock />} text="32 Modules" delay={1.6} />
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.7, duration: 0.5 }}
              className="mt-5 pt-4 border-t border-gray-200"
            >
              <h4 className="font-semibold text-base mb-2">{course.language}</h4>
              <p className="text-sm text-gray-600 leading-snug">
                {course.full_description}
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.8, duration: 0.5 }}
              className="mt-5 pt-4 border-t border-gray-200"
            >
              <h4 className="font-semibold text-base mb-2">Share this course</h4>
              <div className="flex space-x-2">
                <SocialButton icon={<FaFacebookF size={12} />} color="bg-blue-600" delay={1.9} />
                <SocialButton icon={<FaTwitter size={12} />} color="bg-sky-500" delay={1.95} />
                <SocialButton icon={<FaYoutube size={12} />} color="bg-red-600" delay={2.0} />
                <SocialButton icon={<FaLinkedinIn size={12} />} color="bg-blue-700" delay={2.05} />
                <SocialButton icon={<FaPinterestP size={12} />} color="bg-red-700" delay={2.1} />
                <SocialButton icon={<FaWhatsapp size={12} />} color="bg-green-500" delay={2.15} />
              </div>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
      
      {/* Navigation Tabs - moved up with left margin */}
      <motion.div 
        ref={overviewRef}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="flex space-x-3 mb-6 max-w-3xl ml-16"
      >
        <NavButton label="Overview" active />
        <NavButton label="Overview" />
        <NavButton label="Overview" />
        <NavButton label="Overview" active={false} teal />
      </motion.div>
      
      {/* Rating Section - with left margin */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.8 }}
        className="bg-blue-50 rounded-xl p-8 max-w-3xl ml-16"
      >
        <div className="flex flex-col md:flex-row">
          {/* Left side - Rating Summary */}
          <div className="flex items-center justify-center flex-col md:w-1/3 border-b md:border-b-0 md:border-r border-blue-100 pb-6 md:pb-0 mb-6 md:mb-0 pr-0 md:pr-6">
            <div className="text-xl font-bold mb-2">4 out of 5</div>
            <div className="flex text-yellow-400 mb-3">
              <Star filled />
              <Star filled />
              <Star filled />
              <Star filled />
              <Star />
            </div>
            <div className="text-sm text-gray-500">Top Rating</div>
          </div>
          
          {/* Right side - Detailed Ratings */}
          <div className="md:w-2/3 md:pl-8 space-y-3">
            <RatingBar stars={5} percentage={75} delay={0.7} />
            <RatingBar stars={4} percentage={65} delay={0.8} />
            <RatingBar stars={3} percentage={50} delay={0.9} />
            <RatingBar stars={2} percentage={35} delay={1.0} />
            <RatingBar stars={1} percentage={20} delay={1.1} />
          </div>
        </div>
        
        {/* Reviews */}
        <div className="mt-10 border-t border-blue-100 pt-8">
          <ReviewCard 
            avatar="/src/assets/users/lina.jpg"
            name="Lina"
            time="3 Month"
            text="Class, launched less than a year ago by Blackboard co-founder Michael Chasen, integrates exclusively..."
            delay={1.2}
          />
          
          <ReviewCard 
            avatar="/src/assets/users/lina.jpg"
            name="Lina"
            time="3 Month"
            text="Class, launched less than a year ago by Blackboard co-founder Michael Chasen, integrates exclusively..."
            delay={1.4}
          />
        </div>
      </motion.div>
      
      {/* Add some extra content to make the page scrollable for testing */}
      <div className="py-20"></div>
    </div>
    </div>
  )
}

// Helper Components
const CourseFeature = ({ icon, text, delay }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: delay, duration: 0.4 }}
      className="flex items-center"
    >
      <div className="text-teal-500 mr-2 w-4 h-4 flex-shrink-0">
        {icon}
      </div>
      <span className="text-sm">{text}</span>
    </motion.div>
  );
};

const Star = ({ filled }) => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill={filled ? "currentColor" : "none"} 
      stroke="currentColor" 
      className="w-5 h-5"
      strokeWidth={filled ? "0" : "2"}
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" 
      />
    </svg>
  )
}

const NavButton = ({ label, active, teal }) => {
  const baseClasses = "py-2.5 px-8 rounded-full text-sm font-medium transition-all duration-200"
  
  if (teal) {
    return (
      <motion.button 
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`${baseClasses} ${active ? 'bg-teal-500 text-white' : 'bg-gray-200 text-gray-500'}`}
      >
        {label}
      </motion.button>
    )
  }
  
  return (
    <motion.button 
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`${baseClasses} ${active ? 'bg-gray-200 text-gray-800' : 'bg-gray-100 text-gray-500'}`}
    >
      {label}
    </motion.button>
  )
}

const RatingBar = ({ stars, percentage, delay }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: delay, duration: 0.5 }}
      className="flex items-center"
    >
      <div className="w-14 text-sm text-gray-600">{stars} Stars</div>
      <div className="flex-grow mx-3 bg-blue-100 rounded-full h-2.5 overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1.2, delay: delay + 0.2 }}
          className="bg-teal-400 h-2.5 rounded-full"
        />
      </div>
    </motion.div>
  )
}

const ReviewCard = ({ avatar, name, time, text, delay }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay, duration: 0.6 }}
      className="mb-4 pb-4 border-b border-blue-100 last:border-b-0 last:pb-0 last:mb-0"
    >
      <div className="flex items-center mb-2">
        <img 
          src={avatar}
          alt={name} 
          className="w-10 h-10 rounded-full mr-3 object-cover border-2 border-white"
        />
        <div>
          <div className="font-medium text-gray-800">{name}</div>
          <div className="flex items-center space-x-2">
            <div className="flex text-yellow-400">
              <Star filled />
              <Star filled />
              <Star filled />
              <Star filled />
              <Star filled />
            </div>
            <span className="text-xs text-gray-400">{time}</span>
          </div>
        </div>
      </div>
      
      <p className="text-sm text-gray-600 leading-relaxed">{text}</p>
    </motion.div>
    
  )
  
}

const SocialButton = ({ icon, color, delay }) => {
  return (
    <motion.button 
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: delay, duration: 0.4, type: "spring" }}
      whileHover={{ scale: 1.2 }}
      whileTap={{ scale: 0.9 }}
      className={`${color} w-8 h-8 rounded-full flex items-center justify-center text-white shadow-sm`}
    >
      {icon}
    </motion.button>
  )
}

export default CourseDetails