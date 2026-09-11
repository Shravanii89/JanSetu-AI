"""
JanSetu AI - Evidence Attachment Model
"""

import uuid
from sqlalchemy import Column, String, Integer, DateTime, ForeignKey
from app.db.base import Base
from app.core.time import get_ist_now


class AttachmentModel(Base):
    __tablename__ = "attachments"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    complaint_id = Column(String(36), ForeignKey("complaints.id"), nullable=False, index=True)
    file_name = Column(String(255), nullable=False)
    file_type = Column(String(50), nullable=False)  # image/jpeg, audio/wav, etc.
    file_size_bytes = Column(Integer, default=0, nullable=False)
    file_url = Column(String(500), nullable=False)
    created_at = Column(DateTime, default=get_ist_now, nullable=False)
