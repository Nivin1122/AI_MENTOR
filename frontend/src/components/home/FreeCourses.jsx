import React, { useEffect, useState, useRef } from 'react';

const FreeCourses = () => {
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

  return (
    <div className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-[#252641]">
            FREE COURCES
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
                hover:shadow-md hover:-translate-y-1 group`}
              style={{ 
                transitionDelay: `${index * 100}ms`,
              }}
            >
              {/* Course Image with rounded corners */}
              <div className="mx-4 mt-4 rounded-lg overflow-hidden">
                <img 
                  src={course.image} 
                  alt={course.title}
                  className="w-full h-40 object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              
              {/* Course details */}
              <div className="p-5">
                <div className="flex justify-between items-center mb-3">
                  <span className="inline-block text-xs font-medium px-2 py-1 bg-gray-100 text-gray-600 rounded">{course.category}</span>
                  <div className="flex items-center text-sm text-gray-400">
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
    </div>
  );
};

export default FreeCourses; 