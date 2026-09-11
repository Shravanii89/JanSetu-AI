"""
JanSetu AI - User Contributions & Civic Credits Model
Enforces strict server-side uniqueness to prevent duplicate credits.
"""

import uuid
from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, UniqueConstraint
from app.db.base import Base
from app.core.time import get_ist_now


class UserContributionModel(Base):
    __tablename__ = "user_contributions"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False, index=True)
    event_type = Column(String(50), nullable=False)  # VALID_COMPLAINT, CLARIFICATION_PROVIDED, etc.
    credits = Column(Integer, nullable=False)
    reference_id = Column(String(100), nullable=True)  # e.g., complaint_id or tracking_number
    description = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=get_ist_now, nullable=False)

    __table_args__ = (
        UniqueConstraint("user_id", "event_type", "reference_id", name="uq_user_contributions_event_ref"),
    )
