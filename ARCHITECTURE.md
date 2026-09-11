# JanSetu AI — System Architecture Document

## 1. Architectural Paradigm: The Modular Monolith

JanSetu AI is engineered as a **Modular Monolith**. It avoids the distributed failure modes, network latency, and deployment complexity of microservices, while maintaining strict architectural boundaries between operational sub-systems.

```
┌────────────────────────────────────────────────────────────────────────┐
│                      PRESENTATION LAYER (Next.js)                      │
│   Public Citizen Portal  │  Unified /login  │  Admin  │  Dept  │ Collector│
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ HTTPS / REST / JSON
┌───────────────────────────────────▼────────────────────────────────────┐
│                    FASTAPI MODULAR MONOLITH BACKEND                    │
│ ┌──────────────────────┐ ┌───────────────────┐ ┌─────────────────────┐ │
│ │  Auth & Server RBAC  │ │ Ticket Lifecycle  │ │ Clarification Loop  │ │
│ └──────────┬───────────┘ └─────────┬─────────┘ └──────────┬──────────┘ │
│            │                       │                      │            │
│ ┌──────────▼───────────────────────▼──────────────────────▼──────────┐ │
│ │              DETERMINISTIC BUSINESS LOGIC & AUDITING               │ │
│ │   * SLA Calculation  * Routing Rules  * Audit Log Integrity        │ │
│ └──────────┬──────────────────────────────────────────────┬──────────┘ │
│            │                                              │            │
│ ┌──────────▼──────────────┐             ┌─────────────────▼──────────┐ │
│ │     AI Orchestrator     │             │    PostgreSQL / Supabase   │ │
│ │   (Gemini + Pydantic)   │             │   (Strict Foreign Keys)    │ │
│ └─────────────────────────┘             └────────────────────────────┘ │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Layer Specifications

### 2.1 Presentation Layer (Frontend)
- **Framework**: Next.js 15 (App Router) + TypeScript.
- **Styling & Components**: Tailwind CSS + shadcn/ui components (Radix primitives).
- **Icons**: Lucide React.
- **Maps**: Leaflet + OpenStreetMap (`react-leaflet`).
- **Charts**: Recharts (responsive SVG data visualizations).
- **State Management**: React Context / Hooks for authentication session; server state fetched via standard HTTP clients with cached SWR / TanStack patterns.

### 2.2 Application & API Layer (Backend)
- **Framework**: FastAPI (Python 3.11+ / 3.14 compatible).
- **Validation**: Pydantic v2 schemas for all incoming payloads and outgoing responses.
- **ASGI Server**: Uvicorn.
- **Database Access**: SQLAlchemy 2.0 (declarative models + async session execution).
- **Module Structure**:
  - `app/api/`: Versioned HTTP route controllers (`/api/v1`).
  - `app/core/`: Application settings, security utilities (password hashing, JWT verification).
  - `app/models/`: SQLAlchemy ORM entity definitions.
  - `app/schemas/`: Pydantic data transfer objects (DTOs).
  - `app/services/`: Core application business logic (TicketService, SLAService, ClarificationService).
  - `app/rules/`: Pure deterministic business rules (RoutingRules, PriorityRules).
  - `app/ai/`: Gemini orchestrator, prompt builders, schema extractors, prompt injection sanitizers.
  - `app/db/`: Database engine, connection pooling, base models.

### 2.3 AI Orchestration Layer
- **Model**: Google Gemini API (Gemini 1.5 Flash / 2.0 Flash) with native JSON schema enforcement.
- **Sandbox**: Untrusted citizen inputs are wrapped inside structured delimiters (`<citizen_text>...</citizen_text>`).
- **Separation Principle**:
  - The model outputs a candidate interpretation (`AIAnalysisSchema`).
  - The deterministic rule engine validates output against controlled enums.
  - The model is **strictly prohibited from issuing database writes, modifying ticket states directly, or calculating SLA deadlines.**

### 2.4 Workflow & Deterministic Rule Engine
- **Ticket State Machine**:
  - Primary: `NEW` $\rightarrow$ `AI_ANALYZED` $\rightarrow$ `NEEDS_CLARIFICATION` $\rightarrow$ `READY_FOR_ROUTING` $\rightarrow$ `ASSIGNED` $\rightarrow$ `IN_PROGRESS` $\rightarrow$ `RESOLVED` $\rightarrow$ `CLOSED`.
  - Secondary: `DUPLICATE`, `SPAM`, `REJECTED`, `ESCALATED`, `SLA_BREACHED`, `AWAITING_CITIZEN`.
- **SLA Engine**:
  - Computes deterministic deadlines based on Priority:
    - P0: Immediate (< 15 mins response, < 4 hrs resolution).
    - P1: 2 hrs response, 24 hrs resolution.
    - P2: 8 hrs response, 48 hrs resolution.
    - P3: 24 hrs response, 5 days resolution.
  - Automatically transitions status to `AT_RISK` at $\ge 75\%$ elapsed time and `BREACHED` when past deadline.

---

## 3. Security & Access Control Architecture

### 3.1 Cryptographic Identity & Authentication
- Official users authenticate via `POST /api/v1/auth/login`.
- Passwords are encrypted using bcrypt hashing (work factor 12).
- Successful authentication returns an industry-standard signed JWT with claims:
  ```json
  {
    "sub": "user-uuid",
    "role": "DEPARTMENT_OFFICER",
    "department_id": "WATER_SUPPLY",
    "email": "officer.water@punecivic.in",
    "exp": 1773248400
  }
  ```

### 3.2 Server-Side RBAC Enforcement
- Frontend state is treated as untrusted.
- Every protected endpoint in FastAPI utilizes dependency injection (`Depends(get_current_active_user)` and `Depends(require_role(...))`).
- **Department Isolation**: When a Department Officer queries tickets, the database query automatically appends:
  ```sql
  WHERE tickets.department_id = :authenticated_user_department_id
  ```
  Any attempt to query another department's tickets results in an immediate HTTP `403 Forbidden`.

---

## 4. Incident Intelligence & Clustering Architecture

```
New Grievance Received
          │
          ▼
Candidate Search Window (Rolling 48 Hours)
          │
          ├── Spatial Filter: Same Ward OR Lat/Lng Distance ≤ 1.5 km
          ├── Category Filter: Matching Department (e.g., WATER_SUPPLY)
          └── Semantic Similarity: Cosine similarity on issue summaries ≥ 0.82
          │
          ▼
Cluster Threshold Check:
≥ 3 Matching Grievances within 6 hours?
          ├── NO  ──► Treat as individual ticket
          └── YES ──► Generate Candidate Incident (e.g., "Sector 5 Water Outage")
                          │
                          ▼
            Alert Municipal Admin & Department Officer
                          │
                          ▼
            Human Confirmation Required (Explicit Click)
                          │
                          ▼
            Link complaints to Incident (No destructive merges)
```

---

## 5. Deployment Architecture

- **Frontend Hosting**: Vercel Edge Network for Next.js SSR and static asset delivery.
- **Backend Hosting**: Render Web Service running containerized FastAPI / Uvicorn.
- **Database Hosting**: Managed PostgreSQL on Supabase with pgbouncer connection pooling.
- **CI/CD Pipeline**: GitHub Actions running automated linting, Pytest test suites, and Playwright verification on every pull request to `main`.
