import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/login.jsx";
import CreateClassroom from "./components/create-classroom.jsx";
import JoinClassroom from "./components/join-classroom.jsx";
import Chatroom from "./components/chatrooms.jsx";
import Notifications from "./components/notifications.jsx";
import TeacherDashboard from "./components/create-classroom.jsx";
import ResourceSharing from "./components/resourses.jsx";
import AssignmentSubmission from "./components/submissions.jsx";
import SubmissionsTable from "./components/seesubmissions.jsx";
import GoogleCalendarAuth from "./components/create_meeting.jsx";
import TeacherGrade from "./components/TeacherGrade.jsx";
import StudentGrade from "./components/StudentGrade.jsx";
import StudentSubmissions from "./components/StudentSubmissions.jsx";
import Attendance from "./components/attendance.jsx";

function App() {
  return (
    
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/create-classroom" element={<TeacherDashboard />} />
        <Route path="/join-classroom" element={<JoinClassroom />} />
        <Route path="/chatroom/:id" element={<Chatroom />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/resourses" element={<ResourceSharing />} />
        <Route path="/create_meeting" element={<GoogleCalendarAuth />} />
        <Route path="/submit/:assignmentId" element={<AssignmentSubmission />} />
        <Route path="/seesubmissions/:assignmentId" element={<SubmissionsTable />} />
        <Route path="/grade/:assignmentId" element={<TeacherGrade />} />
        <Route path="/grade_view/:submissionId" element={<StudentGrade />} />
        <Route path="/my-submissions" element={<StudentSubmissions />} />
        <Route path="/attendance/:courseId/:token" element={<Attendance />} />
      </Routes>
    </Router>
    
  );
}

export default App;
