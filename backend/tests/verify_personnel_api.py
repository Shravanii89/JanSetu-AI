"""
JanSetu AI - End-to-End Live Personnel Assignment Verification
Tests the running server at http://127.0.0.1:8000.
"""

import httpx

BASE_URL = "http://127.0.0.1:8000/api/v1"

def run_tests():
    with httpx.Client(base_url=BASE_URL, timeout=30.0) as client:
        print("[1] Logging in as Road Officer...")
        res = client.post("/auth/login", json={"email_or_employee_id": "road.officer@jansetu.local", "password": "officer123"})
        assert res.status_code == 200, f"Road officer login failed: {res.text}"
        road_token = res.json()["access_token"]
        road_headers = {"Authorization": f"Bearer {road_token}"}
        print("  -> Road Officer login OK")

        print("[2] Logging in as Water Officer...")
        res = client.post("/auth/login", json={"email_or_employee_id": "water.officer@jansetu.local", "password": "officer123"})
        assert res.status_code == 200, f"Water officer login failed: {res.text}"

        water_token = res.json()["access_token"]
        water_headers = {"Authorization": f"Bearer {water_token}"}
        print("  -> Water Officer login OK")

        print("[3] Querying Road Department Personnel...")
        res = client.get("/departments/ROAD/personnel", headers=road_headers)
        assert res.status_code == 200, f"Failed to get road personnel: {res.text}"
        road_personnel = res.json()
        assert len(road_personnel) >= 3, f"Expected at least 3 road personnel, got {len(road_personnel)}"
        print(f"  -> Found {len(road_personnel)} personnel in Road department: {[p['full_name'] for p in road_personnel]}")

        rahul = next((p for p in road_personnel if "Rahul" in p["full_name"]), road_personnel[0])
        amit = next((p for p in road_personnel if "Amit" in p["full_name"]), road_personnel[1])

        print("[4] Testing Department Isolation on Personnel Query...")
        # Road officer querying Water Supply personnel must fail with 403
        res = client.get("/departments/WATER_SUPPLY/personnel", headers=road_headers)
        assert res.status_code == 403, f"Expected 403, got {res.status_code}"
        print("  -> Isolation enforced: Road officer blocked from querying Water personnel (403 Forbidden)")

        print("[5] Fetching Open Tickets for Road Department...")
        res = client.get("/tickets/", headers=road_headers)
        assert res.status_code == 200, f"Failed to list tickets: {res.text}"
        tickets = res.json()
        assert len(tickets) > 0, "No road tickets found"
        target_ticket = tickets[0]
        ticket_id = target_ticket["id"]
        tracking_number = target_ticket["tracking_number"]
        print(f"  -> Selected ticket {tracking_number} (ID: {ticket_id})")

        print("[6] Testing Unauthorized Department Assignment...")
        # Water officer trying to assign to Road ticket must fail with 403
        res = client.post(
            f"/tickets/{ticket_id}/assign",
            json={"personnel_id": rahul["id"], "assignment_note": "Cross-department attempt"},
            headers=water_headers
        )
        assert res.status_code == 403, f"Expected 403, got {res.status_code}"
        print("  -> Isolation enforced: Water officer blocked from assigning Road ticket (403 Forbidden)")

        print(f"[7] Assigning Personnel '{rahul['full_name']}' to Ticket {tracking_number}...")
        res = client.post(
            f"/tickets/{ticket_id}/assign",
            json={"personnel_id": rahul["id"], "assignment_note": "Urgent pothole asphalt repair required at location."},
            headers=road_headers
        )
        assert res.status_code == 200, f"Assignment failed: {res.text}"
        assign_data = res.json()
        assert assign_data["current_assignment"] is not None
        assert assign_data["current_assignment"]["personnel"]["full_name"] == rahul["full_name"]
        assert assign_data["current_assignment"]["assignment_status"] == "ASSIGNED"
        print(f"  -> Successfully assigned to {rahul['full_name']} (Status: ASSIGNED)")

        print("[8] Verifying Assignment Fetch via GET /tickets/{id}/assignment...")
        res = client.get(f"/tickets/{ticket_id}/assignment", headers=road_headers)
        assert res.status_code == 200, f"Get assignment failed: {res.text}"
        curr = res.json()["current_assignment"]
        assert curr["personnel"]["employee_id"] == rahul["employee_id"]
        print(f"  -> Verified assignment record: {curr['personnel']['full_name']}, Designation: {curr['personnel']['designation']}")

        print("[9] Transitioning Work Status to 'Work in Progress'...")
        res = client.patch(
            f"/tickets/{ticket_id}/assignment/status",
            json={"status": "IN_PROGRESS", "note": "Crew arrived on site with asphalt roller and safety barricades."},
            headers=road_headers
        )
        assert res.status_code == 200, f"Update status failed: {res.text}"
        in_prog = res.json()["current_assignment"]
        assert in_prog["assignment_status"] == "IN_PROGRESS"
        assert in_prog["started_at"] is not None
        print(f"  -> Work in Progress active, started_at: {in_prog['started_at']}")

        print(f"[10] Reassigning to '{amit['full_name']}' with Mandatory Reason...")
        res = client.post(
            f"/tickets/{ticket_id}/reassign",
            json={
                "personnel_id": amit["id"],
                "reassignment_reason": "Specialized heavy compaction equipment and certified paver required.",
                "assignment_note": "Take over site operations and expedite compaction."
            },
            headers=road_headers
        )
        assert res.status_code == 200, f"Reassignment failed: {res.text}"
        reassigned = res.json()
        assert reassigned["current_assignment"]["personnel"]["full_name"] == amit["full_name"]
        assert reassigned["current_assignment"]["assignment_status"] == "ASSIGNED"
        assert len(reassigned["history"]) >= 1
        assert reassigned["history"][0]["assignment_status"] == "REASSIGNED"
        assert reassigned["history"][0]["reassignment_reason"] == "Specialized heavy compaction equipment and certified paver required."
        print(f"  -> Reassignment successful. History length: {len(reassigned['history'])}")

        print(f"[11] Checking Citizen Portal View for Tracking ID {tracking_number}...")
        res = client.get(f"/complaints/{tracking_number}")
        assert res.status_code == 200, f"Citizen tracking failed: {res.text}"
        citizen_data = res.json()
        assert "assigned_personnel" in citizen_data, "assigned_personnel missing from citizen view"
        cp = citizen_data["assigned_personnel"]
        assert cp is not None, "assigned_personnel must not be null"
        assert cp["name"] == amit["full_name"]
        assert cp["designation"] == amit["designation"]
        assert "Road" in cp["department"]
        assert cp["official_contact"] == amit["phone"]
        # Verify privacy
        assert "employee_id" not in cp, "employee_id leaked to citizen"
        assert "notes" not in cp, "internal notes leaked to citizen"
        assert "assignment_note" not in cp, "internal assignment notes leaked to citizen"
        print(f"  -> Citizen sees privacy-safe details: {cp['name']} ({cp['designation']}), {cp['official_contact']}, Status: {cp['work_status']}")

        print("\nALL 11 BACKEND PERSONNEL ASSIGNMENT WORKFLOW TESTS PASSED PERFECTLY!\n")

if __name__ == "__main__":
    run_tests()
