"""
JanSetu AI - Complaint Drafts Storage Model
Preserves intake progress across login/registration.
"""

import uuid
from sqlalchemy import Column, String, Text, DateTime, ForeignKey
from app.db.base import Base
from app.core.time import get_ist_now


class ComplaintDraftModel(Base):
    __tablename__ = "complaint_drafts"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    session_id = Column(String(100), nullable=True, index=True)
    user_id = Column(String(36), ForeignKey("users.id"), nullable=True, index=True)
    complaint_data = Column(Text, nullable=False)  # JSON-serialized draft details
    created_at = Column(DateTime, default=get_ist_now, nullable=False)
    expires_at = Column(DateTime, nullable=True)
