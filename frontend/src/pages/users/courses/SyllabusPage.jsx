import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const SyllabusPage = () => {
  const { courseId } = useParams();
  const [syllabus, setSyllabus] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:8000/courses/course/${courseId}/syllabus/`)
        .then(response => {
        console.log("Full response:", response);
        console.log("Syllabus data:", response.data);
        setSyllabus(response.data);
        })
        .catch(error => console.error("Error loading syllabus:", error));
  }, [courseId]);

  return (
    <div>
      <h2>Syllabus</h2>
      <ul>
        {syllabus.map(item => (
            
          <li key={item.id}>{item.topic} - {item.description}</li>
        ))}
        
      </ul>
    </div>
  );
};

export default SyllabusPage;
