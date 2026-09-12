"""
JanSetu AI - Ticket Assignment History Model
"""

import uuid
from sqlalchemy import Column, String, Text, DateTime, ForeignKey
from app.db.base import Base
from app.core.time import get_ist_now


class AssignmentModel(Base):
    __tablename__ = "assignments"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    ticket_id = Column(String(36), ForeignKey("tickets.id"), nullable=False, index=True)
    officer_id = Column(String(36), ForeignKey("users.id"), nullable=True, index=True)
    personnel_id = Column(String(36), ForeignKey("users.id"), nullable=True, index=True)
    assigned_by = Column(String(36), ForeignKey("users.id"), nullable=True)
    assigned_by_id = Column(String(36), ForeignKey("users.id"), nullable=True)
    notes = Column(Text, nullable=True)
    assignment_note = Column(Text, nullable=True)
    reassignment_reason = Column(Text, nullable=True)
    assignment_status = Column(String(50), default="ASSIGNED", nullable=False)
    assigned_at = Column(DateTime, default=get_ist_now, nullable=False)
    started_at = Column(DateTime, nullable=True)
    completed_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=get_ist_now, nullable=False)
    updated_at = Column(DateTime, default=get_ist_now, onupdate=get_ist_now, nullable=False)

