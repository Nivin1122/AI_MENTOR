import { Button, Container, Grid } from "@mui/material";
import Editor from '@monaco-editor/react';
import { useRef, useState } from "react";

const Playground = () => {
  const outputRef = useRef(null);
  const [code, setCode] = useState('// Write your JavaScript code here\n\nconsole.log("Hello world")');
  const [output, setOutput] = useState('');

  const runCode = () => {
    outputRef.current?.scrollIntoView();
    try {
      const logs = [];
      const originalConsoleLog = console.log;

      console.log = (...args) => {
        logs.push(args.join(' '));
        originalConsoleLog(...args);
      };

      const result = new Function(code)();
      console.log = originalConsoleLog;

      const outputText = logs.length > 0 
        ? logs.join('\n') + (result !== undefined ? '\nReturn: ' + result : '')
        : (result !== undefined ? String(result) : '');

      setOutput(outputText);
    } catch (error) {
      setOutput(String(error));
    }
  };

  return (
    <Container>
      <h1 className="page-heading">JavaScript Playground (AI)</h1>
      <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        <Grid item xs={12} md={6}>
          <div className="code-run-btn-container">
            <Button variant="contained" type="submit" onClick={runCode}>
              Run Code
            </Button>
          </div>
          <div className="playground-main-col">
            <Editor
              height="400px"
              width={'600px'}
              defaultLanguage="javascript"
              defaultValue="// some comment"
              value={code}
              onChange={(value) => setCode(value || '')}
            />
          </div>
        </Grid>
        <Grid item xs={12} md={6}>
          <div className="code-run-btn-container">
            <Button variant="contained">Ask AI (Development stage)</Button>
          </div>
          <div className="playground-main-col bg-light" ref={outputRef}>
            <h4>Output:</h4>
            <pre className="text-black">{output}</pre>
          </div>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Playground;
