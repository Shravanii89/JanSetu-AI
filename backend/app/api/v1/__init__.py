"""
JanSetu AI - API Version 1 Router
"""
from fastapi import APIRouter
from app.api.v1.health import router as health_router
from app.api.v1.auth import router as auth_router
from app.api.v1.complaints import router as complaints_router
from app.api.v1.tickets import router as tickets_router
from app.api.v1.ai import router as ai_router
from app.api.v1.clarification import router as clarification_router
from app.api.v1.departments import router as departments_router
from app.api.v1.sla import router as sla_router
from app.api.v1.incidents import router as incidents_router
from app.api.v1.analytics import router as analytics_router
from app.api.v1.map import router as map_router
from app.api.v1.escalations import router as escalations_router

api_v1_router = APIRouter()

api_v1_router.include_router(health_router, tags=["Health"])
api_v1_router.include_router(auth_router)
api_v1_router.include_router(complaints_router)
api_v1_router.include_router(tickets_router)
api_v1_router.include_router(ai_router)
api_v1_router.include_router(clarification_router)
api_v1_router.include_router(departments_router)
api_v1_router.include_router(sla_router)
api_v1_router.include_router(incidents_router)
api_v1_router.include_router(analytics_router)
api_v1_router.include_router(map_router)
api_v1_router.include_router(escalations_router)

__all__ = ["api_v1_router"]
