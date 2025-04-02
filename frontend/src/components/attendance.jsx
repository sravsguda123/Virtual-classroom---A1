import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Slide,
  Fade,
  CircularProgress,
  Snackbar,
  Alert,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Avatar,
  Divider,
} from "@mui/material";
import {
  School,
  CheckCircle,
  Cancel,
  PeopleAlt,
  Refresh,
  CheckBox,
  Save,
} from "@mui/icons-material";

const Attendance = () => {
  const { courseId, token } = useParams(); // ✅ Extract values from the URL path
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [showError, setShowError] = useState(false);
  const [success, setSuccess] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  
  // Animation states
  const [showContent, setShowContent] = useState(false);
  
  useEffect(() => {
    // Stagger animations for a more elegant entrance
    setTimeout(() => setShowContent(true), 500);
  }, []);

  const handleGetStudents = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/students_in_courses/${courseId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // ✅ Ensure token is correctly passed
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Response data:", response.data.students); // Log the response data
      setStudents(response.data.students);
      setSuccess("Students loaded successfully");
      setShowSuccess(true);
    } catch (error) {
      console.error("Error fetching students:", error);
      setError("Failed to fetch students. Please try again.");
      setShowError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleAttendance = async (studentId, isPresent) => {
    if (!studentId) {
      console.error("Student ID is undefined or null");
      setError("Invalid student ID");
      setShowError(true);
      return;
    }
    if (isPresent === undefined || isPresent === null) {
      console.error("Attendance status is undefined or null");
      setError("Invalid attendance status");
      setShowError(true);
      return;
    } else {
      setSaving(true);
      console.log(`Student ID: ${studentId}, Present: ${isPresent}`); // Log the student ID and attendance status
      try {
        const response = await axios.post(
          `http://127.0.0.1:8000/attendance/${courseId}/${studentId}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`, // ✅ Ensure token is correctly passed
              "Content-Type": "application/json",
            },
          }
        );
        console.log("Attendance response:", response.data); // Log the attendance response
        setSuccess(`Attendance updated for student ${studentId}`);
        setShowSuccess(true);
      } catch (error) {
        console.error("Error updating attendance:", error);
        setError("Failed to update attendance. Please try again.");
        setShowError(true);
      } finally {
        setSaving(false);
      }
    }
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
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
          flexDirection: "column",
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

        {/* Header */}
        <Fade in={showContent} timeout={1000}>
          <Box
            sx={{
              width: "100%",
              padding: { xs: 2, md: 4 },
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              alignItems: "center",
              justifyContent: "space-between",
              zIndex: 2,
            }}
          >
            <Box sx={{ 
              display: "flex", 
              alignItems: "center", 
              mb: { xs: 2, md: 0 } 
            }}>
              <School 
                sx={{ 
                  fontSize: 40, 
                  color: "#9D44C0", 
                  mr: 2,
                  filter: "drop-shadow(0 0 10px rgba(157, 68, 192, 0.5))" 
                }} 
              />
              <Typography
                variant="h4"
                sx={{
                  color: "#FFFFFF",
                  fontFamily: "'Playfair Display', serif",
                  fontWeight: 600,
                  letterSpacing: "2px",
                  textShadow: "0 0 20px rgba(157, 68, 192, 0.5)",
                }}
              >
                Virtual Classroom
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography
                variant="subtitle1"
                sx={{
                  color: "#E0E0E0",
                  fontFamily: "'Poppins', sans-serif",
                  mr: 2,
                }}
              >
                Course ID: {courseId}
              </Typography>
            </Box>
          </Box>
        </Fade>

        {/* Main Content */}
        <Box sx={{ 
          display: "flex", 
          flexDirection: "column", 
          alignItems: "center", 
          justifyContent: "center", 
          flex: 1,
          zIndex: 2,
        }}>
          <Slide direction="up" in={showContent} timeout={1000}>
            <Paper
              elevation={24}
              sx={{
                padding: { xs: 3, md: 5 },
                width: "90%",
                maxWidth: "1000px",
                backgroundColor: "rgba(26, 0, 51, 0.85)",
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
              
              <Box sx={{ textAlign: "center", mb: 4 }}>
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
                  Attendance Management
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: "#BBBBBB",
                    fontFamily: "'Poppins', sans-serif",
                    fontWeight: 300,
                  }}
                >
                  Track and manage student attendance for your course
                </Typography>
              </Box>

              <Box sx={{ 
                display: "flex", 
                justifyContent: "center", 
                mb: 4 
              }}>
                <Button
                  variant="contained"
                  startIcon={<PeopleAlt />}
                  disabled={loading}
                  onClick={handleGetStudents}
                  sx={{
                    py: 1.5,
                    px: 4,
                    background: "linear-gradient(45deg, #9D44C0 0%, #6C3483 100%)",
                    fontWeight: "500",
                    letterSpacing: "1px",
                    fontSize: "1rem",
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
                    mr: 2
                  }}
                >
                  {loading ? (
                    <CircularProgress size={24} sx={{ color: "#FFFFFF" }} />
                  ) : (
                    "Load Students"
                  )}
                </Button>
              </Box>

              <Divider sx={{ 
                my: 4, 
                backgroundColor: "rgba(157, 68, 192, 0.3)",
                width: "100%"
              }} />

              <TableContainer 
                component={Paper} 
                sx={{ 
                  backgroundColor: "rgba(26, 0, 51, 0.5)",
                  borderRadius: "16px",
                  border: "1px solid rgba(157, 68, 192, 0.2)",
                  boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
                  mb: 4
                }}
              >
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell 
                        sx={{ 
                          color: "#FFFFFF",
                          fontFamily: "'Poppins', sans-serif",
                          fontWeight: 600,
                          fontSize: "1.1rem",
                          borderBottom: "1px solid rgba(157, 68, 192, 0.3)",
                          paddingY: 2
                        }}
                      >
                        Student
                      </TableCell>
                      <TableCell 
                        align="center"
                        sx={{ 
                          color: "#FFFFFF",
                          fontFamily: "'Poppins', sans-serif",
                          fontWeight: 600,
                          fontSize: "1.1rem",
                          borderBottom: "1px solid rgba(157, 68, 192, 0.3)",
                          paddingY: 2
                        }}
                      >
                        Present
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {students.length > 0 ? (
                      students.map((student) => (
                        <TableRow key={student} sx={{ 
                          '&:hover': { 
                            backgroundColor: 'rgba(157, 68, 192, 0.1)' 
                          } 
                        }}>
                          <TableCell 
                            sx={{ 
                              color: "#E0E0E0",
                              fontFamily: "'Poppins', sans-serif",
                              borderBottom: "1px solid rgba(157, 68, 192, 0.2)",
                              display: "flex",
                              alignItems: "center",
                              gap: 2
                            }}
                          >
                            <Avatar 
                              sx={{ 
                                bgcolor: "#9D44C0", 
                                color: "#fff",
                                fontFamily: "'Poppins', sans-serif",
                                fontWeight: 500,
                                boxShadow: "0 0 10px rgba(157, 68, 192, 0.5)"
                              }}
                            >
                              {getInitials(student)}
                            </Avatar>
                            {student}
                          </TableCell>
                          <TableCell 
                            align="center"
                            sx={{ 
                              color: "#E0E0E0",
                              fontFamily: "'Poppins', sans-serif",
                              borderBottom: "1px solid rgba(157, 68, 192, 0.2)"
                            }}
                          >
                            <Checkbox 
                              onChange={(e) => handleAttendance(student, e.target.checked)}
                              sx={{
                                color: "#9D44C0",
                                '&.Mui-checked': {
                                  color: "#9D44C0",
                                },
                                '& .MuiSvgIcon-root': {
                                  fontSize: 28,
                                }
                              }}
                            />
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell 
                          colSpan={2} 
                          align="center"
                          sx={{ 
                            color: "#BBBBBB",
                            fontFamily: "'Poppins', sans-serif",
                            fontStyle: "italic",
                            py: 4
                          }}
                        >
                          No students loaded. Click "Load Students" to view the class roster.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Slide>
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
      
      {/* Success Notification */}
      <Snackbar 
        open={showSuccess} 
        autoHideDuration={6000} 
        onClose={() => setShowSuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setShowSuccess(false)} 
          severity="success" 
          variant="filled"
          sx={{ 
            width: '100%',
            fontFamily: "'Poppins', sans-serif",
            bgcolor: '#6C3483',
            color: 'white'
          }}
        >
          {success}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Attendance;
