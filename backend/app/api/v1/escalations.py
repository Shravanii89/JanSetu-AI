"""
JanSetu AI - Escalations API Controller
Enables executive oversight of overdue or hazardous tickets.
"""

from typing import List, Dict, Any, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc

from app.db.session import get_db
from app.api.dependencies import require_roles
from app.models.escalation import EscalationModel
from app.models.ticket import TicketModel
from app.models.complaint import ComplaintModel
from app.models.user import UserModel
from app.rules.roles import MUNICIPAL_ADMIN, COLLECTOR
from app.core.time import format_ist_iso

router = APIRouter(prefix="/escalations", tags=["Escalations"])


@router.get("/")
async def list_escalations(
    status_filter: Optional[str] = Query(None, alias="status"),
    current_user: UserModel = Depends(require_roles(MUNICIPAL_ADMIN, COLLECTOR)),
    db: AsyncSession = Depends(get_db),
) -> List[Dict[str, Any]]:
    """Returns all escalated tickets for executive intervention."""
    query = (
        select(EscalationModel, TicketModel, ComplaintModel)
        .join(TicketModel, EscalationModel.ticket_id == TicketModel.id)
        .join(ComplaintModel, TicketModel.complaint_id == ComplaintModel.id)
        .order_by(desc(EscalationModel.created_at))
    )

    if status_filter:
        query = query.where(EscalationModel.status == status_filter)

    res = await db.execute(query)
    rows = res.all()

    escalations = []
    for esc, ticket, complaint in rows:
        escalations.append({
            "id": str(esc.id),
            "ticket_id": str(ticket.id),
            "tracking_number": complaint.tracking_number,
            "issue_summary": ticket.issue_summary,
            "department_id": ticket.department_id,
            "priority": ticket.priority,
            "status": esc.status,
            "reason": esc.reason,
            "escalated_to_role": esc.escalated_to_role,
            "created_at": format_ist_iso(esc.created_at),
        })

    return escalations
