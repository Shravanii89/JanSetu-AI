"""
JanSetu AI - Department Domain Service
Provides controlled taxonomy retrieval and operational workload statistics.
"""

from typing import List, Dict, Any, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_

from app.models.department import DepartmentModel
from app.models.ticket import TicketModel
from app.models.sla import SLAModel
from app.rules.departments import CONTROLLED_DEPARTMENTS


class DepartmentService:
    async def list_departments(self, db: AsyncSession) -> List[Dict[str, Any]]:
        """Returns all 8 controlled departments along with live operational statistics."""
        # Query departments
        res = await db.execute(select(DepartmentModel).where(DepartmentModel.is_active == True))
        depts = res.scalars().all()

        dept_list = []
        for d in depts:
            # Aggregate stats per department
            total_res = await db.execute(
                select(func.count(TicketModel.id)).where(TicketModel.department_id == d.id)
            )
            total_tickets = total_res.scalar() or 0

            open_res = await db.execute(
                select(func.count(TicketModel.id)).where(
                    and_(
                        TicketModel.department_id == d.id,
                        TicketModel.status.notin_(["RESOLVED", "CLOSED"])
                    )
                )
            )
            open_tickets = open_res.scalar() or 0

            p0_res = await db.execute(
                select(func.count(TicketModel.id)).where(
                    and_(
                        TicketModel.department_id == d.id,
                        TicketModel.priority == "P0",
                        TicketModel.status.notin_(["RESOLVED", "CLOSED"])
                    )
                )
            )
            p0_count = p0_res.scalar() or 0

            resolved_res = await db.execute(
                select(func.count(TicketModel.id)).where(
                    and_(
                        TicketModel.department_id == d.id,
                        TicketModel.status.in_(["RESOLVED", "CLOSED"])
                    )
                )
            )
            resolved_count = resolved_res.scalar() or 0

            sla_breached_res = await db.execute(
                select(func.count(SLAModel.id))
                .join(TicketModel, SLAModel.ticket_id == TicketModel.id)
                .where(
                    and_(
                        TicketModel.department_id == d.id,
                        SLAModel.status == "BREACHED"
                    )
                )
            )
            breached_count = sla_breached_res.scalar() or 0

            resolution_rate = (resolved_count / total_tickets * 100) if total_tickets > 0 else 100.0

            dept_list.append({
                "id": d.id,
                "name": d.name,
                "description": d.description,
                "contact_email": d.contact_email,
                "total_tickets": total_tickets,
                "open_tickets": open_tickets,
                "critical_p0_count": p0_count,
                "resolved_count": resolved_count,
                "sla_breached_count": breached_count,
                "resolution_rate": round(resolution_rate, 1),
            })

        return dept_list

    async def get_department(self, department_id: str, db: AsyncSession) -> Optional[Dict[str, Any]]:
        """Returns single department details with operational summary."""
        res = await db.execute(select(DepartmentModel).where(DepartmentModel.id == department_id))
        d = res.scalars().first()
        if not d:
            return None

        total_res = await db.execute(
            select(func.count(TicketModel.id)).where(TicketModel.department_id == d.id)
        )
        total_tickets = total_res.scalar() or 0

        open_res = await db.execute(
            select(func.count(TicketModel.id)).where(
                and_(
                    TicketModel.department_id == d.id,
                    TicketModel.status.notin_(["RESOLVED", "CLOSED"])
                )
            )
        )
        open_tickets = open_res.scalar() or 0

        p0_res = await db.execute(
            select(func.count(TicketModel.id)).where(
                and_(
                    TicketModel.department_id == d.id,
                    TicketModel.priority == "P0",
                    TicketModel.status.notin_(["RESOLVED", "CLOSED"])
                )
            )
        )
        p0_count = p0_res.scalar() or 0

        resolved_res = await db.execute(
            select(func.count(TicketModel.id)).where(
                and_(
                    TicketModel.department_id == d.id,
                    TicketModel.status.in_(["RESOLVED", "CLOSED"])
                )
            )
        )
        resolved_count = resolved_res.scalar() or 0

        return {
            "id": d.id,
            "name": d.name,
            "description": d.description,
            "contact_email": d.contact_email,
            "total_tickets": total_tickets,
            "open_tickets": open_tickets,
            "critical_p0_count": p0_count,
            "resolved_count": resolved_count,
        }


department_service = DepartmentService()
