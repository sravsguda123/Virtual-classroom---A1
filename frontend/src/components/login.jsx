import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Avatar,
  InputAdornment,
  Box,
  IconButton,
} from "@mui/material";
import { LockOutlined, AccountCircle, Visibility, VisibilityOff } from "@mui/icons-material";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
        const response = await axios.post("http://127.0.0.1:8000/login", { username, password });
        localStorage.setItem("token", response.data.token);
        const token = response.data.token;
        const tokenPayload = JSON.parse(atob(response.data.token.split(".")[1])); // Decode base64 payload
        const role = tokenPayload.role;
  
        // Redirect based on role
        if (role === "teacher") {
          navigate(`/create-classroom?token=${token}`);
        } else if (role === "student") {
          navigate("/join-classroom");
        } else {
          alert("Invalid role!"); // Handle unexpected roles
        }
      } catch (error) {
        console.error(error.response.data);
        alert("Invalid credentials!");
      const response = await axios.post("http://127.0.0.1:8000/login", { username, password });
      localStorage.setItem("token", response.data.token);
      const tokenPayload = JSON.parse(atob(response.data.token.split(".")[1]));
      const role = tokenPayload.role;

      if (role === "teacher") {
        navigate("/create-classroom");
      } else if (role === "student") {
        navigate("/join-classroom");
      } else {
        alert("Invalid role!");
      }
    } if (error) {
      console.error(error.response.data);
      alert("Invalid credentials!");
    }
  };

  return (
    <>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Merriweather:ital,wght@0,300;0,400;0,700;0,900;1,300;1,400;1,700;1,900&family=Oswald:wght@200..700&display=swap');

          .icon-button {
            background: transparent;
            border: none;
            padding: 8px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #E0E1DD;
            transition: all 0.3s ease;
            outline: none;
          }

          .icon-button:hover {
            transform: scale(1.1);
          }

          .icon-button svg {
            transition: transform 0.3s ease, opacity 0.2s ease;
          }

          .icon-button:active svg {
            transform: scale(0.9);
          }

          .toggle-icon {
            position: relative;
            width: 24px;
            height: 24px;
          }

          .toggle-icon svg {
            position: absolute;
            top: 0;
            left: 0;
            opacity: 1;
            transform-origin: center;
          }

          .toggle-icon .hidden-icon {
            opacity: 0;
            transform: rotate(-90deg);
          }

          .toggle-icon.show-password .visible-icon {
            opacity: 0;
            transform: rotate(90deg);
          }

          .toggle-icon.show-password .hidden-icon {
            opacity: 1;
            transform: rotate(0);
          }

          .icon-button:focus {
            outline: none;
          }

          @keyframes fieldFocus {
            0% { transform: translateX(0); }
            25% { transform: translateX(5px); }
            75% { transform: translateX(-5px); }
            100% { transform: translateX(0); }
          }

          .field-focus {
            animation: fieldFocus 0.3s ease-out;
          }
        `}
      </style>

      <Container
        maxWidth={false}
        sx={{
          display: "flex",
          padding: 0,
          margin: 0,
          minHeight: "100vh",
          minWidth: "100vw",
          backgroundColor: "#0D1B2A",
        }}
      >
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: 6,
            color: "#E0E1DD",
          }}
        >
          <Box sx={{ mb: 6 }}>
            <Box
              sx={{
                width: "150px",
                height: "150px",
                backgroundColor: "#415A77",
                borderRadius: "10px",
                mb: 3,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#E0E1DD",
                fontFamily: "'Merriweather', serif",
                fontWeight: 700,
              }}
            >
              LOGO
            </Box>
            <Typography 
              variant="h2" 
              sx={{ 
                mb: 2, 
                color: "#E0E1DD",
                fontFamily: "'Oswald', sans-serif",
                fontWeight: 500,
              }}
            >
              Welcome to QuantumEdu
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                color: "#778DA9",
                fontFamily: "'Merriweather', serif",
                fontWeight: 300,
                lineHeight: 1.8,
              }}
            >
              The best e-learning courses do not just teach; they inspire learners to explore more deeply
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#1B263B",
          }}
        >
          <Paper
            elevation={0}
            sx={{
              padding: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              borderRadius: 3,
              width: "100%",
              maxWidth: "400px",
              backgroundColor: "#1B263B",
              color: "#E0E1DD",
            }}
          >
            <Typography 
              variant="h4" 
              sx={{ 
                mb: 4, 
                color: "#E0E1DD",
                fontFamily: "'Oswald', sans-serif",
                fontWeight: 500,
              }}
            >
              USER LOGIN
            </Typography>

            <TextField
              label="Username"
              variant="outlined"
              fullWidth
              margin="normal"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="field-focus"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AccountCircle sx={{ color: "#E0E1DD" }} />
                  </InputAdornment>
                ),
                sx: {
                  color: "#E0E1DD",
                  backgroundColor: "#415A77",
                  borderRadius: 1,
                  fontFamily: "'Merriweather', serif",
                  transition: "all 0.3s ease",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "transparent",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#778DA9",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#E0E1DD",
                  },
                  "&.Mui-focused": {
                    transform: "scale(1.02)",
                  },
                },
              }}
              InputLabelProps={{
                sx: {
                  color: "#E0E1DD",
                  fontFamily: "'Merriweather', serif",
                  "&.Mui-focused": {
                    color: "#E0E1DD",
                  },
                },
              }}
            />

            <TextField
              label="Password"
              type={showPassword ? "text" : "password"}
              fullWidth
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="field-focus"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlined sx={{ color: "#E0E1DD" }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      className="icon-button"
                      onClick={() => setShowPassword(!showPassword)}
                      type="button"
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>

                    
                  </InputAdornment>
                ),
                sx: {
                  color: "#E0E1DD",
                  backgroundColor: "#415A77",
                  borderRadius: 1,
                  fontFamily: "'Merriweather', serif",
                  transition: "all 0.3s ease",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "transparent",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#778DA9",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#E0E1DD",
                  },
                  "&.Mui-focused": {
                    transform: "scale(1.02)",
                  },
                },
              }}
              InputLabelProps={{
                sx: {
                  color: "#E0E1DD",
                  fontFamily: "'Merriweather', serif",
                  "&.Mui-focused": {
                    color: "#E0E1DD",
                  },
                },
              }}
            />

            <Button
              variant="contained"
              fullWidth
              sx={{
                mt: 4,
                py: 1.5,
                backgroundColor: "#778DA9",
                color: "#0D1B2A",
                fontFamily: "'Oswald', sans-serif",
                fontWeight: 500,
                fontSize: "1.1rem",
                letterSpacing: "1px",
                transition: "all 0.3s ease",
                "&:hover": { 
                  backgroundColor: "#E0E1DD",
                  transform: "scale(1.02)",
                },
                borderRadius: 1,
              }}
              onClick={handleLogin}
            >
              LOGIN
            </Button>
          </Paper>
        </Box>
      </Container>
    </>
  );
};

export default Login;