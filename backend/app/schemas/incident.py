"""
JanSetu AI - Incident Schemas
"""

from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel, ConfigDict


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

    model_config = ConfigDict(from_attributes=True)
