"""
JanSetu AI - Departmental Portals & 8-Department Demo Accounts Verification Script
"""

import sys
import os
import asyncio
import httpx

# Add backend directory
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backend")))

from app.db.session import AsyncSessionLocal
from app.models.user import UserModel
from app.models.ticket import TicketModel
from sqlalchemy import select

BASE_URL = "http://localhost:8000/api/v1"

ALL_8_DEPARTMENTS = [
    {
        "dept_id": "WATER_SUPPLY",
        "dept_name": "Water Supply",
        "email": "water.officer@jansetu.local",
        "password": "officer123",
    },
    {
        "dept_id": "ELECTRICITY",
        "dept_name": "Electricity",
        "email": "electricity.officer@jansetu.local",
        "password": "officer123",
    },
    {
        "dept_id": "PUBLIC_HEALTH",
        "dept_name": "Public Health",
        "email": "health.officer@jansetu.local",
        "password": "officer123",
    },
    {
        "dept_id": "WASTE_MANAGEMENT",
        "dept_name": "Waste Management",
        "email": "waste.officer@jansetu.local",
        "password": "officer123",
    },
    {
        "dept_id": "PUBLIC_PROPERTY_MANAGEMENT",
        "dept_name": "Public Property Management",
        "email": "property.officer@jansetu.local",
        "password": "officer123",
    },
    {
        "dept_id": "GARDEN",
        "dept_name": "Garden",
        "email": "garden.officer@jansetu.local",
        "password": "officer123",
    },
    {
        "dept_id": "ROAD",
        "dept_name": "Road",
        "email": "road.officer@jansetu.local",
        "password": "officer123",
    },
    {
        "dept_id": "ENCROACHMENT",
        "dept_name": "Encroachment",
        "email": "encroachment.officer@jansetu.local",
        "password": "officer123",
    },
]

async def verify_department_portals():
    print("==================================================")
    print("JANSETU AI: VERIFYING 8-DEPARTMENT DEMO & RBAC")
    print("==================================================")

    # 1. Verify existence in Database directly
    print("\n--- STEP 1: Direct DB Check for 8 Department Accounts ---")
    async with AsyncSessionLocal() as session:
        for d in ALL_8_DEPARTMENTS:
            stmt = select(UserModel).where(UserModel.email == d["email"])
            user = (await session.execute(stmt)).scalars().first()
            assert user is not None, f"Database missing user: {d['email']}"
            assert user.role == "DEPARTMENT_OFFICER", f"Role mismatch for {d['email']}: {user.role}"
            assert user.department_id == d["dept_id"], f"Dept mismatch for {d['email']}: {user.department_id} != {d['dept_id']}"
            print(f"  [DB OK] {d['dept_name']:<28} | {d['email']:<35} | Dept: {user.department_id}")

    # 2. Authenticate all 8 departments via HTTP API
    print("\n--- STEP 2: Authentication & Ticket Isolation for all 8 Departments ---")
    async with httpx.AsyncClient(timeout=30.0) as client:
        for d in ALL_8_DEPARTMENTS:
            login_res = await client.post(
                f"{BASE_URL}/auth/login",
                json={"identifier": d["email"], "password": d["password"]},
            )
            assert login_res.status_code == 200, f"Login failed for {d['email']}: {login_res.text}"
            res_json = login_res.json()
            token = res_json["access_token"]
            user = res_json["user"]

            assert user["role"] == "DEPARTMENT_OFFICER", f"User role was {user['role']}"
            assert user["department_id"] == d["dept_id"], f"Dept ID was {user['department_id']}"

            # Query department ticket queue
            headers = {"Authorization": f"Bearer {token}"}
            tickets_res = await client.get(f"{BASE_URL}/tickets/", headers=headers)
            assert tickets_res.status_code == 200, f"Tickets request failed for {d['email']}"
            tickets = tickets_res.json()

            # Verify every returned ticket belongs strictly to this officer's department
            for ticket in tickets:
                assert ticket["department_id"] == d["dept_id"], (
                    f"Security violation! Officer of {d['dept_id']} saw ticket from {ticket['department_id']}"
                )

            print(
                f"  [AUTH OK] {d['dept_name']:<26} | Logged In | Dept: {user['department_id']:<26} | Tickets in queue: {len(tickets)}"
            )

        # 3. Security test: Attempt cross-department access via query parameter
        print("\n--- STEP 3: Cross-Department Isolation Security Test ---")
        water_officer = ALL_8_DEPARTMENTS[0]
        login_res = await client.post(
            f"{BASE_URL}/auth/login",
            json={"identifier": water_officer["email"], "password": water_officer["password"]},
        )
        water_token = login_res.json()["access_token"]
        headers_water = {"Authorization": f"Bearer {water_token}"}

        # Attempt to tamper and request ROAD department tickets while authenticated as WATER_SUPPLY officer
        tamper_res = await client.get(f"{BASE_URL}/tickets/?department_id=ROAD", headers=headers_water)
        assert tamper_res.status_code == 200
        tampered_tickets = tamper_res.json()
        # Even when querying department_id=ROAD, the backend MUST restrict results to WATER_SUPPLY or empty
        for t in tampered_tickets:
            assert t["department_id"] == "WATER_SUPPLY", (
                f"TAMPER LEAK! Water officer received ticket from {t['department_id']}"
            )
        print("  [SEC OK] Department officer cannot override department isolation via query parameter tampering.")

        # 4. Verify Municipal Admin login
        print("\n--- STEP 4: Municipal Admin Login Verification ---")
        admin_res = await client.post(
            f"{BASE_URL}/auth/login",
            json={"identifier": "admin@jansetu.local", "password": "admin123"},
        )
        assert admin_res.status_code == 200
        admin_data = admin_res.json()["user"]
        assert admin_data["role"] == "MUNICIPAL_ADMIN"
        print(f"  [ADMIN OK] {admin_data['email']} -> Role: {admin_data['role']}")

        # 5. Verify Collector login
        print("\n--- STEP 5: Collector Login Verification ---")
        collector_res = await client.post(
            f"{BASE_URL}/auth/login",
            json={"identifier": "collector@jansetu.demo", "password": "collector123"},
        )
        assert collector_res.status_code == 200
        collector_data = collector_res.json()["user"]
        assert collector_data["role"] == "COLLECTOR"
        print(f"  [COLLECTOR OK] {collector_data['email']} -> Role: {collector_data['role']}")

        # 6. Verify Citizen login
        print("\n--- STEP 6: Citizen Login Verification ---")
        citizen_res = await client.post(
            f"{BASE_URL}/auth/login",
            json={"identifier": "citizen@jansetu.demo", "password": "citizen123"},
        )
        assert citizen_res.status_code == 200
        citizen_data = citizen_res.json()["user"]
        assert citizen_data["role"] == "CITIZEN"
        print(f"  [CITIZEN OK] {citizen_data['email']} -> Role: {citizen_data['role']}")

    print("\n==================================================")
    print("ALL DEPARTMENT PORTALS & SECURITY CHECKS PASSED!")
    print("==================================================")

if __name__ == "__main__":
    asyncio.run(verify_department_portals())
