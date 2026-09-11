"""
JanSetu AI - Clustered Incident Model
"""

import uuid
from sqlalchemy import Column, String, Text, Integer, Float, DateTime, ForeignKey
from app.db.base import Base
from app.core.time import get_ist_now


class IncidentModel(Base):
    __tablename__ = "incidents"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    incident_number = Column(String(50), unique=True, nullable=False, index=True)  # e.g., 'INC-2026-PUN-0042'
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    department_id = Column(String(50), ForeignKey("departments.id"), nullable=False, index=True)
    severity = Column(String(10), default="P1", nullable=False)
    status = Column(String(50), default="DETECTED", nullable=False, index=True)  # DETECTED, VERIFIED, RESOLVING, RESOLVED
    location_name = Column(String(255), nullable=False)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    complaint_count = Column(Integer, default=1, nullable=False)
    first_reported_at = Column(DateTime, default=get_ist_now, nullable=False)
    last_activity_at = Column(DateTime, default=get_ist_now, nullable=False)
    created_at = Column(DateTime, default=get_ist_now, nullable=False)
