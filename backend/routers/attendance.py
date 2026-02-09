from fastapi import APIRouter, HTTPException, Depends
from typing import List
from database import get_db
from models import Attendance, AttendanceCreate
from google.cloud.firestore import Client
from datetime import datetime

router = APIRouter(
    tags=["attendance"],
    responses={404: {"description": "Not found"}},
)

@router.post("/", response_model=Attendance)
async def mark_attendance(attendance: AttendanceCreate, db: Client = Depends(get_db)):
    # Verify employee exists
    employee_ref = db.collection("employees").document(attendance.employee_id)
    if not employee_ref.get().exists:
        raise HTTPException(status_code=404, detail="Employee not found")

    # Check if attendance already marked for this date
    existing_attendance = db.collection("attendance")\
        .where("employee_id", "==", attendance.employee_id)\
        .where("date", "==", attendance.date)\
        .stream()
    
    if any(existing_attendance):
        raise HTTPException(status_code=400, detail="Attendance already marked for this date")

    new_attendance_ref = db.collection("attendance").document()
    attendance_data = attendance.dict()
    attendance_id = new_attendance_ref.id
    timestamp = datetime.now()

    new_attendance = {
        "id": attendance_id,
        "timestamp": timestamp,
        **attendance_data
    }

    new_attendance_ref.set(new_attendance)
    return new_attendance

@router.get("/{employee_id}", response_model=List[Attendance])
async def read_attendance(employee_id: str, db: Client = Depends(get_db)):
    attendance_ref = db.collection("attendance").where("employee_id", "==", employee_id)
    docs = attendance_ref.stream()
    attendance_records = []
    for doc in docs:
        attendance_records.append(doc.to_dict())
    return attendance_records

@router.get("/", response_model=List[Attendance])
async def read_all_attendance(db: Client = Depends(get_db)):
    attendance_ref = db.collection("attendance")
    docs = attendance_ref.stream()
    attendance_records = []
    for doc in docs:
        attendance_records.append(doc.to_dict())
    return attendance_records