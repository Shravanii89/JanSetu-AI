"""
JanSetu AI - Geographic Map & Hotspots API Controller
"""

from typing import List, Dict, Any
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.services.analytics_service import analytics_service

router = APIRouter(prefix="/map", tags=["Map"])


@router.get("/hotspots")
async def get_hotspots(
    db: AsyncSession = Depends(get_db),
) -> List[Dict[str, Any]]:
    """Returns geographic complaint clusters across Pune."""
    return await analytics_service.get_hotspots(db)
