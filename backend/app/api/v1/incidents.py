"""
JanSetu AI - Incidents API Controller
Provides systemic incident visibility and cluster inspection.
"""

from typing import List, Dict, Any, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.api.dependencies import get_current_user
from app.models.user import UserModel
from app.services.incident_service import incident_service

router = APIRouter(prefix="/incidents", tags=["Incidents"])


@router.get("/")
async def list_incidents(
    department_id: Optional[str] = None,
    status_filter: Optional[str] = Query(None, alias="status"),
    current_user: UserModel = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> List[Dict[str, Any]]:
    """Returns clustered civic incidents."""
    return await incident_service.list_incidents(
        current_user_role=current_user.role,
        department_id=current_user.department_id if current_user.role == "DEPARTMENT_OFFICER" else department_id,
        status=status_filter,
        db=db,
    )


@router.get("/{incident_id}")
async def get_incident(
    incident_id: str,
    db: AsyncSession = Depends(get_db),
) -> Dict[str, Any]:
    """Returns detailed incident breakdown and all clustered tickets."""
    inc = await incident_service.get_incident(incident_id, db)
    if not inc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Incident not found")
    return inc
