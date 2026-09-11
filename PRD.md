# JanSetu AI — Product Requirements Document (PRD)

## 1. Executive Summary & Vision

- **Product Name**: JanSetu AI
- **Tagline**: *From Citizen Voice to Government Action*
- **Problem Statement**: PS02 — AI-Powered Citizen Complaint Understanding & Resolution Assistant
- **Geographic Context**: Pune Municipal Corporation (PMC), Maharashtra, India
- **Core Positioning**: An AI-powered civic grievance intelligence and operational resolution-assistance platform.

### Product Vision
Citizens frequently face friction when reporting civic grievances: portals require complex categorization, ward selection, and technical terminology, leading to high drop-offs, misrouted complaints, and delayed resolutions. Conversely, government departments are overwhelmed by unstructured, incomplete, and emotionally charged submissions.

JanSetu AI bridges this divide. It allows citizens to voice problems naturally in their preferred language (English, Hindi, Marathi, Hinglish) via text or voice, converts unstructured input into validated, structured, prioritized, and routed service tickets, and empowers municipal officers with AI-assisted action recommendations, deterministic SLA tracking, and city-wide incident intelligence.

> **Foundational Axiom**:  
> *AI decides what the complaint means. Rules decide what the system is allowed to do. Humans decide consequential operational actions.*

---

## 2. Problem Statement (PS02 Analysis)

### Current Civic Grievance Failures
1. **Unstructured & Free-Form Input**: Citizens report messy, emotional, or fragmented complaints (e.g., *"No water for 3 days in our society, nobody cares!"*).
2. **Missing Actionable Entities**: Essential details—such as precise landmarks, duration, or pole numbers—are frequently omitted.
3. **Misrouting & Department Silos**: Citizens struggle to select the correct department from dozens of bureaucratic categories, creating routing bottlenecks.
4. **SLA Opacity**: Citizens lack real-time visibility into progress, and municipal leadership cannot reliably distinguish between routine delays and systemic infrastructure failures.
5. **Duplicate Inundation**: A single local disruption (e.g., a burst main pipe) generates dozens of individual tickets, overwhelming staff with redundant administrative load.

---

## 3. User Roles & Personas

JanSetu AI enforces **exactly four roles**. Super Admin has been permanently removed.

| Role | Target Persona | Primary Objectives | Key Capabilities |
| :--- | :--- | :--- | :--- |
| **CITIZEN** | Resident of Pune reporting a civic issue | Report problem easily, get updates, track progress to resolution | Text/voice submission, clarification answering, public tracking, progress timeline |
| **DEPARTMENT_OFFICER** | Ward/Department Engineer (e.g., Road, Water Supply) | Efficiently action assigned tickets within SLA deadlines | Review AI analysis, update ticket status, record action notes, escalate, resolve |
| **MUNICIPAL_ADMIN** | City Municipal Commissioner / Operations Director | City-wide operational oversight, workload balance, inter-department routing | Global ticket registry, 8-department drilldown, incident confirmation, re-routing, SLA monitoring |
| **COLLECTOR** | District Collector / Senior Municipal Leadership | Strategic oversight, systemic failure detection, emergency intervention | Critical P0/P1 monitoring, SLA breach intelligence, cross-department comparison, recurring failure heatmaps |

---

## 4. Controlled Department Taxonomy

JanSetu AI strictly limits operational routing to **eight departments** plus one controlled fallback. The AI model is strictly prohibited from inventing arbitrary departments.

1. **Water Supply Department** (`WATER_SUPPLY`)
2. **Electricity Department** (`ELECTRICITY`)
3. **Public Health Department** (`PUBLIC_HEALTH`)
4. **Waste Management Department** (`WASTE_MANAGEMENT`)
5. **Public Property Management Department** (`PUBLIC_PROPERTY_MANAGEMENT`)
6. **Garden Department** (`GARDEN`)
7. **Road Department** (`ROAD`)
8. **Encroachment Department** (`ENCROACHMENT`)
9. **Fallback / Review**: `OTHER_HUMAN_REVIEW`

---

## 5. Functional Requirements

### 5.1 Citizen Intake & AI Understanding
- **Multimodal Intake**: Citizens can submit grievances via natural language text, voice recording (transcribed via Web Audio / AI), and optional photographic evidence.
- **Multilingual Understanding**: Native support for English, Hindi, Marathi, and code-mixed formats (Hinglish, Marathi-English).
- **Automated Entity Extraction**: AI extracts issue summary, category, reported duration, location entities, landmarks, and sentiment.
- **Certainty Tagging**: Every extracted element is tagged as `KNOWN`, `INFERRED`, `MISSING`, `RECOMMENDED`, or `CONFIRMED`.
- **Truthfulness Guardrails**: Missing data remains strictly `null`; the system never fabricates coordinates, landmarks, or past government actions.

### 5.2 Category-Aware Clarification Loop
- **Missing Information Detection**: If a complaint lacks actionable data (e.g., location for a pothole, duration for water outage), the ticket enters `NEEDS_CLARIFICATION`.
- **Targeted Dialogue**: Generates a single, focused clarification question.
- **Safety Exemption**: Safety-critical P0 emergencies are immediately flagged without blocking for full location data.

### 5.3 Deterministic Priority & Routing Engine
- **Decoupled Attributes**: Priority (P0–P3), Severity (hazard level), Urgency (time sensitivity), and Sentiment (-1.0 to 1.0) are calculated independently. Citizen anger never dictates priority.
  - **P0 (Critical/Emergency)**: Immediate danger to life/safety (e.g., live wires, open manholes in traffic, severe flooding).
  - **P1 (High)**: Major public impact/service outage (e.g., multi-day water cutoff, sewage overflow).
  - **P2 (Medium)**: Important non-immediate issues (e.g., potholes, missed garbage collection).
  - **P3 (Low)**: Routine/cosmetic maintenance (e.g., tree pruning, street cleaning).

### 5.4 Deterministic SLA Engine
- **Standardized Demo SLA Matrix**:
  - **P0**: Immediate response (< 15 mins), emergency resolution (< 4 hrs).
  - **P1**: 2-hour response, 24-hour resolution.
  - **P2**: 8-hour response, 48-hour resolution.
  - **P3**: 24-hour response, 5-day resolution.
- **SLA State Tracking**: `WITHIN_SLA`, `AT_RISK` (>= 75% elapsed), `BREACHED`, `PAUSED` (awaiting citizen input), `RESOLVED`.

### 5.5 Unified Official Access & Role Routing
- Single official login entry (`/login`) accepting Employee ID/Official Email and Password.
- Zero role selectors or department buttons on the login UI.
- Post-authentication server-side routing:
  - `MUNICIPAL_ADMIN` $\rightarrow$ `/admin`
  - `DEPARTMENT_OFFICER` $\rightarrow$ `/department` (data scoped strictly to `user.department_id`)
  - `COLLECTOR` $\rightarrow$ `/collector`

### 5.6 Incident Intelligence & Duplicate Clustering
- Clusters complaints matching category, spatial proximity (same ward or $\le$ 1.5 km), and 48-hour time window.
- Suggests candidate incidents (e.g., *"Sector 5 Water Outage — 37 complaints linked"*).
- Consequential merges require explicit human confirmation with audit logging.

---

## 6. Non-Functional Requirements

| Category | Requirement | Target Metric |
| :--- | :--- | :--- |
| **Performance** | API Response Time for non-AI calls | $\le 200$ ms (p95) |
| **AI Latency** | Gemini structured analysis pipeline | $\le 2.5$ seconds |
| **Availability** | System Uptime during operational hours | 99.9% availability |
| **Security** | Server-side RBAC validation | 100% of internal endpoints verified; zero client trust |
| **Accessibility**| Citizen Web Portal | WCAG 2.1 AA compliant, responsive across all viewports |
| **Data Integrity**| Audit Trail Completeness | 100% of state transitions and human overrides logged |

---

## 7. Out of Scope (Non-Goals)

- **No Generic Conversational Chatbot**: JanSetu AI is an operational workflow assistant, not an open-domain chat assistant.
- **No Super Admin**: Administrative privileges are bounded within municipal operations.
- **No Microservices**: The system is strictly structured as a modular monolith.
- **No Direct LLM Database Mutations**: AI recommendations are mediated through deterministic validation code.
- **No Automated Ticket Deletion**: Complaints are soft-updated, linked, or archived with audit history.
