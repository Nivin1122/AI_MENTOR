import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addCourse, clearMessages } from '../../../redux/slices/courses/courseSlice';

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

  return (
    <div className="course-form-container">
      <h2>Add New Course</h2>
      
      {/* Error messages */}
      {error && <div className="error-message">{error}</div>}
      {formError && <div className="error-message">{formError}</div>}
      
      {/* Success message */}
      {successMessage && <div className="success-message">{successMessage}</div>}
      
      <form onSubmit={handleSubmit} className="course-form">
        <div className="form-group">
          <label htmlFor="title">Course Title</label>
          <input 
            id="title"
            name="title" 
            value={formData.title}
            placeholder="Enter course title" 
            onChange={handleChange} 
            required 
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="language">Language</label>
          <input 
            id="language"
            name="language" 
            value={formData.language}
            placeholder="Course language" 
            onChange={handleChange} 
            required 
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="category">Category</label>
          <input 
            id="category"
            name="category" 
            value={formData.category}
            placeholder="Course category" 
            onChange={handleChange} 
            required 
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="short_description">Short Description</label>
          <textarea 
            id="short_description"
            name="short_description" 
            value={formData.short_description}
            placeholder="Brief description (1-2 sentences)" 
            onChange={handleChange} 
            required 
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="full_description">Full Description</label>
          <textarea 
            id="full_description"
            name="full_description" 
            value={formData.full_description}
            placeholder="Detailed course description" 
            onChange={handleChange} 
            required 
            rows={5}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="price">Price</label>
          <input 
            id="price"
            name="price" 
            type="number" 
            value={formData.price}
            placeholder="Course price" 
            onChange={handleChange} 
            required 
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="image">Course Image</label>
          <input 
            id="image"
            type="file" 
            onChange={handleImageChange} 
            accept="image/*"
          />
          {previewImage && (
            <div className="image-preview">
              <img src={previewImage} alt="Course preview" />
            </div>
          )}
        </div>
        
        <button 
          type="submit" 
          className="submit-button" 
          disabled={loading}
        >
          {loading ? 'Adding Course...' : 'Add Course'}
        </button>
      </form>
    </div>
  );
};

export default AdminCourseForm;