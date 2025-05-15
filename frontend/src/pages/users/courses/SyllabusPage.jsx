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
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios
      .get(`http://localhost:8000/courses/course/${courseId}/syllabus/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`, 
        },
      })
      .then((response) => {
        const data = response.data;
        setSyllabus(data);
        updateProgress(data);
      })
      .catch((error) => console.error("Error loading syllabus:", error));
  }, [courseId]);

  const updateProgress = (data) => {
    const completedCount = data.filter((item) => item.is_completed).length;
    const calculatedProgress = data.length > 0 ? Math.floor((completedCount / data.length) * 100) : 0;
    setProgress(calculatedProgress);
  };

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
      const call = vapi.start(mentorWithTopic);
      setIsCallActive(true);
      setActiveItemIndex(index);

      if (call && typeof call.on === "function") {
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

  const handleToggleComplete = (syllabusId, index) => {
    
    const currentStatus = syllabus[index].is_completed;
    const newStatus = !currentStatus;
    
    axios
      .post(
        "http://localhost:8000/courses/syllabus/mark/",
        {
          syllabus_id: syllabusId,
          is_completed: newStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      )
      .then(() => {
        
        const updatedSyllabus = [...syllabus];
        updatedSyllabus[index] = {
          ...updatedSyllabus[index],
          is_completed: newStatus
        };
        
       
        setSyllabus(updatedSyllabus);
        updateProgress(updatedSyllabus);
        
      })
      .catch((error) => {
        console.error("Error updating progress:", error);
        alert("Failed to update completion status. Please try again.");
      });
  };

  const isItemUnlocked = (index) => {
  
    if (index === 0) return true;
    
    return syllabus[index - 1]?.is_completed === true;
  };

  return (
    <div>
      <MainNavbar />
      <div className="p-4">
        <div className="w-full bg-gray-300 rounded-full h-4 mb-6">
          <div
            className="bg-green-500 h-4 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="text-sm font-semibold mb-4">Progress: {progress}%</p>

        {syllabus.map((item, index) => {
          const unlocked = isItemUnlocked(index);
          
          return (
            <div
              key={item.id}
              className={`collapse collapse-arrow mb-2 ${
                unlocked ? "bg-base-100" : "bg-gray-100"
              } border border-base-300`}
            >
              <input 
                type="radio" 
                name="my-accordion-2" 
                disabled={!unlocked}
              />
              <div className="collapse-title font-semibold flex justify-between items-center">
                
                <div className="flex items-center gap-2">
                  {!unlocked && (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="text-gray-500" viewBox="0 0 16 16">
                      <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/>
                    </svg>
                  )}
                  <span className={unlocked ? "" : "text-gray-500"}>
                    {item.topic}
                  </span>
                  
                </div>
                
                
              </div>
              
              
              <div className="collapse-content text-sm">
                {unlocked ? (
                  <>
                    <p>{item.description}</p>
                    <div className="mt-3 flex gap-2">
                      {activeItemIndex === index && isCallActive ? (
                        <button className="btn btn-outline btn-error" onClick={handleStopCall}>
                          Stop AI
                        </button>
                      ) : (
                        <button
                          className="btn btn-success"
                          onClick={() => handleAskAI(item.topic, item.description, index)}
                          disabled={isCallActive}
                        >
                          Ask AI
                        </button>
                      )}
                      <div>
                  {unlocked && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleComplete(item.id, index);
                    }}
                    className={`btn btn-sm ${
                      item.is_completed ? "btn-success" : "btn-outline"
                    }`}
                  >
                    {item.is_completed ? "Completed" : "Mark Complete"}
                  </button>
                )}
                </div>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center py-4">
                    <p className="text-gray-500">Complete the previous module to unlock this content</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SyllabusPage;