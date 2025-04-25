import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { loginUser } from '../../../redux/slices/auth/AuthSlice';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [animate, setAnimate] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    setAnimate(true);
    
    // Add dynamic particle animation
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js';
    script.async = true;
    
    script.onload = () => {
      window.particlesJS('particles-js', {
        particles: {
          number: { value: 90, density: { enable: true, value_area: 800 } },
          color: { value: ["#6366f1", "#818cf8", "#4f46e5", "#4338ca"] },
          shape: { type: "circle" },
          opacity: { value: 0.5, random: true },
          size: { value: 4, random: true },
          line_linked: { enable: true, distance: 150, color: "#6366f1", opacity: 0.4, width: 1.5 },
          move: { enable: true, speed: 2, direction: "none", random: false, straight: false, out_mode: "out", bounce: false }
        },
        interactivity: {
          detect_on: "canvas",
          events: { 
            onhover: { enable: true, mode: "grab" }, 
            onclick: { enable: true, mode: "push" },
            resize: true 
          },
          modes: { 
            grab: { distance: 140, line_linked: { opacity: 0.5 } },
            push: { particles_nb: 4 }
          }
        },
        retina_detect: true
      });
    };
    
    document.body.appendChild(script);
    
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    setTimeout(() => {
      dispatch(loginUser(formData));
      navigate('/');
    }, 800);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 relative">
      {/* Particle background */}
      <div id="particles-js" className="absolute inset-0 z-0"></div>
      
      {/* Subtle background shapes for additional visual interest */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-30">
        <div className="absolute top-0 right-0 bg-indigo-200 rounded-full w-96 h-96 -mt-24 -mr-24 animate-blob"></div>
        <div className="absolute bottom-0 left-0 bg-blue-200 rounded-full w-96 h-96 -mb-24 -ml-24 animate-blob animation-delay-4000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-indigo-100 rounded-full w-96 h-96 animate-blob animation-delay-2000"></div>
      </div>
      
      {/* Main card */}
      <div className={`relative z-10 w-full max-w-5xl flex transition-all duration-1000 ${
        animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
      }`}>
        <div className="flex flex-col md:flex-row w-full overflow-hidden rounded-xl shadow-lg">
          {/* Brand section */}
          <div className="hidden md:block md:w-5/12 bg-gradient-to-br from-indigo-600 to-blue-700 p-10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-full h-full opacity-10">
              <svg viewBox="0 0 1500 1500" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                <path d="M1500 0L0 1500V0H1500Z" fill="white"/>
              </svg>
            </div>
            
            <div className="relative z-10 h-full flex flex-col">
              <div>
                <h1 className="text-4xl font-bold text-white">
                  <span className="text-indigo-100">AI-</span>Mentor
                </h1>
                <p className="text-indigo-100 mt-2 text-base">Enterprise learning platform</p>
              </div>
              
              <div className="mt-10 space-y-5">
                <div className="flex items-start space-x-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-200 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <p className="text-white text-base">Industry-recognized certificates</p>
                </div>
                
                <div className="flex items-start space-x-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-200 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <p className="text-white text-base">Expert-led content</p>
                </div>
                
                <div className="flex items-start space-x-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-200 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <p className="text-white text-base">Flexible learning platform</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Login form section */}
          <div className="w-full md:w-7/12 bg-white p-8 md:p-10">
            <div className="w-full max-w-md mx-auto">
              <div className="text-center md:text-left mb-8">
                <h2 className="text-2xl font-bold text-gray-800">Sign in to your account</h2>
                <p className="mt-2 text-sm text-gray-500">Access your Ai-Mentor dashboard</p>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                    Username
                  </label>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    required
                    value={formData.username}
                    onChange={e => setFormData({ ...formData, username: e.target.value })}
                    className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-base"
                    placeholder="Enter your username"
                  />
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                      Password
                    </label>
                    <a href="#" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                      Forgot?
                    </a>
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                    className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-base"
                    placeholder="Enter your password"
                  />
                </div>
                
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                    Remember me
                  </label>
                </div>
                
                <div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Signing in...
                      </>
                    ) : "Sign in"}
                  </button>
                </div>
              </form>
              
              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-3 bg-white text-gray-500">Or continue with</span>
                  </div>
                </div>
                
                <div className="mt-4 grid grid-cols-3 gap-3">
                  <button type="button" className="inline-flex justify-center items-center py-2 px-3 border border-gray-200 rounded-md shadow-sm bg-white hover:bg-gray-50 transition-colors">
                    <svg className="h-5 w-5 text-[#4285F4]" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"/>
                    </svg>
                  </button>
                  <button type="button" className="inline-flex justify-center items-center py-2 px-3 border border-gray-200 rounded-md shadow-sm bg-white hover:bg-gray-50 transition-colors">
                    <svg className="h-5 w-5 text-[#3b5998]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.007,3H3.993C3.445,3,3,3.445,3,3.993v16.013C3,20.555,3.445,21,3.993,21h8.621v-6.971h-2.346v-2.717h2.346V9.31c0-2.325,1.42-3.591,3.494-3.591c0.993,0,1.847,0.074,2.096,0.107v2.43l-1.438,0.001c-1.128,0-1.346,0.536-1.346,1.323v1.734h2.69l-0.35,2.717h-2.34V21h4.587C20.555,21,21,20.555,21,20.007V3.993C21,3.445,20.555,3,20.007,3z"/>
                    </svg>
                  </button>
                  <button type="button" className="inline-flex justify-center items-center py-2 px-3 border border-gray-200 rounded-md shadow-sm bg-white hover:bg-gray-50 transition-colors">
                    <svg className="h-5 w-5 text-[#1DA1F2]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.953,4.57a10,10,0,0,1-2.825.775,4.958,4.958,0,0,0,2.163-2.723,10.054,10.054,0,0,1-3.126,1.184,4.92,4.92,0,0,0-8.384,4.482C7.69,8.095,4.067,6.13,1.64,3.162a4.822,4.822,0,0,0-.666,2.475A4.921,4.921,0,0,0,3.2,9.722,4.9,4.9,0,0,1,1,9.107v.061A4.923,4.923,0,0,0,4.857,14a5,5,0,0,1-2.212.085A4.921,4.921,0,0,0,7.29,17.235a9.9,9.9,0,0,1-6.108,2.1A10.444,10.444,0,0,1,0,19.287a13.942,13.942,0,0,0,7.548,2.209,13.909,13.909,0,0,0,14-13.956c0-.21,0-.42-.016-.63A9.936,9.936,0,0,0,24,4.59Z"/>
                    </svg>
                  </button>
                </div>
              </div>
              
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-500">
                  Don't have an account?{' '}
                  <a href="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
                    Sign up
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Keep the CSS animation for consistency
const styleTag = document.createElement('style');
styleTag.innerHTML = `
  @keyframes blob {
    0% {
      transform: translate(0px, 0px) scale(1);
    }
    33% {
      transform: translate(30px, -50px) scale(1.1);
    }
    66% {
      transform: translate(-20px, 20px) scale(0.9);
    }
    100% {
      transform: translate(0px, 0px) scale(1);
    }
  }
  
  .animate-blob {
    animation: blob 7s infinite;
  }
  
  .animation-delay-2000 {
    animation-delay: 2s;
  }
  
  .animation-delay-4000 {
    animation-delay: 4s;
  }
`;
document.head.appendChild(styleTag);
