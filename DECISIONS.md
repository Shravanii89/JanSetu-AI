# JanSetu AI — Architecture Decision Records (ADR)

This document records the foundational architectural decisions, rationales, and constraints governing JanSetu AI.

---

## ADR 001: Architecture Pattern — Modular Monolith over Microservices
- **Status**: Accepted
- **Context**: Hackathon velocity, operational simplicity, and data integrity are top priorities for PS02. Microservices introduce network overhead, distributed state synchronizations, and deployment brittleness.
- **Decision**: JanSetu AI will be built as a single **Modular Monolith** containing a Next.js frontend and a FastAPI backend with logically isolated domain modules.
- **Consequences**: Zero inter-service network failures, simplified continuous deployment, ACID transaction guarantees, and rapid development speed.

---

## ADR 002: Official Authentication — Single Unified Entry (`/login`) with Zero Role Selection
- **Status**: Accepted
- **Context**: Legacy civic portals frequently show confusing login buttons for each department or a role dropdown on the login screen. This leaks internal role structure and invites privilege escalation attacks.
- **Decision**: There is exactly **one** official login page at `/login` accepting Employee ID / Official Email and Password. There is **no role dropdown** and **no department buttons**. The backend validates credentials, looks up role and department assignment, and returns a signed JWT.
- **Consequences**: Enhanced security, clean UX, and tamper-proof role enforcement.

---

## ADR 003: Role Model — Complete Removal of Super Admin
- **Status**: Accepted
- **Context**: The product scope requires exactly four roles: `CITIZEN`, `MUNICIPAL_ADMIN`, `DEPARTMENT_OFFICER`, and `COLLECTOR`. A global "Super Admin" represents an unrealistic government privilege model and an unnecessary security attack surface.
- **Decision**: Super Admin is **permanently eliminated** from all schemas, enums, UI navigation, and authorization policies.
- **Consequences**: Strict role boundaries reflecting real-world Pune Municipal Corporation governance.

---

## ADR 004: Server-Side RBAC & Department Isolation
- **Status**: Accepted
- **Context**: Department Officers should only access tickets belonging to their assigned department. Relying on frontend route hiding is a security vulnerability.
- **Decision**: Backend API routes enforce department isolation at the database query level (`WHERE ticket.department_id = user.department_id`). Any cross-department access attempt by an officer triggers an immediate HTTP `403 Forbidden`.
- **Consequences**: Bulletproof data isolation; malicious frontend state or URL tampering cannot leak inter-department data.

---

## ADR 005: AI Separation of Concerns — Advisory Only
- **Status**: Accepted
- **Context**: Large Language Models (LLMs) can hallucinate, suffer from latency, or be susceptible to prompt injection.
- **Decision**: **AI decides what the complaint means. Rules decide what the system is allowed to do. Humans decide consequential operational actions.** The Gemini model outputs candidate structured recommendations (`AIAnalysisSchema`). Python validation rules check enums and calculate SLAs. Database writes and state transitions are executed exclusively by deterministic code.
- **Consequences**: Complete reliability, auditability, and immunity to unauthorized database mutations.

---

## ADR 006: Deterministic SLA Calculation Engine
- **Status**: Accepted
- **Context**: SLAs are legal and operational civic obligations. They must be calculated deterministically and predictably, not estimated conversationally by an LLM.
- **Decision**: A deterministic SLA engine computes response and resolution deadlines from the moment a ticket becomes actionable based on a demo policy matrix. Timers are paused when awaiting citizen clarification and resumed upon receipt.
- **Consequences**: Transparent, verifiable SLA tracking and automated escalation alerts.

---

## ADR 007: Human Confirmation for Consequential Merges
- **Status**: Accepted
- **Context**: Automated clustering of complaints into master incidents is powerful, but automated merging could mistakenly group distinct local issues and prematurely close citizen complaints.
- **Decision**: The AI engine suggests candidate incident clusters (e.g., *"37 related complaints in Sector 5"*). An authorized Municipal Admin or Department Officer must review and click **Confirm & Link Complaints**. Individual complaints remain tracked independently.
- **Consequences**: High operational trust and zero accidental data loss.
