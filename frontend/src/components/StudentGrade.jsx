import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const StudentGrade = () => {
  const { submissionId } = useParams();
  const [grade, setGrade] = useState(null);
  const token = new URLSearchParams(window.location.search).get('token');

  useEffect(() => {
    const fetchGrade = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/my_mark/${submissionId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setGrade(response.data);
      } catch (error) {
        console.error('Error fetching grade:', error);
      }
    };
    fetchGrade();
  }, [submissionId, token]);

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl mb-4">Your Grade</h2>
      {grade ? (
        <div className="bg-white p-4 rounded shadow">
          <p className="text-lg">
            Mark: {grade.mark !== undefined ? grade.mark : 'Not graded yet'}
          </p>
        </div>
      ) : (
        <p>Loading grade...</p>
      )}
    </div>
  );
};

export default StudentGrade;
