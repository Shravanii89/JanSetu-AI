"""
JanSetu AI - Complaint Schemas
"""

from typing import Optional, Dict, Any, List
from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict


class ComplaintCreate(BaseModel):
    raw_text: str = Field(..., min_length=5, description="Unstructured grievance description")
    citizen_name: Optional[str] = None
    citizen_phone: Optional[str] = None
    citizen_email: Optional[str] = None
    preferred_language: str = "en"
    input_channel: str = "WEB"
    location_name: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    audio_url: Optional[str] = None
    image_url: Optional[str] = None


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
    created_at: datetime
    ticket_id: Optional[str] = None
    ai_preview: Optional[Dict[str, Any]] = None

    model_config = ConfigDict(from_attributes=True)
