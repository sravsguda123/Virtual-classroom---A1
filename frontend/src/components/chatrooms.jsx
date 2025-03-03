import React, { useEffect, useState } from "react";
import { useParams , useNavigate } from "react-router-dom";
import { useLocation } from 'react-router-dom';

const Chatroom = () => {
  const navigate = useNavigate();
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
  const handleResources = () => {
    navigate("/resourses");

  }
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

      <button onClick={handleResources}>Resources</button>
    </div>
  );
};

export default Chatroom;




//better UI


// const Chatroom = ({ id, messages, message, setMessage, sendMessage }) => {
//     return (
//       <div className="max-w-lg mx-auto p-4 border rounded-lg shadow-md bg-white">
//         <h2 className="text-xl font-bold text-center mb-4">Chatroom: {id}</h2>
  
//         <div className="h-64 overflow-y-auto p-3 bg-gray-100 rounded-lg space-y-2">
//           {messages.map((msg, index) => (
//             <p
//               key={index}
//               className="p-2 bg-blue-500 text-white rounded-lg w-fit max-w-xs"
//             >
//               {msg}
//             </p>
//           ))}
//         </div>
  
//         <div className="flex mt-4 gap-2">
//           <input
//             type="text"
//             value={message}
//             onChange={(e) => setMessage(e.target.value)}
//             className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//             placeholder="Type a message..."
//           />
//           <button
//             onClick={sendMessage}
//             className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
//           >
//             Send
//           </button>
//         </div>
//       </div>
//     );
//   };
  