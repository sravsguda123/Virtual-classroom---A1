import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  InputAdornment,
  Box,
  IconButton,
  Slide,
  Fade,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import { 
  LockOutlined, 
  AccountCircle, 
  Visibility, 
  VisibilityOff,
  School
} from "@mui/icons-material";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showError, setShowError] = useState(false);
  const navigate = useNavigate();

  // Animation states
  const [showForm, setShowForm] = useState(false);
  
  useEffect(() => {
    // Stagger animations for a more elegant entrance
    setTimeout(() => setShowForm(true), 500);
  }, []);

  const handleLogin = async () => {
    if (!username || !password) {
      setError("Please enter both username and password");
      setShowError(true);
      return;
    }
    
    setLoading(true);
    try {
      const response = await axios.post("http://127.0.0.1:8000/login", { username, password });
      localStorage.setItem("token", response.data.token);
      const tokenPayload = JSON.parse(atob(response.data.token.split(".")[1]));
      const role = tokenPayload.role;

      // Simulate delay for smoother transition
      setTimeout(() => {
        if (role === "teacher") {
          navigate(`/create-classroom?token=${response.data.token}`);
        } else if (role === "student") {
          navigate(`/join-classroom?token=${response.data.token}`);
        } else {
          setError("Invalid role assigned to your account");
          setShowError(true);
          setLoading(false);
        }
      }, 800);
    } catch (error) {
      console.error(error.response?.data || error);
      setError(error.response?.data?.message || "Invalid credentials. Please try again.");
      setShowError(true);
      setLoading(false);
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
          
          .neon-glow:hover {
            box-shadow: 0 0 40px rgba(157, 68, 192, 0.5);
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

        {/* Left Panel */}
        <Box
          className="gradient-bg"
          sx={{
            flex: 1,
            display: { xs: "none", md: "flex" },
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            padding: 6,
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* <Fade in={true} timeout={2000}>
            <Box sx={{ animation: "float 6s ease-in-out infinite", mb: 4 }}>
              <svg width="220" height="220" viewBox="0 0 100 100">
                <path
                  fill="#9D44C0"
                  d="M50 5L95 50L50 95L5 50L50 5Z"
                  filter="url(#shadow)"
                />
                <text
                  x="50%"
                  y="50%"
                  dominantBaseline="middle"
                  textAnchor="middle"
                  fill="#F8F8F8"
                  fontSize="28"
                  fontFamily="'Playfair Display', serif"
                  fontWeight="600"
                >
                  VC
                </text>
                <defs>
                  <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="2" result="blur" />
                    <feFlood floodColor="#9D44C0" floodOpacity="0.7" />
                    <feComposite in2="blur" operator="in" />
                    <feComposite in="SourceGraphic" />
                    <feDropShadow dx="0" dy="0" stdDeviation="8" floodColor="#9D44C0" />
                  </filter>
                </defs>
              </svg>
            </Box>
          </Fade> */}

          <Slide direction="right" in={true} timeout={800}>
            <Box sx={{ mt: 2, textAlign: "center", position: "relative", zIndex: 2 }}>
              <Typography
                variant="h2"
                sx={{
                  color: "#FFFFFF",
                  fontFamily: "'Playfair Display', serif",
                  fontWeight: 600,
                  letterSpacing: "3px",
                  textShadow: "0 0 20px rgba(157, 68, 192, 0.5)",
                }}
              >
                Virtual Classroom
              </Typography>
              <Typography
                variant="subtitle1"
                sx={{
                  color: "#E0E0E0",
                  fontFamily: "'Poppins', sans-serif",
                  mt: 3,
                  fontSize: "1.2rem",
                  maxWidth: "80%",
                  mx: "auto",
                  lineHeight: 1.6,
                  letterSpacing: "0.5px",
                }}
              >
                Elevating Digital Education with Immersive Learning Experiences
              </Typography>
              
              <Box 
                sx={{ 
                  mt: 6, 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center",
                  gap: 2
                }}
              >
                <Box sx={{ 
                  width: 10, 
                  height: 10, 
                  borderRadius: "50%", 
                  bgcolor: "#9D44C0",
                  animation: "pulse 2s infinite"
                }}/>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#CCCCCC",
                    fontFamily: "'Poppins', sans-serif",
                    fontStyle: "italic"
                  }}
                >
                  Transforming education through innovation and technology
                </Typography>
              </Box>
            </Box>
          </Slide>
          
          {/* Decorative elements */}
          <Box 
            sx={{ 
              position: "absolute", 
              bottom: 40,
              left: "10%",
              opacity: 0.7
            }}
          >
            <svg width="80" height="80" viewBox="0 0 100 100">
              <path
                fill="none"
                stroke="#9D44C0"
                strokeWidth="2"
                d="M20,50 a30,30 0 1,0 60,0 a30,30 0 1,0 -60,0"
              />
            </svg>
          </Box>
          
          <Box 
            sx={{ 
              position: "absolute", 
              top: "15%",
              right: "10%",
              opacity: 0.5
            }}
          >
            <svg width="120" height="120" viewBox="0 0 100 100">
              <path
                fill="none"
                stroke="#6C3483"
                strokeWidth="2"
                d="M10,10 L90,10 L90,90 L10,90 Z"
              />
            </svg>
          </Box>
        </Box>

        {/* Right Panel */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "transparent",
            position: "relative",
            zIndex: 2
          }}
        >
          <Fade in={showForm} timeout={1000}>
            <Paper
              elevation={24}
              sx={{
                padding: { xs: 4, md: 6 },
                width: "90%",
                maxWidth: "480px",
                backgroundColor: "rgba(26, 0, 51, 0.85)",
                //backdropFilter: "blur(12px)",
                borderRadius: "24px",
                border: "1px solid rgba(157, 68, 192, 0.4)",
                position: "relative",
                overflow: "hidden",
              }}
              className="neon-glow hover-scale"
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
              
              <Box sx={{ textAlign: "center", mb: 5 }}>
                <School 
                  sx={{ 
                    fontSize: 40, 
                    color: "#9D44C0", 
                    mb: 2,
                    filter: "drop-shadow(0 0 10px rgba(157, 68, 192, 0.5))" 
                  }} 
                />
                <Typography
                  variant="h3"
                  sx={{
                    color: "#FFFFFF",
                    textAlign: "center",
                    fontFamily: "'Playfair Display', serif",
                    fontWeight: 600,
                    letterSpacing: "2px",
                    mb: 1
                  }}
                >
                  Educator Portal
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#BBBBBB",
                    fontFamily: "'Poppins', sans-serif",
                    fontWeight: 300,
                  }}
                >
                  Enter your credentials to access your dashboard
                </Typography>
              </Box>

              <Slide direction="up" in={showForm} timeout={1000} style={{ transitionDelay: '200ms' }}>
                <TextField
                  fullWidth
                  label="Username"
                  variant="filled"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  sx={{
                    mb: 3,
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
                    startAdornment: (
                      <InputAdornment position="start">
                        <AccountCircle sx={{ color: "#9D44C0" }} />
                      </InputAdornment>
                    ),
                  }}
                  InputLabelProps={{
                    sx: { 
                      color: "#C0C0C0",
                      fontFamily: "'Poppins', sans-serif",
                    },
                  }}
                />
              </Slide>

              <Slide direction="up" in={showForm} timeout={1000} style={{ transitionDelay: '400ms' }}>
                <TextField
                  fullWidth
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  variant="filled"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  sx={{
                    mb: 4,
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
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockOutlined sx={{ color: "#9D44C0" }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          sx={{ color: "#9D44C0" }}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  InputLabelProps={{
                    sx: { 
                      color: "#C0C0C0",
                      fontFamily: "'Poppins', sans-serif",
                    },
                  }}
                />
              </Slide>

              <Slide direction="up" in={showForm} timeout={1000} style={{ transitionDelay: '600ms' }}>
                <Button
                  fullWidth
                  variant="contained"
                  disabled={loading}
                  sx={{
                    py: 2,
                    mt: 2,
                    background: "linear-gradient(45deg, #9D44C0 0%, #6C3483 100%)",
                    fontWeight: "500",
                    letterSpacing: "2px",
                    fontSize: "1.1rem",
                    borderRadius: "12px",
                    fontFamily: "'Poppins', sans-serif",
                    color: "#FFFFFF",
                    boxShadow: "0 4px 20px rgba(157, 68, 192, 0.3)",
                    border: "none",
                    "&:hover": {
                      background: "linear-gradient(45deg, #8E24AA 0%, #6A1B9A 100%)",
                      transform: "translateY(-2px)",
                      boxShadow: "0 6px 25px rgba(157, 68, 192, 0.5)",
                    },
                    "&:active": {
                      transform: "translateY(1px)",
                      boxShadow: "0 2px 10px rgba(157, 68, 192, 0.4)",
                    },
                    transition: "all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                  }}
                  onClick={handleLogin}
                >
                  {loading ? (
                    <CircularProgress size={24} sx={{ color: "#FFFFFF" }} />
                  ) : (
                    "ACCESS DASHBOARD"
                  )}
                </Button>
              </Slide>
              
              <Fade in={showForm} timeout={2000}>
                <Box sx={{ mt: 4, textAlign: "center" }}>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "rgba(255,255,255,0.6)",
                      fontFamily: "'Poppins', sans-serif",
                      fontSize: "0.9rem",
                      cursor: "pointer",
                      "&:hover": { color: "#9D44C0" },
                      transition: "color 0.3s ease",
                    }}
                  >
                    Forgot Password?
                  </Typography>
                </Box>
              </Fade>
            </Paper>
          </Fade>
        </Box>
      </Container>
      
      {/* Error Notification */}
      <Snackbar 
        open={showError} 
        autoHideDuration={6000} 
        onClose={() => setShowError(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setShowError(false)} 
          severity="error" 
          variant="filled"
          sx={{ 
            width: '100%',
            fontFamily: "'Poppins', sans-serif",
            bgcolor: '#9D44C0',
            color: 'white'
          }}
        >
          {error}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Login;