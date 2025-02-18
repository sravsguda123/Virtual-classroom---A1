import React, { useState } from "react";
import axios from "axios";

const CreateClassroom = () => {
  const [classroomName, setClassroomName] = useState("");
  const [message, setMessage] = useState("");

  const handleCreateClassroom = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setMessage("You are not authorized to create a classroom.");
      return;
    }

    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/create_classroom`,
        { name: classroomName },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setMessage(`Classroom created successfully! ID: ${response.data.class_id}`);
      setClassroomName("");
    } catch (error) {
      console.error(error);
      setMessage("Failed to create classroom. Ensure you are a teacher.");
    }
  };

  return (
    <div>
      <h1>Create Classroom</h1>
      <input
        type="text"
        placeholder="Classroom Name"
        value={classroomName}
        onChange={(e) => setClassroomName(e.target.value)}
      />
      <button onClick={handleCreateClassroom}>Create</button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default CreateClassroom;
