"""
JanSetu AI - Complaint Schemas
"""

from typing import Optional, Dict, Any, List
from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict, field_serializer
from app.core.time import format_ist_iso


class ComplaintCreate(BaseModel):
    raw_text: str = Field(..., min_length=5, description="Unstructured grievance description")
    citizen_name: Optional[str] = None
    citizen_phone: Optional[str] = None
    citizen_email: Optional[str] = None
    preferred_language: str = "en"
    input_channel: str = "WEB"
    location_name: Optional[str] = None
    location_address: Optional[str] = None
    location_text: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    audio_url: Optional[str] = None
    image_url: Optional[str] = None
    client_timestamp: Optional[datetime] = None


class ClarificationSubmit(BaseModel):
    answer: str
    requested_field: Optional[str] = "location"


class ComplaintResponse(BaseModel):
    id: str
    tracking_number: str
    citizen_name: Optional[str] = None
    preferred_language: str
    raw_text: str
    status: str
    input_channel: str
    location_name: Optional[str] = None
    location_address: Optional[str] = None
    location_text: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    created_at: datetime
    ticket_id: Optional[str] = None
    ai_preview: Optional[Dict[str, Any]] = None

    @field_serializer("created_at")
    def serialize_created_at(self, dt: datetime) -> str:
        return format_ist_iso(dt) or dt.isoformat()

    model_config = ConfigDict(from_attributes=True)


class DraftSaveRequest(BaseModel):
    session_id: Optional[str] = None
    complaint_data: Dict[str, Any]


class DraftResponse(BaseModel):
    id: str
    session_id: Optional[str] = None
    complaint_data: Dict[str, Any]
    created_at: datetime
    expires_at: Optional[datetime] = None

    @field_serializer("created_at")
    def serialize_created_at(self, dt: datetime) -> str:
        return format_ist_iso(dt) or dt.isoformat()


class ComplaintUpdateCreate(BaseModel):
    message: str
    internal_note: Optional[str] = None
    status: Optional[str] = None
