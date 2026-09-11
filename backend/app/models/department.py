"""
JanSetu AI - Department Entity Model
Controlled 8-department taxonomy for Pune Municipal Corporation.
"""

from datetime import datetime, timezone
from sqlalchemy import Column, String, Text, Boolean, DateTime
from app.db.base import Base


class DepartmentModel(Base):
    __tablename__ = "departments"

    id = Column(String(50), primary_key=True)  # e.g., 'WATER_SUPPLY', 'ROAD'
    name = Column(String(150), nullable=False)
    description = Column(Text, nullable=True)
    contact_email = Column(String(150), nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
