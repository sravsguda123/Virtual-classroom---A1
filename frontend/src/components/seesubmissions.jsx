import { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
const SubmissionsTable = () => {
    const [assignmentId, setAssignmentId] = useState(""); // Set this from an input field
    const [submissions, setSubmissions] = useState([]); // Store all submissions
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get("token");

    useEffect(() => {
        const fetchSubmissions = async () => {
            try {
                if (!assignmentId) return; // Prevent API call if assignmentId is empty
                const response = await axios.get(`http://127.0.0.1:8000/submissions/${assignmentId}`
                    , {
                      headers: {
                        Authorization: `Bearer ${token}`,
                        
                      },
                    });
                setSubmissions(response.data); // Store all submissions in state
            } catch (error) {
                console.error("Error fetching submissions:", error);
            }
        };

        fetchSubmissions();
    }, [assignmentId]); // Runs when assignmentId changes

    return (
        <div>
            <h2>Submissions for Assignment {assignmentId}</h2>
            
            {/* Input field to enter assignment ID */}
            <input
                type="text"
                placeholder="Enter Assignment ID"
                value={assignmentId}
                onChange={(e) => setAssignmentId(e.target.value)}
            />

            {submissions.length === 0 ? (
                <p>No submissions found.</p>
            ) : (
                <table border="1">
                    <thead>
                        <tr>
                            <th>Submission ID</th>
                            <th>Student ID</th>
                            <th>Text Content</th>
                            <th>Link</th>
                            <th>File ID</th>
                        </tr>
                    </thead>
                    <tbody>
                        {submissions.map((submission) => (
                            <tr key={submission._id}>
                                <td>{submission._id}</td>
                                <td>{submission.student_id}</td>
                                <td>{submission.text_content || "N/A"}</td>
                                <td>
                                    {submission.link ? (
                                        <a href={submission.link} target="_blank" rel="noopener noreferrer">
                                            Open Link
                                        </a>
                                    ) : (
                                        "No Link"
                                    )}
                                </td>
                                <td>{submission.file_id || "No File"}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default SubmissionsTable;
