import { useEffect, useState } from "react";
import {useLocation} from "react-router-dom";
import axios from "axios";
import { useParams } from "react-router-dom";
const AssignmentSubmission = () => {
  const { assignmentId } = useParams(); 
  const [textContent, setTextContent] = useState("");
  const location=useLocation();
  const params = new URLSearchParams(location.search);
  const token = params.get("token");
  const [link, setLink] = useState("");
  const [file, setFile] = useState(null);
  const [mcqAnswers, setMcqAnswers] = useState("");
  const [duedate, setDuedate] = useState(""); 
useEffect(() => {
    const fetchDueDate = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/assignment_due_date/${assignmentId}`);
        setDuedate(response.data.due_date);
        console.log(response.data.due_date);
      } catch (error) {
        console.error("Error fetching due date:", error);
      }
    }
    if (assignmentId) fetchDueDate(); 
  }, [assignmentId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
     
    if (textContent) formData.append("text_content", textContent);
    if (file) formData.append("file", file);
    if (link) formData.append("link", link);
    
    
    formData.append("assignment_id", assignmentId);

    try {
      const response = await axios.post(`http://127.0.0.1:8000/submit`, formData, 
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      alert(response.data.message);
    } catch (error) {
      alert("Submission failed");
    }
  };

  return (
    <div>
      <h2>Submit Assignment</h2>
      <h2>Due Date: {duedate}</h2>

      <form onSubmit={handleSubmit}>
        {/* ✅ New Assignment ID Input */}
        
        <textarea
          placeholder="Write your answer..."
          value={textContent}
          onChange={(e) => setTextContent(e.target.value)}
        />

        <input
          type="url"
          placeholder="Submit a link"
          value={link}
          onChange={(e) => setLink(e.target.value)}
        />

        <input
          type="file"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />

        <textarea
          placeholder="Enter MCQ answers (comma separated)"
          value={mcqAnswers}
          onChange={(e) => setMcqAnswers(e.target.value)}
        />

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default AssignmentSubmission;
