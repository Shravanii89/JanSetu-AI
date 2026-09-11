"""
JanSetu AI - Complaint Ingestion & Tracking Integration Tests
"""

import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_submit_and_track_complaint():
    # 1. Submit complaint with missing location
    submit_res = client.post(
        "/api/v1/complaints/",
        json={
            "raw_text": "There has been no water supply in our area for three days and nobody is responding.",
            "citizen_name": "Ajit Pawar",
            "citizen_phone": "9822100200",
            "preferred_language": "en",
        },
    )
    assert submit_res.status_code == 201
    data = submit_res.json()
    assert "tracking_number" in data
    assert data["status"] == "NEEDS_CLARIFICATION"
    tracking_num = data["tracking_number"]

    # 2. Track complaint
    track_res = client.get(f"/api/v1/complaints/{tracking_num}")
    assert track_res.status_code == 200
    track_data = track_res.json()
    assert track_data["tracking_number"] == tracking_num
    assert track_data["department_id"] == "WATER_SUPPLY"
    assert track_data["priority"] == "P1"
    assert len(track_data["clarifications"]) > 0

    # 3. Submit clarification answering the location question
    clarify_res = client.post(
        f"/api/v1/complaints/{tracking_num}/clarify",
        json={"answer": "Baner near Balewadi Phata", "requested_field": "location"},
    )
    assert clarify_res.status_code == 200
    assert clarify_res.json()["new_status"] == "ASSIGNED"

    # 4. Verify updated state
    track_updated = client.get(f"/api/v1/complaints/{tracking_num}").json()
    assert track_updated["location_name"] == "Baner near Balewadi Phata"
    assert track_updated["status"] == "ASSIGNED"
