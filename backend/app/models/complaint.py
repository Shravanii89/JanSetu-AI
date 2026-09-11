"""
JanSetu AI - Complaint Entity Model
Stores citizen grievance intake and multimodal metadata.
"""

import uuid
from sqlalchemy import Column, String, Text, DateTime
from app.db.base import Base
from app.core.time import get_ist_now


class ComplaintModel(Base):
    __tablename__ = "complaints"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    tracking_number = Column(String(50), unique=True, nullable=False, index=True)  # e.g., 'JS-2026-PUN-00123'
    citizen_name = Column(String(150), nullable=True)
    citizen_phone = Column(String(20), nullable=True)
    citizen_email = Column(String(150), nullable=True)
    preferred_language = Column(String(10), default="en", nullable=False)
    raw_text = Column(Text, nullable=False)
    input_channel = Column(String(20), default="WEB", nullable=False)  # WEB, VOICE, IMAGE
    audio_url = Column(String(500), nullable=True)
    image_url = Column(String(500), nullable=True)
    status = Column(String(50), default="NEW", nullable=False, index=True)
    created_at = Column(DateTime, default=get_ist_now, nullable=False)
    updated_at = Column(DateTime, default=get_ist_now, onupdate=get_ist_now, nullable=False)
