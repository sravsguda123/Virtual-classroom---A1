import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    console.log("Username:", username);
    console.log("Password:", password);
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
      }
    };

  return (
    <div>
      <h2>Login</h2>
      <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default Login;
