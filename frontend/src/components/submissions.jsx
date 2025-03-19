import { useState } from "react";
import {useLocation} from "react-router-dom";
import axios from "axios";

const AssignmentSubmission = () => {
  const [assignmentId, setAssignmentId] = useState(""); 
  
  const [textContent, setTextContent] = useState("");
  const location=useLocation();
  const params = new URLSearchParams(location.search);
  const token = params.get("token");
  const [link, setLink] = useState("");
  const [file, setFile] = useState(null);
  const [mcqAnswers, setMcqAnswers] = useState("");

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
      <form onSubmit={handleSubmit}>
        {/* ✅ New Assignment ID Input */}
        <input
          type="text"
          placeholder="Enter Assignment ID"
          value={assignmentId}
          onChange={(e) => setAssignmentId(e.target.value)}
          required
        />

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
