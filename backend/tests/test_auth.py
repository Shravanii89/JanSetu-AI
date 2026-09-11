"""
JanSetu AI - Authentication & JWT Tests
"""

import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_login_success_admin():
    response = client.post(
        "/api/v1/auth/login",
        json={"email_or_employee_id": "admin@jansetu.local", "password": "admin123"},
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["user"]["role"] == "MUNICIPAL_ADMIN"
    assert data["user"]["email"] == "admin@jansetu.local"


def test_login_success_water_officer():
    response = client.post(
        "/api/v1/auth/login",
        json={"email_or_employee_id": "water.officer@jansetu.local", "password": "officer123"},
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["user"]["role"] == "DEPARTMENT_OFFICER"
    assert data["user"]["department_id"] == "WATER_SUPPLY"


def test_login_invalid_password():
    response = client.post(
        "/api/v1/auth/login",
        json={"email_or_employee_id": "admin@jansetu.local", "password": "wrongpassword"},
    )
    assert response.status_code == 401
    assert "Invalid credentials" in response.json()["detail"]


def test_login_nonexistent_user():
    response = client.post(
        "/api/v1/auth/login",
        json={"email_or_employee_id": "ghost@pmc.gov.in", "password": "anypassword"},
    )
    assert response.status_code == 401


def test_get_current_user_profile():
    # 1. Login
    login_res = client.post(
        "/api/v1/auth/login",
        json={"email_or_employee_id": "collector@jansetu.local", "password": "collector123"},
    )
    token = login_res.json()["access_token"]

    # 2. Get profile
    me_res = client.get(
        "/api/v1/auth/me",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert me_res.status_code == 200
    user_data = me_res.json()
    assert user_data["role"] == "COLLECTOR"
    assert user_data["email"] == "collector@jansetu.local"
