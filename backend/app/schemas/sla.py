"""
JanSetu AI - SLA Schemas
"""

from typing import Optional
from datetime import datetime
from pydantic import BaseModel, ConfigDict


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

    model_config = ConfigDict(from_attributes=True)
