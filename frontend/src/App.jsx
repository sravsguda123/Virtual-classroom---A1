import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/login.jsx";
import CreateClassroom from "./components/create-classroom.jsx";
import JoinClassroom from "./components/join-classroom.jsx";
import Chatroom from "./components/chatrooms.jsx";

function App() {
  return (
    
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/create-classroom" element={<CreateClassroom />} />
        <Route path="/join-classroom" element={<JoinClassroom />} />
        <Route path="/chatroom/:id" element={<Chatroom />} />
      </Routes>
    </Router>
    
  );
}

export default App;
