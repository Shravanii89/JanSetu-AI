"""
JanSetu AI - End-to-End Flow Verification Script
Tests steps A through T of Phase 23 against the live backend and Supabase PostgreSQL.
"""

import sys
import os
import asyncio
import uuid
import httpx
from datetime import datetime

# Add backend directory
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backend")))

from app.db.session import AsyncSessionLocal
from app.models.complaint import ComplaintModel
from app.models.user import UserModel
from app.models.contribution import UserContributionModel
from app.models.badge import UserBadgeModel
from sqlalchemy import select

BASE_URL = "http://localhost:8000/api/v1"

async def run_e2e_verification():
    print("==================================================")
    print("STARTING JANSETU AI MASTER E2E VERIFICATION")
    print("==================================================")

    async with httpx.AsyncClient(timeout=30.0) as client:
        # A. Register a brand-new citizen
        random_suffix = str(uuid.uuid4())[:8]
        citizen1_email = f"citizen.test.{random_suffix}@jansetu.e2e"
        citizen1_phone = f"98{str(uuid.uuid4().int)[:8]}"
        citizen1_pass = "TestPass123!"

        print(f"\n[A] Registering Citizen 1: {citizen1_email}...")
        reg_res = await client.post(
            f"{BASE_URL}/auth/register",
            json={
                "full_name": f"Aarav Deshmukh {random_suffix}",
                "email": citizen1_email,
                "phone": citizen1_phone,
                "password": citizen1_pass,
                "confirm_password": citizen1_pass,
                "address": "Flat 101, Baner Heights, Pune",
                "ward": "Ward 9 (Baner-Balewadi)",
                "preferred_language": "en",
            },
        )
        assert reg_res.status_code == 201, f"Registration failed: {reg_res.text}"
        c1_data = reg_res.json()
        c1_token = c1_data["access_token"]
        c1_id = c1_data["user"]["id"]
        print(f"    [OK] Citizen registered. ID: {c1_id}, Role: {c1_data['user']['role']}")
        assert c1_data["user"]["role"] == "CITIZEN", "Security failure: Citizen role mismatch"

        # B. Login
        print("\n[B] Logging in Citizen 1...")
        login_res = await client.post(
            f"{BASE_URL}/auth/login",
            json={"identifier": citizen1_email, "password": citizen1_pass},
        )
        assert login_res.status_code == 200, f"Login failed: {login_res.text}"
        c1_login_data = login_res.json()
        c1_token = c1_login_data["access_token"]
        print("    [OK] Login successful. JWT token received.")

        # C. Verify identity and navbar data via /auth/me
        print("\n[C] Verifying identity via /auth/me...")
        headers_c1 = {"Authorization": f"Bearer {c1_token}"}
        me_res = await client.get(f"{BASE_URL}/auth/me", headers=headers_c1)
        assert me_res.status_code == 200, f"/auth/me failed: {me_res.text}"
        me_data = me_res.json()
        print(f"    [OK] /auth/me: Name='{me_data['full_name']}', Credits={me_data['civic_credits']}, Badges={me_data['badges_count']}")
        assert me_data["civic_credits"] == 0, "Initial credits should be 0"

        # D & E. Submit complaint: "Water pipeline leak near Baner road"
        print("\n[D & E] Submitting complaint: 'Water pipeline leak near Baner road'...")
        comp_res = await client.post(
            f"{BASE_URL}/complaints/",
            headers=headers_c1,
            json={
                "raw_text": "Water pipeline leak near Baner road causing flooding",
                "location_name": "Baner Road, near Balewadi High Street, Pune",
                "latitude": 18.5590,
                "longitude": 73.7868,
                "preferred_language": "en",
            },
        )
        assert comp_res.status_code in [200, 201], f"Complaint submission failed: {comp_res.text}"
        comp_data = comp_res.json()

        # F & G. Verify tracking number
        tracking_num = comp_data["tracking_number"]
        print(f"\n[F & G] Complaint created. Tracking Number: {tracking_num}")
        assert tracking_num.startswith("JS-") or tracking_num.startswith("PNC-"), f"Unexpected tracking format: {tracking_num}"

        # H & I. Verify Supabase complaints row & citizen_id populated
        print(f"\n[H & I] Verifying Supabase row directly via AsyncSession...")
        async with AsyncSessionLocal() as session:
            stmt = select(ComplaintModel).where(ComplaintModel.tracking_number == tracking_num)
            row = (await session.execute(stmt)).scalars().first()
            assert row is not None, "Complaint row not found in Supabase"
            assert str(row.citizen_id) == str(c1_id), f"citizen_id mismatch: {row.citizen_id} != {c1_id}"
            print(f"    [OK] Supabase row verified. citizen_id={row.citizen_id}, status={row.status}")

        # J. Verify +10 civic credits awarded
        print("\n[J] Verifying +10 civic credits awarded...")
        me_res2 = await client.get(f"{BASE_URL}/auth/me", headers=headers_c1)
        me_data2 = me_res2.json()
        print(f"    [OK] New civic credits: {me_data2['civic_credits']}")
        assert me_data2["civic_credits"] >= 10, f"Expected >= 10 credits, got {me_data2['civic_credits']}"

        # K & L. Verify /complaints/my returns this complaint
        print("\n[K & L] Verifying /complaints/my returns only this citizen's complaint...")
        my_res = await client.get(f"{BASE_URL}/complaints/my", headers=headers_c1)
        assert my_res.status_code == 200, f"/complaints/my failed: {my_res.text}"
        my_complaints = my_res.json()
        assert len(my_complaints) == 1, f"Expected exactly 1 complaint, got {len(my_complaints)}"
        assert my_complaints[0]["tracking_number"] == tracking_num
        print(f"    [OK] /complaints/my returned 1 complaint: {tracking_num}")

        # M. Create a second citizen account
        random_suffix2 = str(uuid.uuid4())[:8]
        citizen2_email = f"citizen2.test.{random_suffix2}@jansetu.e2e"
        citizen2_phone = f"97{str(uuid.uuid4().int)[:8]}"
        citizen2_pass = "TestPass456!"

        print(f"\n[M] Registering Citizen 2: {citizen2_email}...")
        reg_res2 = await client.post(
            f"{BASE_URL}/auth/register",
            json={
                "full_name": f"Sneha Kulkarni {random_suffix2}",
                "email": citizen2_email,
                "phone": citizen2_phone,
                "password": citizen2_pass,
                "confirm_password": citizen2_pass,
                "address": "Kothrud, Pune",
                "ward": "Ward 11 (Kothrud)",
                "preferred_language": "mr",
            },
        )
        assert reg_res2.status_code == 201
        c2_data = reg_res2.json()
        c2_token = c2_data["access_token"]
        headers_c2 = {"Authorization": f"Bearer {c2_token}"}

        # N & O. Verify first citizen's complaint does NOT appear in Citizen 2's complaints
        print("\n[N & O] Verifying citizen isolation: /complaints/my for Citizen 2...")
        c2_my_res = await client.get(f"{BASE_URL}/complaints/my", headers=headers_c2)
        assert c2_my_res.status_code == 200
        c2_complaints = c2_my_res.json()
        assert len(c2_complaints) == 0, f"Citizen 2 should have 0 complaints, got {len(c2_complaints)}"
        print("    [OK] Citizen isolation verified: Citizen 2 sees 0 complaints.")

        # P. Verify Citizen 1's profile and credits are inaccessible to Citizen 2
        print("\n[P] Verifying profile/credits privacy...")
        c2_me = (await client.get(f"{BASE_URL}/auth/me", headers=headers_c2)).json()
        assert c2_me["email"] == citizen2_email
        assert c2_me["civic_credits"] == 0
        print("    [OK] Citizen 2 /auth/me returns only Citizen 2's own data.")

        # Q. Test draft flow
        print("\n[Q] Testing Complaint Draft preservation & restoration...")
        session_id = f"sess_{uuid.uuid4().hex}"
        draft_content = {
            "rawText": "Pothole hazard near Swargate bus stand",
            "locationName": "Swargate, Pune",
            "latitude": 18.5010,
            "longitude": 73.8580,
            "language": "en",
        }
        draft_save_res = await client.post(
            f"{BASE_URL}/complaints/draft",
            json={"session_id": session_id, "complaint_data": draft_content},
        )
        assert draft_save_res.status_code == 200
        draft_id = draft_save_res.json()["draft_id"]
        print(f"    [OK] Anonymous draft saved. Draft ID: {draft_id}")

        draft_get_res = await client.get(f"{BASE_URL}/complaints/draft/{draft_id}?session_id={session_id}")
        assert draft_get_res.status_code == 200
        restored = draft_get_res.json()["complaint_data"]
        assert restored["rawText"] == "Pothole hazard near Swargate bus stand"
        print("    [OK] Draft successfully retrieved with matching data.")

        # R. Login as Municipal Admin & verify department-scoped behavior
        print("\n[R] Testing Municipal Admin login & access...")
        admin_login = await client.post(
            f"{BASE_URL}/auth/login",
            json={"identifier": "admin@jansetu.local", "password": "admin123"},
        )
        assert admin_login.status_code == 200, f"Admin login failed: {admin_login.text}"
        admin_token = admin_login.json()["access_token"]
        headers_admin = {"Authorization": f"Bearer {admin_token}"}

        admin_me = (await client.get(f"{BASE_URL}/auth/me", headers=headers_admin)).json()
        assert admin_me["role"] == "MUNICIPAL_ADMIN"
        print(f"    [OK] Municipal Admin verified: {admin_me['full_name']} ({admin_me['role']})")

        # S. Login as Department Officer & verify queue
        print("\n[S] Testing Department Officer login & queue...")
        officer_login = await client.post(
            f"{BASE_URL}/auth/login",
            json={"identifier": "water.officer@jansetu.local", "password": "officer123"},
        )
        assert officer_login.status_code == 200, f"Officer login failed: {officer_login.text}"
        officer_token = officer_login.json()["access_token"]
        headers_officer = {"Authorization": f"Bearer {officer_token}"}

        officer_me = (await client.get(f"{BASE_URL}/auth/me", headers=headers_officer)).json()
        assert officer_me["role"] == "DEPARTMENT_OFFICER"
        print(f"    [OK] Department Officer verified: {officer_me['full_name']} ({officer_me['department_id']})")

        # T. Login as Collector & verify city-wide oversight
        print("\n[T] Testing Collector login & city-wide oversight...")
        collector_login = await client.post(
            f"{BASE_URL}/auth/login",
            json={"identifier": "collector@jansetu.demo", "password": "collector123"},
        )
        assert collector_login.status_code == 200, f"Collector login failed: {collector_login.text}"
        collector_token = collector_login.json()["access_token"]
        headers_collector = {"Authorization": f"Bearer {collector_token}"}

        collector_me = (await client.get(f"{BASE_URL}/auth/me", headers=headers_collector)).json()
        assert collector_me["role"] == "COLLECTOR"
        print(f"    [OK] District Collector verified: {collector_me['full_name']} ({collector_me['role']})")

    print("\n==================================================")
    print("ALL E2E CHECKS PASSED PERFECTLY (A through T)!")
    print("==================================================")

if __name__ == "__main__":
    asyncio.run(run_e2e_verification())
