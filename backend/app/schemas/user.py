"""
JanSetu AI - User Schemas
"""

from typing import Optional
from datetime import datetime
from pydantic import BaseModel, ConfigDict, field_serializer
from app.core.time import format_ist_iso


class UserResponse(BaseModel):
    id: str
    email: str
    full_name: str
    role: str
    department_id: Optional[str] = None
    employee_id: Optional[str] = None
    phone: Optional[str] = None
    is_active: bool
    created_at: datetime

    @field_serializer("created_at")
    def serialize_created_at(self, dt: datetime) -> str:
        return format_ist_iso(dt) or dt.isoformat()

    model_config = ConfigDict(from_attributes=True)
