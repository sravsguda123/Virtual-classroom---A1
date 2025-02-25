from fastapi import FastAPI, WebSocket, Depends, HTTPException, WebSocketDisconnect
from redis import Redis
import jwt
from pydantic import BaseModel
import redis.asyncio as redis
import asyncio
import json
from fastapi.middleware.cors import CORSMiddleware

# Constants
SECRET_KEY = "S1rtcbbygv8sxgjkptmkekxnakwbrz5kzoiocf0zur3j6qj9m2z"
REDIS_HOST = "localhost"
REDIS_PORT = 6379




app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    
)
redis_host = 'localhost'  # The host of the remote Redis service
redis_port = 6379  # Usually 6379 for Redis # If authentication is required

# Connect to the remote Redis API
redis_client = redis.Redis(
    host=redis_host,
    port=redis_port,)


users_db = {
    "teacher1": {"username": "teacher1", "password": "pass123", "role": "teacher"},
    "student1": {"username": "student1", "password": "pass123", "role": "student"},
    "student2": {"username": "student2", "password": "pass123", "role": "student"}
    
}
classrooms_db = {
    "1": {"name": "csea", "teacher": "teacher_1", "students": []},
}


from fastapi import Header

def verify_token(authorization: str = Header(...)):
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid token format")
    token = authorization.split(" ")[1]  # Extract the token after 'Bearer'
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

async def verify_token_for_socket(websocket: WebSocket):
    token = websocket.query_params.get("token")
    if not token:
        await websocket.close(code=1008)  # Close connection due to policy violation
        raise HTTPException(status_code=401, detail="Token is required")

    print(f"Extracted Token: {token}")  # Debugging: Check token value
    try:
        # Pass directly if "Bearer " prefix isn't needed
        return verify_token(f"Bearer {token}")
    except HTTPException as e:
        print(f"Token verification error: {e.detail}")
        await websocket.close(code=1008)

class LoginRequest(BaseModel):
    username: str
    password: str
class CreateClassroomRequest(BaseModel):
    name: str
class JoinClassroomRequest(BaseModel):
    class_id: str

@app.post("/login")
async def login(request: LoginRequest):
    user = users_db.get(request.username)
    if not user or user["password"] != request.password:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = jwt.encode({"id": request.username, "role": user["role"]}, SECRET_KEY, algorithm="HS256")
    return {"token": token}

@app.post("/create_classroom")
async def create_classroom(request: CreateClassroomRequest, user: dict = Depends(verify_token)):
    if user["role"] != "teacher":
        raise HTTPException(status_code=403, detail="Only teachers can create classrooms")
    
    class_id = classrooms_db.update({
        "name": request.name,
        "teacher": user["id"],
        "students": []
        
    })

    return {"class_id": str(id)}

@app.post("/join_classroom")
async def join_classroom(
    request: JoinClassroomRequest, user: dict = Depends(verify_token)
):
    class_id = request.class_id
    
    # Validate classroom existence
    classroom = classrooms_db.get(class_id)
    if not classroom:
        raise HTTPException(status_code=404, detail="Classroom not found")

    # Check if the user is already a member
    if user["id"] in classroom["students"]:
        return {"message": "Already joined classroom"}

    # Add the user to the students list
    classroom["students"].append(user["id"])

    return {"message": "Joined classroom successfully","class_id":class_id}


@app.websocket("/ws/notifications")
async def notifications_websocket(websocket: WebSocket):
    
    token = websocket.query_params.get("token")
    if not token:
        await websocket.close(code=1008)  # Close connection due to missing token
        raise HTTPException(status_code=401, detail="Token is required")
    try:
        user = verify_token(f"Bearer {token}")  # Add "Bearer " prefix
    except HTTPException as e:
        await websocket.close(code=1008)  # Close connection due to invalid token
        raise e  # Raise the HTTPException

    await websocket.accept()
    user_id = user["id"]
    
    pubsub = redis_client.pubsub()
    await pubsub.subscribe(user_id)  

    async def listen_for_notifications():
        """Listens for new messages from Redis and sends them to WebSocket."""
        try:
            async for msg in pubsub.listen():
                if msg["type"] == "message":
                    await websocket.send_text(msg["data"])
        except asyncio.CancelledError:
            pass  # Task cancelled when user disconnects
        finally:
            pubsub.close()

    listen_task = asyncio.create_task(listen_for_notifications())

    try:
        await websocket.receive_text()  # Keep connection alive
    except WebSocketDisconnect:
        print(f"User {user_id} disconnected.")
    finally:
        listen_task.cancel()
        await listen_task
        await websocket.close()
        
# @app.websocket("/notify/{user_id}")
# async def send_notification(websocket: WebSocket,user_id: str, message: dict, admin: dict = Depends(verify_token)):
#     if admin["role"] != "teacher":
#         raise HTTPException(status_code=403, detail="Not authorized.Only Teachers")

    
#     await redis_client.publish(user_id, json.dumps(message))
    
#     try:
#         while True:
#             await websocket.receive_text()  # Keep the connection alive
#     except WebSocketDisconnect:
#         print(f"User {user_id} disconnected.")
#     finally:
#         await websocket.close()

@app.websocket("/notify/{user_id}")
async def send_notification(websocket: WebSocket, user_id: str):
    await websocket.accept()
    
    token = websocket.query_params.get("token")
    if not token:
        await websocket.close(code=1008)  # Close connection due to missing token
        raise HTTPException(status_code=401, detail="Token is required")

    # Verify the token
    try:
        user = verify_token(f"Bearer {token}") 
        print(user["id"])# Add "Bearer " prefix
    except HTTPException as e:
        await websocket.close(code=1008)  # Close connection due to invalid token
        raise e  # Raise the HTTPException
    
    # Verify if the user is an admin (you might need to pass token via headers or query parameters)
    # You might need an async version if it's an async function
    
    if user["role"] != "teacher":
        await websocket.send_json({"error": "Not authorized. Only teachers can send notifications."})
        await websocket.close()
        return
    
    try:
        while True:
            data = await websocket.receive_json()
            await redis_client.publish(user_id, json.dumps(data))
            await websocket.send_json({"status": "Notification sent", "user_id": user_id})
    
    except WebSocketDisconnect:
        print(f"Client {user_id} disconnected")
    




@app.websocket("/ws/{class_id}")
async def classroom_websocket(websocket: WebSocket, class_id: str):
    # Extract the token from the query parameter
    token = websocket.query_params.get("token")
    if not token:
        await websocket.close(code=1008)  # Close connection due to missing token
        raise HTTPException(status_code=401, detail="Token is required")

    # Verify the token
    try:
        user = verify_token(f"Bearer {token}")  # Add "Bearer " prefix
    except HTTPException as e:
        await websocket.close(code=1008)  # Close connection due to invalid token
        raise e  # Raise the HTTPException

    await websocket.accept()

    # Initialize Redis pubsub and subscribe to the class_id channel
    pubsub = redis_client.pubsub()
    await pubsub.subscribe(class_id)

    async def send_messages():
        """Listen for messages from Redis and send them to the WebSocket."""
        try:
            async for msg in pubsub.listen():
                if msg["type"] == "message":
                    # Send message to WebSocket
                    await websocket.send_text(msg["data"].decode('utf-8'))
        except asyncio.CancelledError:
            # If the task is cancelled, clean up pubsub
            pubsub.close()
            print("Pubsub task was cancelled.")
        except Exception as e:
            # Handle any other errors from Redis listening
            print(f"Error while listening for Redis messages: {e}")
            await websocket.close(code=1006)  # Close WebSocket on Redis error

    # Run the send_messages coroutine in the background
    send_task = asyncio.create_task(send_messages())

    try:
        # Receive messages from the WebSocket and publish them to Redis
        while True:
            message = await websocket.receive_text()
            await redis_client.publish(class_id, f"{user["id"]}: {message}")

    except WebSocketDisconnect:
        # Handle disconnection, cleanup resources
        print(f"User {user['id']} disconnected.")
    except Exception as e:
        print(f"Unexpected error: {e}")
    finally:
        # Always clean up the pubsub and close the WebSocket
        send_task.cancel()  # Cancel the background task
        try:
            await send_task  # Ensure task is finished
        except asyncio.CancelledError:
            pass  # Ignore cancellation errors if the task was cancelled
        pubsub.close()  # Close Redis pubsub
        await websocket.close()  # Close WebSocket connection


# @app.post("/upload_resource")
# async def upload_resource():
    


