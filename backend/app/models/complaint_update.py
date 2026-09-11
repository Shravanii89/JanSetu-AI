"""
JanSetu AI - Complaint Updates & Official Action Timeline Model
"""

import uuid
from sqlalchemy import Column, String, Text, DateTime, ForeignKey
from app.db.base import Base
from app.core.time import get_ist_now


class ComplaintUpdateModel(Base):
    __tablename__ = "complaint_updates"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    complaint_id = Column(String(36), ForeignKey("complaints.id"), nullable=False, index=True)
    actor_id = Column(String(36), ForeignKey("users.id"), nullable=True)
    actor_role = Column(String(50), nullable=False)
    status = Column(String(50), nullable=False)
    message = Column(Text, nullable=False)  # Citizen-visible timeline message
    internal_note = Column(Text, nullable=True)  # Confidential operational notes hidden from citizens
    created_at = Column(DateTime, default=get_ist_now, nullable=False)
