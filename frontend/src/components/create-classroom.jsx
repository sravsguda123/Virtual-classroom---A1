// import React, { useState } from "react";
// import axios from "axios";

// const CreateClassroom = () => {
//   const [classroomName, setClassroomName] = useState("");
//   const [message, setMessage] = useState("");

//   const handleCreateClassroom = async () => {
//     const token = localStorage.getItem("token");

//     if (!token) {
//       setMessage("You are not authorized to create a classroom.");
//       return;
//     }

//     try {
//       const response = await axios.post(
//         `http://127.0.0.1:8000/create_classroom`,
//         { name: classroomName },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       setMessage(`Classroom created successfully! ID: ${response.data.class_id}`);
//       setClassroomName("");
//     } catch (error) {
//       console.error(error);
//       setMessage("Failed to create classroom. Ensure you are a teacher.");
//     }
//   };

//   return (
//     <div>
//       <h1>Create Classroom</h1>
//       <input
//         type="text"
//         placeholder="Classroom Name"
//         value={classroomName}
//         onChange={(e) => setClassroomName(e.target.value)}
//       />
//       <button onClick={handleCreateClassroom}>Create</button>
//       {message && <p>{message}</p>}
//     </div>
//   );
// };

// export default CreateClassroom;


import { useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

export default function TeacherDashboard() {
  const location = useLocation(); 
  const params = new URLSearchParams(location.search);
    const [classroomName, setClassroomName] = useState("");
    const [message, setMessage] = useState("");
    const [userId, setUserId] = useState("");
    const [notification, setNotification] = useState("");
    const [status, setStatus] = useState("");
    const token = params.get('token');

    // Handle Classroom Creation
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

            setMessage(`Classroom created successfully! ID: ${response.data.class_id}`);
            setClassroomName("");
        } catch (error) {
            setMessage("Failed to create classroom. Ensure you are a teacher.");
        }
    };

    // Handle Sending Notification
    const sendNotification = () => {
        if (!userId || !notification) {
            setStatus("Enter both Student ID and Message ❌");
            return;
        }
        

        const ws = new WebSocket(`ws://127.0.0.1:8000/notify/${userId}?token=${token}`);

        ws.onopen = () => {
            setStatus("Connected ✅ Sending...");
            ws.send(JSON.stringify({ title: "Teacher Notification", body: notification }));
            setNotification("");
            // ws.close(); // Close WebSocket after sending
        };

        ws.onmessage = (event) => {
            const response = JSON.parse(event.data);
            setStatus(response.status || "Message Sent!");
        };

        ws.onerror = () => {
            setStatus("WebSocket Error ❌");
        };

        ws.onclose = () => {
            setStatus("Disconnected 🔴");
            setTimeout(sendNotification, 3000);
        };
    };

    return (
        <div className="flex flex-col items-center p-6 bg-gray-100 min-h-screen">
            <h1 className="text-2xl font-bold mb-4">Teacher Dashboard 🏫</h1>

            {/* Classroom Creation Section */}
            <div className="mb-6 bg-white p-4 rounded shadow-md w-80">
                <h2 className="text-lg font-semibold">Create a Classroom</h2>
                <input
                    type="text"
                    placeholder="Classroom Name"
                    value={classroomName}
                    onChange={(e) => setClassroomName(e.target.value)}
                    className="p-2 border rounded w-full my-2"
                />
                <button
                    onClick={handleCreateClassroom}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 w-full"
                >
                    Create Classroom
                </button>
                {message && <p className="text-sm text-gray-700 mt-2">{message}</p>}
            </div>

            {/* Notification Section */}
            <div className="bg-white p-4 rounded shadow-md w-80">
                <h2 className="text-lg font-semibold">Send Notification 📢</h2>
                <input
                    type="text"
                    placeholder="Enter Student ID"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    className="p-2 border rounded w-full my-2"
                />
                <textarea
                    placeholder="Enter notification message"
                    value={notification}
                    onChange={(e) => setNotification(e.target.value)}
                    className="p-2 border rounded w-full my-2 h-20"
                />
                <button
                    onClick={sendNotification}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full"
                >
                    Send Notification
                </button>
                <p className="mt-2 text-gray-700">{status}</p>
            </div>
        </div>
    );
}
