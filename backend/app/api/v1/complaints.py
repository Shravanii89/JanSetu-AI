"""
JanSetu AI - Citizen Complaints API Controller
Handles grievance ingestion, AI understanding, public tracking, and citizen clarification.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Dict, Any

from app.db.session import get_db
from app.schemas.complaint import ComplaintCreate, ClarificationSubmit
from app.services.complaint_service import complaint_service

router = APIRouter(prefix="/complaints", tags=["Complaints"])


@router.post("/", status_code=status.HTTP_201_CREATED)
async def submit_complaint(
    complaint_in: ComplaintCreate,
    db: AsyncSession = Depends(get_db),
) -> Dict[str, Any]:
    """
    Ingests raw citizen complaint, executes AI extraction pipeline,
    determines priority & department routing, and initiates SLA clock.
    """
    try:
        result = await complaint_service.create_complaint(complaint_in, db)
        return result
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to process complaint: {str(e)}",
        )


@router.get("/{id_or_tracking}")
async def track_complaint(
    id_or_tracking: str,
    db: AsyncSession = Depends(get_db),
) -> Dict[str, Any]:
    """
    Public citizen tracking endpoint.
    Retrieves full progress timeline, AI explanation, SLA clock, and clarification prompts.
    """
    complaint = await complaint_service.get_by_tracking_or_id(id_or_tracking, db)
    if not complaint:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Complaint not found. Please verify tracking number.",
        )
    return complaint


@router.post("/{id_or_tracking}/clarify")
async def clarify_complaint(
    id_or_tracking: str,
    clarification: ClarificationSubmit,
    db: AsyncSession = Depends(get_db),
) -> Dict[str, Any]:
    """
    Receives citizen response to AI clarification questions,
    updates location details, resumes paused SLA, and moves status to ASSIGNED.
    """
    try:
        result = await complaint_service.submit_clarification(
            identifier=id_or_tracking,
            answer=clarification.answer,
            field=clarification.requested_field or "location",
            db=db,
        )
        return result
    except ValueError as ve:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(ve),
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to submit clarification: {str(e)}",
        )
