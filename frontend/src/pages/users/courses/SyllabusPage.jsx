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
  
  // Test ////////////
  const [testMode, setTestMode] = useState(false);
  const [currentTestTopic, setCurrentTestTopic] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [testResults, setTestResults] = useState(null);
  const [testLoading, setTestLoading] = useState(false);
  const [testCompleted, setTestCompleted] = useState(false);
  const [testError, setTestError] = useState(null); 

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

  const handleStartTest = async (topic, description, syllabusId, index) => {
    setTestLoading(true);
    setTestMode(true);
    setCurrentTestTopic({ topic, description, syllabusId, index });
    setUserAnswers({});
    setTestResults(null);
    setTestCompleted(false);
    setTestError(null);
    
    try {
      console.log("Starting test for topic:", topic);
      console.log("With description:", description);
      
      const response = await axios.post(
        "http://localhost:8000/Exam/api/generate-test-questions/",
        {
          topic: topic,
          description: description
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      
      console.log("Received test questions:", response.data);
      
      if (!response.data || !response.data.questions || !Array.isArray(response.data.questions)) {
        throw new Error("Invalid response format from server");
      }
      
      if (response.data.questions.length === 0) {
        throw new Error("No questions were generated");
      }
      
      setQuestions(response.data.questions);
      setTestLoading(false);
    } catch (error) {
      console.error("Error generating test questions:", error);
      
      let errorMessage = "Failed to generate test questions.";
      
      if (error.response) {
       
        console.error("Server error data:", error.response.data);
        errorMessage = error.response.data.error || 
                      `Server error (${error.response.status}): ${error.response.statusText}`;
      } else if (error.request) {
       
        errorMessage = "No response from server. Please check your connection.";
      } else {
      
        errorMessage = `Request error: ${error.message}`;
      }
      
      setTestError(errorMessage);
      setTestLoading(false);
      
    }
  };

  
  const handleAnswerSelect = (questionIndex, answer) => {
    setUserAnswers({
      ...userAnswers,
      [questionIndex]: answer
    });
  };

  const handleSubmitTest = async () => {
    setTestLoading(true);
    
    try {
   
      if (Object.keys(userAnswers).length !== questions.length) {
        alert("Please answer all questions before submitting.");
        setTestLoading(false);
        return;
      }

      const response = await axios.post(
        "http://localhost:8000/Exam/api/evaluate-test/",
        {
          questions: questions,
          userAnswers: userAnswers,
          topic: currentTestTopic.topic
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      
      const result = response.data;
      setTestResults(result);
      setTestCompleted(true);
      
      if (result.correctAnswers >= 3) {
        handleToggleComplete(currentTestTopic.syllabusId, currentTestTopic.index);
      }
      
      setTestLoading(false);
    } catch (error) {
      console.error("Error evaluating test:", error);
      
      let errorMessage = "Failed to evaluate test.";
      
      if (error.response) {
        console.error("Server evaluation error:", error.response.data);
        errorMessage = error.response.data.error || 
                      `Server error (${error.response.status}): ${error.response.statusText}`;
      } else if (error.request) {
        errorMessage = "No response from server. Please check your connection.";
      } else {
        errorMessage = `Request error: ${error.message}`;
      }
      
      setTestError(errorMessage);
      setTestLoading(false);
    }
  };

  const handleExitTest = () => {
    setTestMode(false);
    setQuestions([]);
    setUserAnswers({});
    setTestResults(null);
    setCurrentTestTopic(null);
    setTestCompleted(false);
    setTestError(null);
  };
  
  const renderTest = () => {
    if (testLoading) {
      return (
        <div className="flex justify-center items-center p-6">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
          <span className="ml-2">Loading test questions...</span>
        </div>
      );
    }
    
    if (testError) {
      return (
        <div className="p-4">
          <div className="bg-red-100 border border-red-300 text-red-700 p-4 rounded-lg mb-4">
            <h2 className="text-lg font-bold mb-2">Error</h2>
            <p>{testError}</p>
          </div>
          <div className="flex justify-between mt-4">
            <button className="btn btn-outline" onClick={handleExitTest}>
              Return to Syllabus
            </button>
            <button 
              className="btn btn-primary" 
              onClick={() => handleStartTest(
                currentTestTopic.topic, 
                currentTestTopic.description, 
                currentTestTopic.syllabusId, 
                currentTestTopic.index
              )}
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }
    
    if (testCompleted) {
      const passed = testResults.correctAnswers >= 3;
      
      return (
        <div className="p-4">
          <h2 className="text-xl font-bold mb-4">Test Results</h2>
          <div className={`p-4 rounded-lg mb-4 ${passed ? 'bg-green-100' : 'bg-red-100'}`}>
            <p className="text-lg font-semibold">
              {passed 
                ? `Congratulations! You passed with ${testResults.correctAnswers}/5 correct answers.` 
                : `You got ${testResults.correctAnswers}/5 correct answers. You need at least 3 to pass.`}
            </p>
          </div>
          
          <div className="space-y-4 mb-6">
            {questions.map((q, idx) => (
              <div key={idx} className="border rounded-lg p-4">
                <p className="font-medium">{q.question}</p>
                <div className="mt-2 space-y-1">
                  {q.options.map((option, optIdx) => (
                    <div 
                      key={optIdx} 
                      className={`p-2 rounded ${
                        userAnswers[idx] === option && testResults.questionResults[idx].correct 
                          ? 'bg-green-100 border border-green-300' 
                          : userAnswers[idx] === option && !testResults.questionResults[idx].correct
                          ? 'bg-red-100 border border-red-300'
                          : q.correctAnswer === option && userAnswers[idx] !== option
                          ? 'bg-green-50 border border-green-200'
                          : 'bg-gray-50'
                      }`}
                    >
                      {option}
                    </div>
                  ))}
                </div>
                <p className="mt-2 text-sm">
                  {testResults.questionResults[idx].correct 
                    ? '✓ Correct' 
                    : `✗ Incorrect. The correct answer is: ${q.correctAnswer}`}
                </p>
              </div>
            ))}
          </div>
          
          <div className="flex justify-between">
            {!passed && (
              <button 
                className="btn btn-primary" 
                onClick={() => handleStartTest(
                  currentTestTopic.topic, 
                  currentTestTopic.description, 
                  currentTestTopic.syllabusId, 
                  currentTestTopic.index
                )}
              >
                Retry Test
              </button>
            )}
            <button className="btn btn-outline" onClick={handleExitTest}>
              Return to Syllabus
            </button>
          </div>
        </div>
      );
    }
    
    if (questions.length === 0) {
      return (
        <div className="p-4">
          <div className="bg-yellow-100 border border-yellow-300 text-yellow-700 p-4 rounded-lg">
            <p>No questions available. Please try again or return to the syllabus.</p>
          </div>
          <div className="flex justify-end mt-4">
            <button className="btn btn-outline" onClick={handleExitTest}>
              Return to Syllabus
            </button>
          </div>
        </div>
      );
    }
    
    return (
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">Test: {currentTestTopic.topic}</h2>
        <p className="mb-4 text-sm">Answer at least 3 out of 5 questions correctly to pass and unlock the next topic.</p>
        
        <div className="space-y-6 mb-6">
          {questions.map((q, idx) => (
            <div key={idx} className="border rounded-lg p-4">
              <p className="font-medium mb-2">{idx + 1}. {q.question}</p>
              <div className="space-y-2">
                {q.options.map((option, optIdx) => (
                  <div 
                    key={optIdx} 
                    className={`p-2 rounded cursor-pointer hover:bg-gray-100 ${
                      userAnswers[idx] === option ? 'bg-blue-100 border border-blue-300' : 'bg-gray-50'
                    }`}
                    onClick={() => handleAnswerSelect(idx, option)}
                  >
                    {option}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex justify-between">
          <button className="btn btn-outline" onClick={handleExitTest}>
            Cancel
          </button>
          <button 
            className="btn btn-primary" 
            onClick={handleSubmitTest}
            disabled={Object.keys(userAnswers).length !== questions.length}
          >
            Submit Test
          </button>
        </div>
      </div>
    );
  };

  if (testMode) {
    return (
      <div>
        <MainNavbar />
        {renderTest()}
      </div>
    );
  }

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
                {unlocked && !item.is_completed && (
                  <div className="badge badge-warning ml-2">Incomplete</div>
                )}
                {item.is_completed && (
                  <div className="badge badge-success ml-2">Completed</div>
                )}
              </div>
              
              <div className="collapse-content text-sm">
                {unlocked ? (
                  <>
                    <p>{item.description}</p>
                    <div className="mt-3 flex gap-2 flex-wrap">
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
                      
                      {!item.is_completed && (
                        <button
                          className="btn btn-primary"
                          onClick={() => handleStartTest(item.topic, item.description, item.id, index)}
                        >
                          Start Test
                        </button>
                      )}
                      
                      {item.is_completed && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleComplete(item.id, index);
                          }}
                          className="btn btn-sm btn-success"
                        >
                          Completed
                        </button>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center py-4">
                    <p className="text-gray-500">Complete the previous module's test to unlock this content</p>
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