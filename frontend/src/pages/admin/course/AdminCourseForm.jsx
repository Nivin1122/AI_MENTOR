import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addCourse, clearMessages } from '../../../redux/slices/courses/courseSlice';
import { motion } from 'framer-motion';
import { FiUpload, FiX, FiCheckCircle } from 'react-icons/fi';

const AdminCourseForm = () => {
  const dispatch = useDispatch();
  const { loading, error, successMessage } = useSelector((state) => state.courses);
  
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

  // Clear form after successful submission
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
      
      // Clear success message after 3 seconds
      const timer = setTimeout(() => {
        dispatch(clearMessages());
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
      // Create preview
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
    
    // Validate form
    if (!image) {
      setFormError('Please upload a course image');
      return;
    }
    
    // Create FormData object
    const data = new FormData();
    for (let key in formData) {
      data.append(key, formData[key]);
    }
    data.append('image', image);

    // Check authentication token
    const token = localStorage.getItem('adminAccess');
    if (!token) {
      setFormError('You are not authenticated. Please log in again.');
      return;
    }
    
    // Dispatch action to add course
    dispatch(addCourse(data));
  };

  // Animation variants
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

  return (
    <motion.div 
      className="bg-gray-900 text-gray-100 rounded-xl p-8 shadow-2xl w-full max-w-4xl mx-auto"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
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
      
      {/* Success message */}
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
            <input 
              id="category"
              name="category" 
              value={formData.category}
              placeholder="Course category" 
              onChange={handleChange} 
              required 
              className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
            />
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