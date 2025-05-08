import React from 'react'
import { useState,useEffect } from 'react'
import viteLogo from '/vite.svg'
import Vapi from "@vapi-ai/web";
import { useParams } from 'react-router-dom';
import aiMentor from '../../../utils/mentorDTO';
import { vapi } from '../../../sdk/vapi.sdk';

const StartClass = () => {
  const [status, setStatus] = useState("Idle");

  useEffect(() => {

    vapi.on("call-start", () => setStatus("Listening..."));
    vapi.on("call-end", () => setStatus("Idle"));
    vapi.on("speech-start", () => setStatus("Assistant Speaking"));
    vapi.on("speech-end", () => setStatus("Idle"));
    vapi.on("error", (e) => {
      console.error(e);
      setStatus("Error");
    });
  }, []);

  const startAssistant = async (topic) => {
    if (vapi) {
      await vapi.start(aiMentor, {
        variableValues: {
            topic: topic
      }})
    } else {
      console.error("Vapi is not initialized.");
    }
  };

  const stopAssistant = () => {
    if (vapi) {
      vapi.stop();
      setStatus("Idle");
    } else {
      console.error("Vapi is not initialized.");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>🎤 AI Voice Assistant</h1>
      <p>Status: {status}</p>
      <button
        onClick={()=>startAssistant("var, let, const in javascript")}
        disabled={!vapi}
        style={{
          padding: "10px 20px",
          fontSize: "18px",
          backgroundColor: vapi ? "#4CAF50" : "#ccc",
          color: "#fff",
          border: "none",
          cursor: vapi ? "pointer" : "not-allowed",
        }}
      >
        {vapi ? "Start Var,let,const" : "Loading..."}
      </button><br /><br />
      <button
        onClick={()=>startAssistant("for loop in javascript")}
        disabled={!vapi}
        style={{
          padding: "10px 20px",
          fontSize: "18px",
          backgroundColor: vapi ? "#4CAF50" : "#ccc",
          color: "#fff",
          border: "none",
          cursor: vapi ? "pointer" : "not-allowed",
        }}
      >
        {vapi ? "Start for loop" : "Loading..."}
      </button>
      <br />
      <button
        onClick={stopAssistant}
        disabled={!vapi}
        style={{
          padding: "10px 20px",
          fontSize: "18px",
          backgroundColor: vapi ? "#f44336" : "#ccc",
          color: "#fff",
          border: "none",
          cursor: vapi ? "pointer" : "not-allowed",
          marginTop: "10px",
        }}
      >
        Stop Talking
      </button>
    </div>
  );
}

export default StartClass