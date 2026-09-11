"""
JanSetu AI - Department Schemas
"""

from typing import Optional
from pydantic import BaseModel


class DepartmentResponse(BaseModel):
    id: str
    name: str
    description: Optional[str] = None
    contact_email: Optional[str] = None
    is_active: bool
    open_tickets_count: int = 0
    sla_compliance_pct: float = 100.0

    class Config:
        from_attributes = True
