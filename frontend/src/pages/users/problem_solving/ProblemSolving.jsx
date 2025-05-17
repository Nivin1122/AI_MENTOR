import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios';
import Editor from './Editor';
import { Button, Container, Grid, IconButton, Tooltip, Switch, FormControlLabel, Paper, Chip } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import RefreshIcon from '@mui/icons-material/Refresh';
import CodeIcon from '@mui/icons-material/Code';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import MainNavbar from "../../../components/navbar/MainNavbar";
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'; 
import WhatshotIcon from '@mui/icons-material/Whatshot';
import PsychologyIcon from '@mui/icons-material/Psychology';

const ProblemSolving = () => {
    const GeminiAPIKey = "AIzaSyBcmQ3e_WWEMfALnBdYtRrAC3Y-XJIzL-4"
    const [language, setLanguage] = useState("javascript")
    const [problem, setProblem] = useState({
        question: ``,
        code: "console.log('Hello world')"
    })
    const [evaluation, setEvaluation] = useState("")
    const [isRunning, setIsRunning] = useState(false)
    const [isDarkTheme, setIsDarkTheme] = useState(true)
    const [editorHeight, setEditorHeight] = useState('500px')
    const [difficulty, setDifficulty] = useState("easy")
    const outputRef = useRef(null)
    
    const difficultyLevels = {
        easy: {
            value: 1,
            icon: <EmojiEventsIcon />,
            color: '#4caf50',
            label: 'Easy',
            description: 'Perfect for beginners to practice fundamentals'
        },
        medium: {
            value: 40,
            icon: <PsychologyIcon />,
            color: '#ff9800',
            label: 'Medium',
            description: 'Challenge yourself with intermediate concepts'
        },
        hard: {
            value: 80,
            icon: <WhatshotIcon />,
            color: '#f44336',
            label: 'Hard',
            description: 'Advanced problems for experienced coders'
        }
    }
    
    const getPrompt = () => {
        return `
            Generate one Python coding question. The student's skill level is difficulty: ${difficultyLevels[difficulty].value} out of 100. The question should describe a relatable real-life situation. Do not include any code in the prompt.

        Along with the question, include exactly 2 input-output examples that help the student understand the expected behavior. Format the examples like this:

        Example 1:  
        Input: [describe the input]  
        Output: [expected output]  

        Example 2:  
        Input: [describe the input]  
        Output: [expected output]  

        Do not include any code or explanation. Output only the question and the two examples.
        `
    }
    
    useEffect(() => {
        // Adjust editor height based on window size
        const handleResize = () => {
            const height = Math.max(400, window.innerHeight * 0.6 - 50);
            setEditorHeight(`${height}px`);
        };
        
        handleResize();
        window.addEventListener('resize', handleResize);
        
        return () => window.removeEventListener('resize', handleResize);
    }, []);
 
    const genetateQuestion = () => {
        setIsRunning(true);
        const prompt = getPrompt();
        console.log(prompt)
        axios.post(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GeminiAPIKey}`, {
            contents: [
                {
                    parts: [{ text: prompt }]
                }
            ]
        }).then(res => {
            setProblem({...problem, question: res.data.candidates[0].content.parts[0].text})
            setIsRunning(false);
        }).catch(err => {
            alert("Try again")
            setIsRunning(false);
        })
    }

    // Toggle theme
    const handleThemeChange = () => {
        setIsDarkTheme(!isDarkTheme);
    };

    // Handle difficulty change
    const handleDifficultyChange = (level) => {
        setDifficulty(level);
    }

  return (
    <>
        <MainNavbar />
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen"
            style={{ 
                backgroundColor: isDarkTheme ? '#1e1e2f' : '#f8f9fa',
                color: isDarkTheme ? '#ffffff' : '#212529',
                transition: 'background-color 0.3s, color 0.3s'
            }}
        >
            <Container maxWidth="xl" sx={{ pt: 4, pb: 8 }}>
                <motion.div 
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="flex items-center justify-between mb-6"
                >
                    <motion.h1 
                        className="text-3xl font-bold"
                        initial={{ x: -20 }}
                        animate={{ x: 0 }}
                        transition={{ type: "spring", stiffness: 120 }}
                    >
                        <CodeIcon sx={{ fontSize: 32, mr: 1, verticalAlign: 'bottom' }} />
                        Problem Solving
                    </motion.h1>
                    
                    <div className="flex items-center gap-2">
                        <FormControlLabel
                            control={
                                <Switch 
                                    checked={isDarkTheme}
                                    onChange={handleThemeChange}
                                    color="primary"
                                />
                            }
                            label={isDarkTheme ? 
                                <DarkModeIcon sx={{ color: isDarkTheme ? '#fff' : '#000' }} /> : 
                                <LightModeIcon sx={{ color: isDarkTheme ? '#fff' : '#000' }} />
                            }
                        />
                    </div>
                </motion.div>
                
                {!problem.question && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="mb-8"
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.3, duration: 0.5 }}
                            className="mb-10 text-center"
                        >
                            <h2 className="text-2xl font-bold mb-4">Choose Your Challenge Level</h2>
                            <p className="text-gray-400 mb-8">Select a difficulty level to get started with your coding practice</p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                                {Object.keys(difficultyLevels).map((level) => (
                                    <motion.div 
                                        key={level}
                                        whileHover={{ scale: 1.03, y: -5 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => handleDifficultyChange(level)}
                                    >
                                        <Paper 
                                            elevation={3} 
                                            sx={{ 
                                                p: 3, 
                                                textAlign: 'center',
                                                border: difficulty === level ? `2px solid ${difficultyLevels[level].color}` : 'none',
                                                backgroundColor: isDarkTheme ? 
                                                    (difficulty === level ? 'rgba(255,255,255,0.08)' : '#2d2d44') : 
                                                    (difficulty === level ? 'rgba(0,0,0,0.03)' : 'white'),
                                                position: 'relative',
                                                overflow: 'hidden',
                                                cursor: 'pointer',
                                                transition: 'all 0.3s ease'
                                            }}
                                        >
                                            {difficulty === level && (
                                                <Chip 
                                                    label="Selected" 
                                                    size="small" 
                                                    sx={{ 
                                                        position: 'absolute', 
                                                        top: 10, 
                                                        right: 10,
                                                        backgroundColor: difficultyLevels[level].color,
                                                        color: 'white',
                                                        fontWeight: 'bold'
                                                    }} 
                                                />
                                            )}
                                            <motion.div
                                                animate={{ 
                                                    rotate: difficulty === level ? [0, -10, 10, -5, 5, 0] : 0 
                                                }}
                                                transition={{ 
                                                    duration: 0.5,
                                                    ease: "easeInOut",
                                                    delay: difficulty === level ? 0.2 : 0
                                                }}
                                                style={{ 
                                                    color: difficultyLevels[level].color,
                                                    fontSize: '3rem',
                                                    margin: '0 auto 20px'
                                                }}
                                            >
                                                {difficultyLevels[level].icon}
                                            </motion.div>
                                            <h3 className="text-xl font-bold mb-2">{difficultyLevels[level].label}</h3>
                                            <p className={`text-sm ${isDarkTheme ? 'text-gray-300' : 'text-gray-600'}`}>
                                                {difficultyLevels[level].description}
                                            </p>
                                        </Paper>
                                    </motion.div>
                                ))}
            </div>
                        </motion.div>
                        <motion.div className="text-center mt-8">
                            <motion.div 
                                whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(0,0,0,0.2)" }}
                                whileTap={{ scale: 0.98 }}
                                className="inline-block"
                            >
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={genetateQuestion}
                                    disabled={isRunning}
                                    startIcon={<SmartToyIcon />}
                                    size="large"
                                    sx={{ 
                                        borderRadius: '12px',
                                        boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                                        backgroundColor: difficultyLevels[difficulty].color,
                                        color: '#fff',
                                        padding: '12px 24px',
                                        fontSize: '1.1rem',
                                        '&:hover': {
                                            backgroundColor: difficultyLevels[difficulty].color,
                                            filter: 'brightness(110%)'
                                        }
                                    }}
                                >
                                    {isRunning ? 'Generating...' : `Generate ${difficultyLevels[difficulty].label} Question`}
                                </Button>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                )}
                
                {problem.question && (
                    <>
                        <motion.div className="mb-4">
                            <motion.div 
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="inline-block"
                            >
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => setProblem({...problem, question: ''})}
                                    sx={{ 
                                        borderRadius: '8px',
                                        boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
                                        backgroundColor: isDarkTheme ? '#61dafb' : '#0d6efd',
                                        color: isDarkTheme ? '#000' : '#fff',
                                        '&:hover': {
                                            backgroundColor: isDarkTheme ? '#4fd0f9' : '#0b5ed7',
                                        }
                                    }}
                                >
                                    Back to Selection
                                </Button>
                            </motion.div>
                            <Chip 
                                label={difficultyLevels[difficulty].label} 
                                icon={difficultyLevels[difficulty].icon}
                                sx={{ 
                                    ml: 2,
                                    backgroundColor: difficultyLevels[difficulty].color,
                                    color: 'white',
                                    fontWeight: 'bold',
                                    px: 1
                                }} 
                            />
                        </motion.div>
                    
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <motion.div 
                                className="rounded-xl overflow-hidden shadow-lg mb-6"
                                style={{ 
                                    backgroundColor: isDarkTheme ? '#2d2d44' : '#e9ecef',
                                }}
                                whileHover={{ boxShadow: "0 10px 25px rgba(0,0,0,0.2)" }}
                            >
                                <div className="p-3 flex justify-between items-center"
                                    style={{ 
                                        borderBottom: `1px solid ${isDarkTheme ? '#3e3e5a' : '#ced4da'}`
                                    }}>
                                    <div className="flex items-center gap-2">
                                        <CodeIcon sx={{ color: isDarkTheme ? '#61dafb' : '#0d6efd' }} />
                                        <span className="font-semibold">Problem Statement</span>
                                    </div>
                                </div>
                                <div 
                                    className="p-4"
                                    style={{ 
                                        backgroundColor: isDarkTheme ? '#1a1a2e' : '#ffffff',
                                    }}
                                >
                                    <div 
                                        className="font-mono whitespace-pre-wrap overflow-auto rounded-lg p-4"
                                        style={{ 
                                            backgroundColor: isDarkTheme ? '#2d2d3f' : '#f5f5f5',
                                            transition: 'all 0.3s ease',
                                        }}
                                    >
                                        <div dangerouslySetInnerHTML={{ 
                                            __html: problem.question
                                                .replace(/Example \d+:/g, match => `<strong class="text-${isDarkTheme ? 'green-400' : 'green-600'}">${match}</strong>`)
                                                .replace(/Input:/g, match => `<strong class="text-${isDarkTheme ? 'blue-400' : 'blue-600'}">${match}</strong>`)
                                                .replace(/Output:/g, match => `<strong class="text-${isDarkTheme ? 'purple-400' : 'purple-600'}">${match}</strong>`)
                                                .replace(/\n/g, '<br />')
                                        }} />
            </div>
        </div>
                            </motion.div>
                            
                            <motion.div 
                                className="grid grid-cols-1 lg:grid-cols-2 gap-4"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                            >
                                {/* Editor Section */}
                                <motion.div 
                                    className="rounded-xl overflow-hidden shadow-lg relative"
                                    whileHover={{ boxShadow: "0 10px 25px rgba(0,0,0,0.2)" }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <div className="p-3 flex justify-between items-center" 
                                        style={{ 
                                            backgroundColor: isDarkTheme ? '#2d2d44' : '#e9ecef',
                                            borderBottom: `1px solid ${isDarkTheme ? '#3e3e5a' : '#ced4da'}`
                                        }}>
                                        <div className="flex items-center gap-2">
                                            <CodeIcon sx={{ color: isDarkTheme ? '#61dafb' : '#0d6efd' }} />
                                            <span className="font-semibold">Code Editor</span>
                                        </div>
                                    </div>
                                    <div style={{ position: 'relative' }}>
                                        <div style={{ height: editorHeight }}>
                                            <Editor 
                                                problem={problem} 
                                                language={language} 
                                                setProblem={setProblem} 
                                                setEvaluation={setEvaluation} 
                                            />
                                        </div>
                                    </div>
                                </motion.div>
                                
                                {/* Output Section */}
                                <motion.div 
                                    className="rounded-xl overflow-hidden shadow-lg"
                                    ref={outputRef}
                                    whileHover={{ boxShadow: "0 10px 25px rgba(0,0,0,0.2)" }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <div className="p-3 flex justify-between items-center"
                                        style={{ 
                                            backgroundColor: isDarkTheme ? '#2d2d44' : '#e9ecef',
                                            borderBottom: `1px solid ${isDarkTheme ? '#3e3e5a' : '#ced4da'}`
                                        }}>
                                        <div className="flex items-center gap-2">
                                            <SmartToyIcon sx={{ color: isDarkTheme ? '#61dafb' : '#0d6efd' }} />
                                            <span className="font-semibold">Evaluation</span>
                                        </div>
                                    </div>
                                    <div 
                                        style={{ 
                                            backgroundColor: isDarkTheme ? '#1a1a2e' : '#ffffff',
                                            minHeight: editorHeight,
                                            overflow: 'auto',
                                            padding: '1rem',
                                            transition: 'all 0.3s ease',
                                        }}
                                    >
                                        <motion.pre 
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="font-mono text-sm p-3 rounded-lg overflow-auto"
                                            style={{ 
                                                backgroundColor: isDarkTheme ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                                                minHeight: '100px',
                                                color: isDarkTheme ? '#f8f9fa' : '#212529'
                                            }}
                                        >
                                            {evaluation || 'Submit your code to see evaluation here...'}
                                        </motion.pre>
                                    </div>
                                </motion.div>
                            </motion.div>
                        </motion.div>
                    </>
                )}
            </Container>
        </motion.div>
    </>
  )
}

export default ProblemSolving