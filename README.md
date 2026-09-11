# JanSetu AI (जनसेतू AI)

> **Tagline**: From Citizen Voice to Government Action  
> **Problem Statement**: PS02 — AI-Powered Citizen Complaint Understanding & Resolution Assistant  
> **Context**: Pune Municipal Corporation (PMC), Maharashtra, India  
> **Architecture**: Modular Monolith (FastAPI + Next.js + PostgreSQL + Google Gemini API)

---

## 1. Overview

**JanSetu AI** is an AI-powered civic grievance intelligence and operational resolution platform. Unlike generic conversational chatbots, JanSetu AI functions as a robust public infrastructure layer. It transforms noisy, emotional, multilingual citizen voice and text grievances into structured, prioritized, and routed municipal tickets—while empowering government officers with AI-driven standard operating procedures (SOPs), deterministic SLA monitoring, and city-wide incident intelligence.

### Foundational Principle
> **"AI decides what the complaint means. Rules decide what the system is allowed to do. Humans decide consequential operational actions."**

---

## 2. Key Capabilities

- **Citizen-First Multimodal Intake**: Citizens report civic problems in their own words via text, voice recordings, or photos in English, Marathi (मराठी), Hindi (हिन्दी), or Hinglish.
- **Structured AI Extraction**: Gemini AI parses unstructured inputs into validated entities: issue, duration, location, category, sentiment, and certainty levels (`KNOWN`, `INFERRED`, `MISSING`, `RECOMMENDED`, `CONFIRMED`).
- **Targeted Clarification Loop**: When essential dispatch information is missing, the system initiates a focused dialogue with the citizen, pausing the SLA clock until clarified.
- **Safety-First Priority Engine**: Decouples citizen sentiment from operational priority. Imminent safety hazards (live electric wires, open manholes) trigger immediate **P0 Emergency** escalation without waiting for complete location data.
- **Strict Controlled Routing**: Grievances are routed exclusively to **eight PMC departments** (`WATER_SUPPLY`, `ELECTRICITY`, `PUBLIC_HEALTH`, `WASTE_MANAGEMENT`, `PUBLIC_PROPERTY_MANAGEMENT`, `GARDEN`, `ROAD`, `ENCROACHMENT`) or `OTHER_HUMAN_REVIEW`. The AI never fabricates departments.
- **Deterministic SLA Engine**: Enforces transparent response and resolution deadlines per priority tier with real-time `WITHIN_SLA`, `AT_RISK`, and `BREACHED` tracking.
- **Incident Intelligence**: Clusters related grievances (e.g., 37 complaints regarding a water supply outage in Sector 5) into single incident candidates for one-click officer confirmation.
- **Unified Official Access**: Exactly one official login at `/login` with zero role selectors. Role routing (`/admin`, `/department`, `/collector`) and department data isolation are enforced server-side.

---

## 3. User Roles & Access Architecture

JanSetu AI strictly enforces **four roles**. Super Admin is permanently removed.

```
Unified Official Access (/login)
              │
    Backend Authentication & RBAC
              │
    ┌─────────┴───────────────┬────────────────────────┐
    │                         │                        │
MUNICIPAL_ADMIN       DEPARTMENT_OFFICER           COLLECTOR
    │                         │                        │
/admin Command Center    /department Dashboard     /collector Executive
- Global 8-Dept View     - Scoped by dept_id       - P0/P1 Emergencies
- Workload Balancing     - AI SOP Actions          - SLA Breaches
- Department Rerouting   - Status & Notes          - Systemic Hotspots
```

---

## 4. Technology Stack

- **Frontend**: Next.js 15 (App Router), TypeScript, Tailwind CSS, shadcn/ui, Lucide React, Recharts, Leaflet / react-leaflet.
- **Backend**: FastAPI, Python 3.11+, Pydantic v2, SQLAlchemy 2.0 (async), Uvicorn.
- **AI Orchestration**: Google Gemini API (`gemini-1.5-flash` / `gemini-2.0-flash`) with structured output enforcement and prompt injection sandboxing.
- **Database**: PostgreSQL 15+ (Supabase compatible).
- **Testing**: Pytest (backend unit/integration) and Playwright (frontend E2E).

---

## 5. Repository Structure

```text
JanSetu-AI/
├── backend/
│   ├── app/
│   │   ├── api/v1/          # Versioned REST controllers
│   │   ├── ai/              # Gemini orchestrator & prompt sandboxing
│   │   ├── core/            # App configuration & JWT security
│   │   ├── db/              # Database engine & session management
│   │   ├── models/          # SQLAlchemy database models
│   │   ├── rules/           # Pure deterministic routing & SLA rules
│   │   ├── schemas/         # Pydantic data schemas & DTOs
│   │   ├── services/        # Domain business logic
│   │   └── main.py          # FastAPI application entry point
│   ├── tests/               # Pytest test suite
│   ├── requirements.txt     # Python backend dependencies
│   └── .env.example         # Backend environment template
│
├── frontend/
│   ├── app/
│   │   ├── (public)/        # Citizen portal, report, track, unified login
│   │   ├── admin/           # Municipal Admin command center
│   │   ├── department/      # Reusable Department Officer console
│   │   └── collector/       # Collector executive intelligence
│   ├── components/          # Reusable UI primitives & widgets
│   ├── lib/                 # Utility functions & API clients
│   ├── package.json         # Frontend dependencies & scripts
│   └── .env.example         # Frontend environment template
│
├── .env.example             # Root environment template
├── .gitignore               # Git exclusion rules
├── PRD.md                   # Product Requirements Document
├── DESIGN.md                # Design System & UI Specification
├── APP_FLOW.md              # User Journeys & Sequence Diagrams
├── ARCHITECTURE.md          # Architecture & Security Blueprint
├── TECH_SPEC.md             # Technical Stack & Coding Standards
├── SCHEMA.md                # Database Schema & DDL Specification
├── API_SPEC.md              # REST API Specification (OpenAPI)
├── AI_SPEC.md               # Gemini AI Pipeline & Safety Guards
├── IMPLEMENTATION_PLAN.md   # 13-Phase Technical Roadmap
├── DECISIONS.md             # Architectural Decision Records (ADRs)
└── TRACKER.md               # Development Progress Checklist
```

---

## 6. Getting Started Locally

### 6.1 Prerequisites
- Node.js `v20+` or `v24+` and npm
- Python `3.11+` or `3.14+`
- Git

### 6.2 Backend Setup
```bash
# Navigate to backend directory
cd backend

# Create and activate a Python virtual environment
python -m venv .venv
# On Windows PowerShell:
.venv\Scripts\Activate.ps1
# On macOS/Linux:
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env

# Run FastAPI development server
uvicorn app.main:app --reload --port 8000
```
API documentation will be available at `http://localhost:8000/docs`.  
Health check endpoint: `http://localhost:8000/api/v1/health`.

### 6.3 Frontend Setup
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Configure environment
cp .env.example .env.local

# Run Next.js development server
npm run dev
```
Open `http://localhost:3000` in your browser.

---

## 7. Golden Demo Workflow

1. **Citizen Voice**: Citizen submits: *"There has been no water supply in our area for three days and nobody is responding."*
2. **AI Understanding**: JanSetu extracts: Issue (*Water Supply Outage*), Duration (*3 days*), Location (*Missing*), Priority (*P1 High*), Department (*Water Supply*).
3. **Clarification Loop**: System prompts: *"Please provide your area, ward or landmark."* Citizen provides: *"Sector 5 near City Mall."*
4. **Controlled Routing**: Ticket is marked actionable, routed to Water Supply Department, and the deterministic SLA clock starts.
5. **Officer Review**: Department Officer reviews ticket at `/department`, inspects recommended SOPs, and takes action.
6. **Incident Intelligence**: System detects 37 matching water complaints in Sector 5, clustering them into a candidate incident for Collector and Admin oversight.
7. **Resolution & Update**: Officer records resolution notes; citizen views live verified timeline at `/track`.

---

## 8. Team & Hackathon Alignment

- **Project**: JanSetu AI
- **Track**: PS02 — Citizen Grievance Intelligence
- **Focus**: Transparent, accountable, and AI-accelerated civic governance.
