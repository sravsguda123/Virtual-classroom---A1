

# Virtual Classroom

This is a virtual classroom application with a **FastAPI backend** and a **React frontend (Vite-based)**. The backend runs on \`Uvicorn\` at port \`8000\` and requires a Redis server.

## Setup Instructions

### **Backend (FastAPI + Redis)**
1. Navigate to the backend folder:
   \`\`\`sh
   cd backend
   \`\`\`
2. Create a virtual environment:
   \`\`\`sh
   python -m venv venv
   \`\`\`
3. Activate the virtual environment:
   - **Windows (PowerShell)**:
     \`\`\`sh
     venv\Scripts\Activate
     \`\`\`
   - **Linux/macOS**:
     \`\`\`sh
     source venv/bin/activate
     \`\`\`
4. Install dependencies:
   \`\`\`sh
   pip install -r requirements.txt
   \`\`\`
5. Start the Redis server (Ensure Redis is installed):
   \`\`\`sh
   redis-server
   \`\`\`
6. Run the FastAPI backend:
   \`\`\`sh
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   \`\`\`

### **Frontend (React + Vite)**
1. Navigate to the frontend folder:
   \`\`\`sh
   cd frontend
   \`\`\`
2. Install dependencies:
   \`\`\`sh
   npm install
   \`\`\`
3. Start the frontend:
   \`\`\`sh
   npm run dev
   \`\`\`

## Git Workflow

1. Clone the repository:
   \`\`\`sh
   git clone https://github.com/GuhaneshT/Virtual-classroom---A1.git
   \`\`\`
2. Create a new branch for your feature:
   \`\`\`sh
   git checkout -b feature-name
   \`\`\`
3. Make changes and commit:
   \`\`\`sh
   git add .
   git commit -m "Added feature-name"
   \`\`\`
4. Push the branch to GitHub:
   \`\`\`sh
   git push origin feature-name
   \`\`\`
5. Create a pull request (PR) on GitHub and wait for review.

## Contributions
All contributions should go through pull requests. The \`main\` branch is protected.

EOL
