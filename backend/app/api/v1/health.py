"""
JanSetu AI - Health Check Controller
"""

from fastapi import APIRouter, Depends, status
from pydantic import BaseModel
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db

router = APIRouter()


class HealthResponse(BaseModel):
    status: str


@router.get(
    "/health",
    response_model=HealthResponse,
    status_code=status.HTTP_200_OK,
    summary="System Health Check",
    description="Returns HTTP 200 and verifies database connectivity and operational status.",
)
async def get_health(db: AsyncSession = Depends(get_db)) -> HealthResponse:
    # Actively verify database connection
    await db.execute(text("SELECT 1"))
    return HealthResponse(status="ok")

