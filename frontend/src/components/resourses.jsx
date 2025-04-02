import { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Grid,
  CircularProgress,
  IconButton,
  InputAdornment,
  Fade,
  Slide,
  Divider,
  Card,
  CardContent,
  Chip,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  Search,
  CloudUpload,
  Title,
  Description,
  LocalOffer,
  Article
} from "@mui/icons-material";

export default function ResourceSharing() {
  const [searchTags, setSearchTags] = useState("");
  const [resources, setResources] = useState([]);
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [showError, setShowError] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const params = new URLSearchParams(window.location.search);
  const token = params.get("token")
  
  useEffect(() => {
    // Stagger animations for a more elegant entrance
    setTimeout(() => setShowForm(true), 500);
  }, []);
  const handleLike = async (res_id) => {
    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/like/${res_id}`,
        {}, // Empty body
        {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        }
      );
      console.log("Like response:", response.data); // Debugging
    } catch (error) {
      console.error("Like failed", error);
      setError("Like failed. Please try again.");
      setShowError(true);
    }
  };
  const handleSearch = async () => {
    try {
      setLoading(true);
      const tagsArray = searchTags.split(",").map(tag => tag.trim());
  
      const response = await axios.get("http://127.0.0.1:8000/search", {
        params: { tags: tagsArray },
        paramsSerializer: (params) => {
          return new URLSearchParams(params).toString();
        },
      });
      console.log(response.data[0]);
      if (Array.isArray(response.data)) {
        setResources(response.data);
      } else {
        setResources([]);
      }
      setLoading(false);
    } catch (error) {
      console.error("Search failed", error);
      setResources([]);
      setError("Search failed. Please try again.");
      setShowError(true);
      setLoading(false);
    }
  };
  
  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file to upload");
      setShowError(true);
      return;
    }
    
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("title", title || "");  // Ensure it's a string
      formData.append("description", description || "");  // Ensure it's a string
  
      console.log("Sending description:", description); // Debugging
  
      const response = await axios.post("http://127.0.0.1:8000/upload", formData, {
        headers: { "Content-Type": "multipart/form-data", 
          "Authorization": `Bearer ${token}`
        },
        
      });
  
      setSuccess(true);
      console.log("Tags:", response.data.tags);
      setLoading(false);
      
      // Reset form fields after successful upload
      setFile(null);
      setTitle("");
      setDescription("");
      
      // Get updated resources
      handleSearch();
    } catch (error) {
      console.error("Upload failed", error);
      setError("Upload failed. Please try again.");
      setShowError(true);
      setLoading(false);
    }
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
          
          .custom-file-input::-webkit-file-upload-button {
            visibility: hidden;
            width: 0;
          }
          
          .custom-file-input::before {
            content: 'Select File';
            display: inline-block;
            background: linear-gradient(45deg, #9D44C0 0%, #6C3483 100%);
            color: white;
            border-radius: 8px;
            padding: 8px 16px;
            outline: none;
            white-space: nowrap;
            cursor: pointer;
            font-weight: 500;
            font-size: 14px;
            box-shadow: 0 4px 20px rgba(157, 68, 192, 0.3);
            transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          }
          
          .custom-file-input:hover::before {
            background: linear-gradient(45deg, #8E24AA 0%, #6A1B9A 100%);
            transform: translateY(-2px);
            box-shadow: 0 6px 25px rgba(157, 68, 192, 0.5);
          }
          
          .custom-file-input:active::before {
            transform: translateY(1px);
            box-shadow: 0 2px 10px rgba(157, 68, 192, 0.4);
          }
          
          .resource-card {
            transition: all 0.3s ease;
          }
          
          .resource-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 30px rgba(157, 68, 192, 0.4);
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

        <Container 
          maxWidth="xl" 
          sx={{ 
            py: 6, 
            position: "relative", 
            zIndex: 2 
          }}
        >
          <Fade in={true} timeout={1500}>
            <Box sx={{ textAlign: "center", mb: 6 }}>
              <Typography
                variant="h2"
                sx={{
                  color: "#FFFFFF",
                  fontFamily: "'Playfair Display', serif",
                  fontWeight: 600,
                  letterSpacing: "3px",
                  textShadow: "0 0 20px rgba(157, 68, 192, 0.5)",
                  mb: 2
                }}
              >
                Resource Sharing
              </Typography>
              <Typography
                variant="subtitle1"
                sx={{
                  color: "#E0E0E0",
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: "1.2rem",
                  maxWidth: "800px",
                  mx: "auto",
                  lineHeight: 1.6,
                  letterSpacing: "0.5px",
                }}
              >
                Discover and share educational resources with your peers
              </Typography>
            </Box>
          </Fade>

          <Grid container spacing={4}>
            {/* Search Section */}
            <Grid item xs={12} md={6}>
              <Fade in={showForm} timeout={1000}>
                <Paper
                  elevation={24}
                  sx={{
                    padding: { xs: 3, md: 4 },
                    backgroundColor: "rgba(26, 0, 51, 0.85)",
                    borderRadius: "24px",
                    border: "1px solid rgba(157, 68, 192, 0.4)",
                    position: "relative",
                    overflow: "hidden",
                    mb: 4,
                    height: "100%"
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
                    <Search 
                      sx={{ 
                        fontSize: 40, 
                        color: "#9D44C0", 
                        mb: 2,
                        filter: "drop-shadow(0 0 10px rgba(157, 68, 192, 0.5))" 
                      }} 
                    />
                    <Typography
                      variant="h4"
                      sx={{
                        color: "#FFFFFF",
                        textAlign: "center",
                        fontFamily: "'Playfair Display', serif",
                        fontWeight: 600,
                        letterSpacing: "2px",
                        mb: 1
                      }}
                    >
                      Find Resources
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#BBBBBB",
                        fontFamily: "'Poppins', sans-serif",
                        fontWeight: 300,
                      }}
                    >
                      Search by tags separated by commas
                    </Typography>
                  </Box>
                  
                  <TextField
                    fullWidth
                    placeholder="math, science, history..."
                    variant="filled"
                    value={searchTags}
                    onChange={(e) => setSearchTags(e.target.value)}
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
                          <LocalOffer sx={{ color: "#9D44C0" }} />
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
                  
                  <Button
                    fullWidth
                    variant="contained"
                    disabled={loading}
                    onClick={handleSearch}
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
                      "SEARCH RESOURCES"
                    )}
                  </Button>
                </Paper>
              </Fade>
            </Grid>
            
            {/* Upload Section */}
            <Grid item xs={12} md={6}>
              <Fade in={showForm} timeout={1000} style={{ transitionDelay: '200ms' }}>
                <Paper
                  elevation={24}
                  sx={{
                    padding: { xs: 3, md: 4 },
                    backgroundColor: "rgba(26, 0, 51, 0.85)",
                    borderRadius: "24px",
                    border: "1px solid rgba(157, 68, 192, 0.4)",
                    position: "relative",
                    overflow: "hidden",
                    mb: 4,
                    height: "100%"
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
                    <CloudUpload 
                      sx={{ 
                        fontSize: 40, 
                        color: "#9D44C0", 
                        mb: 2,
                        filter: "drop-shadow(0 0 10px rgba(157, 68, 192, 0.5))" 
                      }} 
                    />
                    <Typography
                      variant="h4"
                      sx={{
                        color: "#FFFFFF",
                        textAlign: "center",
                        fontFamily: "'Playfair Display', serif",
                        fontWeight: 600,
                        letterSpacing: "2px",
                        mb: 1
                      }}
                    >
                      Upload Resource
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#BBBBBB",
                        fontFamily: "'Poppins', sans-serif",
                        fontWeight: 300,
                      }}
                    >
                      Share your educational materials
                    </Typography>
                  </Box>
                  
                  <Box sx={{ mb: 3 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#E0E0E0",
                        fontFamily: "'Poppins', sans-serif",
                        mb: 1,
                        ml: 1
                      }}
                    >
                      Select File
                    </Typography>
                    <input
                      type="file"
                      className="custom-file-input"
                      onChange={(e) => setFile(e.target.files[0])}
                      style={{
                        width: "100%",
                        padding: "8px",
                        color: "#E0E0E0",
                        fontFamily: "'Poppins', sans-serif",
                        backgroundColor: "rgba(255,255,255,0.1)",
                        borderRadius: "12px",
                      }}
                    />
                    {file && (
                      <Typography
                        variant="body2"
                        sx={{
                          color: "#9D44C0",
                          fontFamily: "'Poppins', sans-serif",
                          fontSize: "0.8rem",
                          mt: 1,
                          ml: 1
                        }}
                      >
                        {file.name}
                      </Typography>
                    )}
                  </Box>
                  
                  <TextField
                    fullWidth
                    placeholder="Resource Title"
                    variant="filled"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
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
                          <Title sx={{ color: "#9D44C0" }} />
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
                  
                  <TextField
                    fullWidth
                    placeholder="Resource Description"
                    variant="filled"
                    multiline
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
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
                        <InputAdornment position="start" sx={{ alignSelf: "flex-start", mt: 1 }}>
                          <Description sx={{ color: "#9D44C0" }} />
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
                  
                  <Button
                    fullWidth
                    variant="contained"
                    disabled={loading}
                    onClick={handleUpload}
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
                      "UPLOAD RESOURCE"
                    )}
                  </Button>
                </Paper>
              </Fade>
            </Grid>
            
            {/* Resources Display */}
            <Grid item xs={12}>
              <Fade in={showForm} timeout={1000} style={{ transitionDelay: '400ms' }}>
                <Paper
                  elevation={24}
                  sx={{
                    padding: { xs: 3, md: 4 },
                    backgroundColor: "rgba(26, 0, 51, 0.85)",
                    borderRadius: "24px",
                    border: "1px solid rgba(157, 68, 192, 0.4)",
                    position: "relative",
                    overflow: "hidden",
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
                      background: "linear-gradient(90deg, #8E24AA 0%, #9D44C0 50%, #6C3483 100%)" 
                    }}
                  />
                  
                  <Box sx={{ textAlign: "center", mb: 4 }}>
                    <Article 
                      sx={{ 
                        fontSize: 40, 
                        color: "#9D44C0", 
                        mb: 2,
                        filter: "drop-shadow(0 0 10px rgba(157, 68, 192, 0.5))" 
                      }} 
                    />
                    <Typography
                      variant="h4"
                      sx={{
                        color: "#FFFFFF",
                        textAlign: "center",
                        fontFamily: "'Playfair Display', serif",
                        fontWeight: 600,
                        letterSpacing: "2px",
                        mb: 1
                      }}
                    >
                      Available Resources
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#BBBBBB",
                        fontFamily: "'Poppins', sans-serif",
                        fontWeight: 300,
                      }}
                    >
                      Educational materials shared by the community
                    </Typography>
                  </Box>
                  
                  {resources.length > 0 ? (
                    <Grid container spacing={3}>
                      {resources.map((res, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                          <Card 
                            className="resource-card neon-glow"
                            sx={{ 
                              backgroundColor: "rgba(43, 9, 68, 0.7)",
                              borderRadius: "16px",
                              border: "1px solid rgba(157, 68, 192, 0.3)",
                            }}
                          >
                            <CardContent>
                              <Typography 
                                variant="h6" 
                                gutterBottom
                                sx={{
                                  color: "#FFFFFF",
                                  fontFamily: "'Playfair Display', serif",
                                  fontWeight: 600,
                                  letterSpacing: "1px",
                                }}
                              >
                                {res.title}
                              </Typography>
                              <Button onClick={() => handleLike(res._id)}>Like</Button>

                              <Typography 
                                variant="body2"
                                sx={{
                                  color: "#DDDDDD",
                                  fontFamily: "'Poppins', sans-serif",
                                  mb: 2,
                                  minHeight: "50px"
                                }}
                              >
                                {res.description}
                              </Typography>
                              
                              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                                {res.tags.map((tag, tagIndex) => (
                                  <Chip
                                    key={tagIndex}
                                    label={tag}
                                    size="small"
                                    sx={{
                                      backgroundColor: "rgba(157, 68, 192, 0.2)",
                                      color: "#E0E0E0",
                                      fontFamily: "'Poppins', sans-serif",
                                      border: "1px solid rgba(157, 68, 192, 0.5)",
                                      '&:hover': {
                                        backgroundColor: "rgba(157, 68, 192, 0.3)",
                                      }
                                    }}
                                  />
                                ))}
                              </Box>
                            </CardContent>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  ) : (
                    <Box 
                      sx={{ 
                        textAlign: "center", 
                        padding: 4, 
                        color: "#BBBBBB",
                        fontFamily: "'Poppins', sans-serif",
                      }}
                    >
                      <Typography variant="h6">No resources found</Typography>
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        Try searching with different tags or upload your own resources
                      </Typography>
                    </Box>
                  )}
                </Paper>
              </Fade>
            </Grid>
          </Grid>
        </Container>
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
          {error}
        </Alert>
      </Snackbar>
      
      {/* Success Notification */}
      <Snackbar 
        open={success} 
        autoHideDuration={6000} 
        onClose={() => setSuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSuccess(false)} 
          severity="success" 
          variant="filled"
          sx={{ 
            width: '100%',
            fontFamily: "'Poppins', sans-serif",
            bgcolor: '#6C3483',
            color: 'white'
          }}
        >
          File uploaded successfully
        </Alert>
      </Snackbar>
    </>
  );
}