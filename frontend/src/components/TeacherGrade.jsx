import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Paper,
  Typography,
  Box,
  Fade,
  Slide,
  CircularProgress,
  IconButton,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Link
} from "@mui/material";
import { 
  School, 
  ArrowBack, 
  Folder, 
  Download, 
  Save, 
  CheckCircle
} from "@mui/icons-material";

const TeacherGrade = () => {
  const { assignmentId } = useParams();
  const [submissions, setSubmissions] = useState([]);
  const [grades, setGrades] = useState({});
  const [loading, setLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const [successMessage, setSuccessMessage] = useState({});
  const navigate = useNavigate();
  const token = new URLSearchParams(window.location.search).get('token');

  useEffect(() => {
    // Stagger animations for a more elegant entrance
    setTimeout(() => setShowContent(true), 500);
    
    const fetchSubmissions = async () => {
      try {
        // Changed endpoint to match the one in main.py
        const response = await axios.get(
          `http://127.0.0.1:8000/assignment_marks/${assignmentId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setSubmissions(response.data);
        
        // Initialize grades state with existing marks
        const initialGrades = {};
        response.data.forEach(sub => {
          if (sub.mark !== undefined) {
            initialGrades[sub._id] = sub.mark;
          }
        });
        setGrades(initialGrades);
      } catch (error) {
        console.error('Error fetching submissions:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSubmissions();
  }, [assignmentId, token]);

  const handleGradeChange = (submissionId, mark) => {
    setGrades(prev => ({ ...prev, [submissionId]: mark }));
    // Clear success message when grade is changed
    if (successMessage[submissionId]) {
      const newSuccessMessage = {...successMessage};
      delete newSuccessMessage[submissionId];
      setSuccessMessage(newSuccessMessage);
    }
  };

  const submitGrade = async (submissionId) => {
    try {
      // Create FormData to match the backend expectation
      const formData = new FormData();
      formData.append('submission_id', submissionId);
      formData.append('mark', grades[submissionId]);
      
      await axios.post(
        'http://127.0.0.1:8000/grade_submission',
        formData,
        { 
          headers: { 
            Authorization: `Bearer ${token}`,
            // Don't set Content-Type as axios will set it automatically for FormData
          } 
        }
      );
      // Set success message for this specific submission
      setSuccessMessage(prev => ({...prev, [submissionId]: true}));
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(prev => {
          const newState = {...prev};
          delete newState[submissionId];
          return newState;
        });
      }, 3000);
    } catch (error) {
      console.error('Error submitting grade:', error);
      alert('Failed to submit grade: ' + (error.response?.data?.detail || error.message));
    }
  };

  const handleResources = () => {
    navigate("/resourses");
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

          @keyframes fadeOut {
            0% { opacity: 1; }
            100% { opacity: 0; }
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

          .success-fade {
            animation: fadeOut 3s forwards;
          }

          /* Custom scrollbar for the table container */
          .submissions-table-container {
            scrollbar-width: thin;
            scrollbar-color: rgba(157, 68, 192, 0.5) rgba(26, 0, 51, 0.2);
          }

          .submissions-table-container::-webkit-scrollbar {
            width: 8px;
            height: 8px;
          }

          .submissions-table-container::-webkit-scrollbar-track {
            background: rgba(26, 0, 51, 0.2);
            border-radius: 10px;
          }

          .submissions-table-container::-webkit-scrollbar-thumb {
            background-color: rgba(157, 68, 192, 0.5);
            border-radius: 10px;
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

        {/* Main Container */}
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
                  <IconButton 
                    onClick={() => navigate(-1)}
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
                    Grade Submissions for Assignment {assignmentId}
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
              
              {/* Content Area */}
              <Box sx={{ p: 3, flex: 1, overflow: "hidden" }}>
                {loading ? (
                  <Box sx={{ 
                    display: "flex", 
                    flexDirection: "column", 
                    alignItems: "center", 
                    justifyContent: "center",
                    height: "100%"
                  }}>
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
                      Loading submissions...
                    </Typography>
                  </Box>
                ) : (
                  <Slide direction="up" in={showContent} timeout={800}>
                    <Box>
                      {submissions.length === 0 ? (
                        <Box sx={{ 
                          display: "flex", 
                          flexDirection: "column", 
                          alignItems: "center",
                          justifyContent: "center",
                          height: "50vh"
                        }}>
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
                            No submissions available for this assignment.
                          </Typography>
                        </Box>
                      ) : (
                        <TableContainer 
                          sx={{ 
                            maxHeight: "calc(100vh - 240px)",
                            backgroundColor: "rgba(26, 0, 51, 0.5)",
                            borderRadius: "14px",
                            border: "1px solid rgba(157, 68, 192, 0.3)",
                          }}
                          className="submissions-table-container"
                        >
                          <Table stickyHeader>
                            <TableHead>
                              <TableRow>
                                <TableCell 
                                  sx={{ 
                                    backgroundColor: "rgba(26, 0, 51, 0.95)",
                                    color: "#9D44C0",
                                    fontFamily: "'Poppins', sans-serif",
                                    fontWeight: 600,
                                    borderBottom: "2px solid rgba(157, 68, 192, 0.4)",
                                  }}
                                >
                                  Student ID
                                </TableCell>
                                <TableCell 
                                  sx={{ 
                                    backgroundColor: "rgba(26, 0, 51, 0.95)",
                                    color: "#9D44C0",
                                    fontFamily: "'Poppins', sans-serif",
                                    fontWeight: 600,
                                    borderBottom: "2px solid rgba(157, 68, 192, 0.4)",
                                  }}
                                >
                                  Submission
                                </TableCell>
                                <TableCell 
                                  sx={{ 
                                    backgroundColor: "rgba(26, 0, 51, 0.95)",
                                    color: "#9D44C0",
                                    fontFamily: "'Poppins', sans-serif",
                                    fontWeight: 600,
                                    borderBottom: "2px solid rgba(157, 68, 192, 0.4)",
                                  }}
                                >
                                  Grade
                                </TableCell>
                                <TableCell 
                                  sx={{ 
                                    backgroundColor: "rgba(26, 0, 51, 0.95)",
                                    color: "#9D44C0",
                                    fontFamily: "'Poppins', sans-serif",
                                    fontWeight: 600,
                                    borderBottom: "2px solid rgba(157, 68, 192, 0.4)",
                                  }}
                                >
                                  Action
                                </TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {submissions.map((submission) => (
                                <TableRow 
                                  key={submission._id}
                                  sx={{ 
                                    '&:hover': { 
                                      backgroundColor: 'rgba(157, 68, 192, 0.1)' 
                                    },
                                    transition: 'background-color 0.3s ease'
                                  }}
                                >
                                  <TableCell 
                                    sx={{ 
                                      color: "#E0E0E0",
                                      fontFamily: "'Poppins', sans-serif",
                                      borderBottom: "1px solid rgba(157, 68, 192, 0.2)",
                                    }}
                                  >
                                    {submission.student_id}
                                  </TableCell>
                                  <TableCell
                                    sx={{ 
                                      color: "#E0E0E0",
                                      fontFamily: "'Poppins', sans-serif",
                                      borderBottom: "1px solid rgba(157, 68, 192, 0.2)",
                                    }}
                                  >
                                    {submission.file_id && (
                                      <Button
                                        startIcon={<Download />}
                                        href={`http://127.0.0.1:8000/download/${submission.file_id}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        sx={{
                                          color: "#9D44C0",
                                          fontFamily: "'Poppins', sans-serif",
                                          textTransform: "none",
                                          '&:hover': {
                                            backgroundColor: 'rgba(157, 68, 192, 0.1)',
                                            textDecoration: "underline"
                                          }
                                        }}
                                      >
                                        Download File
                                      </Button>
                                    )}
                                    {submission.text_content && (
                                      <Typography
                                        sx={{
                                          color: "rgba(255, 255, 255, 0.9)",
                                          fontFamily: "'Poppins', sans-serif",
                                          padding: "10px",
                                          backgroundColor: "rgba(157, 68, 192, 0.05)",
                                          borderRadius: "8px",
                                          border: "1px solid rgba(157, 68, 192, 0.2)",
                                          mt: !submission.file_id ? 0 : 2,
                                          maxHeight: "100px",
                                          overflow: "auto",
                                        }}
                                      >
                                        {submission.text_content}
                                      </Typography>
                                    )}
                                  </TableCell>
                                  <TableCell
                                    sx={{ 
                                      color: "#E0E0E0",
                                      fontFamily: "'Poppins', sans-serif",
                                      borderBottom: "1px solid rgba(157, 68, 192, 0.2)",
                                      minWidth: "120px"
                                    }}
                                  >
                                    <TextField
                                      type="number"
                                      value={grades[submission._id] || ''}
                                      onChange={(e) => handleGradeChange(submission._id, e.target.value)}
                                      variant="outlined"
                                      size="small"
                                      sx={{
                                        width: "100px",
                                        "& .MuiOutlinedInput-root": {
                                          color: "#E0E0E0",
                                          fontFamily: "'Poppins', sans-serif",
                                          backgroundColor: "rgba(255, 255, 255, 0.05)",
                                          "& fieldset": {
                                            borderColor: "rgba(157, 68, 192, 0.5)",
                                          },
                                          "&:hover fieldset": {
                                            borderColor: "rgba(157, 68, 192, 0.8)",
                                          },
                                          "&.Mui-focused fieldset": {
                                            borderColor: "#9D44C0",
                                          },
                                        },
                                        "& .MuiInputLabel-root": {
                                          color: "rgba(255, 255, 255, 0.7)",
                                        }
                                      }}
                                      InputProps={{
                                        inputProps: {
                                          min: 0,
                                          style: { textAlign: 'center' }
                                        }
                                      }}
                                    />
                                  </TableCell>
                                  <TableCell
                                    sx={{ 
                                      color: "#E0E0E0",
                                      fontFamily: "'Poppins', sans-serif",
                                      borderBottom: "1px solid rgba(157, 68, 192, 0.2)",
                                      position: "relative"
                                    }}
                                  >
                                    {successMessage[submission._id] ? (
                                      <Box 
                                        sx={{ 
                                          display: "flex", 
                                          alignItems: "center",
                                          color: "#4CAF50" 
                                        }}
                                        className="success-fade"
                                      >
                                        <CheckCircle sx={{ mr: 1 }} />
                                        <Typography>
                                          Saved!
                                        </Typography>
                                      </Box>
                                    ) : (
                                      <Button
                                        startIcon={<Save />}
                                        onClick={() => submitGrade(submission._id)}
                                        variant="contained"
                                        disabled={!grades[submission._id]}
                                        sx={{
                                          background: "linear-gradient(45deg, #9D44C0 0%, #6C3483 100%)",
                                          fontFamily: "'Poppins', sans-serif",
                                          borderRadius: "8px",
                                          textTransform: "none",
                                          "&:hover": {
                                            background: "linear-gradient(45deg, #8E24AA 0%, #6A1B9A 100%)",
                                            boxShadow: "0 4px 8px rgba(157, 68, 192, 0.5)",
                                          },
                                          "&.Mui-disabled": {
                                            background: "rgba(157, 68, 192, 0.2)",
                                            color: "rgba(255, 255, 255, 0.4)"
                                          }
                                        }}
                                      >
                                        Submit Grade
                                      </Button>
                                    )}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      )}
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

export default TeacherGrade;