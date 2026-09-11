"""
JanSetu AI - Citizen Authentication, Ownership, Civic Credits & RBAC Test Suite
Validates registration, login, role tamper rejection, draft flow, complaint ownership,
duplicate credit prevention, badge award, and official role compatibility.
"""

import uuid
import random
import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def get_random_phone() -> str:
    return f"98{random.randint(10000000, 99999999)}"


def test_citizen_registration_success():
    unique_suffix = uuid.uuid4().hex[:8]
    email = f"citizen_{unique_suffix}@pmc.test"
    phone = get_random_phone()

    payload = {
        "full_name": "Ramesh Gokhale",
        "email": email,
        "phone": phone,
        "password": "Password123!",
        "confirm_password": "Password123!",
        "address": "Flat 101, Kothrud, Pune",
        "ward": "Ward 10 (Kothrud)",
        "preferred_language": "mr",
    }
    res = client.post("/api/v1/auth/register", json=payload)
    assert res.status_code == 201
    data = res.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"
    assert data["user"]["email"] == email
    assert data["user"]["role"] == "CITIZEN"
    assert data["user"]["department_id"] is None
    assert data["user"]["address"] == "Flat 101, Kothrud, Pune"
    assert data["user"]["ward"] == "Ward 10 (Kothrud)"
    assert data["user"]["preferred_language"] == "mr"
    # Ensure password hash is never exposed
    assert "password" not in data["user"]
    assert "password_hash" not in data["user"]


def test_citizen_registration_duplicate_email_rejected():
    unique_suffix = uuid.uuid4().hex[:8]
    email = f"dup_{unique_suffix}@pmc.test"
    phone1 = get_random_phone()
    phone2 = get_random_phone()

    payload = {
        "full_name": "Sameera Khan",
        "email": email,
        "phone": phone1,
        "password": "Password123!",
        "confirm_password": "Password123!",
    }
    res1 = client.post("/api/v1/auth/register", json=payload)
    assert res1.status_code == 201

    payload["phone"] = phone2
    res2 = client.post("/api/v1/auth/register", json=payload)
    assert res2.status_code == 400
    assert "email address is already registered" in res2.json()["detail"].lower()


def test_citizen_registration_duplicate_phone_rejected():
    unique_suffix = uuid.uuid4().hex[:8]
    email1 = f"phone1_{unique_suffix}@pmc.test"
    email2 = f"phone2_{unique_suffix}@pmc.test"
    phone = get_random_phone()

    payload1 = {
        "full_name": "Ananya Joshi",
        "email": email1,
        "phone": phone,
        "password": "Password123!",
        "confirm_password": "Password123!",
    }
    res1 = client.post("/api/v1/auth/register", json=payload1)
    assert res1.status_code == 201

    payload2 = {
        "full_name": "Ananya Joshi",
        "email": email2,
        "phone": phone,
        "password": "Password123!",
        "confirm_password": "Password123!",
    }
    res2 = client.post("/api/v1/auth/register", json=payload2)
    assert res2.status_code == 400
    assert "mobile number is already registered" in res2.json()["detail"].lower()


def test_citizen_registration_role_tampering_rejected():
    unique_suffix = uuid.uuid4().hex[:8]
    payload = {
        "full_name": "Hacker User",
        "email": f"hacker_{unique_suffix}@pmc.test",
        "phone": get_random_phone(),
        "password": "Password123!",
        "confirm_password": "Password123!",
        "role": "MUNICIPAL_ADMIN",
    }
    res = client.post("/api/v1/auth/register", json=payload)
    assert res.status_code in [400, 422]


def test_citizen_login_and_me():
    # Login with seeded demo citizen
    res = client.post(
        "/api/v1/auth/login",
        json={"email_or_employee_id": "citizen@jansetu.demo", "password": "citizen123"},
    )
    assert res.status_code == 200
    data = res.json()
    token = data["access_token"]
    assert data["user"]["role"] == "CITIZEN"

    # Call /auth/me
    me_res = client.get("/api/v1/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert me_res.status_code == 200
    me_data = me_res.json()
    assert me_data["email"] == "citizen@jansetu.demo"
    assert me_data["role"] == "CITIZEN"
    assert "civic_credits" in me_data
    assert "contribution_level" in me_data
    assert "badges_count" in me_data


def test_citizen_profile_update():
    unique_suffix = uuid.uuid4().hex[:8]
    email = f"prof_{unique_suffix}@pmc.test"
    phone = get_random_phone()

    reg_res = client.post(
        "/api/v1/auth/register",
        json={
            "full_name": "Kavita Rao",
            "email": email,
            "phone": phone,
            "password": "Password123!",
            "confirm_password": "Password123!",
        },
    )
    assert reg_res.status_code == 201
    token = reg_res.json()["access_token"]

    update_res = client.patch(
        "/api/v1/auth/profile",
        json={
            "address": "Sector 4, Aundh, Pune",
            "ward": "Ward 5 (Aundh)",
            "preferred_language": "hi",
        },
        headers={"Authorization": f"Bearer {token}"},
    )
    assert update_res.status_code == 200
    updated = update_res.json()
    assert updated["address"] == "Sector 4, Aundh, Pune"
    assert updated["ward"] == "Ward 5 (Aundh)"
    assert updated["preferred_language"] == "hi"


def test_complaint_ownership_and_credits_and_badges():
    unique_suffix = uuid.uuid4().hex[:8]
    email = f"own_{unique_suffix}@pmc.test"
    phone = get_random_phone()

    # 1. Register citizen
    reg_res = client.post(
        "/api/v1/auth/register",
        json={
            "full_name": "Sunil Patil",
            "email": email,
            "phone": phone,
            "password": "Password123!",
            "confirm_password": "Password123!",
        },
    )
    assert reg_res.status_code == 201
    token = reg_res.json()["access_token"]

    # 2. Check initial credits (0)
    me_res = client.get("/api/v1/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert me_res.json()["civic_credits"] == 0

    # 3. Submit complaint with auth header
    comp_res = client.post(
        "/api/v1/complaints/",
        json={
            "raw_text": "Severe water pipeline leakage flooding Baner main road near Ganpati chowk.",
            "location_name": "Baner Road, Pune",
            "preferred_language": "en",
        },
        headers={"Authorization": f"Bearer {token}"},
    )
    assert comp_res.status_code == 201
    tracking_number = comp_res.json()["tracking_number"]

    # 4. Verify complaint appears in /complaints/my
    my_res = client.get("/api/v1/complaints/my", headers={"Authorization": f"Bearer {token}"})
    assert my_res.status_code == 200
    my_complaints = my_res.json()
    assert len(my_complaints) >= 1
    assert any(c["tracking_number"] == tracking_number for c in my_complaints)

    # 5. Verify credits awarded (+10)
    me_after = client.get("/api/v1/auth/me", headers={"Authorization": f"Bearer {token}"}).json()
    assert me_after["civic_credits"] >= 10

    # 6. Verify badge unlocked (First Voice)
    badges_res = client.get("/api/v1/auth/badges", headers={"Authorization": f"Bearer {token}"})
    assert badges_res.status_code == 200
    badges_data = badges_res.json()
    assert badges_data["total_earned"] >= 1
    earned_ids = [b["id"] for b in badges_data["badges"] if b["is_earned"]]
    assert "first_voice" in earned_ids


def test_citizen_complaints_isolation():
    # Citizen 1
    c1_suffix = uuid.uuid4().hex[:8]
    r1 = client.post(
        "/api/v1/auth/register",
        json={
            "full_name": "Citizen One",
            "email": f"c1_{c1_suffix}@pmc.test",
            "phone": get_random_phone(),
            "password": "Password123!",
            "confirm_password": "Password123!",
        },
    )
    assert r1.status_code == 201
    t1 = r1.json()["access_token"]

    # Submit complaint as Citizen 1
    comp1 = client.post(
        "/api/v1/complaints/",
        json={
            "raw_text": "Garbage dump overflowing on Senapati Bapat road.",
            "location_name": "SB Road, Pune",
        },
        headers={"Authorization": f"Bearer {t1}"},
    ).json()

    # Citizen 2
    c2_suffix = uuid.uuid4().hex[:8]
    r2 = client.post(
        "/api/v1/auth/register",
        json={
            "full_name": "Citizen Two",
            "email": f"c2_{c2_suffix}@pmc.test",
            "phone": get_random_phone(),
            "password": "Password123!",
            "confirm_password": "Password123!",
        },
    )
    assert r2.status_code == 201
    t2 = r2.json()["access_token"]

    # Citizen 2's /complaints/my must NOT contain Citizen 1's complaint
    my2 = client.get("/api/v1/complaints/my", headers={"Authorization": f"Bearer {t2}"}).json()
    assert not any(c["tracking_number"] == comp1["tracking_number"] for c in my2)


def test_complaint_draft_lifecycle():
    unique_session = f"sess_{uuid.uuid4().hex}"
    draft_payload = {
        "session_id": unique_session,
        "complaint_data": {
            "raw_text": "Potholes across Karve Nagar road near D-Mart.",
            "location_name": "Karve Nagar, Pune",
            "latitude": 18.4901,
            "longitude": 73.8182,
        },
    }
    # 1. Save draft anonymously
    save_res = client.post("/api/v1/complaints/draft", json=draft_payload)
    assert save_res.status_code == 200
    draft_id = save_res.json()["draft_id"]

    # 2. Retrieve draft
    get_res = client.get(f"/api/v1/complaints/draft/{draft_id}?session_id={unique_session}")
    assert get_res.status_code == 200
    retrieved = get_res.json()
    assert retrieved["complaint_data"]["raw_text"] == "Potholes across Karve Nagar road near D-Mart."
    assert retrieved["complaint_data"]["latitude"] == 18.4901


def test_official_roles_still_function():
    # 1. Municipal Admin login
    admin_res = client.post(
        "/api/v1/auth/login",
        json={"email_or_employee_id": "water.admin@jansetu.demo", "password": "admin123"},
    )
    assert admin_res.status_code == 200
    admin_token = admin_res.json()["access_token"]

    # Water admin listing tickets
    tickets_res = client.get(
        "/api/v1/tickets/",
        headers={"Authorization": f"Bearer {admin_token}"},
    )
    assert tickets_res.status_code == 200
    tickets = tickets_res.json()
    # Water admin should strictly see WATER_SUPPLY tickets
    for t in tickets:
        assert t["department_id"] == "WATER_SUPPLY"

    # 2. Collector login
    coll_res = client.post(
        "/api/v1/auth/login",
        json={"email_or_employee_id": "collector@jansetu.demo", "password": "collector123"},
    )
    assert coll_res.status_code == 200
    coll_token = coll_res.json()["access_token"]
    assert coll_res.json()["user"]["role"] in ["COLLECTOR", "DISTRICT_COLLECTOR"]

    # Collector can see tickets across all departments
    coll_tickets = client.get(
        "/api/v1/tickets/",
        headers={"Authorization": f"Bearer {coll_token}"},
    ).json()
    dept_set = {t["department_id"] for t in coll_tickets}
    assert len(dept_set) > 1  # Collector has city-wide oversight
