"""
JanSetu AI - Departmental Personnel Assignment Integration Tests
Validates assignment, status workflow, reassignment, RBAC department isolation,
and citizen privacy protection.
"""

import pytest
from httpx import AsyncClient, ASGITransport
from sqlalchemy import select
from app.main import app
from app.db.session import AsyncSessionLocal
from app.models.user import UserModel
from app.models.ticket import TicketModel
from app.models.complaint import ComplaintModel
from app.models.assignment import AssignmentModel
from app.core.security import create_access_token


@pytest.fixture
def anyio_backend():
    return "asyncio"


@pytest.mark.anyio
async def test_personnel_assignment_flow():
    async with AsyncSessionLocal() as db:
        road_officer_res = await db.execute(select(UserModel).where(UserModel.email == "road.officer@jansetu.local"))
        road_officer = road_officer_res.scalars().first()

        water_officer_res = await db.execute(select(UserModel).where(UserModel.email == "water.officer@jansetu.local"))
        water_officer = water_officer_res.scalars().first()

        road_personnel_res = await db.execute(
            select(UserModel).where(
                UserModel.department_id == "ROAD",
                UserModel.email == "rahul.patil@pmc.local"
            )
        )
        rahul_patil = road_personnel_res.scalars().first()

        second_road_personnel_res = await db.execute(
            select(UserModel).where(
                UserModel.department_id == "ROAD",
                UserModel.email == "amit.deshmukh@pmc.local"
            )
        )
        amit_deshmukh = second_road_personnel_res.scalars().first()

        water_personnel_res = await db.execute(
            select(UserModel).where(
                UserModel.department_id == "WATER_SUPPLY",
                UserModel.email == "rajesh.pawar@pmc.local"
            )
        )
        rajesh_pawar = water_personnel_res.scalars().first()

        ticket_res = await db.execute(
            select(TicketModel, ComplaintModel)
            .join(ComplaintModel, TicketModel.complaint_id == ComplaintModel.id)
            .where(TicketModel.department_id == "ROAD")
            .order_by(TicketModel.created_at.desc())
        )
        row = ticket_res.first()
        road_ticket, road_complaint = row

    assert road_officer is not None, "Road officer must exist"
    assert water_officer is not None, "Water officer must exist"
    assert rahul_patil is not None, "Rahul Patil must exist"
    assert amit_deshmukh is not None, "Amit Deshmukh must exist"
    assert rajesh_pawar is not None, "Rajesh Pawar must exist"
    assert road_ticket is not None, "Road ticket must exist"

    road_token = create_access_token({"sub": str(road_officer.id), "role": road_officer.role, "department_id": road_officer.department_id})
    water_token = create_access_token({"sub": str(water_officer.id), "role": water_officer.role, "department_id": water_officer.department_id})

    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        # TEST 1: Department personnel query - allowed for road officer querying ROAD
        res = await client.get(
            "/api/v1/departments/ROAD/personnel",
            headers={"Authorization": f"Bearer {road_token}"}
        )
        assert res.status_code == 200
        personnel_list = res.json()
        assert len(personnel_list) >= 2
        names = [p["full_name"] for p in personnel_list]
        assert "Rahul Patil" in names

        # TEST 2: Department Isolation - road officer cannot query WATER_SUPPLY personnel
        res = await client.get(
            "/api/v1/departments/WATER_SUPPLY/personnel",
            headers={"Authorization": f"Bearer {road_token}"}
        )
        assert res.status_code == 403

        # TEST 3: Department Isolation - water officer cannot assign to ROAD ticket
        res = await client.post(
            f"/api/v1/tickets/{road_ticket.id}/assign",
            json={"personnel_id": str(rahul_patil.id), "assignment_note": "Cross-dept test"},
            headers={"Authorization": f"Bearer {water_token}"}
        )
        assert res.status_code == 403

        # TEST 4: Invalid Assignment - cannot assign water personnel to road ticket
        res = await client.post(
            f"/api/v1/tickets/{road_ticket.id}/assign",
            json={"personnel_id": str(rajesh_pawar.id), "assignment_note": "Mismatch test"},
            headers={"Authorization": f"Bearer {road_token}"}
        )
        assert res.status_code == 400

        # TEST 5: Successful Personnel Assignment
        res = await client.post(
            f"/api/v1/tickets/{road_ticket.id}/assign",
            json={"personnel_id": str(rahul_patil.id), "assignment_note": "Urgent pothole asphalt repair required."},
            headers={"Authorization": f"Bearer {road_token}"}
        )
        assert res.status_code == 200
        assign_data = res.json()
        assert assign_data["current_assignment"] is not None
        assert assign_data["current_assignment"]["personnel"]["full_name"] == "Rahul Patil"
        assert assign_data["current_assignment"]["assignment_status"] == "ASSIGNED"
        assert assign_data["current_assignment"]["assignment_note"] == "Urgent pothole asphalt repair required."

        # TEST 6: Get Assignment details
        res = await client.get(
            f"/api/v1/tickets/{road_ticket.id}/assignment",
            headers={"Authorization": f"Bearer {road_token}"}
        )
        assert res.status_code == 200
        fetched_assignment = res.json()
        assert fetched_assignment["current_assignment"]["personnel"]["employee_id"] == "PMC-RD-2041"

        # TEST 7: Transition Assignment to Work In Progress
        res = await client.patch(
            f"/api/v1/tickets/{road_ticket.id}/assignment/status",
            json={"status": "IN_PROGRESS", "note": "Crew arrived on site with asphalt roller."},
            headers={"Authorization": f"Bearer {road_token}"}
        )
        assert res.status_code == 200
        progress_data = res.json()
        assert progress_data["current_assignment"]["assignment_status"] == "IN_PROGRESS"
        assert progress_data["current_assignment"]["started_at"] is not None

        # TEST 8: Reassignment to another departmental personnel
        res = await client.post(
            f"/api/v1/tickets/{road_ticket.id}/reassign",
            json={
                "personnel_id": str(amit_deshmukh.id),
                "reassignment_reason": "Specialized heavy compaction equipment required for site",
                "assignment_note": "Take over from Rahul for deep trench paving",
            },
            headers={"Authorization": f"Bearer {road_token}"}
        )
        assert res.status_code == 200
        reassign_data = res.json()
        assert reassign_data["current_assignment"]["personnel"]["full_name"] == "Amit Deshmukh"
        assert reassign_data["current_assignment"]["assignment_status"] == "ASSIGNED"
        # History contains previous assignment
        assert len(reassign_data["history"]) >= 1
        assert reassign_data["history"][0]["personnel"]["full_name"] == "Rahul Patil"
        assert reassign_data["history"][0]["assignment_status"] == "REASSIGNED"
        assert reassign_data["history"][0]["reassignment_reason"] == "Specialized heavy compaction equipment required for site"

        # TEST 9: Citizen Tracking Privacy Protection
        # Citizen calls /api/v1/complaints/{tracking_number} without auth
        res = await client.get(f"/api/v1/complaints/{road_complaint.tracking_number}")
        assert res.status_code == 200
        citizen_view = res.json()
        assert "assigned_personnel" in citizen_view
        assigned_p = citizen_view["assigned_personnel"]
        assert assigned_p is not None
        assert assigned_p["name"] == "Amit Deshmukh"
        assert assigned_p["designation"] == "Asphalt & Paving Supervisor"
        assert assigned_p["department"] == "Road Department"
        assert assigned_p["official_contact"] == "+91 98220 28945"
        # Verify internal sensitive details are NOT exposed to citizen
        assert "employee_id" not in assigned_p
        assert "internal_notes" not in assigned_p
        assert "notes" not in assigned_p
