"""
JanSetu AI - End-to-End Live System Flow Verification Script
Tests Flows A, B, C, D against running backend http://localhost:8000
"""

import httpx
import json

BASE_URL = "http://127.0.0.1:8000/api/v1"

def test_flow_a():
    print("\n--- Testing FLOW A: Citizen Intake, AI Triage, Missing Location, Clarification, Tracking ---")
    with httpx.Client(base_url=BASE_URL, timeout=30.0) as client:
        # 1. Citizen submits canonical prompt
        payload = {
            "raw_text": "There has been no water supply in our area for three days and nobody is responding.",
            "preferred_language": "en"
        }
        res = client.post("/complaints/", json=payload)
        assert res.status_code == 201, f"Expected 201, got {res.status_code}: {res.text}"
        data = res.json()
        tracking_num = data["tracking_number"]
        print(f"  [+] Complaint registered. Tracking ID: {tracking_num}")
        print(f"  [+] Initial Status: {data['status']}")
        assert data["status"] == "NEEDS_CLARIFICATION", f"Expected NEEDS_CLARIFICATION, got {data['status']}"

        # 2. Track complaint
        track_res = client.get(f"/complaints/{tracking_num}")
        assert track_res.status_code == 200
        track_data = track_res.json()
        print(f"  [+] Extracted Department: {track_data['department_id']}")
        print(f"  [+] Extracted Priority: {track_data['priority']}")
        print(f"  [+] Location: {track_data['location_name']} (Correctly missing!)")
        assert track_data["department_id"] == "WATER_SUPPLY"
        assert track_data["priority"] == "P1"
        assert track_data["location_name"] is None

        # 3. Submit citizen clarification
        clarif_payload = {
            "answer": "Baner near Balewadi Phata",
            "requested_field": "location"
        }
        clarif_res = client.post(f"/complaints/{tracking_num}/clarify", json=clarif_payload)
        assert clarif_res.status_code == 200
        print(f"  [+] Clarification submitted: '{clarif_payload['answer']}'")

        # 4. Verify updated ticket
        updated_track = client.get(f"/complaints/{tracking_num}").json()
        print(f"  [+] Updated Status: {updated_track['status']}")
        print(f"  [+] Updated Location: {updated_track['location_name']}")
        print(f"  [+] SLA Status: {updated_track['sla']['status']}")
        assert updated_track["status"] == "ASSIGNED"
        assert updated_track["location_name"] == "Baner near Balewadi Phata"
        print("  [SUCCESS] FLOW A PASSED 100%!")
        return tracking_num


def test_flow_b():
    print("\n--- Testing FLOW B: Water Department Officer Login, View Scoped Queue, Status Transitions ---")
    with httpx.Client(base_url=BASE_URL, timeout=30.0) as client:
        # 1. Login as Water Officer
        login_res = client.post("/auth/login", json={
            "email_or_employee_id": "water.officer@jansetu.local",
            "password": "officer123"
        })
        if login_res.status_code != 200:
            print(f"Login failed: {login_res.status_code} - {login_res.text}")
        assert login_res.status_code == 200, f"Expected 200, got {login_res.status_code}: {login_res.text}"
        token = login_res.json()["access_token"]
        user = login_res.json()["user"]
        print(f"  [+] Logged in as: {user['full_name']} ({user['role']})")
        print(f"  [+] Department: {user['department_id']}")
        assert user["role"] == "DEPARTMENT_OFFICER"
        assert user["department_id"] == "WATER_SUPPLY"

        headers = {"Authorization": f"Bearer {token}"}

        # 2. Get tickets scoped to Water Supply
        tix_res = client.get("/tickets/", headers=headers)
        assert tix_res.status_code == 200
        tickets = tix_res.json()
        print(f"  [+] Retrieved {len(tickets)} tickets in Water Supply queue")
        for t in tickets:
            assert t["department_id"] == "WATER_SUPPLY", f"Isolation breach! Ticket belongs to {t['department_id']}"

        # 3. Select an open ticket and transition to IN_PROGRESS
        target_ticket = next((t for t in tickets if t["status"] in ["ASSIGNED", "NEW"]), tickets[0])
        t_id = target_ticket["id"]
        status_res = client.patch(f"/tickets/{t_id}/status", json={"status": "IN_PROGRESS"}, headers=headers)
        assert status_res.status_code == 200
        print(f"  [+] Ticket {t_id} marked IN_PROGRESS")

        # 4. Mark RESOLVED with resolution notes
        res_res = client.patch(f"/tickets/{t_id}/status", json={
            "status": "RESOLVED",
            "resolution_notes": "Sluice valve replaced by PMC field team; pressure restored."
        }, headers=headers)
        assert res_res.status_code == 200
        print(f"  [+] Ticket {t_id} marked RESOLVED with verification notes")
        print("  [SUCCESS] FLOW B PASSED 100%!")


def test_flow_c():
    print("\n--- Testing FLOW C: Municipal Admin Login, Overview Telemetry, Cross-Dept Visibility ---")
    with httpx.Client(base_url=BASE_URL, timeout=30.0) as client:
        # 1. Login as Admin
        login_res = client.post("/auth/login", json={
            "email_or_employee_id": "admin@jansetu.local",
            "password": "admin123"
        })
        assert login_res.status_code == 200
        token = login_res.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}

        # 2. Overview Telemetry
        ov_res = client.get("/analytics/overview", headers=headers)
        assert ov_res.status_code == 200
        ov = ov_res.json()
        print(f"  [+] Total Complaints: {ov['total_complaints']}")
        print(f"  [+] Open Complaints: {ov['open_complaints']}")
        print(f"  [+] Resolved: {ov['resolved']}")
        print(f"  [+] Critical P0 Count: {ov['critical_p0_count']}")
        print(f"  [+] Active Incidents: {ov['active_incidents']}")

        # 3. Department workload distribution
        dept_res = client.get("/departments/", headers=headers)
        assert dept_res.status_code == 200
        depts = dept_res.json()
        print(f"  [+] Loaded {len(depts)} PMC departments with live workloads")
        assert len(depts) >= 8

        # 4. Clustered Incidents
        inc_res = client.get("/incidents/", headers=headers)
        assert inc_res.status_code == 200
        incs = inc_res.json()
        print(f"  [+] Active Systemic Incidents: {len(incs)}")
        print("  [SUCCESS] FLOW C PASSED 100%!")


def test_flow_d():
    print("\n--- Testing FLOW D: Collector Oversight, Critical Hazards, SLA Breaches, Incidents ---")
    with httpx.Client(base_url=BASE_URL, timeout=30.0) as client:
        # 1. Login as Collector
        login_res = client.post("/auth/login", json={
            "email_or_employee_id": "collector@jansetu.local",
            "password": "collector123"
        })
        assert login_res.status_code == 200
        token = login_res.json()["access_token"]
        user = login_res.json()["user"]
        headers = {"Authorization": f"Bearer {token}"}
        print(f"  [+] Logged in as: {user['full_name']} ({user['role']})")
        assert user["role"] == "COLLECTOR"

        # 2. Check Escalations
        esc_res = client.get("/escalations/", headers=headers)
        assert esc_res.status_code == 200
        escs = esc_res.json()
        print(f"  [+] Retrieved {len(escs)} critical escalations requiring Collector oversight")

        # 3. SLA Performance Monitor
        sla_res = client.get("/sla/summary", headers=headers)
        assert sla_res.status_code == 200
        sla = sla_res.json()
        print(f"  [+] City-wide SLA Compliance: {sla['compliance_percentage']}% (Breached: {sla['breached']}, At Risk: {sla['at_risk']})")
        print("  [SUCCESS] FLOW D PASSED 100%!")


if __name__ == "__main__":
    print("[START] Running JanSetu AI End-to-End Live Verification...")
    test_flow_a()
    test_flow_b()
    test_flow_c()
    test_flow_d()
    print("\n[ALL PASSED] ALL 4 USER FLOWS (A, B, C, D) COMPLETED AND VERIFIED SUCCESSFULLY!")
