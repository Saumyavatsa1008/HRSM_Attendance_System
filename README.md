HRMS

A lightweight Human Resource Management System built with FastAPI (Backend), React (Frontend), and Firestore (Database).

 Overview
This application allows an admin to:
- Manage employee records (Add, View, Delete)
- Track daily attendance (Mark Present/Absent, View History)

 Tech Stack
- **Backend**: Python, FastAPI, Google Cloud Firestore
- **Frontend**: React (Vite), Tailwind CSS, Axios, Lucide React
- **Database**: Firestore (NoSQL)

Setup Instructions

Prerequisites
- Python 3.8+
- Node.js 16+
- Firebase Project with Firestore enabled

 1. Backend Setup
1.  Navigate to the `backend` directory:
    ```bash
    cd backend
    ```
2.  Create a virtual environment:
    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows: venv\Scripts\activate
    ```
3.  Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```
4.  **Important**: Configure Firebase Credentials:
    -   Go to the [Firebase Console](https://console.firebase.google.com/).
    -   Create a new project (or select an existing one).
    -   Navigate to **Project Settings** (gear icon) > **Service accounts**.
    -   Click **Generate new private key**.
    -   Save the file as `serviceAccountKey.json`.
    -   Move this file into the `backend/` folder of this project.
5.  Run the server:
    ```bash
    uvicorn main:app --reload
    ```
    The API will be available at `http://localhost:8000`.

 2. Frontend Setup
1.  Navigate to the `frontend` directory:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Run the development server:
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:5173`.

 Assumptions & Limitations
- **Single User**: The system assumes a single admin user; no authentication is implemented.
- **Attendance**: Attendance is marked once per day per employee. Duplicate entries for the same day are prevented.
- **Data Persistence**: Requires a valid `serviceAccountKey.json` to persist data to Firestore. Without it, the backend will fail to start.

 Deployment
- Frontend: Can be deployed to Vercel/Netlify.
- Backend: Can be deployed to Render/Railway.
- Database: Firestore is a managed cloud database.
