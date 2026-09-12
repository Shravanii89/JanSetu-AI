"""
JanSetu AI - Ticket Assignment Schemas
Defines request and response validation models for departmental personnel assignment.
"""

from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel, ConfigDict, field_validator


class PersonnelBrief(BaseModel):
    id: str
    full_name: str
    employee_id: Optional[str] = None
    designation: Optional[str] = None
    department_id: Optional[str] = None
    phone: Optional[str] = None
    mobile_number: Optional[str] = None
    ward: Optional[str] = None
    is_active: bool = True

    model_config = ConfigDict(from_attributes=True)


class TicketAssignRequest(BaseModel):
    personnel_id: str
    assignment_note: Optional[str] = None


class TicketReassignRequest(BaseModel):
    personnel_id: str
    reassignment_reason: str
    assignment_note: Optional[str] = None

    @field_validator("reassignment_reason")
    @classmethod
    def validate_reason(cls, v: str) -> str:
        if not v or not v.strip():
            raise ValueError("Reassignment reason is required")
        return v.strip()


class TicketAssignmentStatusUpdate(BaseModel):
    status: str  # "IN_PROGRESS" | "RESOLVED"
    note: Optional[str] = None

    @field_validator("status")
    @classmethod
    def validate_status(cls, v: str) -> str:
        upper_v = v.upper().strip()
        if upper_v not in ["IN_PROGRESS", "RESOLVED"]:
            raise ValueError("Status must be 'IN_PROGRESS' or 'RESOLVED'")
        return upper_v


class AssignmentDetail(BaseModel):
    id: str
    ticket_id: str
    personnel_id: str
    personnel: Optional[PersonnelBrief] = None
    assigned_by: Optional[str] = None
    assigned_by_name: Optional[str] = None
    assigned_at: Optional[str] = None
    started_at: Optional[str] = None
    completed_at: Optional[str] = None
    assignment_status: str
    assignment_note: Optional[str] = None
    reassignment_reason: Optional[str] = None
    created_at: Optional[str] = None
    updated_at: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


class TicketAssignmentResponse(BaseModel):
    ticket_id: str
    current_assignment: Optional[AssignmentDetail] = None
    history: List[AssignmentDetail] = []


class CitizenAssignedPersonnel(BaseModel):
    name: str
    designation: str
    department: str
    official_contact: str
    assigned_date: str
    work_status: str
