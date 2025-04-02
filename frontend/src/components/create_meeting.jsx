import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Container,
  Paper,
  Typography,
  Box,
  Fade,
  TextField,
  Button,
  IconButton,
  CircularProgress,
  Divider,
} from "@mui/material";
import {
  ArrowBack,
  CalendarMonth,
  Google,
  VideoCall,
  Notifications,
  Link as LinkIcon,
} from "@mui/icons-material";

export default function GoogleCalendarAuth() {
  const navigate = useNavigate();
  const [meetingLink, setMeetingLink] = useState("");
  const [courseId, setCourseId] = useState("");
  const [assignmentId, setAssignmentId] = useState("");
  const [loading, setLoading] = useState(false);
  const [showContent, setShowContent] = useState(true);
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const token = params.get("token");

  const startAuth = () => {
    setLoading(true);
    window.location.href = "http://127.0.0.1:8000/auth";
  };

  const createEvent = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://127.0.0.1:8000/create-event");
      const data = await response.json();

      if (data.meet_link) {
        setMeetingLink(data.meet_link);
        setTimeout(() => {
          alert(`Google Meet link generated successfully!`);
        }, 500);
      } else {
        alert("Failed to create event. Please log in first.");
      }
    } catch (error) {
      console.error("Error creating event:", error);
      alert("Error creating event. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const notifyStudents = async () => {
    if (!courseId) {
      alert("Please enter a Course ID");
      return;
    }
    if (!meetingLink) {
      alert("Please create a meeting first");
      return;
    }
    
    try {
      setLoading(true);
      const response = await axios.get(
        `http://127.0.0.1:8000/notify_all_meet/${courseId}?meet_link=${encodeURIComponent(meetingLink)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(`${response.data.status}`);
      setTimeout(() => {
        alert("Students notified successfully!");
      }, 500);
    } catch (error) {
      console.error("Error notifying students:", error);
      alert("Error notifying students. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAttendance = async () => {
    navigate(`/attendance/${courseId}/${token}`);
  }

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
          
          .input-container {
            position: relative;
            margin-bottom: 24px;
            transition: all 0.3s ease;
          }
          
          .input-container:hover {
            transform: translateY(-2px);
          }
          
          .input-icon {
            position: absolute;
            top: 16px;
            left: 16px;
            color: rgba(157, 68, 192, 0.7);
          }
          
          .action-button {
            background-color: rgba(157, 68, 192, 0.15);
            color: #FFFFFF;
            border-radius: 16px;
            padding: 16px;
            width: 100%;
            text-align: center;
            transition: all 0.3s ease;
            font-family: 'Poppins', sans-serif;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            height: 56px;
            margin-bottom: 16px;
            font-weight: 500;
            letter-spacing: 0.5px;
          }
          
          .google-button {
            background-color: rgba(255, 255, 255, 0.1);
            color: #FFFFFF;
          }
          
          .google-button:hover {
            background-color: rgba(255, 255, 255, 0.2);
          }
          
          .meet-button {
            background-color: rgba(76, 175, 80, 0.2);
            color: #81C784;
          }
          
          .meet-button:hover {
            background-color: rgba(76, 175, 80, 0.3);
          }
          
          .notify-button {
            background-color: rgba(157, 68, 192, 0.2);
            color: #CE93D8;
          }
          
          .notify-button:hover {
            background-color: rgba(157, 68, 192, 0.3);
          }
          
          .link-container {
            background-color: rgba(33, 150, 243, 0.1);
            border-radius: 16px;
            padding: 16px;
            border: 1px dashed rgba(33, 150, 243, 0.3);
            display: flex;
            align-items: center;
            gap: 12px;
            margin-top: 24px;
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

        {/* Main Content */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
            zIndex: 2,
            padding: { xs: 2, md: 4 },
          }}
        >
          <Fade in={true} timeout={1000}>
            <Paper
              elevation={24}
              sx={{
                width: "100%",
                maxWidth: "600px",
                minHeight: "70vh",
                backgroundColor: "rgba(26, 0, 51, 0.85)",
                borderRadius: "24px",
                border: "1px solid rgba(157, 68, 192, 0.4)",
                position: "relative",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
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
                  background: "linear-gradient(90deg, #8E24AA 0%, #9D44C0 50%, #6C3483 100%)",
                }}
              />

              {/* Header */}
              <Box
                sx={{
                  padding: 4,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  borderBottom: "1px solid rgba(157, 68, 192, 0.2)",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <IconButton
                    sx={{ 
                      color: "#9D44C0", 
                      mr: 2,
                      "&:hover": {
                        backgroundColor: "rgba(157, 68, 192, 0.1)",
                      }
                    }}
                    onClick={() => navigate(-1)}
                  >
                    <ArrowBack />
                  </IconButton>
                  <CalendarMonth
                    sx={{
                      fontSize: 36,
                      color: "#9D44C0",
                      marginRight: 2,
                      filter: "drop-shadow(0 0 10px rgba(157, 68, 192, 0.5))",
                    }}
                  />
                  <Typography
                    variant="h4"
                    sx={{
                      color: "#FFFFFF",
                      fontFamily: "'Playfair Display', serif",
                      fontWeight: 600,
                      letterSpacing: "1px",
                    }}
                  >
                    Virtual Meeting
                  </Typography>
                </Box>
              </Box>

              {/* Form Content */}
              <Box
                sx={{
                  flex: 1,
                  overflow: "auto",
                  padding: 3,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Fade in={showContent} timeout={800}>
                  <Box>
                    <Typography
                      variant="h6"
                      sx={{
                        color: "#E0E0E0",
                        fontFamily: "'Poppins', sans-serif",
                        mb: 3,
                        textAlign: "center",
                      }}
                    >
                      Create and share virtual meeting links
                    </Typography>

                    {/* Course ID Input */}
                    <Box className="input-container" sx={{ position: "relative" }}>
                      <TextField
                        fullWidth
                        placeholder="Enter Course ID"
                        value={courseId}
                        onChange={(e) => setCourseId(e.target.value)}
                        variant="outlined"
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            color: "#E0E0E0",
                            fontFamily: "'Poppins', sans-serif",
                            backgroundColor: "rgba(26, 0, 51, 0.4)",
                            borderRadius: "16px",
                            pl: 5,
                            "& fieldset": {
                              borderColor: "rgba(157, 68, 192, 0.3)",
                            },
                            "&:hover fieldset": {
                              borderColor: "rgba(157, 68, 192, 0.5)",
                            },
                            "&.Mui-focused fieldset": {
                              borderColor: "#9D44C0",
                            },
                          },
                        }}
                        InputProps={{
                          startAdornment: (
                            <Box sx={{ position: "absolute", left: "16px", top: "16px" }}>
                              <CalendarMonth sx={{ color: "rgba(157, 68, 192, 0.7)" }} />
                            </Box>
                          ),
                        }}
                      />
                    </Box>

                    {/* Action Buttons */}
                    <Box sx={{ mt: 4 }}>
                      <Button
                        onClick={startAuth}
                        disabled={loading}
                        className="action-button google-button hover-scale"
                        sx={{
                          backgroundColor: "rgba(255, 255, 255, 0.1)",
                          color: "#FFFFFF",
                          "&:hover": {
                            backgroundColor: "rgba(255, 255, 255, 0.2)",
                          },
                        }}
                      >
                        {loading ? (
                          <CircularProgress size={24} sx={{ color: "#FFFFFF" }} />
                        ) : (
                          <>
                            <Google sx={{ mr: 1 }} />
                            Login with Google
                          </>
                        )}
                      </Button>

                      <Button
                        onClick={createEvent}
                        disabled={loading}
                        className="action-button meet-button hover-scale"
                        sx={{
                          backgroundColor: "rgba(76, 175, 80, 0.2)",
                          color: "#81C784",
                          "&:hover": {
                            backgroundColor: "rgba(76, 175, 80, 0.3)",
                          },
                        }}
                      >
                        {loading ? (
                          <CircularProgress size={24} sx={{ color: "#81C784" }} />
                        ) : (
                          <>
                            <VideoCall sx={{ mr: 1 }} />
                            Create Google Meet
                          </>
                        )}
                      </Button>

                      <Button
                        onClick={notifyStudents}
                        disabled={loading || !meetingLink || !courseId}
                        className="action-button notify-button hover-scale"
                        sx={{
                          backgroundColor: "rgba(157, 68, 192, 0.2)",
                          color: "#CE93D8",
                          "&:hover": {
                            backgroundColor: "rgba(157, 68, 192, 0.3)",
                          },
                        }}
                      >
                        {loading ? (
                          <CircularProgress size={24} sx={{ color: "#CE93D8" }} />
                        ) : (
                          <>
                            <Notifications sx={{ mr: 1 }} />
                            Notify Students
                          </>
                        )}
                      </Button>

                      <Button
                        onClick={handleAttendance}
                        disabled={loading}
                        className="action-button meet-button hover-scale"
                        sx={{
                          backgroundColor: "rgba(76, 175, 80, 0.2)",
                          color: "#81C784",
                          "&:hover": {
                            backgroundColor: "rgba(76, 175, 80, 0.3)",
                          },
                        }}
                      >
                        {loading ? (
                          <CircularProgress size={24} sx={{ color: "#81C784" }} />
                        ) : (
                          <>
                            Mark Attendance
                          </>
                        )}
                      </Button>


                    </Box>

                    {/* Meeting Link Display */}
                    {meetingLink && (
                      <Fade in={true} timeout={800}>
                        <Box className="link-container hover-scale">
                          <LinkIcon sx={{ color: "#64B5F6", fontSize: 28 }} />
                          <Box sx={{ flex: 1 }}>
                            <Typography
                              variant="subtitle2"
                              sx={{
                                color: "#90CAF9",
                                fontFamily: "'Poppins', sans-serif",
                                fontWeight: 500
                              }}
                            >
                              Meeting Link:
                            </Typography>
                            <Typography
                              component="a"
                              href={meetingLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              sx={{
                                color: "#E3F2FD",
                                fontFamily: "'Poppins', sans-serif",
                                textDecoration: "none",
                                wordBreak: "break-all",
                                display: "block",
                                "&:hover": {
                                  textDecoration: "underline",
                                },
                              }}
                            >
                              {meetingLink}
                            </Typography>
                          </Box>
                        </Box>
                      </Fade>
                    )}
                  </Box>
                </Fade>
              </Box>

              {/* Footer */}
              <Box
                sx={{
                  padding: 2,
                  display: "flex",
                  justifyContent: "center",
                  borderTop: "1px solid rgba(157, 68, 192, 0.2)",
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    color: "#BBBBBB",
                    fontFamily: "'Poppins', sans-serif",
                    opacity: 0.7,
                  }}
                >
                  Virtual Classroom Meeting Manager • {new Date().getFullYear()}
                </Typography>




              </Box>
            </Paper>
          </Fade>
        </Box>
      </Container>
    </>
  );

}