"""
JanSetu AI - Clarification API Controller
TODO: Implement endpoints in corresponding development phase.
"""
from fastapi import APIRouter

router = APIRouter(prefix="/clarification", tags=["Clarification"])

@router.get("/")
async def get_clarification_root():
    return {"module": "clarification", "status": "scaffolded"}
