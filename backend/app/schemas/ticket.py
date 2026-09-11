"""
JanSetu AI - Ticket Schemas
"""

from typing import Optional, Dict, Any, List
from datetime import datetime
from pydantic import BaseModel, ConfigDict, field_serializer
from app.core.time import format_ist_iso


class TicketStatusUpdate(BaseModel):
    status: str
    resolution_notes: Optional[str] = None


class TicketPriorityUpdate(BaseModel):
    priority: str
    justification: str


class TicketReroute(BaseModel):
    new_department_id: str
    reason: str


class TicketEscalate(BaseModel):
    reason: str


class TicketAssign(BaseModel):
    officer_id: str
    notes: Optional[str] = None


class TicketResponse(BaseModel):
    id: str
    complaint_id: str
    department_id: str
    department_name: Optional[str] = None
    assigned_officer_id: Optional[str] = None
    assigned_officer_name: Optional[str] = None
    incident_id: Optional[str] = None
    status: str
    priority: str
    severity: str
    urgency: str
    sentiment_score: float
    issue_summary: str
    category: str
    location_name: Optional[str] = None
    ward: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    is_emergency: bool
    is_escalated: bool
    escalation_reason: Optional[str] = None
    resolution_notes: Optional[str] = None
    resolved_at: Optional[datetime] = None
    created_at: datetime
    tracking_number: Optional[str] = None
    raw_complaint_text: Optional[str] = None
    sla: Optional[Dict[str, Any]] = None
    ai_analysis: Optional[Dict[str, Any]] = None

    @field_serializer("created_at")
    def serialize_created_at(self, dt: datetime) -> str:
        return format_ist_iso(dt) or dt.isoformat()

    @field_serializer("resolved_at")
    def serialize_resolved_at(self, dt: Optional[datetime]) -> Optional[str]:
        return format_ist_iso(dt) if dt else None

    model_config = ConfigDict(from_attributes=True)
