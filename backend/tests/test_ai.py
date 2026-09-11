"""
JanSetu AI - AI Pipeline & Inference Tests
"""

import pytest
from app.ai.pipeline.orchestrator import orchestrator


@pytest.mark.anyio
async def test_ai_water_complaint_extraction():
    complaint_text = "There has been no water supply in our area for three days and nobody is responding."
    result = await orchestrator.analyze_complaint(complaint_text, preferred_language="en")

    assert result["department"] == "WATER_SUPPLY"
    assert result["priority"] == "P1"
    assert "day" in (result["extracted_duration"] or "")
    assert "location" in result["missing_fields"]
    assert len(result["clarification_questions"]) > 0


@pytest.mark.anyio
async def test_ai_p0_emergency_detection():
    complaint_text = "Emergency! Exposed live electrical wire is hanging over the road near Modern College in Shivaji Nagar!"
    result = await orchestrator.analyze_complaint(complaint_text, preferred_language="en")

    assert result["department"] == "ELECTRICITY"
    assert result["priority"] == "P0"
    assert result["extracted_location"] is not None
    assert "Shivaji Nagar" in result["extracted_location"]
