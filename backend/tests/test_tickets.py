"""
JanSetu AI - Operational Ticket & Department Isolation Tests
"""

import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_department_isolation_in_tickets_list():
    # 1. Login as Water Officer
    login_water = client.post(
        "/api/v1/auth/login",
        json={"email_or_employee_id": "water.officer@jansetu.local", "password": "officer123"},
    )
    water_token = login_water.json()["access_token"]

    # 2. Query tickets
    res = client.get(
        "/api/v1/tickets/",
        headers={"Authorization": f"Bearer {water_token}"},
    )
    assert res.status_code == 200
    tickets = res.json()
    assert len(tickets) > 0
    # Every ticket returned MUST belong to WATER_SUPPLY
    for t in tickets:
        assert t["department_id"] == "WATER_SUPPLY"


def test_admin_cross_department_visibility():
    # 1. Login as Municipal Admin
    login_admin = client.post(
        "/api/v1/auth/login",
        json={"email_or_employee_id": "admin@jansetu.local", "password": "admin123"},
    )
    admin_token = login_admin.json()["access_token"]

    # 2. Query tickets across all departments
    res = client.get(
        "/api/v1/tickets/",
        headers={"Authorization": f"Bearer {admin_token}"},
    )
    assert res.status_code == 200
    tickets = res.json()
    assert len(tickets) > 0
    # Admin can see multiple departments
    depts = set(t["department_id"] for t in tickets)
    assert len(depts) > 1


def test_ticket_status_transitions():
    # 1. Login as Admin
    login_admin = client.post(
        "/api/v1/auth/login",
        json={"email_or_employee_id": "admin@jansetu.local", "password": "admin123"},
    )
    token = login_admin.json()["access_token"]

    # 2. Get a ticket
    tickets = client.get("/api/v1/tickets/", headers={"Authorization": f"Bearer {token}"}).json()
    target_ticket = next(t for t in tickets if t["status"] in ["NEW", "ASSIGNED", "READY_FOR_ROUTING"])
    ticket_id = target_ticket["id"]

    # 3. Transition to IN_PROGRESS
    trans_res = client.patch(
        f"/api/v1/tickets/{ticket_id}/status",
        headers={"Authorization": f"Bearer {token}"},
        json={"status": "IN_PROGRESS"},
    )
    assert trans_res.status_code == 200
    assert trans_res.json()["status"] == "IN_PROGRESS"

    # 4. Transition to RESOLVED with notes
    res_res = client.patch(
        f"/api/v1/tickets/{ticket_id}/status",
        headers={"Authorization": f"Bearer {token}"},
        json={"status": "RESOLVED", "resolution_notes": "Repairs successfully completed."},
    )
    assert res_res.status_code == 200
    assert res_res.json()["status"] == "RESOLVED"
