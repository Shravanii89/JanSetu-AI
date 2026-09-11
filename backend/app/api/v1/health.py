"""
JanSetu AI - Health Check Controller
"""

from fastapi import APIRouter, status
from pydantic import BaseModel

router = APIRouter()


class HealthResponse(BaseModel):
    status: str


@router.get(
    "/health",
    response_model=HealthResponse,
    status_code=status.HTTP_200_OK,
    summary="System Health Check",
    description="Returns HTTP 200 and operational status for uptime and monitoring probes.",
)
async def get_health() -> HealthResponse:
    return HealthResponse(status="ok")
