import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import MainNavbar from "../../../components/navbar/MainNavbar";
import { vapi } from "../../../sdk/vapi.sdk";
import aiMentor from "../../../utils/mentorDTO";
import { motion, AnimatePresence } from "framer-motion";

const SyllabusPage = () => {
  const { courseId } = useParams();
  const [syllabus, setSyllabus] = useState([]);
  const [isCallActive, setIsCallActive] = useState(false);
  const [activeItemIndex, setActiveItemIndex] = useState(null);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  
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
    setLoading(true);
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
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error loading syllabus:", error);
        setLoading(false);
      });
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
      setIsSpeaking(true);

      if (call && typeof call.on === "function") {
        // Add speech detection events
        call.on("speech-start", () => {
          setIsSpeaking(true);
        });
        
        call.on("speech-end", () => {
          setIsSpeaking(false);
        });
        
        call.on("call-end", () => {
          setIsCallActive(false);
          setActiveItemIndex(null);
          setIsSpeaking(false);
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
        <div className="flex justify-center items-center p-6 min-h-[60vh]">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary"></div>
            <span className="mt-4 text-gray-700 font-medium">Loading test questions...</span>
          </div>
        </div>
      );
    }
    
    if (testError) {
      return (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ duration: 0.5 }}
          className="p-6 max-w-4xl mx-auto"
        >
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-bold mb-3 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              Error
            </h2>
            <p className="text-red-600">{testError}</p>
          </div>
          <div className="flex flex-col sm:flex-row justify-between gap-4 mt-6">
            <motion.button 
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="btn btn-outline px-8 py-3 rounded-lg"
              onClick={handleExitTest}
            >
              Return to Syllabus
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="btn btn-primary px-8 py-3 rounded-lg" 
              onClick={() => handleStartTest(
                currentTestTopic.topic, 
                currentTestTopic.description, 
                currentTestTopic.syllabusId, 
                currentTestTopic.index
              )}
            >
              Try Again
            </motion.button>
          </div>
        </motion.div>
      );
    }
    
    if (testCompleted) {
      const passed = testResults.correctAnswers >= 3;
      
      return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="p-6 max-w-4xl mx-auto"
        >
          <h2 className="text-2xl font-bold mb-6 text-center">Test Results</h2>
          <motion.div 
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className={`p-6 rounded-lg shadow-md mb-8 ${passed ? 'bg-green-50 border-l-4 border-green-500' : 'bg-red-50 border-l-4 border-red-500'}`}
          >
            <div className="flex items-center justify-center mb-4">
              {passed ? (
                <div className="bg-green-100 p-3 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              ) : (
                <div className="bg-red-100 p-3 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              )}
            </div>
            <p className="text-xl font-semibold text-center">
              {passed 
                ? `Congratulations! You passed with ${testResults.correctAnswers}/5 correct answers.` 
                : `You got ${testResults.correctAnswers}/5 correct answers. You need at least 3 to pass.`}
            </p>
          </motion.div>
          
          <div className="space-y-6 mb-8">
            {questions.map((q, idx) => (
              <motion.div 
                key={idx}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: idx * 0.1 }}
                className="border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow bg-white"
              >
                <p className="font-medium text-lg mb-4">{q.question}</p>
                <div className="mt-3 space-y-2">
                  {q.options.map((option, optIdx) => (
                    <div 
                      key={optIdx} 
                      className={`p-3 rounded-lg transition-all ${
                        userAnswers[idx] === option && testResults.questionResults[idx].correct 
                          ? 'bg-green-100 border border-green-300 shadow-sm' 
                          : userAnswers[idx] === option && !testResults.questionResults[idx].correct
                          ? 'bg-red-100 border border-red-300 shadow-sm'
                          : q.correctAnswer === option && userAnswers[idx] !== option
                          ? 'bg-green-50 border border-green-200 shadow-sm'
                          : 'bg-gray-50'
                      }`}
                    >
                      {option}
                    </div>
                  ))}
                </div>
                <p className="mt-4 text-sm font-medium flex items-center">
                  {testResults.questionResults[idx].correct 
                    ? (
                      <span className="text-green-600 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        Correct
                      </span>
                    ) 
                    : (
                      <span className="text-red-600">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Incorrect. The correct answer is: <span className="font-semibold">{q.correctAnswer}</span>
                      </span>
                    )}
                </p>
              </motion.div>
            ))}
          </div>
          
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            {!passed && (
              <motion.button 
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="btn btn-primary px-8 py-3 rounded-lg" 
                onClick={() => handleStartTest(
                  currentTestTopic.topic, 
                  currentTestTopic.description, 
                  currentTestTopic.syllabusId, 
                  currentTestTopic.index
                )}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Retry Test
              </motion.button>
            )}
            <motion.button 
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="btn btn-outline px-8 py-3 rounded-lg"
              onClick={handleExitTest}
            >
              Return to Syllabus
            </motion.button>
          </div>
        </motion.div>
      );
    }
    
    if (questions.length === 0 && !testLoading) { // Added !testLoading to prevent brief flash
      return (
        <div className="p-6 max-w-4xl mx-auto">
          <div className="bg-yellow-50 border-l-4 border-yellow-500 text-yellow-700 p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p>No questions available. Please try again or return to the syllabus.</p>
            </div>
          </div>
          <div className="flex justify-end mt-6">
            <motion.button 
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="btn btn-outline px-8 py-3 rounded-lg"
              onClick={handleExitTest}
            >
              Return to Syllabus
            </motion.button>
          </div>
        </div>
      );
    }
    
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="p-6 max-w-4xl mx-auto"
      >
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-3xl font-bold mb-2 text-primary text-center">{currentTestTopic.topic}</h2>
          <p className="mb-4 text-gray-600 text-center">Answer at least 3 out of 5 questions correctly to pass and unlock the next topic.</p>
        </div>
        
        <div className="space-y-6 mb-8">
          {questions.map((q, idx) => (
            <motion.div 
              key={idx}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white border rounded-xl p-6 shadow-sm hover:shadow-lg transition-shadow duration-300"
            >
              <p className="font-medium text-lg mb-4 text-gray-800">{idx + 1}. {q.question}</p>
              <div className="space-y-3">
                {q.options.map((option, optIdx) => (
                  <motion.div 
                    key={optIdx} 
                    whileHover={{ scale: 1.01, boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)" }}
                    whileTap={{ scale: 0.98 }}
                    className={`p-4 rounded-lg cursor-pointer transition-all duration-200 text-gray-700 ${
                      userAnswers[idx] === option 
                        ? 'bg-blue-100 border-2 border-blue-500 shadow-md ring-2 ring-blue-300' 
                        : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
                    }`}
                    onClick={() => handleAnswerSelect(idx, option)}
                  >
                    {option}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="flex flex-col sm:flex-row justify-between gap-4 mt-10">
          <motion.button 
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="btn btn-outline btn-lg px-8 py-3 rounded-lg"
            onClick={handleExitTest}
          >
            Cancel
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.03, backgroundColor: Object.keys(userAnswers).length === questions.length ? undefined : undefined }} // Keep daisyUI default hover
            whileTap={{ scale: 0.97 }}
            className={`btn btn-lg px-8 py-3 rounded-lg ${
              Object.keys(userAnswers).length === questions.length 
                ? "btn-primary" 
                : "btn-disabled bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
            onClick={handleSubmitTest}
            disabled={Object.keys(userAnswers).length !== questions.length}
          >
            Submit Test
          </motion.button>
        </div>
      </motion.div>
    );
  };

  if (testMode) {
    return (
      <div className="min-h-screen bg-gray-100">
        <MainNavbar />
        <div className="container mx-auto px-4 py-8">
          {renderTest()}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <MainNavbar />
      
      <div className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="flex justify-center items-center min-h-[calc(100vh-150px)]"> {/* Adjusted height */}
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-primary"></div>
              <span className="mt-6 text-gray-700 font-medium text-lg">Loading syllabus...</span>
            </div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-10">
              <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8">
                <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Course Syllabus</h1>
                <div className="relative pt-1">
                  <div className="flex mb-2 items-center justify-between">
                    <div>
                      <span className="text-sm font-semibold inline-block py-1 px-3 uppercase rounded-full text-black bg-gradient-to-r bg-opacity-10">
                        Your Progress
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-semibold inline-block text-black">
                        {progress}%
                      </span>
                    </div>
                  </div>
                  <div className="overflow-hidden h-3 mb-4 text-xs flex rounded-full bg-gray-200 shadow-inner">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 1, ease: "circOut" }}
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-green-400 to-green-600 rounded-full

"
                    ></motion.div>
                  </div>
                </div>
              </div>
            </div>

            <div className="max-w-3xl mx-auto space-y-5">
              {syllabus.map((item, index) => {
                const unlocked = isItemUnlocked(index);
                
                return (
                  <motion.div
                    key={item.id}
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: index * 0.08, type: "spring", stiffness: 100 }}
                    className={`bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden ${
                      !unlocked ? "opacity-60 cursor-not-allowed" : ""
                    }`}
                  >
                    <details className="group" {...(!unlocked && {open: false})}> {/* Keep locked items closed */}
                      <summary 
                        className={`flex items-center justify-between p-5 text-lg font-medium ${unlocked ? "cursor-pointer hover:bg-gray-50" : "pointer-events-none"}`}
                        onClick={(e) => !unlocked && e.preventDefault()} // Prevent opening if locked
                      >
                        <div className="flex items-center gap-3">
                          {item.is_completed ? (
                            <motion.div 
                              initial={{scale:0}} animate={{scale:1}} transition={{delay:0.2}}
                              className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-green-100 text-green-600 shadow-sm">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                              </svg>
                            </motion.div>
                          ) : !unlocked ? (
                            <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 text-gray-400 shadow-sm">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                              </svg>
                            </div>
                          ) : (
                             <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-primary shadow-sm">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                              </svg>
                            </div>
                          )}
                          <span className={`text-base sm:text-lg ${unlocked ? "text-gray-800" : "text-gray-500"}`}>
                            {item.topic}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          {unlocked && !item.is_completed && (
                            <span className="hidden sm:inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                              <svg className="w-3 h-3 mr-1.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"></path></svg>
                              In Progress
                            </span>
                          )}
                          {item.is_completed && (
                            <span className="hidden sm:inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                              <svg className="w-3 h-3 mr-1.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                              Completed
                            </span>
                          )}
                          {unlocked && (
                            <span className="transition duration-300 group-open:rotate-180 text-gray-600">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                              </svg>
                            </span>
                          )}
                        </div>
                      </summary>
                      
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="px-5 pb-5 pt-2 text-gray-700"
                      >
                        {unlocked ? (
                          <>
                            <p className="mb-4 text-sm leading-relaxed">{item.description}</p>
                            <div className="mt-4 flex flex-col sm:flex-row gap-3">
                              {activeItemIndex === index && isCallActive ? (
                                <div className="flex flex-col w-full">
                                  <motion.button 
                                    whileHover={{ scale: 1.03 }} 
                                    whileTap={{ scale: 0.97 }}
                                    className="btn btn-error btn-outline mb-2" 
                                    onClick={handleStopCall}
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                    Stop AI
                                  </motion.button>
                                  
                                  {/* Audio visualization when speaking */}
                                  <div className="flex justify-center items-center h-8 my-2">
                                    {isSpeaking && (
                                      <div className="flex items-end space-x-1">
                                        {[1, 2, 3, 4, 5].map((i) => (
                                          <motion.div
                                            key={i}
                                            className="w-1.5 bg-primary rounded-full"
                                            animate={{
                                              height: [
                                                `${Math.random() * 10 + 5}px`,
                                                `${Math.random() * 20 + 10}px`,
                                                `${Math.random() * 10 + 5}px`
                                              ]
                                            }}
                                            transition={{
                                              duration: 0.5,
                                              repeat: Infinity,
                                              delay: i * 0.1
                                            }}
                                          />
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ) : (
                                <motion.button
                                  whileHover={{ scale: 1.03 }} 
                                  whileTap={{ scale: 0.97 }}
                                  className="btn btn-success flex-grow sm:flex-grow-0"
                                  onClick={() => handleAskAI(item.topic, item.description, index)}
                                  disabled={isCallActive}
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                                  </svg>
                                  Ask AI
                                </motion.button>
                              )}
                              
                              {!item.is_completed && (
                                <motion.button
                                  whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                                  className="btn btn-primary flex-grow sm:flex-grow-0"
                                  onClick={() => handleStartTest(item.topic, item.description, item.id, index)}
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                  Start Test
                                </motion.button>
                              )}
                              
                              {item.is_completed && (
                                <motion.button
                                  whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                                  onClick={(e) => {
                                    e.stopPropagation(); // Keep details open
                                    // Optionally, you could add a "review test" or similar functionality here
                                    // For now, just shows completed
                                  }}
                                  className="btn btn-ghost text-green-600 flex-grow sm:flex-grow-0 cursor-default" 
                                  disabled // Makes it non-interactive, good for "display only"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                  Completed
                                </motion.button>
                              )}
                            </div>
                          </>
                        ) : (
                          <div className="flex flex-col items-center justify-center py-6 text-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                            <p className="text-gray-500 font-medium">This topic is currently locked.</p>
                            <p className="text-gray-500 text-sm">Complete the previous topic's test to unlock this content.</p>
                          </div>
                        )}
                      </motion.div>
                    </details>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SyllabusPage;