"""
JanSetu AI - SLA Tracking Model
"""

import uuid
from sqlalchemy import Column, String, Boolean, Integer, DateTime, ForeignKey
from app.db.base import Base
from app.core.time import get_ist_now


class SLAModel(Base):
    __tablename__ = "slas"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    ticket_id = Column(String(36), ForeignKey("tickets.id"), unique=True, nullable=False, index=True)
    priority = Column(String(10), nullable=False)
    response_deadline = Column(DateTime, nullable=False)
    resolution_deadline = Column(DateTime, nullable=False)
    responded_at = Column(DateTime, nullable=True)
    resolved_at = Column(DateTime, nullable=True)
    status = Column(String(50), default="WITHIN_SLA", nullable=False, index=True)  # WITHIN_SLA, AT_RISK, BREACHED, PAUSED, RESOLVED
    is_paused = Column(Boolean, default=False, nullable=False)
    paused_at = Column(DateTime, nullable=True)
    total_paused_minutes = Column(Integer, default=0, nullable=False)
    breached_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=get_ist_now, nullable=False)
    updated_at = Column(DateTime, default=get_ist_now, onupdate=get_ist_now, nullable=False)
