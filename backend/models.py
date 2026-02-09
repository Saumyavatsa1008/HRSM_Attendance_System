from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class EmployeeBase(BaseModel):
    full_name: str
    email: EmailStr
    department: str
    role: Optional[str] = "Employee"

class EmployeeCreate(EmployeeBase):
    pass

class Employee(EmployeeBase):
    id: str
    created_at: datetime

class AttendanceBase(BaseModel):
    employee_id: str
    date: str # YYYY-MM-DD
    status: str # "Present" or "Absent"

class AttendanceCreate(AttendanceBase):
    pass

class Attendance(AttendanceBase):
    id: str
    timestamp: datetime
