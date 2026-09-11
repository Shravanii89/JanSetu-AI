# 04 — Technical Flow & Architecture

## 1. Modular Monolith Topology
JanSetu AI is architected as a Modular Monolith composed of:
- **Presentation Layer (Next.js 15 App Router)**: Server-rendered citizen portal and role-based official dashboards.
- **Application & Gateway Layer (FastAPI)**: REST endpoints under `/api/v1`, dependency injection for security/RBAC, and business logic services.
- **AI Orchestrator**: Gemini 1.5/2.0 Flash integration utilizing Pydantic structured output models and prompt injection sandboxing.
- **Deterministic Rule Engine**: Pure Python business logic governing ticket priority, department routing, SLA calculation, and state transitions.
- **Persistence Layer**: PostgreSQL (Supabase) with strict foreign keys, enums, indexes, and immutable audit logs.

## 2. Seven-Stage Complaint Lifecycle
`01 REPORT` $\rightarrow$ `02 UNDERSTAND` $\rightarrow$ `03 CLARIFY` $\rightarrow$ `04 ROUTE` $\rightarrow$ `05 ACT` $\rightarrow$ `06 TRACK` $\rightarrow$ `07 INFORM`
