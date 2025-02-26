import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
const Notifications = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const token = params.get("token");

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch notification history from the API
  const fetchNotifications = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/notification`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
  
      const data = response.data; // ✅ Use response.data instead of response.json()
  
      // ✅ Transform the notifications to match expected structure
      const formattedData = data.map((notif) => ({
        id: notif._id, // Use MongoDB ID as the key
        title: notif.message.title,
        body: notif.message.body,
        timestamp: new Date(notif.timestamp).toLocaleString(), // Format timestamp for readability
        read: notif.status === "read", // Convert status to boolean
      }));
  
      setNotifications(formattedData);
      setUnreadCount(formattedData.filter((notif) => !notif.read).length);
    } catch (error) {
      console.error("Error fetching notifications:", error);
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
        `http://127.0.0.1:8000/notificatio/read`, // Ensure correct endpoint
        {}, // Empty body (or pass required data if needed)
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
    <div>
      <h2>Notifications ({unreadCount} unread)</h2>
      <button onClick={markAllAsRead} disabled={unreadCount === 0}>
        Mark All as Read
      </button>
      <div>
        {notifications.length === 0 ? (
          <p>No notifications yet.</p>
        ) : (
          notifications.map((notif) => (
            <div key={notif.id} style={{ padding: "10px", borderBottom: "1px solid #ccc" }}>
              <strong>{notif.message}</strong>
              <p style={{ fontWeight: notif.read ? "normal" : "bold" }}>
                {notif.body}
              </p>
              <small>{notif.timestamp}</small>
            </div>
          ))
        )}
      </div>
    </div>
  );
  
}  

export default Notifications;
