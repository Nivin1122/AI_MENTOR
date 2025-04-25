import React, { useEffect, useState, useRef } from 'react';

const Features = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
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

  // Features data
  const features = [
    {
      id: 1,
      title: "A user interface designed for the classroom",
      description: "Our intuitive, easy-to-navigate interface enhances classroom experience and engagement",
      icon: "layout",
      color: "#6A75F8",
      benefits: [
        {
          icon: "grid",
          text: "Teachers don't get lost in the grid view and have a dedicated Podium space."
        },
        {
          icon: "users",
          text: "TA's and presenters can be moved to the front of the class."
        },
        {
          icon: "eye",
          text: "Teachers can easily see all students and class data at one time."
        }
      ]
    },
    {
      id: 2,
      title: "Interactive learning tools that engage students",
      description: "Boost engagement with real-time polls, quizzes, and collaborative whiteboards",
      icon: "activity",
      color: "#FF5D5D",
      benefits: [
        {
          icon: "zap",
          text: "Real-time quizzes with instant feedback keep students motivated."
        },
        {
          icon: "message-square",
          text: "Breakout rooms with integrated tools for group collaboration."
        },
        {
          icon: "award",
          text: "Gamification elements to reward participation and progress."
        }
      ]
    },
    {
      id: 3,
      title: "Advanced analytics to track student progress",
      description: "Comprehensive insights into student performance, attendance, and engagement",
      icon: "bar-chart-2",
      color: "#00CBB3",
      benefits: [
        {
          icon: "trending-up",
          text: "Track individual and class progress with visual performance dashboards."
        },
        {
          icon: "clock",
          text: "Monitor attendance and time spent on different learning activities."
        },
        {
          icon: "file-text",
          text: "Generate detailed reports to identify areas for improvement."
        }
      ]
    }
  ];

  // Function to render icon
  const renderIcon = (iconName, color) => {
    const icons = {
      layout: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
        </svg>
      ),
      activity: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      "bar-chart-2": (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      grid: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      ),
      users: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      eye: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      ),
      zap: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      "message-square": (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
      award: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
        </svg>
      ),
      "trending-up": (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
      clock: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      "file-text": (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    };

    return icons[iconName] || icons["layout"];
  };

  return (
    <div className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div 
          className={`text-center mb-10 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="text-[#4B3E8A]">Our</span> <span className="text-[#00CBB3]">Features</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            This very extraordinary feature, can make learning activities more efficient
          </p>
        </div>

        <div ref={sectionRef} className="mt-16">
          {/* Feature tabs */}
          <div className="flex flex-wrap justify-center mb-10 gap-4">
            {features.map((feature, index) => (
              <button
                key={feature.id}
                onClick={() => setActiveTab(index)}
                className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeTab === index 
                    ? `bg-[${feature.color}] text-white shadow-md`
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                style={{ backgroundColor: activeTab === index ? feature.color : '' }}
              >
                {feature.title.split(' ').slice(0, 3).join(' ')}...
              </button>
            ))}
          </div>

          {/* Feature content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            {/* Left side - Interactive Feature Visualization */}
            <div 
              className={`relative rounded-2xl bg-gray-50 p-8 h-96 overflow-hidden transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'
              }`}
            >
              {/* Decorative elements */}
              <div className="absolute top-10 left-10 w-24 h-24 rounded-full bg-[#4DC1B8]/20 z-0"></div>
              <div className="absolute bottom-10 right-10 w-32 h-32 rounded-full bg-[#6A75F8]/20 z-0"></div>
              <div className="absolute top-1/2 right-10 w-6 h-6 rounded-full bg-[#FF5D5D] z-0"></div>
              <div className="absolute bottom-20 left-20 w-8 h-8 rounded-full bg-[#FFA337]/30 z-0"></div>
              
              {/* Main feature visual representation */}
              <div className="relative z-10 h-full flex items-center justify-center">
                <div 
                  className="w-24 h-24 rounded-full flex items-center justify-center transform transition-all duration-500"
                  style={{ 
                    backgroundColor: features[activeTab].color,
                    transform: isVisible ? 'scale(1) rotate(0deg)' : 'scale(0.8) rotate(-20deg)'
                  }}
                >
                  <div className="text-white">
                    {renderIcon(features[activeTab].icon, "#FFFFFF")}
                  </div>
                </div>
                
                {/* Feature title for mobile */}
                <div className="absolute -bottom-2 inset-x-0 bg-white/80 backdrop-blur-sm p-4 rounded-lg lg:hidden">
                  <h3 className="text-xl font-bold text-[#252641]">{features[activeTab].title}</h3>
                </div>

                {/* Animated connection lines */}
                <div className="absolute inset-0 flex items-center justify-center">
                  {[...Array(8)].map((_, i) => (
                    <div 
                      key={i} 
                      className="absolute h-px bg-gray-300/60 transition-all duration-700"
                      style={{ 
                        width: `${100 + i * 20}px`, 
                        transform: `rotate(${i * 45}deg)`,
                        opacity: isVisible ? 0.6 : 0
                      }}
                    ></div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Right side - Feature details */}
            <div 
              className={`transition-all duration-700 delay-300 ${
                isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'
              }`}
            >
              <h3 className="text-3xl font-bold mb-4">
                <span className="text-[#6A75F8]">A</span> <span className="text-[#00CBB3]">user interface</span> <span className="text-[#4B3E8A]">designed for the classroom</span>
              </h3>
              <p className="text-gray-600 mb-8">{features[activeTab].description}</p>
              
              <div className="space-y-6">
                {features[activeTab].benefits.map((benefit, index) => (
                  <div 
                    key={index} 
                    className={`flex items-start transition-all duration-500 ${
                      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                    }`}
                    style={{ transitionDelay: `${500 + index * 100}ms` }}
                  >
                    <div 
                      className="w-10 h-10 rounded-lg flex items-center justify-center mr-4 flex-shrink-0"
                      style={{ backgroundColor: `${features[activeTab].color}20` }}
                    >
                      <div className="text-[#4B3E8A]">
                        {renderIcon(benefit.icon, features[activeTab].color)}
                      </div>
                    </div>
                    <p className="text-gray-700">{benefit.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="text-center mt-14">
            <a 
              href="#" 
              className="inline-flex items-center justify-center px-8 py-3 border border-[#4DC1B8] text-[#4DC1B8] rounded-full hover:bg-[#4DC1B8]/5 transition-colors text-sm font-medium"
            >
              See more features
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features; 