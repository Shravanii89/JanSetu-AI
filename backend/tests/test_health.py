"""
Tests for JanSetu AI Health Check Endpoint
"""

from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_health_check_returns_200():
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_root_endpoint_returns_200():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["project"] == "JanSetu AI"
    assert data["tagline"] == "From Citizen Voice to Government Action"
