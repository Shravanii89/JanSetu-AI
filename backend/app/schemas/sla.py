"""
JanSetu AI - SLA Schemas
"""

from typing import Optional
from datetime import datetime
from pydantic import BaseModel, ConfigDict, field_serializer
from app.core.time import format_ist_iso


class SLAResponse(BaseModel):
    id: str
    ticket_id: str
    priority: str
    response_deadline: datetime
    resolution_deadline: datetime
    responded_at: Optional[datetime] = None
    resolved_at: Optional[datetime] = None
    status: str
    is_paused: bool
    breached_at: Optional[datetime] = None

    @field_serializer("response_deadline")
    def serialize_response_deadline(self, dt: datetime) -> str:
        return format_ist_iso(dt) or dt.isoformat()

    @field_serializer("resolution_deadline")
    def serialize_resolution_deadline(self, dt: datetime) -> str:
        return format_ist_iso(dt) or dt.isoformat()

    @field_serializer("responded_at")
    def serialize_responded_at(self, dt: Optional[datetime]) -> Optional[str]:
        return format_ist_iso(dt) if dt else None

    @field_serializer("resolved_at")
    def serialize_resolved_at(self, dt: Optional[datetime]) -> Optional[str]:
        return format_ist_iso(dt) if dt else None

    @field_serializer("breached_at")
    def serialize_breached_at(self, dt: Optional[datetime]) -> Optional[str]:
        return format_ist_iso(dt) if dt else None

    model_config = ConfigDict(from_attributes=True)
