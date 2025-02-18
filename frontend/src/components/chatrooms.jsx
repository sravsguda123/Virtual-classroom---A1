import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useLocation } from 'react-router-dom';

const Chatroom = () => {
  const location = useLocation(); 
  const params = new URLSearchParams(location.search);
  const { id } = useParams();
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const token = params.get('token');
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = new WebSocket(`ws://127.0.0.1:8000/ws/${id}?token=${token}`);
    setSocket(newSocket);
    newSocket.onopen = function () {
      console.log("WebSocket connection established.");
  };
  
  newSocket.onmessage = function (event) {
      console.log("Message received: ", event.data);
  };
  
  newSocket.onclose = function () {
      console.log("WebSocket connection closed.");
  };
  
  newSocket.onerror = function (error) {
      console.error("WebSocket error: ", error);
  };

    newSocket.onmessage = (event) => {
      const msg = event.data;
      setMessages((prev) => [...prev, msg]);
    };

    return () => {
      newSocket.close();
    };
  }, [id, token]);

  const sendMessage = () => {
    if (socket && message) {
      socket.send(message);
      setMessage("");
    }
  };

  return (
    <div>
      <h2>Chatroom: {id}</h2>
      <div>
        {messages.map((msg, index) => (
          <p key={index}>{msg}</p>
        ))}
      </div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default Chatroom;