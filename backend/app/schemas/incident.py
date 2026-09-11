"""
JanSetu AI - Incident Schemas
"""

from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel, ConfigDict, field_serializer
from app.core.time import format_ist_iso


class IncidentCreate(BaseModel):
    title: str
    description: Optional[str] = None
    department_id: str
    location_name: str
    severity: str = "P1"
    ticket_ids: List[str] = []


class IncidentResponse(BaseModel):
    id: str
    incident_number: str
    title: str
    description: Optional[str] = None
    department_id: str
    severity: str
    status: str
    location_name: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    complaint_count: int
    first_reported_at: datetime
    last_activity_at: datetime
    created_at: datetime

    @field_serializer("first_reported_at")
    def serialize_first_reported_at(self, dt: datetime) -> str:
        return format_ist_iso(dt) or dt.isoformat()

    @field_serializer("last_activity_at")
    def serialize_last_activity_at(self, dt: datetime) -> str:
        return format_ist_iso(dt) or dt.isoformat()

    @field_serializer("created_at")
    def serialize_created_at(self, dt: datetime) -> str:
        return format_ist_iso(dt) or dt.isoformat()

    model_config = ConfigDict(from_attributes=True)
