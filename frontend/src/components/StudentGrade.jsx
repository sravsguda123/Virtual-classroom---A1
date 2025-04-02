import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Paper,
  Typography,
  Box,
  Fade,
  CircularProgress,
  IconButton,
  Button,
  Slide
} from "@mui/material";
import { School, ArrowBack, Folder } from "@mui/icons-material";

const StudentGrade = () => {
  const { submissionId } = useParams();
  const [grade, setGrade] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const token = new URLSearchParams(window.location.search).get('token');
  const navigate = useNavigate();

  useEffect(() => {
    // Stagger animations for a more elegant entrance
    setTimeout(() => setShowContent(true), 500);
    
    const fetchGrade = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/my_mark/${submissionId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setGrade(response.data);
      } catch (error) {
        console.error('Error fetching grade:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchGrade();
  }, [submissionId, token]);

  const handleResources = () => {
    navigate("/resourses");
  };

  const handleBack = () => {
    navigate(-1);
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
          
          .pulse-animation {
            animation: pulse 3s infinite;
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

        {/* Main Grade Container */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
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
                maxWidth: "700px",
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
                  <IconButton 
                    onClick={handleBack}
                    sx={{ 
                      color: "#9D44C0",
                      mr: 1,
                      "&:hover": { 
                        background: "rgba(157, 68, 192, 0.2)",
                      }
                    }}
                  >
                    <ArrowBack />
                  </IconButton>
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
                    Submission Grade
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
              
              {/* Grade Display Area */}
              <Box sx={{ 
                p: 6, 
                display: "flex", 
                flexDirection: "column", 
                alignItems: "center",
                justifyContent: "center",
                minHeight: "300px"
              }}>
                {loading ? (
                  <Slide direction="up" in={showContent} timeout={800}>
                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                      <CircularProgress 
                        size={80}
                        thickness={4}
                        sx={{ 
                          color: "#9D44C0", 
                          mb: 3,
                          filter: "drop-shadow(0 0 10px rgba(157, 68, 192, 0.6))"
                        }}
                      />
                      <Typography
                        variant="h6"
                        sx={{
                          color: "rgba(255, 255, 255, 0.7)",
                          fontFamily: "'Poppins', sans-serif",
                          fontWeight: 300,
                          letterSpacing: "1px",
                          textAlign: "center"
                        }}
                      >
                        Fetching your grade...
                      </Typography>
                    </Box>
                  </Slide>
                ) : (
                  <Slide direction="up" in={!loading} timeout={800}>
                    <Box>
                      <Box 
                        sx={{ 
                          display: "flex", 
                          flexDirection: "column", 
                          alignItems: "center", 
                          justifyContent: "center",
                          mb: 4 
                        }}
                      >
                        <Typography
                          variant="h6"
                          sx={{
                            color: "rgba(255, 255, 255, 0.7)",
                            fontFamily: "'Poppins', sans-serif",
                            mb: 2,
                            textAlign: "center"
                          }}
                        >
                          Submission ID: {submissionId}
                        </Typography>
                        <Box 
                          sx={{ 
                            width: "160px", 
                            height: "160px", 
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            background: "linear-gradient(135deg, rgba(157, 68, 192, 0.2) 0%, rgba(108, 52, 131, 0.3) 100%)",
                            border: "2px solid rgba(157, 68, 192, 0.5)",
                            boxShadow: "0 0 20px rgba(157, 68, 192, 0.4)",
                            mb: 3,
                            position: "relative",
                            overflow: "hidden"
                          }}
                          className="pulse-animation"
                        >
                          <Typography
                            variant="h1"
                            sx={{
                              color: grade?.mark !== undefined ? "#FFFFFF" : "rgba(255,255,255,0.5)",
                              fontFamily: "'Poppins', sans-serif",
                              fontWeight: 600,
                              textShadow: grade?.mark !== undefined ? "0 0 15px rgba(157, 68, 192, 0.8)" : "none",
                              zIndex: 2
                            }}
                          >
                            {grade?.mark !== undefined ? grade.mark : '--'}
                          </Typography>
                          
                          {/* Decorative radial gradient behind the grade */}
                          <Box sx={{
                            position: "absolute",
                            width: "200%",
                            height: "200%",
                            background: "radial-gradient(circle, rgba(157, 68, 192, 0.3) 0%, rgba(26, 0, 51, 0) 70%)",
                            top: "-50%",
                            left: "-50%",
                            zIndex: 1
                          }} />
                        </Box>
                        
                        <Typography
                          variant="h5"
                          sx={{
                            color: "rgba(255,255,255,0.85)",
                            fontFamily: "'Playfair Display', serif",
                            fontWeight: 600,
                            textAlign: "center",
                            mb: 1
                          }}
                        >
                          {grade?.mark !== undefined ? "Points Achieved" : "Not Graded Yet"}
                        </Typography>
                        
                        {grade?.feedback && (
                          <Box 
                            sx={{ 
                              mt: 4, 
                              px: 3, 
                              py: 3, 
                              backgroundColor: "rgba(157, 68, 192, 0.15)", 
                              borderRadius: "12px",
                              border: "1px solid rgba(157, 68, 192, 0.3)",
                              maxWidth: "500px",
                              width: "100%"
                            }}
                          >
                            <Typography
                              variant="h6"
                              sx={{
                                color: "#9D44C0",
                                fontFamily: "'Poppins', sans-serif",
                                fontWeight: 500,
                                mb: 2
                              }}
                            >
                              Feedback
                            </Typography>
                            <Typography
                              variant="body1"
                              sx={{
                                color: "rgba(255, 255, 255, 0.8)",
                                fontFamily: "'Poppins', sans-serif",
                                lineHeight: 1.7
                              }}
                            >
                              {grade.feedback}
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    </Box>
                  </Slide>
                )}
              </Box>
            </Paper>
          </Fade>
        </Box>
      </Container>
    </>
  );
};

export default StudentGrade;