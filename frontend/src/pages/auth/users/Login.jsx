import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { loginUser } from '../../../redux/slices/auth/AuthSlice';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [animate, setAnimate] = useState(false);
  const [errors, setErrors] = useState({
    username: '',
    password: '',
    general: ''
  });

  useEffect(() => {
    setAnimate(true);
  }, []);

  const validateForm = () => {
    let isValid = true;
    const newErrors = { username: '', password: '', general: '' };
    
    // Username validation
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
      isValid = false;
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
      isValid = false;
    }
    
    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Clear previous errors
    setErrors({ username: '', password: '', general: '' });
    
    // Validate form before submission
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Dispatch the login action and wait for it to complete
      await dispatch(loginUser(formData)).unwrap();
      
      // Navigate after successful login
      setTimeout(() => {
        navigate('/');
      }, 800);
    } catch (error) {
      console.error('Login failed:', error);
      
      // Handle specific error cases based on error response
      if (error?.response?.data) {
        const { errorType, message } = error.response.data;
        
        if (errorType === 'USER_NOT_FOUND' || (message && message.toLowerCase().includes('username'))) {
          setErrors({ ...errors, username: 'Username is incorrect' });
        } else if (errorType === 'INVALID_PASSWORD' || (message && message.toLowerCase().includes('password'))) {
          setErrors({ ...errors, password: 'Password is incorrect' });
        } else if (errorType === 'ACCOUNT_LOCKED') {
          setErrors({ ...errors, general: 'Your account has been locked. Please contact support.' });
        } else if (errorType === 'ACCOUNT_DISABLED') {
          setErrors({ ...errors, general: 'Your account has been disabled. Please contact support.' });
        } else {
          setErrors({ ...errors, general: message || 'Authentication failed' });
        }
      } else {
        // Fallback error for network issues
        setErrors({ 
          ...errors, 
          general: 'Login failed. Please enter valid username and password.' 
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
      {/* Main container */}
      <div className={`w-full max-w-md transition-all duration-500 ${
        animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}>
        {/* Card */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="px-6 py-8 bg-gray-50 border-b border-gray-100">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900">AI-Mentor</h1>
              <p className="mt-1 text-sm text-gray-600">Enterprise Learning Platform</p>
            </div>
          </div>
          
          {/* Form */}
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-800 mb-6">Sign in to your account</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* General error message */}
              {errors.general && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                  {errors.general}
                </div>
              )}
              
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={e => setFormData({ ...formData, username: e.target.value })}
                  className={`w-full px-3 py-2 border ${errors.username ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500`}
                  placeholder="Enter your username"
                />
                {errors.username && (
                  <p className="mt-1 text-xs text-red-600">{errors.username}</p>
                )}
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <a href="#" className="text-xs font-medium text-blue-600 hover:text-blue-500">
                    Forgot password?
                  </a>
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={e => setFormData({ ...formData, password: e.target.value })}
                  className={`w-full px-3 py-2 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500`}
                  placeholder="Enter your password"
                />
                {errors.password && (
                  <p className="mt-1 text-xs text-red-600">{errors.password}</p>
                )}
              </div>
              
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>
              
              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
                <div className="relative flex justify-center text-xs">
                  <span className="px-2 bg-white text-gray-500">Or continue with</span>
                </div>
              </div>
              
              <div className="mt-4 grid grid-cols-3 gap-2">
                <button type="button" className="flex justify-center items-center py-2 px-3 border border-gray-200 rounded-md bg-white hover:bg-gray-50">
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                </button>
                <button type="button" className="flex justify-center items-center py-2 px-3 border border-gray-200 rounded-md bg-white hover:bg-gray-50">
                  <svg className="h-5 w-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z"/>
                  </svg>
                </button>
                <button type="button" className="flex justify-center items-center py-2 px-3 border border-gray-200 rounded-md bg-white hover:bg-gray-50">
                  <svg className="h-5 w-5 text-black" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
          
          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
            <p className="text-sm text-center text-gray-600">
              Don't have an account?{' '}
              <a href="/register" className="font-medium text-blue-600 hover:text-blue-500">
                Sign up
              </a>
            </p>
          </div>
        </div>
        
        {/* Company info */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            © 2025 AI-Mentor. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}