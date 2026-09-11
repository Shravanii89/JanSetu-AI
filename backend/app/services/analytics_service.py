"""
JanSetu AI - Analytics & Executive Intelligence Service
Calculates aggregated city-wide KPIs, department workload distributions, SLA metrics, and geographic hotspots.
"""

from typing import Dict, Any, List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_

from app.models.ticket import TicketModel
from app.models.complaint import ComplaintModel
from app.models.sla import SLAModel
from app.models.incident import IncidentModel
from app.models.department import DepartmentModel
from app.rules.departments import CONTROLLED_DEPARTMENTS


class AnalyticsService:
    async def get_overview(self, db: AsyncSession) -> Dict[str, Any]:
        """Calculates executive dashboard KPIs."""
        # Total complaints
        total_res = await db.execute(select(func.count(ComplaintModel.id)))
        total_complaints = total_res.scalar() or 0

        # Open complaints
        open_res = await db.execute(
            select(func.count(TicketModel.id)).where(
                TicketModel.status.notin_(["RESOLVED", "CLOSED"])
            )
        )
        open_complaints = open_res.scalar() or 0

        # In progress
        in_prog_res = await db.execute(
            select(func.count(TicketModel.id)).where(TicketModel.status == "IN_PROGRESS")
        )
        in_progress = in_prog_res.scalar() or 0

        # Resolved
        resolved_res = await db.execute(
            select(func.count(TicketModel.id)).where(TicketModel.status.in_(["RESOLVED", "CLOSED"]))
        )
        resolved = resolved_res.scalar() or 0

        # Critical P0
        p0_res = await db.execute(
            select(func.count(TicketModel.id)).where(
                and_(
                    TicketModel.priority == "P0",
                    TicketModel.status.notin_(["RESOLVED", "CLOSED"])
                )
            )
        )
        critical_p0 = p0_res.scalar() or 0

        # SLA metrics
        breached_res = await db.execute(
            select(func.count(SLAModel.id)).where(SLAModel.status == "BREACHED")
        )
        sla_breached = breached_res.scalar() or 0

        at_risk_res = await db.execute(
            select(func.count(SLAModel.id)).where(SLAModel.status == "AT_RISK")
        )
        sla_at_risk = at_risk_res.scalar() or 0

        # Active incidents
        inc_res = await db.execute(
            select(func.count(IncidentModel.id)).where(IncidentModel.status.in_(["DETECTED", "VERIFIED", "RESOLVING"]))
        )
        active_incidents = inc_res.scalar() or 0

        resolution_rate = round((resolved / total_complaints * 100), 1) if total_complaints > 0 else 100.0

        return {
            "total_complaints": total_complaints,
            "open_complaints": open_complaints,
            "in_progress": in_progress,
            "resolved": resolved,
            "critical_p0_count": critical_p0,
            "sla_at_risk_count": sla_at_risk,
            "sla_breached_count": sla_breached,
            "active_incidents": active_incidents,
            "resolution_rate": resolution_rate,
        }

    async def get_department_distribution(self, db: AsyncSession) -> List[Dict[str, Any]]:
        """Aggregates ticket count per department."""
        query = (
            select(
                TicketModel.department_id,
                func.count(TicketModel.id).label("count")
            )
            .group_by(TicketModel.department_id)
        )
        res = await db.execute(query)
        rows = res.all()

        dept_map = {row[0]: row[1] for row in rows}
        results = []
        for d in CONTROLLED_DEPARTMENTS:
            dept_id = d["id"]
            results.append({
                "name": d["name"],
                "department_id": dept_id,
                "count": dept_map.get(dept_id, 0),
            })
        return results

    async def get_priority_distribution(self, db: AsyncSession) -> List[Dict[str, Any]]:
        """Aggregates ticket count per priority tier."""
        query = (
            select(
                TicketModel.priority,
                func.count(TicketModel.id).label("count")
            )
            .group_by(TicketModel.priority)
        )
        res = await db.execute(query)
        rows = res.all()
        p_map = {row[0]: row[1] for row in rows}

        return [
            {"priority": "P0 Critical", "level": "P0", "count": p_map.get("P0", 0), "color": "#ef4444"},
            {"priority": "P1 High", "level": "P1", "count": p_map.get("P1", 0), "color": "#f97316"},
            {"priority": "P2 Medium", "level": "P2", "count": p_map.get("P2", 0), "color": "#eab308"},
            {"priority": "P3 Low", "level": "P3", "count": p_map.get("P3", 0), "color": "#3b82f6"},
        ]

    async def get_status_distribution(self, db: AsyncSession) -> List[Dict[str, Any]]:
        """Aggregates ticket count per lifecycle state."""
        query = (
            select(
                TicketModel.status,
                func.count(TicketModel.id).label("count")
            )
            .group_by(TicketModel.status)
        )
        res = await db.execute(query)
        rows = res.all()
        return [{"status": row[0], "count": row[1]} for row in rows]

    async def get_hotspots(self, db: AsyncSession) -> List[Dict[str, Any]]:
        """Returns geographic hotspots for map visualization across Pune wards."""
        query = (
            select(
                TicketModel.location_name,
                TicketModel.department_id,
                TicketModel.priority,
                TicketModel.latitude,
                TicketModel.longitude,
                func.count(TicketModel.id).label("count")
            )
            .where(TicketModel.location_name.isnot(None))
            .group_by(
                TicketModel.location_name,
                TicketModel.department_id,
                TicketModel.priority,
                TicketModel.latitude,
                TicketModel.longitude,
            )
        )
        res = await db.execute(query)
        rows = res.all()

        hotspots = []
        for loc, dept, prio, lat, lng, cnt in rows:
            hotspots.append({
                "name": loc or "Pune City",
                "department_id": dept,
                "priority": prio,
                "latitude": lat or 18.5204,
                "longitude": lng or 73.8567,
                "count": cnt,
            })
        return hotspots


analytics_service = AnalyticsService()
