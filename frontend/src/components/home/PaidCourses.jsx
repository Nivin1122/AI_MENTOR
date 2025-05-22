import React, { useEffect, useState, useRef } from 'react';

const PaidCourses = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showModal, setShowModal] = useState(false);
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

  // Course data
  const courses = [
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

  const handleCourseClick = (e) => {
    e.preventDefault();
    setShowModal(true);
  };

  return (
    <div className="py-16 bg-[#F7FAFC]">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-[#252641]">
            PAID COURSES
          </h2>
          <a href="#" className="text-[#4DC1B8] hover:text-[#00CBB3] font-medium transition-colors">
            See all
          </a>
        </div>

        <div 
          ref={sectionRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {courses.map((course, index) => (
            <div 
              key={course.id} 
              className={`bg-white rounded-xl shadow-sm overflow-hidden transition-all duration-500 
                ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}
                hover:shadow-md hover:-translate-y-1 group relative cursor-pointer`}
              style={{ 
                transitionDelay: `${index * 100}ms`,
              }}
              onClick={handleCourseClick}
            >
              {/* Course Image with Lock Icon */}
              <div className="h-48 overflow-hidden relative">
                <img 
                  src={course.image} 
                  alt={course.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-0 right-0 bg-[#4DC1B8] text-white p-2 rounded-bl-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              
              {/* Course details */}
              <div className="p-5">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm text-gray-600">{course.category}</span>
                  <div className="flex items-center text-sm text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {course.duration}
                  </div>
                </div>
                
                <h3 className="text-lg font-bold text-[#252641] mb-2 transition-colors duration-300 group-hover:text-[#4DC1B8]">
                  {course.title}
                </h3>
                
                <p className="text-sm text-gray-600 mb-4">
                  {course.description}
                </p>
                
                {/* Instructor and price */}
                <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                  <div className="flex items-center">
                    <img 
                      src={course.instructor.avatar} 
                      alt={course.instructor.name}
                      className="w-8 h-8 rounded-full mr-2 object-cover"
                    />
                    <span className="text-sm font-medium">{course.instructor.name}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <span className="text-sm text-gray-500 line-through mr-2">{course.regularPrice}</span>
                    <span className="text-lg text-[#4DC1B8] font-bold">{course.salePrice}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Dialog */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full shadow-xl transform transition-all">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 0v2m0-2h2m-2 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Paid Course Access</h3>
              <div className="mt-2">
                <p className="text-sm text-gray-600">
                  You are not a paid user. Please upgrade your account to access this course.
                </p>
              </div>
              <div className="mt-6 flex justify-center">
                {/* <button
                  type="button"
                  className="inline-flex justify-center rounded-md border border-transparent bg-[#4DC1B8] px-4 py-2 text-sm font-medium text-white hover:bg-[#3AA59C] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4DC1B8] focus-visible:ring-offset-2"
                  onClick={() => setShowModal(false)}
                >
                  Upgrade Now
                </button> */}
                <button
                  type="button"
                  className="ml-3 inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
                  onClick={() => setShowModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaidCourses;