"""
JanSetu AI - Escalation Record Model
"""

import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Text, DateTime, ForeignKey
from app.db.base import Base


class EscalationModel(Base):
    __tablename__ = "escalations"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    ticket_id = Column(String(36), ForeignKey("tickets.id"), nullable=False, index=True)
    escalated_by_id = Column(String(36), ForeignKey("users.id"), nullable=True)
    escalated_to_role = Column(String(50), nullable=False)  # MUNICIPAL_ADMIN, COLLECTOR
    reason = Column(Text, nullable=False)
    status = Column(String(50), default="PENDING", nullable=False)  # PENDING, ACKNOWLEDGED, RESOLVED
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
