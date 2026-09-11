"""
JanSetu AI - Operational Tickets API Controller
Enforces server-side RBAC, department isolation, deterministic state transitions, and audit trails.
"""

from typing import Optional, List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.api.dependencies import get_current_user, require_roles
from app.models.user import UserModel
from app.schemas.ticket import (
    TicketStatusUpdate,
    TicketPriorityUpdate,
    TicketReroute,
    TicketEscalate,
)
from app.services.ticket_service import ticket_service
from app.rules.roles import MUNICIPAL_ADMIN, DEPARTMENT_OFFICER, COLLECTOR

router = APIRouter(prefix="/tickets", tags=["Tickets"])


@router.get("/")
async def list_tickets(
    department_id: Optional[str] = None,
    status_filter: Optional[str] = Query(None, alias="status"),
    priority: Optional[str] = None,
    is_escalated: Optional[bool] = None,
    search: Optional[str] = None,
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0),
    current_user: UserModel = Depends(require_roles(MUNICIPAL_ADMIN, DEPARTMENT_OFFICER, COLLECTOR)),
    db: AsyncSession = Depends(get_db),
) -> List[Dict[str, Any]]:
    """
    Lists tickets.
    DEPARTMENT_OFFICER is strictly confined to their assigned department's tickets.
    """
    return await ticket_service.list_tickets(
        current_user=current_user,
        department_id=department_id,
        status=status_filter,
        priority=priority,
        is_escalated=is_escalated,
        search=search,
        limit=limit,
        offset=offset,
        db=db,
    )


@router.get("/{ticket_id}")
async def get_ticket(
    ticket_id: str,
    current_user: UserModel = Depends(require_roles(MUNICIPAL_ADMIN, DEPARTMENT_OFFICER, COLLECTOR)),
    db: AsyncSession = Depends(get_db),
) -> Dict[str, Any]:
    """
    Retrieves full ticket detail with SLA, AI analysis, and immutable audit trail.
    Enforces department isolation for Department Officers.
    """
    try:
        ticket = await ticket_service.get_ticket(ticket_id, current_user, db)
        if not ticket:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Ticket not found")
        return ticket
    except PermissionError as pe:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=str(pe))


@router.patch("/{ticket_id}/status")
async def update_ticket_status(
    ticket_id: str,
    body: TicketStatusUpdate,
    current_user: UserModel = Depends(require_roles(MUNICIPAL_ADMIN, DEPARTMENT_OFFICER)),
    db: AsyncSession = Depends(get_db),
) -> Dict[str, Any]:
    """
    Transitions ticket status according to deterministic state machine.
    """
    try:
        return await ticket_service.update_status(
            ticket_id=ticket_id,
            new_status=body.status,
            resolution_notes=body.resolution_notes,
            current_user=current_user,
            db=db,
        )
    except PermissionError as pe:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=str(pe))
    except ValueError as ve:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(ve))


@router.patch("/{ticket_id}/priority")
async def update_ticket_priority(
    ticket_id: str,
    body: TicketPriorityUpdate,
    current_user: UserModel = Depends(require_roles(MUNICIPAL_ADMIN, DEPARTMENT_OFFICER, COLLECTOR)),
    db: AsyncSession = Depends(get_db),
) -> Dict[str, Any]:
    """
    Human override of ticket priority. Recalculates SLA deadlines.
    """
    try:
        return await ticket_service.update_priority(
            ticket_id=ticket_id,
            new_priority=body.priority,
            justification=body.justification,
            current_user=current_user,
            db=db,
        )
    except PermissionError as pe:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=str(pe))
    except ValueError as ve:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(ve))


@router.post("/{ticket_id}/reroute")
async def reroute_ticket(
    ticket_id: str,
    body: TicketReroute,
    current_user: UserModel = Depends(require_roles(MUNICIPAL_ADMIN)),
    db: AsyncSession = Depends(get_db),
) -> Dict[str, Any]:
    """
    Municipal Admin only: Re-routes ticket to another controlled municipal department.
    """
    try:
        return await ticket_service.reroute_department(
            ticket_id=ticket_id,
            new_department_id=body.new_department_id,
            reason=body.reason,
            current_user=current_user,
            db=db,
        )
    except ValueError as ve:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(ve))


@router.post("/{ticket_id}/escalate")
async def escalate_ticket(
    ticket_id: str,
    body: TicketEscalate,
    current_user: UserModel = Depends(require_roles(MUNICIPAL_ADMIN, DEPARTMENT_OFFICER)),
    db: AsyncSession = Depends(get_db),
) -> Dict[str, Any]:
    """
    Escalates critical or delayed ticket to higher authority.
    """
    try:
        return await ticket_service.escalate_ticket(
            ticket_id=ticket_id,
            reason=body.reason,
            current_user=current_user,
            db=db,
        )
    except PermissionError as pe:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=str(pe))
