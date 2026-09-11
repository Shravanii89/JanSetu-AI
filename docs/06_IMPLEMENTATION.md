# 06 — Implementation Strategy & Engineering Phases

## 1. Phased Delivery Roadmap
JanSetu AI follows a disciplined 13-phase implementation roadmap:
- **Phase 1**: Project Foundation (Modular monolith scaffold, health check, baseline documentation).
- **Phase 2**: Authentication & Server-Side RBAC (Unified `/login`, JWT issuance, role redirection).
- **Phase 3**: Complaint & Ticket Core Engine (PostgreSQL schemas, state transitions, tracking numbers).
- **Phase 4**: Gemini AI Analysis Orchestrator (Structured Pydantic extraction, prompt injection defense).
- **Phase 5**: Missing Information & Clarification Loop (Category-aware dialogue, status `NEEDS_CLARIFICATION`).
- **Phase 6**: Priority & Controlled Routing Rules (Pure Python rules separating Priority P0-P3 from sentiment).
- **Phase 7**: SLA & Escalation Engine (Deterministic deadlines, auto-escalation triggers).
- **Phase 8**: Department Officer Dashboard (Single reusable console filtered by `department_id`).
- **Phase 9**: Municipal Admin Command Center (8-department city overview, misrouting correction).
- **Phase 10**: Collector Strategic Intelligence Dashboard (P0 emergencies, SLA breaches, systemic patterns).
- **Phase 11**: Incident Intelligence & Duplicate Clustering (Spatial-temporal clustering, candidate merges).
- **Phase 12**: Multilingual Support, Map & Analytics (Marathi/Hindi UI, Leaflet hotspot map, Recharts).
- **Phase 13**: End-to-End Testing, Seed Data & Deployment (Pune demo data, Playwright E2E, Dockerfiles).
