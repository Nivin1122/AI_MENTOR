import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addCourse, clearMessages } from '../../../../redux/slices/courses/courseSlice';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUpload, FiX, FiCheckCircle, FiChevronDown } from 'react-icons/fi';

const AdminCourseForm = () => {
  const dispatch = useDispatch();
  const { loading, error, successMessage } = useSelector((state) => state.courses);
  const [categories, setCategories] = useState([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [categoryError, setCategoryError] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    language: '',
    category: '', 
    short_description: '',
    full_description: '',
    price: '',
  });
  const [image, setImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [formError, setFormError] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  // Fetch categories when component mounts
  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoadingCategories(true);
      setCategoryError('');
      
      try {
        const response = await fetch('http://localhost:8000/courses/categories/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
    
        if (!response.ok) {
          throw new Error(`Failed to fetch categories: ${response.status}`);
        }
    
        // Parse the JSON data
        const data = await response.json();
        console.log('Categories data:', data);
        
        // Set the categories state
        setCategories(data);
      } catch (error) {
        console.error('Category fetch error:', error);
        setCategoryError(error.message || 'Something went wrong');
      } finally {
        setIsLoadingCategories(false);
      }
    };
    
    fetchCategories();
  }, []);

  useEffect(() => {
    if (successMessage) {
      setFormData({
        title: '',
        language: '',
        category: '',
        short_description: '',
        full_description: '',
        price: '',
      });
      setImage(null);
      setPreviewImage(null);

      setShowSuccessPopup(true);

      const timer = setTimeout(() => {
        dispatch(clearMessages());
        setShowSuccessPopup(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [successMessage, dispatch]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImage(null);
    setPreviewImage(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError('');

    if (!image) {
      setFormError('Please upload a course image');
      return;
    }

    if (!formData.category) {
      setFormError('Please select a category');
      return;
    }

    const data = new FormData();
    for (let key in formData) {
      data.append(key, formData[key]);
    }
    data.append('image', image);

    const token = localStorage.getItem('adminAccess');
    if (!token) {
      setFormError('You are not authenticated. Please log in again.');
      return;
    }
    
    dispatch(addCourse(data));
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100
      }
    }
  };

  const popupVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        duration: 0.3,
        ease: [0.4, 0.0, 0.2, 1]
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.95,
      transition: { 
        duration: 0.2,
        ease: [0.4, 0.0, 0.2, 1]
      }
    }
  };

  return (
    <motion.div 
      className="bg-gray-900 text-gray-100 rounded-xl p-8 shadow-2xl w-full max-w-4xl mx-auto"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Success Popup */}
      <AnimatePresence>
        {showSuccessPopup && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm">
            <motion.div
              className="max-w-sm w-full mx-4"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={popupVariants}
            >
              <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden">
                <div className="bg-green-600 h-2"></div>
                <div className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-green-500 rounded-full p-2">
                      <FiCheckCircle className="text-white h-6 w-6" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-white">Course Added Successfully</h3>
                      <p className="mt-1 text-sm text-gray-300">{successMessage || 'Your course has been added to the platform.'}</p>
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-gray-700">
                    <button
                      onClick={() => setShowSuccessPopup(false)}
                      className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 focus:ring-offset-gray-800 transition-colors duration-200"
                    >
                      Continue
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      
      <motion.h2 
        className="text-3xl font-bold mb-8 text-blue-400 border-b border-gray-700 pb-4"
        variants={itemVariants}
      >
        Add New Course
      </motion.h2>
      
      {/* Error messages */}
      {error && (
        <motion.div 
          className="bg-red-900/40 border border-red-500 text-red-200 p-4 mb-6 rounded-lg"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 100 }}
        >
          {error}
        </motion.div>
      )}
      
      {formError && (
        <motion.div 
          className="bg-red-900/40 border border-red-500 text-red-200 p-4 mb-6 rounded-lg"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 100 }}
        >
          {formError}
        </motion.div>
      )}
      
      {/* Success message - keeping this for backwards compatibility */}
      {successMessage && (
        <motion.div 
          className="bg-green-900/40 border border-green-500 text-green-200 p-4 mb-6 rounded-lg flex items-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 100 }}
        >
          <FiCheckCircle className="mr-2 text-green-400" size={20} />
          {successMessage}
        </motion.div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-6" variants={containerVariants}>
          <motion.div variants={itemVariants} className="form-group">
            <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">
              Course Title
            </label>
            <input 
              id="title"
              name="title" 
              value={formData.title}
              placeholder="Enter course title" 
              onChange={handleChange} 
              required 
              className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
            />
          </motion.div>
          
          <motion.div variants={itemVariants} className="form-group">
            <label htmlFor="price" className="block text-sm font-medium text-gray-300 mb-2">
              Price
            </label>
            <input 
              id="price"
              name="price" 
              type="number" 
              value={formData.price}
              placeholder="Course price" 
              onChange={handleChange} 
              required 
              className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
            />
          </motion.div>
          
          <motion.div variants={itemVariants} className="form-group">
            <label htmlFor="language" className="block text-sm font-medium text-gray-300 mb-2">
              Language
            </label>
            <input 
              id="language"
              name="language" 
              value={formData.language}
              placeholder="Course language" 
              onChange={handleChange} 
              required 
              className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
            />
          </motion.div>
          
          <motion.div variants={itemVariants} className="form-group">
            <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-2">
              Category
            </label>
            <div className="relative">
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="appearance-none w-full bg-gray-800 border border-gray-700 rounded-lg py-3 px-4 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                disabled={isLoadingCategories}
              >
                <option value="">Select a category</option>
                {Array.isArray(categories) && categories.length > 0 ? (
                  categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))
                ) : (
                  <option value="" disabled>No categories available</option>
                )}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                <FiChevronDown className="h-5 w-5" />
              </div>
            </div>
            {categoryError && (
              <p className="mt-1 text-sm text-red-400">{categoryError}</p>
            )}
            {isLoadingCategories && (
              <p className="mt-1 text-sm text-blue-400">Loading categories...</p>
            )}
          </motion.div>
        </motion.div>
        
        <motion.div variants={itemVariants} className="form-group">
          <label htmlFor="short_description" className="block text-sm font-medium text-gray-300 mb-2">
            Short Description
          </label>
          <textarea 
            id="short_description"
            name="short_description" 
            value={formData.short_description}
            placeholder="Brief description (1-2 sentences)" 
            onChange={handleChange} 
            required 
            className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
            rows={2}
          />
        </motion.div>
        
        <motion.div variants={itemVariants} className="form-group">
          <label htmlFor="full_description" className="block text-sm font-medium text-gray-300 mb-2">
            Full Description
          </label>
          <textarea 
            id="full_description"
            name="full_description" 
            value={formData.full_description}
            placeholder="Detailed course description" 
            onChange={handleChange} 
            required 
            className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
            rows={5}
          />
        </motion.div>
        
        <motion.div variants={itemVariants} className="form-group">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Course Image
          </label>
          <div 
            className={`border-2 border-dashed rounded-lg p-6 transition-all duration-300 text-center ${
              isDragging ? 'border-blue-500 bg-blue-500/10' : 'border-gray-600 hover:border-blue-400 bg-gray-800/50'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input 
              id="image"
              type="file" 
              onChange={handleImageChange} 
              accept="image/*"
              className="hidden"
            />
            
            {!previewImage ? (
              <div className="space-y-4">
                <FiUpload className="mx-auto text-gray-400 h-12 w-12" />
                <div>
                  <p className="text-gray-400">Drag and drop your image here, or</p>
                  <label htmlFor="image" className="mt-2 inline-block px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-white cursor-pointer transition-colors duration-300">
                    Browse Files
                  </label>
                </div>
              </div>
            ) : (
              <div className="relative">
                <img 
                  src={previewImage} 
                  alt="Course preview" 
                  className="mx-auto max-h-48 rounded-md object-contain"
                />
                <button
                  type="button"
                  className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full transition-colors duration-300"
                  onClick={removeImage}
                >
                  <FiX className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>
        </motion.div>
        
        <motion.div 
          variants={itemVariants}
          className="mt-8 flex justify-end"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <button 
            type="submit" 
            className={`py-3 px-8 rounded-lg text-white font-medium transition-all duration-300 flex items-center ${
              loading ? 'bg-gray-600 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-blue-500/20'
            }`}
            disabled={loading}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Adding Course...
              </>
            ) : (
              'Add Course'
            )}
          </button>
        </motion.div>
      </form>
    </motion.div>
  );
};

export default AdminCourseForm;