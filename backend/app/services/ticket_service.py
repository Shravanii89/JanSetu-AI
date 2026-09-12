"""
JanSetu AI - Operational Ticket Management Service
Enforces server-side RBAC, department isolation, deterministic state transitions, SLA tracking, and audit logging.
"""

import json
import uuid
from datetime import datetime
from typing import Optional, Dict, Any, List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_, or_, desc

from app.models.ticket import TicketModel
from app.models.complaint import ComplaintModel
from app.models.department import DepartmentModel
from app.models.sla import SLAModel
from app.models.ai_analysis import AIAnalysisModel
from app.models.audit_log import AuditLogModel
from app.models.escalation import EscalationModel
from app.models.assignment import AssignmentModel
from app.models.complaint_update import ComplaintUpdateModel
from app.models.user import UserModel
from app.rules.ticket_states import can_transition, RESOLVED, CLOSED, IN_PROGRESS, ESCALATED
from app.rules.departments import is_valid_department
from app.rules.sla_policy import calculate_deadlines, evaluate_sla_status
from app.rules.roles import DEPARTMENT_OFFICER, MUNICIPAL_ADMIN, COLLECTOR
from app.core.time import get_ist_now, format_ist_iso


class TicketService:
    async def list_tickets(
        self,
        current_user: UserModel,
        department_id: Optional[str] = None,
        status: Optional[str] = None,
        priority: Optional[str] = None,
        is_escalated: Optional[bool] = None,
        search: Optional[str] = None,
        limit: int = 50,
        offset: int = 0,
        db: AsyncSession = None,
    ) -> List[Dict[str, Any]]:
        """
        Lists tickets with strict server-side RBAC and department isolation.
        Department officers CANNOT see other departments' tickets.
        """
        query = (
            select(TicketModel, ComplaintModel, SLAModel, UserModel)
            .join(ComplaintModel, TicketModel.complaint_id == ComplaintModel.id)
            .outerjoin(SLAModel, TicketModel.id == SLAModel.ticket_id)
            .outerjoin(UserModel, TicketModel.assigned_officer_id == UserModel.id)
        )

        conditions = []

        # Server-side department isolation
        if current_user.role == DEPARTMENT_OFFICER:
            conditions.append(TicketModel.department_id == current_user.department_id)
        elif current_user.role == MUNICIPAL_ADMIN and current_user.department_id:
            conditions.append(TicketModel.department_id == current_user.department_id)
        elif department_id:
            conditions.append(TicketModel.department_id == department_id)

        if status:
            conditions.append(TicketModel.status == status)

        if priority:
            conditions.append(TicketModel.priority == priority)

        if is_escalated is not None:
            conditions.append(TicketModel.is_escalated == is_escalated)

        if search:
            search_pattern = f"%{search.strip()}%"
            conditions.append(
                or_(
                    TicketModel.issue_summary.ilike(search_pattern),
                    TicketModel.location_name.ilike(search_pattern),
                    ComplaintModel.tracking_number.ilike(search_pattern),
                    ComplaintModel.raw_text.ilike(search_pattern),
                )
            )

        if conditions:
            query = query.where(and_(*conditions))

        # Order by most recent entry first
        query = query.order_by(
            desc(TicketModel.created_at)
        ).offset(offset).limit(limit)

        result = await db.execute(query)
        rows = result.all()

        tickets_data = []
        for ticket, complaint, sla, assigned_user in rows:
            sla_info = None
            if sla:
                current_sla_status = evaluate_sla_status(
                    sla.priority,
                    sla.created_at,
                    sla.resolved_at,
                    sla.is_paused,
                )
                sla_info = {
                    "priority": sla.priority,
                    "response_deadline": format_ist_iso(sla.response_deadline),
                    "resolution_deadline": format_ist_iso(sla.resolution_deadline),
                    "status": current_sla_status,
                    "is_paused": sla.is_paused,
                }

            assignment_status = "Unassigned"
            if ticket.status == "RESOLVED":
                assignment_status = "Resolved"
            elif ticket.status == "IN_PROGRESS":
                assignment_status = "Work in Progress"
            elif ticket.assigned_officer_id:
                assignment_status = "Assigned"

            assigned_personnel_brief = None
            if assigned_user:
                assigned_personnel_brief = {
                    "id": str(assigned_user.id),
                    "full_name": assigned_user.full_name,
                    "designation": assigned_user.designation or "Field Officer",
                    "employee_id": assigned_user.employee_id,
                    "phone": assigned_user.phone,
                    "ward": assigned_user.ward,
                }

            tickets_data.append({
                "id": str(ticket.id),
                "complaint_id": str(ticket.complaint_id),
                "tracking_number": complaint.tracking_number,
                "raw_complaint_text": complaint.raw_text,
                "citizen_name": complaint.citizen_name,
                "department_id": ticket.department_id,
                "assigned_officer_id": ticket.assigned_officer_id,
                "assigned_officer_name": assigned_user.full_name if assigned_user else None,
                "assignment_status": assignment_status,
                "assigned_personnel": assigned_personnel_brief,
                "incident_id": ticket.incident_id,
                "status": ticket.status,
                "priority": ticket.priority,
                "severity": ticket.severity,
                "urgency": ticket.urgency,
                "sentiment_score": ticket.sentiment_score,
                "issue_summary": ticket.issue_summary,
                "category": ticket.category,
                "location_name": ticket.location_name,
                "ward": ticket.ward,
                "latitude": ticket.latitude,
                "longitude": ticket.longitude,
                "is_emergency": ticket.is_emergency,
                "is_escalated": ticket.is_escalated,
                "escalation_reason": ticket.escalation_reason,
                "resolution_notes": ticket.resolution_notes,
                "resolved_at": format_ist_iso(ticket.resolved_at) if ticket.resolved_at else None,
                "created_at": format_ist_iso(ticket.created_at),
                "sla": sla_info,
            })

        return tickets_data

    async def get_ticket(
        self,
        ticket_id: str,
        current_user: UserModel,
        db: AsyncSession,
    ) -> Optional[Dict[str, Any]]:
        """Retrieves ticket details enforcing department isolation."""
        query = (
            select(TicketModel, ComplaintModel, SLAModel, AIAnalysisModel)
            .join(ComplaintModel, TicketModel.complaint_id == ComplaintModel.id)
            .outerjoin(SLAModel, TicketModel.id == SLAModel.ticket_id)
            .outerjoin(AIAnalysisModel, TicketModel.id == AIAnalysisModel.ticket_id)
            .where(TicketModel.id == ticket_id)
        )
        res = await db.execute(query)
        row = res.first()
        if not row:
            return None

        ticket, complaint, sla, ai_analysis = row

        # Server-side department isolation
        if current_user.role == DEPARTMENT_OFFICER and ticket.department_id != current_user.department_id:
            raise PermissionError(f"Access denied: Ticket belongs to {ticket.department_id}")

        sla_info = None
        if sla:
            current_sla_status = evaluate_sla_status(
                sla.priority,
                sla.created_at,
                sla.resolved_at,
                sla.is_paused,
            )
            sla_info = {
                "priority": sla.priority,
                "response_deadline": format_ist_iso(sla.response_deadline),
                "resolution_deadline": format_ist_iso(sla.resolution_deadline),
                "status": current_sla_status,
                "is_paused": sla.is_paused,
            }

        ai_info = None
        if ai_analysis:
            ai_info = {
                "extracted_issue": ai_analysis.extracted_issue,
                "extracted_location": ai_analysis.extracted_location,
                "extracted_duration": ai_analysis.extracted_duration,
                "recommended_department": ai_analysis.recommended_department,
                "recommended_priority": ai_analysis.recommended_priority,
                "recommended_actions": json.loads(ai_analysis.recommended_actions) if ai_analysis.recommended_actions else [],
                "confidence_score": ai_analysis.confidence_score,
                "confidence_level": ai_analysis.confidence_level,
                "citizen_response_draft": ai_analysis.citizen_response_draft,
                "explanation": ai_analysis.explanation,
            }

        # Fetch audit history
        audit_res = await db.execute(
            select(AuditLogModel)
            .where(AuditLogModel.entity_id == ticket_id)
            .order_by(desc(AuditLogModel.created_at))
        )
        audits = audit_res.scalars().all()
        audit_trail = [
            {
                "id": str(a.id),
                "action": a.action,
                "actor_type": a.actor_type,
                "actor_id": a.actor_id,
                "previous_state": json.loads(a.previous_state) if a.previous_state else None,
                "new_state": json.loads(a.new_state) if a.new_state else None,
                "created_at": format_ist_iso(a.created_at),
            }
            for a in audits
        ]

        # Fetch current assignment
        assignment_info = await self.get_assignment(ticket_id, current_user, db)

        return {
            "id": str(ticket.id),
            "complaint_id": str(ticket.complaint_id),
            "tracking_number": complaint.tracking_number,
            "raw_complaint_text": complaint.raw_text,
            "citizen_name": complaint.citizen_name,
            "citizen_phone": complaint.citizen_phone,
            "department_id": ticket.department_id,
            "assigned_officer_id": ticket.assigned_officer_id,
            "incident_id": ticket.incident_id,
            "status": ticket.status,
            "priority": ticket.priority,
            "severity": ticket.severity,
            "urgency": ticket.urgency,
            "sentiment_score": ticket.sentiment_score,
            "issue_summary": ticket.issue_summary,
            "category": ticket.category,
            "location_name": ticket.location_name,
            "ward": ticket.ward,
            "latitude": ticket.latitude,
            "longitude": ticket.longitude,
            "is_emergency": ticket.is_emergency,
            "is_escalated": ticket.is_escalated,
            "escalation_reason": ticket.escalation_reason,
            "resolution_notes": ticket.resolution_notes,
            "resolved_at": format_ist_iso(ticket.resolved_at) if ticket.resolved_at else None,
            "created_at": format_ist_iso(ticket.created_at),
            "sla": sla_info,
            "ai_analysis": ai_info,
            "audit_trail": audit_trail,
            "assignment": assignment_info,
        }

    async def update_status(
        self,
        ticket_id: str,
        new_status: str,
        resolution_notes: Optional[str],
        current_user: UserModel,
        db: AsyncSession,
    ) -> Dict[str, Any]:
        """Validates deterministic state transition and updates ticket & SLA."""
        ticket_res = await db.execute(select(TicketModel).where(TicketModel.id == ticket_id))
        ticket = ticket_res.scalars().first()
        if not ticket:
            raise ValueError("Ticket not found")

        # Department isolation check
        if current_user.role == DEPARTMENT_OFFICER and ticket.department_id != current_user.department_id:
            raise PermissionError(f"Access denied: Cannot update ticket for {ticket.department_id}")

        old_status = ticket.status
        if not can_transition(old_status, new_status):
            raise ValueError(f"Invalid state transition: Cannot transition from {old_status} to {new_status}")

        now_ist = get_ist_now()
        ticket.status = new_status
        ticket.updated_at = now_ist

        if new_status == RESOLVED:
            ticket.resolved_at = now_ist
            if resolution_notes:
                ticket.resolution_notes = resolution_notes

            # Mark SLA resolved
            sla_res = await db.execute(select(SLAModel).where(SLAModel.ticket_id == ticket.id))
            sla = sla_res.scalars().first()
            if sla:
                sla.resolved_at = ticket.resolved_at
                sla.status = "RESOLVED"
                sla.updated_at = now_ist

            # Synchronize active personnel assignment to RESOLVED
            assign_res = await db.execute(
                select(AssignmentModel)
                .where(
                    and_(
                        AssignmentModel.ticket_id == ticket.id,
                        AssignmentModel.assignment_status.in_(["ASSIGNED", "IN_PROGRESS"])
                    )
                )
            )
            for active_assign in assign_res.scalars().all():
                active_assign.assignment_status = "RESOLVED"
                active_assign.completed_at = now_ist
                active_assign.updated_at = now_ist

        elif new_status == IN_PROGRESS:
            # Synchronize active personnel assignment to IN_PROGRESS
            assign_res = await db.execute(
                select(AssignmentModel)
                .where(
                    and_(
                        AssignmentModel.ticket_id == ticket.id,
                        AssignmentModel.assignment_status == "ASSIGNED"
                    )
                )
            )
            for active_assign in assign_res.scalars().all():
                active_assign.assignment_status = "IN_PROGRESS"
                if not active_assign.started_at:
                    active_assign.started_at = now_ist
                active_assign.updated_at = now_ist

        # Mirror status on parent complaint
        c_res = await db.execute(select(ComplaintModel).where(ComplaintModel.id == ticket.complaint_id))
        complaint = c_res.scalars().first()
        if complaint:
            complaint.status = new_status
            complaint.updated_at = now_ist

        # Audit log
        audit = AuditLogModel(
            entity_name="ticket",
            entity_id=ticket_id,
            action="STATUS_CHANGED",
            actor_type=current_user.role,
            actor_id=str(current_user.id),
            previous_state=json.dumps({"status": old_status}),
            new_state=json.dumps({"status": new_status, "notes": resolution_notes}),
        )
        db.add(audit)
        await db.commit()

        return {"id": ticket_id, "status": new_status, "previous_status": old_status}

    async def update_priority(
        self,
        ticket_id: str,
        new_priority: str,
        justification: str,
        current_user: UserModel,
        db: AsyncSession,
    ) -> Dict[str, Any]:
        """Allows authorized staff to override priority and recalibrates SLA."""
        if new_priority not in ["P0", "P1", "P2", "P3"]:
            raise ValueError("Invalid priority level")

        ticket_res = await db.execute(select(TicketModel).where(TicketModel.id == ticket_id))
        ticket = ticket_res.scalars().first()
        if not ticket:
            raise ValueError("Ticket not found")

        if current_user.role == DEPARTMENT_OFFICER and ticket.department_id != current_user.department_id:
            raise PermissionError("Access denied")

        old_priority = ticket.priority
        ticket.priority = new_priority
        ticket.is_emergency = (new_priority == "P0")
        if new_priority == "P0":
            ticket.is_escalated = True
            ticket.escalation_reason = f"P0 Emergency Override: {justification}"

        now_ist = get_ist_now()
        ticket.updated_at = now_ist

        # Recalculate SLA
        resp_dl, res_dl = calculate_deadlines(new_priority)
        sla_res = await db.execute(select(SLAModel).where(SLAModel.ticket_id == ticket.id))
        sla = sla_res.scalars().first()
        if sla:
            sla.priority = new_priority
            sla.response_deadline = resp_dl
            sla.resolution_deadline = res_dl
            sla.updated_at = now_ist

        # Audit log
        audit = AuditLogModel(
            entity_name="ticket",
            entity_id=ticket_id,
            action="PRIORITY_CHANGED",
            actor_type=current_user.role,
            actor_id=str(current_user.id),
            previous_state=json.dumps({"priority": old_priority}),
            new_state=json.dumps({"priority": new_priority, "justification": justification}),
        )
        db.add(audit)
        await db.commit()

        return {"id": ticket_id, "priority": new_priority, "previous_priority": old_priority}

    async def reroute_department(
        self,
        ticket_id: str,
        new_department_id: str,
        reason: str,
        current_user: UserModel,
        db: AsyncSession,
    ) -> Dict[str, Any]:
        """Admin-only re-routing to another controlled department."""
        if current_user.role != MUNICIPAL_ADMIN:
            raise PermissionError("Only Municipal Admin can re-route tickets across departments")

        if not is_valid_department(new_department_id):
            raise ValueError(f"Invalid department: {new_department_id}")

        ticket_res = await db.execute(select(TicketModel).where(TicketModel.id == ticket_id))
        ticket = ticket_res.scalars().first()
        if not ticket:
            raise ValueError("Ticket not found")

        old_dept = ticket.department_id
        ticket.department_id = new_department_id
        ticket.assigned_officer_id = None  # Reset officer assignment
        ticket.updated_at = get_ist_now()

        audit = AuditLogModel(
            entity_name="ticket",
            entity_id=ticket_id,
            action="REROUTED",
            actor_type=current_user.role,
            actor_id=str(current_user.id),
            previous_state=json.dumps({"department_id": old_dept}),
            new_state=json.dumps({"department_id": new_department_id, "reason": reason}),
        )
        db.add(audit)
        await db.commit()

        return {"id": ticket_id, "department_id": new_department_id, "previous_department_id": old_dept}

    async def escalate_ticket(
        self,
        ticket_id: str,
        reason: str,
        current_user: UserModel,
        db: AsyncSession,
    ) -> Dict[str, Any]:
        """Escalates ticket to administrative/collector oversight."""
        ticket_res = await db.execute(select(TicketModel).where(TicketModel.id == ticket_id))
        ticket = ticket_res.scalars().first()
        if not ticket:
            raise ValueError("Ticket not found")

        if current_user.role == DEPARTMENT_OFFICER and ticket.department_id != current_user.department_id:
            raise PermissionError("Access denied")

        now_ist = get_ist_now()
        ticket.is_escalated = True
        ticket.escalation_reason = reason
        ticket.updated_at = now_ist

        escalated_to = COLLECTOR if ticket.priority in ["P0", "P1"] else MUNICIPAL_ADMIN
        escalation = EscalationModel(
            ticket_id=ticket.id,
            escalated_by_id=str(current_user.id),
            escalated_to_role=escalated_to,
            reason=reason,
            status="PENDING",
            created_at=now_ist,
        )
        db.add(escalation)

        audit = AuditLogModel(
            entity_name="ticket",
            entity_id=ticket_id,
            action="ESCALATED",
            actor_type=current_user.role,
            actor_id=str(current_user.id),
            new_state=json.dumps({"reason": reason, "escalated_to": escalated_to}),
        )
        db.add(audit)
        await db.commit()

        return {"id": ticket_id, "is_escalated": True, "escalated_to": escalated_to}

    async def assign_personnel(
        self,
        ticket_id: str,
        personnel_id: str,
        assignment_note: Optional[str],
        current_user: UserModel,
        db: AsyncSession,
    ) -> Dict[str, Any]:
        """
        Assigns departmental personnel to a ticket.
        Enforces department isolation: Department Officer can only assign personnel
        within their own department.
        """
        ticket_res = await db.execute(select(TicketModel).where(TicketModel.id == ticket_id))
        ticket = ticket_res.scalars().first()
        if not ticket:
            raise ValueError("Ticket not found")

        # RBAC and department isolation
        if current_user.role == DEPARTMENT_OFFICER:
            if ticket.department_id != current_user.department_id:
                raise PermissionError(f"Access denied: Ticket belongs to {ticket.department_id}")
        elif current_user.role != MUNICIPAL_ADMIN:
            raise PermissionError("Unauthorized role for personnel assignment")

        # Validate personnel
        user_res = await db.execute(select(UserModel).where(UserModel.id == personnel_id))
        personnel = user_res.scalars().first()
        if not personnel:
            raise ValueError("Department personnel not found")

        if not personnel.is_active:
            raise ValueError("Selected personnel is not currently active")

        if personnel.department_id != ticket.department_id:
            raise ValueError(f"Personnel belongs to {personnel.department_id}, but ticket belongs to {ticket.department_id}")

        now_ist = get_ist_now()

        # Mark any previous active assignments as REASSIGNED
        prev_assign_res = await db.execute(
            select(AssignmentModel).where(
                and_(
                    AssignmentModel.ticket_id == ticket.id,
                    AssignmentModel.assignment_status.in_(["ASSIGNED", "IN_PROGRESS"])
                )
            )
        )
        for prev in prev_assign_res.scalars().all():
            prev.assignment_status = "REASSIGNED"
            prev.updated_at = now_ist

        # Create new persistent assignment
        assignment = AssignmentModel(
            id=str(uuid.uuid4()),
            ticket_id=ticket.id,
            personnel_id=personnel.id,
            officer_id=personnel.id,
            assigned_by=str(current_user.id),
            assigned_by_id=str(current_user.id),
            notes=assignment_note,
            assignment_note=assignment_note,
            assignment_status="ASSIGNED",
            assigned_at=now_ist,
            created_at=now_ist,
            updated_at=now_ist,
        )
        db.add(assignment)

        # Update ticket assigned officer and status
        ticket.assigned_officer_id = personnel.id
        if ticket.status in ["NEW", "READY_FOR_ROUTING", "AI_ANALYZED"]:
            ticket.status = "ASSIGNED"
        ticket.updated_at = now_ist

        # Mirror status on parent complaint if in initial state
        c_res = await db.execute(select(ComplaintModel).where(ComplaintModel.id == ticket.complaint_id))
        complaint = c_res.scalars().first()
        if complaint:
            if complaint.status in ["NEW", "READY_FOR_ROUTING", "AI_ANALYZED"]:
                complaint.status = "ASSIGNED"
            complaint.updated_at = now_ist

            # Add citizen visible update
            update_log = ComplaintUpdateModel(
                complaint_id=complaint.id,
                actor_id=str(current_user.id),
                actor_role=current_user.role,
                status="ASSIGNED",
                message=f"Assigned to {personnel.full_name} ({personnel.designation or 'Field Officer'}), {ticket.department_id.replace('_', ' ').title()} Department.",
                internal_note=assignment_note,
                created_at=now_ist,
            )
            db.add(update_log)

        # Audit log
        audit = AuditLogModel(
            entity_name="ticket",
            entity_id=ticket_id,
            action="PERSONNEL_ASSIGNED",
            actor_type=current_user.role,
            actor_id=str(current_user.id),
            new_state=json.dumps({
                "personnel_id": personnel.id,
                "personnel_name": personnel.full_name,
                "designation": personnel.designation,
                "note": assignment_note,
            }),
        )
        db.add(audit)
        await db.commit()

        return await self.get_assignment(ticket_id, current_user, db)

    async def get_assignment(
        self,
        ticket_id: str,
        current_user: UserModel,
        db: AsyncSession,
    ) -> Dict[str, Any]:
        """Retrieves current assignment and full reassignment history for a ticket."""
        ticket_res = await db.execute(select(TicketModel).where(TicketModel.id == ticket_id))
        ticket = ticket_res.scalars().first()
        if not ticket:
            raise ValueError("Ticket not found")

        if current_user.role == DEPARTMENT_OFFICER and ticket.department_id != current_user.department_id:
            raise PermissionError(f"Access denied: Ticket belongs to {ticket.department_id}")

        assignments_res = await db.execute(
            select(AssignmentModel)
            .where(AssignmentModel.ticket_id == ticket_id)
            .order_by(desc(AssignmentModel.created_at))
        )
        assignments = assignments_res.scalars().all()

        current_assign = None
        history = []

        for a in assignments:
            p_res = await db.execute(select(UserModel).where(UserModel.id == a.personnel_id))
            p = p_res.scalars().first()

            assigner_res = await db.execute(select(UserModel).where(UserModel.id == a.assigned_by))
            assigner = assigner_res.scalars().first()

            detail = {
                "id": str(a.id),
                "ticket_id": str(a.ticket_id),
                "personnel_id": str(a.personnel_id) if a.personnel_id else None,
                "personnel": {
                    "id": str(p.id),
                    "full_name": p.full_name,
                    "employee_id": p.employee_id,
                    "designation": p.designation,
                    "department_id": p.department_id,
                    "phone": p.phone,
                    "mobile_number": p.phone,
                    "ward": p.ward,
                    "is_active": p.is_active,
                } if p else None,
                "assigned_by": str(a.assigned_by) if a.assigned_by else None,
                "assigned_by_name": assigner.full_name if assigner else "Department Dispatcher",
                "assigned_at": format_ist_iso(a.assigned_at),
                "started_at": format_ist_iso(a.started_at) if a.started_at else None,
                "completed_at": format_ist_iso(a.completed_at) if a.completed_at else None,
                "assignment_status": a.assignment_status,
                "assignment_note": a.assignment_note or a.notes,
                "reassignment_reason": a.reassignment_reason,
                "created_at": format_ist_iso(a.created_at),
                "updated_at": format_ist_iso(a.updated_at),
            }

            if a.assignment_status in ["ASSIGNED", "IN_PROGRESS", "RESOLVED"] and current_assign is None:
                current_assign = detail
            else:
                history.append(detail)

        return {
            "ticket_id": ticket_id,
            "current_assignment": current_assign,
            "history": history,
        }

    async def update_assignment_status(
        self,
        ticket_id: str,
        new_status: str,
        note: Optional[str],
        current_user: UserModel,
        db: AsyncSession,
    ) -> Dict[str, Any]:
        """
        Updates assignment status (e.g. to IN_PROGRESS or RESOLVED).
        Sets started_at or completed_at timestamps in IST.
        """
        ticket_res = await db.execute(select(TicketModel).where(TicketModel.id == ticket_id))
        ticket = ticket_res.scalars().first()
        if not ticket:
            raise ValueError("Ticket not found")

        if current_user.role == DEPARTMENT_OFFICER and ticket.department_id != current_user.department_id:
            raise PermissionError(f"Access denied: Ticket belongs to {ticket.department_id}")

        assign_res = await db.execute(
            select(AssignmentModel)
            .where(
                and_(
                    AssignmentModel.ticket_id == ticket_id,
                    AssignmentModel.assignment_status.in_(["ASSIGNED", "IN_PROGRESS"])
                )
            )
            .order_by(desc(AssignmentModel.created_at))
        )
        assignment = assign_res.scalars().first()
        if not assignment:
            raise ValueError("No active personnel assignment found for this ticket")

        now_ist = get_ist_now()

        if new_status == "IN_PROGRESS":
            assignment.assignment_status = "IN_PROGRESS"
            if not assignment.started_at:
                assignment.started_at = now_ist
            assignment.updated_at = now_ist
            ticket.status = "IN_PROGRESS"
            ticket.updated_at = now_ist

            c_res = await db.execute(select(ComplaintModel).where(ComplaintModel.id == ticket.complaint_id))
            complaint = c_res.scalars().first()
            if complaint:
                complaint.status = "IN_PROGRESS"
                complaint.updated_at = now_ist
                update_log = ComplaintUpdateModel(
                    complaint_id=complaint.id,
                    actor_id=str(current_user.id),
                    actor_role=current_user.role,
                    status="IN_PROGRESS",
                    message="Field operations initiated by assigned personnel. Work in Progress.",
                    internal_note=note,
                    created_at=now_ist,
                )
                db.add(update_log)

        elif new_status == "RESOLVED":
            assignment.assignment_status = "RESOLVED"
            assignment.completed_at = now_ist
            assignment.updated_at = now_ist
            await self.update_status(ticket_id, "RESOLVED", note, current_user, db)

        audit = AuditLogModel(
            entity_name="ticket",
            entity_id=ticket_id,
            action="ASSIGNMENT_STATUS_CHANGED",
            actor_type=current_user.role,
            actor_id=str(current_user.id),
            new_state=json.dumps({"status": new_status, "note": note}),
        )
        db.add(audit)
        await db.commit()

        return await self.get_assignment(ticket_id, current_user, db)

    async def reassign_personnel(
        self,
        ticket_id: str,
        personnel_id: str,
        reassignment_reason: str,
        assignment_note: Optional[str],
        current_user: UserModel,
        db: AsyncSession,
    ) -> Dict[str, Any]:
        """
        Reassigns an open ticket to different personnel with mandatory reason.
        """
        ticket_res = await db.execute(select(TicketModel).where(TicketModel.id == ticket_id))
        ticket = ticket_res.scalars().first()
        if not ticket:
            raise ValueError("Ticket not found")

        if current_user.role == DEPARTMENT_OFFICER and ticket.department_id != current_user.department_id:
            raise PermissionError(f"Access denied: Ticket belongs to {ticket.department_id}")

        user_res = await db.execute(select(UserModel).where(UserModel.id == personnel_id))
        personnel = user_res.scalars().first()
        if not personnel:
            raise ValueError("Department personnel not found")

        if not personnel.is_active:
            raise ValueError("Selected personnel is not currently active")

        if personnel.department_id != ticket.department_id:
            raise ValueError(f"Personnel belongs to {personnel.department_id}, but ticket belongs to {ticket.department_id}")

        now_ist = get_ist_now()

        # Mark current assignment as REASSIGNED with reason
        prev_assign_res = await db.execute(
            select(AssignmentModel).where(
                and_(
                    AssignmentModel.ticket_id == ticket.id,
                    AssignmentModel.assignment_status.in_(["ASSIGNED", "IN_PROGRESS"])
                )
            ).order_by(desc(AssignmentModel.created_at))
        )
        prev_assignment = prev_assign_res.scalars().first()
        if prev_assignment:
            prev_assignment.assignment_status = "REASSIGNED"
            prev_assignment.reassignment_reason = reassignment_reason
            prev_assignment.updated_at = now_ist

        # Create new assignment
        assignment = AssignmentModel(
            id=str(uuid.uuid4()),
            ticket_id=ticket.id,
            personnel_id=personnel.id,
            officer_id=personnel.id,
            assigned_by=str(current_user.id),
            assigned_by_id=str(current_user.id),
            notes=assignment_note,
            assignment_note=assignment_note,
            assignment_status="ASSIGNED",
            assigned_at=now_ist,
            created_at=now_ist,
            updated_at=now_ist,
        )
        db.add(assignment)

        ticket.assigned_officer_id = personnel.id
        ticket.status = "ASSIGNED"
        ticket.updated_at = now_ist

        c_res = await db.execute(select(ComplaintModel).where(ComplaintModel.id == ticket.complaint_id))
        complaint = c_res.scalars().first()
        if complaint:
            complaint.status = "ASSIGNED"
            complaint.updated_at = now_ist
            update_log = ComplaintUpdateModel(
                complaint_id=complaint.id,
                actor_id=str(current_user.id),
                actor_role=current_user.role,
                status="ASSIGNED",
                message=f"Reassigned to {personnel.full_name} ({personnel.designation or 'Field Officer'}). Reason: {reassignment_reason}",
                internal_note=assignment_note,
                created_at=now_ist,
            )
            db.add(update_log)

        audit = AuditLogModel(
            entity_name="ticket",
            entity_id=ticket_id,
            action="PERSONNEL_REASSIGNED",
            actor_type=current_user.role,
            actor_id=str(current_user.id),
            new_state=json.dumps({
                "personnel_id": personnel.id,
                "personnel_name": personnel.full_name,
                "reassignment_reason": reassignment_reason,
            }),
        )
        db.add(audit)
        await db.commit()

        return await self.get_assignment(ticket_id, current_user, db)


ticket_service = TicketService()

