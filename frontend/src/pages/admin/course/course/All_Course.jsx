import React from 'react'
import { useEffect,useState } from 'react';
import axios from 'axios';

const All_Course = () => {
    const [allcourse, setAllCourse] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
    setLoading(true);
    axios.get('http://localhost:8000/courses/list/')
      .then(res => {
        console.log('Data received:123', res.data);
        setAllCourse(res.data);
      })
      .catch(err => {
        console.error('Failed to fetch courses:', err);
        setError('Failed to fetch data. Refresh page.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div>
        {allcourse.length === 0 ? (
        <div className="alert alert-info shadow-lg">
          <div>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current flex-shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <span>No courses available at the moment.</span>
          </div>
        </div>
      ):(
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allcourse.map(course => (
            <div className="card bg-black w-96 shadow-sm">
                <figure>
                    <img
                    src={`http://127.0.0.1:8000${course.image}`}
                    alt="Shoes" />
                </figure>
                <div className="card-body">
                    <h2 className="card-title">{course.title}</h2>
                    <p>{course.short_description}</p>
                    <p>{course.category}</p>
                    <div className="card-actions justify-end">
                    <button className="btn btn-primary">Edit</button>
                    </div>
                </div>
            </div>
        
        ))}
        </div>
      )}
        
    </div>
  )
}

export default All_Course