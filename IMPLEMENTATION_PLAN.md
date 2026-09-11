# JanSetu AI — 13-Phase Technical Implementation Plan

This document defines the authorized implementation roadmap for the JanSetu AI platform.

---

## Roadmap Overview

| Phase | Phase Name | Primary Objective | Key Output |
| :---: | :--- | :--- | :--- |
| **1** | **Project Foundation** | Scaffold modular monolith (`backend/` & `frontend/`), configuration templates, linters | Running FastAPI (`/api/v1/health`) & Next.js starter |
| **2** | **Authentication & RBAC** | Unified `/login` without role selectors; server-side JWT issuance; role routing | Working auth flow & department isolation |
| **3** | **Complaint & Ticket Core** | PostgreSQL schemas, UUID tracking generator, lifecycle state transitions | End-to-end CRUD for grievances & tickets |
| **4** | **Gemini AI Orchestration** | Gemini API integration with Pydantic structured output & injection defenses | Structured extraction from free-form text |
| **5** | **Clarification Loop** | Missing information detection and interactive citizen response loop | Status `NEEDS_CLARIFICATION` to `READY` flow |
| **6** | **Priority & Routing Rules** | Pure Python deterministic rules separating Priority (P0-P3) from Sentiment | Controlled 8-department dispatch matrix |
| **7** | **SLA & Escalation Engine** | Deterministic response/resolution deadlines and automated breach triggers | SLA state transitions & escalation records |
| **8** | **Department Officer UI** | Single reusable officer console filtered strictly by `department_id` | Officer ticket action studio |
| **9** | **Municipal Admin Center** | City-wide command overview with 8-department drilldown & re-routing | Global ticket registry & workload cards |
| **10**| **Collector Dashboard** | Executive intelligence view focusing on P0/P1 emergencies and SLA breaches | Leadership briefing & performance metrics |
| **11**| **Incident Intelligence** | Spatial-temporal clustering of related grievances into candidate incidents | Deduplication & one-click incident merge |
| **12**| **Multilingual, Map & Analytics**| Marathi & Hindi support, Leaflet OpenStreetMap view, Recharts visualizations | Multilingual UI & civic hotspot heatmaps |
| **13**| **E2E Testing & Demo Data** | Realistic Pune demo seed data, Playwright E2E suite, deployment configs | Verified Golden Demo slice ready for presentation |

---

## Detailed Phase Descriptions

### Phase 1: Project Foundation & Architecture Setup *(Currently Active)*
- **Objective**: Establish the modular monolith structure, standard environment templates, TypeScript setup, and running health-check backend.
- **Deliverables**:
  - `backend/app/main.py`, `backend/app/core/config.py`, `backend/requirements.txt`
  - `frontend/package.json`, `frontend/app/layout.tsx`, `frontend/app/page.tsx`
  - Canonical documentation files, `.gitignore`, `.env.example`
- **Acceptance Criteria**:
  - Frontend runs cleanly without TypeScript errors.
  - Backend runs cleanly and `GET /api/v1/health` returns `{"status": "ok"}`.
  - No secrets in repo. Zero Super Admin or role selector UI.

### Phase 2: Unified Official Authentication & Server-Side RBAC
- **Objective**: Create secure authentication with strict server-side role enforcement.
- **Deliverables**: Passlib bcrypt hashing, JWT issuance in FastAPI, Next.js `/login` form, Auth Context.
- **Acceptance Criteria**: Unified `/login` accepts Employee ID/Email + Password. Backend redirects `MUNICIPAL_ADMIN` $\rightarrow$ `/admin`, `DEPARTMENT_OFFICER` $\rightarrow$ `/department`, `COLLECTOR` $\rightarrow$ `/collector`. Cross-department access returns `403 Forbidden`.

### Phase 3: Complaint & Ticket Lifecycle Engine
- **Objective**: Implement database models, tracking number generator (`JS-YYYY-LOC-XXXXX`), and state transitions.
- **Deliverables**: SQLAlchemy models, TicketService, StatusHistories, and AuditLogs.

### Phase 4: Gemini AI Analysis Orchestrator
- **Objective**: Implement Gemini structured extraction using Pydantic schemas and prompt injection sandbox.
- **Deliverables**: `gemini_client.py`, prompt builders, schema validator. Golden scenario: Water outage 3 days parsed accurately.

### Phase 5: Missing Information & Clarification Loop
- **Objective**: Identify category-aware missing entities and handle interactive citizen input.
- **Deliverables**: Interactive citizen clarification UI at `/complaint/[id]`, ClarificationService.

### Phase 6: Deterministic Priority & Controlled Routing
- **Objective**: Implement pure rule engine separating Priority (P0-P3) from citizen sentiment.
- **Deliverables**: `priority_rules.py`, `routing_rules.py`. Immediate P0 safety bypass for live hazards.

### Phase 7: SLA Engine & Escalations
- **Objective**: Implement deterministic SLA deadline calculations and auto-escalation triggers.
- **Deliverables**: `sla_service.py`, periodic background checker for `AT_RISK` and `BREACHED` states.

### Phase 8: Reusable Department Officer Dashboard
- **Objective**: Build the single, reusable Department Officer dashboard scoped by `department_id`.
- **Deliverables**: Ticket action studio, AI explanation card, SOP recommendation list, resolution logger.

### Phase 9: Municipal Admin Command Center
- **Objective**: Build the central operations center covering all 8 departments.
- **Deliverables**: 8-department workload cards, re-routing dialog with mandatory audit note, global search.

### Phase 10: Collector Strategic Intelligence Dashboard
- **Objective**: Build the senior leadership dashboard focused on high-priority exceptions.
- **Deliverables**: P0/P1 emergency alerts, SLA breach tracker, inter-department performance matrix.

### Phase 11: Incident Intelligence & Deduplication
- **Objective**: Detect emerging spatial-temporal clusters (e.g., 37 water complaints in Sector 5).
- **Deliverables**: Proximity & semantic clustering service, candidate incident confirmation dialog.

### Phase 12: Multilingual Support, Map & Analytics
- **Objective**: Support Marathi and Hindi, render Leaflet complaint maps, and display Recharts trends.
- **Deliverables**: Language switcher, localized response templates, Leaflet hotspot map component.

### Phase 13: End-to-End Testing, Demo Data & Deployment
- **Objective**: Seed realistic Pune civic data, run Playwright verification, and configure deployment manifests.
- **Deliverables**: `seed_demo_data.py`, automated tests passing, Dockerfile, deployment instructions.
