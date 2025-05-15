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
    // Get the current status and toggle it
    const currentStatus = syllabus[index].is_completed;
    const newStatus = !currentStatus;
    console.log("button working")
    // Make the API call
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
        // Create a new array with the updated item
        const updatedSyllabus = [...syllabus];
        updatedSyllabus[index] = {
          ...updatedSyllabus[index],
          is_completed: newStatus
        };
        
        // Update state
        setSyllabus(updatedSyllabus);
        updateProgress(updatedSyllabus);
        
      })
      .catch((error) => {
        console.error("Error updating progress:", error);
        alert("Failed to update completion status. Please try again.");
      });
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

        {syllabus.map((item, index) => (
          <div
            key={item.id}
            className="collapse collapse-arrow bg-base-100 border border-base-300 mb-2"
          >
            
            <input type="radio" name="my-accordion-2" />
            <div className="collapse-title font-semibold flex justify-between items-center">
              <span>{item.topic}</span>
              
            </div>
            
            <div className="collapse-content text-sm">
              {item.description}
              {activeItemIndex === index && isCallActive ? (
                <button className="btn btn-outline btn-error mt-3" onClick={handleStopCall}>
                  Stop AI
                </button>
              ) : (
                <button
                  className="btn btn-success mt-3"
                  onClick={() => handleAskAI(item.topic, item.description, index)}
                  disabled={isCallActive}
                >
                  Ask AI
                </button>
              )}
              <div>
            <button
                onClick={(e) => {
                  e.stopPropagation(); // Prevent accordion from toggling
                  handleToggleComplete(item.id, index);
                }}
                className={`btn btn-sm ${
                  item.is_completed ? "btn-success" : "btn-outline"
                }`}
              >
                {item.is_completed ? "Completed" : "Mark Complete"}
              </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SyllabusPage;