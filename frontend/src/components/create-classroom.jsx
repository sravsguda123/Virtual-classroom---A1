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
        try{
            const response = await axios.get(`http:////127.0.0.1:8000/assignments/${course_id}`);
            setAssignments(response.data);
        }
        catch (error) {
            console.error(error);
            setMessage("Error fetching assignments.");
    }
  }
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post( "http://127.0.0.1:8000/create_assignments", {
                title,
                description,
                submission_type: submissionType,
                due_date: dueDate,
                course_id: coursef
            }, {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            });
            setMessage(`Assignment created successfully! ID: ${response.data.assignment_id}`);
            setAssignmentId(response.data.assignment_id);
        } catch (error) {
            setMessage("Error creating assignment");
        }
      }
    const notifyStudents = async () => {
        try {
          const response = await axios.get(`http://127.0.0.1:8000/notify_all/${course_id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });
          setMessage(`${response.data.status}`);
    }
    catch (error) {
      console.error(error); 
    }
  }
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

      <div className="mb-6 bg-white p-4 rounded shadow-md w-80">
        <h2 className="text-lg font-semibold">Create a Assignment</h2>

        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="p-2 border rounded w-full my-2"
        />
        <input
          type="text"
          placeholder="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="p-2 border rounded w-full my-2"
        />
                    <select 
                        value={submissionType} 
                        onChange={(e) => setSubmissionType(e.target.value)} 
                        className="w-full p-2 border rounded"
                    >
                        <option value="text">Text</option>
                        <option value="file">File Upload</option>
                        <option value="link">Link Submission</option>
                        <option value="multiple_choice">Multiple Choice</option>
                    </select>
                    {submissionType === "file" && (
                        <input type="file" className="w-full p-2 border rounded" />
                    )}
                    {submissionType === "link" && (
                        <input type="url" placeholder="Enter link" className="w-full p-2 border rounded" />
                    )}
                    {submissionType === "multiple_choice" && (
                        <textarea placeholder="Enter options separated by commas" className="w-full p-2 border rounded" />
                    )}
                    <input 
                        type="date" 
                        value={dueDate} 
                        onChange={(e) => setDueDate(e.target.value)} 
                        className="w-full p-2 border rounded"
                    />
                <input
          type="text"
          placeholder="message"
          value={messaget}
          onChange={(e) => setMessageT(e.target.value)}
          className="p-2 border rounded w-full my-2"
        />
                        <input
          type="text"
          placeholder="course id"
          value={coursef}
          onChange={(e) => setCourseF(e.target.value)}
          className="p-2 border rounded w-full my-2"
        />
        <button
          onClick={handleSubmit}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 w-full"
        >
          Create Assignment
        </button>

        {message && <p className="text-sm text-gray-700 mt-2">{message}</p>}
        <input
          type="text"
          placeholder="course id"
          value={course_id}
          onChange={(e) => setCourseId(e.target.value)}
          className="p-2 border rounded w-full my-2"
        />
        <button
          onClick={seeAssignments}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 w-full"
        >See Assignments
        </button>
          {assignments.length > 0 ? (
                    <ul className="mt-2 text-gray-700">
                        {assignments.map((assignment) => (
                            <li key={assignment._id} className="p-2 border-b">
                                <strong>{assignment.title}</strong> - Due: {assignment.due_date}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-sm text-gray-700 mt-2">No assignments found.</p>
                )}
        
      </div>
      <button
          onClick={notifyStudents}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 w-full"
        >
          Notify all students
        </button>
    </div>
  );
}
