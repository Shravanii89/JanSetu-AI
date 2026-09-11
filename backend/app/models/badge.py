"""
JanSetu AI - Badges & User Badges Model
Civic recognition badges unlocked by community participation.
"""

import uuid
from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, UniqueConstraint
from app.db.base import Base
from app.core.time import get_ist_now


class BadgeModel(Base):
    __tablename__ = "badges"

    id = Column(String(50), primary_key=True)  # e.g., 'first_voice', 'civic_starter'
    name = Column(String(100), nullable=False)
    icon = Column(String(20), nullable=False)
    description = Column(String(255), nullable=False)
    criteria = Column(String(255), nullable=False)
    required_credits = Column(Integer, default=0, nullable=False)
    created_at = Column(DateTime, default=get_ist_now, nullable=False)


class UserBadgeModel(Base):
    __tablename__ = "user_badges"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False, index=True)
    badge_id = Column(String(50), ForeignKey("badges.id"), nullable=False, index=True)
    earned_at = Column(DateTime, default=get_ist_now, nullable=False)

    __table_args__ = (
        UniqueConstraint("user_id", "badge_id", name="uq_user_badges_user_badge"),
    )
