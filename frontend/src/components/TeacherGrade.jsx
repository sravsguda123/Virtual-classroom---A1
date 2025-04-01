import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const TeacherGrade = () => {
  const { assignmentId } = useParams();
  const [submissions, setSubmissions] = useState([]);
  const [grades, setGrades] = useState({});
  const navigate = useNavigate();
  const token = new URLSearchParams(window.location.search).get('token');

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        // Changed endpoint to match the one in main.py
        const response = await axios.get(
          `http://127.0.0.1:8000/assignment_marks/${assignmentId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setSubmissions(response.data);
        
        // Initialize grades state with existing marks
        const initialGrades = {};
        response.data.forEach(sub => {
          if (sub.mark !== undefined) {
            initialGrades[sub._id] = sub.mark;
          }
        });
        setGrades(initialGrades);
      } catch (error) {
        console.error('Error fetching submissions:', error);
      }
    };
    fetchSubmissions();
  }, [assignmentId, token]);

  const handleGradeChange = (submissionId, mark) => {
    setGrades(prev => ({ ...prev, [submissionId]: mark }));
  };

  const submitGrade = async (submissionId) => {
    try {
      // Create FormData to match the backend expectation
      const formData = new FormData();
      formData.append('submission_id', submissionId);
      formData.append('mark', grades[submissionId]);
      
      await axios.post(
        'http://127.0.0.1:8000/grade_submission',
        formData,
        { 
          headers: { 
            Authorization: `Bearer ${token}`,
            // Don't set Content-Type as axios will set it automatically for FormData
          } 
        }
      );
      alert('Grade submitted successfully!');
    } catch (error) {
      console.error('Error submitting grade:', error);
      alert('Failed to submit grade: ' + (error.response?.data?.detail || error.message));
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl mb-4">Grade Submissions for Assignment</h2>
      <div className="overflow-x-auto">
        <table className="table-auto w-full">
          <thead>
            <tr>
              <th className="px-4 py-2">Student ID</th>
              <th className="px-4 py-2">Submission</th>
              <th className="px-4 py-2">Grade</th>
              <th className="px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map(submission => (
              <tr key={submission._id}>
                <td className="border px-4 py-2">{submission.student_id}</td>
                <td className="border px-4 py-2">
                  {submission.file_id && (
                    <a 
                      href={`http://127.0.0.1:8000/download/${submission.file_id}`}
                      className="text-blue-500 hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Download File
                    </a>
                  )}
                  {submission.text_content && <p>{submission.text_content}</p>}
                </td>
                <td className="border px-4 py-2">
                  <input
                    type="number"
                    className="border p-1 w-20"
                    value={grades[submission._id] || ''}
                    onChange={(e) => handleGradeChange(submission._id, e.target.value)}
                  />
                </td>
                <td className="border px-4 py-2">
                  <button
                    onClick={() => submitGrade(submission._id)}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                  >
                    Submit Grade
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button 
        onClick={() => navigate(-1)}
        className="mt-4 bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
      >
        Back
      </button>
    </div>
  );
};

export default TeacherGrade;