from fastapi import APIRouter, HTTPException, Depends
from typing import List
from database import get_db
from models import Employee, EmployeeCreate
from google.cloud.firestore import Client
from datetime import datetime

router = APIRouter(
    tags=["employees"],
    responses={404: {"description": "Not found"}},
)

@router.post("/", response_model=Employee)
async def create_employee(employee: EmployeeCreate, db: Client = Depends(get_db)):
    # Check for duplicate email
    existing_employees = db.collection("employees").where("email", "==", employee.email).stream()
    if any(existing_employees):
        raise HTTPException(status_code=400, detail="Employee with this email already exists")

    new_employee_ref = db.collection("employees").document()
    employee_data = employee.dict()
    employee_id = new_employee_ref.id
    timestamp = datetime.now()

    new_employee = {
        "id": employee_id,
        "created_at": timestamp,
        **employee_data
    }
    
    new_employee_ref.set(new_employee)
    return new_employee

@router.get("/", response_model=List[Employee])
async def read_employees(db: Client = Depends(get_db)):
    employees_ref = db.collection("employees")
    docs = employees_ref.stream()
    employees = []
    for doc in docs:
        employees.append(doc.to_dict())
    return employees

@router.delete("/{employee_id}")
async def delete_employee(employee_id: str, db: Client = Depends(get_db)):
    employee_ref = db.collection("employees").document(employee_id)
    if not employee_ref.get().exists:
        raise HTTPException(status_code=404, detail="Employee not found")
    
    employee_ref.delete()
    return {"message": "Employee deleted successfully"}