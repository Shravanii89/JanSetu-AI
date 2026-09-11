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
    officer_id = Column(String(36), ForeignKey("users.id"), nullable=False, index=True)
    assigned_by_id = Column(String(36), ForeignKey("users.id"), nullable=True)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=get_ist_now, nullable=False)
