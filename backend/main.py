from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import employees, attendance

app = FastAPI(
    title="HRMS Lite API", 
    description="Backend for HRMS Lite application using Firebase"
)

# CORS Configuration - UPDATED
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins (ya apna Vercel URL add karo)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(employees.router, prefix="/employees", tags=["Employees"])
app.include_router(attendance.router, prefix="/attendance", tags=["Attendance"])

@app.get("/")
def read_root():
    return {
        "message": "Welcome to HRMS Lite API",
        "status": "Connected to Firebase"
    }