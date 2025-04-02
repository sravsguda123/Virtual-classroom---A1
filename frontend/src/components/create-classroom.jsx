import { useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Select,
  MenuItem,
  Fade,
  Slide,
  List,
  ListItem,
  ListItemText,
  Divider,
  AppBar,
  Toolbar,
  Grid,
  Paper,
  IconButton,
  Tooltip,
  Chip,
  Avatar,
  Badge,
} from "@mui/material";
import { 
  School, 
  Person, 
  CalendarToday, 
  Assignment, 
  Notifications, 
  Dashboard, 
  Group, 
  Add, 
  Visibility, 
  Send,
  Description,
  LibraryBooks,
  EventNote
} from "@mui/icons-material";

export default function TeacherDashboard() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const token = params.get("token");

  const [classroomName, setClassroomName] = useState("");
  const [classroomForStudents, setClassroomForStudents] = useState("");
  const [message, setMessage] = useState("");
  const [userId, setUserId] = useState("");
  const [notification, setNotification] = useState("");
  const [status, setStatus] = useState("");
  const [students, setStudents] = useState([]);
  const [assignmentid, setAssignmentId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [submissionType, setSubmissionType] = useState("text");
  const [dueDate, setDueDate] = useState("");
  const [messaget, setMessageT] = useState("");
  const [coursef, setCourseF] = useState("");
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [course_id, setCourseId] = useState("");
  const [activeTab, setActiveTab] = useState("dashboard");
  const [teacherDetails, setTeacherDetails] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    courses: ["Math 101", "Physics 202"],
  });
  const navigate = useNavigate();

  const seeAssignments = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/assignments/${course_id}`);
      setAssignments(response.data);
    } catch (error) {
      console.error(error);
      setMessage("Error fetching assignments.");
    }
  };

  const createMeeting = async () => {
    navigate(`/create_meeting?token=${token}`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/create_assignments",
        {
          title,
          description,
          submission_type: submissionType,
          due_date: dueDate,
          course_id: coursef,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setMessage(`Assignment created successfully! ID: ${response.data.assignment_id}`);
      setAssignmentId(response.data.assignment_id);
    } catch (error) {
      setMessage("Error creating assignment");
    }
  };

  const notifyStudents = async () => {
    try {
      console.log("Course ID:", course_id);  // Should print actual values
console.log("Assignment ID:", assignmentid);

      const response = await axios.get(`http://127.0.0.1:8000/notify_all/${course_id}/${assignmentid}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      setMessage(`${response.data.message}`);
    } catch (error) {
      console.error(error);
    }
  };

  const getAllEnrolledStudents = async () => {
    try {
      if (!classroomForStudents) {
        setMessage("Please enter a classroom name.");
        return;
      }
      const response = await axios.get(
        `http://127.0.0.1:8000/students_in_courses/${classroomForStudents}`
      );
      if (response.data.students) {
        setStudents(response.data.students);
      } else {
        setStudents([]);
      }
    } catch (error) {
      console.error(error);
      setMessage("Error fetching enrolled students.");
    }
  };

  const handleCreateClassroom = async () => {
    if (!token) {
      setMessage("You are not authorized to create a classroom.");
      return;
    }
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/create_classroom",
        { name: classroomName },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setMessage(`Course created successfully! ID: ${response.data.class_id}`);
      setClassroomName("");
    } catch (error) {
      console.error(error);
      setMessage("Failed to create course. Ensure you are a teacher.");
    }
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case "dashboard":
        return renderDashboard();
      case "profile":
        return renderProfile();
      case "createCourse":
        return renderCreateCourse();
      case "meetings":
        return renderMeetings();
      case "students":
        return renderStudents();
      case "assignments":
        return renderAssignments();
      default:
        return renderDashboard();
    }
  };

  const renderDashboard = () => (
    <Fade in={true} timeout={800}>
<Box sx={{ 
  // width: '100%',
  maxWidth: '100vw',  // Use viewport width instead of percentage
  height: '100vh',    // Make it full viewport height
   // Prevent scrolling
  p: { xs: 1, sm: 5 },
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  mr: { xs: 1, sm: 5 },
  boxSizing: 'border-box', // Ensures padding doesn't add to width
}}>
        {/* <Typography 
                      variant="h4" 
                      sx={{ 
                        color: "#FFFFFF",
                        fontFamily: "'Playfair Display', serif",
                        fontWeight: 600,
                        mb: 3,
                        textAlign: "center",
                      }}
                    >
          Teacher Dashboard
        </Typography> */}

        <Grid container spacing={2} sx={{ height: "calc(100% - 64px)" }}>
          <Grid item xs={12} md={6}>
            <Card
              sx={{
                height: "100%",
                width: "100%",
                borderRadius: "20px",
                backgroundColor: "rgba(26, 0, 51, 0.8)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(157, 68, 192, 0.4)",
                transition: "all 0.3s ease",
                "&:hover": {
                  boxShadow: "0 0 30px rgba(157, 68, 192, 0.3)",
                  transform: "translateY(-5px)",
                },
              }}
            >
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <LibraryBooks sx={{ color: "#9D44C0", fontSize: 36, mr: 2 }} />
                  <Typography
                    variant="h5"
                    sx={{
                      color: "#FFFFFF",
                      fontFamily: "'Playfair Display', serif",
                      fontWeight: 600,
                    }}
                  >
                    Your Courses
                  </Typography>
                </Box>
                <Divider sx={{ mb: 2, backgroundColor: "rgba(157, 68, 192, 0.4)" }} />
                {teacherDetails.courses.map((course, index) => (
                  <Chip
                    key={index}
                    label={course}
                    sx={{
                      m: 0.5,
                      backgroundColor: "rgba(157, 68, 192, 0.2)",
                      color: "#E0E0E0",
                      border: "1px solid #9D44C0",
                      fontFamily: "'Poppins', sans-serif",
                    }}
                  />
                ))}
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
          <Card
  sx={{
    height: "100%",
    width: "100%",
    borderRadius: "20px",
    backgroundColor: "rgba(26, 0, 51, 0.8)",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(157, 68, 192, 0.4)",
    marginRight: "200px", // Add this line
    // or alternatively:
    // mr: 2, // This uses the theme spacing
    transition: "all 0.3s ease",
    "&:hover": {
      boxShadow: "0 0 30px rgba(157, 68, 192, 0.3)",
      transform: "translateY(-5px)",
    },
  }}
>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <EventNote sx={{ color: "#9D44C0", fontSize: 36, mr: 2 }} />
                  <Typography
                    variant="h5"
                    sx={{
                      color: "#FFFFFF",
                      fontFamily: "'Playfair Display', serif",
                      fontWeight: 600,
                    }}
                  >
                    Quick Actions
                  </Typography>
                </Box>
                <Divider sx={{ mb: 2, backgroundColor: "rgba(157, 68, 192, 0.4)" }} />
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Button
                      fullWidth
                      variant="contained"
                      onClick={() => setActiveTab("createCourse")}
                      startIcon={<Add />}
                      sx={{
                        py: 1.5,
                        background: "linear-gradient(45deg, #9D44C0 0%, #6C3483 100%)",
                        borderRadius: "12px",
                        fontFamily: "'Poppins', sans-serif",
                        color: "#FFFFFF",
                        boxShadow: "0 4px 10px rgba(157, 68, 192, 0.3)",
                        "&:hover": {
                          background: "linear-gradient(45deg, #8E24AA 0%, #6A1B9A 100%)",
                          transform: "translateY(-2px)",
                        },
                      }}
                    >
                      New Course
                    </Button>
                  </Grid>
                  <Grid item xs={6}>
                    <Button
                      fullWidth
                      variant="contained"
                      onClick={() => setActiveTab("meetings")}
                      startIcon={<CalendarToday />}
                      sx={{
                        py: 1.5,
                        background: "linear-gradient(45deg, #9D44C0 0%, #6C3483 100%)",
                        borderRadius: "12px",
                        fontFamily: "'Poppins', sans-serif",
                        color: "#FFFFFF",
                        boxShadow: "0 4px 10px rgba(157, 68, 192, 0.3)",
                        "&:hover": {
                          background: "linear-gradient(45deg, #8E24AA 0%, #6A1B9A 100%)",
                          transform: "translateY(-2px)",
                        },
                      }}
                    >
                      New Meeting
                    </Button>
                  </Grid>
                  <Grid item xs={6}>
                    <Button
                      fullWidth
                      variant="contained"
                      onClick={() => setActiveTab("assignments")}
                      startIcon={<Assignment />}
                      sx={{
                        py: 1.5,
                        background: "linear-gradient(45deg, #9D44C0 0%, #6C3483 100%)",
                        borderRadius: "12px",
                        fontFamily: "'Poppins', sans-serif",
                        color: "#FFFFFF",
                        boxShadow: "0 4px 10px rgba(157, 68, 192, 0.3)",
                        "&:hover": {
                          background: "linear-gradient(45deg, #8E24AA 0%, #6A1B9A 100%)",
                          transform: "translateY(-2px)",
                        },
                      }}
                    >
                      New Assignment
                    </Button>
                  </Grid>
                  <Grid item xs={6}>
                    <Button
                      fullWidth
                      variant="contained"
                      onClick={() => setActiveTab("students")}
                      startIcon={<Group />}
                      sx={{
                        py: 1.5,
                        background: "linear-gradient(45deg, #9D44C0 0%, #6C3483 100%)",
                        borderRadius: "12px",
                        fontFamily: "'Poppins', sans-serif",
                        color: "#FFFFFF",
                        boxShadow: "0 4px 10px rgba(157, 68, 192, 0.3)",
                        "&:hover": {
                          background: "linear-gradient(45deg, #8E24AA 0%, #6A1B9A 100%)",
                          transform: "translateY(-2px)",
                        },
                      }}
                    >
                      View Students
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card
              sx={{
                height: "100%",
                width: "100%",
                borderRadius: "20px",
                backgroundColor: "rgba(26, 0, 51, 0.8)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(157, 68, 192, 0.4)",
                transition: "all 0.3s ease",
                "&:hover": {
                  boxShadow: "0 0 30px rgba(157, 68, 192, 0.3)",
                  transform: "translateY(-5px)",
                },
              }}
            >
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Description sx={{ color: "#9D44C0", fontSize: 36, mr: 2 }} />
                  <Typography
                    variant="h5"
                    sx={{
                      color: "#FFFFFF",
                      fontFamily: "'Playfair Display', serif",
                      fontWeight: 600,
                    }}
                  >
                    Recent Assignments
                  </Typography>
                </Box>
                <Divider sx={{ mb: 2, backgroundColor: "rgba(157, 68, 192, 0.4)" }} />
                {assignments.length > 0 ? (
                  <List>
                    {assignments.slice(0, 3).map((assignment) => (
                      <Paper
                        key={assignment._id}
                        elevation={0}
                        sx={{
                          mb: 2,
                          p: 2,
                          backgroundColor: "rgba(255,255,255,0.03)",
                          borderRadius: "8px",
                          transition: "all 0.3s ease",
                          "&:hover": {
                            backgroundColor: "rgba(157, 68, 192, 0.1)",
                          },
                        }}
                      >
                        <Typography
                          variant="h6"
                          sx={{
                            color: "#FFFFFF",
                            fontFamily: "'Poppins', sans-serif",
                            fontWeight: 500,
                          }}
                        >
                          {assignment.title}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: "rgba(255,255,255,0.7)",
                            fontFamily: "'Poppins', sans-serif",
                            mb: 1,
                          }}
                        >
                          Due: {assignment.due_date}
                        </Typography>
                        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => navigate(`/seesubmissions/${assignment._id}?token=${token}`)}
                            sx={{
                              color: "#9D44C0",
                              borderColor: "rgba(157, 68, 192, 0.5)",
                              fontFamily: "'Poppins', sans-serif",
                              "&:hover": {
                                borderColor: "#9D44C0",
                                backgroundColor: "rgba(157, 68, 192, 0.1)",
                              },
                            }}
                          >
                            View Submissions
                          </Button>
                        </Box>
                      </Paper>
                    ))}
                  </List>
                ) : (
                  <Box sx={{ textAlign: "center", py: 3 }}>
                    <Typography
                      variant="body1"
                      sx={{ color: "#E0E0E0", fontFamily: "'Poppins', sans-serif" }}
                    >
                      No recent assignments found.
                    </Typography>
                    <Button
                      variant="text"
                      onClick={() => setActiveTab("assignments")}
                      sx={{
                        mt: 1,
                        color: "#9D44C0",
                        fontFamily: "'Poppins', sans-serif",
                        "&:hover": {
                          backgroundColor: "rgba(157, 68, 192, 0.1)",
                        },
                      }}
                    >
                      Create New Assignment
                    </Button>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Fade>
  );

  const renderProfile = () => (
    <Fade in={true} timeout={800}>
      <Card
        sx={{
          height: "100%",
          width: "100vw",
          borderRadius: "20px",
          backgroundColor: "rgba(26, 0, 51, 0.8)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(157, 68, 192, 0.4)",
          transition: "all 0.3s ease",
          "&:hover": {
            boxShadow: "0 0 30px rgba(157, 68, 192, 0.3)",
          },
        }}
      >
        <Box
          sx={{
            height: "120px",
            background: "linear-gradient(120deg, #6C3483 0%, #9D44C0 50%, #D980FA 100%)",
          }}
        />
        <CardContent sx={{ position: "relative", px: 2, pb: 4 }}>
          <Avatar
            sx={{
              width: 150,
              height: 150,
              border: "4px solid rgba(157, 68, 192, 0.6)",
              boxShadow: "0 0 20px rgba(157, 68, 192, 0.4)",
              marginTop: "-75px",
              mx: "auto",
            }}
            alt={teacherDetails.name}
          >
            {teacherDetails.name.charAt(0)}
          </Avatar>
          <Typography
            variant="h4"
            sx={{
              color: "#FFFFFF",
              fontFamily: "'Playfair Display', serif",
              fontWeight: 600,
              mt: 2,
              textAlign: "center",
            }}
          >
            {teacherDetails.name}
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: "#E0E0E0",
              fontFamily: "'Poppins', sans-serif",
              mb: 3,
              textAlign: "center",
            }}
          >
            Teacher
          </Typography>
          <Divider sx={{ mb: 3, backgroundColor: "rgba(157, 68, 192, 0.4)" }} />
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography
                variant="subtitle2"
                sx={{
                  color: "#9D44C0",
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: 500,
                  textAlign: "center",
                }}
              >
                Email
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: "#E0E0E0",
                  fontFamily: "'Poppins', sans-serif",
                  mb: 2,
                  textAlign: "center",
                }}
              >
                {teacherDetails.email}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography
                variant="subtitle2"
                sx={{
                  color: "#9D44C0",
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: 500,
                  textAlign: "center",
                }}
              >
                Courses
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, justifyContent: "center" }}>
                {teacherDetails.courses.map((course, index) => (
                  <Chip
                    key={index}
                    label={course}
                    sx={{
                      backgroundColor: "rgba(157, 68, 192, 0.2)",
                      color: "#E0E0E0",
                      border: "1px solid #9D44C0",
                      fontFamily: "'Poppins', sans-serif",
                    }}
                  />
                ))}
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Fade>
  );

  const renderCreateCourse = () => (
    <Fade in={true} timeout={800}>
      <Card
        sx={{
          height: "100%",
          width: "100vw",
          borderRadius: "20px",
          backgroundColor: "rgba(26, 0, 51, 0.8)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(157, 68, 192, 0.4)",
          transition: "all 0.3s ease",
          "&:hover": {
            boxShadow: "0 0 30px rgba(157, 68, 192, 0.3)",
          },
        }}
      >
        <CardContent sx={{ p: 2, height: "100%", display: "flex", flexDirection: "column", justifyContent: "center" }}>
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
            Create a New Course
          </Typography>
          <Divider sx={{ mb: 4, backgroundColor: "rgba(157, 68, 192, 0.4)" }} />
          <Box sx={{ width: "100%" }}>
            <TextField
              fullWidth
              label="Course Name"
              variant="filled"
              placeholder="e.g. Advanced Physics 101"
              value={classroomName}
              onChange={(e) => setClassroomName(e.target.value)}
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
                "& .MuiInputLabel-root": {
                  color: "#C0C0C0",
                  fontFamily: "'Poppins', sans-serif",
                },
              }}
            />
            <Button
              fullWidth
              variant="contained"
              onClick={handleCreateClassroom}
              sx={{
                py: 1.5,
                background: "linear-gradient(45deg, #9D44C0 0%, #6C3483 100%)",
                fontWeight: "500",
                letterSpacing: "1px",
                borderRadius: "12px",
                fontFamily: "'Poppins', sans-serif",
                color: "#FFFFFF",
                boxShadow: "0 4px 20px rgba(157, 68, 192, 0.3)",
                "&:hover": {
                  background: "linear-gradient(45deg, #8E24AA 0%, #6A1B9A 100%)",
                  transform: "translateY(-2px)",
                  boxShadow: "0 6px 25px rgba(157, 68, 192, 0.5)",
                },
              }}
            >
              Create Course
            </Button>
            {message && (
              <Typography
                variant="body2"
                sx={{
                  color: "#E0E0E0",
                  fontFamily: "'Poppins', sans-serif",
                  mt: 2,
                  textAlign: "center",
                }}
              >
                {message}
              </Typography>
            )}
          </Box>
        </CardContent>
      </Card>
    </Fade>
  );

  const renderMeetings = () => (
    <Fade in={true} timeout={800}>
      <Card
        sx={{
          height: "100%",
          width: "100vw",
          borderRadius: "20px",
          backgroundColor: "rgba(26, 0, 51, 0.8)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(157, 68, 192, 0.4)",
          transition: "all 0.3s ease",
          "&:hover": {
            boxShadow: "0 0 30px rgba(157, 68, 192, 0.3)",
          },
        }}
      >
        <CardContent sx={{ p: 2, height: "100%", display: "flex", flexDirection: "column", justifyContent: "center" }}>
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
            Schedule a New Meeting
          </Typography>
          <Divider sx={{ mb: 4, backgroundColor: "rgba(157, 68, 192, 0.4)" }} />
          <Box sx={{ textAlign: "center", width: "100%" }}>
            <Box
              sx={{
                backgroundColor: "rgba(255,255,255,0.03)",
                borderRadius: "16px",
                p: 3,
                mb: 4,
                border: "1px dashed rgba(157, 68, 192, 0.4)",
              }}
            >
              <EventNote sx={{ color: "#9D44C0", fontSize: 64, mb: 2 }} />
              <Typography
                variant="h6"
                sx={{
                  color: "#FFFFFF",
                  fontFamily: "'Poppins', sans-serif",
                  mb: 1,
                }}
              >
                Create a Virtual Meeting
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "rgba(255,255,255,0.7)",
                  fontFamily: "'Poppins', sans-serif",
                  mb: 3,
                }}
              >
                Schedule online sessions with your students.
              </Typography>
            </Box>
            <Button
              variant="contained"
              onClick={createMeeting}
              sx={{
                py: 1.5,
                px: 4,
                background: "linear-gradient(45deg, #9D44C0 0%, #6C3483 100%)",
                fontWeight: "500",
                letterSpacing: "1px",
                borderRadius: "12px",
                fontFamily: "'Poppins', sans-serif",
                color: "#FFFFFF",
                boxShadow: "0 4px 20px rgba(157, 68, 192, 0.3)",
                "&:hover": {
                  background: "linear-gradient(45deg, #8E24AA 0%, #6A1B9A 100%)",
                  transform: "translateY(-2px)",
                  boxShadow: "0 6px 25px rgba(157, 68, 192, 0.5)",
                },
              }}
            >
              Schedule Meeting
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Fade>
  );

  const renderStudents = () => (
    <Fade in={true} timeout={800}>
      <Card
        sx={{
          height: "100%",
          width: "100vw",
          borderRadius: "20px",
          backgroundColor: "rgba(26, 0, 51, 0.8)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(157, 68, 192, 0.4)",
          transition: "all 0.3s ease",
          "&:hover": {
            boxShadow: "0 0 30px rgba(157, 68, 192, 0.3)",
          },
        }}
      >
        <CardContent sx={{ p: 2, height: "100%", overflow: "auto" }}>
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
            View Enrolled Students
          </Typography>
          <Divider sx={{ mb: 4, backgroundColor: "rgba(157, 68, 192, 0.4)" }} />
          <Box sx={{ width: "100%" }}>
            <TextField
              fullWidth
              label="Course ID"
              variant="filled"
              placeholder="Enter Course ID"
              value={classroomForStudents}
              onChange={(e) => setClassroomForStudents(e.target.value)}
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
                "& .MuiInputLabel-root": {
                  color: "#C0C0C0",
                  fontFamily: "'Poppins', sans-serif",
                },
              }}
            />
            <Button
              fullWidth
              variant="contained"
              onClick={getAllEnrolledStudents}
              sx={{
                py: 1.5,
                background: "linear-gradient(45deg, #9D44C0 0%, #6C3483 100%)",
                fontWeight: "500",
                letterSpacing: "1px",
                borderRadius: "12px",
                fontFamily: "'Poppins', sans-serif",
                color: "#FFFFFF",
                boxShadow: "0 4px 20px rgba(157, 68, 192, 0.3)",
                "&:hover": {
                  background: "linear-gradient(45deg, #8E24AA 0%, #6A1B9A 100%)",
                  transform: "translateY(-2px)",
                  boxShadow: "0 6px 25px rgba(157, 68, 192, 0.5)",
                },
              }}
            >
              Get Enrolled Students
            </Button>
            {students.length > 0 ? (
              <List sx={{ mt: 3 }}>
                {students.map((student, index) => (
                  <Paper
                    key={index}
                    elevation={0}
                    sx={{
                      mb: 2,
                      p: 2,
                      backgroundColor: "rgba(255,255,255,0.03)",
                      borderRadius: "8px",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        backgroundColor: "rgba(157, 68, 192, 0.1)",
                      },
                    }}
                  >
                    <ListItemText
                      primary={student}
                      sx={{ color: "#E0E0E0", fontFamily: "'Poppins', sans-serif" }}
                    />
                  </Paper>
                ))}
              </List>
            ) : (
              <Box sx={{ textAlign: "center", mt: 3 }}>
                <Typography
                  variant="body1"
                  sx={{ color: "#E0E0E0", fontFamily: "'Poppins', sans-serif" }}
                >
                  No students enrolled yet.
                </Typography>
              </Box>
            )}
            {message && (
              <Typography
                variant="body2"
                sx={{
                  color: "#E0E0E0",
                  fontFamily: "'Poppins', sans-serif",
                  mt: 2,
                  textAlign: "center",
                }}
              >
                {message}
              </Typography>
            )}
          </Box>
        </CardContent>
      </Card>
    </Fade>
  );

  const renderAssignments = () => (
    <Fade in={true} timeout={800}>
      <Card
        sx={{
          height: "100%",
          width: "100vw",
          borderRadius: "20px",
          backgroundColor: "rgba(26, 0, 51, 0.8)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(157, 68, 192, 0.4)",
          transition: "all 0.3s ease",
          "&:hover": {
            boxShadow: "0 0 30px rgba(157, 68, 192, 0.3)",
          },
        }}
      >
        <CardContent sx={{ p: 2, height: "100%", overflow: "auto" }}>
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
            Manage Assignments
          </Typography>
          <Divider sx={{ mb: 4, backgroundColor: "rgba(157, 68, 192, 0.4)" }} />
          <Box sx={{ width: "100%" }}>
            <Typography
              variant="h5"
              sx={{
                color: "#FFFFFF",
                fontFamily: "'Playfair Display', serif",
                fontWeight: 600,
                mb: 2,
              }}
            >
              Create New Assignment
            </Typography>
            <TextField
              fullWidth
              label="Title"
              variant="filled"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
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
                "& .MuiInputLabel-root": {
                  color: "#C0C0C0",
                  fontFamily: "'Poppins', sans-serif",
                },
              }}
            />
            <TextField
              fullWidth
              label="Description"
              variant="filled"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
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
                "& .MuiInputLabel-root": {
                  color: "#C0C0C0",
                  fontFamily: "'Poppins', sans-serif",
                },
              }}
            />
            <Select
              fullWidth
              value={submissionType}
              onChange={(e) => setSubmissionType(e.target.value)}
              variant="filled"
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
                "& .MuiInputLabel-root": {
                  color: "#C0C0C0",
                  fontFamily: "'Poppins', sans-serif",
                },
                "& .MuiSvgIcon-root": { color: "#9D44C0" },
              }}
            >
              <MenuItem value="text">Text</MenuItem>
              <MenuItem value="file">File Upload</MenuItem>
              <MenuItem value="link">Link Submission</MenuItem>
              <MenuItem value="multiple_choice">Multiple Choice</MenuItem>
            </Select>
            <TextField
              fullWidth
              type="date"
              label="Due Date"
              variant="filled"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
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
                "& .MuiInputLabel-root": {
                  color: "#C0C0C0",
                  fontFamily: "'Poppins', sans-serif",
                },
              }}
            />
            <TextField
              fullWidth
              label="Course ID"
              variant="filled"
              value={coursef}
              onChange={(e) => setCourseF(e.target.value)}
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
                "& .MuiInputLabel-root": {
                  color: "#C0C0C0",
                  fontFamily: "'Poppins', sans-serif",
                },
              }}
            />
            <Button
              fullWidth
              variant="contained"
              onClick={handleSubmit}
              sx={{
                py: 1.5,
                background: "linear-gradient(45deg, #9D44C0 0%, #6C3483 100%)",
                fontWeight: "500",
                letterSpacing: "1px",
                borderRadius: "12px",
                fontFamily: "'Poppins', sans-serif",
                color: "#FFFFFF",
                boxShadow: "0 4px 20px rgba(157, 68, 192, 0.3)",
                "&:hover": {
                  background: "linear-gradient(45deg, #8E24AA 0%, #6A1B9A 100%)",
                  transform: "translateY(-2px)",
                  boxShadow: "0 6px 25px rgba(157, 68, 192, 0.5)",
                },
              }}
            >
              Create Assignment
            </Button>
           
            <Divider sx={{ my: 4, backgroundColor: "rgba(157, 68, 192, 0.4)" }} />
            <Typography
              variant="h5"
              sx={{
                color: "#FFFFFF",
                fontFamily: "'Playfair Display', serif",
                fontWeight: 600,
                mb: 2,
              }}
            >
              View Assignments
            </Typography>
            <TextField
              fullWidth
              label="Course ID"
              variant="filled"
              value={course_id}
              onChange={(e) => setCourseId(e.target.value)}
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
                "& .MuiInputLabel-root": {
                  color: "#C0C0C0",
                  fontFamily: "'Poppins', sans-serif",
                },
              }}
            />
            <Button
              fullWidth
              variant="contained"
              onClick={seeAssignments}
              sx={{
                py: 1.5,
                background: "linear-gradient(45deg, #9D44C0 0%, #6C3483 100%)",
                fontWeight: "500",
                letterSpacing: "1px",
                borderRadius: "12px",
                fontFamily: "'Poppins', sans-serif",
                color: "#FFFFFF",
                boxShadow: "0 4px 20px rgba(157, 68, 192, 0.3)",
                "&:hover": {
                  background: "linear-gradient(45deg, #8E24AA 0%, #6A1B9A 100%)",
                  transform: "translateY(-2px)",
                  boxShadow: "0 6px 25px rgba(157, 68, 192, 0.5)",
                },
              }}
            >
              See Assignments
            </Button>
            {assignments.length > 0 ? (
              <List sx={{ mt: 3 }}>
                {assignments.map((assignment) => (
                  <Paper
                    key={assignment._id}
                    elevation={0}
                    sx={{
                      mb: 2,
                      p: 2,
                      backgroundColor: "rgba(255,255,255,0.03)",
                      borderRadius: "8px",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        backgroundColor: "rgba(157, 68, 192, 0.1)",
                      },
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        color: "#FFFFFF",
                        fontFamily: "'Poppins', sans-serif",
                        fontWeight: 500,
                      }}
                    >
                      {assignment.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "rgba(255,255,255,0.7)",
                        fontFamily: "'Poppins', sans-serif",
                        mb: 1,
                      }}
                    >
                      Due: {assignment.due_date}
                    </Typography>
                    <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => navigate(`/seesubmissions/${assignment._id}?token=${token}`)}
                        sx={{
                          color: "#9D44C0",
                          borderColor: "rgba(157, 68, 192, 0.5)",
                          fontFamily: "'Poppins', sans-serif",
                          "&:hover": {
                            borderColor: "#9D44C0",
                            backgroundColor: "rgba(157, 68, 192, 0.1)",
                          },
                        }}
                      >
                        View Submissions
                      </Button>
                    </Box>
                  </Paper>
                ))}
              </List>
            ) : (
              <Box sx={{ textAlign: "center", mt: 3 }}>
                <Typography
                  variant="body1"
                  sx={{ color: "#E0E0E0", fontFamily: "'Poppins', sans-serif" }}
                >
                  No assignments found.
                </Typography>
              </Box>
            )}
            <Divider sx={{ my: 4, backgroundColor: "rgba(157, 68, 192, 0.4)" }} />
            <Typography
              variant="h5"
              sx={{
                color: "#FFFFFF",
                fontFamily: "'Playfair Display', serif",
                fontWeight: 600,
                mb: 2,
              }}
            >
              Notify Students
            </Typography>
            <TextField
              fullWidth
              label="Course ID"
              variant="filled"
              value={course_id}
              onChange={(e) => setCourseId(e.target.value)}
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
                "& .MuiInputLabel-root": {
                  color: "#C0C0C0",
                  fontFamily: "'Poppins', sans-serif",
                },
              }}
            />
            <TextField
              fullWidth
              label="Assignment ID"
              variant="filled"
              value={assignmentid}
              onChange={(e) => setAssignmentId(e.target.value)}
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
                "& .MuiInputLabel-root": {
                  color: "#C0C0C0",
                  fontFamily: "'Poppins', sans-serif",
                },
              }}
            />
            <Button
              fullWidth
              variant="contained"
              onClick={notifyStudents}
              sx={{
                py: 1.5,
                background: "linear-gradient(45deg, #9D44C0 0%, #6C3483 100%)",
                fontWeight: "500",
                letterSpacing: "1px",
                borderRadius: "12px",
                fontFamily: "'Poppins', sans-serif",
                color: "#FFFFFF",
                boxShadow: "0 4px 20px rgba(157, 68, 192, 0.3)",
                "&:hover": {
                  background: "linear-gradient(45deg, #8E24AA 0%, #6A1B9A 100%)",
                  transform: "translateY(-2px)",
                  boxShadow: "0 6px 25px rgba(157, 68, 192, 0.5)",
                },
              }}
            >
              Notify All Students
            </Button>
            {message && (
              <Typography
                variant="body2"
                sx={{
                  color: "#E0E0E0",
                  fontFamily: "'Poppins', sans-serif",
                  mt: 2,
                  textAlign: "center",
                }}
              >
                {message}
              </Typography>
            )}
          </Box>
        </CardContent>
      </Card>
    </Fade>
  );

  return (
    <>
      <style>
        {`
          html, body, #root {
            margin: 0;
            padding: 0;
            width: 100%;
            height: 100%;
            
          }
          
          body {
            margin: 0;
            padding: 0;
            background-color: #0a0013;
            min-height: 100vh;
            width: 100%;
          }
          
          * {
            scrollbar-width: none;
            -ms-overflow-style: none;
          }
          
          *::-webkit-scrollbar {
            display: none;
          }
          
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
          
          .nav-button {
            transition: all 0.3s ease;
          }
          
          .nav-button:hover {
            background-color: rgba(157, 68, 192, 0.2);
            transform: translateY(-2px);
          }
        `}
      </style>

      <Box 
        className="gradient-bg"
        sx={{ 
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          width: '100%',
          overflow: 'hidden',
          position: 'relative'
        }}
      >
        <AppBar 
          position="fixed" 
          sx={{ 
            width: '100%',
            backgroundColor: "rgba(26, 0, 51, 0.95)",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.5)",
            zIndex: 1200,
          }}
        >
          <Toolbar 
            sx={{ 
              px: { xs: 2, sm: 3, md: 4 },
              display: 'flex',
              justifyContent: 'space-between',
              width: '100%',
              maxWidth: '100%',
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
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
                  textShadow: "0 0 10px rgba(157, 68, 192, 0.3)",
                }}
              >
                Teacher Dashboard
              </Typography>
            </Box>
            <Box 
              sx={{ 
                display: "flex", 
                gap: { xs: 0.5, sm: 1 },
                overflow: 'visible'
              }}
            >
              <Button 
                className="nav-button"
                color="inherit" 
                onClick={() => setActiveTab("dashboard")}
                sx={{ 
                  px: { xs: 1, sm: 2 },
                  whiteSpace: 'nowrap',
                  fontSize: { xs: '0.8rem', sm: '1rem' },
                  fontFamily: "'Playfair Display', serif",
                  fontWeight: 500,
                  color: "#E0E0E0",
                  "&:hover": {
                    backgroundColor: "rgba(157, 68, 192, 0.2)",
                  },
                }}
              >
                Dashboard
              </Button>
              <Button 
                className="nav-button"
                color="inherit" 
                onClick={() => setActiveTab("profile")}
                sx={{ 
                  px: { xs: 1, sm: 2 },
                  whiteSpace: 'nowrap',
                  fontSize: { xs: '0.8rem', sm: '1rem' },
                  fontFamily: "'Playfair Display', serif",
                  fontWeight: 500,
                  color: "#E0E0E0",
                  "&:hover": {
                    backgroundColor: "rgba(157, 68, 192, 0.2)",
                  },
                }}
              >
                Profile
              </Button>
              <Button 
                className="nav-button"
                color="inherit" 
                onClick={() => setActiveTab("createCourse")}
                sx={{ 
                  px: { xs: 1, sm: 2 },
                  whiteSpace: 'nowrap',
                  fontSize: { xs: '0.8rem', sm: '1rem' },
                  fontFamily: "'Playfair Display', serif",
                  fontWeight: 500,
                  color: "#E0E0E0",
                  "&:hover": {
                    backgroundColor: "rgba(157, 68, 192, 0.2)",
                  },
                }}
              >
                Create Course
              </Button>
              <Button 
                className="nav-button"
                color="inherit" 
                onClick={() => setActiveTab("meetings")}
                sx={{ 
                  px: { xs: 1, sm: 2 },
                  whiteSpace: 'nowrap',
                  fontSize: { xs: '0.8rem', sm: '1rem' },
                  fontFamily: "'Playfair Display', serif",
                  fontWeight: 500,
                  color: "#E0E0E0",
                  "&:hover": {
                    backgroundColor: "rgba(157, 68, 192, 0.2)",
                  },
                }}
              >
                Meetings
              </Button>
              <Button 
                className="nav-button"
                color="inherit" 
                onClick={() => setActiveTab("students")}
                sx={{ 
                  px: { xs: 1, sm: 2 },
                  whiteSpace: 'nowrap',
                  fontSize: { xs: '0.8rem', sm: '1rem' },
                  fontFamily: "'Playfair Display', serif",
                  fontWeight: 500,
                  color: "#E0E0E0",
                  "&:hover": {
                    backgroundColor: "rgba(157, 68, 192, 0.2)",
                  },
                }}
              >
                Students
              </Button>
              <Button 
                className="nav-button"
                color="inherit" 
                onClick={() => setActiveTab("assignments")}
                sx={{ 
                  px: { xs: 1, sm: 2 },
                  mr:5,
                  whiteSpace: 'nowrap',
                  fontSize: { xs: '0.8rem', sm: '1rem' },
                  fontFamily: "'Playfair Display', serif",
                  fontWeight: 500,
                  color: "#E0E0E0",
                  "&:hover": {
                    backgroundColor: "rgba(157, 68, 192, 0.2)",
                  },
                }}
              >
                Assignments
              </Button>
            </Box>
          </Toolbar>
        </AppBar>

        <Box 
          sx={{ 
            flexGrow: 1,
            width: '100%',
            pt: '64px',
            overflow: 'auto',
            position: 'relative',
            px: { xs: 2, sm: 3, md: 4 },
          }}
        >
          {renderActiveTab()}
        </Box>
      </Box>
    </>
  );
}
