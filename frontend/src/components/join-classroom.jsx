import React, { useState } from "react";
import axios from "axios";

import { useNavigate } from "react-router-dom";

const JoinClassroom = () => {
  
  const navigate = useNavigate();
  const [classroomId, setClassroomId] = useState("");
  const [message, setMessage] = useState("");

  const handleJoinClassroom = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setMessage("You are not authorized to join a classroom.");
      return;
    }

    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/join_classroom`,
        { class_id: classroomId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setMessage(response.data.message);
      setClassroomId("");
      navigate(`/chatroom/${classroomId}?token=${token}`);
    } catch (error) {
      console.error(error);
      setMessage("Failed to join classroom. Check the classroom ID.");
    }
  };
  const notificationPage = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setMessage("You are not authorized to view notifications.");
      return;
    }

    navigate(`/notifications?token=${token}`);
  }
  return (
    <div>
      <h1>Join Classroom</h1>
      <input
        type="text"
        placeholder="Classroom ID"
        value={classroomId}
        onChange={(e) => setClassroomId(e.target.value)}
      />
      <button onClick={handleJoinClassroom}>Join</button>
      {message && <p>{message}</p>}


      <h1>Notifications</h1>

      <button onClick={notificationPage}>Notifications</button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default JoinClassroom;
