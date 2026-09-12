"""
JanSetu AI - Controlled Departments API Controller
"""

from typing import List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_

from app.db.session import get_db
from app.api.dependencies import require_roles
from app.models.user import UserModel
from app.services.department_service import department_service
from app.rules.roles import MUNICIPAL_ADMIN, DEPARTMENT_OFFICER, COLLECTOR

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


@router.get("/{department_id}/personnel")
async def get_department_personnel(
    department_id: str,
    current_user: UserModel = Depends(require_roles(MUNICIPAL_ADMIN, DEPARTMENT_OFFICER, COLLECTOR)),
    db: AsyncSession = Depends(get_db),
) -> List[Dict[str, Any]]:
    """
    Returns active departmental personnel eligible for ticket dispatch.
    Enforces department isolation: Department Officers can only view personnel in their own department.
    """
    if current_user.role == DEPARTMENT_OFFICER and current_user.department_id != department_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Access denied: You can only query personnel in {current_user.department_id}",
        )

    res = await db.execute(
        select(UserModel).where(
            and_(
                UserModel.department_id == department_id,
                UserModel.is_active == True,
                UserModel.role == DEPARTMENT_OFFICER,
            )
        ).order_by(UserModel.full_name)
    )
    personnel_list = res.scalars().all()

    return [
        {
            "id": str(p.id),
            "full_name": p.full_name,
            "employee_id": p.employee_id,
            "designation": p.designation or "Field Officer",
            "department_id": p.department_id,
            "phone": p.phone,
            "mobile_number": p.phone,
            "ward": p.ward,
            "is_active": p.is_active,
        }
        for p in personnel_list
    ]

