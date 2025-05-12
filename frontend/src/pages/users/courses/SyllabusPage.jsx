import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import MainNavbar from "../../../components/navbar/MainNavbar";
import { vapi } from "../../../sdk/vapi.sdk"; 
import aiMentor from "../../../utils/mentorDTO"; 



const SyllabusPage = () => {
  const { courseId } = useParams();
  const [syllabus, setSyllabus] = useState([]);
  const [isCallActive, setIsCallActive] = useState(false);
  const [activeItemIndex, setActiveItemIndex] = useState(null);

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


  const handleAskAI = (topic, description, index) => {
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

    try {
      console.log("Starting new call with topic:", topic);
      const call = vapi.start(mentorWithTopic);
      console.log("Call return value:", call);
      
      setIsCallActive(true);

      setActiveItemIndex(index);
      
      if (call && typeof call.on === 'function') {
        call.on("call-end", () => {
          setIsCallActive(false);
          setActiveItemIndex(null);
        });
      }
    } catch (error) {
      console.error("Error starting call:", error);
    }
  };

  const handleStopCall = () => {
    setIsCallActive(false);
    setActiveItemIndex(null);
    
    
    window.location.reload();
  };

  return (
    <div>
      <MainNavbar />
      <div>
        {syllabus.map((item, index) => (
        <div key={index} className="collapse collapse-arrow bg-base-100 border border-base-300">
            <input type="radio" name="my-accordion-2" defaultChecked />
            <div className="collapse-title font-semibold">{item.topic}</div>
            <div className="collapse-content text-sm">{item.description}
              {activeItemIndex === index && isCallActive ? (
              <div>
                
                <button className="btn btn-outline btn-error" onClick={handleStopCall}>Stop AI</button>
              </div>
            ) : (
              <div>
                <button className="btn btn-dash btn-success"
                  onClick={() => handleAskAI(item.topic, item.description, index)}
                  disabled={isCallActive}
                >
                  Ask AI
                </button>
              </div>
            )}
          </div>
            
        </div>
        ))},
        {/* {syllabus.map((item, index) => (
          
          <div key={index}>
            <h3>{item.topic}</h3>
            <p>{item.description}</p>
            {activeItemIndex === index && isCallActive ? (
              <div>
                <span>AI Mentor Active</span>
                <button onClick={handleStopCall}>Stop AI</button>
              </div>
            ) : (
              <button 
                onClick={() => handleAskAI(item.topic, item.description, index)}
                disabled={isCallActive}
              >
                Ask AI
              </button>
            )}
          </div>
        ))} */}
      </div>
    </div>
  );
};

export default SyllabusPage;