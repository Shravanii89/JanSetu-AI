# JanSetu AI — REST API Specification (OpenAPI / v1)

All endpoints are hosted under `/api/v1`.

---

## 1. Authentication & Identity

### 1.1 Official Login
- **Endpoint**: `POST /api/v1/auth/login`
- **Auth**: Public
- **Description**: Unified login for all municipal officials (Admin, Department Officer, Collector). Zero role selector on frontend.
- **Request**:
  ```json
  {
    "identifier": "officer.water@punecivic.in", // or employee_id "PMC-WAT-104"
    "password": "SecretPassword123"
  }
  ```
- **Success Response (200 OK)**:
  ```json
  {
    "access_token": "eyJhbGciOiJIUzI1NiIsIn...",
    "token_type": "bearer",
    "user": {
      "id": "a3b1c2d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d",
      "email": "officer.water@punecivic.in",
      "full_name": "Ramesh Kulkarni",
      "role": "DEPARTMENT_OFFICER",
      "department_id": "WATER_SUPPLY"
    }
  }
  ```
- **Errors**: `401 Unauthorized` for invalid credentials.

### 1.2 User Profile
- **Endpoint**: `GET /api/v1/auth/me`
- **Auth**: Bearer Token
- **Success Response (200 OK)**: Current authenticated user details and active department.

---

## 2. Public Citizen Endpoints

### 2.1 Submit Grievance
- **Endpoint**: `POST /api/v1/public/complaints`
- **Auth**: Public
- **Request**:
  ```json
  {
    "raw_text": "There has been no water supply in Sector 5 for three days and nobody is responding.",
    "citizen_name": "Anita Sharma",
    "citizen_phone": "+919876543210",
    "citizen_email": "anita.s@example.com",
    "preferred_language": "en",
    "input_channel": "WEB",
    "image_url": null
  }
  ```
- **Success Response (201 Created)**:
  ```json
  {
    "tracking_number": "JS-2026-PUN-00123",
    "status": "AI_ANALYZED",
    "ai_preview": {
      "issue": "Water Supply Outage",
      "duration": "3 days",
      "location": "Sector 5",
      "department": "WATER_SUPPLY",
      "priority": "P1",
      "actionability": "READY",
      "citizen_draft": "Your water supply outage report for Sector 5 has been routed to the Water Supply Department."
    }
  }
  ```

### 2.2 Track Grievance
- **Endpoint**: `GET /api/v1/public/complaints/{tracking_number}`
- **Auth**: Public
- **Success Response (200 OK)**:
  ```json
  {
    "tracking_number": "JS-2026-PUN-00123",
    "status": "IN_PROGRESS",
    "issue_summary": "Water Supply Outage",
    "department": "Water Supply Department",
    "priority": "P1",
    "submitted_at": "2026-09-11T08:30:00Z",
    "timeline": [
      { "status": "NEW", "timestamp": "2026-09-11T08:30:00Z" },
      { "status": "AI_ANALYZED", "timestamp": "2026-09-11T08:30:02Z" },
      { "status": "ASSIGNED", "timestamp": "2026-09-11T08:35:00Z" },
      { "status": "IN_PROGRESS", "timestamp": "2026-09-11T09:10:00Z", "note": "Valve inspection underway at Sector 5 main line." }
    ]
  }
  ```

### 2.3 Answer Clarification
- **Endpoint**: `POST /api/v1/public/complaints/{tracking_number}/clarify`
- **Auth**: Public
- **Request**:
  ```json
  {
    "answer": "Near City Mall, Ward 12",
    "requested_field": "location"
  }
  ```
- **Success Response (200 OK)**: Status updated to `READY_FOR_ROUTING` and SLA timer started.

---

## 3. Department Officer Endpoints

*RBAC: Role must be `DEPARTMENT_OFFICER`. Query automatically scopes to `user.department_id`.*

### 3.1 Get Department Ticket Queue
- **Endpoint**: `GET /api/v1/officer/tickets`
- **Query Params**: `status`, `priority`, `page`, `limit`
- **Success Response (200 OK)**: List of department tickets with SLA countdowns and AI flags.

### 3.2 Update Ticket Status
- **Endpoint**: `PATCH /api/v1/officer/tickets/{ticket_id}/status`
- **Request**:
  ```json
  {
    "to_status": "RESOLVED",
    "resolution_notes": "Main valve gasket replaced. Full water pressure restored across Sector 5."
  }
  ```
- **Success Response (200 OK)**: Updated ticket state with SLA stopped.

### 3.3 Override Priority (Audit-Logged)
- **Endpoint**: `PATCH /api/v1/officer/tickets/{ticket_id}/priority`
- **Request**:
  ```json
  {
    "new_priority": "P0",
    "justification": "Live wire sparking near school playground fence posing immediate life danger."
  }
  ```

---

## 4. Municipal Admin Endpoints

*RBAC: Role must be `MUNICIPAL_ADMIN`.*

### 4.1 Municipal Overview
- **Endpoint**: `GET /api/v1/admin/overview`
- **Success Response (200 OK)**: Metrics for all 8 departments, global backlog, SLA breach rates, and incident candidate counts.

### 4.2 Re-Route Department
- **Endpoint**: `POST /api/v1/admin/tickets/{ticket_id}/reroute`
- **Request**:
  ```json
  {
    "new_department_id": "PUBLIC_HEALTH",
    "reason": "Sewage overflow misclassified as Road drainage."
  }
  ```

### 4.3 Confirm Incident Cluster
- **Endpoint**: `POST /api/v1/admin/incidents/merge`
- **Request**:
  ```json
  {
    "title": "Sector 5 Main Pipeline Rupture",
    "ticket_ids": ["uuid-1", "uuid-2", "uuid-3"],
    "department_id": "WATER_SUPPLY"
  }
  ```

---

## 5. Collector Endpoints

*RBAC: Role must be `COLLECTOR`.*

### 5.1 Executive Briefing
- **Endpoint**: `GET /api/v1/collector/briefing`
- **Success Response (200 OK)**: Count of active P0 emergencies, SLA breaches in the past 24 hours, and systemic failure hotspots.

### 5.2 Department Performance Comparison
- **Endpoint**: `GET /api/v1/collector/department-performance`
- **Success Response (200 OK)**: Cross-department comparative matrix with resolution metrics and recurring failure rates.
