import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  IconButton,
  Slide,
  Fade,
  CircularProgress,
  InputAdornment,
} from "@mui/material";
import {
  Send,
  School,
  Folder,
  ArrowBack,
} from "@mui/icons-material";

const Chatroom = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const { id } = useParams();
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const token = params.get("token");
  const [socket, setSocket] = useState(null);
  
  // Animation states
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Stagger animations for a more elegant entrance
    setTimeout(() => setShowContent(true), 500);
    
    const newSocket = new WebSocket(`ws://127.0.0.1:8000/ws/${id}?token=${token}`);
    setSocket(newSocket);
    
    newSocket.onopen = function () {
      console.log("WebSocket connection established.");
    };

    newSocket.onmessage = function (event) {
      console.log("Message received: ", event.data);
    };

    newSocket.onclose = function () {
      console.log("WebSocket connection closed.");
    };

    newSocket.onerror = function (error) {
      console.error("WebSocket error: ", error);
    };

    newSocket.onmessage = (event) => {
      const msg = event.data;
      setMessages((prev) => [...prev, msg]);
    };

    return () => {
      newSocket.close();
    };
  }, [id, token]);

  const sendMessage = () => {
    if (socket && message) {
      socket.send(message);
      setMessage("");
    }
  };

  const handleResources = () => {
    navigate("/resourses");
  };
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Poppins:wght@300;400;500;600&display=swap');
          
          @keyframes gradientFlow {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }

          @keyframes float {
            0% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(5deg); }
            100% { transform: translateY(0px) rotate(0deg); }
          }
          
          @keyframes pulse {
            0% { opacity: 0.7; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.05); }
            100% { opacity: 0.7; transform: scale(1); }
          }

          .gradient-bg {
            background: linear-gradient(-45deg, #1a0033, #2a0944, #3b185f, #240046);
            background-size: 400% 400%;
            animation: gradientFlow 15s ease infinite;
          }

          .neon-glow {
            box-shadow: 0 0 30px rgba(157, 68, 192, 0.3);
            transition: all 0.4s ease;
          }
          
          .hover-scale {
            transition: transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          }

          .hover-scale:hover {
            transform: scale(1.02);
          }
          
          .floating-particles {
            position: absolute;
            width: 100%;
            height: 100%;
            overflow: hidden;
            z-index: 0;
          }
          
          .particle {
            position: absolute;
            border-radius: 50%;
            background: rgba(157, 68, 192, 0.3);
            animation: pulse 4s infinite;
          }
          
          .messages-container {
            display: flex;
            flex-direction: column;
            overflow-y: auto;
            scrollbar-width: thin;
            scrollbar-color: rgba(157, 68, 192, 0.5) rgba(26, 0, 51, 0.2);
            height: calc(100vh - 240px);
            padding: 20px;
          }

          .messages-container::-webkit-scrollbar {
            width: 8px;
          }

          .messages-container::-webkit-scrollbar-track {
            background: rgba(26, 0, 51, 0.2);
            border-radius: 10px;
          }

          .messages-container::-webkit-scrollbar-thumb {
            background-color: rgba(157, 68, 192, 0.5);
            border-radius: 10px;
          }
          
          input:-webkit-autofill,
          input:-webkit-autofill:hover,
          input:-webkit-autofill:focus,
          input:-webkit-autofill:active {
            -webkit-box-shadow: 0 0 0 30px rgba(43, 9, 68, 0.9) inset !important;
            -webkit-text-fill-color: #E0E0E0 !important;
          }
        `}
      </style>

      <Container
        maxWidth={false}
        sx={{
          minHeight: "100vh",
          minWidth: "100vw",
          display: "flex",
          padding: 0,
          margin: 0,
          backgroundColor: "#0a0013",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Particles Background */}
        <Box className="floating-particles">
          {[...Array(15)].map((_, index) => (
            <Box
              key={index}
              className="particle"
              sx={{
                width: `${Math.random() * 15 + 5}px`,
                height: `${Math.random() * 15 + 5}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.5 + 0.3,
                animationDelay: `${Math.random() * 4}s`,
                animationDuration: `${Math.random() * 6 + 4}s`,
              }}
            />
          ))}
        </Box>

        {/* Main Chat Container */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            position: "relative",
            zIndex: 2,
            p: { xs: 2, md: 4 },
          }}
        >
          <Fade in={showContent} timeout={1000}>
            <Paper
              elevation={24}
              sx={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(26, 0, 51, 0.85)",
                borderRadius: "24px",
                border: "1px solid rgba(157, 68, 192, 0.4)",
                position: "relative",
                overflow: "hidden",
              }}
              className="neon-glow"
            >
              {/* Decorative accent line */}
              <Box 
                sx={{ 
                  position: "absolute", 
                  top: 0, 
                  left: 0, 
                  width: "100%", 
                  height: "4px", 
                  background: "linear-gradient(90deg, #8E24AA 0%, #9D44C0 50%, #6C3483 100%)" 
                }}
              />
              
              {/* Header */}
              <Box 
                sx={{ 
                  p: 3, 
                  borderBottom: "1px solid rgba(157, 68, 192, 0.4)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between"
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <School 
                    sx={{ 
                      fontSize: 32, 
                      color: "#9D44C0", 
                      mr: 2,
                      filter: "drop-shadow(0 0 8px rgba(157, 68, 192, 0.5))" 
                    }} 
                  />
                  
                  <Typography
                    variant="h5"
                    sx={{
                      color: "#FFFFFF",
                      fontFamily: "'Playfair Display', serif",
                      fontWeight: 600,
                      letterSpacing: "1px"
                    }}
                  >
                    Chatroom: {id}
                  </Typography>
                </Box>
                
                <Button
                  variant="contained"
                  startIcon={<Folder />}
                  onClick={handleResources}
                  sx={{
                    py: 1,
                    px: 3,
                    background: "linear-gradient(45deg, #9D44C0 0%, #6C3483 100%)",
                    fontWeight: "500",
                    fontSize: "0.9rem",
                    borderRadius: "12px",
                    fontFamily: "'Poppins', sans-serif",
                    color: "#FFFFFF",
                    boxShadow: "0 4px 10px rgba(157, 68, 192, 0.3)",
                    border: "none",
                    "&:hover": {
                      background: "linear-gradient(45deg, #8E24AA 0%, #6A1B9A 100%)",
                      transform: "translateY(-2px)",
                      boxShadow: "0 6px 15px rgba(157, 68, 192, 0.5)",
                    },
                    "&:active": {
                      transform: "translateY(1px)",
                      boxShadow: "0 2px 5px rgba(157, 68, 192, 0.4)",
                    },
                    transition: "all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                  }}
                >
                  Resources
                </Button>
              </Box>
              
              {/* Messages Area */}
              <Box className="messages-container">
                {messages.length === 0 ? (
                  <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "100%" }}>
                    <School 
                      sx={{ 
                        fontSize: 64, 
                        color: "rgba(157, 68, 192, 0.3)", 
                        mb: 2,
                        animation: "float 6s ease-in-out infinite",
                      }} 
                    />
                    <Typography
                      variant="h6"
                      sx={{
                        color: "rgba(255, 255, 255, 0.5)",
                        fontFamily: "'Poppins', sans-serif",
                        textAlign: "center",
                        maxWidth: "80%"
                      }}
                    >
                      No messages yet. Start the conversation!
                    </Typography>
                  </Box>
                ) : (
                  messages.map((msg, index) => (
                    <Box 
                      key={index}
                      sx={{
                        backgroundColor: "rgba(157, 68, 192, 0.3)",
                        borderRadius: "12px",
                        padding: "12px 16px",
                        margin: "8px 0",
                        backdropFilter: "blur(10px)",
                        border: "1px solid rgba(157, 68, 192, 0.2)",
                        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
                      }}
                    >
                      <Typography
                        variant="body1"
                        sx={{
                          color: "#E0E0E0",
                          fontFamily: "'Poppins', sans-serif",
                          fontWeight: 300,
                        }}
                      >
                        {msg}
                      </Typography>
                    </Box>
                  ))
                )}
              </Box>
              
              {/* Message Input */}
              <Box 
                sx={{ 
                  p: 3, 
                  borderTop: "1px solid rgba(157, 68, 192, 0.4)",
                  bgcolor: "rgba(26, 0, 51, 0.95)"
                }}
              >
                <Slide direction="up" in={showContent} timeout={1000}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <TextField
                      fullWidth
                      placeholder="Type a message..."
                      variant="filled"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      sx={{
                        "& .MuiFilledInput-root": {
                          backgroundColor: "rgba(255,255,255,0.1)",
                          borderRadius: "12px",
                          color: "#E0E0E0",
                          fontFamily: "'Poppins', sans-serif",
                          transition: "all 0.3s ease",
                          "&:hover": { backgroundColor: "rgba(255,255,255,0.15)" },
                          "&.Mui-focused": { 
                            backgroundColor: "rgba(255,255,255,0.2)",
                            boxShadow: "0 0 15px rgba(157, 68, 192, 0.3)",
                          },
                        },
                      }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={sendMessage}
                              disabled={!message.trim()}
                              sx={{ 
                                color: "#9D44C0",
                                "&:hover": { 
                                  background: "rgba(157, 68, 192, 0.2)",
                                },
                                "&.Mui-disabled": {
                                  color: "rgba(157, 68, 192, 0.5)"
                                }
                              }}
                            >
                              <Send />
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Box>
                </Slide>
              </Box>
            </Paper>
          </Fade>
        </Box>
      </Container>
    </>
  );
};

export default Chatroom;



