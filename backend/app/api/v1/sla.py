"""
JanSetu AI - SLA Performance & Policy API Controller
"""

from typing import Dict, Any
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func

from app.db.session import get_db
from app.models.sla import SLAModel
from app.rules.sla_policy import SLA_POLICY

router = APIRouter(prefix="/sla", tags=["SLA"])


@router.get("/summary")
async def get_sla_summary(
    db: AsyncSession = Depends(get_db),
) -> Dict[str, Any]:
    """Returns SLA health metrics and standard municipal policy thresholds."""
    total_res = await db.execute(select(func.count(SLAModel.id)))
    total = total_res.scalar() or 0

    within_res = await db.execute(select(func.count(SLAModel.id)).where(SLAModel.status == "WITHIN_SLA"))
    within = within_res.scalar() or 0

    at_risk_res = await db.execute(select(func.count(SLAModel.id)).where(SLAModel.status == "AT_RISK"))
    at_risk = at_risk_res.scalar() or 0

    breached_res = await db.execute(select(func.count(SLAModel.id)).where(SLAModel.status == "BREACHED"))
    breached = breached_res.scalar() or 0

    resolved_res = await db.execute(select(func.count(SLAModel.id)).where(SLAModel.status == "RESOLVED"))
    resolved = resolved_res.scalar() or 0

    compliance = (100.0 - (breached / total * 100)) if total > 0 else 100.0

    return {
        "total": total,
        "within_sla": within,
        "at_risk": at_risk,
        "breached": breached,
        "resolved": resolved,
        "compliance_percentage": round(compliance, 1),
        "policy": SLA_POLICY,
    }
