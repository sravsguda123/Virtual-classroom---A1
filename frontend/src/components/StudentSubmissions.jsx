import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Paper,
  Typography,
  Box,
  Fade,
  CircularProgress,
  Button,
  Snackbar,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider
} from '@mui/material';
import { Assignment, Grade, History } from '@mui/icons-material';

const StudentSubmissions = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showForm, setShowForm] = useState(false);
  const token = new URLSearchParams(window.location.search).get('token');

  useEffect(() => {
    setTimeout(() => setShowForm(true), 500);
    
    const fetchSubmissions = async () => {
      try {
        const response = await axios.get(
          'http://127.0.0.1:8000/my_submissions',
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setSubmissions(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching submissions:', error);
        setErrorMessage(error.response?.data?.detail || 'Failed to load your submissions');
        setError(true);
        setLoading(false);
      }
    };
    
    fetchSubmissions();
  }, [token]);

  // Format date string
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  return (
    <>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Poppins:wght@300;400;500;600&display=swap');
          
          @keyframes gradientFlow {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }

          @keyframes pulse {
            0% { opacity: 0.7; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.05); }
            100% { opacity: 0.7; transform: scale(1); }
          }

          .gradient-bg {
            background: linear-gradient(-45deg, #1a0033, #2a0944, #3b185f, #240046);
            background-size: 400% 400%;
            animation: gradientFlow 15s ease infinite;
          }

          .neon-glow {
            box-shadow: 0 0 30px rgba(157, 68, 192, 0.3);
            transition: all 0.4s ease;
          }
          
          .neon-glow:hover {
            box-shadow: 0 0 40px rgba(157, 68, 192, 0.5);
          }

          .hover-scale {
            transition: transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          }

          .hover-scale:hover {
            transform: scale(1.02);
          }
          
          .floating-particles {
            position: absolute;
            width: 100%;
            height: 100%;
            overflow: hidden;
            z-index: 0;
          }
          
          .particle {
            position: absolute;
            border-radius: 50%;
            background: rgba(157, 68, 192, 0.3);
            animation: pulse 4s infinite;
          }
        `}
      </style>

      <Container
        maxWidth={false}
        sx={{
          minHeight: "100vh",
          minWidth: "100vw",
          display: "flex",
          padding: 0,
          margin: 0,
          backgroundColor: "#0a0013",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Particles Background */}
        <Box className="floating-particles">
          {[...Array(15)].map((_, index) => (
            <Box
              key={index}
              className="particle"
              sx={{
                width: `${Math.random() * 15 + 5}px`,
                height: `${Math.random() * 15 + 5}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.5 + 0.3,
                animationDelay: `${Math.random() * 4}s`,
                animationDuration: `${Math.random() * 6 + 4}s`,
              }}
            />
          ))}
        </Box>

        {/* Main Content */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
            zIndex: 2,
            padding: { xs: 2, md: 4 },
          }}
        >
          <Fade in={showForm} timeout={1000}>
            <Paper
              elevation={24}
              sx={{
                width: "100%",
                maxWidth: "800px",
                minHeight: "500px",
                backgroundColor: "rgba(26, 0, 51, 0.85)",
                borderRadius: "24px",
                border: "1px solid rgba(157, 68, 192, 0.4)",
                position: "relative",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                padding: 4
              }}
              className="neon-glow hover-scale"
            >
              {/* Decorative accent line */}
              <Box 
                sx={{ 
                  position: "absolute", 
                  top: 0, 
                  left: 0, 
                  width: "100%", 
                  height: "4px", 
                  background: "linear-gradient(90deg, #8E24AA 0%, #9D44C0 50%, #6C3483 100%)" 
                }}
              />
              
              <Box sx={{ textAlign: "center", mb: 4 }}>
                <History 
                  sx={{ 
                    fontSize: 40, 
                    color: "#9D44C0", 
                    mb: 2,
                    filter: "drop-shadow(0 0 10px rgba(157, 68, 192, 0.5))" 
                  }} 
                />
                <Typography
                  variant="h3"
                  sx={{
                    color: "#FFFFFF",
                    textAlign: "center",
                    fontFamily: "'Playfair Display', serif",
                    fontWeight: 600,
                    letterSpacing: "2px",
                    mb: 1
                  }}
                >
                  Your Submissions
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#BBBBBB",
                    fontFamily: "'Poppins', sans-serif",
                    fontWeight: 300,
                  }}
                >
                  View your assignment history and grades
                </Typography>
              </Box>

              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 8 }}>
                  <CircularProgress sx={{ color: "#9D44C0" }} size={60} />
                </Box>
              ) : error ? (
                <Box sx={{ textAlign: "center", my: 4 }}>
                  <Typography
                    variant="h5"
                    sx={{
                      color: "#FF5555",
                      fontFamily: "'Poppins', sans-serif",
                      mb: 2
                    }}
                  >
                    Error Loading Submissions
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: "#DDDDDD",
                      fontFamily: "'Poppins', sans-serif",
                    }}
                  >
                    {errorMessage}
                  </Typography>
                </Box>
              ) : submissions.length === 0 ? (
                <Box sx={{ textAlign: "center", my: 8 }}>
                  <Typography
                    variant="h5"
                    sx={{
                      color: "#FFFFFF",
                      fontFamily: "'Poppins', sans-serif",
                      mb: 2
                    }}
                  >
                    No Submissions Yet
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: "#BBBBBB",
                      fontFamily: "'Poppins', sans-serif",
                    }}
                  >
                    You haven't submitted any assignments yet
                  </Typography>
                </Box>
              ) : (
                <List sx={{ width: '100%', bgcolor: 'transparent' }}>
                  {submissions.map((submission, index) => (
                    <React.Fragment key={submission._id}>
                      <ListItem 
                        alignItems="flex-start"
                        sx={{ 
                          py: 2,
                          borderRadius: '12px',
                          transition: 'all 0.3s',
                          '&:hover': {
                            bgcolor: 'rgba(255, 255, 255, 0.05)'
                          }
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                          <Assignment sx={{ color: '#9D44C0', fontSize: 32 }} />
                        </Box>
                        <ListItemText
                          primary={
                            <Typography
                              sx={{
                                color: '#FFFFFF',
                                fontFamily: "'Poppins', sans-serif",
                                fontWeight: 500,
                                fontSize: '1.1rem'
                              }}
                            >
                              {submission.assignment_name || `Assignment ${submission.assignment_id}`}
                            </Typography>
                          }
                          secondary={
                            <React.Fragment>
                              <Typography
                                sx={{
                                  display: 'block',
                                  color: '#BBBBBB',
                                  fontFamily: "'Poppins', sans-serif",
                                  fontSize: '0.9rem'
                                }}
                              >
                                Submitted: {submission.created_at ? formatDate(submission.created_at) : 'Unknown date'}
                              </Typography>
                              {submission.text_content && (
                                <Typography
                                  sx={{
                                    display: 'block',
                                    color: '#AAAAAA',
                                    fontFamily: "'Poppins', sans-serif",
                                    fontSize: '0.85rem',
                                    mt: 1,
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                    maxWidth: '400px'
                                  }}
                                >
                                  {submission.text_content}
                                </Typography>
                              )}
                              {submission.file_id && (
                                <Typography
                                  sx={{
                                    display: 'block',
                                    color: '#9D44C0',
                                    fontFamily: "'Poppins', sans-serif",
                                    fontSize: '0.85rem',
                                    mt: 0.5
                                  }}
                                >
                                  File Submitted
                                </Typography>
                              )}
                            </React.Fragment>
                          }
                        />
                        <ListItemSecondaryAction>
                          <Link 
                            to={`/grade_view/${submission._id}?token=${token}`}
                            style={{ textDecoration: 'none' }}
                          >
                            <Button
                              variant="contained"
                              startIcon={<Grade />}
                              sx={{
                                backgroundColor: submission.mark !== undefined ? "rgba(46, 204, 113, 0.15)" : "rgba(157, 68, 192, 0.15)",
                                color: submission.mark !== undefined ? "#2ECC71" : "#9D44C0",
                                fontFamily: "'Poppins', sans-serif",
                                textTransform: "none",
                                borderRadius: "12px",
                                "&:hover": {
                                  backgroundColor: submission.mark !== undefined ? "rgba(46, 204, 113, 0.25)" : "rgba(157, 68, 192, 0.25)",
                                },
                              }}
                            >
                              {submission.mark !== undefined ? "View Grade" : "Check Status"}
                            </Button>
                          </Link>
                        </ListItemSecondaryAction>
                      </ListItem>
                      {index < submissions.length - 1 && (
                        <Divider 
                          variant="inset" 
                          component="li" 
                          sx={{ 
                            borderColor: 'rgba(255, 255, 255, 0.1)',
                            ml: '60px'
                          }} 
                        />
                      )}
                    </React.Fragment>
                  ))}
                </List>
              )}
            </Paper>
          </Fade>
        </Box>
      </Container>
      
      {/* Error Notification */}
      <Snackbar 
        open={error} 
        autoHideDuration={6000} 
        onClose={() => setError(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setError(false)} 
          severity="error" 
          variant="filled"
          sx={{ 
            width: '100%',
            fontFamily: "'Poppins', sans-serif",
            bgcolor: '#FF5555', 
            color: 'white'
          }}
        >
          {errorMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default StudentSubmissions;