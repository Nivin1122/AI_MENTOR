import React, { useEffect, useRef } from 'react'
import * as monaco from 'monaco-editor';
import axios from 'axios';
const GeminiAPIKey = "AIzaSyBcmQ3e_WWEMfALnBdYtRrAC3Y-XJIzL-4"

const Editor = (props) => {
    const editorRef = useRef(null);
    const monacoRef = useRef(null);

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
        theme: "vs-dark", // or "vs-light"
        automaticLayout: true,
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
        }).catch(err => {
            alert("Try again")
        })
    }
  return (
    <>
        <div
            ref={editorRef}
            style={{ width: "500px", height: "90vh", border: "1px solid #ccc" }}
        >
        </div>
        <button onClick = {submitCode}>Submit</button>
    </>
  )
}

export default Editor