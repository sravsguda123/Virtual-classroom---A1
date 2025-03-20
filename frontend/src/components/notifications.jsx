import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom"; // Import useNavigate
import { Link } from "react-router-dom";
import axios from "axios";
import {
  Container,
  Paper,
  Typography,
  Button,
  Box,
  Fade,
  Slide,
  CircularProgress,
  IconButton,
  Divider,
} from "@mui/material";
import {
  NotificationsActive,
  DoneAll,
  Circle,
  ArrowBack,
  Notifications as NotificationsIcon,
} from "@mui/icons-material";

const Notifications = () => {
  const location = useLocation();
  const navigate = useNavigate(); // Initialize useNavigate
  const params = new URLSearchParams(location.search);
  const token = params.get("token");
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const [assignmentId, setAssignmentID] = useState("");

  // Fetch notification history from the API
  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://127.0.0.1:8000/notification`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = response.data;

      // Transform the notifications to match expected structure
      const formattedData = data.map((notif) => ({
        id: notif._id,
        sub_id: notif.submission_id,
        message: notif.message,
        timestamp: new Date(notif.timestamp).toLocaleString(),
        read: notif.status === "read",
      }));

      setNotifications(formattedData);
      setUnreadCount(formattedData.filter((notif) => !notif.read).length);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
      setTimeout(() => setShowContent(true), 300);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const ws = new WebSocket(`ws://localhost:8000/ws/notifications?token=${token}`);
    ws.onopen = () => {
      console.log("WebSocket connection established.");
    };
    ws.onclose = () => {
      console.log("WebSocket connection closed.");
    };
    ws.onerror = (error) => {
      console.error("WebSocket error: ", error);
    };
    ws.onmessage = (event) => {
      const processMessage = (message) => {
        const newNotification = { id: Date.now(), text: message, read: false };
        setNotifications((prev) => [newNotification, ...prev]);
        setUnreadCount((prev) => prev + 1);
      };
      if (event.data instanceof Blob) {
        event.data.text().then((text) => processMessage(text));
      } else {
        processMessage(event.data);
      }
    };
    return () => {
      ws.close();
    };
  }, [token]);

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      await axios.put(
        `http://127.0.0.1:8000/notificatio/read`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error("Error marking notifications as read:", error);
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
          
          .notification-item {
            transition: all 0.3s ease;
          }
          
          .notification-item:hover {
            transform: translateX(5px);
            background-color: rgba(157, 68, 192, 0.1);
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
                    onClick={() => navigate(-1)} // Add onClick handler to navigate back
                  >
                    <ArrowBack />
                  </IconButton>
                  <NotificationsIcon
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
                    Notifications{" "}
                    <Box
                      component="span"
                      sx={{
                        backgroundColor: "rgba(157, 68, 192, 0.3)",
                        borderRadius: "12px",
                        padding: "2px 12px",
                        fontSize: "0.7em",
                        verticalAlign: "middle",
                        ml: 1,
                      }}
                    >
                      {unreadCount} unread
                    </Box>
                  </Typography>
                </Box>

                <Button
                  variant="outlined"
                  startIcon={<DoneAll />}
                  onClick={markAllAsRead}
                  disabled={unreadCount === 0}
                  sx={{
                    color: "#9D44C0",
                    borderColor: "rgba(157, 68, 192, 0.5)",
                    fontFamily: "'Poppins', sans-serif",
                    borderRadius: "12px",
                    padding: "8px 16px",
                    "&:hover": {
                      borderColor: "#9D44C0",
                      backgroundColor: "rgba(157, 68, 192, 0.1)",
                    },
                    "&.Mui-disabled": {
                      color: "rgba(157, 68, 192, 0.3)",
                      borderColor: "rgba(157, 68, 192, 0.2)",
                    },
                  }}
                >
                  Mark All as Read
                </Button>
              </Box>

              {/* Notifications List */}
              <Box
                sx={{
                  flex: 1,
                  overflow: "auto",
                  padding: 3,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {loading ? (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      height: "100%",
                    }}
                  >
                    <CircularProgress
                      sx={{
                        color: "#9D44C0",
                      }}
                    />
                  </Box>
                ) : notifications.length === 0 ? (
                  <Fade in={showContent} timeout={1000}>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "100%",
                        opacity: 0.7,
                      }}
                    >
                      <NotificationsActive
                        sx={{
                          fontSize: 64,
                          color: "#9D44C0",
                          mb: 2,
                          opacity: 0.6,
                        }}
                      />
                      <Typography
                        variant="h6"
                        sx={{
                          color: "#E0E0E0",
                          fontFamily: "'Poppins', sans-serif",
                          textAlign: "center",
                        }}
                      >
                        No notifications yet.
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "#BBBBBB",
                          fontFamily: "'Poppins', sans-serif",
                          mt: 1,
                          textAlign: "center",
                        }}
                      >
                        New notifications will appear here
                      </Typography>
                    </Box>
                  </Fade>
                ) : (
                  notifications.map((notif, index) => (
                    <Slide
                      direction="up"
                      in={showContent}
                      timeout={500 + index * 100}
                      key={notif.id}
                    >
                      <Paper
                        elevation={0}
                        className="notification-item"
                        sx={{
                          padding: 2,
                          marginBottom: 2,
                          backgroundColor: notif.read
                            ? "rgba(26, 0, 51, 0.4)"
                            : "rgba(157, 68, 192, 0.1)",
                          borderRadius: "16px",
                          border: "1px solid",
                          borderColor: notif.read
                            ? "rgba(157, 68, 192, 0.1)"
                            : "rgba(157, 68, 192, 0.3)",
                          position: "relative",
                          overflow: "hidden",
                        }}
                      >
                        {!notif.read && (
                          <Circle
                            sx={{
                              position: "absolute",
                              top: 16,
                              right: 16,
                              fontSize: 12,
                              color: "#9D44C0",
                              filter: "drop-shadow(0 0 5px rgba(157, 68, 192, 0.7))",
                            }}
                          />
                        )}
                        <Typography
                          variant="body1"
                          sx={{
                            color: "#E0E0E0",
                            fontFamily: "'Poppins', sans-serif",
                            fontWeight: 300,
                            mb: 2,
                          }}
                        >
                          {notif.message}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            color: "#BBBBBB",
                            fontFamily: "'Poppins', sans-serif",
                            fontStyle: "italic",
                          }}
                        >
                          {notif.timestamp}
                        </Typography>

                        <Typography
                          variant="caption"
                          sx={{
                            color: "#BBBBBB",
                            fontFamily: "'Poppins', sans-serif",
                            fontStyle: "italic",
                          }}
                        >
                          <Link
                            to={
                              notif.message.match(/[a-f0-9]{24}/)
                                ? `/submit/${notif.message.match(/[a-f0-9]{24}/)[0]}?token=${encodeURIComponent(token)}`
                                : notif.message.match(/https:\/\/meet\.google\.com\/[a-z\-]+/)?.[0] || "#"
                            }
                            target="_blank"
                          >
                            <Typography
                              variant="caption"
                              sx={{
                                color: "#BBBBBB",
                                fontFamily: "'Poppins', sans-serif",
                                fontStyle: "italic",
                              }}
                            >
                              {notif.message.match(/[a-f0-9]{24}/) ? "  View Assignment" : "  Join Meeting"}
                            </Typography>
                          </Link>
                        </Typography>
                      </Paper>
                    </Slide>
                  ))
                )}
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
                  Virtual Classroom Notification Center • {new Date().getFullYear()}
                </Typography>
              </Box>
            </Paper>
          </Fade>
        </Box>
      </Container>
    </>
  );
};

export default Notifications;