import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const Attendance = () => {
  const { courseId, token } = useParams(); // ✅ Extract values from the URL path
  const [students, setStudents] = useState([]);

  const handleGetStudents = async () => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/students_in_courses/${courseId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // ✅ Ensure token is correctly passed
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Response data:", response.data.students); // Log the response data
      setStudents(response.data.students);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };
  const handleAttendance = async (studentId, isPresent) => {
    if (!studentId) {
      console.error("Student ID is undefined or null");
      return;
    }
    if(!isPresent) {
      console.error("Attendance status is undefined or null");
      return;
    }
    else{
        console.log(`Student ID: ${studentId}, Present: ${isPresent}`); // Log the student ID and attendance status
        const response = await axios.post(`http://127.0.0.1:8000/attendance/${courseId}/${studentId}`,
            {},
            {
                headers: {
                  Authorization: `Bearer ${token}`, // ✅ Ensure token is correctly passed
                  "Content-Type": "application/json",
                },
              }
            );
        console.log("Attendance response:", response.data); // Log the attendance response
    }
  }

  return (
    <div className="attendance-container">
      <h1>Attendance</h1>
      <button onClick={handleGetStudents}>Get Students</button>
      <table className="attendance-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Present</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student}>
              <td>{student}</td>
              <td><input
          type="checkbox"
          onChange={(e) => handleAttendance(student, e.target.checked)}
        /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Attendance;
