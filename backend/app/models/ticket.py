"""
JanSetu AI - Operational Service Ticket Model
"""

import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Text, Float, Boolean, DateTime, ForeignKey
from app.db.base import Base


class TicketModel(Base):
    __tablename__ = "tickets"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    complaint_id = Column(String(36), ForeignKey("complaints.id"), unique=True, nullable=False, index=True)
    department_id = Column(String(50), ForeignKey("departments.id"), nullable=False, index=True)
    assigned_officer_id = Column(String(36), ForeignKey("users.id"), nullable=True, index=True)
    incident_id = Column(String(36), ForeignKey("incidents.id"), nullable=True, index=True)
    status = Column(String(50), default="NEW", nullable=False, index=True)
    priority = Column(String(10), default="P2", nullable=False, index=True)  # P0, P1, P2, P3
    severity = Column(String(10), default="P2", nullable=False)
    urgency = Column(String(10), default="P2", nullable=False)
    sentiment_score = Column(Float, default=0.0, nullable=False)
    issue_summary = Column(String(255), nullable=False)
    category = Column(String(100), nullable=False, default="general")
    location_name = Column(String(255), nullable=True)
    ward = Column(String(100), nullable=True)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    is_emergency = Column(Boolean, default=False, nullable=False)
    is_escalated = Column(Boolean, default=False, nullable=False)
    escalation_reason = Column(Text, nullable=True)
    resolution_notes = Column(Text, nullable=True)
    resolved_at = Column(DateTime, nullable=True)
    closed_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)
