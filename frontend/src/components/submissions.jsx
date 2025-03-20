import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { useParams } from "react-router-dom";
import {
  Container,
  Paper,
  Typography,
  Button,
  Box,
  Fade,
  TextField,
  CircularProgress,
  IconButton,
  Divider,
} from "@mui/material";
import {
  Assignment,
  CloudUpload,
  Link as LinkIcon,
  TextFields,
  QuestionAnswer,
  ArrowBack,
  CalendarToday,
} from "@mui/icons-material";

const AssignmentSubmission = () => {
  const { assignmentId } = useParams();
  const [textContent, setTextContent] = useState("");
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const token = params.get("token");
  const [link, setLink] = useState("");
  const [file, setFile] = useState(null);
  const [mcqAnswers, setMcqAnswers] = useState("");
  const [duedate, setDuedate] = useState("");
  const [loading, setLoading] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [fileName, setFileName] = useState("");

  useEffect(() => {
    const fetchDueDate = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/assignment_due_date/${assignmentId}`);
        setDuedate(response.data.due_date);
        console.log(response.data.due_date);
      } catch (error) {
        console.error("Error fetching due date:", error);
      } finally {
        setTimeout(() => setShowContent(true), 300);
      }
    };
    if (assignmentId) fetchDueDate();
  }, [assignmentId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();

    if (textContent) formData.append("text_content", textContent);
    if (file) formData.append("file", file);
    if (link) formData.append("link", link);

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
      alert(response.data.message);
    } catch (error) {
      alert("Submission failed");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
    setFileName(selectedFile?.name || "");
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
          
          .input-container {
            position: relative;
            margin-bottom: 24px;
            transition: all 0.3s ease;
          }
          
          .input-container:hover {
            transform: translateY(-2px);
          }
          
          .input-icon {
            position: absolute;
            top: 16px;
            left: 16px;
            color: rgba(157, 68, 192, 0.7);
          }
          
          .custom-file-input {
            display: none;
          }
          
          .file-upload-btn {
            background-color: rgba(157, 68, 192, 0.15);
            color: #9D44C0;
            border: 1px dashed rgba(157, 68, 192, 0.5);
            border-radius: 16px;
            padding: 16px;
            width: 100%;
            text-align: center;
            cursor: pointer;
            transition: all 0.3s ease;
            font-family: 'Poppins', sans-serif;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            height: 56px;
          }
          
          .file-upload-btn:hover {
            background-color: rgba(157, 68, 192, 0.25);
            border-color: rgba(157, 68, 192, 0.7);
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
          <Fade in={true} timeout={1000}>
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
              className="neon-glow"
            >
              {/* Decorative accent line */}
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "4px",
                  background: "linear-gradient(90deg, #8E24AA 0%, #9D44C0 50%, #6C3483 100%)",
                }}
              />

              {/* Header */}
              <Box
                sx={{
                  padding: 4,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  borderBottom: "1px solid rgba(157, 68, 192, 0.2)",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <IconButton
                    sx={{ 
                      color: "#9D44C0", 
                      mr: 2,
                      "&:hover": {
                        backgroundColor: "rgba(157, 68, 192, 0.1)",
                      }
                    }}
                  >
                    <ArrowBack />
                  </IconButton>
                  <Assignment
                    sx={{
                      fontSize: 36,
                      color: "#9D44C0",
                      marginRight: 2,
                      filter: "drop-shadow(0 0 10px rgba(157, 68, 192, 0.5))",
                    }}
                  />
                  <Typography
                    variant="h4"
                    sx={{
                      color: "#FFFFFF",
                      fontFamily: "'Playfair Display', serif",
                      fontWeight: 600,
                      letterSpacing: "1px",
                    }}
                  >
                    Submit Assignment
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <CalendarToday sx={{ color: "#9D44C0", mr: 1 }} />
                  <Typography
                    variant="subtitle1"
                    sx={{
                      color: "#E0E0E0",
                      fontFamily: "'Poppins', sans-serif",
                      fontWeight: 300,
                      backgroundColor: "rgba(157, 68, 192, 0.2)",
                      borderRadius: "12px",
                      padding: "4px 12px",
                    }}
                  >
                    Due: {duedate}
                  </Typography>
                </Box>
              </Box>

              {/* Form Content */}
              <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{
                  flex: 1,
                  overflow: "auto",
                  padding: 3,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Fade in={showContent} timeout={800}>
                  <Box>
                    {/* Text Content */}
                    <Box className="input-container" sx={{ position: "relative" }}>
                      <TextFields className="input-icon" />
                      <TextField
                        fullWidth
                        multiline
                        rows={6}
                        placeholder="Write your answer..."
                        value={textContent}
                        onChange={(e) => setTextContent(e.target.value)}
                        variant="outlined"
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            color: "#E0E0E0",
                            fontFamily: "'Poppins', sans-serif",
                            backgroundColor: "rgba(26, 0, 51, 0.4)",
                            borderRadius: "16px",
                            pl: 5,
                            "& fieldset": {
                              borderColor: "rgba(157, 68, 192, 0.3)",
                            },
                            "&:hover fieldset": {
                              borderColor: "rgba(157, 68, 192, 0.5)",
                            },
                            "&.Mui-focused fieldset": {
                              borderColor: "#9D44C0",
                            },
                          },
                        }}
                      />
                    </Box>

                    {/* Link */}
                    <Box className="input-container" sx={{ position: "relative" }}>
                      <LinkIcon className="input-icon" />
                      <TextField
                        fullWidth
                        placeholder="Submit a link (optional)"
                        value={link}
                        onChange={(e) => setLink(e.target.value)}
                        variant="outlined"
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            color: "#E0E0E0",
                            fontFamily: "'Poppins', sans-serif",
                            backgroundColor: "rgba(26, 0, 51, 0.4)",
                            borderRadius: "16px",
                            pl: 5,
                            "& fieldset": {
                              borderColor: "rgba(157, 68, 192, 0.3)",
                            },
                            "&:hover fieldset": {
                              borderColor: "rgba(157, 68, 192, 0.5)",
                            },
                            "&.Mui-focused fieldset": {
                              borderColor: "#9D44C0",
                            },
                          },
                        }}
                      />
                    </Box>

                    {/* File Upload */}
                    <Box className="input-container">
                      <input
                        type="file"
                        id="file-upload"
                        className="custom-file-input"
                        onChange={handleFileChange}
                      />
                      <label htmlFor="file-upload" className="file-upload-btn"
                        style={{
                          width: "725px",  // Adjust width as needed
                          height: "20px",   // Adjust height as needed
                          padding: "12px",  // Adjust padding to control internal spacing
                        }}>
                        <CloudUpload sx={{ fontSize: 24, color: "#9D44C0" }} />
                        <Typography variant="body1" sx={{ color: "#E0E0E0" }}>
                          {fileName ? `Selected: ${fileName}` : "Upload File (optional)"}
                        </Typography>
                      </label>
                    </Box>

                    {/* MCQ Answers */}
                    <Box className="input-container" sx={{ position: "relative" }}>
                      <QuestionAnswer className="input-icon" />
                      <TextField
                        fullWidth
                        multiline
                        rows={4}
                        placeholder="Enter MCQ answers (comma separated)"
                        value={mcqAnswers}
                        onChange={(e) => setMcqAnswers(e.target.value)}
                        variant="outlined"
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            color: "#E0E0E0",
                            fontFamily: "'Poppins', sans-serif",
                            backgroundColor: "rgba(26, 0, 51, 0.4)",
                            borderRadius: "16px",
                            pl: 5,
                            "& fieldset": {
                              borderColor: "rgba(157, 68, 192, 0.3)",
                            },
                            "&:hover fieldset": {
                              borderColor: "rgba(157, 68, 192, 0.5)",
                            },
                            "&.Mui-focused fieldset": {
                              borderColor: "#9D44C0",
                            },
                          },
                        }}
                      />
                    </Box>

                    {/* Submit Button */}
                    <Box sx={{ mt: 3, textAlign: "center" }}>
                      <Button
                        type="submit"
                        variant="contained"
                        disabled={loading}
                        sx={{
                          backgroundColor: "#9D44C0",
                          color: "#FFFFFF",
                          fontFamily: "'Poppins', sans-serif",
                          fontWeight: 500,
                          borderRadius: "16px",
                          padding: "12px 36px",
                          fontSize: "1.1rem",
                          textTransform: "none",
                          "&:hover": {
                            backgroundColor: "#8E24AA",
                            boxShadow: "0 0 15px rgba(157, 68, 192, 0.5)",
                          },
                        }}
                      >
                        {loading ? (
                          <CircularProgress size={24} sx={{ color: "#FFFFFF" }} />
                        ) : (
                          "Submit Assignment"
                        )}
                      </Button>
                    </Box>
                  </Box>
                </Fade>
              </Box>

              {/* Footer */}
              <Box
                sx={{
                  padding: 2,
                  display: "flex",
                  justifyContent: "center",
                  borderTop: "1px solid rgba(157, 68, 192, 0.2)",
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    color: "#BBBBBB",
                    fontFamily: "'Poppins', sans-serif",
                    opacity: 0.7,
                  }}
                >
                  Virtual Classroom Assignment Submission • {new Date().getFullYear()}
                </Typography>
              </Box>
            </Paper>
          </Fade>
        </Box>
      </Container>
    </>
  );
};

export default AssignmentSubmission;