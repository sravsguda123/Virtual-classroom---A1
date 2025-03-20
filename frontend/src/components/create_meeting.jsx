import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

export default function GoogleCalendarAuth() {
  const [meetingLink, setMeetingLink] = useState("");
  const [courseId, setCourseId] = useState("");
  const [assignmentId, setAssignmentId] = useState("");
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const token = params.get("token");

  const startAuth = () => {
    window.location.href = "http://127.0.0.1:8000/auth";
  };

  const createEvent = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/create-event");
      const data = await response.json();

      if (data.meet_link) {
        alert(`Google Meet link: ${data.meet_link}`);
        setMeetingLink(data.meet_link);
      } else {
        alert("Failed to create event. Please log in first.");
      }
    } catch (error) {
      console.error("Error creating event:", error);
    }
  };

  const notifyStudents = async () => {
    try {
        const response = await axios.get(
            `http://127.0.0.1:8000/notify_all_meet/${courseId}?meet_link=${encodeURIComponent(meetingLink)}`, 
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );
      console.log(`${response.data.status}`);
    } catch (error) {
      console.error("Error notifying students:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Google Calendar Integration</h1>

      {/* Course ID Input */}
      <input
        type="text"
        placeholder="Enter Course ID"
        value={courseId}
        onChange={(e) => setCourseId(e.target.value)}
        className="px-4 py-2 mb-2 border rounded-lg w-64 text-center"
      />

      {/* Assignment ID Input */}
      
      {/* Google Login Button */}
      <button
        onClick={startAuth}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
      >
        Login with Google
      </button>

      {/* Create Event Button */}
      <button
        onClick={createEvent}
        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition mt-4"
      >
        Create Event with Google Meet
      </button>

      {/* Notify Students Button */}
      <button
        onClick={notifyStudents}
        className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition mt-4"
      >
        Notify Students
      </button>

      {/* Display Meeting Link */}
      {meetingLink && (
        <h2 className="mt-4 text-lg font-semibold">
          Meeting Link:{" "}
          <a
            href={meetingLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            {meetingLink}
          </a>
        </h2>
      )}
    </div>
  );
}
