import React, { useEffect, useRef } from 'react'
import * as monaco from 'monaco-editor';
import axios from 'axios';
import { Button, IconButton, Tooltip } from "@mui/material";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { motion } from "framer-motion";

const GeminiAPIKey = "AIzaSyBcmQ3e_WWEMfALnBdYtRrAC3Y-XJIzL-4"

const Editor = (props) => {
    const editorRef = useRef(null);
    const monacoRef = useRef(null);
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    const prompt = `
        You are a helpful coding mentor. Evaluate the following student's code for correctness, clarity, and logic. 
        Give short, crisp feedback explaining:
        1. If the code is correct or not.
        2. If incorrect, where the issue is and what to improve.
        3. If correct, mention one way it could be optimized or improved.
    `

    useEffect(() => {
        // Initialize the editor
        monacoRef.current = monaco.editor.create(editorRef.current, {
            value: props.problem.code,
            language: props.language,
            theme: "vs-dark",
            automaticLayout: true,
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: 14,
            lineHeight: 1.5,
            minimap: { enabled: true },
            scrollBeyondLastLine: false,
            smoothScrolling: true,
            cursorBlinking: 'smooth',
            cursorSmoothCaretAnimation: true,
        });
        
        monacoRef.current.onDidChangeModelContent(() => {
            const value = monacoRef.current.getValue();
            props.setProblem({...props.problem, code:value});
        });

        // Cleanup on unmount
        return () => {
            if (monacoRef.current) {
                monacoRef.current.dispose();
            }
        };
    }, []);

    const submitCode = () => {
        setIsSubmitting(true);
        let promptWithCode = `${prompt} \nQuestion: ${props.problem.question} \nStudent's code: ${props.problem.code}`
        console.log(promptWithCode)
        axios.post(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GeminiAPIKey}`, {
            contents: [
                {
                    parts: [{ text: promptWithCode}]
                }
            ]
        }).then(res => {
            props.setEvaluation(res.data.candidates[0].content.parts[0].text)
            setIsSubmitting(false);
        }).catch(err => {
            alert("Try again")
            setIsSubmitting(false);
        })
    }

    return (
        <>
            <div
                ref={editorRef}
                style={{ width: "100%", height: "100%" }}
            />
            <motion.div 
                className="absolute bottom-4 right-4 z-10"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{ zIndex: 50 }}
            >
                <Button
                    variant="contained"
                    color="primary"
                    onClick={submitCode}
                    disabled={isSubmitting}
                    startIcon={<PlayArrowIcon />}
                    sx={{ 
                        borderRadius: '8px',
                        boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
                        backgroundColor: '#61dafb',
                        color: '#000',
                        '&:hover': {
                            backgroundColor: '#4fd0f9',
                        }
                    }}
                >
                    {isSubmitting ? 'Evaluating...' : 'Submit Code'}
                </Button>
            </motion.div>
        </>
    )
}

export default Editor