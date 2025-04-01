import { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useParams, useNavigate, Link } from "react-router-dom";
import {
  Container,
  Paper,
  Typography,
  Box,
  Fade,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Button,
  CircularProgress,
  Divider,
} from "@mui/material";
import {
  Assignment,
  ArrowBack,
  OpenInNew,
  InsertDriveFile,
  PersonOutline,
  TextSnippet,
  Link as LinkIcon,
  Refresh,
  Grade,
} from "@mui/icons-material";

const SubmissionsTable = () => {
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");
  const { assignmentId } = useParams();

  useEffect(() => {
    const fetchSubmissions = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/submissions/${assignmentId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setSubmissions(response.data);
      } catch (error) {
        console.error("Error fetching submissions:", error);
      } finally {
        setLoading(false);
        setTimeout(() => setShowContent(true), 300);
      }
    };

    if (assignmentId) fetchSubmissions();
  }, [assignmentId, token]);



  const handleRefresh = () => {
    setShowContent(false);
    setTimeout(() => {
      const fetchSubmissions = async () => {
        setLoading(true);
        try {
          const response = await axios.get(
            `http://127.0.0.1:8000/submissions/${assignmentId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setSubmissions(response.data);
        } catch (error) {
          console.error("Error fetching submissions:", error);
        } finally {
          setLoading(false);
          setShowContent(true);
        }
      };
      fetchSubmissions();
    }, 300);
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
            transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
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
          
          .custom-table {
            background-color: transparent;
          }
          
          .custom-table .MuiTableCell-root {
            border-color: rgba(157, 68, 192, 0.2);
            color: #E0E0E0;
            font-family: 'Poppins', sans-serif;
          }
          
          .custom-table .MuiTableCell-head {
            background-color: rgba(157, 68, 192, 0.2);
            color: #FFFFFF;
            font-weight: 500;
            font-family: 'Poppins', sans-serif;
          }
          
          .custom-table .MuiTableRow-root {
            transition: background-color 0.3s ease;
          }
          
          .custom-table .MuiTableRow-root:hover {
            background-color: rgba(157, 68, 192, 0.1);
          }
          
          .empty-state {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 48px;
            color: #BBBBBB;
            font-family: 'Poppins', sans-serif;
            background-color: rgba(26, 0, 51, 0.3);
            border-radius: 16px;
            border: 1px dashed rgba(157, 68, 192, 0.3);
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
                maxWidth: "1000px",
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
                      },
                    }}
                    onClick={() => navigate(-1)}
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
                    Submissions
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Button
                    startIcon={<Refresh />}
                    onClick={handleRefresh}
                    sx={{
                      color: "#E0E0E0",
                      backgroundColor: "rgba(157, 68, 192, 0.15)",
                      borderRadius: "12px",
                      padding: "8px 16px",
                      fontFamily: "'Poppins', sans-serif",
                      textTransform: "none",
                      "&:hover": {
                        backgroundColor: "rgba(157, 68, 192, 0.25)",
                      },
                    }}
                  >
                    Refresh
                  </Button>
                </Box>
              </Box>

              {/* Content */}
              <Box
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
                    <Typography
                      variant="h6"
                      sx={{
                        color: "#E0E0E0",
                        fontFamily: "'Poppins', sans-serif",
                        fontWeight: 400,
                        mb: 3,
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <TextSnippet sx={{ mr: 1, color: "#9D44C0" }} />
                      Submissions for Assignment {assignmentId}
                    </Typography>

                    {loading ? (
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          height: "200px",
                        }}
                      >
                        <CircularProgress sx={{ color: "#9D44C0" }} />
                      </Box>
                    ) : submissions.length === 0 ? (
                      <Box className="empty-state">
                        <Assignment
                          sx={{
                            fontSize: 64,
                            color: "rgba(157, 68, 192, 0.5)",
                            mb: 2,
                          }}
                        />
                        <Typography
                          variant="h6"
                          sx={{
                            color: "#E0E0E0",
                            fontFamily: "'Poppins', sans-serif",
                            fontWeight: 400,
                          }}
                        >
                          No submissions found.
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: "#BBBBBB",
                            fontFamily: "'Poppins', sans-serif",
                            textAlign: "center",
                            mt: 1,
                          }}
                        >
                          There are no submissions for this assignment yet.
                        </Typography>
                      </Box>
                    ) : (
                      <TableContainer
                        component={Paper}
                        sx={{
                          backgroundColor: "rgba(26, 0, 51, 0.5)",
                          borderRadius: "16px",
                          border: "1px solid rgba(157, 68, 192, 0.2)",
                          overflow: "hidden",
                        }}
                      >
                        <Table className="custom-table">
                          <TableHead>
                            <TableRow>
                              <TableCell
                                sx={{
                                  borderTopLeftRadius: "16px",
                                  fontWeight: 600,
                                }}
                              >
                                <Box sx={{ display: "flex", alignItems: "center" }}>
                                  <Assignment sx={{ mr: 1, fontSize: 20 }} />
                                  Submission ID
                                </Box>
                              </TableCell>
                              <TableCell sx={{ fontWeight: 600 }}>
                                <Box sx={{ display: "flex", alignItems: "center" }}>
                                  <PersonOutline sx={{ mr: 1, fontSize: 20 }} />
                                  Student ID
                                </Box>
                              </TableCell>
                              <TableCell sx={{ fontWeight: 600 }}>
                                <Box sx={{ display: "flex", alignItems: "center" }}>
                                  <TextSnippet sx={{ mr: 1, fontSize: 20 }} />
                                  Text Content
                                </Box>
                              </TableCell>
                              <TableCell sx={{ fontWeight: 600 }}>
                                <Box sx={{ display: "flex", alignItems: "center" }}>
                                  <LinkIcon sx={{ mr: 1, fontSize: 20 }} />
                                  Link
                                </Box>
                              </TableCell>
                              <TableCell
                                sx={{
                                  borderTopRightRadius: "16px",
                                  fontWeight: 600,
                                }}
                              >
                                <Box sx={{ display: "flex", alignItems: "center" }}>
                                  <InsertDriveFile sx={{ mr: 1, fontSize: 20 }} />
                                  File ID
                                </Box>
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {submissions.map((submission) => (
                              <TableRow key={submission._id} className="hover-scale">
                                <TableCell
                                  sx={{
                                    maxWidth: "150px",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                  }}
                                >
                                  {submission._id}
                                </TableCell>
                                <TableCell>{submission.student_id}</TableCell>
                                <TableCell
                                  sx={{
                                    maxWidth: "200px",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                  }}
                                >
                                  {submission.text_content || "N/A"}
                                </TableCell>
                                <TableCell>
                                  {submission.link ? (
                                    <Button
                                      variant="contained"
                                      startIcon={<OpenInNew />}
                                      href={submission.link}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      sx={{
                                        backgroundColor: "rgba(157, 68, 192, 0.2)",
                                        color: "#9D44C0",
                                        fontFamily: "'Poppins', sans-serif",
                                        textTransform: "none",
                                        borderRadius: "12px",
                                        "&:hover": {
                                          backgroundColor: "rgba(157, 68, 192, 0.3)",
                                        },
                                      }}
                                    >
                                      Open Link
                                    </Button>
                                  ) : (
                                    <Typography
                                      sx={{
                                        color: "#BBBBBB",
                                        fontFamily: "'Poppins', sans-serif",
                                        fontSize: "0.875rem",
                                      }}
                                    >
                                      No Link
                                    </Typography>
                                  )}
                                </TableCell>
                                <TableCell>
                                  <Typography
                                    sx={{
                                      color: submission.file_id ? "#E0E0E0" : "#BBBBBB",
                                      fontFamily: "'Poppins', sans-serif",
                                    }}
                                  >
                                    {submission.file_id || "No File"}
                                    <button onClick={() => axios.get(`http://127.0.0.1:8000/download/${submission.file_id}`, { headers: { Authorization: `Bearer ${token}` }, responseType: "blob" }).then(res => { const url = window.URL.createObjectURL(new Blob([res.data])); const link = document.createElement("a"); link.href = url; link.setAttribute("download", `file_${submission.file_id}.pdf`); document.body.appendChild(link); link.click(); document.body.removeChild(link); }).catch(err => console.error("Error downloading file:", err))} className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">Download File</button>

                                  </Typography>
                                </TableCell>
                                {/* Grade Cell */}
                                <TableCell>
                                  <Link 
                                    to={`/grade/${assignmentId}?token=${token}`}
                                    style={{ textDecoration: "none" }}
                                  >
                                    <Button
                                      variant="contained"
                                      startIcon={<Grade />}
                                      sx={{
                                        backgroundColor: "rgba(46, 204, 113, 0.15)",
                                        color: "#2ECC71",
                                        fontFamily: "'Poppins', sans-serif",
                                        textTransform: "none",
                                        borderRadius: "12px",
                                        "&:hover": {
                                          backgroundColor: "rgba(46, 204, 113, 0.25)",
                                        },
                                      }}
                                    >
                                      Grade
                                    </Button>
                                  </Link>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    )}
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
                  Virtual Classroom Submission Review • {new Date().getFullYear()}
                </Typography>
              </Box>
            </Paper>
          </Fade>
        </Box>
      </Container>
    </>
  );
};

export default SubmissionsTable;





// import { useState } from "react";
// import axios from "axios";
// import { useLocation, useParams } from "react-router-dom";

// const SubmissionsTable = () => {
//     const [submissions, setSubmissions] = useState([]);
//     const location = useLocation();
//     const queryParams = new URLSearchParams(location.search);
//     const token = queryParams.get("token");
//     const { assignmentId } = useParams();

//     const fetchSubmissions = async () => {
//         try {
//             const response = await axios.get(http://127.0.0.1:8000/submissions/${assignmentId}, {
//                 headers: {
//                     Authorization: Bearer ${token},
//                 },
//             });
//             setSubmissions(response.data);
//         } catch (error) {
//             console.error("Error fetching submissions:", error);
//         }
//     };

//     const handleDownload = async (fileId) => {
//         try {
//             const response = await axios.get(http://127.0.0.1:8000/download/${fileId}, {
//                 headers: {
//                     Authorization: Bearer ${token},
//                 },
//                 responseType: 'blob',
//             });
//             const url = window.URL.createObjectURL(new Blob([response.data]));
//             const link = document.createElement('a');
//             link.href = url;
//             const contentDisposition = response.headers['content-disposition'];
//             if (contentDisposition) {
//                 const filename = contentDisposition.split('filename=')[1].trim().replace(/"/g, '');
//                 link.setAttribute('download', filename);
//             } else {
//                 link.setAttribute('download', 'file');
//             }
//             document.body.appendChild(link);
//             link.click();
//             link.parentNode.removeChild(link);
//         } catch (error) {
//             console.error("Error downloading file:", error);
//         }
//     };

//     return (
//         <div>
//             <h2>Submissions for Assignment {assignmentId}</h2>
//             <button onClick={fetchSubmissions}>See Submissions</button>
//             {submissions.length === 0 ? (
//                 <p>No submissions found.</p>
//             ) : (
//                 <table border="1">
//                     <thead>
//                         <tr>
//                             <th>Submission ID</th>
//                             <th>Student ID</th>
//                             <th>Text Content</th>
//                             <th>Link</th>
//                             <th>File</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {submissions.map((submission) => (
//                             <tr key={submission._id}>
//                                 <td>{submission._id}</td>
//                                 <td>{submission.student_id}</td>
//                                 <td>{submission.text_content || "N/A"}</td>
//                                 <td>
//                                     {submission.link ? (
//                                         <a href={submission.link} target="_blank" rel="noopener noreferrer">
//                                             Open Link
//                                         </a>
//                                     ) : (
//                                         "No Link"
//                                     )}
//                                 </td>
//                                 <td>
//                                     {submission.file_id ? (
//                                         <button onClick={() => handleDownload(submission.file_id)}>Download File</button>
//                                     ) : (
//                                         "No File"
//                                     )}
//                                 </td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             )}
//         </div>
//     );
// };

// export default SubmissionsTable;