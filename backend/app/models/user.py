"""
JanSetu AI - User Entity Model
Enforces exactly 4 roles: CITIZEN, MUNICIPAL_ADMIN, DEPARTMENT_OFFICER, COLLECTOR.
"""

import uuid
from sqlalchemy import Column, String, Boolean, DateTime, ForeignKey
from app.db.base import Base
from app.core.time import get_ist_now


class UserModel(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    employee_id = Column(String(50), unique=True, nullable=True, index=True)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    full_name = Column(String(150), nullable=False)
    role = Column(String(50), nullable=False, index=True)  # CITIZEN, MUNICIPAL_ADMIN, DEPARTMENT_OFFICER, COLLECTOR
    department_id = Column(String(50), ForeignKey("departments.id"), nullable=True, index=True)
    phone = Column(String(20), nullable=True)
    address = Column(String(255), nullable=True)
    ward = Column(String(100), nullable=True)
    preferred_language = Column(String(10), default="en", nullable=False)
    profile_image = Column(String(500), nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)
    is_verified = Column(Boolean, default=False, nullable=False)
    last_login = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=get_ist_now, nullable=False)
    updated_at = Column(DateTime, default=get_ist_now, onupdate=get_ist_now, nullable=False)
