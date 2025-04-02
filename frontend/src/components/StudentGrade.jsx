import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Paper,
  Typography,
  Box,
  Fade,
  CircularProgress,
  IconButton
} from "@mui/material";
import { School, ArrowBack } from "@mui/icons-material";

const StudentGrade = () => {
  const { submissionId } = useParams();
  const [grade, setGrade] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = new URLSearchParams(window.location.search).get('token');

  useEffect(() => {
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

          .gradient-bg {
            background: linear-gradient(-45deg, #1a0033, #2a0944, #3b185f, #240046);
            background-size: 400% 400%;
            animation: gradientFlow 15s ease infinite;
          }

          .neon-glow {
            box-shadow: 0 0 30px rgba(157, 68, 192, 0.3);
            transition: all 0.4s ease;
          }
        `}
      </style>

      <Container
        maxWidth={false}
        sx={{
          minHeight: "100vh",
          minWidth: "100vw",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 0,
          margin: 0,
          backgroundColor: "#0a0013",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            width: "100%",
            height: "100%",
            overflow: "hidden",
            zIndex: 0,
          }}
        >
          {[...Array(15)].map((_, index) => (
            <Box
              key={index}
              sx={{
                position: "absolute",
                borderRadius: "50%",
                background: "rgba(157, 68, 192, 0.1)",
                width: `${Math.random() * 15 + 5}px`,
                height: `${Math.random() * 15 + 5}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.5 + 0.3,
                animation: "float 6s ease infinite",
                animationDelay: `${Math.random() * 4}s`,
              }}
            />
          ))}
        </Box>

        <Fade in={true} timeout={1000}>
          <Paper
            elevation={24}
            sx={{
              width: "90%",
              maxWidth: "600px",
              backgroundColor: "rgba(26, 0, 51, 0.85)",
              borderRadius: "24px",
              border: "1px solid rgba(157, 68, 192, 0.4)",
              position: "relative",
              overflow: "hidden",
              zIndex: 2,
              backdropFilter: "blur(10px)",
            }}
            className="neon-glow"
          >
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
            
            <Box 
              sx={{ 
                p: 4, 
                textAlign: "center",
                borderBottom: "1px solid rgba(157, 68, 192, 0.4)"
              }}
            >
              <School 
                sx={{ 
                  fontSize: 64, 
                  color: "#9D44C0", 
                  mb: 2,
                  filter: "drop-shadow(0 0 8px rgba(157, 68, 192, 0.5))",
                  animation: "float 6s ease-in-out infinite",
                }} 
              />
              <Typography
                variant="h4"
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

            <Box sx={{ p: 4, textAlign: "center" }}>
              {loading ? (
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <CircularProgress 
                    size={60}
                    thickness={4}
                    sx={{ color: "#9D44C0", mb: 2 }}
                  />
                  <Typography
                    variant="body1"
                    sx={{
                      color: "rgba(255, 255, 255, 0.7)",
                      fontFamily: "'Poppins', sans-serif",
                    }}
                  >
                    Fetching your grade...
                  </Typography>
                </Box>
              ) : (
                <Fade in={true} timeout={500}>
                  <Typography
                    variant="h2"
                    sx={{
                      color: grade?.mark !== undefined ? "#9D44C0" : "rgba(255,255,255,0.5)",
                      fontFamily: "'Poppins', sans-serif",
                      fontWeight: 600,
                      fontSize: "3.5rem",
                      textShadow: grade?.mark !== undefined ? "0 0 15px rgba(157, 68, 192, 0.5)" : "none",
                    }}
                  >
                    {grade?.mark !== undefined ? grade.mark : '--'}
                    <Typography
                      variant="body1"
                      component="span"
                      sx={{
                        color: "rgba(255,255,255,0.7)",
                        fontSize: "1.2rem",
                        display: "block",
                        mt: 1,
                      }}
                    >
                      {grade?.mark !== undefined ? "Points Achieved" : "Not Graded Yet"}
                    </Typography>
                  </Typography>
                </Fade>
              )}
            </Box>
          </Paper>
        </Fade>
      </Container>
    </>
  );
};

export default StudentGrade;