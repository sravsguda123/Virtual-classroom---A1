import { useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Slide,
  Fade,
  CircularProgress,
  Snackbar,
  Alert,
  InputAdornment,
} from "@mui/material";
import {
  Assignment,
  Link as LinkIcon,
  Upload,
  TextFields,
  Numbers,
  CheckCircleOutline,
} from "@mui/icons-material";

const AssignmentSubmission = () => {
  const [assignmentId, setAssignmentId] = useState("");
  const [textContent, setTextContent] = useState("");
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const token = params.get("token");
  const [link, setLink] = useState("");
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [mcqAnswers, setMcqAnswers] = useState("");
  const [loading, setLoading] = useState(false);
  const [showError, setShowError] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [message, setMessage] = useState("");
  const [showForm, setShowForm] = useState(false);

  useState(() => {
    setTimeout(() => setShowForm(true), 500);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData();
    
    if (textContent) formData.append("text_content", textContent);
    if (file) formData.append("file", file);
    if (link) formData.append("link", link);
    if (mcqAnswers) formData.append("mcq_answers", mcqAnswers);
    
    formData.append("assignment_id", assignmentId);

    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/submit`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setMessage(response.data.message);
      setShowSuccess(true);
      setLoading(false);
    } catch (error) {
      setMessage("Submission failed");
      setShowError(true);
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
    setFileName(selectedFile ? selectedFile.name : "");
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

          @keyframes float {
            0% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(5deg); }
            100% { transform: translateY(0px) rotate(0deg); }
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
          
          input:-webkit-autofill,
          input:-webkit-autofill:hover,
          input:-webkit-autofill:focus,
          input:-webkit-autofill:active {
            -webkit-box-shadow: 0 0 0 30px rgba(43, 9, 68, 0.9) inset !important;
            -webkit-text-fill-color: #E0E0E0 !important;
          }
          
          .custom-file-input {
            color: transparent;
            width: 100%;
            position: relative;
          }
          
          .custom-file-input::-webkit-file-upload-button {
            visibility: hidden;
          }
          
          .custom-file-input::before {
            content: 'Select File';
            color: #E0E0E0;
            display: inline-block;
            background: rgba(255,255,255,0.1);
            border-radius: 12px;
            padding: 16px 20px;
            outline: none;
            white-space: nowrap;
            cursor: pointer;
            font-family: 'Poppins', sans-serif;
            width: 100%;
            text-align: left;
            font-size: 1rem;
          }
          
          .custom-file-input:hover::before {
            background: rgba(255,255,255,0.15);
          }
          
          .custom-file-input:active::before {
            background: rgba(255,255,255,0.2);
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
                minHeight: "70vh",
                backgroundColor: "rgba(26, 0, 51, 0.85)",
                borderRadius: "24px",
                border: "1px solid rgba(157, 68, 192, 0.4)",
                position: "relative",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
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
              
              <Box sx={{ textAlign: "center", mb: 5, mt: 4 }}>
                <Assignment 
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
                  Assignment Submission
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#BBBBBB",
                    fontFamily: "'Poppins', sans-serif",
                    fontWeight: 300,
                  }}
                >
                  Share your work and demonstrate your understanding
                </Typography>
              </Box>

              <form onSubmit={handleSubmit}>
                <Slide direction="up" in={showForm} timeout={1000} style={{ transitionDelay: '200ms' }}>
                  <TextField
                    fullWidth
                    label="Assignment ID"
                    variant="filled"
                    value={assignmentId}
                    onChange={(e) => setAssignmentId(e.target.value)}
                    required
                    sx={{
                      mb: 3,
                      "& .MuiFilledInput-root": {
                        backgroundColor: "rgba(255,255,255,0.1)",
                        borderRadius: "12px",
                        color: "#E0E0E0",
                        fontFamily: "'Poppins', sans-serif",
                        transition: "all 0.3s ease",
                        "&:hover": { backgroundColor: "rgba(255,255,255,0.15)" },
                        "&.Mui-focused": { 
                          backgroundColor: "rgba(255,255,255,0.2)",
                          boxShadow: "0 0 15px rgba(157, 68, 192, 0.3)",
                        },
                      },
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Numbers sx={{ color: "#9D44C0" }} />
                        </InputAdornment>
                      ),
                    }}
                    InputLabelProps={{
                      sx: { 
                        color: "#C0C0C0",
                        fontFamily: "'Poppins', sans-serif",
                      },
                    }}
                  />
                </Slide>

                <Slide direction="up" in={showForm} timeout={1000} style={{ transitionDelay: '300ms' }}>
                  <TextField
                    fullWidth
                    label="Your Answer"
                    variant="filled"
                    multiline
                    rows={4}
                    value={textContent}
                    onChange={(e) => setTextContent(e.target.value)}
                    sx={{
                      mb: 3,
                      "& .MuiFilledInput-root": {
                        backgroundColor: "rgba(255,255,255,0.1)",
                        borderRadius: "12px",
                        color: "#E0E0E0",
                        fontFamily: "'Poppins', sans-serif",
                        transition: "all 0.3s ease",
                        "&:hover": { backgroundColor: "rgba(255,255,255,0.15)" },
                        "&.Mui-focused": { 
                          backgroundColor: "rgba(255,255,255,0.2)",
                          boxShadow: "0 0 15px rgba(157, 68, 192, 0.3)",
                        },
                      },
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start" sx={{ alignSelf: "flex-start", mt: 1.5 }}>
                          <TextFields sx={{ color: "#9D44C0" }} />
                        </InputAdornment>
                      ),
                    }}
                    InputLabelProps={{
                      sx: { 
                        color: "#C0C0C0",
                        fontFamily: "'Poppins', sans-serif",
                      },
                    }}
                  />
                </Slide>

                <Slide direction="up" in={showForm} timeout={1000} style={{ transitionDelay: '400ms' }}>
                  <TextField
                    fullWidth
                    label="Resource Link"
                    variant="filled"
                    type="url"
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    sx={{
                      mb: 3,
                      "& .MuiFilledInput-root": {
                        backgroundColor: "rgba(255,255,255,0.1)",
                        borderRadius: "12px",
                        color: "#E0E0E0",
                        fontFamily: "'Poppins', sans-serif",
                        transition: "all 0.3s ease",
                        "&:hover": { backgroundColor: "rgba(255,255,255,0.15)" },
                        "&.Mui-focused": { 
                          backgroundColor: "rgba(255,255,255,0.2)",
                          boxShadow: "0 0 15px rgba(157, 68, 192, 0.3)",
                        },
                      },
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LinkIcon sx={{ color: "#9D44C0" }} />
                        </InputAdornment>
                      ),
                    }}
                    InputLabelProps={{
                      sx: { 
                        color: "#C0C0C0",
                        fontFamily: "'Poppins', sans-serif",
                      },
                    }}
                  />
                </Slide>

                <Slide direction="up" in={showForm} timeout={1000} style={{ transitionDelay: '500ms' }}>
                  <Box
                    sx={{
                      mb: 3,
                      backgroundColor: "rgba(255,255,255,0.1)",
                      borderRadius: "12px",
                      color: "#E0E0E0",
                      fontFamily: "'Poppins', sans-serif",
                      transition: "all 0.3s ease",
                      p: 2,
                      "&:hover": { backgroundColor: "rgba(255,255,255,0.15)" },
                      "&.Mui-focused": { 
                        backgroundColor: "rgba(255,255,255,0.2)",
                        boxShadow: "0 0 15px rgba(157, 68, 192, 0.3)",
                      },
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      <Upload sx={{ color: "#9D44C0", mr: 1 }} />
                      <Typography
                        variant="body2"
                        sx={{
                          color: "#C0C0C0",
                          fontFamily: "'Poppins', sans-serif",
                        }}
                      >
                        Upload File
                      </Typography>
                    </Box>
                    <input
                      type="file"
                      className="custom-file-input"
                      onChange={handleFileChange}
                    />
                    {fileName && (
                      <Typography
                        variant="body2"
                        sx={{
                          mt: 1,
                          color: "#9D44C0",
                          fontFamily: "'Poppins', sans-serif",
                          fontSize: "0.8rem"
                        }}
                      >
                        {fileName}
                      </Typography>
                    )}
                  </Box>
                </Slide>

                <Slide direction="up" in={showForm} timeout={1000} style={{ transitionDelay: '600ms' }}>
                  <TextField
                    fullWidth
                    label="MCQ Answers (comma separated)"
                    variant="filled"
                    value={mcqAnswers}
                    onChange={(e) => setMcqAnswers(e.target.value)}
                    sx={{
                      mb: 4,
                      "& .MuiFilledInput-root": {
                        backgroundColor: "rgba(255,255,255,0.1)",
                        borderRadius: "12px",
                        color: "#E0E0E0",
                        fontFamily: "'Poppins', sans-serif",
                        transition: "all 0.3s ease",
                        "&:hover": { backgroundColor: "rgba(255,255,255,0.15)" },
                        "&.Mui-focused": { 
                          backgroundColor: "rgba(255,255,255,0.2)",
                          boxShadow: "0 0 15px rgba(157, 68, 192, 0.3)",
                        },
                      },
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <CheckCircleOutline sx={{ color: "#9D44C0" }} />
                        </InputAdornment>
                      ),
                    }}
                    InputLabelProps={{
                      sx: { 
                        color: "#C0C0C0",
                        fontFamily: "'Poppins', sans-serif",
                      },
                    }}
                  />
                </Slide>

                <Slide direction="up" in={showForm} timeout={1000} style={{ transitionDelay: '700ms' }}>
                  <Button
                    fullWidth
                    variant="contained"
                    type="submit"
                    disabled={loading}
                    sx={{
                      py: 2,
                      mt: 2,
                      background: "linear-gradient(45deg, #9D44C0 0%, #6C3483 100%)",
                      fontWeight: "500",
                      letterSpacing: "2px",
                      fontSize: "1.1rem",
                      borderRadius: "12px",
                      fontFamily: "'Poppins', sans-serif",
                      color: "#FFFFFF",
                      boxShadow: "0 4px 20px rgba(157, 68, 192, 0.3)",
                      border: "none",
                      "&:hover": {
                        background: "linear-gradient(45deg, #8E24AA 0%, #6A1B9A 100%)",
                        transform: "translateY(-2px)",
                        boxShadow: "0 6px 25px rgba(157, 68, 192, 0.5)",
                      },
                      "&:active": {
                        transform: "translateY(1px)",
                        boxShadow: "0 2px 10px rgba(157, 68, 192, 0.4)",
                      },
                      transition: "all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                    }}
                  >
                    {loading ? (
                      <CircularProgress size={24} sx={{ color: "#FFFFFF" }} />
                    ) : (
                      "SUBMIT ASSIGNMENT"
                    )}
                  </Button>
                </Slide>
              </form>
            </Paper>
          </Fade>
        </Box>
      </Container>
      
      {/* Error Notification */}
      <Snackbar 
        open={showError} 
        autoHideDuration={6000} 
        onClose={() => setShowError(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setShowError(false)} 
          severity="error" 
          variant="filled"
          sx={{ 
            width: '100%',
            fontFamily: "'Poppins', sans-serif",
            bgcolor: '#9D44C0', 
            color: 'white'
          }}
        >
          {message}
        </Alert>
      </Snackbar>
      
      {/* Success Notification */}
      <Snackbar 
        open={showSuccess} 
        autoHideDuration={6000} 
        onClose={() => setShowSuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setShowSuccess(false)} 
          severity="success" 
          variant="filled"
          sx={{ 
            width: '100%',
            fontFamily: "'Poppins', sans-serif",
            bgcolor: '#9D44C0',
            color: 'white'
          }}
        >
          {message}
        </Alert>
      </Snackbar>
    </>
  );
};
export default AssignmentSubmission;