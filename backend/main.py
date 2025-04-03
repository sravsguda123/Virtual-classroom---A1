from fastapi import FastAPI, WebSocket, Depends, HTTPException, WebSocketDisconnect,File, UploadFile,Response, Request,Form,Query
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
import gridfs
import os
from fastapi import Header
import json
from fastapi.responses import RedirectResponse, JSONResponse
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from neo4j import GraphDatabase
import io
from datetime import datetime
import os
from dotenv import load_dotenv


kw_model = KeyBERT()

load_dotenv()  # Load environment variables from .env file

SECRET_KEY = os.getenv("SECRET_KEY")
REDIS_HOST = os.getenv("REDIS_HOST")
REDIS_PORT = int(os.getenv("REDIS_PORT", 6379))
NEO4J_URI = os.getenv("NEO4J_URI")
NEO4J_USERNAME = os.getenv("NEO4J_USERNAME")
NEO4J_PASSWORD = os.getenv("NEO4J_PASSWORD")
MONGO_URI = os.getenv("MONGO_URI")

try:
    with GraphDatabase.driver(URI, auth=AUTH) as driver:
        driver.verify_connectivity()
    print("✅ Knowledge Base connection successful!")
except Exception as e:
    print("❌ Knowledge Base connection failed:", e)

#mongo related
mongo_client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_URI)
db = mongo_client["virtual_classroom"]  # Ensure "virtual_classroom" is your actual database name
collection = db["notifications"] 
users = db["users"]
courses = db["courses"]
assignments=db["assignments"]
submissions=db["submissions"]
resources=db["resources"]
attendance=db["attendance"]




def load_credentials():
    """Load credentials from token.json if available."""
    if os.path.exists(TOKEN_FILE):
        return Credentials.from_authorized_user_file(TOKEN_FILE, SCOPES)
    return None


os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'
fs = motor.motor_asyncio.AsyncIOMotorGridFSBucket(db)


#google api related
SCOPES = ["https://www.googleapis.com/auth/calendar.events"]
CLIENT_SECRET_FILE = "client_secret.json"  
REDIRECT_URI = "http://127.0.0.1:8000/oauth2callback"
TOKEN_FILE = "token.json"  # Token storage


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change "*" to specific origins if needed
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)


# redis_host = "localhost"  # The host of the remote Redis service
# redis_port = 6379  # Usually 6379 for Redis # If authentication is required

# #Connect to the remote Redis API
# redis_client = redis.Redis(
#     host=redis_host,
#     port=redis_port,)

redis_client = redis.Redis(
    host='equipped-gnat-18381.upstash.io',
    port=6379,
    password="AUfNAAIjcDE1YTAyMDBlNjVhMzM0MTlhOTk0MWNjNjY0MWM1NDE5M3AxMA",
    ssl=True
)

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


#verification of jwt token
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

#requests
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

# def insert_first():
#     users.insert_one({
#    "user_id": "student1",
#    "password": "password",
#    "role": "student"
# })
#     users.insert_one({
#    "user_id": "student2",
#    "password": "password",
#    "role": "student"
# })
#     users.insert_one({
#    "user_id": "teacher1",
#    "password": "password",
#    "role": "teacher"
# })
#     print("Users inserted successfully!")
# from fastapi import Query,Form

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

@app.post("/upload")
async def upload_resource(
    file: UploadFile = File(None),  # ✅ File(None) is enough
    title: str = Form(""),
    description: str = Form(""),
    user: dict = Depends(verify_token),
):
    print(f"Received title: {title}")
    print(f"Received description: {description}")

    file_id = None
    if file:
        file_content = await file.read()  # Ensure async read
        file_id = await fs.upload_from_stream(file.filename, file_content)
        print(f"Uploaded file ID: {file_id}")

    response = generate_tags(description)
    tags = [tag.strip() for tag in response]

    resource_doc = {
        "title": title,
        "description": description,
        "tags": tags,
        "file_id": file_id,
        "score": 0,
        "likes": 0,
        "downloads": 0,
        "views": 0,
    }
    result = await resources.insert_one(resource_doc)

    try:
        with driver.session() as session:  # ✅ Use a proper Neo4j session
            session.run(
                """
                MERGE (r:Resource {id: $id, title: $title, description: $description})
                WITH r
                UNWIND $tags AS tag
                MERGE (t:Tag {name: tag})
                MERGE (r)-[:TAGGED_AS]->(t)
                MERGE (u:User {id: $user_id})
                MERGE (u)-[:UPLOADED]->(r)
                """,
                id=str(result.inserted_id),  # ✅ Convert ObjectId to string
                title=title,
                description=description,
                tags=tags,
                user_id=user["id"],
            )
        print("✅ Resource inserted into Neo4j successfully!")
    except Exception as e:
        print(f"❌ Error inserting into Neo4j: {e}")

    return {"id": str(result.inserted_id), "tags": tags}

@app.get("/search")
async def search_resources(tags: List[str] = Query(...)):
    search_results = await resources.find(
        {"tags": {"$in": tags}}
    ).sort("score", -1).to_list(10)

    # Convert MongoDB documents to JSON
    for doc in search_results:
        doc["_id"] = str(doc["_id"])
        if "file_id" in doc and doc["file_id"]:
            doc["file_id"] = str(doc["file_id"])
    
    return search_results

@app.post("/like/{resource_id}")
async def like_resource(resource_id: str, user: dict = Depends(verify_token)):
    # Check if the resource exists
    resource = await resources.find_one({"_id": ObjectId(resource_id)})
    if not resource:
        raise HTTPException(status_code=404, detail="Resource not found")

    # Increment the likes count in MongoDB
    await resources.update_one({"_id": ObjectId(resource_id)}, {"$inc": {"likes": 1}})

    # Retrieve updated resource to recalculate score
    updated_resource = await resources.find_one({"_id": ObjectId(resource_id)})

    # Update the score based on new like count
    new_score = calculate_score(updated_resource)
    await resources.update_one({"_id": ObjectId(resource_id)}, {"$set": {"score": new_score}})

    # Update in Neo4j
    try:
        with driver.session() as session:
            session.run(
            """
            MATCH (r:Resource {id: $id})
            SET r.likes = COALESCE(r.likes, 0) + 1
            WITH r
            MATCH (u:User {id: $user_id})
            MERGE (u)-[:LIKED]->(r)  
            """,
            id=str(resource_id),  
            user_id=user["id"]    
        )
        print("✅ Resource likes updated in Neo4j successfully!")
    except Exception as e:
        print(f"❌ Error updating likes in Neo4j: {e}")

    return {"message": "Resource liked successfully"}

@app.get("/assignments/{course_id}")
async def get_assignment(course_id: str):
    assignment = await assignments.find({"course_id": course_id}).to_list(length=100)

    if not assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")
    
    for doc in assignment:
        doc["_id"] = str(doc["_id"])
    
    return assignment

@app.post("/create_assignments")
async def create_assignments(assignment: dict, user: dict = Depends(verify_token)):
    if user["role"] != "teacher":
        raise HTTPException(status_code=403, detail="Only teachers can create assignments")

    teacher_id = user["id"]
    assignment["teacher_id"] = teacher_id
    result = await assignments.insert_one(assignment)
    return {"message": "Created assignment successfully", "assignment_id": str(result.inserted_id)}

@app.get("/assignment_due_date/{assignment_id}")
async def get_due_date(assignment_id: str):
    assignment = await assignments.find_one({"_id": ObjectId(assignment_id)})
    if not assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")
    return {"due_date": assignment["due_date"]}

@app.post("/submit")
async def submit_assignment(
    
    text_content: Optional[str] = Form(None),
    file: Optional[UploadFile] = File(None),  # ✅ Fix: Make file optional
    link: Optional[HttpUrl] = Form(None),
    
    assignment_id: str = Form(...),
    user: dict = Depends(verify_token)
):
    if user["role"] != "student":
        raise HTTPException(status_code=403, detail="Only students can submit assignments")

    file_id = None
    if file:
        file_id = await fs.upload_from_stream(file.filename, file.file)
        print("assignment id recived is ",assignment_id)
    submission_data = {
        "assignment_id": assignment_id,
        "student_id": user["id"],
        "text_content": text_content,
        "link": link,
        "file_id": file_id,
    }
    print("the inserted data is",submission_data)
    
    assignment = await assignments.find_one({"_id": ObjectId(assignment_id)})
    if not assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")
    

    result = await submissions.insert_one(submission_data)
    return {"message": "Assignment submitted successfully", "file_id": str(file_id) if file_id else None}

@app.get("/submissions/{assignment_id}", response_model=List[dict])
async def get_submissions(assignment_id: str, user: dict = Depends(verify_token)):
    if user["role"] != "teacher":
        raise HTTPException(status_code=403, detail="Only teachers can view submissions")

    submission_list = await submissions.find({"assignment_id": assignment_id}).to_list(length=None)
    
    if not submission_list:
        raise HTTPException(status_code=404, detail="No submissions found")

    for sub in submission_list:
        sub["_id"] = str(sub["_id"])
        if "file_id" in sub and sub["file_id"]:
            sub["file_id"] = str(sub["file_id"])
    
    return submission_list

@app.get("/submission/{submission_id}")
async def get_submission(submission_id: str, user: dict = Depends(verify_token)):
    if user["role"] != "teacher":
        raise HTTPException(status_code=403, detail="Only teachers can access submissions")

    submission = await submissions.find_one({"_id": ObjectId(submission_id)})
    
    if not submission:
        raise HTTPException(status_code=404, detail="Submission not found")

    submission["_id"] = str(submission["_id"])
    if "file_id" in submission and submission["file_id"]:
        submission["file_id"] = str(submission["file_id"])
    
    return submission

@app.get("/download/{file_id}")
async def download_file(file_id: str, user: dict = Depends(verify_token)):
    if user["role"] != "teacher":
        raise HTTPException(status_code=403, detail="Only teachers can download files")

    try:
        file_id_obj = ObjectId(file_id)
        grid_out = await fs.open_download_stream(file_id_obj)
        file_data = await grid_out.read()

        return Response(
            content=file_data,
            media_type="application/octet-stream",
            headers={"Content-Disposition": f"attachment; filename={grid_out.filename}"}
        )
    except Exception:
        raise HTTPException(status_code=404, detail="File not found")

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
    
@app.post("/attendance/{course_id}/{student_id}")
async def mark_attendance(course_id: str, student_id: str, user: dict = Depends(verify_token)):
    course = await courses.find_one({"class_id": course_id})
    
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")

    if user["role"] != "teacher":
        raise HTTPException(status_code=403, detail="Only teachers can mark attendance")

    # Check if the student is in the course
    if student_id not in course["students"]:
        raise HTTPException(status_code=404, detail="Student not found in course")

    # Update attendance for today
    today = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)  # Store with full datetime

    attendance_record = {
        "student_id": student_id,
        "status": "present"
    }

    result = await attendance.update_one(
        {"class_id": course_id, "date": today},  # Use full datetime object
        {"$addToSet": {"attendance": attendance_record}},
        upsert=True
    )

    if result.modified_count == 0 and not result.upserted_id:
        raise HTTPException(status_code=400, detail="Attendance not updated")

    return {"message": "Attendance marked successfully"}

@app.get("/students_in_courses/{course_id}")
async def students_in_courses(course_id: str):
    # Fetch the classroom from MongoDB

    classroom = await courses.find_one({"class_id": course_id})
    if not classroom:
        raise HTTPException(status_code=404, detail="Classroom not found")
    # Fetch the students from MongoDB
    print(classroom["students"])
    return {"students": classroom["students"]}
    
@app.get("/courses_in_student")
async def students_in_courses(user: dict = Depends(verify_token)):
    return_courses = []
    student_id = user["id"]

    # Fetch all courses asynchronously
    async for course in courses.find():
        if "students" in course and student_id in course["students"]:
            return_courses.append(course["class_id"])  # Change if you need full details
    print(return_courses)
    return {"courses": return_courses}
  
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
    
@app.get("/notify_all/{course_id}/{assignment_id}")
async def send_notification_to_all( course_id: str,assignment_id:str):
    classroom = await courses.find_one({"class_id": course_id})
    if not classroom:
        raise HTTPException(status_code=404, detail="Classroom not found")
    else:
        for student in classroom["students"]:
             user_id=student
             data=f"New assignment {assignment_id} has been posted in {course_id}"
             print(user_id)
             data_to_store = {"user_id": user_id,"message": data,"timestamp": datetime.utcnow().isoformat(),"status": "unread"}
             await collection.insert_one(data_to_store)

            
    return {"message": "Notification sent to all students"}

@app.get("/notify_all_meet/{course_id}")
async def send_notification_to_all( course_id: str,meet_link: str = Query(...)):
    classroom = await courses.find_one({"class_id": course_id})
    if not classroom:
        raise HTTPException(status_code=404, detail="Classroom not found")
    else:
        for student in classroom["students"]:
             user_id=student
             data=f"New lecture link: {meet_link} has been posted for {course_id}"
             print(user_id)
             data_to_store = {"user_id": user_id,"message": data,"timestamp": datetime.utcnow().isoformat(),"status": "unread"}
             await collection.insert_one(data_to_store)

            
    return {"message": "Notification sent to all students"}

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
        raise e  # Raise theHTTPException

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

@app.get("/auth")
def authenticate():
    
    flow = InstalledAppFlow.from_client_secrets_file(CLIENT_SECRET_FILE, SCOPES, redirect_uri=REDIRECT_URI)
    auth_url, _ = flow.authorization_url(prompt="consent")
    return RedirectResponse(auth_url)

@app.get("/oauth2callback")
async def oauth_callback(request: Request):
    """Handle OAuth2 callback and store user credentials."""
    flow = InstalledAppFlow.from_client_secrets_file(CLIENT_SECRET_FILE, SCOPES, redirect_uri=REDIRECT_URI)
    
    # Fetch authorization token
    flow.fetch_token(authorization_response=str(request.url._url))
    credentials = flow.credentials

    # Save token to file
    with open(TOKEN_FILE, "w") as token_file:
        token_file.write(credentials.to_json())

    return JSONResponse({"message": "Authentication successful! You can now create events."})

@app.get("/create-event")
def create_event():
    """Create a Google Calendar event with Google Meet link."""
    creds = load_credentials()
    if not creds:
        return JSONResponse({"error": "User not authenticated. Please log in."}, status_code=401)

    service = build("calendar", "v3", credentials=creds)

    event = {
        "summary": "Virtual Classroom Session",
        "start": {"dateTime": "2025-03-08T10:00:00", "timeZone": "Asia/Kolkata"},
        "end": {"dateTime": "2025-03-08T11:00:00", "timeZone": "Asia/Kolkata"},
        "conferenceData": {
            "createRequest": {
                "requestId": "classroom-meet",
                "conferenceSolutionKey": {"type": "hangoutsMeet"}
            }
        },
    }

    event = service.events().insert(
        calendarId="primary", body=event, conferenceDataVersion=1
    ).execute()

    return {"meet_link": event.get("hangoutLink", "No Meet link generated")}
    
@app.post("/grade_submission")
async def grade_submission(
    submission_id: str = Form(...),
    mark: float = Form(...),
    user: dict = Depends(verify_token)
):
    # Ensure only teachers can grade submissions
    if user["role"] != "teacher":
        raise HTTPException(status_code=403, detail="Only teachers can grade submissions")
    
    # Update the submission document with the new mark
    result = await submissions.update_one(
        {"_id": ObjectId(submission_id)},
        {"$set": {"mark": mark}}
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Submission not found or grade not updated")
    return {"message": "Submission graded successfully"}

@app.get("/assignment_marks/{assignment_id}")
async def assignment_marks(assignment_id: str, user: dict = Depends(verify_token)):
    # Only teachers can view all marks for an assignment
    if user["role"] != "teacher":
        raise HTTPException(status_code=403, detail="Only teachers can view all marks")
    marks = await submissions.find({"assignment_id": assignment_id}).to_list(length=None)
    for sub in marks:
        sub["_id"] = str(sub["_id"])
        if "file_id" in sub and sub["file_id"]:
            sub["file_id"] = str(sub["file_id"])
    return marks

@app.get("/my_mark/{submission_id}")
async def my_mark(submission_id: str, user: dict = Depends(verify_token)):
    submission = await submissions.find_one({"_id": ObjectId(submission_id)})
    if not submission:
        raise HTTPException(status_code=404, detail="Submission not found")
    # For students, ensure they can only view their own submission's mark
    if user["role"] == "student" and submission.get("student_id") != user["id"]:
        raise HTTPException(status_code=403, detail="You are not authorized to view this submission's mark")
    return {"submission_id": submission_id, "mark": submission.get("mark")}

@app.get("/my_submissions")
async def my_submissions(user: dict = Depends(verify_token)):
    # Only for students
    if user["role"] != "student":
        raise HTTPException(status_code=403, detail="Only students can access their submissions")
    
    # Find all submissions by this student
    student_submissions = await submissions.find({"student_id": user["id"]}).to_list(length=None)
    
    # Convert ObjectIDs to strings for JSON serialization
    for sub in student_submissions:
        sub["_id"] = str(sub["_id"])
        if "file_id" in sub and sub["file_id"]:
            sub["file_id"] = str(sub["file_id"])
    
    return student_submissions



