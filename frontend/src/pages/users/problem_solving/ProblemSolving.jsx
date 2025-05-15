import React, { useEffect, useRef, useState } from 'react'

import axios from 'axios';
import Editor from './Editor';

const ProblemSolving = () => {
    const GeminiAPIKey = "AIzaSyBcmQ3e_WWEMfALnBdYtRrAC3Y-XJIzL-4"


    const [language, setLanguage] = useState("javascript")
    const [problem, setProblem] = useState({
        question: ``,
        code: "console.log('Hello world')"
    })
    const prompt = `
        Generate one Python coding question . The student's skill level is  difficulty: 1 out of 1000. The question should describe a relatable real-life situation. Do not include any code in the prompt.

        Along with the question, include exactly 2 input-output examples that help the student understand the expected behavior. Format the examples like this:

        Example 1:  
        Input: [describe the input]  
        Output: [expected output]  

        Example 2:  
        Input: [describe the input]  
        Output: [expected output]  

        Do not include any code or explanation. Output only the question and the two examples.

    `
    const [evaluation, setEvaluation] = useState("")
    
 
    const genetateQuestion = () => {
        console.log(prompt)
        axios.post(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GeminiAPIKey}`, {
            
            contents: [
                {
                    parts: [{ text: prompt }]
                }
            ]
            
        }).then(res => {
            setProblem({...problem, question: res.data.candidates[0].content.parts[0].text})
            
        }).catch(err => {
            alert("Try again")
        })
    }

  return (
    <>
    <button onClick = {genetateQuestion}>Generate Question</button>
    {problem.question && <>
        <h1>{problem.question}</h1>
        <br />
        <hr />
        <br />
        <div className='flex'>
            <div>
                <Editor problem = {problem} language = {language} setProblem = {setProblem} setEvaluation = {setEvaluation} />
            </div>
            <div>{evaluation}</div>
        </div>
        
    </>}
        
    </>
  )
}

export default ProblemSolving