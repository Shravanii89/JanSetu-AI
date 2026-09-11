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


from sqlalchemy import select, func, and_, case

class DepartmentService:
    async def list_departments(self, db: AsyncSession) -> List[Dict[str, Any]]:
        """Returns all 8 controlled departments along with live operational statistics."""
        # 1. Query active departments
        res = await db.execute(select(DepartmentModel).where(DepartmentModel.is_active == True))
        depts = res.scalars().all()

        # 2. Batch aggregate ticket counts grouped by department_id
        ticket_agg_res = await db.execute(
            select(
                TicketModel.department_id,
                func.count(TicketModel.id).label("total"),
                func.count(case((TicketModel.status.notin_(["RESOLVED", "CLOSED"]), 1))).label("open"),
                func.count(case((and_(TicketModel.priority == "P0", TicketModel.status.notin_(["RESOLVED", "CLOSED"])), 1))).label("p0"),
                func.count(case((TicketModel.status.in_(["RESOLVED", "CLOSED"]), 1))).label("resolved"),
            ).group_by(TicketModel.department_id)
        )
        ticket_map = {
            r[0]: {"total": r[1], "open": r[2], "p0": r[3], "resolved": r[4]}
            for r in ticket_agg_res.all()
        }

        # 3. Batch aggregate breached SLA counts grouped by department_id
        sla_agg_res = await db.execute(
            select(
                TicketModel.department_id,
                func.count(SLAModel.id)
            )
            .join(TicketModel, SLAModel.ticket_id == TicketModel.id)
            .where(SLAModel.status == "BREACHED")
            .group_by(TicketModel.department_id)
        )
        sla_map = {r[0]: r[1] for r in sla_agg_res.all()}

        dept_list = []
        for d in depts:
            stats = ticket_map.get(d.id, {"total": 0, "open": 0, "p0": 0, "resolved": 0})
            total_tickets = stats["total"]
            open_tickets = stats["open"]
            p0_count = stats["p0"]
            resolved_count = stats["resolved"]
            breached_count = sla_map.get(d.id, 0)

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
