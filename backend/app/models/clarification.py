"""
JanSetu AI - Clarification Message Model
"""

import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Text, DateTime, ForeignKey
from app.db.base import Base


class ClarificationModel(Base):
    __tablename__ = "clarifications"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    complaint_id = Column(String(36), ForeignKey("complaints.id"), nullable=False, index=True)
    ticket_id = Column(String(36), nullable=True, index=True)
    sender_type = Column(String(20), nullable=False)  # AI, OFFICER, CITIZEN
    question = Column(Text, nullable=False)
    answer = Column(Text, nullable=True)
    requested_field = Column(String(100), nullable=True)
    answered_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
