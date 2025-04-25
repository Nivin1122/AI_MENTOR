import React, { useEffect, useState, useRef } from 'react';

const SuccessMetrics = () => {
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

  const metrics = [
    { value: '15K+', label: 'Students' },
    { value: '75%', label: 'Total success' },
    { value: '35', label: 'Main questions' },
    { value: '26', label: 'Chief experts' },
    { value: '16', label: 'Years of experience' },
  ];

  return (
    <div className="py-14 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div 
          className={`text-center mb-10 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-5">Our Success</h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-base leading-relaxed">
            Ornare id fames interdum porttitor nulla turpis etiam. Diam vitae sollicitudin at nec
            nam et pharetra gravida. Adipiscing a quis ultrices eu ornare tristique vel nisl orci.
          </p>
        </div>

        <div 
          ref={sectionRef}
          className="flex flex-wrap justify-center lg:justify-between items-center gap-14 md:gap-10 pt-4 pb-6"
        >
          {metrics.map((metric, index) => (
            <div 
              key={index} 
              className={`flex flex-col items-center transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div 
                className={`text-5xl lg:text-6xl font-bold text-[#4DC1B8] mb-2 transition-all duration-500 ${
                  isVisible ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
                }`} 
                style={{ 
                  transitionDelay: `${index * 150}ms`,
                  fontFamily: "'Montserrat', sans-serif"
                }}
              >
                {metric.value}
              </div>
              <p className="text-gray-700 font-medium">{metric.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SuccessMetrics; 