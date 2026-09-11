"""
JanSetu AI - AI Analysis Record Model
"""

import uuid
from sqlalchemy import Column, String, Text, Float, DateTime, ForeignKey
from app.db.base import Base
from app.core.time import get_ist_now


class AIAnalysisModel(Base):
    __tablename__ = "ai_analyses"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    complaint_id = Column(String(36), ForeignKey("complaints.id"), unique=True, nullable=False, index=True)
    ticket_id = Column(String(36), ForeignKey("tickets.id"), nullable=True, index=True)
    detected_language = Column(String(20), nullable=False, default="en")
    extracted_issue = Column(String(255), nullable=False)
    extracted_location = Column(String(255), nullable=True)
    extracted_duration = Column(String(100), nullable=True)
    recommended_department = Column(String(50), nullable=False)
    recommended_priority = Column(String(10), nullable=False, default="P2")
    recommended_actions = Column(Text, nullable=False, default="[]")  # JSON encoded list of strings
    actionability_score = Column(Float, nullable=False, default=1.0)
    missing_fields = Column(Text, nullable=False, default="[]")  # JSON encoded list of strings
    clarification_questions = Column(Text, nullable=False, default="[]")  # JSON encoded list
    confidence_score = Column(Float, nullable=False, default=0.9)
    confidence_level = Column(String(20), nullable=False, default="HIGH")
    field_certainties = Column(Text, nullable=False, default="{}")  # JSON map
    citizen_response_draft = Column(Text, nullable=False)
    explanation = Column(Text, nullable=True)
    raw_model_response = Column(Text, nullable=False, default="{}")
    created_at = Column(DateTime, default=get_ist_now, nullable=False)
