import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

const Notifications = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const token = params.get("token");
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
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
      // Check if the received data is a Blob
      if (event.data instanceof Blob) {
        event.data.text().then((text) => {
          try {
            const parsed = JSON.parse(text);
            setNotifications((prev) => [...prev, parsed]);
          } catch (err) {
            setNotifications((prev) => [...prev, text]);
          }
        });
      } else {
        // Try parsing the event data as JSON
        try {
          const parsed = JSON.parse(event.data);
          setNotifications((prev) => [...prev, parsed]);
        } catch (err) {
          setNotifications((prev) => [...prev, event.data]);
        }
      }
    };

    return () => {
      ws.close();
    };
  }, [token]);

  return (
    <div>
      <h2>Notifications</h2>
      <div>
        {notifications.length === 0 ? (
          <p>No notifications yet.</p>
        ) : (
          notifications.map((msg, index) => (
            <p key={index}>
              {typeof msg === "object" ? JSON.stringify(msg) : msg}
            </p>
          ))
        )}
      </div>
    </div>
  );
};

export default Notifications;
