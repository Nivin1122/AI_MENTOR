import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';

const FreeCourses = ({ apiCourses, isLoading, hasError }) => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(sectionRef.current);
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

  // Default course data if no API data provided
  const defaultCourses = [
    {
      id: 1,
      image: "src/assets/home/course.jpg",
      category: "Design",
      duration: "3 Month",
      title: "AWS Certified solutions Architect",
      description: "Lorem ipsum dolor sit amet, consectetur adipising elit, sed do eiusmod tempor",
      instructor: {
        name: "Lina",
        avatar: "src/assets/home/course_icon.jpg"
      },
      regularPrice: "$100",
      salePrice: "$80"
    },
    {
      id: 2,
      image: "src/assets/home/course.jpg",
      category: "Design",
      duration: "3 Month",
      title: "AWS Certified solutions Architect",
      description: "Lorem ipsum dolor sit amet, consectetur adipising elit, sed do eiusmod tempor",
      instructor: {
        name: "Lina",
        avatar: "src/assets/home/course_icon.jpg"
      },
      regularPrice: "$100",
      salePrice: "$80"
    },
    {
      id: 3,
      image: "src/assets/home/course.jpg",
      category: "Design",
      duration: "3 Month",
      title: "AWS Certified solutions Architect",
      description: "Lorem ipsum dolor sit amet, consectetur adipising elit, sed do eiusmod tempor",
      instructor: {
        name: "Lina",
        avatar: "src/assets/home/course_icon.jpg"
      },
      regularPrice: "$100",
      salePrice: "$80"
    },
    {
      id: 4,
      image: "src/assets/home/course.jpg",
      category: "Design",
      duration: "3 Month",
      title: "AWS Certified solutions Architect",
      description: "Lorem ipsum dolor sit amet, consectetur adipising elit, sed do eiusmod tempor",
      instructor: {
        name: "Lina",
        avatar: "src/assets/home/course_icon.jpg"
      },
      regularPrice: "$100",
      salePrice: "$80"
    }
  ];

  // Use API data if provided, otherwise use default data
  const coursesToDisplay = apiCourses && apiCourses.length > 0 ? apiCourses : defaultCourses;
  console.log(coursesToDisplay)

  return (
    <div className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-[#252641]">
            FREE COURSES
          </h2>
          <a href="#" className="text-[#4DC1B8] hover:text-[#00CBB3] font-medium transition-colors">
            See all
          </a>
        </div>

        {isLoading && <p className="text-center py-8">Loading courses...</p>}
        {hasError && <p className="text-center text-red-500 py-8">{hasError}</p>}
        
        <div 
          ref={sectionRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {coursesToDisplay.map((course, index) => (
            <Link to={`/courses/${course.id}`} key={course.id}>
            <div 
              key={course.id} 
              className={`bg-white rounded-xl shadow-sm overflow-hidden transition-all duration-500 
                ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}
                hover:shadow-md hover:-translate-y-1 group`}
              style={{ 
                transitionDelay: `${index * 100}ms`,
              }}
            >
              {/* Course Image with rounded corners */}
              <div className="mx-4 mt-4 rounded-lg overflow-hidden">
                <img 
                  src={apiCourses ? 
                    (course.image.startsWith('http') ? course.image : `http://localhost:8000${course.image}`) : 
                    course.image
                  } 
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
                    {apiCourses ? "3 Month" : course.duration}
                  </div>
                </div>
                
                <h3 className="text-lg font-bold text-[#252641] mb-2 transition-colors duration-300 group-hover:text-[#4DC1B8]">
                  {course.title}
                </h3>
                
                <p className="text-sm text-gray-600 mb-4">
                  {apiCourses ? course.short_description : course.description}
                </p>
                
                {/* Instructor and price */}
                <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                  <div className="flex items-center">
                    {apiCourses ? (
                      <div className="w-8 h-8 rounded-full mr-2 bg-gray-200 flex items-center justify-center overflow-hidden">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                    ) : (
                      <img 
                        src={course.instructor.avatar} 
                        alt={course.instructor.name}
                        className="w-8 h-8 rounded-full mr-2 object-cover"
                      />
                    )}
                    <span className="text-sm font-medium">
                      {apiCourses ? "Instructor" : course.instructor.name}
                    </span>
                  </div>
                  
                  <div className="flex items-center">
                    {apiCourses ? (
                      <span className="text-lg text-[#4DC1B8] font-bold line-through">₹{course.price}</span>
                    ) : (
                      <>
                        <span className="text-sm text-gray-500 line-through mr-2">{course.regularPrice}</span>
                        <span className="text-lg text-[#4DC1B8] font-bold">{course.salePrice}</span>
                      </>
                    )}
                  </div>

                </div>
              </div>
            </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FreeCourses; 