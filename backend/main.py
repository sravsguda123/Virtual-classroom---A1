from fastapi import FastAPI, WebSocket, Depends, HTTPException, WebSocketDisconnect,File, UploadFile
from redis import Redis
import jwt
from pydantic import BaseModel
import redis.asyncio as redis
import asyncio
import json
from fastapi.middleware.cors import CORSMiddleware
import motor.motor_asyncio
from datetime import datetime
from bson import ObjectId
from typing import List, Optional
from pydantic import BaseModel, HttpUrl
import shutil
from keybert import KeyBERT

MONGO_URI = "mongodb+srv://Prashanna:detroicitus@cluster1.b5qzb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1"

mongo_client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_URI)
db = mongo_client["virtual_classroom"]  # Ensure "virtual_classroom" is your actual database name

# Define the collection
collection = db["notifications"] 
users = db["users"]
courses = db["courses"]
assignments=db["assignments"]
submissions=db["submissions"]
resources=db["resources"]
# Constants
SECRET_KEY = "S1rtcbbygv8sxgjkptmkekxnakwbrz5kzoiocf0zur3j6qj9m2z"
REDIS_HOST = "localhost"
REDIS_PORT = 6379




app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change "*" to specific origins if needed
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)
redis_host = "localhost"  # The host of the remote Redis service
redis_port = 6379  # Usually 6379 for Redis # If authentication is required

# Connect to the remote Redis API
redis_client = redis.Redis(
    host=redis_host,
    port=redis_port,)
@app.on_event("startup")
async def show_routes():
    from fastapi.routing import APIRoute
    routes = [route.path for route in app.router.routes if isinstance(route, APIRoute)]
    print("Registered routes:", routes)
async def create_indexes():
    await resources.create_index([("tags", 1)])


        
def calculate_score(resource):
    return (resource.get("likes", 0) * 5 + 
            resource.get("downloads", 0) * 3 + 
            resource.get("views", 0) * 1)
def convert_mongo_document(doc):
    """ Recursively converts MongoDB documents to JSON serializable format """
    if isinstance(doc, list):
        return [convert_mongo_document(item) for item in doc]
    elif isinstance(doc, dict):
        return {key: convert_mongo_document(value) for key, value in doc.items()}
    elif isinstance(doc, ObjectId):
        return str(doc)
    else:
        return doc

from fastapi import Header
kw_model = KeyBERT()

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
def generate_tags(text):
    keywords = kw_model.extract_keywords(text, keyphrase_ngram_range=(1, 2), stop_words='english')
    return [kw[0] for kw in keywords]
class LoginRequest(BaseModel):
    username: str
    password: str
class CreateClassroomRequest(BaseModel):
    name: str
class JoinClassroomRequest(BaseModel):
    class_id: str
class AssignmentCreate(BaseModel):
    title: str
    description: str
    submission_type: str  # "file", "text", "link", "multiple_choice"
    due_date: str
    course_id:str
class AssignmentResponse(AssignmentCreate):
    id: str
    teacher_id: str
class SubmissionCreate(BaseModel):
    text_content: Optional[str] = None
    file: Optional[UploadFile] = None
    link: Optional[HttpUrl] = None
    mcq_answers: Optional[dict] = None

class Resource(BaseModel):
    title:str
    description:str
    tags:list[str]=[]
    score:int=0

def insert_first():
    users.insert_one({
   "user_id": "student1",
   "password": "password",
   "role": "student"
})
    users.insert_one({
   "user_id": "student2",
   "password": "password",
   "role": "student"
})
    users.insert_one({
   "user_id": "teacher1",
   "password": "password",
   "role": "teacher"
})
    print("Users inserted successfully!")
from fastapi import Query,Form
@app.post("/upload")
async def upload_resource(
    file: UploadFile = File(...), title: str = Form(""), description: str = Form("")
):
    print(f"Received title: {title}")  # Debugging
    print(f"Received description: {description}")  # Debugging
    
    file_id = await db.fs.files.insert_one({"filename": file.filename})
    

    response = generate_tags(description)
    tags = response

    resource_doc = {
        "title": title,
        "description": description,
        "tags": [tag.strip() for tag in tags],
        "file_id": file_id.inserted_id,
        "score": 0,
        "likes": 0,
        "downloads": 0,
        "views": 0,
    }

    result = await resources.insert_one(resource_doc)
    return {"id": str(result.inserted_id), "tags": tags}


@app.get("/search")
async def search_resources(tags: List[str] = Query(...)):
    search_results = await resources.find(
        {"tags": {"$in": tags}}
    ).sort("score", -1).to_list(10)
    
    return convert_mongo_document(search_results)
@app.get("/assignments/{course_id}")
async def get_assignment(course_id: str):
    assignment = await assignments.find({"course_id": course_id}).to_list(length=100)

    if not assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")
    return convert_mongo_document(assignment)

@app.get("/teacher_see_submissions/{assignment_id}")
async def view_submissions(assignment_id: str, current_user: dict = Depends(verify_token)):
   if db is None:
      raise HTTPException(status_code=500, detail="Database connection failed")
   if current_user["role"] != "teacher":
      raise HTTPException(status_code=403, detail="Access denied")
   submissions = list(db.submissions.find({"assignment_id": ObjectId(assignment_id)}))
   for submission in submissions:
      submission["_id"] = str(submission["_id"])
      submission["assignment_id"] = str(submission["assignment_id"])
   return submissions

@app.post("/login")
async def login(request: LoginRequest):
    user_list = await users.find({"user_id": request.username}).to_list(1)
    print(user_list)
    if not user_list:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    user = user_list[0]
    if user["password"] != request.password:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = jwt.encode({"id": request.username, "role": user["role"]}, SECRET_KEY, algorithm="HS256")
    return {"token": token}

@app.post("/create_assignments")
async def create_assignments(assignment: AssignmentCreate, user: dict = Depends(verify_token)):
    if user["role"] != "teacher":
        raise HTTPException(status_code=403, detail="Only teachers can create assignments")

    teacher_id = user["id"]
    new_assignment = assignment.model_dump()
    new_assignment["teacher_id"] = teacher_id
    result = await assignments.insert_one(new_assignment)
    return {"message": "Created assignment successfully", "assignment_id": str(result.inserted_id)}


@app.post("/create_classroom")
async def create_classroom(request: CreateClassroomRequest, user: dict = Depends(verify_token)):
    if user["role"] != "teacher":
        raise HTTPException(status_code=403, detail="Only teachers can create classrooms")
    clas = {
        "class_id": request.name,
        "teacher": user["id"],
        "students": []
    }

    result = await courses.insert_one(clas)  # Insert into MongoDB
    return {"class_id": str(result.inserted_id)}
    
    # class_id = classrooms_db.update({
    #     "name": request.name,
    #     "teacher": user["id"],
    #     "students": []
        
    # })

    # return {"class_id": str(id)}


@app.get("/students_in_courses/{course_id}")
async def students_in_courses(course_id: str):
    # Fetch the classroom from MongoDB

    classroom = await courses.find_one({"class_id": course_id})
    if not classroom:
        raise HTTPException(status_code=404, detail="Classroom not found")
    # Fetch the students from MongoDB
    print(classroom["students"])
    return {"students": classroom["students"]}
    
    
@app.post("/join_classroom")
async def join_classroom(
    request: JoinClassroomRequest, user: dict = Depends(verify_token)
):
    documents = await courses.find().to_list(None)  # Fetch all documents
    for doc in documents:
        print(doc)
    class_id = request.class_id
    # try:
    #     class_id = ObjectId(request.class_id)  # Convert to ObjectId
    # except:
    #     raise HTTPException(status_code=400, detail="Invalid class ID format")

    # Validate classroom existence
    classroom = await courses.find_one({"class_id": class_id})
    if not classroom:
        raise HTTPException(status_code=404, detail="Classroom not found")

    # Check if the user is already a member
    if user["id"] in classroom["students"]:
        return {"message": "Already joined classroom"}

    # Add the user to the students list
    await courses.update_one(
        {"class_id": class_id},
        {"$addToSet": {"students": user["id"]}}  # Ensures no duplicates
    )

    return {"message": "Joined classroom successfully", "class_id": request.class_id}


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
        

@app.get("/notification")
async def get_notifications(user: dict = Depends(verify_token)):
    notifications = await collection.find({"user_id": user["id"], "status": "unread"}).sort("timestamp", -1).to_list(100)
    x=convert_mongo_document(notifications)
    print(x)
    return x 


@app.put("/notificatio/read")
async def mark_as_read(user: dict = Depends(verify_token)):
    await collection.update_many({"user_id": user["id"], "status": "unread"}, {"$set": {"status": "read"}})
    return {"message": "All notifications marked as read"}

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
            data_to_store = {
        "user_id": user_id,
        "message": data,
        "timestamp": datetime.utcnow().isoformat(),
        "status": "unread",
    }
            await collection.insert_one(data_to_store)  # Store in MongoDB
            await redis_client.publish(user_id, json.dumps(data))
            await websocket.send_json({"status": "Notification sent", "user_id": user_id})
    
    except WebSocketDisconnect:
        print(f"Client {user_id} disconnected")
    
@app.websocket("/notify_all/{course_id}")
async def send_notification_to_all(websocket: WebSocket, course_id: str):
    await websocket.accept()
    
    token = websocket.query_params.get("token")
    if not token:
        await websocket.close(code=1008)  # Close connection due to missing token
        raise HTTPException(status_code=401, detail="Token is required")

    # Verify the token
    try:
        classroom = await courses.find_one({"class_id": course_id})
        user = verify_token(f"Bearer {token}") 
        print(user["id"])# Add "Bearer " prefix
    except HTTPException as e:
        await websocket.close(code=1008)  # Close connection due to invalid token
        raise e  # Raise the HTTPException
    
    # Verify if the user is an admin (you might need to pass token via headers or query parameters)
    # You might need an async version if it's an async function
    
    if user["role"] != "teacher":
        await websocket.send_json({"error": "Not authorized. Only teachers can send gmeet notification."})
        await websocket.close()
        return
    
    
    try:
        while True:
            data = await websocket.receive_json()

            for user_id in classroom["students"]:
                
                await redis_client.publish(user_id, json.dumps(data))
                await websocket.send_json({"status": "Notification sent"})
    
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
    


