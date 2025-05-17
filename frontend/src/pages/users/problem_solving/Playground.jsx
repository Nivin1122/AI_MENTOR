import { Button, Container, Grid, IconButton, Tooltip, Switch, FormControlLabel } from "@mui/material";
import Editor from '@monaco-editor/react';
import { useRef, useState, useEffect } from "react";
import MainNavbar from "../../../components/navbar/MainNavbar";
import { motion, AnimatePresence } from "framer-motion";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import RefreshIcon from '@mui/icons-material/Refresh';
import CodeIcon from '@mui/icons-material/Code';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

const Playground = () => {
  const outputRef = useRef(null);
  const editorRef = useRef(null);
  const [code, setCode] = useState('// Write your JavaScript code here\n\nconsole.log("Hello world")');
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(true);
  const [isOutputExpanded, setIsOutputExpanded] = useState(false);
  const [editorHeight, setEditorHeight] = useState('500px');
  const [copied, setCopied] = useState(false);
  
  // Handle editor mounting
  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
    
    // Configure editor settings
    editor.updateOptions({
      fontFamily: 'JetBrains Mono, monospace',
      fontSize: 14,
      lineHeight: 1.5,
      minimap: { enabled: true },
      scrollBeyondLastLine: false,
      smoothScrolling: true,
      cursorBlinking: 'smooth',
      cursorSmoothCaretAnimation: true,
      automaticLayout: true,
    });
  };

  useEffect(() => {
    // Adjust editor height based on window size
    const handleResize = () => {
      const height = Math.max(400, window.innerHeight * 0.6 - 50); // Subtract some height for button
      setEditorHeight(`${height}px`);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const runCode = () => {
    setIsRunning(true);
    outputRef.current?.scrollIntoView({ behavior: 'smooth' });
    
    // Clear previous output
    setOutput('');
    
    setTimeout(() => {
    try {
      const logs = [];
      const originalConsoleLog = console.log;
        const originalConsoleError = console.error;
        const originalConsoleWarn = console.warn;

        // Override console methods to capture output
      console.log = (...args) => {
          logs.push({ type: 'log', content: args.join(' ') });
        originalConsoleLog(...args);
      };

        console.error = (...args) => {
          logs.push({ type: 'error', content: args.join(' ') });
          originalConsoleError(...args);
        };
        
        console.warn = (...args) => {
          logs.push({ type: 'warn', content: args.join(' ') });
          originalConsoleWarn(...args);
        };

        // Execute the code
      const result = new Function(code)();
        
        // Restore console methods
      console.log = originalConsoleLog;
        console.error = originalConsoleError;
        console.warn = originalConsoleWarn;

        // Format the output
        const formattedLogs = logs.map(log => {
          const prefix = log.type === 'error' ? '🔴 ' : 
                         log.type === 'warn' ? '⚠️ ' : '📋 ';
          return `${prefix}${log.content}`;
        });
        
        const outputText = formattedLogs.length > 0 
          ? formattedLogs.join('\n') + (result !== undefined ? '\n\n🔄 Return: ' + result : '')
          : (result !== undefined ? '🔄 Return: ' + String(result) : '');

        setOutput(outputText || '✅ Code executed successfully (no output)');
    } catch (error) {
        setOutput(`❌ ${String(error)}`);
      } finally {
        setIsRunning(false);
      }
    }, 300);
  };

  const resetCode = () => {
    setCode('// Write your JavaScript code here\n\nconsole.log("Hello world")');
  };
  
  const copyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Toggle theme
  const handleThemeChange = () => {
    setIsDarkTheme(!isDarkTheme);
  };

  return (
    <>
    <MainNavbar />
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gray-50 dark:bg-gray-900"
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
            JavaScript Playground
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
              <div className="flex gap-2">
                <Tooltip title="Run Code">
                  <IconButton 
                    size="small" 
                    onClick={runCode}
                    disabled={isRunning}
                    sx={{ 
                      color: isDarkTheme ? '#61dafb' : '#0d6efd',
                      '&:hover': { backgroundColor: isDarkTheme ? 'rgba(97, 218, 251, 0.1)' : 'rgba(13, 110, 253, 0.1)' }
                    }}
                  >
                    <PlayArrowIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Reset Code">
                  <IconButton 
                    size="small" 
                    onClick={resetCode}
                    sx={{ 
                      color: isDarkTheme ? '#f8f9fa' : '#212529',
                      '&:hover': { backgroundColor: isDarkTheme ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }
                    }}
                  >
                    <RefreshIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title={copied ? "Copied!" : "Copy Code"}>
                  <IconButton 
                    size="small" 
                    onClick={copyCode}
                    sx={{ 
                      color: copied ? '#4caf50' : (isDarkTheme ? '#f8f9fa' : '#212529'),
                      '&:hover': { backgroundColor: isDarkTheme ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }
                    }}
                  >
                    <ContentCopyIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </div>
            </div>
            <div style={{ position: 'relative' }}>
              <Editor
                height={editorHeight}
                width="100%"
                language="javascript"
                theme={isDarkTheme ? "vs-dark" : "light"}
                value={code}
                onChange={(value) => setCode(value || '')}
                onMount={handleEditorDidMount}
                options={{
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: 14,
                }}
              />
            </div>
            <motion.div 
              className="absolute bottom-4 right-4 z-10"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{ zIndex: 50 }}
            >
              <Button
                variant="contained"
                color="primary"
                onClick={runCode}
                disabled={isRunning}
                startIcon={<PlayArrowIcon />}
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
                {isRunning ? 'Running...' : 'Run Code'}
              </Button>
            </motion.div>
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
                <span className="font-semibold">AI Assistant & Output</span>
              </div>
              <motion.div 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => setIsOutputExpanded(!isOutputExpanded)}
                  sx={{ 
                    borderRadius: '8px',
                    borderColor: isDarkTheme ? '#61dafb' : '#0d6efd',
                    color: isDarkTheme ? '#61dafb' : '#0d6efd',
                    '&:hover': {
                      borderColor: isDarkTheme ? '#4fd0f9' : '#0b5ed7',
                    }
                  }}
                >
                  {isOutputExpanded ? 'Collapse' : 'Expand'}
                </Button>
              </motion.div>
            </div>
            <div 
              style={{ 
                backgroundColor: isDarkTheme ? '#1a1a2e' : '#ffffff',
                minHeight: editorHeight,
                maxHeight: isOutputExpanded ? 'none' : editorHeight,
                overflow: 'auto',
                padding: '1rem',
                transition: 'all 0.3s ease',
              }}
            >
              <div className="mb-6">
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full"
                >
                  <Button
                    variant="contained"
                    fullWidth
                    startIcon={<SmartToyIcon />}
                    sx={{ 
                      borderRadius: '8px',
                      backgroundColor: isDarkTheme ? '#6a42c1' : '#6610f2',
                      '&:hover': {
                        backgroundColor: isDarkTheme ? '#5e3aad' : '#5a0ad9',
                      }
                    }}
                  >
                    Ask AI Assistant
                  </Button>
                </motion.div>
                <div 
                  className="mt-3 text-center p-2 rounded-lg text-sm"
                  style={{ 
                    backgroundColor: isDarkTheme ? 'rgba(106, 66, 193, 0.1)' : 'rgba(102, 16, 242, 0.05)',
                    border: isDarkTheme ? '1px solid rgba(106, 66, 193, 0.2)' : '1px solid rgba(102, 16, 242, 0.2)',
                  }}
                >
                  AI Assistant will help you solve coding problems and explain concepts.
                </div>
          </div>
              
              <motion.div
                animate={{ opacity: output ? 1 : 0.5 }}
                transition={{ duration: 0.3 }}
              >
                <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <span className={`h-2 w-2 rounded-full inline-block ${isRunning ? 'bg-yellow-500' : output ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                  Output:
                </h4>
                
                <AnimatePresence mode="wait">
                  {isRunning ? (
                    <motion.div 
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex justify-center items-center py-6"
                    >
                      <div className="flex space-x-2">
                        {[0, 1, 2, 3].map((i) => (
                          <motion.div
                            key={i}
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: isDarkTheme ? '#61dafb' : '#0d6efd' }}
                            animate={{
                              y: ["0%", "-100%", "0%"],
                            }}
                            transition={{
                              duration: 0.8,
                              repeat: Infinity,
                              delay: i * 0.2,
                            }}
                          />
                        ))}
          </div>
                    </motion.div>
                  ) : (
                    <motion.pre 
                      key="output"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="font-mono text-sm p-3 rounded-lg overflow-auto"
                      style={{ 
                        backgroundColor: isDarkTheme ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                        minHeight: '100px',
                        color: isDarkTheme ? '#f8f9fa' : '#212529'
                      }}
                    >
                      {output || 'Run your code to see output here...'}
                    </motion.pre>
                  )}
                </AnimatePresence>
              </motion.div>
          </div>
          </motion.div>
        </motion.div>
    </Container>
    </motion.div>
    </>
  );
};

export default Playground;
