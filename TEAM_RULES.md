# JanSetu AI — Team Collaboration & Workflow Rules

This document outlines the collaborative engineering conventions, responsibilities, and architectural boundaries for the four-person engineering team developing **JanSetu AI**.

---

## 1. Team Roles & Ownership Matrix

| Team Member | Primary Domain | Core Ownership Areas | Key Repository Directories |
| :--- | :--- | :--- | :--- |
| **Member 1** | **Backend & Database** | FastAPI CRUD, PostgreSQL models, Alembic migrations, RBAC auth, services, database seeding | `backend/app/db/`, `models/`, `services/`, `schemas/`, `api/`, `scripts/` |
| **Member 2** | **Citizen Experience & UI** | Public landing page, grievance submission flow, clarification UI, design system primitives | `frontend/app/(public)/`, `frontend/components/ui/`, `landing/`, `complaints/` |
| **Member 3** | **AI & Civic Intelligence** | Gemini orchestrator, prompt engineering, structured extraction, incident clustering, evaluations | `backend/app/ai/`, `data/`, `frontend/components/ai/`, `incidents/` |
| **Member 4** | **Official Dashboards & DevOps** | Admin Command Center, Department Dashboard, Collector Briefing, Playwright/Pytest, CI/CD | `frontend/app/admin/`, `department/`, `collector/`, `tests/`, `.github/` |

---

## 2. Non-Negotiable Architectural Axioms

1. **Modular Monolith**: One Next.js frontend, one FastAPI backend, one PostgreSQL database. **No microservices.**
2. **Exactly Four Roles**: `CITIZEN`, `MUNICIPAL_ADMIN`, `DEPARTMENT_OFFICER`, `COLLECTOR`. **No Super Admin** anywhere in code, schemas, routes, or UI.
3. **Unified Official Access**: Exactly one official login at `/login` accepting Employee ID / Official Email and Password. **No role selectors or department buttons.**
4. **Controlled Departments**: Exactly eight operational departments (`WATER_SUPPLY`, `ELECTRICITY`, `PUBLIC_HEALTH`, `WASTE_MANAGEMENT`, `PUBLIC_PROPERTY_MANAGEMENT`, `GARDEN`, `ROAD`, `ENCROACHMENT`) + fallback `OTHER_HUMAN_REVIEW`.
5. **AI Advisory Only**: AI recommends; deterministic code validates and writes; authorized humans confirm consequential merges and actions.
6. **Deterministic SLA**: SLA deadlines are calculated mathematically by code, never estimated by LLMs.

---

## 3. Git Workflow & Branching Strategy

- **Main Branch (`main`)**: Always deployable, protected, passes all automated tests.
- **Feature Branches**: Branch off `main` with naming convention:
  - `feat/backend-<feature-name>` (Member 1)
  - `feat/citizen-<feature-name>` (Member 2)
  - `feat/ai-<feature-name>` (Member 3)
  - `feat/dashboards-<feature-name>` (Member 4)
- **Commit Standards**: Conventional commits (`feat:`, `fix:`, `refactor:`, `test:`, `docs:`, `chore:`).
- **Pull Requests**: Every PR must verify that:
  - Backend pytest passes (`pytest backend/tests -v`).
  - Frontend typecheck passes (`npm --prefix frontend run typecheck`).
  - Frontend build succeeds (`npm --prefix frontend run build`).

---

## 4. Contract Synchronization Directives

- When modifying API schemas or custom enums, update **both** backend Pydantic schemas (`backend/app/schemas/`) and frontend TypeScript interfaces (`frontend/types/`) in the same commit.
- Never commit actual secrets or credentials to Git. Use local untracked `.env` files matching `.env.example`.
