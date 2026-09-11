"""
JanSetu AI - Incident Clustering & Management Service
Groups related complaints by location/category into systemic civic incidents.
"""

from datetime import datetime
from typing import List, Dict, Any, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_, desc, func

from app.models.incident import IncidentModel
from app.models.ticket import TicketModel
from app.models.complaint import ComplaintModel
from app.models.audit_log import AuditLogModel
from app.rules.roles import DEPARTMENT_OFFICER
from app.core.time import format_ist_iso


class IncidentService:
    async def list_incidents(
        self,
        current_user_role: Optional[str] = None,
        department_id: Optional[str] = None,
        status: Optional[str] = None,
        db: AsyncSession = None,
    ) -> List[Dict[str, Any]]:
        """Lists active and resolved systemic incidents."""
        query = select(IncidentModel)

        conditions = []
        if current_user_role == DEPARTMENT_OFFICER and department_id:
            conditions.append(IncidentModel.department_id == department_id)
        elif department_id:
            conditions.append(IncidentModel.department_id == department_id)

        if status:
            conditions.append(IncidentModel.status == status)

        if conditions:
            query = query.where(and_(*conditions))

        query = query.order_by(desc(IncidentModel.last_activity_at))
        res = await db.execute(query)
        incidents = res.scalars().all()

        incident_list = []
        for inc in incidents:
            # Count actual tickets assigned
            t_count_res = await db.execute(
                select(func.count(TicketModel.id)).where(TicketModel.incident_id == inc.id)
            )
            linked_tickets_count = t_count_res.scalar() or inc.complaint_count

            incident_list.append({
                "id": str(inc.id),
                "incident_number": inc.incident_number,
                "title": inc.title,
                "description": inc.description,
                "department_id": inc.department_id,
                "severity": inc.severity,
                "status": inc.status,
                "location_name": inc.location_name,
                "latitude": inc.latitude,
                "longitude": inc.longitude,
                "complaint_count": linked_tickets_count,
                "first_reported_at": format_ist_iso(inc.first_reported_at),
                "last_activity_at": format_ist_iso(inc.last_activity_at),
                "created_at": format_ist_iso(inc.created_at),
            })

        return incident_list

    async def get_incident(self, incident_id: str, db: AsyncSession) -> Optional[Dict[str, Any]]:
        """Returns detailed incident info and all associated tickets."""
        res = await db.execute(select(IncidentModel).where(IncidentModel.id == incident_id))
        inc = res.scalars().first()
        if not inc:
            return None

        # Fetch linked tickets with tracking info
        t_res = await db.execute(
            select(TicketModel, ComplaintModel)
            .join(ComplaintModel, TicketModel.complaint_id == ComplaintModel.id)
            .where(TicketModel.incident_id == inc.id)
            .order_by(desc(TicketModel.created_at))
        )
        linked_tickets = []
        for t, c in t_res.all():
            linked_tickets.append({
                "id": str(t.id),
                "tracking_number": c.tracking_number,
                "issue_summary": t.issue_summary,
                "status": t.status,
                "priority": t.priority,
                "location_name": t.location_name,
                "created_at": format_ist_iso(t.created_at),
            })

        return {
            "id": str(inc.id),
            "incident_number": inc.incident_number,
            "title": inc.title,
            "description": inc.description,
            "department_id": inc.department_id,
            "severity": inc.severity,
            "status": inc.status,
            "location_name": inc.location_name,
            "latitude": inc.latitude,
            "longitude": inc.longitude,
            "complaint_count": len(linked_tickets) if linked_tickets else inc.complaint_count,
            "first_reported_at": format_ist_iso(inc.first_reported_at),
            "last_activity_at": format_ist_iso(inc.last_activity_at),
            "created_at": format_ist_iso(inc.created_at),
            "tickets": linked_tickets,
        }


incident_service = IncidentService()
