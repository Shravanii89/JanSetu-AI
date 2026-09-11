"""
JanSetu AI - AI Inference & Triage API Controller
Provides stateless real-time extraction for landing page interactive demonstrations
and pre-submission citizen assistance.
"""

from typing import Dict, Any, Optional
from fastapi import APIRouter
from pydantic import BaseModel, Field

from app.ai.pipeline.orchestrator import orchestrator

router = APIRouter(prefix="/ai", tags=["AI"])


class TextAnalysisRequest(BaseModel):
    text: str = Field(..., min_length=3, description="Citizen grievance narrative")
    language: Optional[str] = "en"


@router.post("/analyze")
async def analyze_text(request: TextAnalysisRequest) -> Dict[str, Any]:
    """
    Executes live AI extraction (Gemini LLM with fallback deterministic rules).
    Returns structured analysis: issue type, duration, location, priority, department,
    missing fields, and clarification prompts.
    """
    return await orchestrator.analyze_complaint(request.text, request.language or "en")
