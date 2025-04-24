import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllCourses } from '../../../redux/slices/courses/courseSlice';


const HomePage = () => {
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { courses, loading, error } = useSelector((state) => state.courses);

  // Fetch homepage welcome message
  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");

    axios
      .get("http://localhost:8000/users/home/", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((res) => setMessage(res.data.message))
      .catch((err) => setMessage("Unauthorized: Please log in"));
  }, []);

  // Fetch courses on mount
  useEffect(() => {
    dispatch(fetchAllCourses());
  }, [dispatch]);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    navigate("/login"); 
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Welcome to the User Home Page</h2>
      <p>{message}</p>

      <button 
        onClick={handleLogout}
        style={{
          padding: '10px 20px',
          backgroundColor: 'crimson',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          marginTop: '20px'
        }}
      >
        Logout
      </button>

      <hr style={{ margin: '30px 0' }} />

      <h3>Available Courses</h3>

      {loading && <p>Loading courses...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
        {courses.map(course => (
          <div
            key={course.id}
            style={{
              border: '1px solid #ddd',
              borderRadius: '10px',
              padding: '15px',
              width: '250px',
              boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
            }}
          >
            <img 
              src={course.image} 
              alt={course.title}
              style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '8px' }}
            />
            <h4>{course.title}</h4>
            <p><strong>Language:</strong> {course.language}</p>
            <p><strong>Price:</strong> ₹{course.price}</p>
            <p style={{ fontSize: '14px' }}>{course.short_description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
