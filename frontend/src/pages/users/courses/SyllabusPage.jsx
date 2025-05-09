import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import MainNavbar from "../../../components/navbar/MainNavbar";

const SyllabusPage = () => {
  const { courseId } = useParams();
  const [syllabus, setSyllabus] = useState([]);

  useEffect(() => {
    axios
      .get(`http://localhost:8000/courses/course/${courseId}/syllabus/`)
      .then((response) => {
        console.log("Full response:", response);
        console.log("Syllabus data:", response.data);
        setSyllabus(response.data);
      })
      .catch((error) => console.error("Error loading syllabus:", error));
  }, [courseId]);

  return (
    <div>
      <MainNavbar />
      
      {syllabus.map((item) => (
      <div key={item.id} className="collapse collapse-arrow bg-base-100 border border-base-300">
        <input type="radio" name="my-accordion-2" defaultChecked />
        <div className="collapse-title font-semibold">
          {item.topic}
        </div>
        <div className="collapse-content text-sm">
          {item.description}
          <div>
            <button className="btn btn-soft btn-success">Ask Ai</button>
          </div>
        </div>
        
      </div>
      ))}
      
    </div>
  );
};

export default SyllabusPage;
