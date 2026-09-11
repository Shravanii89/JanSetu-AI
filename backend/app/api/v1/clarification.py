"""
JanSetu AI - Clarification Workflow API Controller
Enables official staff to request missing information from citizens and pauses SLA.
"""

from typing import Dict, Any, List
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.db.session import get_db
from app.api.dependencies import require_roles
from app.models.clarification import ClarificationModel
from app.models.ticket import TicketModel
from app.models.sla import SLAModel
from app.models.complaint import ComplaintModel
from app.models.user import UserModel
from app.models.audit_log import AuditLogModel
from app.rules.roles import MUNICIPAL_ADMIN, DEPARTMENT_OFFICER
from app.core.time import get_ist_now

router = APIRouter(prefix="/clarification", tags=["Clarification"])


class OfficerClarificationRequest(BaseModel):
    question: str
    requested_field: str = "general"


@router.post("/{ticket_id}/request")
async def request_clarification(
    ticket_id: str,
    body: OfficerClarificationRequest,
    current_user: UserModel = Depends(require_roles(MUNICIPAL_ADMIN, DEPARTMENT_OFFICER)),
    db: AsyncSession = Depends(get_db),
) -> Dict[str, Any]:
    """
    Department Officer or Admin requests clarification from citizen.
    Transitions ticket to NEEDS_CLARIFICATION and pauses the active SLA.
    """
    ticket_res = await db.execute(select(TicketModel).where(TicketModel.id == ticket_id))
    ticket = ticket_res.scalars().first()
    if not ticket:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Ticket not found")

    if current_user.role == DEPARTMENT_OFFICER and ticket.department_id != current_user.department_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")

    now_ist = get_ist_now()
    ticket.status = "NEEDS_CLARIFICATION"
    ticket.updated_at = now_ist

    # Pause SLA
    sla_res = await db.execute(select(SLAModel).where(SLAModel.ticket_id == ticket.id))
    sla = sla_res.scalars().first()
    if sla and not sla.is_paused:
        sla.is_paused = True
        sla.status = "PAUSED"
        sla.paused_at = now_ist

    # Record clarification
    clarif = ClarificationModel(
        complaint_id=ticket.complaint_id,
        ticket_id=ticket.id,
        sender_type="OFFICER",
        sender_id=str(current_user.id),
        question=body.question,
        requested_field=body.requested_field,
    )
    db.add(clarif)

    # Audit
    audit = AuditLogModel(
        entity_name="ticket",
        entity_id=ticket_id,
        action="CLARIFICATION_REQUESTED",
        actor_type=current_user.role,
        actor_id=str(current_user.id),
        new_state=body.question,
    )
    db.add(audit)
    await db.commit()

    return {"status": "ok", "message": "Clarification requested and SLA paused."}
