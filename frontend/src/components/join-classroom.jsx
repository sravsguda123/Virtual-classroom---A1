
import React, { useState, useEffect } from "react";
import axios from "axios";

import { useNavigate, useLocation, Link } from "react-router-dom";
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  AppBar,
  Toolbar,
  Avatar,
  Paper,
  Card,
  CardContent,
  IconButton,
  Divider,
  Tooltip,
  Snackbar,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from "@mui/material";
import {
  Notifications,
  Assignment,
  Book,
  Logout,
  School,
  ArrowForward,
  GradingOutlined,
  AssignmentOutlined,
} from "@mui/icons-material";

const JoinClassroom = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const token = params.get("token") || localStorage.getItem("token");
  const [classroomId, setClassroomId] = useState("");
  const [student_id, setStudentId] = useState("");
  const [message, setMessage] = useState("");
  const [showMessage, setShowMessage] = useState(false);
  const [studentData, setStudentData] = useState({
    name: "John Smith",
    id: "ST12345",
    department: "Computer Science",
    year: "3rd Year",
    email: "john.smith@university.edu",
  });
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [enrolledCourses, setEnrolledCourses] = useState([]);

  // Demo function to fetch student data
  useEffect(() => {
    // This would be replaced with an actual API call in production
    const fetchStudentData = async () => {
      // const token = localStorage.getItem("token");
      if (token) {
        // Mock data for now
        // In production: const response = await axios.get("http://127.0.0.1:8000/student_profile", {...})
      }
    };
    fetchStudentData();
  }, []);

  // Fetch student submissions
  useEffect(() => {
    const fetchSubmissions = async () => {
     
      if (token) {
        setLoading(true);
        try {
          const response = await axios.get(
            "http://127.0.0.1:8000/my_submissions",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setSubmissions(response.data);
        } catch (error) {
          console.error("Error fetching submissions:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchSubmissions();
  }, []);

  const handleJoinClassroom = async (classId = classroomId) => {
    

    if (!token) {
      setMessage("You are not authorized to join a classroom.");
      setShowMessage(true);
      return;
    }

  

    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/join_classroom`,
        { class_id: classId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setMessage(response.data.message || "Successfully joined the course!");
      setShowMessage(true);
      setClassroomId("");
      navigate(`/chatroom/${classId}?token=${token}`);
    } catch (error) {
      console.error(error);
      setMessage(error.response?.data?.message || "Failed to join classroom. Check the course ID.");
      setShowMessage(true);
    }
  };

  const navigateTo = (path) => {
    
    if (!token) {
      setMessage("You are not authorized to access this feature.");
      setShowMessage(true);
      return;
    }
    navigate(`${path}?token=${token}`);
  };

  const handleSignOut = () => {
    
    navigate("/");
  };

  const viewGrade = (submissionId) => {
    if (token) {
      navigate(`/grade_view/${submissionId}?token=${token}`);
    }
  };
  const handleEnrolledCourses = async () => {
    try{
    const response = await axios.get(`http://127.0.0.1:8000/courses_in_student`,{
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(response.data);
    console.log(response.data.courses);
    setEnrolledCourses(response.data.courses);
  }catch (error) {
    console.error("Error fetching enrolled courses:", error);
  }
    

  }

  return (
    <>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Poppins:wght@300;400;500;600&display=swap');
          
          html, body, #root {
            margin: 0;
            padding: 0;
            width: 100%;
            height: 100%;
            overflow-x: hidden;
          }
          
          body {
            margin: 0;
            padding: 0;
            background-color: #0a0013;
            min-height: 100vh;
            width: 100vw;
          }
          
          @keyframes gradientFlow {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          
          .gradient-bg {
            background: linear-gradient(-45deg, #1a0033, #2a0944, #3b185f, #240046);
            background-size: 400% 400%;
            animation: gradientFlow 15s ease infinite;
          }
          
          .profile-card {
            transition: all 0.3s ease;
            border: 1px solid rgba(157, 68, 192, 0.4);
          }
          
          .profile-card:hover {
            box-shadow: 0 0 30px rgba(157, 68, 192, 0.3);
            transform: translateY(-5px);
          }
          
          .nav-button {
            transition: all 0.3s ease;
          }
          
          .nav-button:hover {
            background-color: rgba(157, 68, 192, 0.2);
            transform: translateY(-2px);
          }
          
          .grade-card {
            transition: all 0.3s ease;
            border: 1px solid rgba(157, 68, 192, 0.4);
          }
          
          .grade-card:hover {
            box-shadow: 0 0 15px rgba(157, 68, 192, 0.3);
            transform: translateY(-3px);
          }
          
          .grade-item {
            transition: all 0.3s ease;
            border-radius: 8px;
          }
          
          .grade-item:hover {
            background-color: rgba(157, 68, 192, 0.1);
          }
        `}
      </style>

      {/* App Bar */}
      <AppBar 
        position="static" 
        sx={{ 
          backgroundColor: "rgba(26, 0, 51, 0.95)",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.5)",
          width: "100%"
        }}
      >
        <Toolbar>
          {/* Logo */}
          <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
            <School 
              sx={{ 
                fontSize: 36, 
                color: "#9D44C0", 
                mr: 1,
                filter: "drop-shadow(0 0 10px rgba(157, 68, 192, 0.5))" 
              }} 
            />
            <Typography
              variant="h6"
              component="div"
              sx={{
                fontFamily: "'Playfair Display', serif",
                fontWeight: 600,
                letterSpacing: "1px",
                color: "#FFFFFF",
                display: { xs: "none", sm: "block" },
                textShadow: "0 0 10px rgba(157, 68, 192, 0.3)",
              }}
            >
              Virtual Classroom
            </Typography>
          </Box>

          {/* Navigation Buttons */}
          <Box sx={{ display: "flex" }}>
            <Tooltip title="Notifications">
              <IconButton 
                className="nav-button"
                color="inherit" 
                onClick={() => navigateTo("/notifications")}
                sx={{ 
                  color: "#E0E0E0",
                  mx: { xs: 0.5, md: 1 } 
                }}
              >
                <Notifications />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="My Grades">
              <IconButton 
                className="nav-button"
                color="inherit" 
                onClick={() => navigateTo("/my-submissions")}
                sx={{ 
                  color: "#E0E0E0",
                  mx: { xs: 0.5, md: 1 } 
                }}
              >
                <GradingOutlined />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Resources">
              <IconButton 
                className="nav-button"
                color="inherit" 
                onClick={() => navigateTo("/resourses")}
                sx={{ 
                  color: "#E0E0E0",
                  mx: { xs: 0.5, md: 1 } 
                }}
              >
                <Book />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Sign Out">
              <IconButton 
                className="nav-button"
                color="inherit" 
                onClick={handleSignOut}
                sx={{ 
                  color: "#E0E0E0",
                  mx: { xs: 0.5, md: 1 } 
                }}
              >
                <Logout />
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>

      <Container 
        maxWidth={false}
        className="gradient-bg"
        sx={{ 
          minHeight: "calc(100vh - 64px)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          py: 5,
          width: "100%",
          px: 0
        }}
      >
        {/* Student Profile Section */}
        <Paper 
          elevation={6}
          className="profile-card"
          sx={{
            p: { xs: 2, sm: 3, md: 4 },
            borderRadius: "20px",
            backgroundColor: "rgba(26, 0, 51, 0.8)",
            backdropFilter: "blur(10px)",
            mb: 5,
            width: "90%",
            maxWidth: "800px"
          }}
        >
          <Box 
            sx={{ 
              display: "flex", 
              flexDirection: { xs: "column", sm: "row" },
              alignItems: { xs: "center", sm: "flex-start" },
              gap: 3
            }}
          >
            {/* Student Photo */}
            <Avatar
              sx={{
                width: { xs: 100, sm: 120, md: 150 },
                height: { xs: 100, sm: 120, md: 150 },
                border: "4px solid rgba(157, 68, 192, 0.6)",
                boxShadow: "0 0 20px rgba(157, 68, 192, 0.4)",
              }}
              alt={studentData.name}
              src="/api/placeholder/150/150"
            />
            
            {/* Student Details */}
            <Box sx={{ flexGrow: 1 }}>
              <Typography 
                variant="h4" 
                sx={{ 
                  color: "#FFFFFF",
                  fontFamily: "'Playfair Display', serif",
                  fontWeight: 600,
                  mb: 1,
                  textAlign: { xs: "center", sm: "left" },
                }}
              >
                {studentData.name}
              </Typography>
              
              <Divider sx={{ my: 1.5, backgroundColor: "rgba(157, 68, 192, 0.4)" }} />
              
              <Box sx={{ 
                display: "grid", 
                gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                gap: 2
              }}>
                <Box>
                  <Typography 
                    variant="subtitle2" 
                    sx={{ 
                      color: "#9D44C0",
                      fontFamily: "'Poppins', sans-serif",
                      fontWeight: 500
                    }}
                  >
                    Student ID
                  </Typography>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      color: "#E0E0E0",
                      fontFamily: "'Poppins', sans-serif"
                    }}
                  >
                    {studentData.id}
                  </Typography>
                </Box>
                
                <Box>
                  <Typography 
                    variant="subtitle2" 
                    sx={{ 
                      color: "#9D44C0",
                      fontFamily: "'Poppins', sans-serif",
                      fontWeight: 500
                    }}
                  >
                    Department
                  </Typography>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      color: "#E0E0E0",
                      fontFamily: "'Poppins', sans-serif"
                    }}
                  >
                    {studentData.department}
                  </Typography>
                </Box>
                
                <Box>
                  <Typography 
                    variant="subtitle2" 
                    sx={{ 
                      color: "#9D44C0",
                      fontFamily: "'Poppins', sans-serif",
                      fontWeight: 500
                    }}
                  >
                    Year
                  </Typography>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      color: "#E0E0E0",
                      fontFamily: "'Poppins', sans-serif"
                    }}
                  >
                    {studentData.year}
                  </Typography>
                </Box>
                
                <Box>
                  <Typography 
                    variant="subtitle2" 
                    sx={{ 
                      color: "#9D44C0",
                      fontFamily: "'Poppins', sans-serif",
                      fontWeight: 500
                    }}
                  >
                    Email
                  </Typography>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      color: "#E0E0E0",
                      fontFamily: "'Poppins', sans-serif"
                    }}
                  >
                    {studentData.email}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Paper>
        
        {/* Recent Grades Section */}
        <Card 
          className="grade-card"
          sx={{
            borderRadius: "20px",
            backgroundColor: "rgba(26, 0, 51, 0.8)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(157, 68, 192, 0.4)",
            mb: 5,
            width: "90%",
            maxWidth: "800px"
          }}
        >
          <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
            <Typography 
              variant="h5" 
              sx={{ 
                color: "#FFFFFF",
                fontFamily: "'Playfair Display', serif",
                fontWeight: 600,
                mb: 3,
                display: "flex",
                alignItems: "center",
              }}
            >
              <GradingOutlined sx={{ mr: 1, color: "#9D44C0" }} />
              Recent Assignments & Grades
            </Typography>

            {loading ? (
              <Typography sx={{ color: "#E0E0E0", fontFamily: "'Poppins', sans-serif", textAlign: "center", py: 2 }}>
                Loading your submissions...
              </Typography>
            ) : submissions.length > 0 ? (
              <List sx={{ width: "100%" }}>
                {submissions.slice(0, 3).map((submission) => (
                  <ListItem 
                    key={submission._id}
                    className="grade-item"
                    sx={{ 
                      mb: 1.5, 
                      backgroundColor: "rgba(255,255,255,0.03)",
                      p: 2
                    }}
                    secondaryAction={
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => viewGrade(submission._id)}
                        sx={{
                          color: "#9D44C0",
                          borderColor: "rgba(157, 68, 192, 0.5)",
                          "&:hover": {
                            borderColor: "#9D44C0",
                            backgroundColor: "rgba(157, 68, 192, 0.1)",
                          },
                          fontFamily: "'Poppins', sans-serif",
                        }}
                      >
                        View Grade
                      </Button>
                    }
                  >
                    <ListItemIcon>
                      <AssignmentOutlined sx={{ color: "#9D44C0" }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography sx={{ color: "#FFFFFF", fontFamily: "'Poppins', sans-serif", fontWeight: 500 }}>
                          {submission.assignment_name || "Assignment"}
                        </Typography>
                      }
                      secondary={
                        <Typography sx={{ color: "rgba(255,255,255,0.7)", fontFamily: "'Poppins', sans-serif" }}>
                          Grade: {submission.mark !== undefined ? submission.mark : "Not graded yet"}
                        </Typography>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography sx={{ color: "#E0E0E0", fontFamily: "'Poppins', sans-serif", textAlign: "center", py: 2 }}>
                You haven't submitted any assignments yet.
              </Typography>
            )}

            {submissions.length > 0 && (
              <Box sx={{ textAlign: "center", mt: 2 }}>
                <Button
                  variant="text"
                  onClick={() => navigateTo("/my-submissions")}
                  sx={{
                    color: "#9D44C0",
                    fontFamily: "'Poppins', sans-serif",
                    "&:hover": {
                      backgroundColor: "rgba(157, 68, 192, 0.1)",
                    },
                  }}
                >
                  View All Submissions
                </Button>
              </Box>
            )}
          </CardContent>
        </Card>
        
        {/* Register Course Section */}
        <Card 
          sx={{
            borderRadius: "20px",
            backgroundColor: "rgba(26, 0, 51, 0.8)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(157, 68, 192, 0.4)",
            transition: "all 0.3s ease",
            "&:hover": {
              boxShadow: "0 0 30px rgba(157, 68, 192, 0.3)",
            },
            width: "90%",
            maxWidth: "800px"
          }}
        >
          <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
            <Typography 
              variant="h4" 
              sx={{ 
                color: "#FFFFFF",
                fontFamily: "'Playfair Display', serif",
                fontWeight: 600,
                mb: 3,
                textAlign: "center",
              }}
            >
              Register Course
            </Typography>
            
            <Box 
              sx={{ 
                display: "flex", 
                flexDirection: { xs: "column", sm: "row" },
                alignItems: "center",
                gap: 2
              }}
            >
              <TextField
                fullWidth
                label="Course ID"
                variant="filled"
                value={classroomId}
                onChange={(e) => setClassroomId(e.target.value)}
                placeholder="Enter Course ID"
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
                  "& .MuiInputLabel-root": {
                    color: "#C0C0C0",
                    fontFamily: "'Poppins', sans-serif",
                  }
                }}
              />
              
              <Button
                variant="contained"
                onClick={() => handleJoinClassroom()}
                sx={{
                  py: { xs: 1.5, sm: 2 },
                  px: { xs: 3, sm: 4 },
                  background: "linear-gradient(45deg, #9D44C0 0%, #6C3483 100%)",
                  fontWeight: "500",
                  letterSpacing: "1px",
                  fontSize: "1rem",
                  borderRadius: "12px",
                  fontFamily: "'Poppins', sans-serif",
                  color: "#FFFFFF",
                  boxShadow: "0 4px 20px rgba(157, 68, 192, 0.3)",
                  whiteSpace: "nowrap",
                  minWidth: { xs: "100%", sm: "auto" },
                  "&:hover": {
                    background: "linear-gradient(45deg, #8E24AA 0%, #6A1B9A 100%)",
                    transform: "translateY(-2px)",
                    boxShadow: "0 6px 25px rgba(157, 68, 192, 0.5)",
                  },
                  transition: "all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                }}
                endIcon={<ArrowForward />}
              >
                Register
              </Button>



              <Button
                variant="contained"
                onClick={handleEnrolledCourses}
                sx={{
                  py: { xs: 1.5, sm: 2 },
                  px: { xs: 3, sm: 4 },
                  background: "linear-gradient(45deg, #9D44C0 0%, #6C3483 100%)",
                  fontWeight: "500",
                  letterSpacing: "1px",
                  fontSize: "1rem",
                  borderRadius: "12px",
                  fontFamily: "'Poppins', sans-serif",
                  color: "#FFFFFF",
                  boxShadow: "0 4px 20px rgba(157, 68, 192, 0.3)",
                  whiteSpace: "nowrap",
                  minWidth: { xs: "100%", sm: "auto" },
                  "&:hover": {
                    background: "linear-gradient(45deg, #8E24AA 0%, #6A1B9A 100%)",
                    transform: "translateY(-2px)",
                    boxShadow: "0 6px 25px rgba(157, 68, 192, 0.5)",
                  },
                  transition: "all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                }}
                endIcon={<ArrowForward />}
              >
                See Enrolled Courses
              </Button>
              

            </Box>
            
            <Typography
              variant="body2"
              sx={{
                color: "rgba(255,255,255,0.6)",
                fontFamily: "'Poppins', sans-serif",
                fontSize: "0.9rem",
                mt: 2,
                textAlign: "center"
              }}
            >
              <Box sx={{ 
  width: '100%', 
  display: 'flex',
  flexDirection: 'column',
  gap: 2, // adds space between items
}}>
  {enrolledCourses.length > 0 ? (
    enrolledCourses.map((course, index) => (
      <Card key={index} sx={{ 
        color: "rgba(255,255,255,0.6)",
        
        p: 2, 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        borderRadius: 2,
        
        
        background: 'transparent',
      }}>
        <Typography variant="body1">{course}</Typography>
        <Button 
          variant="contained" 
          color="primary"
          size="small"
          sx={{
            py: { xs: 1.5, sm: 2 },
            px: { xs: 3, sm: 4 },
            background: "linear-gradient(45deg, #9D44C0 0%, #6C3483 100%)",
            fontWeight: "500",
            letterSpacing: "1px",
            fontSize: "1rem",
            borderRadius: "12px",
            fontFamily: "'Poppins', sans-serif",
            color: "#FFFFFF",
            boxShadow: "0 4px 10px rgba(157, 68, 192, 0.3)",
            whiteSpace: "nowrap",
            
            "&:hover": {
              background: "linear-gradient(45deg, #8E24AA 0%, #6A1B9A 100%)",
              transform: "translateY(-2px)",
              boxShadow: "0 6px 25px rgba(157, 68, 192, 0.5)",
            },
            transition: "all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
          }}
          onClick={() => { 
            setClassroomId(course); 
            handleJoinClassroom(course);
          }}
        >
          Chatroom
        </Button>
      </Card>
    ))
  ) : (
    <Typography variant="body1">No enrolled courses found.</Typography>
  )}
</Box>

            </Typography>
          </CardContent>
        </Card>
      </Container>
      
      {/* Message Notification */}
      <Snackbar 
        open={showMessage} 
        autoHideDuration={6000} 
        onClose={() => setShowMessage(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setShowMessage(false)} 
          severity={message.includes("Failed") || message.includes("not authorized") ? "error" : "success"} 
          variant="filled"
          sx={{ 
            width: '100%',
            fontFamily: "'Poppins', sans-serif",
            bgcolor: message.includes("Failed") || message.includes("not authorized") ? '#9D44C0' : '#6C3483',
            color: 'white'
          }}
        >
          {message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default JoinClassroom;