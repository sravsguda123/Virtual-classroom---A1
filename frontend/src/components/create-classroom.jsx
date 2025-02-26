
// import { useState } from "react";
// import axios from "axios";
// import { useLocation } from "react-router-dom";

// export default function TeacherDashboard() {
//   const location = useLocation();
//   const params = new URLSearchParams(location.search);
//   const [classroomName, setClassroomName] = useState("");
//   const [message, setMessage] = useState("");
//   const [userId, setUserId] = useState("");
//   const [notification, setNotification] = useState("");
//   const [status, setStatus] = useState("");
//   const [students, setStudents] = useState([]);
//   const token = params.get("token");
//   const getAllEnrolledStudents = async () => {
//     try {
//       const response = await axios.get(`http://127.0.0.1:8000/students_in_courses/${classroomName}`);
//       console.log(response.data);
//       setStudents(response.data);
//     } catch (error) {
//       console.error(error);
//     }
//   };
//   // Handle Classroom Creation
//   const handleCreateClassroom = async () => {
//     if (!token) {
//       setMessage("You are not authorized to create a classroom.");
//       return;
//     }

//     try {
//       const response = await axios.post(
//         "http://127.0.0.1:8000/create_classroom",
//         { name: classroomName },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       setMessage(
//         `Course created successfully! ID: ${response.data.class_id}`
//       );
//       setClassroomName("");
//     } catch (error) {
//       console.error(error);
//       setMessage("Failed to create course. Ensure you are a teacher.");
//     }
//   };

//   // Handle Sending Notification via WebSocket
//   const sendNotification = () => {
//     if (!userId || !notification) {
//       setStatus("Enter both Student ID and Message");
//       return;
//     }

//     // Create a new WebSocket connection with user ID and token as query parameter
//     const ws = new WebSocket(
//       `ws://127.0.0.1:8000/notify/${userId}?token=${token}`
//     );

//     ws.onopen = () => {
//       setStatus("Connected . Sending...");
//       // Send the notification payload once connected
//       ws.send(
//         JSON.stringify({ title: "Teacher Notification", body: notification })
//       );
//       setNotification("");
//       // Optionally close the socket immediately after sending
//       // ws.close();
//     };

//     ws.onmessage = (event) => {
//       // Handle any messages from the server
//       try {
//         const response = JSON.parse(event.data);
//         setStatus(response.status || "Message Sent!");
//       } catch (error) {
//         setStatus("Message Sent!");
//       }
//     };

//     ws.onerror = () => {
//       setStatus("WebSocket Error");
//     };

//     ws.onclose = () => {
//       setStatus("Disconnected");
//       // Optionally, reconnect or perform other actions on disconnect
//       // setTimeout(sendNotification, 3000);
//     };
//   };

//   return (
//     <div className="flex flex-col items-center p-6 bg-gray-100 min-h-screen">
//       <h1 className="text-2xl font-bold mb-4">Teacher Dashboard </h1>

//       {/* Classroom Creation Section */}
//       <div className="mb-6 bg-white p-4 rounded shadow-md w-80">
//         <h2 className="text-lg font-semibold">Create a Course</h2>
//         <input
//           type="text"
//           placeholder="Classroom Name"
//           value={classroomName}
//           onChange={(e) => setClassroomName(e.target.value)}
//           className="p-2 border rounded w-full my-2"
//         />
//         <button
//           onClick={handleCreateClassroom}
//           className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 w-full"
//         >
//           Create Classroom
//         </button>
//         {message && <p className="text-sm text-gray-700 mt-2">{message}</p>}
//       </div>
//       <input
//           type="text"
//           placeholder="Classroom Name to see enroled"
//           value={classroomName}
//           onChange={(e) => setClassroomName(e.target.value)}
//           className="p-2 border rounded w-full my-2"
//         />
//       <button
//           onClick={getAllEnrolledStudents}
//           className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 w-full"
//         >
//           See enrolled Students
//         </button>
//         {students && <p className="text-sm text-gray-700 mt-2">{students}</p>}
//       {/* Notification Section */}
//       <div className="bg-white p-4 rounded shadow-md w-80">
//         <h2 className="text-lg font-semibold">Send Notification</h2>
//         <input
//           type="text"
//           placeholder="Enter Student ID"
//           value={userId}
//           onChange={(e) => setUserId(e.target.value)}
//           className="p-2 border rounded w-full my-2"
//         />
//         <textarea
//           placeholder="Enter notification message"
//           value={notification}
//           onChange={(e) => setNotification(e.target.value)}
//           className="p-2 border rounded w-full my-2 h-20"
//         />
//         <button
//           onClick={sendNotification}
//           className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full"
//         >
//           Send Notification
//         </button>
//         <p className="mt-2 text-gray-700">{status}</p>
//       </div>
//     </div>
//   );
// };


import { useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

export default function TeacherDashboard() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  
  const [classroomName, setClassroomName] = useState("");
  const [classroomForStudents, setClassroomForStudents] = useState(""); // Separate state for fetching students
  const [message, setMessage] = useState("");
  const [userId, setUserId] = useState("");
  const [notification, setNotification] = useState("");
  const [status, setStatus] = useState("");
  const [students, setStudents] = useState([]);
  
  const token = params.get("token");

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
            "Content-Type": "application/json",
          },
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
    <div className="flex flex-col items-center p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Teacher Dashboard</h1>

      {/* Classroom Creation Section */}
      <div className="mb-6 bg-white p-4 rounded shadow-md w-80">
        <h2 className="text-lg font-semibold">Create a Course</h2>
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

      {/* See Enrolled Students Section */}
      <div className="mb-6 bg-white p-4 rounded shadow-md w-80">
        <h2 className="text-lg font-semibold">See Enrolled Students</h2>
        <input
          type="text"
          placeholder="Classroom Name"
          value={classroomForStudents}
          onChange={(e) => setClassroomForStudents(e.target.value)}
          className="p-2 border rounded w-full my-2"
        />
        <button
          onClick={getAllEnrolledStudents}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 w-full"
        >
          Get Enrolled Students
        </button>

        {/* Render Students List */}
        {students.length > 0 ? (
          <ul className="mt-2 text-gray-700">
            {students.map((student, index) => (
              <li key={index} className="p-2 border-b">{student}</li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-700 mt-2">No students enrolled.</p>
        )}
      </div>
    </div>
  );
}
