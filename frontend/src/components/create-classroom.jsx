// import { useState } from "react";
// import axios from "axios";
// import { useNavigate, useLocation } from "react-router-dom";
// import {
//   Container,
//   Box,
//   Card,
//   CardContent,
//   TextField,
//   Button,
//   Typography,
//   Select,
//   MenuItem,
//   Fade,
//   Slide,
//   List,
//   ListItem,
//   ListItemText,
//   Divider,
// } from "@mui/material";
// import { School, Person, CalendarToday, Assignment } from "@mui/icons-material";

// export default function TeacherDashboard() {
//   const location = useLocation();
//   const params = new URLSearchParams(location.search);
//   const token = params.get("token");

//   const [classroomName, setClassroomName] = useState("");
//   const [classroomForStudents, setClassroomForStudents] = useState("");
//   const [message, setMessage] = useState("");
//   const [userId, setUserId] = useState("");
//   const [notification, setNotification] = useState("");
//   const [status, setStatus] = useState("");
//   const [students, setStudents] = useState([]);
//   const [assignmentid, setAssignmentId] = useState("");
//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [submissionType, setSubmissionType] = useState("text");
//   const [dueDate, setDueDate] = useState("");
//   const [messaget, setMessageT] = useState("");
//   const [coursef, setCourseF] = useState("");
//   const [assignments, setAssignments] = useState([]);
//   const [submissions, setSubmissions] = useState([]);
//   const [course_id, setCourseId] = useState("");
//   const [teacherDetails, setTeacherDetails] = useState({
//     name: "John Doe",
//     email: "john.doe@example.com",
//     courses: ["Math 101", "Physics 202"],
//   });
//   const navigate = useNavigate();

//   const seeAssignments = async () => {
//     try {
//       const response = await axios.get(`http://127.0.0.1:8000/assignments/${course_id}`);
//       setAssignments(response.data);
//     } catch (error) {
//       console.error(error);
//       setMessage("Error fetching assignments.");
//     }
//   };

  
// const createMeeting = async () =>{
//   navigate(`/create_meeting?token=${token}`);
// }


//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post(
//         "http://127.0.0.1:8000/create_assignments",
//         {
//           title,
//           description,
//           submission_type: submissionType,
//           due_date: dueDate,
//           course_id: coursef,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );
//       setMessage(`Assignment created successfully! ID: ${response.data.assignment_id}`);
//       setAssignmentId(response.data.assignment_id);
//     } catch (error) {
//       setMessage("Error creating assignment");
//     }
//   };

//   const notifyStudents = async () => {
//     try {
//       const response = await axios.get(`http://127.0.0.1:8000/notify_all/${course_id}/${assignmentid}`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       });
//       setMessage(`${response.data.status}`);
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const getAllEnrolledStudents = async () => {
//     try {
//       if (!classroomForStudents) {
//         setMessage("Please enter a classroom name.");
//         return;
//       }
//       const response = await axios.get(
//         `http://127.0.0.1:8000/students_in_courses/${classroomForStudents}`
//       );
//       if (response.data.students) {
//         setStudents(response.data.students);
//       } else {
//         setStudents([]);
//       }
//     } catch (error) {
//       console.error(error);
//       setMessage("Error fetching enrolled students.");
//     }
//   };

//   const handleCreateClassroom = async () => {
//     if (!token) {
//       setMessage("You are not authorized to create a classroom.");
//       return;
//     }
//     try {
//       const response = await axios.post(
//         "http://127.0.0.1:8000/create_classroom",
//         { name: classroomName },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );
//       setMessage(`Course created successfully! ID: ${response.data.class_id}`);
//       setClassroomName("");
//     } catch (error) {
//       console.error(error);
//       setMessage("Failed to create course. Ensure you are a teacher.");
//     }
//   };

//   return (
//     <>
//       <style>
//         {`
//           @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Poppins:wght@300;400;500;600&display=swap');
          
//           .gradient-bg {
//             background: linear-gradient(-45deg, #1a0033, #2a0944, #3b185f, #240046);
//             background-size: 400% 400%;
//             animation: gradientFlow 15s ease infinite;
//           }

//           @keyframes gradientFlow {
//             0% { background-position: 0% 50%; }
//             50% { background-position: 100% 50%; }
//             100% { background-position: 0% 50%; }
//           }

//           .neon-glow {
//             box-shadow: 0 0 30px rgba(157, 68, 192, 0.3);
//             transition: all 0.4s ease;
//           }

//           .neon-glow:hover {
//             box-shadow: 0 0 40px rgba(157, 68, 192, 0.5);
//           }

//           html, body {
//             margin: 0;
//             padding: 0;
//             height: 100%;
//             width: 100%;
//             overflow: hidden;
//           }
//         `}
//       </style>

//       <Box
//         sx={{
//           height: "100vh",
//           width: "100vw",
//           py: 4,
//           px: 2,
//           m: 0,
//           background: "#0a0013",
//           position: "fixed",
//           top: 0,
//           left: 0,
//           overflow: "auto",
//         }}
//       >
//         <Container maxWidth="md">
//           <Fade in={true} timeout={1000}>
//             <Box sx={{ textAlign: "center", mb: 6 }}>
//               <School
//                 sx={{
//                   fontSize: 40,
//                   color: "#9D44C0",
//                   mb: 2,
//                   filter: "drop-shadow(0 0 10px rgba(157, 68, 192, 0.5))",
//                 }}
//               />
//               <Typography
//                 variant="h3"
//                 sx={{
//                   color: "#FFFFFF",
//                   fontFamily: "'Playfair Display', serif",
//                   fontWeight: 600,
//                   letterSpacing: "2px",
//                 }}
//               >
//                 Teacher Dashboard
//               </Typography>
//               <Typography
//                 variant="body2"
//                 sx={{
//                   color: "#BBBBBB",
//                   fontFamily: "'Poppins', sans-serif",
//                   fontWeight: 300,
//                   mt: 1,
//                 }}
//               >
//                 Manage your classrooms, assignments, and students
//               </Typography>
//             </Box>
//           </Fade>

//           {/* Teacher Details Section */}
//           <Slide direction="up" in={true} timeout={1000}>
//             <Card
//               className="neon-glow"
//               sx={{
//                 mb: 4,
//                 backgroundColor: "rgba(26, 0, 51, 0.85)",
//                 borderRadius: "24px",
//                 border: "1px solid rgba(157, 68, 192, 0.4)",
//               }}
//             >
//               <CardContent sx={{ p: 4 }}>
//                 <Typography
//                   variant="h5"
//                   sx={{
//                     color: "#FFFFFF",
//                     fontFamily: "'Playfair Display', serif",
//                     fontWeight: 500,
//                     mb: 3,
//                   }}
//                 >
//                   <Person sx={{ mr: 1, verticalAlign: "middle" }} />
//                   Teacher Details
//                 </Typography>
//                 <Typography
//                   variant="body1"
//                   sx={{ color: "#E0E0E0", fontFamily: "'Poppins', sans-serif", mb: 2 }}
//                 >
//                   <strong>Name:</strong> {teacherDetails.name}
//                 </Typography>
//                 <Typography
//                   variant="body1"
//                   sx={{ color: "#E0E0E0", fontFamily: "'Poppins', sans-serif", mb: 2 }}
//                 >
//                   <strong>Email:</strong> {teacherDetails.email}
//                 </Typography>
//                 <Typography
//                   variant="body1"
//                   sx={{ color: "#E0E0E0", fontFamily: "'Poppins', sans-serif", mb: 2 }}
//                 >
//                   <strong>Courses:</strong> {teacherDetails.courses.join(", ")}
//                 </Typography>
//               </CardContent>
//             </Card>
//           </Slide>

//           {/* Create Classroom Section */}
//           <Slide direction="up" in={true} timeout={1000} style={{ transitionDelay: "200ms" }}>
//             <Card
//               className="neon-glow"
//               sx={{
//                 mb: 4,
//                 backgroundColor: "rgba(26, 0, 51, 0.85)",
//                 borderRadius: "24px",
//                 border: "1px solid rgba(157, 68, 192, 0.4)",
//               }}
//             >
//               <CardContent sx={{ p: 4 }}>
//                 <Typography
//                   variant="h5"
//                   sx={{
//                     color: "#FFFFFF",
//                     fontFamily: "'Playfair Display', serif",
//                     fontWeight: 500,
//                     mb: 3,
//                   }}
//                 >
//                   <Assignment sx={{ mr: 1, verticalAlign: "middle" }} />
//                   Create a Course
//                 </Typography>
//                 <TextField
//                   size="small"
//                   fullWidth
//                   variant="filled"
//                   placeholder="Classroom Name"
//                   value={classroomName}
//                   onChange={(e) => setClassroomName(e.target.value)}
//                   sx={{
//                     mb: 3,
//                     "& .MuiFilledInput-root": {
//                       backgroundColor: "rgba(255,255,255,0.1)",
//                       borderRadius: "12px",
//                       color: "#E0E0E0",
//                       fontFamily: "'Poppins', sans-serif",
//                       "&:hover": { backgroundColor: "rgba(255,255,255,0.15)" },
//                       "&.Mui-focused": {
//                         backgroundColor: "rgba(255,255,255,0.2)",
//                         boxShadow: "0 0 15px rgba(157, 68, 192, 0.3)",
//                       },
//                     },
//                   }}
//                 />
//                 <Button
//                   size="small"
//                   fullWidth
//                   variant="contained"
//                   onClick={handleCreateClassroom}
//                   sx={{
//                     py: 1.5,
//                     background: "linear-gradient(45deg, #9D44C0 0%, #6C3483 100%)",
//                     fontWeight: "500",
//                     letterSpacing: "2px",
//                     borderRadius: "12px",
//                     fontFamily: "'Poppins', sans-serif",
//                     color: "#FFFFFF",
//                     "&:hover": {
//                       background: "linear-gradient(45deg, #8E24AA 0%, #6A1B9A 100%)",
//                       transform: "translateY(-2px)",
//                     },
//                   }}
//                 >
//                   Create Classroom
//                 </Button>
//                 {message && (
//                   <Typography
//                     variant="caption"
//                     sx={{ mt: 2, color: "#9D44C0", display: "block" }}
//                   >
//                     {message}
//                   </Typography>
//                 )}
//               </CardContent>
//             </Card>
//           </Slide>

//           {/* Create Meeting Section */}
//           <Slide direction="up" in={true} timeout={1000} style={{ transitionDelay: "400ms" }}>
//             <Card
//               className="neon-glow"
//               sx={{
//                 mb: 4,
//                 backgroundColor: "rgba(26, 0, 51, 0.85)",
//                 borderRadius: "24px",
//                 border: "1px solid rgba(157, 68, 192, 0.4)",
//               }}
//             >
//               <CardContent sx={{ p: 4 }}>
//                 <Typography
//                   variant="h5"
//                   sx={{
//                     color: "#FFFFFF",
//                     fontFamily: "'Playfair Display', serif",
//                     fontWeight: 500,
//                     mb: 3,
//                   }}
//                 >
//                   <CalendarToday sx={{ mr: 1, verticalAlign: "middle" }} />
//                   Create Meeting
//                 </Typography>
//                 <Button
//                   size="small"
//                   fullWidth
//                   variant="contained"
//                   onClick={createMeeting}
//                   sx={{
//                     py: 1.5,
//                     background: "linear-gradient(45deg, #9D44C0 0%, #6C3483 100%)",
//                     fontWeight: "500",
//                     letterSpacing: "2px",
//                     borderRadius: "12px",
//                     fontFamily: "'Poppins', sans-serif",
//                     color: "#FFFFFF",
//                     "&:hover": {
//                       background: "linear-gradient(45deg, #8E24AA 0%, #6A1B9A 100%)",
//                       transform: "translateY(-2px)",
//                     },
//                   }}
//                 >
//                   Schedule a Meeting
//                 </Button>
//               </CardContent>
//             </Card>
//           </Slide>

//           {/* Enrolled Students Section */}
//           <Slide direction="up" in={true} timeout={1000} style={{ transitionDelay: "600ms" }}>
//             <Card
//               className="neon-glow"
//               sx={{
//                 mb: 4,
//                 backgroundColor: "rgba(26, 0, 51, 0.85)",
//                 borderRadius: "24px",
//                 border: "1px solid rgba(157, 68, 192, 0.4)",
//               }}
//             >
//               <CardContent sx={{ p: 4 }}>
//                 <Typography
//                   variant="h5"
//                   sx={{
//                     color: "#FFFFFF",
//                     fontFamily: "'Playfair Display', serif",
//                     fontWeight: 500,
//                     mb: 3,
//                   }}
//                 >
//                   See Enrolled Students
//                 </Typography>
//                 <TextField
//                   size="small"
//                   fullWidth
//                   variant="filled"
//                   placeholder="Classroom Name"
//                   value={classroomForStudents}
//                   onChange={(e) => setClassroomForStudents(e.target.value)}
//                   sx={{
//                     mb: 3,
//                     "& .MuiFilledInput-root": {
//                       backgroundColor: "rgba(255,255,255,0.1)",
//                       borderRadius: "12px",
//                       color: "#E0E0E0",
//                       fontFamily: "'Poppins', sans-serif",
//                       "&:hover": { backgroundColor: "rgba(255,255,255,0.15)" },
//                       "&.Mui-focused": {
//                         backgroundColor: "rgba(255,255,255,0.2)",
//                         boxShadow: "0 0 15px rgba(157, 68, 192, 0.3)",
//                       },
//                     },
//                   }}
//                 />
//                 <Button
//                   size="small"
//                   fullWidth
//                   variant="contained"
//                   onClick={getAllEnrolledStudents}
//                   sx={{
//                     py: 1.5,
//                     background: "linear-gradient(45deg, #9D44C0 0%, #6C3483 100%)",
//                     fontWeight: "500",
//                     letterSpacing: "2px",
//                     borderRadius: "12px",
//                     fontFamily: "'Poppins', sans-serif",
//                     color: "#FFFFFF",
//                     "&:hover": {
//                       background: "linear-gradient(45deg, #8E24AA 0%, #6A1B9A 100%)",
//                       transform: "translateY(-2px)",
//                     },
//                   }}
//                 >
//                   Get Enrolled Students
//                 </Button>
//                 {students.length > 0 ? (
//                   <List sx={{ mt: 2 }}>
//                     {students.map((student, index) => (
//                       <ListItem key={index}>
//                         <ListItemText
//                           primary={student}
//                           sx={{ color: "#E0E0E0", fontFamily: "'Poppins', sans-serif" }}
//                         />
//                       </ListItem>
//                     ))}
//                   </List>
//                 ) : (
//                   <Typography
//                     variant="body2"
//                     sx={{ mt: 2, color: "#9D44C0", textAlign: "center" }}
//                   >
//                     No students enrolled.
//                   </Typography>
//                 )}
//               </CardContent>
//             </Card>
//           </Slide>

//           {/* Create Assignment Section */}
//           <Slide direction="up" in={true} timeout={1000} style={{ transitionDelay: "800ms" }}>
//             <Card
//               className="neon-glow"
//               sx={{
//                 backgroundColor: "rgba(26, 0, 51, 0.85)",
//                 borderRadius: "24px",
//                 border: "1px solid rgba(157, 68, 192, 0.4)",
//               }}
//             >
//               <CardContent sx={{ p: 4 }}>
//                 <Typography
//                   variant="h5"
//                   sx={{
//                     color: "#FFFFFF",
//                     fontFamily: "'Playfair Display', serif",
//                     fontWeight: 500,
//                     mb: 3,
//                   }}
//                 >
//                   Create an Assignment
//                 </Typography>
//                 <TextField
//                   label="Title"
//                   value={title}
//                   onChange={(e) => setTitle(e.target.value)}
//                   fullWidth
//                   variant="filled"
//                   sx={{
//                     mb: 3,
//                     "& .MuiFilledInput-root": {
//                       backgroundColor: "rgba(255,255,255,0.1)",
//                       borderRadius: "12px",
//                       color: "#E0E0E0",
//                       fontFamily: "'Poppins', sans-serif",
//                       "&:hover": { backgroundColor: "rgba(255,255,255,0.15)" },
//                       "&.Mui-focused": {
//                         backgroundColor: "rgba(255,255,255,0.2)",
//                         boxShadow: "0 0 15px rgba(157, 68, 192, 0.3)",
//                       },
//                     },
//                     "& .MuiInputLabel-root": {
//                       color: "#C0C0C0",
//                       fontFamily: "'Poppins', sans-serif",
//                     },
//                   }}
//                 />
//                 <TextField
//                   label="Description"
//                   value={description}
//                   onChange={(e) => setDescription(e.target.value)}
//                   fullWidth
//                   variant="filled"
//                   sx={{
//                     mb: 3,
//                     "& .MuiFilledInput-root": {
//                       backgroundColor: "rgba(255,255,255,0.1)",
//                       borderRadius: "12px",
//                       color: "#E0E0E0",
//                       fontFamily: "'Poppins', sans-serif",
//                       "&:hover": { backgroundColor: "rgba(255,255,255,0.15)" },
//                       "&.Mui-focused": {
//                         backgroundColor: "rgba(255,255,255,0.2)",
//                         boxShadow: "0 0 15px rgba(157, 68, 192, 0.3)",
//                       },
//                     },
//                     "& .MuiInputLabel-root": {
//                       color: "#C0C0C0",
//                       fontFamily: "'Poppins', sans-serif",
//                     },
//                   }}
//                 />
//                 <Select
//                   fullWidth
//                   value={submissionType}
//                   onChange={(e) => setSubmissionType(e.target.value)}
//                   variant="filled"
//                   sx={{
//                     mb: 3,
//                     backgroundColor: "rgba(255,255,255,0.1)",
//                     borderRadius: "12px",
//                     color: "#E0E0E0",
//                     fontFamily: "'Poppins', sans-serif",
//                     "&:hover": { backgroundColor: "rgba(255,255,255,0.15)" },
//                     "&.Mui-focused": {
//                       backgroundColor: "rgba(255,255,255,0.2)",
//                       boxShadow: "0 0 15px rgba(157, 68, 192, 0.3)",
//                     },
//                     "& .MuiSvgIcon-root": { color: "#9D44C0" },
//                   }}
//                 >
//                   <MenuItem value="text">Text</MenuItem>
//                   <MenuItem value="file">File Upload</MenuItem>
//                   <MenuItem value="link">Link Submission</MenuItem>
//                   <MenuItem value="multiple_choice">Multiple Choice</MenuItem>
//                 </Select>
//                 <TextField
//                   type="date"
//                   label="Due Date"
//                   value={dueDate}
//                   onChange={(e) => setDueDate(e.target.value)}
//                   fullWidth
//                   variant="filled"
//                   InputLabelProps={{ shrink: true }}
//                   sx={{
//                     mb: 3,
//                     "& .MuiFilledInput-root": {
//                       backgroundColor: "rgba(255,255,255,0.1)",
//                       borderRadius: "12px",
//                       color: "#E0E0E0",
//                       fontFamily: "'Poppins', sans-serif",
//                       "&:hover": { backgroundColor: "rgba(255,255,255,0.15)" },
//                       "&.Mui-focused": {
//                         backgroundColor: "rgba(255,255,255,0.2)",
//                         boxShadow: "0 0 15px rgba(157, 68, 192, 0.3)",
//                       },
//                     },
//                     "& .MuiInputLabel-root": {
//                       color: "#C0C0C0",
//                       fontFamily: "'Poppins', sans-serif",
//                     },
//                   }}
//                 />
//                 <TextField
//                   label="Course ID"
//                   value={coursef}
//                   onChange={(e) => setCourseF(e.target.value)}
//                   fullWidth
//                   variant="filled"
//                   sx={{
//                     mb: 3,
//                     "& .MuiFilledInput-root": {
//                       backgroundColor: "rgba(255,255,255,0.1)",
//                       borderRadius: "12px",
//                       color: "#E0E0E0",
//                       fontFamily: "'Poppins', sans-serif",
//                       "&:hover": { backgroundColor: "rgba(255,255,255,0.15)" },
//                       "&.Mui-focused": {
//                         backgroundColor: "rgba(255,255,255,0.2)",
//                         boxShadow: "0 0 15px rgba(157, 68, 192, 0.3)",
//                       },
//                     },
//                     "& .MuiInputLabel-root": {
//                       color: "#C0C0C0",
//                       fontFamily: "'Poppins', sans-serif",
//                     },
//                   }}
//                 />
//                 <Button
//                   onClick={handleSubmit}
//                   variant="contained"
//                   fullWidth
//                   sx={{
//                     py: 1.5,
//                     background: "linear-gradient(45deg, #9D44C0 0%, #6C3483 100%)",
//                     fontWeight: "500",
//                     letterSpacing: "2px",
//                     borderRadius: "12px",
//                     fontFamily: "'Poppins', sans-serif",
//                     color: "#FFFFFF",
//                     "&:hover": {
//                       background: "linear-gradient(45deg, #8E24AA 0%, #6A1B9A 100%)",
//                       transform: "translateY(-2px)",
//                     },
//                   }}
//                 >
//                   Create Assignment
//                 </Button>
//                 <TextField
//                   label="Course ID for Assignments"
//                   value={course_id}
//                   onChange={(e) => setCourseId(e.target.value)}
//                   fullWidth
//                   variant="filled"
//                   sx={{
//                     mt: 3,
//                     mb: 3,
//                     "& .MuiFilledInput-root": {
//                       backgroundColor: "rgba(255,255,255,0.1)",
//                       borderRadius: "12px",
//                       color: "#E0E0E0",
//                       fontFamily: "'Poppins', sans-serif",
//                       "&:hover": { backgroundColor: "rgba(255,255,255,0.15)" },
//                       "&.Mui-focused": {
//                         backgroundColor: "rgba(255,255,255,0.2)",
//                         boxShadow: "0 0 15px rgba(157, 68, 192, 0.3)",
//                       },
//                     },
//                     "& .MuiInputLabel-root": {
//                       color: "#C0C0C0",
//                       fontFamily: "'Poppins', sans-serif",
//                     },
//                   }}
//                 />
//                 <Button
//                   onClick={seeAssignments}
//                   variant="contained"
//                   fullWidth
//                   sx={{
//                     py: 1.5,
//                     background: "linear-gradient(45deg, #9D44C0 0%, #6C3483 100%)",
//                     fontWeight: "500",
//                     letterSpacing: "2px",
//                     borderRadius: "12px",
//                     fontFamily: "'Poppins', sans-serif",
//                     color: "#FFFFFF",
//                     "&:hover": {
//                       background: "linear-gradient(45deg, #8E24AA 0%, #6A1B9A 100%)",
//                       transform: "translateY(-2px)",
//                     },
//                   }}
//                 >
//                   See Assignments
//                 </Button>
//                 {assignments.length > 0 ? (
//                   <List sx={{ mt: 2 }}>
//                     {assignments.map((assignment) => (
//                       <ListItem key={assignment._id}>
//                         <ListItemText
//                           primary={`ID:${assignment._id}::${assignment.title} - Due: ${assignment.due_date}`}
//                           sx={{ color: "#E0E0E0", fontFamily: "'Poppins', sans-serif" }}
//                         /> <button onClick={() => navigate(`/seesubmissions/${assignment._id}?token=${token}`)}>Submissions</button>
//                       </ListItem>
//                     ))}
//                   </List>
//                 ) : (
//                   <Typography
//                     variant="body2"
//                     sx={{ mt: 2, color: "#9D44C0", textAlign: "center" }}
//                   >
//                     No assignments found.
//                   </Typography>
//                 )}
//                 <TextField
//                   label="Course ID for Assignments notification"
//                   value={course_id}
//                   onChange={(e) => setCourseId(e.target.value)}
//                   fullWidth
//                   variant="filled"
//                   sx={{
//                     mt: 3,
//                     mb: 3,
//                     "& .MuiFilledInput-root": {
//                       backgroundColor: "rgba(255,255,255,0.1)",
//                       borderRadius: "12px",
//                       color: "#E0E0E0",
//                       fontFamily: "'Poppins', sans-serif",
//                       "&:hover": { backgroundColor: "rgba(255,255,255,0.15)" },
//                       "&.Mui-focused": {
//                         backgroundColor: "rgba(255,255,255,0.2)",
//                         boxShadow: "0 0 15px rgba(157, 68, 192, 0.3)",
//                       },
//                     },
//                     "& .MuiInputLabel-root": {
//                       color: "#C0C0C0",
//                       fontFamily: "'Poppins', sans-serif",
//                     },
//                   }}
//                 />
//                 <TextField
//                   label="Assignment ID for Assignments notification"
//                   value={assignmentid}
//                   onChange={(e) => setAssignmentId(e.target.value)}
//                   fullWidth
//                   variant="filled"
//                   sx={{
//                     mt: 3,
//                     mb: 3,
//                     "& .MuiFilledInput-root": {
//                       backgroundColor: "rgba(255,255,255,0.1)",
//                       borderRadius: "12px",
//                       color: "#E0E0E0",
//                       fontFamily: "'Poppins', sans-serif",
//                       "&:hover": { backgroundColor: "rgba(255,255,255,0.15)" },
//                       "&.Mui-focused": {
//                         backgroundColor: "rgba(255,255,255,0.2)",
//                         boxShadow: "0 0 15px rgba(157, 68, 192, 0.3)",
//                       },
//                     },
//                     "& .MuiInputLabel-root": {
//                       color: "#C0C0C0",
//                       fontFamily: "'Poppins', sans-serif",
//                     },
//                   }}
//                 />
//                 <Button
//                   onClick={notifyStudents}
//                   variant="contained"
//                   fullWidth
//                   sx={{
//                     mt: 3,
//                     py: 1.5,
//                     background: "linear-gradient(45deg, #9D44C0 0%, #6C3483 100%)",
//                     fontWeight: "500",
//                     letterSpacing: "2px",
//                     borderRadius: "12px",
//                     fontFamily: "'Poppins', sans-serif",
//                     color: "#FFFFFF",
//                     "&:hover": {
//                       background: "linear-gradient(45deg, #8E24AA 0%, #6A1B9A 100%)",
//                       transform: "translateY(-2px)",
//                     },
//                   }}
//                 >
//                   Notify All Students
//                 </Button>
//               </CardContent>
//             </Card>
//           </Slide>
//         </Container>
//       </Box>
//     </>
//   );
// }



























import { useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Container,
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
} from "@mui/material";
import { School, Person, CalendarToday, Assignment } from "@mui/icons-material";

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
  }

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
      const response = await axios.get(`http://127.0.0.1:8000/notify_all/${course_id}/${assignmentid}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      setMessage(`${response.data.status}`);
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

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Poppins:wght@300;400;500;600&display=swap');
          
          .gradient-bg {
            background: linear-gradient(-45deg, #1a0033, #2a0944, #3b185f, #240046);
            background-size: 400% 400%;
            animation: gradientFlow 15s ease infinite;
          }

          @keyframes gradientFlow {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }

          .neon-glow {
            box-shadow: 0 0 30px rgba(157, 68, 192, 0.3);
            transition: all 0.4s ease;
          }

          .neon-glow:hover {
            box-shadow: 0 0 40px rgba(157, 68, 192, 0.5);
          }

          html, body {
            margin: 0;
            padding: 0;
            height: 100%;
            width: 100%;
            overflow: hidden;
          }
        `}
      </style>

      <Box sx={{ flexGrow: 1 }}>
        <AppBar 
          position="fixed" 
          sx={{ 
            background: "linear-gradient(45deg, #9D44C0 0%, #6C3483 100%)",
            boxShadow: "0 0 20px rgba(157, 68, 192, 0.5)"
          }}
        >
          <Toolbar>
            <Typography 
              variant="h6" 
              component="div" 
              sx={{ 
                flexGrow: 1, 
                fontFamily: "'Playfair Display', serif",
                color: "#FFFFFF"
              }}
            >
              Teacher Dashboard
            </Typography>
            <Button 
              color="inherit" 
              onClick={() => scrollToSection('teacher-details')}
              sx={{ fontFamily: "'Poppins', sans-serif", mx: 1 }}
            >
              Profile
            </Button>
            <Button 
              color="inherit" 
              onClick={() => scrollToSection('create-classroom')}
              sx={{ fontFamily: "'Poppins', sans-serif", mx: 1 }}
            >
              Create Course
            </Button>
            <Button 
              color="inherit" 
              onClick={() => scrollToSection('create-meeting')}
              sx={{ fontFamily: "'Poppins', sans-serif", mx: 1 }}
            >
              Meetings
            </Button>
            <Button 
              color="inherit" 
              onClick={() => scrollToSection('enrolled-students')}
              sx={{ fontFamily: "'Poppins', sans-serif", mx: 1 }}
            >
              Students
            </Button>
            <Button 
              color="inherit" 
              onClick={() => scrollToSection('create-assignment')}
              sx={{ fontFamily: "'Poppins', sans-serif", mx: 1 }}
            >
              Assignments
            </Button>
          </Toolbar>
        </AppBar>

        <Box
          sx={{
            // height: "100vh",
            height: "calc(100vh - 64px)", // Adjusted for AppBar height
            width: "100vw",
            py: 4,
            px: 2,
            m: 0,
            background: "#0a0013",
            position: "fixed",
            top: 64, // Adjusted for AppBar height
            left: 0,
            overflow: "auto",
            // minHeight: "100vh", // Ensures it takes at least full height but can grow
          }}
        >
          <Container maxWidth="md">
            <Fade in={true} timeout={1000}>
              <Box sx={{ textAlign: "center", mb: 6, mt: 2 }}>
                <School
                  sx={{
                    fontSize: 40,
                    color: "#9D44C0",
                    mb: 2,
                    filter: "drop-shadow(0 0 10px rgba(157, 68, 192, 0.5))",
                  }}
                />
                <Typography
                  variant="h3"
                  sx={{
                    color: "#FFFFFF",
                    fontFamily: "'Playfair Display', serif",
                    fontWeight: 600,
                    letterSpacing: "2px",
                  }}
                >

                  Schedule class
                </Button>
              </CardContent>
            </Card>
          </Slide>

          {/* Enrolled Students Section */}
          <Slide direction="up" in={true} timeout={1000} style={{ transitionDelay: "600ms" }}>
            <Card
              className="neon-glow"
              sx={{
                mb: 4,
                backgroundColor: "rgba(26, 0, 51, 0.85)",
                borderRadius: "24px",
                border: "1px solid rgba(157, 68, 192, 0.4)",
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Typography
                  variant="h5"
                  sx={{
                    color: "#FFFFFF",
                    fontFamily: "'Playfair Display', serif",
                    fontWeight: 500,
                    mb: 3,
                  }}
                >
                  See Enrolled Students

                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#BBBBBB",
                    fontFamily: "'Poppins', sans-serif",
                    fontWeight: 300,
                    mt: 1,
                  }}
                >
                  Manage your classrooms, assignments, and students
                </Typography>
              </Box>
            </Fade>

            {/* Teacher Details Section */}
            <div id="teacher-details">
              <Slide direction="up" in={true} timeout={1000}>
                <Card
                  className="neon-glow"
                  sx={{
                    mb: 4,
                    backgroundColor: "rgba(26, 0, 51, 0.85)",
                    borderRadius: "24px",
                    border: "1px solid rgba(157, 68, 192, 0.4)",
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Typography
                      variant="h5"
                      sx={{
                        color: "#FFFFFF",
                        fontFamily: "'Playfair Display', serif",
                        fontWeight: 500,
                        mb: 3,
                      }}
                    >
                      <Person sx={{ mr: 1, verticalAlign: "middle" }} />
                      Teacher Details
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{ color: "#E0E0E0", fontFamily: "'Poppins', sans-serif", mb: 2 }}
                    >
                      <strong>Name:</strong> {teacherDetails.name}
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{ color: "#E0E0E0", fontFamily: "'Poppins', sans-serif", mb: 2 }}
                    >
                      <strong>Email:</strong> {teacherDetails.email}
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{ color: "#E0E0E0", fontFamily: "'Poppins', sans-serif", mb: 2 }}
                    >
                      <strong>Courses:</strong> {teacherDetails.courses.join(", ")}
                    </Typography>
                  </CardContent>
                </Card>
              </Slide>
            </div>

            {/* Create Classroom Section */}
            <div id="create-classroom">
              <Slide direction="up" in={true} timeout={1000} style={{ transitionDelay: "200ms" }}>
                <Card
                  className="neon-glow"
                  sx={{
                    mb: 4,
                    backgroundColor: "rgba(26, 0, 51, 0.85)",
                    borderRadius: "24px",
                    border: "1px solid rgba(157, 68, 192, 0.4)",
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Typography
                      variant="h5"
                      sx={{
                        color: "#FFFFFF",
                        fontFamily: "'Playfair Display', serif",
                        fontWeight: 500,
                        mb: 3,
                      }}
                    >
                      <Assignment sx={{ mr: 1, verticalAlign: "middle" }} />
                      Create a Course
                    </Typography>
                    <TextField
                      size="small"
                      fullWidth
                      variant="filled"
                      placeholder="Classroom Name"
                      value={classroomName}
                      onChange={(e) => setClassroomName(e.target.value)}
                      sx={{
                        mb: 3,
                        "& .MuiFilledInput-root": {
                          backgroundColor: "rgba(255,255,255,0.1)",
                          borderRadius: "12px",
                          color: "#E0E0E0",
                          fontFamily: "'Poppins', sans-serif",
                          "&:hover": { backgroundColor: "rgba(255,255,255,0.15)" },
                          "&.Mui-focused": {
                            backgroundColor: "rgba(255,255,255,0.2)",
                            boxShadow: "0 0 15px rgba(157, 68, 192, 0.3)",
                          },
                        },
                      }}
                    />
                    <Button
                      size="small"
                      fullWidth
                      variant="contained"
                      onClick={handleCreateClassroom}
                      sx={{
                        py: 1.5,
                        background: "linear-gradient(45deg, #9D44C0 0%, #6C3483 100%)",
                        fontWeight: "500",
                        letterSpacing: "2px",
                        borderRadius: "12px",
                        fontFamily: "'Poppins', sans-serif",
                        color: "#FFFFFF",
                        "&:hover": {
                          background: "linear-gradient(45deg, #8E24AA 0%, #6A1B9A 100%)",
                          transform: "translateY(-2px)",
                        },
                      }}
                    >
                      Create Classroom
                    </Button>
                    {message && (
                      <Typography
                        variant="caption"
                        sx={{ mt: 2, color: "#9D44C0", display: "block" }}
                      >
                        {message}
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Slide>
            </div>

            {/* Create Meeting Section */}
            <div id="create-meeting">
              <Slide direction="up" in={true} timeout={1000} style={{ transitionDelay: "400ms" }}>
                <Card
                  className="neon-glow"
                  sx={{
                    mb: 4,
                    backgroundColor: "rgba(26, 0, 51, 0.85)",
                    borderRadius: "24px",
                    border: "1px solid rgba(157, 68, 192, 0.4)",
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Typography
                      variant="h5"
                      sx={{
                        color: "#FFFFFF",
                        fontFamily: "'Playfair Display', serif",
                        fontWeight: 500,
                        mb: 3,
                      }}
                    >
                      <CalendarToday sx={{ mr: 1, verticalAlign: "middle" }} />
                      Create Meeting
                    </Typography>
                    <Button
                      size="small"
                      fullWidth
                      variant="contained"
                      onClick={createMeeting}
                      sx={{
                        py: 1.5,
                        background: "linear-gradient(45deg, #9D44C0 0%, #6C3483 100%)",
                        fontWeight: "500",
                        letterSpacing: "2px",
                        borderRadius: "12px",
                        fontFamily: "'Poppins', sans-serif",
                        color: "#FFFFFF",
                        "&:hover": {
                          background: "linear-gradient(45deg, #8E24AA 0%, #6A1B9A 100%)",
                          transform: "translateY(-2px)",
                        },
                      }}
                    >
                      Schedule a Meeting
                    </Button>
                  </CardContent>
                </Card>
              </Slide>
            </div>

            {/* Enrolled Students Section */}
            <div id="enrolled-students">
              <Slide direction="up" in={true} timeout={1000} style={{ transitionDelay: "600ms" }}>
                <Card
                  className="neon-glow"
                  sx={{
                    mb: 4,
                    backgroundColor: "rgba(26, 0, 51, 0.85)",
                    borderRadius: "24px",
                    border: "1px solid rgba(157, 68, 192, 0.4)",
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Typography
                      variant="h5"
                      sx={{
                        color: "#FFFFFF",
                        fontFamily: "'Playfair Display', serif",
                        fontWeight: 500,
                        mb: 3,
                      }}
                    >
                      See Enrolled Students
                    </Typography>
                    <TextField
                      size="small"
                      fullWidth
                      variant="filled"
                      placeholder="Classroom Name"
                      value={classroomForStudents}
                      onChange={(e) => setClassroomForStudents(e.target.value)}
                      sx={{
                        mb: 3,
                        "& .MuiFilledInput-root": {
                          backgroundColor: "rgba(255,255,255,0.1)",
                          borderRadius: "12px",
                          color: "#E0E0E0",
                          fontFamily: "'Poppins', sans-serif",
                          "&:hover": { backgroundColor: "rgba(255,255,255,0.15)" },
                          "&.Mui-focused": {
                            backgroundColor: "rgba(255,255,255,0.2)",
                            boxShadow: "0 0 15px rgba(157, 68, 192, 0.3)",
                          },
                        },
                      }}
                    />
                    <Button
                      size="small"
                      fullWidth
                      variant="contained"
                      onClick={getAllEnrolledStudents}
                      sx={{
                        py: 1.5,
                        background: "linear-gradient(45deg, #9D44C0 0%, #6C3483 100%)",
                        fontWeight: "500",
                        letterSpacing: "2px",
                        borderRadius: "12px",
                        fontFamily: "'Poppins', sans-serif",
                        color: "#FFFFFF",
                        "&:hover": {
                          background: "linear-gradient(45deg, #8E24AA 0%, #6A1B9A 100%)",
                          transform: "translateY(-2px)",
                        },
                      }}
                    >
                      Get Enrolled Students
                    </Button>
                    {students.length > 0 ? (
                      <List sx={{ mt: 2 }}>
                        {students.map((student, index) => (
                          <ListItem key={index}>
                            <ListItemText
                              primary={student}
                              sx={{ color: "#E0E0E0", fontFamily: "'Poppins', sans-serif" }}
                            />
                          </ListItem>
                        ))}
                      </List>
                    ) : (
                      <Typography
                        variant="body2"
                        sx={{ mt: 2, color: "#9D44C0", textAlign: "center" }}
                      >
                        No students enrolled.
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Slide>
            </div>

            {/* Create Assignment Section */}
            <div id="create-assignment">
              <Slide direction="up" in={true} timeout={1000} style={{ transitionDelay: "800ms" }}>
                <Card
                  className="neon-glow"
                  sx={{
                    backgroundColor: "rgba(26, 0, 51, 0.85)",
                    borderRadius: "24px",
                    border: "1px solid rgba(157, 68, 192, 0.4)",
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Typography
                      variant="h5"
                      sx={{
                        color: "#FFFFFF",
                        fontFamily: "'Playfair Display', serif",
                        fontWeight: 500,
                        mb: 3,
                      }}
                    >
                      Create an Assignment
                    </Typography>
                    <TextField
                      label="Title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      fullWidth
                      variant="filled"
                      sx={{
                        mb: 3,
                        "& .MuiFilledInput-root": {
                          backgroundColor: "rgba(255,255,255,0.1)",
                          borderRadius: "12px",
                          color: "#E0E0E0",
                          fontFamily: "'Poppins', sans-serif",
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
                      label="Description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      fullWidth
                      variant="filled"
                      sx={{
                        mb: 3,
                        "& .MuiFilledInput-root": {
                          backgroundColor: "rgba(255,255,255,0.1)",
                          borderRadius: "12px",
                          color: "#E0E0E0",
                          fontFamily: "'Poppins', sans-serif",
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
                        backgroundColor: "rgba(255,255,255,0.1)",
                        borderRadius: "12px",
                        color: "#E0E0E0",
                        fontFamily: "'Poppins', sans-serif",
                        "&:hover": { backgroundColor: "rgba(255,255,255,0.15)" },
                        "&.Mui-focused": {
                          backgroundColor: "rgba(255,255,255,0.2)",
                          boxShadow: "0 0 15px rgba(157, 68, 192, 0.3)",
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
                      type="date"
                      label="Due Date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      fullWidth
                      variant="filled"
                      InputLabelProps={{ shrink: true }}
                      sx={{
                        mb: 3,
                        "& .MuiFilledInput-root": {
                          backgroundColor: "rgba(255,255,255,0.1)",
                          borderRadius: "12px",
                          color: "#E0E0E0",
                          fontFamily: "'Poppins', sans-serif",
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
                      label="Course ID"
                      value={coursef}
                      onChange={(e) => setCourseF(e.target.value)}
                      fullWidth
                      variant="filled"
                      sx={{
                        mb: 3,
                        "& .MuiFilledInput-root": {
                          backgroundColor: "rgba(255,255,255,0.1)",
                          borderRadius: "12px",
                          color: "#E0E0E0",
                          fontFamily: "'Poppins', sans-serif",
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
                      onClick={handleSubmit}
                      variant="contained"
                      fullWidth
                      sx={{
                        py: 1.5,
                        background: "linear-gradient(45deg, #9D44C0 0%, #6C3483 100%)",
                        fontWeight: "500",
                        letterSpacing: "2px",
                        borderRadius: "12px",
                        fontFamily: "'Poppins', sans-serif",
                        color: "#FFFFFF",
                        "&:hover": {
                          background: "linear-gradient(45deg, #8E24AA 0%, #6A1B9A 100%)",
                          transform: "translateY(-2px)",
                        },
                      }}
                    >
                      Create Assignment
                    </Button>
                    <TextField
                      label="Course ID for Assignments"
                      value={course_id}
                      onChange={(e) => setCourseId(e.target.value)}
                      fullWidth
                      variant="filled"
                      sx={{
                        mt: 3,
                        mb: 3,
                        "& .MuiFilledInput-root": {
                          backgroundColor: "rgba(255,255,255,0.1)",
                          borderRadius: "12px",
                          color: "#E0E0E0",
                          fontFamily: "'Poppins', sans-serif",
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
                      onClick={seeAssignments}
                      variant="contained"
                      fullWidth
                      sx={{
                        py: 1.5,
                        background: "linear-gradient(45deg, #9D44C0 0%, #6C3483 100%)",
                        fontWeight: "500",
                        letterSpacing: "2px",
                        borderRadius: "12px",
                        fontFamily: "'Poppins', sans-serif",
                        color: "#FFFFFF",
                        "&:hover": {
                          background: "linear-gradient(45deg, #8E24AA 0%, #6A1B9A 100%)",
                          transform: "translateY(-2px)",
                        },
                      }}
                    >
                      See Assignments
                    </Button>
                    {assignments.length > 0 ? (
                      <List sx={{ mt: 2 }}>
                        {assignments.map((assignment) => (
                          <ListItem key={assignment._id}>
                            <ListItemText
                              primary={`ID:${assignment._id}::${assignment.title} - Due: ${assignment.due_date}`}
                              sx={{ color: "#E0E0E0", fontFamily: "'Poppins', sans-serif" }}
                            /> 
                            <button onClick={() => navigate(`/seesubmissions/${assignment._id}?token=${token}`)}>
                              Submissions
                            </button>
                          </ListItem>
                        ))}
                      </List>
                    ) : (
                      <Typography
                        variant="body2"
                        sx={{ mt: 2, color: "#9D44C0", textAlign: "center" }}
                      >
                        No assignments found.
                      </Typography>
                    )}
                    <TextField
                      label="Course ID for Assignments notification"
                      value={course_id}
                      onChange={(e) => setCourseId(e.target.value)}
                      fullWidth
                      variant="filled"
                      sx={{
                        mt: 3,
                        mb: 3,
                        "& .MuiFilledInput-root": {
                          backgroundColor: "rgba(255,255,255,0.1)",
                          borderRadius: "12px",
                          color: "#E0E0E0",
                          fontFamily: "'Poppins', sans-serif",
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
                      label="Assignment ID for Assignments notification"
                      value={assignmentid}
                      onChange={(e) => setAssignmentId(e.target.value)}
                      fullWidth
                      variant="filled"
                      sx={{
                        mt: 3,
                        mb: 3,
                        "& .MuiFilledInput-root": {
                          backgroundColor: "rgba(255,255,255,0.1)",
                          borderRadius: "12px",
                          color: "#E0E0E0",
                          fontFamily: "'Poppins', sans-serif",
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
                      onClick={notifyStudents}
                      variant="contained"
                      fullWidth
                      sx={{
                        mt: 3,
                        py: 1.5,
                        background: "linear-gradient(45deg, #9D44C0 0%, #6C3483 100%)",
                        fontWeight: "500",
                        letterSpacing: "2px",
                        borderRadius: "12px",
                        fontFamily: "'Poppins', sans-serif",
                        color: "#FFFFFF",
                        "&:hover": {
                          background: "linear-gradient(45deg, #8E24AA 0%, #6A1B9A 100%)",
                          transform: "translateY(-2px)",
                        },
                      }}
                    >
                      Notify All Students
                    </Button>
                  </CardContent>
                </Card>
              </Slide>
            </div>
          </Container>
        </Box>
      </Box>
    </>
  );
}