"""
JanSetu AI - Executive Analytics & Intelligence Controller
"""

from typing import Dict, Any, List
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.services.analytics_service import analytics_service

router = APIRouter(prefix="/analytics", tags=["Analytics"])


@router.get("/overview")
async def get_overview(
    db: AsyncSession = Depends(get_db),
) -> Dict[str, Any]:
    """Returns top-level municipal command metrics."""
    return await analytics_service.get_overview(db)


@router.get("/departments")
async def get_department_distribution(
    db: AsyncSession = Depends(get_db),
) -> List[Dict[str, Any]]:
    """Returns complaint counts across all 8 departments."""
    return await analytics_service.get_department_distribution(db)


@router.get("/priorities")
async def get_priority_distribution(
    db: AsyncSession = Depends(get_db),
) -> List[Dict[str, Any]]:
    """Returns complaint volume per priority tier (P0-P3)."""
    return await analytics_service.get_priority_distribution(db)


@router.get("/statuses")
async def get_status_distribution(
    db: AsyncSession = Depends(get_db),
) -> List[Dict[str, Any]]:
    """Returns volume per ticket lifecycle stage."""
    return await analytics_service.get_status_distribution(db)
