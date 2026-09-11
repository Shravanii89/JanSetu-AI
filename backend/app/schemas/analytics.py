"""
JanSetu AI - Analytics Schemas
"""

from typing import Dict, List, Any
from pydantic import BaseModel


class OverviewMetrics(BaseModel):
    total_complaints: int
    open_complaints: int
    in_progress: int
    resolved: int
    critical_p0_count: int
    sla_at_risk_count: int
    sla_breached_count: int
    active_incidents: int


class CategoryCount(BaseModel):
    name: str
    count: int


class HotspotLocation(BaseModel):
    name: str
    count: int
    latitude: float
    longitude: float
    department_id: str
    severity: str
