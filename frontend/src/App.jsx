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
        <Route path="/submit/:assignmentId" element={<AssignmentSubmission />} />
        <Route path="/seesubmissions/:assignmentId" element={<SubmissionsTable />} />
      </Routes>
    </Router>
    
  );
}

export default App;
