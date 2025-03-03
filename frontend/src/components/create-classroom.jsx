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
  Snackbar,
  Alert,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  List,
  ListItem,
  ListItemText,
  Divider
} from "@mui/material";

export default function TeacherDashboard() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const [classroomName, setClassroomName] = useState("");
  const [classroomForStudents, setClassroomForStudents] = useState("");
  const [message, setMessage] = useState("");
  const [userId, setUserId] = useState("");
  const [notification, setNotification] = useState("");
  const [status, setStatus] = useState("");
  const [students, setStudents] = useState([]);
  const [assignmentid, setAssignmentId] = useState("");
  const token = params.get("token");

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
          course_id: coursef
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
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
          "Content-Type": "application/json"
        }
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
      console.log(response.data);
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
            "Content-Type": "application/json"
          }
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
    <Box sx={{
      background: "linear-gradient(-45deg, #1a0033, #2a0944, #3b185f, #240046)",
      minHeight: "100vh",
      py: 2,
      px: 2,
      color: "white"
    }}>
      <Container maxWidth="md">
        <Typography variant="h5" align="center" sx={{ mb: 3, fontFamily: "'Playfair Display', serif" }}>
          Teacher Dashboard
        </Typography>

        {/* Create Course Section */}
        <Card sx={{ mb: 3, backgroundColor: "rgba(26,0,51,0.8)", backdropFilter: "blur(8px)", borderRadius: 1, border: "1px solid rgba(157, 68, 192, 0.4)" }}>
          <CardContent sx={{ p: 2 }}>
            <Typography variant="subtitle1" sx={{ mb: 1, fontFamily: "'Playfair Display', serif" }}>
              Create a Course
            </Typography>
            <TextField 
              size="small"
              fullWidth 
              variant="outlined"
              placeholder="Classroom Name" 
              value={classroomName}
              onChange={(e) => setClassroomName(e.target.value)}
              sx={{ backgroundColor: "white", borderRadius: 1, mb: 1 }}
            />
            <Button 
              size="small"
              fullWidth 
              variant="contained" 
              onClick={handleCreateClassroom} 
              sx={{
                background: "linear-gradient(45deg, #9D44C0 0%, #6C3483 100%)", 
                color: "white",
                py: 0.75,
                "&:hover": { background: "linear-gradient(45deg, #8E24AA 0%, #6A1B9A 100%)" }
              }}>
              Create Classroom
            </Button>
            {message && (
              <Typography variant="caption" sx={{ mt: 1, color: "lightgray" }}>
                {message}
              </Typography>
            )}
          </CardContent>
        </Card>

        {/* See Enrolled Students Section */}
        <Card sx={{ mb: 3, backgroundColor: "rgba(26,0,51,0.8)", backdropFilter: "blur(8px)", borderRadius: 1, border: "1px solid rgba(157, 68, 192, 0.4)" }}>
          <CardContent sx={{ p: 2 }}>
            <Typography variant="subtitle1" sx={{ mb: 1, fontFamily: "'Playfair Display', serif" }}>
              See Enrolled Students
            </Typography>
            <TextField
              size="small"
              fullWidth
              variant="outlined"
              placeholder="Classroom Name"
              value={classroomForStudents}
              onChange={(e) => setClassroomForStudents(e.target.value)}
              sx={{ backgroundColor: "white", borderRadius: 1, mb: 1 }}
            />
            <Button 
              size="small"
              fullWidth 
              variant="contained" 
              onClick={getAllEnrolledStudents} 
              sx={{
                background: "linear-gradient(45deg, #9D44C0 0%, #6C3483 100%)", 
                color: "white",
                py: 0.75,
                mb: 1,
                "&:hover": { background: "linear-gradient(45deg, #8E24AA 0%, #6A1B9A 100%)" }
              }}>
              Get Enrolled Students
            </Button>
            {students.length > 0 ? (
              <List dense>
                {students.map((student, index) => (
                  <React.Fragment key={index}>
                    <ListItem disablePadding>
        </Box>
        <Box mt={4}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="h2" gutterBottom>
                <Assignment /> Create an Assignment
              </Typography>
              <TextField
                label="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                fullWidth
                margin="normal"
              />
              <TextField
                select
                label="Submission Type"
                value={submissionType}
                onChange={(e) => setSubmissionType(e.target.value)}
                fullWidth
                margin="normal"
                SelectProps={{
                  native: true,
                }}
              >
                <option value="text">Text</option>
                <option value="file">File Upload</option>
                <option value="link">Link Submission</option>
                <option value="multiple_choice">Multiple Choice</option>
              </TextField>
              {submissionType === "file" && (
                <TextField
                  type="file"
                  fullWidth
                  margin="normal"
                />
              )}
              {submissionType === "link" && (
                <TextField
                  type="url"
                  label="Enter link"
                  fullWidth
                  margin="normal"
                />
              )}
              {submissionType === "multiple_choice" && (
                <TextField
                  label="Enter options separated by commas"
                  fullWidth
                  margin="normal"
                />
              )}
              <TextField
                type="date"
                label="Due Date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                fullWidth
                margin="normal"
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <TextField
                label="Message"
                value={messaget}
                onChange={(e) => setMessageT(e.target.value)}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Course ID"
                value={coursef}
                onChange={(e) => setCourseF(e.target.value)}
                fullWidth
                margin="normal"
              />
              <Button
                onClick={handleSubmit}
                variant="contained"
                color="primary"
                startIcon={<Add />}
                fullWidth
              >
                Create Assignment
              </Button>
              {message && <Typography variant="body2" color="textSecondary">{message}</Typography>}
              <TextField
                label="Course ID"
                value={course_id}
                onChange={(e) => setCourseId(e.target.value)}
                fullWidth
                margin="normal"
              />
              <Button
                onClick={seeAssignments}
                variant="contained"
                color="primary"
                startIcon={<Assignment />}
                fullWidth
              >
                See Assignments
              </Button>
              {assignments.length > 0 ? (
                <Paper elevation={1} style={{ marginTop: 16 }}>
                  {assignments.map((assignment) => (
                    <Box key={assignment._id} p={2} borderBottom={1} borderColor="grey.300">
                      <strong>{assignment.title}</strong> - Due: {assignment.due_date}
                    </Box>
                  ))}
                </Paper>
              ) : (
                <Typography variant="body2" color="textSecondary" style={{ marginTop: 16 }}>
                  No assignments found.
                </Typography>
              )}
            </CardContent>
          </Card>
        </Box>
        <Box mt={4}>
          <Button
            onClick={notifyStudents}
            variant="contained"
            color="primary"
            startIcon={<NotificationsActive />}
            fullWidth
          >
            Notify all students
          </Button>
        </Box>
      </Container>
    </>
  );
}
