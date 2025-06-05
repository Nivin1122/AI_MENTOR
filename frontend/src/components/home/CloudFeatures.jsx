import React, { useEffect, useState, useRef } from 'react';

const CloudFeatures = () => {
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

  const features = [
    {
      icon: "document",
      color: "#6A75F8",
      title: "Online Billing, Invoicing, & Contracts",
      description: "Simple and secure control of your organization's financial and legal transactions. Send customized invoices and contracts"
    },
    {
      icon: "calendar",
      color: "#00CBB3",
      title: "Easy Scheduling & Attendance Tracking",
      description: "Schedule and reserve classrooms at one campus or multiple campuses. Keep detailed records of student attendance"
    },
    {
      icon: "users",
      color: "#29B9E7",
      title: "Customer Tracking",
      description: "Automate and track emails to individuals or groups. Skilline's built-in system helps organize your organization"
    }
  ];

  return (
    <div className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div 
          className={`text-center mb-14 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="text-[#4B3E8A]">All-In-One</span> <span className="text-[#00CBB3]">Cloud Software.</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-base leading-relaxed">
            TOTC is one powerful online software suite that combines all the tools
            needed to run a successful school or office.
          </p>
        </div>

        <div 
          ref={sectionRef}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <div 
              key={index} 
              className={`bg-white p-8 rounded-lg shadow-sm border border-gray-100 transition-all duration-700 text-center ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
              }`}
              style={{ 
                transitionDelay: `${index * 150}ms`,
                transform: isVisible ? 'translateY(0)' : 'translateY(40px)'
              }}
            >
              {/* Icon */}
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-6" style={{ backgroundColor: feature.color }}>
                {feature.icon === "document" && (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                )}
                {feature.icon === "calendar" && (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                )}
                {feature.icon === "users" && (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                )}
              </div>
              
              {/* Title */}
              <h3 className="text-xl font-bold text-[#252641] mb-4">{feature.title}</h3>
              
              {/* Description */}
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CloudFeatures;