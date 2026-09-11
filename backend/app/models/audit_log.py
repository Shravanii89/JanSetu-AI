"""
JanSetu AI - Immutable Regulatory Audit Log Model
"""

import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Text, DateTime
from app.db.base import Base


class AuditLogModel(Base):
    __tablename__ = "audit_logs"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    entity_name = Column(String(50), nullable=False, index=True)  # ticket, complaint, incident, sla
    entity_id = Column(String(50), nullable=False, index=True)
    action = Column(String(100), nullable=False)  # CREATED, REROUTED, STATUS_CHANGED, PRIORITY_CHANGED, ESCALATED, RESOLVED
    actor_type = Column(String(50), nullable=False)  # CITIZEN, OFFICER, MUNICIPAL_ADMIN, COLLECTOR, AI, SYSTEM
    actor_id = Column(String(50), nullable=True)
    previous_state = Column(Text, nullable=True)  # JSON string
    new_state = Column(Text, nullable=True)  # JSON string
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False, index=True)
