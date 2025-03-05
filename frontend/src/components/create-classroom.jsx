// import React, { useState } from "react";
// import axios from "axios";
// import { useLocation } from "react-router-dom";
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
// } from "@mui/material";
// import { School } from "@mui/icons-material";

// export default function TeacherDashboard() {
//   const location = useLocation();
//   const params = new URLSearchParams(location.search);
//   const token = params.get("token");

//   const [classroomName, setClassroomName] = useState("");
//   const [message, setMessage] = useState("");
//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [submissionType, setSubmissionType] = useState("text");
//   const [dueDate, setDueDate] = useState("");
//   const [courseId, setCourseId] = useState("");

//   const seeAssignments = async () => {
//     try {
//       const response = await axios.get(`http://127.0.0.1:8000/assignments/${courseId}`);
//       console.log(response.data);
//     } catch (error) {
//       console.error(error);
//       setMessage("Error fetching assignments.");
//     }
//   };

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
//           course_id: courseId,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );
//       setMessage(`Assignment created successfully! ID: ${response.data.assignment_id}`);
//     } catch (error) {
//       setMessage("Error creating assignment");
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
//         `}
//       </style>

//       <Box
//         sx={{
//           minHeight: "100vh",
//           py: 4,
//           px: 2,
//           background: "#0a0013",
//           position: "relative",
//           overflow: "hidden",
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
//                 Manage your classrooms and assignments
//               </Typography>
//             </Box>
//           </Fade>

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
//                     "& .MuiInputLabel-root": {
//                       color: "#C0C0C0",
//                       fontFamily: "'Poppins', sans-serif",
//                     },
//                   }}
//                 />
//                 <Button
//                   size="small"
//                   fullWidth
//                   variant="contained"
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

//           <Slide direction="up" in={true} timeout={1000} style={{ transitionDelay: "200ms" }}>
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
//                     "& .MuiSvgIcon-root": {
//                       color: "#9D44C0",
//                     },
//                   }}
//                 >
//                   <MenuItem value="text">Text</MenuItem>
//                   <MenuItem value="file">File Upload</MenuItem>
//                   <MenuItem value="link">Link Submission</MenuItem>
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
//                   value={courseId}
//                   onChange={(e) => setCourseId(e.target.value)}
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
//                 {message && (
//                   <Typography
//                     variant="body2"
//                     sx={{ mt: 2, color: "#9D44C0", textAlign: "center" }}
//                   >
//                     {message}
//                   </Typography>
//                 )}
//               </CardContent>
//             </Card>
//           </Slide>
//         </Container>
//       </Box>
//     </>
//   );
// }







// import React, { useState } from "react";
// import axios from "axios";
// import { useLocation } from "react-router-dom";
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
// } from "@mui/material";
// import { School } from "@mui/icons-material";

// export default function TeacherDashboard() {
//   const location = useLocation();
//   const params = new URLSearchParams(location.search);
//   const token = params.get("token");

//   const [classroomName, setClassroomName] = useState("");
//   const [message, setMessage] = useState("");
//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [submissionType, setSubmissionType] = useState("text");
//   const [dueDate, setDueDate] = useState("");
//   const [courseId, setCourseId] = useState("");

//   const seeAssignments = async () => {
//     try {
//       const response = await axios.get(`http://127.0.0.1:8000/assignments/${courseId}`);
//       console.log(response.data);
//     } catch (error) {
//       console.error(error);
//       setMessage("Error fetching assignments.");
//     }
//   };

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
//           course_id: courseId,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );
//       setMessage(`Assignment created successfully! ID: ${response.data.assignment_id}`);
//       console.log(`Assignment created successfully! ID: ${response.data.assignment_id}`);
//     } catch (error) {
//       setMessage("Error creating assignment");
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
//         `}
//       </style>

//       <Box
//         sx={{
//           minHeight: "100vh",
//           height: "100vh",           // Added to ensure full height
//           width: "100vw",            // Added to ensure full width
//           py: 4,
//           px: 2,
//           background: "#0a0013",
//           position: "fixed",         // Changed to fixed to fill screen
//           top: 0,
//           left: 0,
//           overflowY: "auto",         // Allows scrolling if content overflows
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
//                 Manage your classrooms and assignments
//               </Typography>
//             </Box>
//           </Fade>

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
//                     "& .MuiInputLabel-root": {
//                       color: "#C0C0C0",
//                       fontFamily: "'Poppins', sans-serif",
//                     },
//                   }}
//                 />
//                 <Button
//                   size="small"
//                   fullWidth
//                   variant="contained"
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

//           <Slide direction="up" in={true} timeout={1000} style={{ transitionDelay: "200ms" }}>
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
//                     "& .MuiSvgIcon-root": {
//                       color: "#9D44C0",
//                     },
//                   }}
//                 >
//                   <MenuItem value="text">Text</MenuItem>
//                   <MenuItem value="file">File Upload</MenuItem>
//                   <MenuItem value="link">Link Submission</MenuItem>
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
//                   value={courseId}
//                   onChange={(e) => setCourseId(e.target.value)}
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
//                 <Box sx={{ display: "flex", gap: 2 }}>
//                   <Button
//                     onClick={handleSubmit}
//                     variant="contained"
//                     fullWidth
//                     sx={{
//                       py: 1.5,
//                       background: "linear-gradient(45deg, #9D44C0 0%, #6C3483 100%)",
//                       fontWeight: "500",
//                       letterSpacing: "2px",
//                       borderRadius: "12px",
//                       fontFamily: "'Poppins', sans-serif",
//                       color: "#FFFFFF",
//                       "&:hover": {
//                         background: "linear-gradient(45deg, #8E24AA 0%, #6A1B9A 100%)",
//                         transform: "translateY(-2px)",
//                       },
//                     }}
//                   >
//                     Create Assignment
//                   </Button>
//                   <Button
//                     variant="contained"
//                     fullWidth
//                     sx={{
//                       py: 1.5,
//                       background: "linear-gradient(45deg, #9D44C0 0%, #6C3483 100%)",
//                       fontWeight: "500",
//                       letterSpacing: "2px",
//                       borderRadius: "12px",
//                       fontFamily: "'Poppins', sans-serif",
//                       color: "#FFFFFF",
//                       "&:hover": {
//                         background: "linear-gradient(45deg, #8E24AA 0%, #6A1B9A 100%)",
//                         transform: "translateY(-2px)",
//                       },
//                     }}
//                   >
//                     Notify All
//                   </Button>
//                 </Box>
//                 {message && (
//                   <Typography
//                     variant="body2"
//                     sx={{ mt: 2, color: "#9D44C0", textAlign: "center" }}
//                   >
//                     {message}
//                   </Typography>
//                 )}
//               </CardContent>
//             </Card>
//           </Slide>
//         </Container>
//       </Box>
//     </>
//   );
// }




// import { useState } from "react";
// import axios from "axios";
// import { useLocation } from "react-router-dom";

// export default function TeacherDashboard() {
//   const location = useLocation();
//   const params = new URLSearchParams(location.search);
  
//   const [classroomName, setClassroomName] = useState("");
//   const [classroomForStudents, setClassroomForStudents] = useState(""); // Separate state for fetching students
//   const [message, setMessage] = useState("");
//   const [userId, setUserId] = useState("");
//   const [notification, setNotification] = useState("");
//   const [status, setStatus] = useState("");
//   const [students, setStudents] = useState([]);
//   const [assignmentid, setAssignmentId] = useState("");
//   const token = params.get("token");

//     const [title, setTitle] = useState("");
//     const [description, setDescription] = useState("");
//     const [submissionType, setSubmissionType] = useState("text");
//     const [dueDate, setDueDate] = useState("");
//     const [messaget, setMessageT] = useState("");
//     const [coursef, setCourseF] = useState("");
//     const [assignments, setAssignments] = useState([]);
//     const [course_id, setCourseId] = useState("");
    
//     const seeAssignments = async () => {
//         try{
//             const response = await axios.get(`http:////127.0.0.1:8000/assignments/${course_id}`);
//             setAssignments(response.data);
//         }
//         catch (error) {
//             console.error(error);
//             setMessage("Error fetching assignments.");
//     }
//   }
//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         try {
//             const response = await axios.post( "http://127.0.0.1:8000/create_assignments", {
//                 title,
//                 description,
//                 submission_type: submissionType,
//                 due_date: dueDate,
//                 course_id: coursef
//             }, {
//               headers: {
//                 Authorization: `Bearer ${token}`,
//                 "Content-Type": "application/json",
//               },
//             });
//             setMessage(`Assignment created successfully! ID: ${response.data.assignment_id}`);
//             setAssignmentId(response.data.assignment_id);
//         } catch (error) {
//             setMessage("Error creating assignment");
//         }
//       }
//     const notifyStudents = async () => {
//         try {
//           const response = await axios.get(`http://127.0.0.1:8000/notify_all/${course_id}`, {
//             headers: {
//               Authorization: `Bearer ${token}`,
//               "Content-Type": "application/json",
//             },
//           });
//           setMessage(`${response.data.status}`);
//     }
//     catch (error) {
//       console.error(error); 
//     }
//   }
//   const getAllEnrolledStudents = async () => {
//     try {
//       if (!classroomForStudents) {
//         setMessage("Please enter a classroom name.");
//         return;
//       }
//       const response = await axios.get(
//         `http://127.0.0.1:8000/students_in_courses/${classroomForStudents}`
//       );
//       console.log(response.data);
      
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
//     <div className="flex flex-col items-center p-6 bg-gray-100 min-h-screen">
//       <h1 className="text-2xl font-bold mb-4">Teacher Dashboard</h1>

//       {/* Classroom Creation Section */}
//       <div className="mb-6 bg-white p-4 rounded shadow-md w-80">
//         <h2 className="text-lg font-semibold">Create a Course</h2>
//         <input
//           type="text"
//           placeholder="Classroom Name"
//           value={classroomName}
//           onChange={(e) => setClassroomName(e.target.value)}
//           className="p-2 border rounded w-full my-2"
//         />
//         <button
//           onClick={handleCreateClassroom}
//           className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 w-full"
//         >
//           Create Classroom
//         </button>
//         {message && <p className="text-sm text-gray-700 mt-2">{message}</p>}
//       </div>

//       {/* See Enrolled Students Section */}
//       <div className="mb-6 bg-white p-4 rounded shadow-md w-80">
//         <h2 className="text-lg font-semibold">See Enrolled Students</h2>
//         <input
//           type="text"
//           placeholder="Classroom Name"
//           value={classroomForStudents}
//           onChange={(e) => setClassroomForStudents(e.target.value)}
//           className="p-2 border rounded w-full my-2"
//         />
//         <button
//           onClick={getAllEnrolledStudents}
//           className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 w-full"
//         >
//           Get Enrolled Students
//         </button>

//         {/* Render Students List */}
//         {students.length > 0 ? (
//           <ul className="mt-2 text-gray-700">
//             {students.map((student, index) => (
//               <li key={index} className="p-2 border-b">{student}</li>
//             ))}
//           </ul>
//         ) : (
//           <p className="text-sm text-gray-700 mt-2">No students enrolled.</p>
//         )}
//       </div>

//       <div className="mb-6 bg-white p-4 rounded shadow-md w-80">
//         <h2 className="text-lg font-semibold">Create a Assignment</h2>

//         <input
//           type="text"
//           placeholder="Title"
//           value={title}
//           onChange={(e) => setTitle(e.target.value)}
//           className="p-2 border rounded w-full my-2"
//         />
//         <input
//           type="text"
//           placeholder="description"
//           value={description}
//           onChange={(e) => setDescription(e.target.value)}
//           className="p-2 border rounded w-full my-2"
//         />
//                     <select 
//                         value={submissionType} 
//                         onChange={(e) => setSubmissionType(e.target.value)} 
//                         className="w-full p-2 border rounded"
//                     >
//                         <option value="text">Text</option>
//                         <option value="file">File Upload</option>
//                         <option value="link">Link Submission</option>
//                         <option value="multiple_choice">Multiple Choice</option>
//                     </select>
//                     {submissionType === "file" && (
//                         <input type="file" className="w-full p-2 border rounded" />
//                     )}
//                     {submissionType === "link" && (
//                         <input type="url" placeholder="Enter link" className="w-full p-2 border rounded" />
//                     )}
//                     {submissionType === "multiple_choice" && (
//                         <textarea placeholder="Enter options separated by commas" className="w-full p-2 border rounded" />
//                     )}
//                     <input 
//                         type="date" 
//                         value={dueDate} 
//                         onChange={(e) => setDueDate(e.target.value)} 
//                         className="w-full p-2 border rounded"
//                     />
//                 <input
//           type="text"
//           placeholder="message"
//           value={messaget}
//           onChange={(e) => setMessageT(e.target.value)}
//           className="p-2 border rounded w-full my-2"
//         />
//                         <input
//           type="text"
//           placeholder="course id"
//           value={coursef}
//           onChange={(e) => setCourseF(e.target.value)}
//           className="p-2 border rounded w-full my-2"
//         />
//         <button
//           onClick={handleSubmit}
//           className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 w-full"
//         >
//           Create Assignment
//         </button>

//         {message && <p className="text-sm text-gray-700 mt-2">{message}</p>}
//         <input
//           type="text"
//           placeholder="course id"
//           value={course_id}
//           onChange={(e) => setCourseId(e.target.value)}
//           className="p-2 border rounded w-full my-2"
//         />
//         <button
//           onClick={seeAssignments}
//           className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 w-full"
//         >See Assignments
//         </button>
//           {assignments.length > 0 ? (
//                     <ul className="mt-2 text-gray-700">
//                         {assignments.map((assignment) => (
//                             <li key={assignment._id} className="p-2 border-b">
//                                 <strong>{assignment.title}</strong> - Due: {assignment.due_date}
//                             </li>
//                         ))}
//                     </ul>
//                 ) : (
//                     <p className="text-sm text-gray-700 mt-2">No assignments found.</p>
//                 )}
        
//       </div>
//       <button
//           onClick={notifyStudents}
//           className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 w-full"
//         >
//           Notify all students
//         </button>
//     </div>
//   );
// }







import { useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
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
} from "@mui/material";
import { School } from "@mui/icons-material";

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
  const [course_id, setCourseId] = useState("");

  const seeAssignments = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/assignments/${course_id}`);
      setAssignments(response.data);
    } catch (error) {
      console.error(error);
      setMessage("Error fetching assignments.");
    }
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
      const response = await axios.get(`http://127.0.0.1:8000/notify_all/${course_id}`, {
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

      <Box
        sx={{
          height: "100vh", // Full viewport height
          width: "100vw",  // Full viewport width
          py: 4,
          px: 2,
          m: 0,           // Remove any margins
          background: "#0a0013",
          position: "fixed", // Fix position to cover the entire screen
          top: 0,
          left: 0,
          overflow: "auto", // Allow scrolling if content overflows
        }}
      >
        <Container maxWidth="md">
          <Fade in={true} timeout={1000}>
            <Box sx={{ textAlign: "center", mb: 6 }}>
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
                Teacher Dashboard
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

          <Slide direction="up" in={true} timeout={1000} style={{ transitionDelay: "400ms" }}>
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
                          primary={`${assignment.title} - Due: ${assignment.due_date}`}
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
                    No assignments found.
                  </Typography>
                )}
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
        </Container>
      </Box>
    </>
  );
}