import React, { useState } from "react";
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
  List,
  ListItem,
  ListItemText,
  Select,
  MenuItem
} from "@mui/material";

export default function TeacherDashboard() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const token = params.get("token");

  const [classroomName, setClassroomName] = useState("");
  const [classroomForStudents, setClassroomForStudents] = useState("");
  const [message, setMessage] = useState("");
  const [students, setStudents] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [submissionType, setSubmissionType] = useState("text");
  const [dueDate, setDueDate] = useState("");
  const [courseId, setCourseId] = useState("");

  const seeAssignments = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/assignments/${courseId}`);
      console.log(response.data);
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
          course_id: courseId
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );
      setMessage(`Assignment created successfully! ID: ${response.data.assignment_id}`);
    } catch (error) {
      setMessage("Error creating assignment");
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", py: 2, px: 2, background: "#f0f0f0" }}>
      <Container maxWidth="md">
        <Typography variant="h5" align="center" sx={{ mb: 3 }}>
          Teacher Dashboard
        </Typography>

        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              Create a Course
            </Typography>
            <TextField 
              size="small"
              fullWidth 
              variant="outlined"
              placeholder="Classroom Name" 
              value={classroomName}
              onChange={(e) => setClassroomName(e.target.value)}
              sx={{ mb: 1 }}
            />
            <Button 
              size="small"
              fullWidth 
              variant="contained" 
              sx={{ background: "#6200ea", color: "white" }}
            >
              Create Classroom
            </Button>
            {message && <Typography variant="caption" sx={{ mt: 1, color: "red" }}>{message}</Typography>}
          </CardContent>
        </Card>

        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              Create an Assignment
            </Typography>
            <TextField label="Title" value={title} onChange={(e) => setTitle(e.target.value)} fullWidth margin="normal" />
            <TextField label="Description" value={description} onChange={(e) => setDescription(e.target.value)} fullWidth margin="normal" />
            <Select fullWidth value={submissionType} onChange={(e) => setSubmissionType(e.target.value)}>
              <MenuItem value="text">Text</MenuItem>
              <MenuItem value="file">File Upload</MenuItem>
              <MenuItem value="link">Link Submission</MenuItem>
            </Select>
            <TextField type="date" label="Due Date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} fullWidth margin="normal" InputLabelProps={{ shrink: true }} />
            <TextField label="Course ID" value={courseId} onChange={(e) => setCourseId(e.target.value)} fullWidth margin="normal" />
            <Button onClick={handleSubmit} variant="contained" sx={{ background: "#6200ea", color: "white" }}>
              Create Assignment
            </Button>
            {message && <Typography variant="body2" color="textSecondary">{message}</Typography>}
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
