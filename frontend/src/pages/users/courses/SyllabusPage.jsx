import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import MainNavbar from "../../../components/navbar/MainNavbar";
import { vapi } from "../../../sdk/vapi.sdk"; 
import aiMentor from "../../../utils/mentorDTO"; 


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

  
  const handleAskAI = (topic, description) => {
    
    const mentorWithTopic = {
      ...aiMentor,
      model: {
        ...aiMentor.model,
        messages: [
          {
            role: "system",
            content: aiMentor.model.messages[0].content.replace(
              "{{ topic }}", 
              `Topic: ${topic}\nDescription: ${description}`
            ),
          },
        ],
      },
    };

    
    vapi.start(mentorWithTopic);
  };

  return (
    <div>
      <MainNavbar />
      <div>
        {syllabus.map((item, index) => (
          <div key={index}>
            <h3>{item.topic}</h3>
            <p>{item.description}</p>
            <button onClick={() => handleAskAI(item.topic, item.description)}>
              Ask AI
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SyllabusPage;