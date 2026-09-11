"""
JanSetu AI - In-App Notification Model
"""

import uuid
from sqlalchemy import Column, String, Text, Boolean, DateTime
from app.db.base import Base
from app.core.time import get_ist_now


class NotificationModel(Base):
    __tablename__ = "notifications"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), nullable=True, index=True)
    role = Column(String(50), nullable=True, index=True)
    department_id = Column(String(50), nullable=True, index=True)
    ticket_id = Column(String(36), nullable=True, index=True)
    title = Column(String(255), nullable=False)
    message = Column(Text, nullable=False)
    notification_type = Column(String(50), default="INFO", nullable=False)  # EMERGENCY, SLA_BREACH, TICKET_ASSIGNED, etc.
    is_read = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime, default=get_ist_now, nullable=False)
