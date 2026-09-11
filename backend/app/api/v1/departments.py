"""
JanSetu AI - Controlled Departments API Controller
"""

from typing import List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.services.department_service import department_service

router = APIRouter(prefix="/departments", tags=["Departments"])


@router.get("/")
async def list_departments(
    db: AsyncSession = Depends(get_db),
) -> List[Dict[str, Any]]:
    """Returns all 8 controlled departments with operational workload statistics."""
    return await department_service.list_departments(db)


@router.get("/{department_id}")
async def get_department(
    department_id: str,
    db: AsyncSession = Depends(get_db),
) -> Dict[str, Any]:
    """Returns single department operational profile."""
    dept = await department_service.get_department(department_id, db)
    if not dept:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Department not found")
    return dept
