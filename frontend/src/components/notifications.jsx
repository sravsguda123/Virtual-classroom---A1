import React , {useState , useEffect} from "react";
import {useParams,useLocation} from "react-router-dom";


const Notifications = () =>{
    const location = useLocation(); 
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    const [notifications , setNotifications] = useState([]);
    const {id} = useParams();
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        
                
                const ws = new WebSocket(`ws://localhost:8000/ws/notifications?token=${token}`);
                setSocket(ws);
                ws.onopen = function () {
                    console.log("WebSocket connection established.");
                };

                ws.onclose = function () {
                    console.log("WebSocket connection closed.");
                };
                ws.onerror = function (error) {
                    console.error("WebSocket error: ", error);
                };
                ws.onmessage = (event) => {
                    const msg = event.data;
                    setNotifications((prev) => [...prev, msg]);
                };
                return () => {
                    ws.close();
                };
             }, [id, token]);

            
             return (
                <div>
                  <h2>Notifications: {id}</h2>
                  <div>
                    {notifications.map((msg, index) => (
                      <p key={index}>{msg}</p>
                    ))}
                  </div>
                  
                </div>
              );
            };

export default Notifications;